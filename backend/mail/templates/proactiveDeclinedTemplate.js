const proactiveDeclinedTemplate = (donorName, bloodBankName, declineReason) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Donation Request Declined</title>
    <style>
      body { background-color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.4; color: #333333; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
      .header { background-color: #e53e3e; padding: 20px; border-radius: 8px 8px 0 0; }
      .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
      .header p { color: #ffffff; margin: 5px 0 0 0; font-size: 13px; opacity: 0.9; }
      .body { padding: 30px 20px; text-align: left; }
      .body h2 { color: #e53e3e; font-size: 20px; }
      .body p { color: #666666; font-size: 15px; }
      .reason-box { background-color: #fff5f5; border: 1px solid #e53e3e; border-radius: 8px; padding: 20px; margin: 20px 0; }
      .reason-box p { margin: 8px 0; font-size: 15px; color: #333333; }
      .reason-box span { font-weight: bold; color: #e53e3e; }
      .footer { background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; border-radius: 0 0 8px 8px; }
      .footer p { color: #999999; font-size: 12px; margin: 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🩸 Blood Donation System</h1>
        <p>Donation Request Update</p>
      </div>
      <div class="body">
        <h2>Donation Request Declined ❌</h2>
        <p>Dear <strong>${donorName}</strong>,</p>
        <p>Unfortunately, your donation request to <strong>${bloodBankName}</strong> has been declined.</p>
        <div class="reason-box">
          <p><span>Reason:</span> ${declineReason}</p>
        </div>
        <p>You can send a donation request to another nearby blood bank. Your willingness to donate is greatly appreciated!</p>
        <p>Thank you for your kindness! ❤️</p>
      </div>
      <div class="footer">
        <p>© 2026 Blood Donation System. All rights reserved.</p>
        <p>This is an automated email, please do not reply.</p>
      </div>
    </div>
  </body>
  </html>`;
};

module.exports = proactiveDeclinedTemplate;