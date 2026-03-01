import nodemailer from "nodemailer";

export const sendAdminWelcomeEmail = async (user) => {
  console.log("email service hit");
  const transporter = nodemailer.createTransport({
    service: "gmail", // for testing
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const propertiesHTML = user.propertiesWithUnits
    .map((property) => {
      const unitsHTML = property.units
        .map(
          (unit) =>
            `<li style="margin-bottom: 5px; color: #555;">${unit.unitLabel} — <strong style="color: #0d6efd;">${unit.unitCode}</strong></li>`
        )
        .join("");

      return `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #0d6efd; margin-bottom: 10px;">${property.propertyName}</h3>
        <ul style="padding-left: 20px;">${unitsHTML}</ul>
      </div>
    `;
    })
    .join("");

  const mailOptions = {
    from: `"UnitTrack" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Welcome to UnitTrack – Your Properties & Units",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0d6efd; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">UnitTrack</h1>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #333;">Welcome, ${user.name} 👋</h2>
          <p style="color: #666; line-height: 1.6;">Your admin account has been created successfully. We are excited to help you manage your properties with ease.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #0d6efd; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #333;"><strong>Plan:</strong> ${user.subscription.tier}</p>
          </div>

          <h3 style="color: #333; border-bottom: 2px solid #0d6efd; display: inline-block; padding-bottom: 5px;">Your Properties & Units</h3>
          ${propertiesHTML}

          <p style="color: #888; font-size: 12px; margin-top: 30px;">
            This is a testing version of the app. Please note that payments are not currently enabled.
          </p>
        </div>

        <div style="background-color: #f1f1f1; padding: 20px; text-align: center; color: #888; font-size: 12px;">
          <p style="margin: 0;">&copy; 2026 UnitTrack Team</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
