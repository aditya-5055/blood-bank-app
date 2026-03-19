const mongoose = require("mongoose");

const transactionHistorySchema = new mongoose.Schema(
  {
    bloodBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["stock-in", "stock-out"],
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
      required: true,
    },
    units: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      enum: [
        "proactive",
        "camp",
        "walk-in",
        "manual",
        "hospital",
      ],
      required: true,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
    },
    campId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camp",
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
    },
    reason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "TransactionHistory",
  transactionHistorySchema
);