# Quick Setup Guide

## Step 1: Install Dependencies

### Backend
```bash
npm install
```

### Frontend
```bash
cd frontend
npm install
cd ..
```

## Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the `.env` file with your values:
   - Set `MONGO_URI` to your MongoDB connection string
   - Set `JWT_SECRET` to a random secure string
   - (Optional) Add Google OAuth credentials
   - (Recommended) Configure email settings for notifications

## Step 3: Configure Email (Recommended)

Email notifications enhance the user experience by alerting users and admins about leave requests and approvals.

### For Gmail:

1. Enable 2-Step Verification in your Google Account
2. Generate an App Password:
   - Go to Google Account > Security > App passwords
   - Create password for "Mail" app
   - Copy the 16-character password

3. Add to `.env`:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM_NAME=Leave Management System
```

4. Test the configuration:
```bash
node test-email.js your_test_email@example.com
```

**See `EMAIL_SETUP_GUIDE.md` for detailed instructions for Gmail, Outlook, Yahoo, and other providers.**

## Step 4: Start MongoDB

Make sure MongoDB is running:
- Local: `mongod`
- Or use MongoDB Atlas (cloud)

## Step 5: Run the Application

### Option 1: Run Both Servers Separately

Terminal 1 (Backend):
```bash
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

### Option 2: Run Backend Only
```bash
npm start
```

Then navigate to frontend and start it separately.

## Step 6: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Step 7: Create Admin User

Use the built-in command to create an admin user:

```bash
npm run create-admin admin@example.com "Admin User" admin123
```

**Quick options:**
```bash
# With email only (uses defaults)
npm run create-admin admin@example.com

# With email and name
npm run create-admin admin@example.com "John Admin"

# With all details
npm run create-admin admin@example.com "John Admin" SecurePass123
```

**What it does:**
- Creates new admin if email doesn't exist
- Upgrades existing user to admin if email exists
- Shows credentials after creation

See `CREATE_ADMIN_GUIDE.md` for more options.

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:
- Backend: Change `PORT` in `.env`
- Frontend: Create `.env` in frontend folder with `PORT=3001`

### MongoDB Connection Error
- Check if MongoDB is running
- Verify `MONGO_URI` in `.env` is correct
- For Atlas, ensure IP whitelist is configured

### CORS Issues
- Ensure backend is running on port 5000
- Check `proxy` in `frontend/package.json` points to correct backend URL

### Google Login Not Working
- Verify `GOOGLE_CLIENT_ID` in `.env`
- Update Google OAuth redirect URIs in Google Console
- Add `http://localhost:3000` to authorized origins

### Email Notifications Not Working
- Verify email credentials in `.env`
- For Gmail, ensure you're using App Password (not regular password)
- Check that 2-Step Verification is enabled
- Run `node test-email.js` to test configuration
- See `EMAIL_SETUP_GUIDE.md` for detailed troubleshooting

## Default Test Credentials

After registering, you can create test users:

**Regular User:**
- Email: user@test.com
- Password: password123

**Admin User:**
- Email: admin@test.com
- Password: admin123
- (Remember to update role in database)

## Features to Test

1. **User Flow:**
   - Register/Login
   - Request leave with date range and reason
   - Check admin email for new request notification
   - View "My Leaves" page
   - Edit pending leaves
   - Delete leaves
   - Check calendar for approved leaves
   - Verify email notification when leave is approved/rejected

2. **Admin Flow:**
   - Login as admin
   - View "All Leaves" page
   - Approve/Reject leave requests
   - View leave details
   - Check calendar shows all approved leaves with user names

## Next Steps

- Customize the UI styling
- Add email notifications for leave approvals
- Implement leave balance tracking
- Add leave types (sick, vacation, etc.)
- Export leave reports
