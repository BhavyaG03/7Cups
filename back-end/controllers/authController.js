const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/emailService');

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password, role, gender, age } = req.body;
    const status = "offline"; 
    const rating = 0;
    const total_ratings = 0;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      status: status,
      gender,
      age,
      room_id: null,
      rating: rating,
      total_ratings: total_ratings,
      lastSeen: null,
      isEmailVerified: false,
      emailVerificationToken,
      emailVerificationExpires
    });

    await newUser.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(email, emailVerificationToken, username);
    
    if (emailSent) {
      return res.status(201).json({ 
        message: 'User registered successfully. Please check your email to verify your account.',
        requiresVerification: true
      });
    } else {
      // If email fails, still create user but inform about verification issue
      return res.status(201).json({ 
        message: 'User registered successfully but verification email could not be sent. Please contact support.',
        requiresVerification: true
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Mark email as verified and clear verification fields
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    user.status = 'online'; // Set user as online after verification
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// RESEND VERIFICATION EMAIL
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;
    await user.save();

    // Send new verification email
    const emailSent = await sendVerificationEmail(email, emailVerificationToken, user.username);
    
    if (emailSent) {
      return res.status(200).json({ message: 'Verification email sent successfully' });
    } else {
      return res.status(500).json({ message: 'Failed to send verification email' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({ 
        message: 'Please verify your email before logging in',
        requiresVerification: true,
        email: user.email
      });
    }

    // Don't change status on login - keep existing status
    // Status will only change when user explicitly starts session or sends messages
    user.lastSeen = null;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );
    return res.status(200).json({
      token,
      role: user.role,
              user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          status: user.status,
          isConnected: user.isConnected,
          gender: user.gender,
          age: user.age,
          room_id: user.room_id,
          rating: user.rating,
          lastSeen: user.lastSeen,
          isEmailVerified: user.isEmailVerified
        },
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// EDIT USER BY ID
exports.editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove atomic update for 'active' assignment, just update fields
    // Password update logic (unchanged)
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    // If status is being set to offline, update lastSeen
    if (updates.status === 'offline') {
      updates.lastSeen = new Date();
    }
    if (updates.status === 'online') {
      updates.lastSeen = null;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User updated successfully', updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// DELETE ALL USERS
exports.deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany({});
    return res.status(200).json({ message: 'All users deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.getAll= async (req, res) => {
  try {
    const filters = {};
    
    if (req.query.role) filters.role = req.query.role;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.age) filters.age = req.query.age;
    
    const users = await User.find(filters);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.getById= async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.logout = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { 
        isConnected: false, 
        room_id: null, 
        lastSeen: new Date(),
        status: "offline"  // Added this line
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User logged out successfully", updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add endpoint to get user status and lastSeen
exports.getUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, 'status lastSeen isConnected');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ status: user.status, lastSeen: user.lastSeen, isConnected: user.isConnected });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// START SESSION (for listeners)
exports.startSession = async (req, res) => {
  try {
    const { id } = req.body;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'listener') {
      return res.status(400).json({ message: 'Only listeners can start sessions' });
    }
    
    // Change status to online when starting session
    user.status = 'online';
    await user.save();
    
    return res.status(200).json({ 
      message: 'Session started successfully', 
      status: user.status 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};



