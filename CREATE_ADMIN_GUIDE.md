# Create Admin User Guide

## Quick Command

```bash
npm run create-admin <email> [name] [password]
```

Or directly:

```bash
node create-admin.js <email> [name] [password]
```

## Usage Examples

### Example 1: Create admin with email only
```bash
npm run create-admin admin@example.com
```
**Result:**
- Email: admin@example.com
- Name: Admin User (default)
- Password: admin123 (default)
- Role: admin

### Example 2: Create admin with email and name
```bash
npm run create-admin admin@example.com "John Admin"
```
**Result:**
- Email: admin@example.com
- Name: John Admin
- Password: admin123 (default)
- Role: admin

### Example 3: Create admin with all details
```bash
npm run create-admin admin@example.com "John Admin" mySecurePass123
```
**Result:**
- Email: admin@example.com
- Name: John Admin
- Password: mySecurePass123
- Role: admin

### Example 4: Upgrade existing user to admin
```bash
npm run create-admin user@example.com
```
If user@example.com already exists, it will be upgraded to admin role.

## What the Script Does

1. **Connects to MongoDB** - Uses connection string from .env
2. **Checks if user exists**:
   - If exists and already admin → Shows message
   - If exists but not admin → Upgrades to admin
   - If doesn't exist → Creates new admin user
3. **Hashes password** - Securely stores password
4. **Saves to database** - Creates/updates user
5. **Shows credentials** - Displays the admin details

## Output Examples

### Creating New Admin
```
═══════════════════════════════════════════════════════
   Leave Management System - Create Admin User
═══════════════════════════════════════════════════════

✅ Connected to MongoDB

✅ Admin user created successfully!
   Email: admin@example.com
   Name: Admin User
   Password: admin123
   Role: admin

⚠️  Please save these credentials securely!

✅ Database connection closed
```

### Upgrading Existing User
```
═══════════════════════════════════════════════════════
   Leave Management System - Create Admin User
═══════════════════════════════════════════════════════

✅ Connected to MongoDB

✅ User updated to admin successfully!
   Email: user@example.com
   Name: John Doe
   Role: admin

✅ Database connection closed
```

### User Already Admin
```
═══════════════════════════════════════════════════════
   Leave Management System - Create Admin User
═══════════════════════════════════════════════════════

✅ Connected to MongoDB

ℹ️  User is already an admin!
   Email: admin@example.com
   Name: Admin User

✅ Database connection closed
```

## Common Use Cases

### 1. First Time Setup
After deploying the application, create the first admin:
```bash
npm run create-admin admin@yourcompany.com "System Admin" SecurePass123
```

### 2. Promote Existing User
A user registered and you want to make them admin:
```bash
npm run create-admin user@example.com
```

### 3. Create Multiple Admins
```bash
npm run create-admin admin1@company.com "Admin One" pass123
npm run create-admin admin2@company.com "Admin Two" pass456
npm run create-admin admin3@company.com "Admin Three" pass789
```

### 4. Quick Test Admin
For development/testing:
```bash
npm run create-admin test@test.com
```
Login with: test@test.com / admin123

## Security Best Practices

### ✅ DO:
- Use strong passwords in production
- Change default password immediately after first login
- Keep admin credentials secure
- Use unique passwords for each admin
- Document who has admin access

### ❌ DON'T:
- Use default password (admin123) in production
- Share admin credentials
- Use simple passwords like "password" or "123456"
- Create unnecessary admin accounts
- Leave test admin accounts in production

## Troubleshooting

### Error: "Cannot connect to MongoDB"
**Solution:**
- Ensure MongoDB is running: `mongod`
- Check MONGO_URL in .env file
- Verify database connection string

### Error: "User validation failed"
**Solution:**
- Check email format is valid
- Ensure password meets minimum requirements (8 characters)
- Verify name is provided

### Error: "Email already exists" (during registration)
**Solution:**
- This is normal! The script will upgrade the existing user to admin
- If you want a new admin, use a different email

### Script doesn't run
**Solution:**
```bash
# Make sure you're in the project root directory
cd /path/to/leave-management-system

# Try running directly
node create-admin.js admin@example.com
```

## Integration with Application

After creating an admin user:

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Login as admin:**
   - Go to: http://localhost:3000/login
   - Enter admin email and password
   - You'll be redirected to home page

3. **Access admin features:**
   - Navigate to "All Leaves (Admin)" in the navbar
   - Approve/reject leave requests
   - View all employee leaves

## Automated Setup Script

You can create a setup script that creates admin automatically:

**setup.sh** (Linux/Mac):
```bash
#!/bin/bash
echo "Setting up Leave Management System..."
npm install
npm run create-admin admin@company.com "System Admin" admin123
echo "Setup complete! Admin created."
```

**setup.bat** (Windows):
```batch
@echo off
echo Setting up Leave Management System...
call npm install
call npm run create-admin admin@company.com "System Admin" admin123
echo Setup complete! Admin created.
```

## Verification

To verify admin was created successfully:

### Method 1: Login to Application
1. Start the app: `npm run dev`
2. Go to login page
3. Login with admin credentials
4. Check if "All Leaves (Admin)" appears in navbar

### Method 2: Check Database
Using MongoDB Compass or Shell:
```javascript
use leaveappointmentmanagementsystem
db.users.find({ role: "admin" })
```

### Method 3: Check via API
```bash
# Login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Use token to access admin endpoint
curl -X GET http://localhost:5000/api/leaves \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run create-admin <email>` | Create admin with defaults |
| `npm run create-admin <email> <name>` | Create admin with custom name |
| `npm run create-admin <email> <name> <pass>` | Create admin with all details |
| `node create-admin.js` | Show usage help |

## Default Values

- **Default Name:** "Admin User"
- **Default Password:** "admin123"
- **Default Role:** "admin"

## Notes

- The script is idempotent (safe to run multiple times)
- Existing admins won't be affected
- Regular users can be upgraded to admin
- Password is automatically hashed before storage
- Script closes database connection after completion

## Support

If you encounter issues:
1. Check MongoDB is running
2. Verify .env configuration
3. Ensure you're in the project root directory
4. Check the error message for specific details
5. Try running with `node create-admin.js` directly

For more help, see:
- README.md
- SETUP.md
- FINAL_SUMMARY.md
