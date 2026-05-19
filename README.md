# Leave Appointment Management System

A full-stack leave management application where users can request leaves with date ranges and reasons, and admins can approve or reject requests. The calendar displays all approved leaves with user names.

## Features

### User Features
- Register and login (with Google OAuth support)
- Request leave by selecting date range from calendar
- Provide reason for leave request
- View all personal leaves with status (pending/approved/rejected)
- Edit pending leave requests
- Delete leave requests
- Calendar view showing personal leaves color-coded by status
- Email notifications when leave is approved/rejected

### Admin Features
- View all leave requests from all users
- Approve or reject leave requests
- View detailed information about each leave request
- See employee name, email, dates, reason, and status
- Email notifications when new leave requests are submitted

### Email Notifications
- Admins receive email when users submit leave requests
- Users receive email when their leave is approved or rejected
- Professional HTML email templates
- Works with Gmail, Outlook, Yahoo, and other email services

### Calendar Features
- Highlights dates occupied by approved leaves
- Shows user names on occupied dates
- Tooltip displays user name and reason when hovering over leave dates
- Only approved leaves are visible on the main calendar

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Google OAuth 2.0

### Frontend
- React
- Ant Design (UI components)
- FullCalendar (calendar views)
- Axios (API calls)
- React Router (navigation)
- Redux Toolkit (state management)
- React Hot Toast (notifications)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id

# Email Configuration (for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM_NAME=Leave Management System
```

**Important:** For Gmail, you need to use an App Password, not your regular password.
See `EMAIL_SETUP_GUIDE.md` for detailed instructions.

3. Start the backend server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

4. (Optional) Test email configuration:
```bash
node test-email.js your_test_email@example.com
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/user/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google-login` - Google OAuth login
- `GET /api/auth/users/me` - Get current user info

### Leave Management
- `POST /api/leaves` - Create leave request
- `GET /api/leaves/my` - Get current user's leaves
- `GET /api/leaves/calendar` - Get all approved leaves for calendar
- `GET /api/leaves` - Get all leaves (Admin only)
- `PUT /api/leaves/:id` - Update leave request
- `PUT /api/leaves/:id/status` - Update leave status (Admin only)
- `DELETE /api/leaves/:id` - Delete leave request

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  role: String (enum: ['admin', 'user']),
  isVerified: Boolean,
  provider: String (enum: ['local', 'google'])
}
```

### Leave Model
```javascript
{
  user: ObjectId (ref: User),
  startDate: Date,
  endDate: Date,
  reason: String,
  status: String (enum: ['pending', 'approved', 'rejected']),
  timestamps: true
}
```

## Usage

1. Register a new account or login
2. On the home page, request leave by:
   - Selecting date range
   - Providing a reason
   - Submitting the form
3. View your leaves in "My Leaves" page
4. Edit pending leaves if needed
5. Calendar shows all approved leaves with user names
6. Admins can access "All Leaves" to approve/reject requests

## Create Admin User

Use the built-in command to create an admin user:

```bash
npm run create-admin admin@example.com "Admin Name" password123
```

Or with defaults (name: "Admin User", password: "admin123"):
```bash
npm run create-admin admin@example.com
```

The script will:
- Create a new admin user if email doesn't exist
- Upgrade existing user to admin if email exists
- Show credentials after creation

See `CREATE_ADMIN_GUIDE.md` for detailed instructions.

## Project Structure

```
├── backend
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Auth middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
│
├── frontend
│   ├── public/
│   └── src/
│       ├── assets/
│       │   ├── components/  # Reusable components
│       │   └── pages/       # Page components
│       ├── components/      # Navbar
│       ├── redux/           # Redux store
│       └── App.js           # Main app component
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC
