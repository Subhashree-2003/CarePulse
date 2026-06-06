const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Admin Schema
const adminSchema = new mongoose.Schema({
  admin_id: { type: String, unique: true },
  admin_name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'admin' },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

// Audit Log Schema
const auditLogSchema = new mongoose.Schema({
  user_id: String,
  user_type: String,
  action: String,
  module: String,
  description: String,
  ip_address: String,
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['success', 'failed'], default: 'success' }
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  user_id: String,
  user_type: String,
  title: String,
  message: String,
  type: { type: String, enum: ['appointment', 'billing', 'general', 'alert'], default: 'general' },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);
const AuditLog = mongoose.model('AuditLog', auditLogSchema);
const Notification = mongoose.model('Notification', notificationSchema);

// ========== ADMIN ROUTES ==========
router.get('/admins', async function(req, res) {
  try {
    const admins = await Admin.find({ is_active: true });
    res.json({ success: true, data: admins });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/admins', async function(req, res) {
  try {
    const admin = new Admin(req.body);
    await admin.save();
    res.status(201).json({ success: true, message: 'Admin created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ========== AUDIT LOG ROUTES ==========
router.get('/audit-logs', async function(req, res) {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/audit-logs', async function(req, res) {
  try {
    const log = new AuditLog(req.body);
    await log.save();
    res.status(201).json({ success: true, message: 'Log created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ========== NOTIFICATION ROUTES ==========
router.get('/notifications', async function(req, res) {
  try {
    const notifications = await Notification.find().sort({ created_at: -1 });
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/notifications/unread', async function(req, res) {
  try {
    const notifications = await Notification.find({ is_read: false }).sort({ created_at: -1 });
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/notifications', async function(req, res) {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json({ success: true, message: 'Notification created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/notifications/:id/read', async function(req, res) {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { is_read: true });
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;