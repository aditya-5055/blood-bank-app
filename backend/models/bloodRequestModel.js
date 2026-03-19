
const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: [true, "Hospital ID is required"],
    },
    bloodGroup: {
      type: String,
      required: [true, "Blood group is required"],
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    units: {
      type: Number,
      required: [true, "Units required"],
      min: [1, "Minimum 1 unit required"],
    },
    notes: {
      type: String,
      trim: true,
    },
    urgencyLevel: {
      type: String,
      enum: ["Critical", "High", "Moderate", "Normal"],
      required: [true, "Urgency level is required"],
    },
    deadline: {
      type: Date,
    },
    // ✅ Bank stage deadline — when banks stop being notified exclusively
    bankStageDeadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "confirmed", "completed", "expired", "cancelled"],
      default: "active",
    },
    stage: {
      type: String,
      enum: ["bloodbank", "donor", "both"], // ✅ Added "both"
      default: "bloodbank",
    },
    // ✅ Reason for expiry
    expiryReason: {
      type: String,
      trim: true,
    },
    stageUpdatedAt: {
      type: Date,
    },
    respondedBy: {
      responderType: {
        type: String,
        enum: ["bloodbank", "donor"],
      },
      responderId: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    declinedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor",
      },
    ],
    declinedByBloodBanks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Facility",
      },
    ],
    completedAt: {
      type: Date,
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
  },
  { timestamps: true }
);

bloodRequestSchema.pre("save", async function () {
  if (this.isNew) {
    const now = new Date();
    if (this.urgencyLevel === "Critical") {
      // ✅ Banks have 30 mins exclusively, total 2 hours
      this.bankStageDeadline = new Date(now.getTime() + 30 * 60 * 1000);
      this.deadline = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    } else if (this.urgencyLevel === "High") {
      // ✅ Banks have 1 hour exclusively, total 6 hours
      this.bankStageDeadline = new Date(now.getTime() + 60 * 60 * 1000);
      this.deadline = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    } else if (this.urgencyLevel === "Moderate") {
      // ✅ Banks have 2 hours exclusively, total 12 hours
      this.bankStageDeadline = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      this.deadline = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    } else if (this.urgencyLevel === "Normal") {
      // ✅ Banks have 4 hours exclusively, total 24 hours
      this.bankStageDeadline = new Date(now.getTime() + 4 * 60 * 60 * 1000);
      this.deadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }
});

bloodRequestSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);