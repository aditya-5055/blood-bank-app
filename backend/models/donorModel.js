const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const donorSchema = new mongoose.Schema(
  {
    // Basic Info
    fullName: {
      type: String,
      required: [true, "Full name is required"],
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
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },

    // Medical Info
    bloodGroup: {
      type: String,
      required: [true, "Blood group is required"],
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [18, "Must be at least 18 years old"],
      max: [65, "Age limit is 65 years"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
    },
    weight: {
      type: Number,
      min: [45, "Minimum weight should be 45kg"],
    },

    // Location
    address: {
      city: { type: String, required: [true, "City is required"] },
      state: { type: String, required: [true, "State is required"] },
      pincode: { type: String, required: [true, "Pincode is required"] },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },

    // Donation Info
    isAvailable: {
      type: Boolean,
      default: true,
    },
    lastDonationDate: {
      type: Date,
    },
    eligibleToDonate: {
      type: Boolean,
      default: true,
    },
    donationHistory: [
      {
        donationDate: { type: Date, default: Date.now },
        facility: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Facility",
        },
        donatedTo: {
          type: String,
          enum: ["blood-bank", "hospital"],
        },
        bloodGroup: {
          type: String,
          enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        },
        units: { type: Number, default: 1 },
      },
    ],

    // Account Info
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Hash password before saving
// ✅ Correct for Mongoose 9.x
donorSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password.trim(), 12);
});
// Compare password
donorSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword.trim(), this.password);
};

// Virtual — check 90 day eligibility automatically
donorSchema.virtual("isEligible").get(function () {
  if (!this.lastDonationDate) return true;
  const last = new Date(this.lastDonationDate);
  const now = new Date();
  const diff = (now - last) / (1000 * 60 * 60 * 24);
  return diff >= 90;
});

// Index for geospatial queries
donorSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Donor", donorSchema);
