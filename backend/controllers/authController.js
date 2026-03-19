const jwt = require("jsonwebtoken");
const Donor = require("../models/donorModel");
const Facility = require("../models/facilityModel");
require("dotenv").config();
const Admin = require("../models/adminModel");
const mailSender = require("../utils/mailSender");
const newFacilityTemplate = require("../mail/templates/newFacilityTemplate");
const OTP = require("../models/otpModel");
const otpGenerator = require("otp-generator");
// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// ─────────────────────────────────
// @route  POST /api/auth/admin/login
// @access Public
// ─────────────────────────────────
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2️⃣ Find admin
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "User not registered",
      });
    }

    // 3️⃣ Check isActive
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // 4️⃣ Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // 5️⃣ Generate token
    const token = generateToken(admin._id, "admin");

    // 6️⃣ Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // 7️⃣ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
      error: error.message,
    });
  }
};



// ─────────────────────────────────
// @route  POST /api/auth/donor/register
// @access Public
// ─────────────────────────────────
exports.donorRegister = async (req, res) => {
  try {
    const {
      fullName, email, password, phone,
      bloodGroup, age, gender, weight, address, otp, location, 
    } = req.body;

    // 1️⃣ Validate input
    if (!fullName || !email || !password || !phone ||
        !bloodGroup || !age || !gender || !address || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required including OTP",
      });
    }

    // 2️⃣ Check if donor already exists
    const existingDonor = await Donor.findOne({ email });
    if (existingDonor) {
      return res.status(409).json({
        success: false,
        message: "Email already registered. Please login.",
      });
    }

    // 3️⃣ Get latest OTP
    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!otpRecord || otp !== otpRecord.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP. Please request a new OTP.",
      });
    }

    // 4️⃣ Create donor
    const donor = await Donor.create({
      fullName, email, password, phone,
      bloodGroup, age, gender, weight, address,
       location: location || { type: "Point", coordinates: [0, 0] },
    });

    // 5️⃣ Delete OTP after successful registration
    await OTP.deleteMany({ email });

    // 6️⃣ Generate token
    const token = generateToken(donor._id, "donor");

    // 7️⃣ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Donor registered successfully",
      token,
      donor: {
        id: donor._id,
        fullName: donor.fullName,
        email: donor.email,
        bloodGroup: donor.bloodGroup,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
      error: error.message,
    });
  }
};



// ─────────────────────────────────
// @route  POST /api/auth/donor/login
// @access Public
// ─────────────────────────────────
exports.donorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2️⃣ Find donor
    const donor = await Donor.findOne({ email }).select("+password");
    if (!donor) {
      return res.status(401).json({
        success: false,
        message: "User not registered. Please signup.",
      });
    }

    // 3️⃣ Check isActive
    if (!donor.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // 4️⃣ Check password
    const isPasswordValid = await donor.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // 5️⃣ Generate token
    const token = generateToken(donor._id, "donor");

    // 6️⃣ Update last login
    donor.lastLogin = new Date();
    await donor.save();

    // 7️⃣ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      donor: {
        id: donor._id,
        fullName: donor.fullName,
        email: donor.email,
        bloodGroup: donor.bloodGroup,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
      error: error.message,
    });
  }
};



// @route  POST /api/auth/facility/register
// @access Public
// ─────────────────────────────────
exports.facilityRegister = async (req, res) => {
  try {
    const {
      name, email, password, phone, emergencyContact,
      address, registrationNumber, facilityType,
      facilityCategory, otp, location,
    } = req.body;

    // 1️⃣ Validate input
    if (!name || !email || !password || !phone ||
        !emergencyContact || !address || !registrationNumber ||
        !facilityType || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required including OTP",
      });
    }

    // 2️⃣ Check if facility already exists
    const existingFacility = await Facility.findOne({
      $or: [{ email }, { registrationNumber }],
    });
    if (existingFacility) {
      return res.status(409).json({
        success: false,
        message: "Email or registration number already exists",
      });
    }

    // 3️⃣ Get latest OTP
    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!otpRecord || otp !== otpRecord.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP. Please request a new OTP.",
      });
    }

    // 4️⃣ Create facility
    const facility = await Facility.create({
      name, email, password, phone, emergencyContact,
      address, registrationNumber, facilityType, facilityCategory,
        location: location || { type: "Point", coordinates: [0, 0] },
    });

    // 5️⃣ Delete OTP after successful registration
    await OTP.deleteMany({ email });

    // 6️⃣ Notify admin about new facility registration
    try {
      const admins = await Admin.find({ isActive: true });
      for (const admin of admins) {
        await mailSender(
          admin.email,
          "New Facility Registration - Action Required",
          newFacilityTemplate(
            facility.name,
            facility.facilityType,
            facility.email,
            facility.registrationNumber
          )
        );
      }
    } catch (emailError) {
      // Email failure should NOT break registration
      console.error("Admin notification email failed:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Registration submitted successfully. Please wait for admin approval.",
      facility: {
        id: facility._id,
        name: facility.name,
        email: facility.email,
        facilityType: facility.facilityType,
        status: facility.status,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  POST /api/auth/facility/login
// @access Public
// ─────────────────────────────────
exports.facilityLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2️⃣ Find facility
    const facility = await Facility.findOne({ email }).select("+password");
    if (!facility) {
      return res.status(401).json({
        success: false,
        message: "User not registered. Please signup.",
      });
    }

    // 3️⃣ Check approval status
    if (facility.status === "pending") {
      return res.status(401).json({
        success: false,
        message: "Your account is pending admin approval.",
      });
    }

    if (facility.status === "rejected") {
      return res.status(401).json({
        success: false,
        message: "Your account has been rejected. Please contact admin.",
      });
    }

    // 4️⃣ Check isActive
    if (!facility.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // 5️⃣ Check password
    const isPasswordValid = await facility.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // 6️⃣ Generate token
    const token = generateToken(facility._id, facility.role);

    // 7️⃣ Update last login
    facility.lastLogin = new Date();
    await facility.save();

    // 8️⃣ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      facility: {
        id: facility._id,
        name: facility.name,
        email: facility.email,
        facilityType: facility.facilityType,
        role: facility.role,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
      error: error.message,
    });
  }
};




// ─────────────────────────────────
// @route  POST /api/auth/donor/send-otp
// @access Public
// ─────────────────────────────────
exports.sendDonorOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Check if donor already exists
    const existingDonor = await Donor.findOne({ email });
    if (existingDonor) {
      return res.status(409).json({
        success: false,
        message: "Email already registered. Please login.",
      });
    }

    // 2️⃣ Generate unique OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // 3️⃣ Make sure OTP is unique
    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    }

    // 4️⃣ Save OTP — email auto sent by pre-save hook
    await OTP.create({ email, otp });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please check your email.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP.",
      error: error.message,
    });
  }
};

// ─────────────────────────────────
// @route  POST /api/auth/facility/send-otp
// @access Public
// ─────────────────────────────────
exports.sendFacilityOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Check if facility already exists
    const existingFacility = await Facility.findOne({ email });
    if (existingFacility) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    // 2️⃣ Generate unique OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // 3️⃣ Make sure OTP is unique
    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    }

    // 4️⃣ Save OTP — email auto sent by pre-save hook
    await OTP.create({ email, otp });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please check your email.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP.",
      error: error.message,
    });
  }
};