const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient_id: String,
  doctor_id: String,
  appt_date: Date,
  appt_time: String,
  patient_name: String,
  doc_name: String,
  dept: String,
  created_at: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

router.get('/', async function(req, res) {
  try {
    const appointments = await Appointment.find().sort({ appt_date: -1 });
    res.json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async function(req, res) {
  var b = req.body;
  if (!b.patient_id || !b.doctor_id || !b.appt_date || !b.appt_time || !b.patient_name) {
    return res.status(400).json({ success: false, message: 'Required fields missing' });
  }
  try {
    const appointment = new Appointment(b);
    await appointment.save();
    res.status(201).json({ success: true, message: 'Appointment booked successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', async function(req, res) {
  try {
    const result = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!result) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, message: 'Appointment updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async function(req, res) {
  try {
    const result = await Appointment.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/doctors/all', async function(req, res) {
  res.json({ success: true, data: [] });
});

module.exports = router;