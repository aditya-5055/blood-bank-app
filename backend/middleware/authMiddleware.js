const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Admin = require("../models/adminModel");
const Donor = require("../models/donorModel");
const Facility = require("../models/facilityModel");

dotenv.config();

exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token =
      req.cookies?.token ||
      req.body?.token ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating token",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const userDetails = await Admin.findById(req.user.id);
    if (!userDetails || userDetails.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can't be verified",
    });
  }
};

exports.isDonor = async (req, res, next) => {
  try {
    const userDetails = await Donor.findById(req.user.id);
    if (!userDetails || req.user.role !== "donor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Donors only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can't be verified",
    });
  }
};

exports.isHospital = async (req, res, next) => {
  try {
    const userDetails = await Facility.findById(req.user.id);
    if (!userDetails || req.user.role !== "hospital") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Hospitals only",
      });
    }
    if (userDetails.status !== "approved") {
      return res.status(401).json({
        success: false,
        message: "Your account is not approved yet",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can't be verified",
    });
  }
};

exports.isBloodBank = async (req, res, next) => {
  try {
    const userDetails = await Facility.findById(req.user.id);
    if (!userDetails || req.user.role !== "blood-bank") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Blood Banks only",
      });
    }
    if (userDetails.status !== "approved") {
      return res.status(401).json({
        success: false,
        message: "Your account is not approved yet",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can't be verified",
    });
  }
};