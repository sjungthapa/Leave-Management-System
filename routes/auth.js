const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
require("dotenv").config(); // Ensure .env is loaded

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// User Registration Route
/**
 * Register a new user by accepting the user's name, email, and password.
 * The password is hashed before storing the user in the database.
 */
router.post("/user/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields (name, email, password) are required.",
        success: false,
      });
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        message: "Email already exists. Please use a different email.",
        success: false,
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully.",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while registering the user.",
      success: false,
      error: error.message,
    });
  }
});

// User Login Route
/**
 * Log in a user by validating the email and password, generating a JWT token.
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User does not exist.",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password.",
        success: false,
      });
    }

    // Generate a JWT token for the logged-in user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful.",
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error during login.",
      success: false,
      error: error.message,
    });
  }
});

// Google Login Route
/**
 * Handle Google login by verifying the Google token and generating a JWT token for the user.
 */
router.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Google token is required.",
        success: false,
      });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      // If the user doesn't exist, create a new one
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        avatar: { url: picture },
        isVerified: true,
        provider: "google",
      });
    }

    // Generate a JWT token for the user
    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Google login successful.",
      success: true,
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar?.url,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      message: "Google authentication failed.",
      success: false,
      error: error.message,
    });
  }
});

// Get current logged-in user's information
/**
 * Fetch the currently authenticated user's information (name, email).
 */
router.get("/users/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching user information.",
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
