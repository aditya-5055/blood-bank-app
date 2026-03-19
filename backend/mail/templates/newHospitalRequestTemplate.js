const newHospitalRequestTemplate = (bloodBankName, hospitalName, bloodGroup, units, urgencyLevel, deadline) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>New Blood Request</title>
    <style>
      body { background-color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.4; color: #333333; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
      .header { background-color: #e53e3e; padding: 20px; border-radius: 8px 8px 0 0; }
      .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
      .header p { color: #ffffff; margin: 5px 0 0 0; font-size: 13px; opacity: 0.9; }
      .body { padding: 30px 20px; text-align: left; }
      .body h2 { color: #e53e3e; font-size: 20px; }
      .body p { color: #666666; font-size: 15px; }
      .details-box { background-color: #fff5f5; border: 1px solid #e53e3e; border-radius: 8px; padding: 20px; margin: 20px 0; }
      .details-box p { margin: 8px 0; font-size: 15px; color: #333333; }
      .details-box span { font-weight: bold; color: #e53e3e; }
      .urgency-critical { background-color: #e53e3e; color: white; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; }
      .urgency-high { background-color: #dd6b20; color: white; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; }
      .urgency-moderate { background-color: #d69e2e; color: white; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; }
      .urgency-normal { background-color: #38a169; color: white; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; }
      .footer { background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; border-radius: 0 0 8px 8px; }
      .footer p { color: #999999; font-size: 12px; margin: 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🩸 Blood Donation System</h1>
        <p>New Blood Request</p>
      </div>
      <div class="body">
        <h2>New Blood Request from Hospital! 🏥</h2>
        <p>Dear <strong>${bloodBankName}</strong>,</p>
        <p>A nearby hospital has posted an urgent blood request. Please login and respond as soon as possible.</p>
        <div class="details-box">
          <p><span>Hospital:</span> ${hospitalName}</p>
          <p><span>Blood Group:</span> ${bloodGroup}</p>
          <p><span>Units Required:</span> ${units}</p>
          <p><span>Urgency:</span> <span class="urgency-${urgencyLevel.toLowerCase()}">${urgencyLevel}</span></p>
          <p><span>Respond Before:</span> ${new Date(deadline).toLocaleString()}</p>
        </div>
        <p>Please login to the Blood Donation System to accept or decline this request.</p>
      </div>
      <div class="footer">
        <p>© 2026 Blood Donation System. All rights reserved.</p>
        <p>This is an automated email, please do not reply.</p>
      </div>
    </div>
  </body>
  </html>`;
};

module.exports = newHospitalRequestTemplate;



// not use this 