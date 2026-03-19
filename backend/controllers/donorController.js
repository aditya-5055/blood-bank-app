const Donor = require("../models/donorModel");
const Facility = require("../models/facilityModel");
const ProactiveDonation = require("../models/proactiveDonationModel");
const BloodRequest = require("../models/bloodRequestModel");
const Camp = require("../models/campModel");
const updateCampStatuses = require("../utils/campStatusUpdater");
// ✅ FIX: Added missing import — was called but never imported, caused ReferenceError crash
const updateBloodRequestStages = require("../utils/bloodRequestUpdater");
const mailSender = require("../utils/mailSender");
const bloodRequestAcceptedTemplate = require("../mail/templates/bloodRequestAcceptedTemplate");
const campRegistrationTemplate = require("../mail/templates/campRegistrationTemplate");
const newProactiveDonorTemplate = require("../mail/templates/newProactiveDonorTemplate");
// ─────────────────────────────────
// @route  GET /api/donor/profile
// @access Donor only
// ─────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const donor = await Donor.findById(req.user.id).select("-password");

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      donor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  PUT /api/donor/update-profile
// @access Donor only
// ─────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    // ✅ Add location here
    const { fullName, phone, address, weight, location } = req.body;

    const donor = await Donor.findById(req.user.id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    if (fullName) donor.fullName = fullName;
    if (phone) donor.phone = phone;
    if (address) donor.address = address;
    if (weight) donor.weight = weight;
    if (location) donor.location = location; // ✅ Add this line

    await donor.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      donor: {
        id: donor._id,
        fullName: donor.fullName,
        phone: donor.phone,
        address: donor.address,
        weight: donor.weight,
        location: donor.location, // ✅ Add this line
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  PUT /api/donor/toggle-availability
// @access Donor only
// ─────────────────────────────────
exports.toggleAvailability = async (req, res) => {
  try {
    // 1️⃣ Find donor
    const donor = await Donor.findById(req.user.id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    // 2️⃣ Toggle availability
    donor.isAvailable = !donor.isAvailable;
    await donor.save();

    return res.status(200).json({
      success: true,
      message: donor.isAvailable
        ? "You are now available to donate"
        : "You are now unavailable to donate",
      isAvailable: donor.isAvailable,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to toggle availability",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  GET /api/donor/donation-history
// @access Donor only
// ─────────────────────────────────
exports.getDonationHistory = async (req, res) => {
  try {
    // 1️⃣ Find donor
    const donor = await Donor.findById(req.user.id).populate(
      "donationHistory.facility",
      "name address phone facilityType",
    );

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    // 2️⃣ Check next eligible donation date
    let nextEligibleDate = null;
    if (donor.lastDonationDate) {
      const last = new Date(donor.lastDonationDate);
      nextEligibleDate = new Date(last.getTime() + 90 * 24 * 60 * 60 * 1000);
    }

    return res.status(200).json({
      success: true,
      message: "Donation history fetched successfully",
      count: donor.donationHistory.length,
      nextEligibleDate,
      donationHistory: donor.donationHistory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch donation history",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  GET /api/donor/nearby-bloodbanks
// @access Donor only
// ─────────────────────────────────
exports.getNearbyBloodBanks = async (req, res) => {
  try {
    let { longitude, latitude } = req.query;

    // ✅ If no coordinates provided → use donor's saved location
    if (!longitude || !latitude) {
      const donor = await Donor.findById(req.user.id);
      if (donor?.location?.coordinates?.[0] !== 0) {
        longitude = donor.location.coordinates[0];
        latitude = donor.location.coordinates[1];
      } else {
        return res.status(400).json({
          success: false,
          message: "Location not set. Please update your location from profile.",
        });
      }
    }

    const bloodBanks = await Facility.find({
      facilityType: "blood-bank",
      status: "approved",
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 10000,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Nearby blood banks fetched successfully",
      count: bloodBanks.length,
      bloodBanks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch nearby blood banks",
      error: error.message,
    });
  }
};


// ─────────────────────────────────
// @route  GET /api/donor/nearby-camps
// @access Donor only
// ─────────────────────────────────

exports.getNearbyCamps = async (req, res) => {
  try {
    let { longitude, latitude } = req.query;

    // ✅ If no coordinates provided → use donor's saved location
    if (!longitude || !latitude) {
      const donor = await Donor.findById(req.user.id);
      if (donor?.location?.coordinates?.[0] !== 0) {
        longitude = donor.location.coordinates[0];
        latitude = donor.location.coordinates[1];
      } else {
        return res.status(400).json({
          success: false,
          message: "Location not set. Please update your location from profile.",
        });
      }
    }

    // ✅ Auto update camp statuses first
    await updateCampStatuses();

    // ✅ Find nearby upcoming and ongoing camps
    const camps = await Camp.find({
      status: { $in: ["upcoming", "ongoing"] },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 10000,
        },
      },
    }).populate("bloodBankId", "name phone address");

    // ✅ Add availableSeats and isRegistered
    const campsWithSeats = camps.map((camp) => {
      const campObj = camp.toObject();
      const availableSeats = camp.capacity - camp.registeredDonors.length;
      const isRegistered = camp.registeredDonors.some(
        (d) => d.donorId.toString() === req.user.id
      );
      delete campObj.registeredDonors;
      delete campObj.actualDonors;
      return { ...campObj, availableSeats, isRegistered };
    });

    return res.status(200).json({
      success: true,
      message: "Nearby camps fetched successfully",
      count: camps.length,
      camps: campsWithSeats,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch nearby camps",
      error: error.message,
    });
  }
};


exports.getMyCampRegistrations = async (req, res) => {
  try {

    // Auto update statuses
    await updateCampStatuses();

    // Find all camps
    const camps = await Camp.find({
      "registeredDonors.donorId": req.user.id,
    }).populate("bloodBankId", "name phone address");


    // Get donor specific details
    const myCamps = camps.map((camp) => {
      const myRegistration = camp.registeredDonors.find(
        (d) => d.donorId.toString() === req.user.id.toString()
      );

      if (!myRegistration) return null;

      return {
        campId: camp._id,
        name: camp.name,
        campDate: camp.campDate,
        startTime: camp.startTime,
        endTime: camp.endTime,
        address: camp.address,
        status: camp.status,
        bloodBank: camp.bloodBankId,
        myStatus: myRegistration.donationStatus,
        registeredAt: myRegistration.registeredAt,
      };
    }).filter(camp => camp !== null);

    return res.status(200).json({
      success: true,
      message: "Camp registrations fetched successfully",
      count: myCamps.length,
      camps: myCamps,
    });

  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch camp registrations",
      error: error.message,
    });
  }
};


// ─────────────────────────────────
// @route  POST /api/donor/proactive-donate
// @access Donor only
// ─────────────────────────────────
exports.proactiveDonate = async (req, res) => {
  try {
    const { bloodBankId, notes } = req.body;

    // 1️⃣ Validate input
    if (!bloodBankId) {
      return res.status(400).json({
        success: false,
        message: "Please select a blood bank",
      });
    }

    // 2️⃣ Find donor
    const donor = await Donor.findById(req.user.id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    // 3️⃣ Check 90 day rule
    if (donor.lastDonationDate) {
      const lastDonation = new Date(donor.lastDonationDate);
      const now = new Date();
      const diffDays = (now - lastDonation) / (1000 * 60 * 60 * 24);
      if (diffDays < 90) {
        return res.status(400).json({
          success: false,
          message: `You are not eligible to donate yet. You can donate after ${Math.ceil(90 - diffDays)} days`,
        });
      } else {
        // ✅ 90 days passed — auto reset eligibleToDonate
        donor.eligibleToDonate = true;
        await donor.save();
      }
    }

    // 4️⃣ Check eligibleToDonate
    if (!donor.eligibleToDonate) {
      return res.status(400).json({
        success: false,
        message: "You already have a confirmed donation request. Please complete it first.",
      });
    }

    // 5️⃣ Check blood bank exists and approved
    const bloodBank = await Facility.findById(bloodBankId);
    if (!bloodBank || bloodBank.facilityType !== "blood-bank") {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found",
      });
    }
    if (bloodBank.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Blood bank is not approved",
      });
    }

    // 6️⃣ Check donor not already sent request to THIS SAME blood bank
    const existingRequest = await ProactiveDonation.findOne({
      donorId: req.user.id,
      bloodBankId: bloodBankId,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: existingRequest.status === "confirmed"
          ? "You already have a confirmed request with this blood bank"
          : "You already sent a request to this blood bank",
      });
    }

    // 7️⃣ Create proactive donation request
    const donationRequest = await ProactiveDonation.create({
      donorId: req.user.id,
      bloodBankId,
      bloodGroup: donor.bloodGroup,
      notes,
      status: "pending",
    });

    // 8️⃣ Notify blood bank about new donation request
    try {
      await mailSender(
        bloodBank.email,
        "New Donation Request - Blood Donation System",
        newProactiveDonorTemplate(
          bloodBank.name,
          donor.fullName,
          donor.bloodGroup,
          donor.phone,
          donor.age,
          donor.weight
        )
      );
    } catch (emailError) {
      console.error("Blood bank notification email failed:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Donation request sent successfully. Please wait for blood bank confirmation.",
      donationRequest,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send donation request",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  POST /api/donor/register-camp/:id
// @access Donor only
// ─────────────────────────────────
exports.registerForCamp = async (req, res) => {
  try {
    // 1️⃣ Auto update camp statuses first
    await updateCampStatuses();

    // 2️⃣ Find donor
    const donor = await Donor.findById(req.user.id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    // 3️⃣ Check 90 day rule
    if (donor.lastDonationDate) {
      const lastDonation = new Date(donor.lastDonationDate);
      const now = new Date();
      const diffDays = (now - lastDonation) / (1000 * 60 * 60 * 24);
      if (diffDays < 90) {
        return res.status(400).json({
          success: false,
          message: `You are not eligible to donate yet. You can donate after ${Math.ceil(90 - diffDays)} days`,
        });
      } else {
        // ✅ 90 days passed — auto reset eligibleToDonate
        donor.eligibleToDonate = true;
        await donor.save();
      }
    }

    // 4️⃣ Check eligibleToDonate
    if (!donor.eligibleToDonate) {
      return res.status(400).json({
        success: false,
        message: "You are not eligible to donate yet. Please wait 90 days from last donation.",
      });
    }

    // 5️⃣ Check no confirmed proactive request
    const confirmedRequest = await ProactiveDonation.findOne({
      donorId: req.user.id,
      status: "confirmed",
    });
    if (confirmedRequest) {
      return res.status(400).json({
        success: false,
        message: "You have a confirmed donation request with a blood bank. Please complete it first.",
      });
    }

    // 6️⃣ Find camp
    const camp = await Camp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found",
      });
    }

    // 7️⃣ Check camp is upcoming or ongoing
    if (!["upcoming", "ongoing"].includes(camp.status)) {
      return res.status(400).json({
        success: false,
        message: "Camp is not accepting registrations",
      });
    }

    // 8️⃣ Check capacity
    const availableSeats = camp.capacity - camp.registeredDonors.length;
    if (availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        message: "Camp is full. No seats available.",
      });
    }

    // 9️⃣ Check already registered for THIS camp
    const alreadyRegistered = camp.registeredDonors.find(
      (d) => d.donorId.toString() === req.user.id
    );
    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this camp",
      });
    }

    // 🔟 Check donor not registered for another camp on SAME date
    const conflictingCamp = await Camp.findOne({
      status: { $in: ["upcoming", "ongoing"] },
      campDate: {
        $gte: new Date(new Date(camp.campDate).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(camp.campDate).setHours(23, 59, 59, 999)),
      },
      "registeredDonors.donorId": req.user.id,
      _id: { $ne: camp._id },
    });

    if (conflictingCamp) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for another camp on this date",
      });
    }

    // 1️⃣1️⃣ Register donor
    camp.registeredDonors.push({
      donorId: req.user.id,
      registeredAt: new Date(),
      donationStatus: "registered",
    });
    await camp.save();

    // 1️⃣2️⃣ Send camp registration email to donor
    try {
      const bloodBank = await Facility.findById(camp.bloodBankId);
      await mailSender(
        donor.email,
        "Camp Registration Confirmed - Blood Donation System",
        campRegistrationTemplate(
          donor.fullName,
          camp.name,
          camp.campDate,
          camp.startTime,
          camp.endTime,
          camp.address,
          bloodBank.name
        )
      );
    } catch (emailError) {
      console.error("Camp registration email failed:", emailError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Registered for camp successfully",
      camp: {
        id: camp._id,
        name: camp.name,
        campDate: camp.campDate,
        startTime: camp.startTime,
        endTime: camp.endTime,
        address: camp.address,
        availableSeats: availableSeats - 1,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to register for camp",
      error: error.message,
    });
  }
};



