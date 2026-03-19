const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const facilitySchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, "Facility name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    // Contact Info
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    emergencyContact: {
      type: String,
      required: [true, "Emergency contact is required"],
    },

    // Address
    address: {
      city: { type: String, required: [true, "City is required"] },
      state: { type: String, required: [true, "State is required"] },
      pincode: { type: String, required: [true, "Pincode is required"] },
    },

    // Location for distance search
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    // Facility Details
    registrationNumber: {
      type: String,
      required: [true, "Registration number is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    facilityType: {
      type: String,
      enum: ["hospital", "blood-bank"],
      required: [true, "Facility type is required"],
    },
    role: {
      type: String,
      enum: ["hospital", "blood-bank"],
    },
    facilityCategory: {
      type: String,
      enum: ["Government", "Private", "Trust", "Charity", "Other"],
      default: "Private",
    },

    // Approval Info
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    approvedAt: { type: Date },
    rejectionReason: { type: String },

    // Operating Hours
    operatingHours: {
      open: { type: String, default: "09:00" },
      close: { type: String, default: "18:00" },
    },
    is24x7: { type: Boolean, default: false },

    // Account Info
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ✅ ONE combined pre save hook
// ✅ Correct for Mongoose 9.x
facilitySchema.pre("save", async function () {
  if (this.facilityType) {
    this.role = this.facilityType;
  }
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password.trim(), 12);
});

// Compare password
facilitySchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword.trim(), this.password);
};

// Index for geospatial queries
facilitySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Facility", facilitySchema);