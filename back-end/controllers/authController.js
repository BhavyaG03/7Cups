const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password, role,gender,age } = req.body;
    const status = "online";
    const rating = 0;
    const total_ratings = 0;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
      lastSeen: null
    });

    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully' });
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

    // Set user online on login
    user.status = 'online';
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
        gender: user.gender,
        age: user.age,
        room_id: user.room_id,
        rating: user.rating,
        lastSeen: user.lastSeen
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
      { status: "offline", room_id: null, lastSeen: new Date() },
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
    const user = await User.findById(req.params.id, 'status lastSeen');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ status: user.status, lastSeen: user.lastSeen });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};



