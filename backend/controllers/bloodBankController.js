const Facility = require("../models/facilityModel");
const ProactiveDonation = require("../models/proactiveDonationModel");
const BloodRequest = require("../models/bloodRequestModel");
const BloodStock = require("../models/bloodStockModel");
const Camp = require("../models/campModel");
const Donor = require("../models/donorModel");
const updateCampStatuses = require("../utils/campStatusUpdater");
const TransactionHistory = require("../models/transactionHistoryModel");
const updateBloodRequestStages = require("../utils/bloodRequestUpdater");
const mailSender = require("../utils/mailSender");
const proactiveConfirmedTemplate = require("../mail/templates/proactiveConfirmedTemplate");
const proactiveDeclinedTemplate = require("../mail/templates/proactiveDeclinedTemplate");
const campRegistrationTemplate = require("../mail/templates/campRegistrationTemplate");
const donationCompletedTemplate = require("../mail/templates/donationCompletedTemplate");
const campCompletedTemplate = require("../mail/templates/campCompletedTemplate");
const newHospitalRequestTemplate = require("../mail/templates/newHospitalRequestTemplate");
const newProactiveDonorTemplate = require("../mail/templates/newProactiveDonorTemplate");
const bloodRequestAcceptedTemplate = require("../mail/templates/bloodRequestAcceptedTemplate");
// ─────────────────────────────────
// @route  GET /api/bloodbank/profile
// @access Blood Bank only
// ─────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const bloodBank = await Facility.findById(req.user.id);
    if (!bloodBank) {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      bloodBank,
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
// @route  PUT /api/bloodbank/update-profile
// @access Blood Bank only
// ─────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { phone, emergencyContact, address, operatingHours, is24x7,location } =
      req.body;

    // 1️⃣ Find blood bank
    const bloodBank = await Facility.findById(req.user.id);
    if (!bloodBank) {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found",
      });
    }

    // 2️⃣ Update only provided fields
    if (phone) bloodBank.phone = phone;
    if (emergencyContact) bloodBank.emergencyContact = emergencyContact;
    if (address) bloodBank.address = address;
    if (operatingHours) bloodBank.operatingHours = operatingHours;
    if (is24x7 !== undefined) bloodBank.is24x7 = is24x7;
 if (location) bloodBank.location = location;
    await bloodBank.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      bloodBank: {
        id: bloodBank._id,
        name: bloodBank.name,
        phone: bloodBank.phone,
        emergencyContact: bloodBank.emergencyContact,
        address: bloodBank.address,
        operatingHours: bloodBank.operatingHours,
        is24x7: bloodBank.is24x7,
        location: bloodBank.location, 
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
// @route  GET /api/bloodbank/inventory
// @access Blood Bank only
// ─────────────────────────────────
exports.getInventory = async (req, res) => {
  try {
    const now = new Date();

    // 1️⃣ Auto expire old batches first
    await BloodStock.updateMany(
      {
        bloodBankId: req.user.id,
        status: "available",
        expiryDate: { $lt: now },
      },
      { status: "expired" },
    );

    // 2️⃣ Get all available batches
    const stock = await BloodStock.find({
      bloodBankId: req.user.id,
      status: "available",
    })
      .populate("donorId", "fullName phone")
      .sort({ expiryDate: 1 }); // FEFO

    // 3️⃣ Calculate summary per blood group
    const summary = {
      "A+": 0,
      "A-": 0,
      "B+": 0,
      "B-": 0,
      "O+": 0,
      "O-": 0,
      "AB+": 0,
      "AB-": 0,
    };

    stock.forEach((batch) => {
      if (summary[batch.bloodGroup] !== undefined) {
        summary[batch.bloodGroup] += batch.units;
      }
    });
    // 4️⃣ Group batches by blood group
    // with days remaining calculation
    const details = {};
    const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

    bloodGroups.forEach((group) => {
      const batches = stock
        .filter((batch) => batch.bloodGroup === group)
        .map((batch) => {
          const daysRemaining = Math.ceil(
            (new Date(batch.expiryDate) - now) / (1000 * 60 * 60 * 24),
          );
          return {
            batchId: batch._id,
            units: batch.units,
            collectionDate: batch.collectionDate,
            expiryDate: batch.expiryDate,
            daysRemaining,
            // Color coding for frontend
            expiryStatus:
              daysRemaining <= 7
                ? "critical"
                : daysRemaining <= 15
                  ? "warning"
                  : "safe",
            donor: batch.donorId,
            source: batch.source,
          };
        });

      details[group] = {
        total: summary[group],
        // Low stock warning
        isLowStock: summary[group] < 5,
        batches,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Inventory fetched successfully",
      summary,
      details,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  GET /api/bloodbank/donation-requests
// @access Blood Bank only
// ─────────────────────────────────
exports.getDonationRequests = async (req, res) => {
  try {
    // ✅ Show both pending AND confirmed
    const requests = await ProactiveDonation.find({
      bloodBankId: req.user.id,
      status: { $in: ["pending", "confirmed"] },
    }).populate("donorId", "fullName phone bloodGroup age weight");

    return res.status(200).json({
      success: true,
      message: "Donation requests fetched successfully",
      count: requests.length,
      requests,
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
// @route  PUT /api/bloodbank/donation-requests/:id
// @access Blood Bank only
// ─────────────────────────────────
exports.processDonationRequest = async (req, res) => {
  try {
    const { action, declineReason } = req.body;

    // 1️⃣ Validate action
    if (!action || !["confirm", "decline"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be confirm or decline",
      });
    }

    // 2️⃣ Find donation request
    const donationRequest = await ProactiveDonation.findById(req.params.id);
    if (!donationRequest) {
      return res.status(404).json({
        success: false,
        message: "Donation request not found",
      });
    }

    // 3️⃣ Check request belongs to this blood bank
    if (donationRequest.bloodBankId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to process this request",
      });
    }

    // 4️⃣ Check request is still pending
    if (donationRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request already processed",
      });
    }

    if (action === "confirm") {
      // 5️⃣ Check donor not already confirmed by another blood bank
      const alreadyConfirmedProactive = await ProactiveDonation.findOne({
        donorId: donationRequest.donorId,
        status: "confirmed",
      });

      if (alreadyConfirmedProactive) {
        return res.status(400).json({
          success: false,
          message: "Donor already confirmed by another blood bank",
        });
      }

      // 6️⃣ Check donor already accepted a hospital blood request
      const alreadyAcceptedHospital = await BloodRequest.findOne({
        "respondedBy.responderId": donationRequest.donorId,
        "respondedBy.responderType": "donor",
        status: "confirmed",
      });

      if (alreadyAcceptedHospital) {
        return res.status(400).json({
          success: false,
          message: "Donor has already committed to a hospital blood request",
        });
      }

      // 7️⃣ Check eligibleToDonate flag
      const donor = await Donor.findById(donationRequest.donorId);
      if (!donor.eligibleToDonate) {
        return res.status(400).json({
          success: false,
          message: "Donor is not available for donation right now",
        });
      }

      // 8️⃣ Confirm this request
      donationRequest.status = "confirmed";
      await donationRequest.save();

      // ✅ 9️⃣ Auto decline ALL other pending requests for same donor
      await ProactiveDonation.updateMany(
        {
          donorId: donationRequest.donorId,
          _id: { $ne: donationRequest._id }, // exclude current confirmed
          status: "pending",
        },
        {
          status: "declined",
          declineReason: "Donor already confirmed by another blood bank",
        }
      );

      // 🔟 Lock donor from any other donations
      await Donor.findByIdAndUpdate(donationRequest.donorId, {
        eligibleToDonate: false,
      });

      // 1️⃣1️⃣ Send confirmation email to donor
      try {
        const bloodBank = await Facility.findById(req.user.id);
        await mailSender(
          donor.email,
          "Your donation request is confirmed - Blood Donation System",
          proactiveConfirmedTemplate(
            donor.fullName,
            bloodBank.name,
            bloodBank.phone,
            bloodBank.address
          )
        );
      } catch (emailError) {
        console.error("Confirmation email failed:", emailError.message);
      }

      return res.status(200).json({
        success: true,
        message: "Donation request confirmed. Donor will visit soon.",
        donationRequest,
      });

    } else if (action === "decline") {

      // 8️⃣ Decline reason required
      if (!declineReason) {
        return res.status(400).json({
          success: false,
          message: "Please provide decline reason",
        });
      }

      // 9️⃣ Decline request
      donationRequest.status = "declined";
      donationRequest.declineReason = declineReason;
      await donationRequest.save();

      // 🔟 Reset donor eligibility
      // only if no other confirmed request exists
      const anyConfirmed = await ProactiveDonation.findOne({
        donorId: donationRequest.donorId,
        status: "confirmed",
      });

      if (!anyConfirmed) {
        await Donor.findByIdAndUpdate(donationRequest.donorId, {
          eligibleToDonate: true,
        });
      }

      // 1️⃣1️⃣ Send decline email to donor
      try {
        const donor = await Donor.findById(donationRequest.donorId);
        const bloodBank = await Facility.findById(req.user.id);
        await mailSender(
          donor.email,
          "Your donation request has been declined - Blood Donation System",
          proactiveDeclinedTemplate(
            donor.fullName,
            bloodBank.name,
            declineReason
          )
        );
      } catch (emailError) {
        console.error("Decline email failed:", emailError.message);
      }

      return res.status(200).json({
        success: true,
        message: "Donation request declined",
        donationRequest,
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to process donation request",
      error: error.message,
    });
  }
};


exports.completeCamp = async (req, res) => {
  try {
    // 1️⃣ Auto update camp statuses first
    await updateCampStatuses();

    // 2️⃣ Find camp
    const camp = await Camp.findById(req.params.campId);
    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found",
      });
    }

    // 3️⃣ Check camp belongs to this blood bank
    if (camp.bloodBankId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to complete this camp",
      });
    }

    // 4️⃣ Check camp is ongoing
    if (camp.status !== "ongoing") {
      return res.status(400).json({
        success: false,
        message: "Camp must be ongoing to complete",
      });
    }

    let totalDonors = 0;
    let totalUnits = 0;

    // 5️⃣ Process each registered donor
    for (const registeredDonor of camp.registeredDonors) {
      if (registeredDonor.donationStatus === "donated") {

        // 6️⃣ Add blood to inventory
        await BloodStock.create({
          bloodBankId: req.user.id,
          donorId: registeredDonor.donorId,
          bloodGroup: registeredDonor.bloodGroup,
          units: 1,
          source: "camp",
          campId: camp._id,
          status: "available",
          expiryDate: new Date(
            new Date().getTime() + 42 * 24 * 60 * 60 * 1000
          ),
        });

        // 7️⃣ Create transaction history
        await TransactionHistory.create({
          bloodBankId: req.user.id,
          transactionType: "stock-in",
          bloodGroup: registeredDonor.bloodGroup,
          units: 1,
          source: "camp",
          donorId: registeredDonor.donorId,
          campId: camp._id,
        });

        // 8️⃣ Update donor profile
        const donor = await Donor.findById(registeredDonor.donorId);
        if (donor) {
          donor.lastDonationDate = new Date();
          donor.eligibleToDonate = false;
          donor.donationHistory.push({
            donationDate: new Date(),
            facility: req.user.id,
            donatedTo: "blood-bank",
            bloodGroup: registeredDonor.bloodGroup,
            units: 1,
          });
          await donor.save();

          // 9️⃣ Send donation completed email to donor
          try {
            await mailSender(
              donor.email,
              "Thank you for your donation at camp - Blood Donation System",
              donationCompletedTemplate(
                donor.fullName,
                camp.name,
                registeredDonor.bloodGroup,
                1,
                "blood-bank"
              )
            );
          } catch (emailError) {
            console.error("Camp donation email failed:", emailError.message);
          }
        }

        totalDonors++;
        totalUnits += 1;

      } else if (registeredDonor.donationStatus === "registered") {
        // 🔟 Mark remaining as no-show
        registeredDonor.donationStatus = "no-show";
      }
    }

    // 1️⃣1️⃣ Update camp status
    camp.status = "completed";
    camp.actualDonors = totalDonors;
    await camp.save();

    // 1️⃣2️⃣ Send camp summary email to blood bank
    try {
      const bloodBank = await Facility.findById(req.user.id);
      await mailSender(
        bloodBank.email,
        "Camp Completed Successfully - Blood Donation System",
        campCompletedTemplate(
          bloodBank.name,
          camp.name,
          camp.registeredDonors.length,
          totalDonors,
          camp.registeredDonors.length - totalDonors,
          totalUnits
        )
      );
    } catch (emailError) {
      console.error("Camp completed email failed:", emailError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Camp completed successfully",
      summary: {
        totalRegistered: camp.registeredDonors.length,
        totalDonated: totalDonors,
        totalNoShow: camp.registeredDonors.length - totalDonors,
        totalUnitsCollected: totalUnits,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to complete camp",
      error: error.message,
    });
  }
};


// ─────────────────────────────────
// @route  PUT /api/bloodbank/complete-donation/:id
// @access Blood Bank only
// ─────────────────────────────────
exports.completeDonation = async (req, res) => {
  try {
    const { units } = req.body;

    // 1️⃣ Find donation request
    const donationRequest = await ProactiveDonation.findById(req.params.id);
    if (!donationRequest) {
      return res.status(404).json({
        success: false,
        message: "Donation request not found",
      });
    }

    // 2️⃣ Check request belongs to this blood bank
    if (donationRequest.bloodBankId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to complete this request",
      });
    }

    // 3️⃣ Check request is confirmed
    if (donationRequest.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Request must be confirmed before completing",
      });
    }

    // 4️⃣ Validate units
    if (!units || units < 1) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid units donated",
      });
    }

    // 5️⃣ Add blood to inventory
    await BloodStock.create({
      bloodBankId: req.user.id,
      donorId: donationRequest.donorId,
      bloodGroup: donationRequest.bloodGroup,
      units,
      source: "proactive",
      status: "available",
      expiryDate: new Date(new Date().getTime() + 42 * 24 * 60 * 60 * 1000),
    });

    // 6️⃣ Create transaction history
    await TransactionHistory.create({
      bloodBankId: req.user.id,
      transactionType: "stock-in",
      bloodGroup: donationRequest.bloodGroup,
      units,
      source: "proactive",
      donorId: donationRequest.donorId,
    });

    // 7️⃣ Update donor lastDonationDate and donationHistory
    const donor = await Donor.findById(donationRequest.donorId);
    donor.lastDonationDate = new Date();
    // ✅ Keep false — donor must wait 90 days
    donor.eligibleToDonate = false;
    donor.donationHistory.push({
      donationDate: new Date(),
      facility: req.user.id,
      donatedTo: "blood-bank",
      bloodGroup: donationRequest.bloodGroup,
      units,
    });
    await donor.save();

    // 8️⃣ Mark donation request completed
    donationRequest.status = "completed";
    donationRequest.completedAt = new Date();
    await donationRequest.save();

    // ✅ 9️⃣ Send Thank You email to donor
    try {
      const bloodBank = await Facility.findById(req.user.id);
      await mailSender(
        donor.email,
        "Thank you for your donation - Blood Donation System",
        donationCompletedTemplate(
          donor.fullName,
          bloodBank.name,
          donationRequest.bloodGroup,
          units,
          "blood-bank"
        )
      );
    } catch (emailError) {
      console.error("Donation completed email failed:", emailError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Donation completed successfully. Blood added to inventory.",
      donationRequest,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to complete donation",
      error: error.message,
    });
  }
};
// ─────────────────────────────────
// @route  POST /api/bloodbank/inventory/update
// @access Blood Bank only
// ─────────────────────────────────
exports.updateInventory = async (req, res) => {
  try {
    const { bloodGroup, units, action, source, reason, donorPhone } = req.body;

    // 1️⃣ Validate required fields
    if (!bloodGroup || !units || !action) {
      return res.status(400).json({
        success: false,
        message: "Please provide bloodGroup, units and action",
      });
    }

    // 2️⃣ Validate action
    if (!["add", "remove"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be add or remove",
      });
    }

    // 3️⃣ Validate blood group
    const validBloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blood group",
      });
    }

    // 4️⃣ Reason required for remove
    if (action === "remove" && !reason) {
      return res.status(400).json({
        success: false,
        message: "Please provide reason for removal",
      });
    }

    if (action === "add") {
      // 5️⃣ Check if walk-in donor exists
      let donorId = null;
      if (donorPhone) {
        const donor = await Donor.findOne({ phone: donorPhone });

        if (donor && units > 1) {
          return res.status(400).json({
            success: false,
            message: "A single walk-in donor can only donate 1 unit at a time",
          });
        }

        if (donor) {
          donorId = donor._id;
          donor.lastDonationDate = new Date();
          donor.eligibleToDonate = false;
          donor.donationHistory.push({
            donationDate: new Date(),
            facility: req.user.id,
            donatedTo: "blood-bank",
            bloodGroup,
            units,
          });
          await donor.save();
        }
      }

      // 6️⃣ Add to inventory
      await BloodStock.create({
        bloodBankId: req.user.id,
        donorId,
        bloodGroup,
        units,
        source: source || "manual",
        status: "available",
      });

      // 7️⃣ Create transaction history
      await TransactionHistory.create({
        bloodBankId: req.user.id,
        transactionType: "stock-in",
        bloodGroup,
        units,
        source: source || "manual",
        donorId,
        reason: reason || "Manual stock addition",
      });

      return res.status(201).json({
        success: true,
        message: `${units} units of ${bloodGroup} added successfully`,
      });

    } else if (action === "remove") {
      // 8️⃣ Check enough stock available
      const availableStock = await BloodStock.find({
        bloodBankId: req.user.id,
        bloodGroup,
        status: "available",
      }).sort({ expiryDate: 1 }); // FEFO

      const totalAvailable = availableStock.reduce(
        (sum, batch) => sum + batch.units,
        0,
      );

      if (totalAvailable < units) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock. Available: ${totalAvailable} units`,
        });
      }

      // 9️⃣ Remove using FEFO
      // ✅ Use updateOne to bypass min unit validation
      let unitsToRemove = units;
      for (const batch of availableStock) {
        if (unitsToRemove <= 0) break;

        if (batch.units <= unitsToRemove) {
          unitsToRemove -= batch.units;
          // ✅ updateOne bypasses mongoose min validation
          await BloodStock.updateOne(
            { _id: batch._id },
            {
              status: "used",
              removalReason: reason,
            }
          );
        } else {
          batch.units -= unitsToRemove;
          batch.removalReason = reason;
          unitsToRemove = 0;
          await batch.save();
        }
      }

      // 🔟 Create transaction history
      await TransactionHistory.create({
        bloodBankId: req.user.id,
        transactionType: "stock-out",
        bloodGroup,
        units,
        source: "manual",
        reason,
      });

      return res.status(200).json({
        success: true,
        message: `${units} units of ${bloodGroup} removed successfully`,
        reason,
      });
    }
  } catch (error) {
    console.error("updateInventory error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update inventory",
      error: error.message,
    });
  }
};
// exports.updateInventory = async (req, res) => {
//   try {
//     const { bloodGroup, units, action, source, reason, donorPhone } = req.body;

//     // 1️⃣ Validate required fields
//     if (!bloodGroup || !units || !action) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide bloodGroup, units and action",
//       });
//     }

//     // 2️⃣ Validate action
//     if (!["add", "remove"].includes(action)) {
//       return res.status(400).json({
//         success: false,
//         message: "Action must be add or remove",
//       });
//     }

//     // 3️⃣ Validate blood group
//     const validBloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
//     if (!validBloodGroups.includes(bloodGroup)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid blood group",
//       });
//     }

//     // 4️⃣ Reason required for remove
//     if (action === "remove" && !reason) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide reason for removal",
//       });
//     }

//     if (action === "add") {
//       // 5️⃣ Check if walk-in donor exists in system
//       let donorId = null;
//       if (donorPhone) {
//         const donor = await Donor.findOne({ phone: donorPhone });

//         // ✅ Walk-in donor can only donate 1 unit at a time
//         if (donor && units > 1) {
//           return res.status(400).json({
//             success: false,
//             message: "A single walk-in donor can only donate 1 unit at a time",
//           });
//         }

//         if (donor) {
//           donorId = donor._id;
//           donor.lastDonationDate = new Date();
//           // ✅ Keep false — donor must wait 90 days
//           // Auto resets when donor tries to donate after 90 days
//           donor.eligibleToDonate = false;
//           donor.donationHistory.push({
//             donationDate: new Date(),
//             facility: req.user.id,
//             donatedTo: "blood-bank",
//             bloodGroup,
//             units,
//           });
//           await donor.save();
//         }
//       }

//       // 6️⃣ Add to inventory
//       await BloodStock.create({
//         bloodBankId: req.user.id,
//         donorId,
//         bloodGroup,
//         units,
//         source: source || "manual",
//         status: "available",
//       });

//       // 7️⃣ Create transaction history
//       await TransactionHistory.create({
//         bloodBankId: req.user.id,
//         transactionType: "stock-in",
//         bloodGroup,
//         units,
//         source: source || "manual",
//         donorId,
//         reason: reason || "Manual stock addition",
//       });

//       return res.status(201).json({
//         success: true,
//         message: `${units} units of ${bloodGroup} added successfully`,
//       });

//     } else if (action === "remove") {
//       // 8️⃣ Check enough stock available
//       const availableStock = await BloodStock.find({
//         bloodBankId: req.user.id,
//         bloodGroup,
//         status: "available",
//       }).sort({ expiryDate: 1 }); // FEFO

//       const totalAvailable = availableStock.reduce(
//         (sum, batch) => sum + batch.units,
//         0,
//       );

//       if (totalAvailable < units) {
//         return res.status(400).json({
//           success: false,
//           message: `Not enough stock. Available: ${totalAvailable} units`,
//         });
//       }

//       // 9️⃣ Remove using FEFO logic
//       let unitsToRemove = units;
//       for (const batch of availableStock) {
//         if (unitsToRemove <= 0) break;

//         if (batch.units <= unitsToRemove) {
//           unitsToRemove -= batch.units;
//           batch.status = "used";
//           batch.removalReason = reason;
//           await batch.save();
//         } else {
//           batch.units -= unitsToRemove;
//           batch.removalReason = reason;
//           unitsToRemove = 0;
//           await batch.save();
//         }
//       }

//       // 🔟 Create transaction history
//       await TransactionHistory.create({
//         bloodBankId: req.user.id,
//         transactionType: "stock-out",
//         bloodGroup,
//         units,
//         source: "manual",
//         reason,
//       });

//       return res.status(200).json({
//         success: true,
//         message: `${units} units of ${bloodGroup} removed successfully`,
//         reason,
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to update inventory",
//       error: error.message,
//     });
//   }
// };

// ─────────────────────────────────
// @route  PUT /api/bloodbank/camp/:campId/attendance/:donorId
// @access Blood Bank only
// ─────────────────────────────────
exports.markDonorAttendance = async (req, res) => {
  try {
    // 1️⃣ Auto update camp statuses first
    await updateCampStatuses();

    const { bloodGroup } = req.body;
    const units = 1; // Always 1 unit per donation

    // 2️⃣ Validate input
    if (!bloodGroup) {
      return res.status(400).json({
        success: false,
        message: "Please provide bloodGroup",
      });
    }

    // 3️⃣ Validate blood group
    const validBloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blood group",
      });
    }

    // 4️⃣ Find camp
    const camp = await Camp.findById(req.params.campId);
    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found",
      });
    }

    // 5️⃣ Check camp belongs to this blood bank
    if (camp.bloodBankId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to manage this camp",
      });
    }

    // 6️⃣ Check camp is ongoing
    if (camp.status !== "ongoing") {
      return res.status(400).json({
        success: false,
        message: "Camp must be ongoing to mark attendance",
      });
    }

    // 7️⃣ Find donor in registered list
    const donorIndex = camp.registeredDonors.findIndex(
      (d) => d.donorId.toString() === req.params.donorId,
    );
    if (donorIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Donor not registered for this camp",
      });
    }

    // 8️⃣ Check not already marked
    if (camp.registeredDonors[donorIndex].donationStatus === "donated") {
      return res.status(400).json({
        success: false,
        message: "Donor already marked as donated",
      });
    }

    // 9️⃣ Mark donor as donated
    camp.registeredDonors[donorIndex].donationStatus = "donated";
    camp.registeredDonors[donorIndex].bloodGroup = bloodGroup;
    camp.registeredDonors[donorIndex].units = units;
    await camp.save();

    return res.status(200).json({
      success: true,
      message: "Donor attendance marked successfully",
      donor: {
        donorId: req.params.donorId,
        donationStatus: "donated",
        bloodGroup,
        units,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  PUT /api/bloodbank/camp/:campId/complete
// @access Blood Bank only
// ─────────────────────────────────



// ─────────────────────────────────
// @route  GET /api/bloodbank/blood-requests
// @access Blood Bank only
// ─────────────────────────────────
exports.getIncomingBloodRequests = async (req, res) => {
  try {
    await updateBloodRequestStages();

    const bloodBank = await Facility.findById(req.user.id);
    if (!bloodBank) {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found",
      });
    }

    // ✅ Banks see both "bloodbank" AND "both" stage requests
    const requests = await BloodRequest.find({
      status: "active",
      stage: { $in: ["bloodbank", "both"] },
      deadline: { $gt: new Date() },
      declinedByBloodBanks: { $nin: [req.user.id] },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: bloodBank.location.coordinates,
          },
          $maxDistance: 50000,
        },
      },
    }).populate("hospitalId", "name phone address");

    const requestsWithStock = await Promise.all(
      requests.map(async (request) => {
        const availableStock = await BloodStock.find({
          bloodBankId: req.user.id,
          bloodGroup: request.bloodGroup,
          status: "available",
        });

        const totalAvailable = availableStock.reduce(
          (sum, batch) => sum + batch.units,
          0,
        );

        return {
          ...request.toObject(),
          availableStock: totalAvailable,
          canFulfill: totalAvailable >= request.units,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      message: "Incoming blood requests fetched successfully",
      count: requestsWithStock.length,
      requests: requestsWithStock,
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
// @route  PUT /api/bloodbank/blood-requests/:id/respond
// @access Blood Bank only
// ─────────────────────────────────
exports.respondToBloodRequest = async (req, res) => {
  try {
    const { action, declineReason } = req.body;

    if (!action || !["accept", "decline"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be accept or decline",
      });
    }

    const request = await BloodRequest.findById(req.params.id).populate(
      "hospitalId", "name email phone address",
    );
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    if (request.status !== "active") {
      return res.status(400).json({
        success: false,
        message: request.status === "confirmed"
          ? "This request is already fulfilled by another blood bank"
          : "This request is no longer active",
      });
    }

    if (new Date() > request.deadline) {
      return res.status(400).json({
        success: false,
        message: "This request has expired",
      });
    }

    // ✅ Banks can respond in both "bloodbank" and "both" stage
    if (!["bloodbank", "both"].includes(request.stage)) {
      return res.status(400).json({
        success: false,
        message: "This request is no longer available for blood banks",
      });
    }

    if (action === "decline") {
      if (!request.declinedByBloodBanks.includes(req.user.id)) {
        request.declinedByBloodBanks.push(req.user.id);
      }

      // ✅ Check if ALL nearby banks declined → move to "both" immediately
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

      if (nearbyBanks.length > 0 && request.units === 1) {
        const nearbyBankIds = nearbyBanks.map((b) => b._id.toString());
        const declinedIds = request.declinedByBloodBanks.map((id) => id.toString());
        const allDeclined = nearbyBankIds.every((id) => declinedIds.includes(id));

        if (allDeclined && request.stage === "bloodbank") {
          // ✅ All banks declined → open to donors immediately
          request.stage = "both";
          request.stageUpdatedAt = new Date();
        }
      }

      await request.save();

      return res.status(200).json({
        success: true,
        message: "Blood request declined",
      });
    }

    if (action === "accept") {
      const availableStock = await BloodStock.find({
        bloodBankId: req.user.id,
        bloodGroup: request.bloodGroup,
        status: "available",
      }).sort({ expiryDate: 1 });

      const totalAvailable = availableStock.reduce(
        (sum, batch) => sum + batch.units, 0,
      );

      if (totalAvailable < request.units) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock. Available: ${totalAvailable} units. Required: ${request.units} units`,
        });
      }

      // ✅ Deduct stock using FEFO with updateOne
      let unitsToDeduct = request.units;
      for (const batch of availableStock) {
        if (unitsToDeduct <= 0) break;
        if (batch.units <= unitsToDeduct) {
          unitsToDeduct -= batch.units;
          await BloodStock.updateOne(
            { _id: batch._id },
            { status: "used", removalReason: "Hospital blood request fulfilled" }
          );
        } else {
          batch.units -= unitsToDeduct;
          batch.removalReason = "Hospital blood request fulfilled";
          unitsToDeduct = 0;
          await batch.save();
        }
      }

      await TransactionHistory.create({
        bloodBankId: req.user.id,
        transactionType: "stock-out",
        bloodGroup: request.bloodGroup,
        units: request.units,
        source: "hospital",
        hospitalId: request.hospitalId?._id || request.hospitalId,
        requestId: request._id,
        reason: "Hospital blood request fulfilled",
      });

      request.status = "confirmed";
      request.respondedBy = {
        responderType: "bloodbank",
        responderId: req.user.id,
      };
      await request.save();

      try {
        const bloodBank = await Facility.findById(req.user.id);
        if (request.hospitalId?.email && bloodBank) {
          await mailSender(
            request.hospitalId.email,
            "Your blood request has been accepted - Blood Donation System",
            bloodRequestAcceptedTemplate(
              request.hospitalId.name,
              bloodBank.name,
              "bloodbank",
              request.bloodGroup,
              request.units,
              bloodBank.phone,
              bloodBank.address
            )
          );
        }
      } catch (emailError) {
        console.error("Hospital notification email failed:", emailError.message);
      }

      return res.status(200).json({
        success: true,
        message: "Blood request accepted. Blood packed and ready for dispatch.",
        request: {
          id: request._id,
          bloodGroup: request.bloodGroup,
          units: request.units,
          status: request.status,
          hospital: {
            name: request.hospitalId?.name,
            phone: request.hospitalId?.phone,
            address: request.hospitalId?.address,
          },
        },
      });
    }

  } catch (error) {
    console.error("respondToBloodRequest error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to respond to blood request",
      error: error.message,
    });
  }
};
// ─────────────────────────────────
// @route  PUT /api/bloodbank/blood-requests/:id/complete
// @access Blood Bank only
// ─────────────────────────────────
exports.completeBloodRequest = async (req, res) => {
  try {
    // 1️⃣ Find request
    const request = await BloodRequest.findById(req.params.id).populate(
      "hospitalId",
      "name email phone address",
    );
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    // 2️⃣ Check request belongs to this blood bank
    if (request.respondedBy.responderId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to complete this request",
      });
    }

    // 3️⃣ Check request is confirmed
    if (request.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Request must be confirmed before completing",
      });
    }

    // 4️⃣ Mark request as completed
    request.status = "completed";
    request.completedAt = new Date();
    await request.save();

    return res.status(200).json({
      success: true,
      message: "Blood request completed. Blood delivered to hospital.",
      request: {
        id: request._id,
        bloodGroup: request.bloodGroup,
        units: request.units,
        status: request.status,
        completedAt: request.completedAt,
        hospital: {
          name: request.hospitalId.name,
          phone: request.hospitalId.phone,
          address: request.hospitalId.address,
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

// ─────────────────────────────────
// @route  POST /api/bloodbank/camp/create
// @access Blood Bank only
// ─────────────────────────────────
exports.createCamp = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      location,
      campDate,
      startTime,
      endTime,
      capacity,
    } = req.body;

    // 1️⃣ Validate required fields
    if (
      !name ||
      !address ||
      !location ||
      !campDate ||
      !startTime ||
      !endTime ||
      !capacity
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // 2️⃣ Validate camp date
    // Cannot create camp in past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(campDate) < today) {
      return res.status(400).json({
        success: false,
        message: "Camp date cannot be in the past",
      });
    }

    // 3️⃣ Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({
        success: false,
        message: "Time must be in HH:MM format",
      });
    }

    // 4️⃣ Validate endTime after startTime
    if (endTime <= startTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    // 5️⃣ Create camp
    const camp = await Camp.create({
      bloodBankId: req.user.id,
      name,
      description,
      address,
      location,
      campDate,
      startTime,
      endTime,
      capacity,
      status: "upcoming",
    });

    return res.status(201).json({
      success: true,
      message: "Camp created successfully",
      camp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create camp",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  GET /api/bloodbank/camps
// @access Blood Bank only
// ─────────────────────────────────
exports.getMyCamps = async (req, res) => {
  try {
    const { status } = req.query;

    // 1️⃣ Auto update camp statuses first
    await updateCampStatuses();

    // 2️⃣ Build filter
    const filter = {
      bloodBankId: req.user.id,
    };

    // 3️⃣ Filter by status if provided
    if (status) {
      filter.status = status;
    }

    // 4️⃣ Get camps with available seats
    const camps = await Camp.find(filter).sort({ campDate: -1 });

    // 5️⃣ Add availableSeats to each camp
    const campsWithSeats = camps.map((camp) => ({
      ...camp.toObject(),
      availableSeats: camp.capacity - camp.registeredDonors.length,
    }));

    return res.status(200).json({
      success: true,
      message: "Camps fetched successfully",
      count: camps.length,
      camps: campsWithSeats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch camps",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  GET /api/bloodbank/camp/:campId/donors
// @access Blood Bank only
// ─────────────────────────────────
exports.getCampRegisteredDonors = async (req, res) => {
  try {
    // 1️⃣ Find camp
    const camp = await Camp.findById(req.params.campId).populate(
      "registeredDonors.donorId",
      "fullName phone bloodGroup age weight",
    );

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found",
      });
    }

    // 2️⃣ Check camp belongs to this blood bank
    if (camp.bloodBankId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this camp",
      });
    }

    // 3️⃣ Separate donors by status
    const registered = camp.registeredDonors.filter(
      (d) => d.donationStatus === "registered",
    );
    const donated = camp.registeredDonors.filter(
      (d) => d.donationStatus === "donated",
    );
    const noShow = camp.registeredDonors.filter(
      (d) => d.donationStatus === "no-show",
    );

    return res.status(200).json({
      success: true,
      message: "Camp donors fetched successfully",
      camp: {
        name: camp.name,
        status: camp.status,
        capacity: camp.capacity,
      },
      summary: {
        totalRegistered: camp.registeredDonors.length,
        donated: donated.length,
        pending: registered.length,
        noShow: noShow.length,
      },
      donors: {
        registered,
        donated,
        noShow,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch camp donors",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  PUT /api/bloodbank/camp/:campId/status
// @access Blood Bank only
// ─────────────────────────────────
exports.updateCampStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // 1️⃣ Only allow cancellation manually
    if (status !== "cancelled") {
      return res.status(400).json({
        success: false,
        message:
          "Only cancellation is allowed manually. Other statuses are automatic.",
      });
    }

    // 2️⃣ Find camp
    const camp = await Camp.findById(req.params.campId);
    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found",
      });
    }

    // 3️⃣ Check camp belongs to this blood bank
    if (camp.bloodBankId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this camp",
      });
    }

    // 4️⃣ Check camp not already completed
    if (camp.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel completed camp",
      });
    }

    // 5️⃣ Check camp not already cancelled
    if (camp.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Camp is already cancelled",
      });
    }

    // 6️⃣ Cancel camp
    camp.status = "cancelled";
    await camp.save();

    return res.status(200).json({
      success: true,
      message: "Camp cancelled successfully",
      camp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update camp status",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  GET /api/bloodbank/transactions
// @access Blood Bank only
// ─────────────────────────────────
exports.getTransactionHistory = async (req, res) => {
  try {
    const { type, bloodGroup, startDate, endDate } = req.query;

    // 1️⃣ Build filter
    const filter = {
      bloodBankId: req.user.id,
    };

    // 2️⃣ Filter by transaction type if provided
    if (type) {
      filter.transactionType = type;
    }

    // 3️⃣ Filter by blood group if provided
    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }

    // 4️⃣ Filter by date range if provided
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // 5️⃣ Get transactions
    const transactions = await TransactionHistory.find(filter)
      .populate("donorId", "fullName phone bloodGroup")
      .populate("hospitalId", "name phone address")
      .populate("campId", "name startDate address")
      .sort({ createdAt: -1 });

    // 6️⃣ Calculate summary
    const stockIn = transactions
      .filter((t) => t.transactionType === "stock-in")
      .reduce((sum, t) => sum + t.units, 0);

    const stockOut = transactions
      .filter((t) => t.transactionType === "stock-out")
      .reduce((sum, t) => sum + t.units, 0);

    return res.status(200).json({
      success: true,
      message: "Transaction history fetched successfully",
      summary: {
        totalStockIn: stockIn,
        totalStockOut: stockOut,
        netUnits: stockIn - stockOut,
      },
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transaction history",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  GET /api/bloodbank/blood-requests/accepted
// @access Blood Bank only
// ─────────────────────────────────
exports.getAcceptedBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      status: "confirmed",
      "respondedBy.responderType": "bloodbank",
      "respondedBy.responderId": req.user.id,
    }).populate("hospitalId", "name phone address");

    return res.status(200).json({
      success: true,
      message: "Accepted blood requests fetched successfully",
      count: requests.length,
      requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch accepted requests",
      error: error.message,
    });
  }
};