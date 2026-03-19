const mongoose = require("mongoose");

const bloodStockSchema = new mongoose.Schema(
  {
    bloodBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: [true, "Blood bank ID is required"],
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
    },
    bloodGroup: {
      type: String,
      required: [true, "Blood group is required"],
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    units: {
      type: Number,
      required: [true, "Units are required"],
      min: [1, "Minimum 1 unit required"],
    },
    collectionDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["available", "used", "expired"],
      default: "available",
    },
    source: {
      type: String,
      enum: ["proactive", "camp", "walk-in", "manual"],
      required: [true, "Source is required"],
    },
    campId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camp",
    },
    removalReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

bloodStockSchema.pre("save", async function () {
  if (this.isNew && !this.expiryDate) {
    const collection = new Date(this.collectionDate);
    this.expiryDate = new Date(
      collection.getTime() + 42 * 24 * 60 * 60 * 1000
    );
  }
});

bloodStockSchema.index({ bloodBankId: 1, bloodGroup: 1, expiryDate: 1 });

module.exports = mongoose.model("BloodStock", bloodStockSchema);