const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// EHR Visit Schema
const ehrVisitSchema = new mongoose.Schema({
  appt_id: String,
  patient_id: String,
  doc_id: String,
  visit_date: Date,
  chief_complaint: String,
  visit_notes: String,
  follow_up_date: Date,
  created_at: { type: Date, default: Date.now }
});

// EHR Vital Schema
const ehrVitalSchema = new mongoose.Schema({
  visit_id: String,
  patient_id: String,
  recorded_at: { type: Date, default: Date.now },
  temperature_c: Number,
  pulse_bpm: Number,
  bp_systolic: Number,
  bp_diastolic: Number,
  spo2_percent: Number,
  height_cm: Number,
  weight_kg: Number,
  bmi: Number
});

// EHR Diagnosis Schema
const ehrDiagnosisSchema = new mongoose.Schema({
  visit_id: String,
  patient_id: String,
  icd_code: String,
  diagnosis_name: String,
  diagnosis_type: String,
  severity: String,
  notes: String,
  diagnosed_by: String,
  diagnosed_at: { type: Date, default: Date.now }
});

const EHRVisit = mongoose.model('EHRVisit', ehrVisitSchema);
const EHRVital = mongoose.model('EHRVital', ehrVitalSchema);
const EHRDiagnosis = mongoose.model('EHRDiagnosis', ehrDiagnosisSchema);

// GET all visits
router.get('/visits', async function(req, res) {
  try {
    const visits = await EHRVisit.find().sort({ visit_date: -1 });
    res.json({ success: true, data: visits });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET visits by patient
router.get('/visits/patient/:patient_id', async function(req, res) {
  try {
    const visits = await EHRVisit.find({ patient_id: req.params.patient_id }).sort({ visit_date: -1 });
    res.json({ success: true, data: visits });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create visit
router.post('/visits', async function(req, res) {
  try {
    const visit = new EHRVisit(req.body);
    await visit.save();
    res.status(201).json({ success: true, message: 'Visit created successfully', data: visit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update visit
router.put('/visits/:id', async function(req, res) {
  try {
    const result = await EHRVisit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!result) return res.status(404).json({ success: false, message: 'Visit not found' });
    res.json({ success: true, message: 'Visit updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE visit
router.delete('/visits/:id', async function(req, res) {
  try {
    const result = await EHRVisit.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Visit not found' });
    res.json({ success: true, message: 'Visit deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all vitals
router.get('/vitals', async function(req, res) {
  try {
    const vitals = await EHRVital.find().sort({ recorded_at: -1 });
    res.json({ success: true, data: vitals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create vital
router.post('/vitals', async function(req, res) {
  try {
    const vital = new EHRVital(req.body);
    await vital.save();
    res.status(201).json({ success: true, message: 'Vitals recorded successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all diagnoses
router.get('/diagnoses', async function(req, res) {
  try {
    const diagnoses = await EHRDiagnosis.find().sort({ diagnosed_at: -1 });
    res.json({ success: true, data: diagnoses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create diagnosis
router.post('/diagnoses', async function(req, res) {
  try {
    const diagnosis = new EHRDiagnosis(req.body);
    await diagnosis.save();
    res.status(201).json({ success: true, message: 'Diagnosis created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;