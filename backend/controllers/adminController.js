const Facility = require("../models/facilityModel");
const Donor = require("../models/donorModel");
const BloodRequest = require("../models/bloodRequestModel");
const mailSender = require("../utils/mailSender");
const facilityApprovedTemplate = require("../mail/templates/facilityApprovedTemplate");
const facilityRejectedTemplate = require("../mail/templates/facilityRejectedTemplate");
// ─────────────────────────────────
// @route  GET /api/admin/pending-facilities
// @access Admin only
// ─────────────────────────────────
exports.getPendingFacilities = async (req, res) => {
  try {
    const pendingFacilities = await Facility.find({
      status: "pending",
    }).select("-password");

    return res.status(200).json({
      success: true,
      message: "Pending facilities fetched successfully",
      count: pendingFacilities.length,
      facilities: pendingFacilities,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending facilities",
      error: error.message,
    });
  }
};
// ─────────────────────────────────
// @route  PUT /api/admin/approve-facility/:id
// @access Admin only
// ─────────────────────────────────
exports.approveFacility = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);

    // 1️⃣ Check facility exists
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found",
      });
    }

    // 2️⃣ Check already approved
    if (facility.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Facility is already approved",
      });
    }

    // 3️⃣ Approve facility
    facility.status = "approved";
    facility.approvedBy = req.user.id;
    facility.approvedAt = new Date();
    await facility.save();

    // 4️⃣ Send approval email to facility
    try {
      await mailSender(
        facility.email,
        "Your account has been approved - Blood Donation System",
        facilityApprovedTemplate(facility.name, facility.facilityType)
      );
    } catch (emailError) {
      console.error("Approval email failed:", emailError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Facility approved successfully",
      facility: {
        id: facility._id,
        name: facility.name,
        email: facility.email,
        facilityType: facility.facilityType,
        status: facility.status,
        approvedAt: facility.approvedAt,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to approve facility",
      error: error.message,
    });
  }
};


// ─────────────────────────────────
// @route  PUT /api/admin/reject-facility/:id
// @access Admin only
// ─────────────────────────────────
exports.rejectFacility = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    // 1️⃣ Check rejection reason provided
    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Please provide rejection reason",
      });
    }

    // 2️⃣ Find facility
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found",
      });
    }

    // 3️⃣ Check already rejected
    if (facility.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Facility is already rejected",
      });
    }

    // 4️⃣ Reject facility
    facility.status = "rejected";
    facility.rejectionReason = rejectionReason;
    await facility.save();

    // 5️⃣ Send rejection email to facility
    try {
      await mailSender(
        facility.email,
        "Your account registration has been rejected - Blood Donation System",
        facilityRejectedTemplate(facility.name, facility.facilityType, rejectionReason)
      );
    } catch (emailError) {
      console.error("Rejection email failed:", emailError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Facility rejected successfully",
      facility: {
        id: facility._id,
        name: facility.name,
        email: facility.email,
        facilityType: facility.facilityType,
        status: facility.status,
        rejectionReason: facility.rejectionReason,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to reject facility",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  GET /api/admin/donors
// @access Admin only
// ─────────────────────────────────
exports.getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find().select("-password");

    return res.status(200).json({
      success: true,
      message: "Donors fetched successfully",
      count: donors.length,
      donors,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch donors",
      error: error.message,
    });
  }
};



// ─────────────────────────────────
// @route  GET /api/admin/facilities
// @access Admin only
// ─────────────────────────────────
exports.getAllFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find({
      status: "approved",
    }).select("-password");

    return res.status(200).json({
      success: true,
      message: "Facilities fetched successfully",
      count: facilities.length,
      facilities,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch facilities",
      error: error.message,
    });
  }
};



// ─────────────────────────────────
// @route  GET /api/admin/requests
// @access Admin only
// ─────────────────────────────────
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find()
      .populate("hospitalId", "name email phone address")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Requests fetched successfully",
      count: requests.length,
      requests,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
      error: error.message,
    });
  }
};