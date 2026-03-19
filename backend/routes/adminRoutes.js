const express = require("express");
const router = express.Router();
const {
  getPendingFacilities,
  approveFacility,
  rejectFacility,
  getAllDonors,
  getAllFacilities,
  getAllRequests,
} = require("../controllers/adminController");
const { auth, isAdmin } = require("../middleware/authMiddleware");

// All routes protected by auth + isAdmin
router.get("/pending-facilities", auth, isAdmin, getPendingFacilities);
router.put("/approve-facility/:id", auth, isAdmin, approveFacility);
router.put("/reject-facility/:id", auth, isAdmin, rejectFacility);
router.get("/donors", auth, isAdmin, getAllDonors);
router.get("/facilities", auth, isAdmin, getAllFacilities);
router.get("/requests", auth, isAdmin, getAllRequests);

module.exports = router;