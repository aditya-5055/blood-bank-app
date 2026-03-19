const campRegistrationTemplate = (donorName, campName, campDate, startTime, endTime, address, bloodBankName) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Camp Registration Confirmed</title>
    <style>
      body { background-color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.4; color: #333333; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
      .header { background-color: #3182ce; padding: 20px; border-radius: 8px 8px 0 0; }
      .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
      .header p { color: #ffffff; margin: 5px 0 0 0; font-size: 13px; opacity: 0.9; }
      .body { padding: 30px 20px; text-align: left; }
      .body h2 { color: #3182ce; font-size: 20px; }
      .body p { color: #666666; font-size: 15px; }
      .details-box { background-color: #ebf8ff; border: 1px solid #3182ce; border-radius: 8px; padding: 20px; margin: 20px 0; }
      .details-box p { margin: 8px 0; font-size: 15px; color: #333333; }
      .details-box span { font-weight: bold; color: #3182ce; }
      .footer { background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; border-radius: 0 0 8px 8px; }
      .footer p { color: #999999; font-size: 12px; margin: 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🩸 Blood Donation System</h1>
        <p>Camp Registration Confirmed</p>
      </div>
      <div class="body">
        <h2>You are registered for the camp! 🎉</h2>
        <p>Dear <strong>${donorName}</strong>,</p>
        <p>Your registration for the blood donation camp has been confirmed. Please find the details below:</p>
        <div class="details-box">
          <p><span>Camp Name:</span> ${campName}</p>
          <p><span>Organized By:</span> ${bloodBankName}</p>
          <p><span>Date:</span> ${new Date(campDate).toDateString()}</p>
          <p><span>Time:</span> ${startTime} - ${endTime}</p>
          <p><span>Address:</span> ${address.street}, ${address.city}, ${address.state} - ${address.pincode}</p>
        </div>
        <p>Please make sure to:</p>
        <ul>
          <li>Drink plenty of water before donating</li>
          <li>Eat a healthy meal before the camp</li>
          <li>Carry a valid ID proof</li>
          <li>Get a good night's sleep</li>
        </ul>
        <p>Thank you for saving lives! ❤️</p>
      </div>
      <div class="footer">
        <p>© 2026 Blood Donation System. All rights reserved.</p>
        <p>This is an automated email, please do not reply.</p>
      </div>
    </div>
  </body>
  </html>`;
};

module.exports = campRegistrationTemplate;