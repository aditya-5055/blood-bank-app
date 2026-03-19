const otpTemplate = (otp) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Blood Donation System OTP</title>
    <style>
      body {
        background-color: #ffffff;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.4;
        color: #333333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
      }
      .header {
        background-color: #e53e3e;
        padding: 20px;
        border-radius: 8px 8px 0 0;
      }
      .header h1 {
        color: #ffffff;
        margin: 0;
        font-size: 24px;
      }
      .header p {
        color: #ffffff;
        margin: 5px 0 0 0;
        font-size: 13px;
        opacity: 0.9;
      }
      .message {
        font-size: 18px;
        font-weight: bold;
        margin: 20px 0 10px 0;
      }
      .body {
        font-size: 16px;
        margin-bottom: 20px;
      }
      .highlight {
        font-weight: bold;
        font-size: 36px;
        color: #e53e3e;
        letter-spacing: 8px;
        margin: 20px 0;
      }
      .warning {
        font-size: 13px;
        color: #999999;
        margin-top: 10px;
      }
      .support {
        font-size: 14px;
        color: #999999;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🩸 Blood Donation System</h1>
        <p>Saving lives, one drop at a time</p>
      </div>

      <div class="message">OTP Verification</div>

      <div class="body">
        <p>Dear User,</p>
        <p>Thank you for registering with <strong>Blood Donation System</strong>.</p>
        <p>Please use the following OTP to verify your account:</p>

        <h2 class="highlight">${otp}</h2>

        <p>This OTP is valid for <strong>10 minutes</strong>.</p>

        <p class="warning">⚠️ Never share this OTP with anyone.</p>

        <p>If you did not request this verification, please ignore this email.</p>
      </div>

      <div class="support">
        Need help? Contact us at
        <a href="mailto:${process.env.MAIL_USER}">${process.env.MAIL_USER}</a>
      </div>
    </div>
  </body>
  </html>`;
};

module.exports = otpTemplate;