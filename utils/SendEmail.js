const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    // Create a transporter with Gmail or other email service
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail", // gmail, outlook, yahoo, etc.
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app password
      },
    });

    // Define email options
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Leave Management System'}" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
