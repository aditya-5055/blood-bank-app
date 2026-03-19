const Camp = require("../models/campModel");

const updateCampStatuses = async () => {
  const now = new Date();

  // Get current date string YYYY-MM-DD
  const currentDate = now.toISOString().split("T")[0];

  // Get current time string HH:MM
  const currentHours = now.getHours().toString().padStart(2, "0");
  const currentMinutes = now.getMinutes().toString().padStart(2, "0");
  const currentTime = `${currentHours}:${currentMinutes}`;

  // ─────────────────────────────────
  // upcoming → ongoing
  // When camp date is today AND
  // current time is between start and end
  // ─────────────────────────────────
  await Camp.updateMany(
    {
      status: "upcoming",
      campDate: {
        $gte: new Date(currentDate),
        $lt: new Date(
          new Date(currentDate).getTime() + 24 * 60 * 60 * 1000
        ),
      },
      startTime: { $lte: currentTime },
      endTime: { $gte: currentTime },
    },
    { status: "ongoing" }
  );

  // ─────────────────────────────────
  // upcoming → completed
  // Camp date already passed without
  // ever going ongoing
  // (missed camp — no one showed up)
  // ─────────────────────────────────
  const missedCamps = await Camp.find({
    status: "upcoming",
    campDate: {
      $lt: new Date(currentDate),
    },
  });

  for (const camp of missedCamps) {
    // Mark all registered donors as no-show
    camp.registeredDonors.forEach((donor) => {
      if (donor.donationStatus === "registered") {
        donor.donationStatus = "no-show";
      }
    });
    camp.status = "completed";
    await camp.save();
  }

  // ─────────────────────────────────
  // ongoing → completed
  // ONLY when camp end time has passed
  // AND blood bank has NOT manually
  // completed it yet
  // We do NOT auto complete ongoing camps
  // because blood bank needs to mark
  // attendance first manually
  // ─────────────────────────────────
  const expiredOngoingCamps = await Camp.find({
    status: "ongoing",
    $or: [
      // Camp date already passed
      {
        campDate: {
          $lt: new Date(currentDate),
        },
      },
      // Camp date today but end time passed
      {
        campDate: {
          $gte: new Date(currentDate),
          $lt: new Date(
            new Date(currentDate).getTime() + 24 * 60 * 60 * 1000
          ),
        },
        endTime: { $lt: currentTime },
      },
    ],
  });

  for (const camp of expiredOngoingCamps) {
    // ✅ Only mark as completed if blood bank
    // has NOT already processed it
    // Check if any donor is still "registered"
    // meaning blood bank never marked attendance
    const hasUnprocessedDonors = camp.registeredDonors.some(
      (donor) => donor.donationStatus === "registered"
    );

    if (hasUnprocessedDonors) {
      // Blood bank never completed manually
      // Mark all unprocessed as no-show
      camp.registeredDonors.forEach((donor) => {
        if (donor.donationStatus === "registered") {
          donor.donationStatus = "no-show";
        }
      });
    }

    // Mark camp as completed regardless
    camp.status = "completed";
    await camp.save();
  }
};

module.exports = updateCampStatuses;