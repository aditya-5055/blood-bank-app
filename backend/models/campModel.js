const mongoose = require("mongoose");

const campSchema = new mongoose.Schema(
  {
    bloodBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: [true, "Blood bank ID is required"],
    },
    name: {
      type: String,
      required: [true, "Camp name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    address: {
      street: { type: String, required: [true, "Street is required"] },
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
        type: [Number],
        default: [0, 0],
      },
    },
    campDate: {
      type: Date,
      required: [true, "Camp date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      // Format: "09:00"
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      // Format: "17:00"
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
    },
    registeredDonors: [
      {
        donorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Donor",
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
        // NEW FIELDS
        donationStatus: {
          type: String,
          enum: ["registered", "donated", "no-show"],
          default: "registered",
        },
        bloodGroup: {
          type: String,
          enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        },
        units: {
          type: Number,
          default: 1,
        },
      },
    ],
    actualDonors: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true },
);

campSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Camp", campSchema);
