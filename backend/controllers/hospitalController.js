const Facility = require("../models/facilityModel");
const BloodRequest = require("../models/bloodRequestModel");
const Donor = require("../models/donorModel");
const BloodStock = require("../models/bloodStockModel");
const updateBloodRequestStages = require("../utils/bloodRequestUpdater");
const mailSender = require("../utils/mailSender");
const donationCompletedTemplate = require("../mail/templates/donationCompletedTemplate");
const newHospitalRequestTemplate = require("../mail/templates/newHospitalRequestTemplate");
const bloodRequestAcceptedTemplate = require("../mail/templates/bloodRequestAcceptedTemplate");
const bloodRequestExpiredTemplate = require("../mail/templates/bloodRequestExpiredTemplate");
// ─────────────────────────────────
// @route  GET /api/hospital/profile
// @access Hospital only
// ─────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const hospital = await Facility.findById(req.user.id);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      hospital,
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
// @route  PUT /api/hospital/update-profile
// @access Hospital only
// ─────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    // ✅ Add location here
    const { phone, emergencyContact, address, operatingHours, location } = req.body;

    const hospital = await Facility.findById(req.user.id);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    if (phone) hospital.phone = phone;
    if (emergencyContact) hospital.emergencyContact = emergencyContact;
    if (address) hospital.address = address;
    if (operatingHours) hospital.operatingHours = operatingHours;
    if (location) hospital.location = location; // ✅ Now works

    await hospital.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      hospital: {
        id: hospital._id,
        name: hospital.name,
        phone: hospital.phone,
        emergencyContact: hospital.emergencyContact,
        address: hospital.address,
        operatingHours: hospital.operatingHours,
        location: hospital.location,
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
// @route  GET /api/hospital/blood-requests
// @access Hospital only
// ─────────────────────────────────
exports.getMyRequests = async (req, res) => {
  try {
    await updateBloodRequestStages();
    const { status } = req.query;

    const filter = { hospitalId: req.user.id };
    if (status) filter.status = status;

    const requests = await BloodRequest.find(filter)
      .sort({ createdAt: -1 });

    // ✅ Manually fetch responder details
    const formattedRequests = await Promise.all(
      requests.map(async (request) => {
        const obj = request.toObject();

        let responderDetails = null;

        if (obj.respondedBy?.responderId) {
          try {
            if (obj.respondedBy.responderType === "bloodbank") {
              // ✅ Fetch from Facility model
              const Facility = require("../models/facilityModel");
              const facility = await Facility.findById(
                obj.respondedBy.responderId
              ).select("name phone address");
              if (facility) {
                responderDetails = {
                  responderType: "bloodbank",
                  responderId: {
                    _id: facility._id,
                    name: facility.name,
                    phone: facility.phone,
                    address: facility.address,
                  },
                };
              }
            } else if (obj.respondedBy.responderType === "donor") {
              // ✅ Fetch from Donor model
              const Donor = require("../models/donorModel");
              const donor = await Donor.findById(
                obj.respondedBy.responderId
              ).select("fullName phone bloodGroup");
              if (donor) {
                responderDetails = {
                  responderType: "donor",
                  responderId: {
                    _id: donor._id,
                    fullName: donor.fullName,
                    phone: donor.phone,
                    bloodGroup: donor.bloodGroup,
                  },
                };
              }
            }
          } catch (err) {
            console.error("Failed to fetch responder:", err.message);
          }
        }

        return {
          id: obj._id,
          bloodGroup: obj.bloodGroup,
          units: obj.units,
          urgencyLevel: obj.urgencyLevel,
          status: obj.status,
          stage: obj.stage,
          deadline: obj.deadline,
          notes: obj.notes,
          createdAt: obj.createdAt,
          completedAt: obj.completedAt,
          respondedBy: responderDetails,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Blood requests fetched successfully",
      count: formattedRequests.length,
      requests: formattedRequests,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blood requests",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  POST /api/hospital/blood-request
// @access Hospital only
// ✅ FIX: Removed duplicate definition of this function
// ─────────────────────────────────
exports.postBloodRequest = async (req, res) => {
  try {
    const { bloodGroup, units, urgencyLevel, notes } = req.body;

    // 1️⃣ Validate required fields
    if (!bloodGroup || !units || !urgencyLevel) {
      return res.status(400).json({
        success: false,
        message: "Please provide bloodGroup, units and urgencyLevel",
      });
    }

    // 2️⃣ Validate blood group
    const validBloodGroups = [
      "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-",
    ];
    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blood group",
      });
    }

    // 3️⃣ Validate urgency level
    const validUrgencyLevels = ["Critical", "High", "Moderate", "Normal"];
    if (!validUrgencyLevels.includes(urgencyLevel)) {
      return res.status(400).json({
        success: false,
        message: "urgencyLevel must be Critical, High, Moderate or Normal",
      });
    }

    // 4️⃣ Validate units
    if (units < 1) {
      return res.status(400).json({
        success: false,
        message: "Units must be at least 1",
      });
    }

    // 5️⃣ Find hospital and get location
    const hospital = await Facility.findById(req.user.id);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    // 6️⃣ Check hospital has location
    if (
      !hospital.location ||
      !hospital.location.coordinates ||
      hospital.location.coordinates[0] === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Hospital location not set. Please update profile first.",
      });
    }

    // 7️⃣ Create blood request
    // Deadline auto set by pre-save hook:
    // Critical → 2 hours
    // High → 6 hours
    // Moderate → 12 hours
    // Normal → 24 hours
    const bloodRequest = await BloodRequest.create({
      hospitalId: req.user.id,
      bloodGroup,
      units,
      urgencyLevel,
      notes,
      status: "active",
      stage: "bloodbank",
      location: hospital.location,
    });

    // 8️⃣ Notify nearby blood banks
    try {
      const nearbyBloodBanks = await Facility.find({
        facilityType: "blood-bank",
        status: "approved",
        isActive: true,
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: hospital.location.coordinates,
            },
            $maxDistance: 50000,
          },
        },
      });

      for (const bank of nearbyBloodBanks) {
        await mailSender(
          bank.email,
          "New Blood Request - Action Required - Blood Donation System",
          newHospitalRequestTemplate(
            bank.name,
            hospital.name,
            bloodRequest.bloodGroup,
            bloodRequest.units,
            bloodRequest.urgencyLevel,
            bloodRequest.deadline
          )
        );
      }
    } catch (emailError) {
      console.error("Blood bank notification email failed:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Blood request posted successfully. Nearby blood banks have been notified.",
      bloodRequest: {
        id: bloodRequest._id,
        bloodGroup: bloodRequest.bloodGroup,
        units: bloodRequest.units,
        urgencyLevel: bloodRequest.urgencyLevel,
        status: bloodRequest.status,
        stage: bloodRequest.stage,
        deadline: bloodRequest.deadline,
        notes: bloodRequest.notes,
        deadlineInfo: `Blood banks have until ${bloodRequest.deadline} to respond`,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to post blood request",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  PUT /api/hospital/blood-request/:id/cancel
// @access Hospital only
// ─────────────────────────────────
exports.cancelRequest = async (req, res) => {
  try {
    // 1️⃣ Find request
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    // 2️⃣ Check request belongs to this hospital
    if (request.hospitalId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this request",
      });
    }

    // 3️⃣ Check request can be cancelled — only active requests
    if (request.status !== "active") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel ${request.status} request`,
      });
    }

    // 4️⃣ Cancel request
    request.status = "cancelled";
    await request.save();

    return res.status(200).json({
      success: true,
      message: "Blood request cancelled successfully",
      request: {
        id: request._id,
        bloodGroup: request.bloodGroup,
        units: request.units,
        status: request.status,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to cancel request",
      error: error.message,
    });
  }
};


// ─────────────────────────────────
// @route  GET /api/hospital/blood-request/:id/status
// @access Hospital only
// ─────────────────────────────────
exports.getRequestStatus = async (req, res) => {
  try {
     await updateBloodRequestStages();
    // 1️⃣ Find request
    const request = await BloodRequest.findById(req.params.id)
      .populate("hospitalId", "name phone address")
      .populate("respondedBy.responderId");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    // 2️⃣ Check request belongs to this hospital
    if (request.hospitalId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this request",
      });
    }

    // 3️⃣ Build responder details
    let responderDetails = null;
    if (request.respondedBy && request.respondedBy.responderId) {
      if (request.respondedBy.responderType === "bloodbank") {
        responderDetails = {
          type: "bloodbank",
          name: request.respondedBy.responderId.name,
          phone: request.respondedBy.responderId.phone,
          address: request.respondedBy.responderId.address,
        };
      } else if (request.respondedBy.responderType === "donor") {
        responderDetails = {
          type: "donor",
          name: request.respondedBy.responderId.fullName,
          phone: request.respondedBy.responderId.phone,
          bloodGroup: request.respondedBy.responderId.bloodGroup,
        };
      }
    }

    // 4️⃣ Calculate time remaining
    const now = new Date();
    const timeRemaining = request.deadline - now;
    const hoursRemaining = Math.max(
      0,
      Math.floor(timeRemaining / (1000 * 60 * 60))
    );
    const minutesRemaining = Math.max(
      0,
      Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
    );

    return res.status(200).json({
      success: true,
      message: "Request status fetched successfully",
      request: {
        id: request._id,
        bloodGroup: request.bloodGroup,
        units: request.units,
        urgencyLevel: request.urgencyLevel,
        status: request.status,
        stage: request.stage,
        notes: request.notes,
        deadline: request.deadline,
        timeRemaining: request.status === "active"
          ? `${hoursRemaining}h ${minutesRemaining}m remaining`
          : null,
        currentStage: request.status === "active"
          ? request.stage === "bloodbank"
            ? "Searching nearby blood banks"
            : "Searching nearby donors"
          : null,
        responder: responderDetails,
        completedAt: request.completedAt,
        createdAt: request.createdAt,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch request status",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  PUT /api/hospital/blood-request/:id/complete
// @access Hospital only
// ─────────────────────────────────
exports.completeBloodRequest = async (req, res) => {
  try {
    const TransactionHistory = require("../models/transactionHistoryModel");
    const Donor = require("../models/donorModel");

    // 1️⃣ Find request
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    // 2️⃣ Check request belongs to this hospital
    if (request.hospitalId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to complete this request",
      });
    }

    // 3️⃣ Check request is confirmed
    if (request.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Only confirmed requests can be completed",
      });
    }

    // 4️⃣ Check responder is donor
    if (request.respondedBy.responderType !== "donor") {
      return res.status(400).json({
        success: false,
        message: "This request was fulfilled by a blood bank. Blood bank must mark it complete.",
      });
    }

    // 5️⃣ Find donor
    const donor = await Donor.findById(request.respondedBy.responderId);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    // 6️⃣ Update donor profile
    donor.lastDonationDate = new Date();
    donor.eligibleToDonate = false;
    donor.donationHistory.push({
      donationDate: new Date(),
      facility: req.user.id,
      donatedTo: "hospital",
      bloodGroup: donor.bloodGroup,
      units: request.units,
    });
    await donor.save();

    // 7️⃣ Mark request completed
    request.status = "completed";
    request.completedAt = new Date();
    await request.save();

    // 8️⃣ Send donation completed email to donor
    try {
      const hospital = await Facility.findById(req.user.id);
      await mailSender(
        donor.email,
        "Thank you for your donation - Blood Donation System",
        donationCompletedTemplate(
          donor.fullName,
          hospital.name,
          donor.bloodGroup,
          request.units,
          "hospital"
        )
      );
    } catch (emailError) {
      console.error("Donation completed email failed:", emailError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Blood request completed successfully. Donor donation recorded.",
      request: {
        id: request._id,
        bloodGroup: request.bloodGroup,
        units: request.units,
        status: request.status,
        completedAt: request.completedAt,
        donor: {
          name: donor.fullName,
          phone: donor.phone,
          bloodGroup: donor.bloodGroup,
        },
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to complete blood request",
      error: error.message,
    });
  }
};