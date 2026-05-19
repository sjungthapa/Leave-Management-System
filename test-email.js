require('dotenv').config();
const sendEmail = require('./utils/SendEmail');

const testEmail = async () => {
  console.log('🔧 Testing email configuration...\n');
  
  // Check if environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ Error: EMAIL_USER and EMAIL_PASSWORD must be set in .env file');
    console.log('\nPlease configure your .env file with:');
    console.log('EMAIL_SERVICE=gmail');
    console.log('EMAIL_USER=your_email@gmail.com');
    console.log('EMAIL_PASSWORD=your_app_password');
    console.log('\nSee EMAIL_SETUP_GUIDE.md for detailed instructions.');
    process.exit(1);
  }

  console.log('📧 Email Configuration:');
  console.log(`   Service: ${process.env.EMAIL_SERVICE || 'gmail'}`);
  console.log(`   From: ${process.env.EMAIL_USER}`);
  console.log(`   From Name: ${process.env.EMAIL_FROM_NAME || 'Leave Management System'}\n`);

  // Prompt for recipient email
  const recipientEmail = process.argv[2] || process.env.EMAIL_USER;
  
  console.log(`📬 Sending test email to: ${recipientEmail}\n`);

  try {
    const result = await sendEmail({
      email: recipientEmail,
      subject: 'Test Email - Leave Management System',
      message: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #52c41a; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .success { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 4px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Email Configuration Successful!</h1>
            </div>
            <div class="content">
              <div class="success">
                <h2>Congratulations!</h2>
                <p>Your email configuration is working correctly.</p>
              </div>
              
              <h3>Configuration Details:</h3>
              <ul>
                <li><strong>Service:</strong> ${process.env.EMAIL_SERVICE || 'gmail'}</li>
                <li><strong>From:</strong> ${process.env.EMAIL_USER}</li>
                <li><strong>From Name:</strong> ${process.env.EMAIL_FROM_NAME || 'Leave Management System'}</li>
              </ul>
              
              <h3>What's Next?</h3>
              <p>Your Leave Management System is now ready to send email notifications for:</p>
              <ul>
                <li>New leave requests (to admins)</li>
                <li>Leave approvals (to users)</li>
                <li>Leave rejections (to users)</li>
              </ul>
              
              <p>You can now start your application and test the full workflow!</p>
              
              <p>Best regards,<br>Leave Management System</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    
    if (result.success) {
      console.log('✅ SUCCESS! Email sent successfully!');
      console.log(`📨 Message ID: ${result.messageId}`);
      console.log(`\n✉️  Check your inbox at: ${recipientEmail}`);
      console.log('\n🎉 Your email configuration is working correctly!');
      console.log('\nYou can now start your application with: npm run dev');
    } else {
      console.log('❌ FAILED! Email could not be sent');
      console.log(`Error: ${result.error}`);
      console.log('\n📖 Please check EMAIL_SETUP_GUIDE.md for troubleshooting tips.');
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('\n📖 Common issues:');
    console.log('   1. Using regular password instead of App Password');
    console.log('   2. 2-Step Verification not enabled (required for Gmail)');
    console.log('   3. Incorrect email or password');
    console.log('   4. Firewall blocking SMTP connection');
    console.log('\n📖 See EMAIL_SETUP_GUIDE.md for detailed setup instructions.');
  }
};

console.log('═══════════════════════════════════════════════════════');
console.log('   Leave Management System - Email Configuration Test');
console.log('═══════════════════════════════════════════════════════\n');

testEmail();
