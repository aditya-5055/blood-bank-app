const mongoose = require("mongoose");

const proactiveDonationSchema = new mongoose.Schema(
  {
    // Who wants to donate
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: [true, "Donor ID is required"],
    },

    // Which blood bank selected
    bloodBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: [true, "Blood bank ID is required"],
    },

    // Blood group of donor
    bloodGroup: {
      type: String,
      required: [true, "Blood group is required"],
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },

    // Request Status
    status: {
      type: String,
       enum: ["pending", "confirmed", "declined", "completed"],
      default: "pending",
    },

    // Track which blood banks declined
    // So system does not send to same bank again
    declinedBanks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Facility",
      },
    ],

    // Any notes from donor
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProactiveDonation", proactiveDonationSchema);