// ─────────────────────────────────
// @route  GET /api/donor/my-donation-requests
// @access Donor only
// ─────────────────────────────────
exports.getMyDonationRequests = async (req, res) => {
  try {
    const donationRequests = await ProactiveDonation.find({
      donorId: req.user.id,
    }).populate("bloodBankId", "name phone address operatingHours");

    return res.status(200).json({
      success: true,
      message: "Donation requests fetched successfully",
      count: donationRequests.length,
      donationRequests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch donation requests",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  GET /api/donor/nearby-requests
// @access Donor only
// ─────────────────────────────────
exports.getNearbyBloodRequests = async (req, res) => {
  try {
    await updateBloodRequestStages();

    let { longitude, latitude } = req.query;

    // 1️⃣ Find donor first
    const donor = await Donor.findById(req.user.id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    // 2️⃣ Check donor eligibility FIRST
    // ✅ Auto reset if 90 days passed
    if (donor.lastDonationDate) {
      const lastDonation = new Date(donor.lastDonationDate);
      const now = new Date();
      const diffDays = (now - lastDonation) / (1000 * 60 * 60 * 24);
      if (diffDays >= 90 && !donor.eligibleToDonate) {
        donor.eligibleToDonate = true;
        await donor.save();
      }
    }

    // 3️⃣ If not eligible → return empty
    if (!donor.eligibleToDonate) {
      return res.status(200).json({
        success: true,
        message: "You are not eligible to donate yet",
        count: 0,
        requests: [],
      });
    }

    // 4️⃣ If not available → return empty
    if (!donor.isAvailable) {
      return res.status(200).json({
        success: true,
        message: "You are marked as unavailable",
        count: 0,
        requests: [],
      });
    }

    // 5️⃣ Use saved location if no coords provided
    if (!longitude || !latitude) {
      if (donor?.location?.coordinates?.[0] !== 0) {
        longitude = donor.location.coordinates[0];
        latitude = donor.location.coordinates[1];
      } else {
        return res.status(400).json({
          success: false,
          message: "Location not set. Please update your location from profile.",
        });
      }
    }

    // 6️⃣ Donors only see "both" stage requests
    const requests = await BloodRequest.find({
      stage: "both",
      status: "active",
      bloodGroup: donor.bloodGroup,
      deadline: { $gt: new Date() },
      declinedBy: { $nin: [req.user.id] },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 10000,
        },
      },
    }).populate("hospitalId", "name address phone");

    return res.status(200).json({
      success: true,
      message: "Nearby blood requests fetched successfully",
      count: requests.length,
      requests,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch nearby requests",
      error: error.message,
    });
  }
};
// ─────────────────────────────────
// @route  PUT /api/donor/accept-request/:id
// @access Donor only
// ─────────────────────────────────
exports.acceptBloodRequest = async (req, res) => {
  try {
    // 1️⃣ Find request
    const request = await BloodRequest.findById(req.params.id).populate(
      "hospitalId",
      "name email phone address"
    );
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    // 2️⃣ Check request is still active
    if (request.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This request is already confirmed by someone else",
      });
    }

    // 3️⃣ Check deadline not passed
    if (new Date() > request.deadline) {
      return res.status(400).json({
        success: false,
        message: "This request has expired",
      });
    }

    // 4️⃣ Check stage is "both" — donors can only accept "both" stage
    if (request.stage !== "both") {
      return res.status(400).json({
        success: false,
        message: "This request is not available for donors yet",
      });
    }

    // 5️⃣ Find donor
    const donor = await Donor.findById(req.user.id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    // 6️⃣ Auto reset eligibility if 90 days passed
    if (donor.lastDonationDate) {
      const lastDonation = new Date(donor.lastDonationDate);
      const now = new Date();
      const diffDays = (now - lastDonation) / (1000 * 60 * 60 * 24);
      if (diffDays < 90) {
        return res.status(400).json({
          success: false,
          message: `You are not eligible to donate yet. You can donate after ${Math.ceil(90 - diffDays)} days`,
        });
      } else {
        // ✅ 90 days passed — auto reset
        donor.eligibleToDonate = true;
        await donor.save();
      }
    }

    // 7️⃣ Check eligibleToDonate
    if (!donor.eligibleToDonate) {
      return res.status(400).json({
        success: false,
        message: "You are not eligible to donate yet. Please wait 90 days from last donation.",
      });
    }

    // 8️⃣ Check availability
    if (!donor.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "You are marked as unavailable. Please update your availability from profile.",
      });
    }

    // 9️⃣ Check no confirmed proactive request
    const confirmedRequest = await ProactiveDonation.findOne({
      donorId: req.user.id,
      status: "confirmed",
    });
    if (confirmedRequest) {
      return res.status(400).json({
        success: false,
        message: "You have a confirmed donation request with a blood bank. Please complete it first.",
      });
    }

    // 🔟 Update request status
    request.status = "confirmed";
    request.respondedBy = {
      responderType: "donor",
      responderId: req.user.id,
    };
    await request.save();

    // 1️⃣1️⃣ Lock donor from any other donations
    donor.eligibleToDonate = false;
    await donor.save();

    // 1️⃣2️⃣ Notify hospital that donor accepted
    try {
      await mailSender(
        request.hospitalId.email,
        "A donor has accepted your blood request - Blood Donation System",
        bloodRequestAcceptedTemplate(
          request.hospitalId.name,
          donor.fullName,
          "donor",
          request.bloodGroup,
          request.units,
          donor.phone,
          null
        )
      );
    } catch (emailError) {
      console.error("Hospital notification email failed:", emailError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Blood request accepted. Please visit hospital as soon as possible.",
      request: {
        id: request._id,
        bloodGroup: request.bloodGroup,
        units: request.units,
        status: request.status,
        urgencyLevel: request.urgencyLevel,
        hospital: {
          name: request.hospitalId.name,
          phone: request.hospitalId.phone,
          address: request.hospitalId.address,
        },
      },
      donor: {
        name: donor.fullName,
        phone: donor.phone,
        bloodGroup: donor.bloodGroup,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to accept request",
      error: error.message,
    });
  }
};


exports.declineBloodRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    if (request.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This request is no longer active",
      });
    }

    // ✅ Add donor to declinedBy
    if (!request.declinedBy.includes(req.user.id)) {
      request.declinedBy.push(req.user.id);
    }
    await request.save();

    // ✅ Check if ALL nearby donors AND banks declined
    // → expire immediately
    await updateBloodRequestStages();

    return res.status(200).json({
      success: true,
      message: "Blood request declined",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to decline request",
      error: error.message,
    });
  }
};