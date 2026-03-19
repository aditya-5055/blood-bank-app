const newFacilityTemplate = (facilityName, facilityType, email, registrationNumber) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>New Facility Registration</title>
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
      .body {
        padding: 30px 20px;
        text-align: left;
      }
      .body h2 {
        color: #333333;
        font-size: 20px;
      }
      .body p {
        color: #666666;
        font-size: 15px;
      }
      .details-box {
        background-color: #fff5f5;
        border: 1px solid #e53e3e;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
      }
      .details-box p {
        margin: 8px 0;
        font-size: 15px;
        color: #333333;
      }
      .details-box span {
        font-weight: bold;
        color: #e53e3e;
      }
      .badge {
        display: inline-block;
        background-color: #e53e3e;
        color: #ffffff;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: bold;
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
        <p>Admin Notification</p>
      </div>

      <div class="body">
        <h2>New Facility Registration! 🏥</h2>
        <p>A new facility has registered and is waiting for your approval.</p>

        <div class="details-box">
          <p><span>Facility Name:</span> ${facilityName}</p>
          <p><span>Facility Type:</span> <span class="badge">${facilityType}</span></p>
          <p><span>Email:</span> ${email}</p>
          <p><span>Registration Number:</span> ${registrationNumber}</p>
        </div>

        <p>Please login to the admin panel to review and approve or reject this facility.</p>
      </div>

      <div class="footer">
        <p>© 2026 Blood Donation System. All rights reserved.</p>
        <p>This is an automated email, please do not reply.</p>
      </div>
    </div>
  </body>
  </html>`;
};

module.exports = newFacilityTemplate;