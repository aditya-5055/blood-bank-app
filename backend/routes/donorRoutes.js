const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  toggleAvailability,
  getDonationHistory,
  getNearbyBloodBanks,
  getNearbyCamps,
  proactiveDonate,
  registerForCamp,
  getMyDonationRequests,
  getNearbyBloodRequests,
  acceptBloodRequest,
   getMyCampRegistrations,
  declineBloodRequest,
} = require("../controllers/donorController");
const { auth, isDonor } = require("../middleware/authMiddleware");

// Profile routes
router.get("/profile", auth, isDonor, getProfile);
router.put("/update-profile", auth, isDonor, updateProfile);
router.put("/toggle-availability", auth, isDonor, toggleAvailability);

// Donation history
router.get("/donation-history", auth, isDonor, getDonationHistory);

// Nearby routes
router.get("/nearby-bloodbanks", auth, isDonor, getNearbyBloodBanks);
router.get("/nearby-camps", auth, isDonor, getNearbyCamps);
router.get("/nearby-requests", auth, isDonor, getNearbyBloodRequests);

// Proactive donation routes
router.post("/proactive-donate", auth, isDonor, proactiveDonate);
router.get("/my-donation-requests", auth, isDonor, getMyDonationRequests);

// Camp routes
router.post("/register-camp/:id", auth, isDonor, registerForCamp);

// Blood request routes
router.put("/accept-request/:id", auth, isDonor, acceptBloodRequest);
router.put("/decline-request/:id", auth, isDonor, declineBloodRequest);
router.get("/my-camps", auth, isDonor, getMyCampRegistrations);
module.exports = router;