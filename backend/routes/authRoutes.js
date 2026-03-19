const express = require("express");
const router = express.Router();
const {
  adminLogin,
  donorRegister,
  donorLogin,
  facilityRegister,
  facilityLogin,
    sendDonorOTP, 
  sendFacilityOTP,   
} = require("../controllers/authController");

// Admin routes
router.post("/admin/login", adminLogin);

// Donor routes
router.post("/donor/register", donorRegister);
router.post("/donor/login", donorLogin);

// Facility routes
router.post("/facility/register", facilityRegister);
router.post("/facility/login", facilityLogin);

// OTP routes ✅ Make sure these exist
router.post("/donor/send-otp", sendDonorOTP);
router.post("/facility/send-otp", sendFacilityOTP);

module.exports = router;