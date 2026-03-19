const BloodRequest = require("../models/bloodRequestModel");
const Facility = require("../models/facilityModel");
const mailSender = require("../utils/mailSender");
const bloodRequestExpiredTemplate = require("../mail/templates/bloodRequestExpiredTemplate");

const updateBloodRequestStages = async () => {
  try {
    const now = new Date();

    // ─────────────────────────────────
    // 1️⃣ Expire requests past total deadline
    // ─────────────────────────────────
    const expiredRequests = await BloodRequest.find({
      status: "active",
      deadline: { $lt: now },
    });

    for (const request of expiredRequests) {
      request.status = "expired";
      request.expiryReason = "Request deadline passed — no one responded in time";
      await request.save();

      try {
        const hospital = await Facility.findById(request.hospitalId);
        if (hospital) {
          await mailSender(
            hospital.email,
            "Your blood request has expired - Blood Donation System",
            bloodRequestExpiredTemplate(
              hospital.name,
              request.bloodGroup,
              request.units,
              request.urgencyLevel
            )
          );
        }
      } catch (emailError) {
        console.error("Expired email failed:", emailError.message);
      }
    }

    // ─────────────────────────────────
    // 2️⃣ Move from "bloodbank" to "both" stage
    //    when bankStageDeadline passes
    //    AND units = 1
    // ─────────────────────────────────
    const bankDeadlineExpired = await BloodRequest.find({
      status: "active",
      stage: "bloodbank",
      units: 1,
      bankStageDeadline: { $lt: now },
    });

    for (const request of bankDeadlineExpired) {
      request.stage = "both";
      request.stageUpdatedAt = now;
      await request.save();
    }

    // ─────────────────────────────────
    // 3️⃣ Expire units > 1 requests
    //    when bankStageDeadline passes
    //    (donors cannot fulfill multi-unit)
    // ─────────────────────────────────
    const multiUnitExpired = await BloodRequest.find({
      status: "active",
      stage: "bloodbank",
      units: { $gt: 1 },
      bankStageDeadline: { $lt: now },
    });

    for (const request of multiUnitExpired) {
      request.status = "expired";
      request.expiryReason = "No blood bank responded — multi-unit requests cannot be fulfilled by donors";
      await request.save();

      try {
        const hospital = await Facility.findById(request.hospitalId);
        if (hospital) {
          await mailSender(
            hospital.email,
            "Your blood request has expired - Blood Donation System",
            bloodRequestExpiredTemplate(
              hospital.name,
              request.bloodGroup,
              request.units,
              request.urgencyLevel
            )
          );
        }
      } catch (emailError) {
        console.error("Expired email failed:", emailError.message);
      }
    }

    // ─────────────────────────────────
    // 4️⃣ Check if ALL nearby banks declined
    //    for "bloodbank" stage requests
    //    → move to "both" immediately
    // ─────────────────────────────────
    const activeBankStageRequests = await BloodRequest.find({
      status: "active",
      stage: "bloodbank",
      units: 1,
    });

    for (const request of activeBankStageRequests) {
      const nearbyBanks = await Facility.find({
        facilityType: "blood-bank",
        status: "approved",
        isActive: true,
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: request.location.coordinates,
            },
            $maxDistance: 50000,
          },
        },
      });

      if (nearbyBanks.length === 0) {
        // No banks nearby → move to both immediately
        request.stage = "both";
        request.stageUpdatedAt = now;
        await request.save();
        continue;
      }

      const nearbyBankIds = nearbyBanks.map((b) => b._id.toString());
      const declinedIds = request.declinedByBloodBanks.map((id) => id.toString());
      const allDeclined = nearbyBankIds.every((id) => declinedIds.includes(id));

      if (allDeclined) {
        request.stage = "both";
        request.stageUpdatedAt = now;
        await request.save();
      }
    }

    // ─────────────────────────────────
    // 5️⃣ Check if ALL nearby banks AND donors declined
    //    → expire request immediately
    // ─────────────────────────────────
    const activeBothStageRequests = await BloodRequest.find({
      status: "active",
      stage: "both",
    });

    for (const request of activeBothStageRequests) {
      // Check all nearby banks declined
      const nearbyBanks = await Facility.find({
        facilityType: "blood-bank",
        status: "approved",
        isActive: true,
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: request.location.coordinates,
            },
            $maxDistance: 50000,
          },
        },
      });

      // Check all nearby donors declined
      const Donor = require("../models/donorModel");
      const nearbyDonors = await Donor.find({
        bloodGroup: request.bloodGroup,
        isAvailable: true,
        eligibleToDonate: true,
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: request.location.coordinates,
            },
            $maxDistance: 10000,
          },
        },
      });

      const allBanksDeclined = nearbyBanks.length === 0 ||
        nearbyBanks.every((b) =>
          request.declinedByBloodBanks.map((id) => id.toString()).includes(b._id.toString())
        );

      const allDonorsDeclined = nearbyDonors.length === 0 ||
        nearbyDonors.every((d) =>
          request.declinedBy.map((id) => id.toString()).includes(d._id.toString())
        );

      if (allBanksDeclined && allDonorsDeclined) {
        request.status = "expired";
        request.expiryReason = "All nearby blood banks and donors declined this request";
        await request.save();

        try {
          const hospital = await Facility.findById(request.hospitalId);
          if (hospital) {
            await mailSender(
              hospital.email,
              "Your blood request has expired - Blood Donation System",
              bloodRequestExpiredTemplate(
                hospital.name,
                request.bloodGroup,
                request.units,
                request.urgencyLevel
              )
            );
          }
        } catch (emailError) {
          console.error("Expired email failed:", emailError.message);
        }
      }
    }

  } catch (error) {
    console.error("bloodRequestUpdater error:", error.message);
  }
};

module.exports = updateBloodRequestStages;