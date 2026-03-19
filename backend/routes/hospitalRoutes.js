const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  postBloodRequest,
  getMyRequests,
  cancelRequest,
  getRequestStatus,
  completeBloodRequest,
} = require("../controllers/hospitalController");
const { auth, isHospital } = require("../middleware/authMiddleware");

// Profile routes
router.get("/profile", auth, isHospital, getProfile);
router.put("/update-profile", auth, isHospital, updateProfile);

// Blood request routes
router.post("/blood-request", auth, isHospital, postBloodRequest);
router.get("/blood-requests", auth, isHospital, getMyRequests);
router.put("/blood-request/:id/cancel", auth, isHospital, cancelRequest);
router.get("/blood-request/:id/status", auth, isHospital, getRequestStatus);
router.put("/blood-request/:id/complete", auth, isHospital, completeBloodRequest);

module.exports = router;