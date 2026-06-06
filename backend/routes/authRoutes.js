const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
  user_id: { type: String, unique: true },
  user_name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const JWT_SECRET = process.env.JWT_SECRET || 'carepulse_secret_key';

// REGISTER
router.post('/register', async function(req, res) {
  try {
    var b = req.body;
    if (!b.email || !b.password || !b.user_name) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }
    var hashedPassword = await bcrypt.hash(b.password, 10);
    var user = new User({
      user_id: 'USR-' + Date.now(),
      user_name: b.user_name,
      email: b.email,
      password: hashedPassword,
      role: b.role || 'patient'
    });
    await user.save();
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ success: false, message: 'Email already exists' });
    res.status(500).json({ success: false, message: err.message });
  }
});

// LOGIN
router.post('/login', async function(req, res) {
  try {
    var b = req.body;
    if (!b.email || !b.password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    var user = await User.findOne({ email: b.email, is_active: true });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    var isMatch = await bcrypt.compare(b.password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    var token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      user: { user_id: user.user_id, user_name: user.user_name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all users
router.get('/users', async function(req, res) {
  try {
    const users = await User.find({ is_active: true }).select('-password');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// VERIFY TOKEN
router.post('/verify-token', async function(req, res) {
  try {
    var token = req.body.token;
    if (!token) return res.status(400).json({ success: false, message: 'Token required' });
    var decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, message: 'Token valid', data: decoded });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

// DELETE user
router.delete('/users/:id', async function(req, res) {
  try {
    await User.findOneAndUpdate({ user_id: req.params.id }, { is_active: false });
    res.json({ success: true, message: 'User deactivated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;