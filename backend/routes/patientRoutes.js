const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async function(req, res) {
  try {
    var sql = 'SELECT patient_id, first_name, last_name, date_of_birth, gender, blood_group, phone_no, email_id, Patient_address, blood_pressure, diabetes, thyroid, cholesterol, is_active, created_at FROM patient WHERE is_active = 1';
    const [rows] = await db.query(sql);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async function(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM patient WHERE patient_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async function(req, res) {
  var b = req.body;
  if (!b.patient_id || !b.first_name || !b.last_name || !b.email_id)
    return res.status(400).json({ success: false, message: 'Required fields missing' });
  try {
    var sql = 'INSERT INTO patient (patient_id, first_name, last_name, date_of_birth, gender, blood_group, phone_no, email_id, Patient_address, blood_pressure, diabetes, thyroid, cholesterol, profile_photo_url, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())';
    await db.query(sql, [b.patient_id, b.first_name, b.last_name, b.date_of_birth, b.gender, b.blood_group, b.phone_no, b.email_id, b.Patient_address, b.blood_pressure, b.diabetes, b.thyroid, b.cholesterol, b.profile_photo_url || null]);
    res.status(201).json({ success: true, message: 'Patient created successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'Patient ID or Email already exists' });
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', async function(req, res) {
  var b = req.body;
  try {
    var sql = 'UPDATE patient SET first_name=?, last_name=?, date_of_birth=?, gender=?, blood_group=?, phone_no=?, email_id=?, Patient_address=?, blood_pressure=?, diabetes=?, thyroid=?, cholesterol=?, profile_photo_url=? WHERE patient_id=?';
    const [result] = await db.query(sql, [b.first_name, b.last_name, b.date_of_birth, b.gender, b.blood_group, b.phone_no, b.email_id, b.Patient_address, b.blood_pressure, b.diabetes, b.thyroid, b.cholesterol, b.profile_photo_url || null, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, message: 'Patient updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async function(req, res) {
  try {
    const [result] = await db.query('UPDATE patient SET is_active = 0 WHERE patient_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, message: 'Patient deactivated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;