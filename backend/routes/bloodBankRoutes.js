const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getInventory,
  updateInventory,
  getDonationRequests,
  processDonationRequest,
  completeDonation,
  markDonorAttendance,
  completeCamp,
  getIncomingBloodRequests,
  getAcceptedBloodRequests,
  respondToBloodRequest,
  completeBloodRequest,
  createCamp,
  getMyCamps,
  getCampRegisteredDonors,
  updateCampStatus,
  getTransactionHistory,
} = require("../controllers/bloodBankController");
const { auth, isBloodBank } = require("../middleware/authMiddleware");

// Profile routes
router.get("/profile", auth, isBloodBank, getProfile);
router.put("/update-profile", auth, isBloodBank, updateProfile);

// Inventory routes
router.get("/inventory", auth, isBloodBank, getInventory);
router.post("/inventory/update", auth, isBloodBank, updateInventory);

// Donation request routes
router.get("/donation-requests", auth, isBloodBank, getDonationRequests);
router.put("/donation-requests/:id", auth, isBloodBank, processDonationRequest);
router.put("/complete-donation/:id", auth, isBloodBank, completeDonation);

// ✅ Blood request routes — accepted MUST be before /:id routes
router.get("/blood-requests/accepted", auth, isBloodBank, getAcceptedBloodRequests);
router.get("/blood-requests", auth, isBloodBank, getIncomingBloodRequests);
router.put("/blood-requests/:id/respond", auth, isBloodBank, respondToBloodRequest);
router.put("/blood-requests/:id/complete", auth, isBloodBank, completeBloodRequest);

// Camp routes
router.post("/camp/create", auth, isBloodBank, createCamp);
router.get("/camps", auth, isBloodBank, getMyCamps);
router.get("/camp/:campId/donors", auth, isBloodBank, getCampRegisteredDonors);
router.put("/camp/:campId/attendance/:donorId", auth, isBloodBank, markDonorAttendance);
router.put("/camp/:campId/complete", auth, isBloodBank, completeCamp);
router.put("/camp/:campId/status", auth, isBloodBank, updateCampStatus);

// Transaction history
router.get("/transactions", auth, isBloodBank, getTransactionHistory);

module.exports = router;