const bloodRequestAcceptedTemplate = (hospitalName, responderName, responderType, bloodGroup, units, responderPhone, responderAddress) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Blood Request Accepted</title>
    <style>
      body { background-color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.4; color: #333333; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
      .header { background-color: #38a169; padding: 20px; border-radius: 8px 8px 0 0; }
      .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
      .header p { color: #ffffff; margin: 5px 0 0 0; font-size: 13px; opacity: 0.9; }
      .body { padding: 30px 20px; text-align: left; }
      .body h2 { color: #38a169; font-size: 20px; }
      .body p { color: #666666; font-size: 15px; }
      .details-box { background-color: #f0fff4; border: 1px solid #38a169; border-radius: 8px; padding: 20px; margin: 20px 0; }
      .details-box p { margin: 8px 0; font-size: 15px; color: #333333; }
      .details-box span { font-weight: bold; color: #38a169; }
      .footer { background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; border-radius: 0 0 8px 8px; }
      .footer p { color: #999999; font-size: 12px; margin: 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🩸 Blood Donation System</h1>
        <p>Blood Request Accepted</p>
      </div>
      <div class="body">
        <h2>Your blood request has been accepted! ✅</h2>
        <p>Dear <strong>${hospitalName}</strong>,</p>
        <p>Great news! Your blood request has been accepted by a ${responderType === "bloodbank" ? "blood bank" : "donor"}.</p>
        <div class="details-box">
          <p><span>${responderType === "bloodbank" ? "Blood Bank" : "Donor"}:</span> ${responderName}</p>
          <p><span>Blood Group:</span> ${bloodGroup}</p>
          <p><span>Units:</span> ${units}</p>
          <p><span>Phone:</span> ${responderPhone}</p>
          ${responderType === "bloodbank" ? `<p><span>Address:</span> ${responderAddress.city}, ${responderAddress.state}</p>` : ""}
        </div>
        <p>${responderType === "bloodbank" 
          ? "The blood bank will prepare and dispatch the blood units to your hospital." 
          : "The donor will visit your hospital shortly. Please be ready to receive them."}</p>
      </div>
      <div class="footer">
        <p>© 2026 Blood Donation System. All rights reserved.</p>
        <p>This is an automated email, please do not reply.</p>
      </div>
    </div>
  </body>
  </html>`;
};

module.exports = bloodRequestAcceptedTemplate;