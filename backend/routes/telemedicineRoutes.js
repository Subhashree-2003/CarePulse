const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Telemedicine Session Schema
const sessionSchema = new mongoose.Schema({
  session_id: { type: String, unique: true },
  patient_id: String,
  doctor_id: String,
  appt_id: String,
  session_date: Date,
  session_time: String,
  duration_minutes: Number,
  status: { type: String, enum: ['scheduled', 'ongoing', 'completed', 'cancelled'], default: 'scheduled' },
  meeting_link: String,
  notes: String,
  created_at: { type: Date, default: Date.now }
});

// Prescription Schema
const prescriptionSchema = new mongoose.Schema({
  prescription_id: { type: String, unique: true },
  patient_id: String,
  doctor_id: String,
  visit_id: String,
  medicines: [{
    medicine_name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  diagnosis: String,
  notes: String,
  prescribed_date: { type: Date, default: Date.now },
  valid_until: Date
});

const TelemedicineSession = mongoose.model('TelemedicineSession', sessionSchema);
const Prescription = mongoose.model('Prescription', prescriptionSchema);

// ========== TELEMEDICINE ROUTES ==========

// GET all sessions
router.get('/sessions', async function(req, res) {
  try {
    const sessions = await TelemedicineSession.find().sort({ session_date: -1 });
    res.json({ success: true, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create session
router.post('/sessions', async function(req, res) {
  try {
    var b = req.body;
    var session = new TelemedicineSession({
      ...b,
      session_id: 'SES-' + Date.now(),
      meeting_link: 'https://meet.carepulse.com/' + Math.random().toString(36).substr(2, 9)
    });
    await session.save();
    res.status(201).json({ success: true, message: 'Session created successfully', data: session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update session status
router.put('/sessions/:id', async function(req, res) {
  try {
    const result = await TelemedicineSession.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!result) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, message: 'Session updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE session
router.delete('/sessions/:id', async function(req, res) {
  try {
    await TelemedicineSession.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Session cancelled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ========== PRESCRIPTION ROUTES ==========

// GET all prescriptions
router.get('/prescriptions', async function(req, res) {
  try {
    const prescriptions = await Prescription.find().sort({ prescribed_date: -1 });
    res.json({ success: true, data: prescriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET prescriptions by patient
router.get('/prescriptions/patient/:patient_id', async function(req, res) {
  try {
    const prescriptions = await Prescription.find({ patient_id: req.params.patient_id });
    res.json({ success: true, data: prescriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create prescription
router.post('/prescriptions', async function(req, res) {
  try {
    var prescription = new Prescription({
      ...req.body,
      prescription_id: 'RX-' + Date.now()
    });
    await prescription.save();
    res.status(201).json({ success: true, message: 'Prescription created successfully', data: prescription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE prescription
router.delete('/prescriptions/:id', async function(req, res) {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Prescription deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;