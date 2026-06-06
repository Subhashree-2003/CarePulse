const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Doctor Schema
const doctorSchema = new mongoose.Schema({
  doc_id: { type: String, unique: true },
  doc_name: String,
  dept: String,
  phone_no: String,
  mail_id: { type: String, unique: true },
  password: String,
  status: { type: Boolean, default: true },
  specialization: String,
  experience_years: Number,
  created_at: { type: Date, default: Date.now }
});

// Doctor Availability Schema
const availabilitySchema = new mongoose.Schema({
  doc_id: String,
  day_of_week: String,
  start_time: String,
  end_time: String,
  slot_duration_min: Number,
  appointment_type: String,
  is_active: { type: Boolean, default: true }
});

const Doctor = mongoose.model('Doctor', doctorSchema);
const DoctorAvailability = mongoose.model('DoctorAvailability', availabilitySchema);

// GET all doctors
router.get('/', async function(req, res) {
  try {
    const doctors = await Doctor.find({ status: true });
    res.json({ success: true, data: doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET doctor by ID
router.get('/:id', async function(req, res) {
  try {
    const doctor = await Doctor.findOne({ doc_id: req.params.id });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create doctor
router.post('/', async function(req, res) {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json({ success: true, message: 'Doctor created successfully' });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ success: false, message: 'Doctor ID or Email already exists' });
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update doctor
router.put('/:id', async function(req, res) {
  try {
    const result = await Doctor.findOneAndUpdate({ doc_id: req.params.id }, req.body, { new: true });
    if (!result) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, message: 'Doctor updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE doctor (soft delete)
router.delete('/:id', async function(req, res) {
  try {
    const result = await Doctor.findOneAndUpdate({ doc_id: req.params.id }, { status: false });
    if (!result) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, message: 'Doctor deactivated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET doctor availability
router.get('/:id/availability', async function(req, res) {
  try {
    const availability = await DoctorAvailability.find({ doc_id: req.params.id, is_active: true });
    res.json({ success: true, data: availability });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST doctor availability
router.post('/:id/availability', async function(req, res) {
  try {
    const availability = new DoctorAvailability({ ...req.body, doc_id: req.params.id });
    await availability.save();
    res.status(201).json({ success: true, message: 'Availability added successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;