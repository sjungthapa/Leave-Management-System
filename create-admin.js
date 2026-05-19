require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/leaveappointmentmanagementsystem');
    console.log('✅ Connected to MongoDB\n');

    // Get admin details from command line arguments
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      console.log('📝 Usage: node create-admin.js <email> [name] [password]');
      console.log('\nExamples:');
      console.log('  node create-admin.js admin@example.com');
      console.log('  node create-admin.js admin@example.com "Admin User"');
      console.log('  node create-admin.js admin@example.com "Admin User" admin123\n');
      process.exit(1);
    }

    const email = args[0];
    const name = args[1] || 'Admin User';
    const password = args[2] || 'admin123';

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // User exists, update to admin
      if (existingUser.role === 'admin') {
        console.log('ℹ️  User is already an admin!');
        console.log(`   Email: ${existingUser.email}`);
        console.log(`   Name: ${existingUser.name}`);
      } else {
        existingUser.role = 'admin';
        await existingUser.save();
        console.log('✅ User updated to admin successfully!');
        console.log(`   Email: ${existingUser.email}`);
        console.log(`   Name: ${existingUser.name}`);
        console.log(`   Role: ${existingUser.role}`);
      }
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const admin = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'admin'
      });

      console.log('✅ Admin user created successfully!');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   Password: ${password}`);
      console.log(`   Role: ${admin.role}`);
      console.log('\n⚠️  Please save these credentials securely!');
    }

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

console.log('═══════════════════════════════════════════════════════');
console.log('   Leave Management System - Create Admin User');
console.log('═══════════════════════════════════════════════════════\n');

createAdmin();
