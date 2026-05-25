const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patient_id: String,
  first_name: String,
  last_name: String,
  date_of_birth: Date,
  gender: String,
  blood_group: String,
  phone_no: String,
  email_id: String,
  Patient_address: String,
  blood_pressure: Number,
  diabetes: Number,
  thyroid: Number,
  cholesterol: Number,
  profile_photo_url: String,
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

const Patient = mongoose.model('Patient', patientSchema);

router.get('/', async function(req, res) {
  try {
    const patients = await Patient.find({ is_active: true });
    res.json({ success: true, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async function(req, res) {
  try {
    const patient = await Patient.findOne({ patient_id: req.params.id });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, data: patient });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async function(req, res) {
  var b = req.body;
  if (!b.patient_id || !b.first_name || !b.last_name || !b.email_id) {
    return res.status(400).json({ success: false, message: 'Required fields missing' });
  }
  try {
    const patient = new Patient(b);
    await patient.save();
    res.status(201).json({ success: true, message: 'Patient created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', async function(req, res) {
  try {
    const result = await Patient.findOneAndUpdate(
      { patient_id: req.params.id },
      req.body,
      { new: true }
    );
    if (!result) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, message: 'Patient updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async function(req, res) {
  try {
    const result = await Patient.findOneAndUpdate(
      { patient_id: req.params.id },
      { is_active: false }
    );
    if (!result) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, message: 'Patient deactivated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;