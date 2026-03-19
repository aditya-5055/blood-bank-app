const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/templates/otpTemplate");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 10, // Auto delete after 10 minutes
  },
});

// Send email when OTP is created
async function sendVerificationEmail(email, otp) {
  try {
    await mailSender(
      email,
      "Verify your email - Blood Donation System",
      otpTemplate(otp)
    );
  } catch (error) {
    throw error;
  }
}

otpSchema.pre("save", async function () {
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
});

module.exports = mongoose.model("OTP", otpSchema);