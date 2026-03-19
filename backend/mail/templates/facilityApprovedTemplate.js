const facilityApprovedTemplate = (facilityName, facilityType) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Account Approved</title>
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
        background-color: #38a169;
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
      .body {
        padding: 30px 20px;
        text-align: left;
      }
      .body h2 {
        color: #38a169;
        font-size: 20px;
      }
      .body p {
        color: #666666;
        font-size: 15px;
      }
      .success-box {
        background-color: #f0fff4;
        border: 1px solid #38a169;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
        text-align: center;
      }
      .success-box h2 {
        color: #38a169;
        font-size: 28px;
        margin: 0;
      }
      .success-box p {
        color: #666666;
        margin: 8px 0 0 0;
      }
      .footer {
        background-color: #f9f9f9;
        padding: 20px;
        text-align: center;
        border-top: 1px solid #eeeeee;
        border-radius: 0 0 8px 8px;
      }
      .footer p {
        color: #999999;
        font-size: 12px;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🩸 Blood Donation System</h1>
        <p>Account Approved</p>
      </div>

      <div class="body">
        <h2>Congratulations! Your account is approved! 🎉</h2>
        <p>Dear <strong>${facilityName}</strong>,</p>
        <p>We are pleased to inform you that your <strong>${facilityType}</strong> account has been approved by our admin team.</p>

        <div class="success-box">
          <h2>✅ Account Approved</h2>
          <p>You can now login and start using the Blood Donation System.</p>
        </div>

        <p>You can now:</p>
        <ul>
          ${facilityType === "blood-bank" ? `
          <li>Manage your blood inventory</li>
          <li>Accept donation requests from donors</li>
          <li>Respond to hospital blood requests</li>
          <li>Organize blood donation camps</li>
          ` : `
          <li>Post blood requests</li>
          <li>Track your blood request status</li>
          <li>View nearby blood banks</li>
          `}
        </ul>

        <p>If you have any questions, please contact our support team.</p>
      </div>

      <div class="footer">
        <p>© 2026 Blood Donation System. All rights reserved.</p>
        <p>This is an automated email, please do not reply.</p>
      </div>
    </div>
  </body>
  </html>`;
};

module.exports = facilityApprovedTemplate;