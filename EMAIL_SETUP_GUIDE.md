# Email Setup Guide with Nodemailer

This guide will help you configure email notifications for the Leave Management System using your actual email account.

## Supported Email Services

The system supports the following email services out of the box:
- Gmail
- Outlook/Hotmail
- Yahoo Mail
- And many others

## Gmail Setup (Recommended)

### Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the steps to enable 2-Step Verification

### Step 2: Generate App Password

1. After enabling 2-Step Verification, go back to Security settings
2. Under "Signing in to Google", click on "App passwords"
3. Select "Mail" as the app
4. Select "Other (Custom name)" as the device
5. Enter "Leave Management System" as the name
6. Click "Generate"
7. Copy the 16-character password (remove spaces)

### Step 3: Configure .env File

Add these lines to your `.env` file:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
EMAIL_FROM_NAME=Leave Management System
```

**Example:**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM_NAME=Leave Management System
```

## Outlook/Hotmail Setup

### Step 1: Enable App Password

1. Go to Microsoft Account Security: https://account.microsoft.com/security
2. Click on "Advanced security options"
3. Under "App passwords", click "Create a new app password"
4. Copy the generated password

### Step 2: Configure .env File

```env
EMAIL_SERVICE=outlook
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM_NAME=Leave Management System
```

## Yahoo Mail Setup

### Step 1: Generate App Password

1. Go to Yahoo Account Security: https://login.yahoo.com/account/security
2. Click on "Generate app password"
3. Select "Other App" and enter "Leave Management"
4. Click "Generate"
5. Copy the password

### Step 2: Configure .env File

```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your_email@yahoo.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM_NAME=Leave Management System
```

## Testing Email Configuration

### Method 1: Using Node.js Script

Create a test file `test-email.js` in your project root:

```javascript
require('dotenv').config();
const sendEmail = require('./utils/SendEmail');

const testEmail = async () => {
  try {
    const result = await sendEmail({
      email: 'recipient@example.com', // Change to your test email
      subject: 'Test Email from Leave Management System',
      message: '<h1>Test Email</h1><p>If you receive this, email is configured correctly!</p>',
    });
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.log('❌ Email failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testEmail();
```

Run the test:
```bash
node test-email.js
```

### Method 2: Through the Application

1. Start your backend server
2. Register a user with a real email address
3. Create an admin user (update role in database)
4. Login as regular user and request leave
5. Check admin email for notification
6. Login as admin and approve/reject the leave
7. Check user email for approval/rejection notification

## Email Notifications in the System

### When User Requests Leave:
- **Recipient:** All admin users
- **Subject:** "New Leave Request from [User Name]"
- **Content:** Employee details, dates, duration, and reason

### When Admin Approves/Rejects Leave:
- **Recipient:** The user who requested leave
- **Subject:** "Leave Request Approved/Rejected - [Date]"
- **Content:** Leave details and approval status

## Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Solution:**
- Make sure you're using an App Password, not your regular email password
- Verify 2-Step Verification is enabled
- Check that you copied the App Password correctly (remove spaces)

### Error: "self signed certificate in certificate chain"

**Solution:**
Add this to your SendEmail.js transporter config:
```javascript
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});
```

### Error: "Connection timeout"

**Solution:**
- Check your internet connection
- Verify firewall isn't blocking SMTP ports
- Try a different email service

### Emails Going to Spam

**Solution:**
- Add your email to recipient's contacts
- Check SPF/DKIM records if using custom domain
- Use a professional "From Name"
- Avoid spam trigger words in subject/content

### Gmail Daily Sending Limit

Gmail has a daily sending limit:
- Free Gmail: 500 emails per day
- Google Workspace: 2,000 emails per day

For high-volume applications, consider:
- SendGrid
- Amazon SES
- Mailgun
- Postmark

## Security Best Practices

1. **Never commit .env file to Git**
   - Add `.env` to `.gitignore`
   - Use `.env.example` for documentation

2. **Use App Passwords**
   - Never use your actual email password
   - App passwords are more secure and can be revoked

3. **Rotate Passwords Regularly**
   - Change app passwords every 3-6 months
   - Revoke unused app passwords

4. **Limit Access**
   - Only give email credentials to trusted team members
   - Use environment variables in production

## Production Recommendations

For production environments, consider using dedicated email services:

### SendGrid (Recommended)
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

### Amazon SES
```javascript
const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });
```

### Mailgun
```javascript
const mailgun = require('mailgun-js');
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });
```

These services offer:
- Higher sending limits
- Better deliverability
- Detailed analytics
- Professional support
- Dedicated IP addresses

## Environment Variables Reference

```env
# Required
EMAIL_SERVICE=gmail              # Email service provider
EMAIL_USER=your@email.com        # Your email address
EMAIL_PASSWORD=your_app_password # App password (not regular password)

# Optional
EMAIL_FROM_NAME=Leave Management System  # Display name in "From" field
```

## Need Help?

If you're still having issues:
1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with the test script first
4. Try a different email service
5. Check your email service's documentation

## Additional Resources

- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Outlook App Passwords](https://support.microsoft.com/en-us/account-billing/using-app-passwords-with-apps-that-don-t-support-two-step-verification-5896ed9b-4263-e681-128a-a6f2979a7944)
- [Yahoo App Passwords](https://help.yahoo.com/kb/generate-manage-third-party-passwords-sln15241.html)
- [Nodemailer Documentation](https://nodemailer.com/about/)
