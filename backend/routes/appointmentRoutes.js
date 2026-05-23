const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/doctors/all', async function(req, res) {
  try {
    const [rows] = await db.query('SELECT doc_id, doc_name, dept FROM doctor WHERE Status = 1');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/availability/:doc_id', async function(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM doctor_availability WHERE doc_id = ? AND is_active = 1', [req.params.doc_id]);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', async function(req, res) {
  try {
    var sql = 'SELECT a.appt_id, a.patient_id, a.doctor_id, a.appt_date, a.appt_time, a.patient_name, d.doc_name, d.dept FROM appointment a LEFT JOIN doctor d ON a.doctor_id = d.doc_id ORDER BY a.appt_date DESC';
    const [rows] = await db.query(sql);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/patient/:patient_id', async function(req, res) {
  try {
    var sql = 'SELECT a.*, d.doc_name, d.dept FROM appointment a LEFT JOIN doctor d ON a.doctor_id = d.doc_id WHERE a.patient_id = ? ORDER BY a.appt_date DESC';
    const [rows] = await db.query(sql, [req.params.patient_id]);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/doctor/:doctor_id', async function(req, res) {
  try {
    var sql = 'SELECT a.*, p.first_name, p.last_name FROM appointment a LEFT JOIN patient p ON a.patient_id = p.patient_id WHERE a.doctor_id = ? ORDER BY a.appt_date DESC';
    const [rows] = await db.query(sql, [req.params.doctor_id]);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async function(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM appointment WHERE appt_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, data: rows[0] });
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
    var sql = 'INSERT INTO appointment (patient_id, doctor_id, appt_date, appt_time, patient_name) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.query(sql, [b.patient_id, b.doctor_id, b.appt_date, b.appt_time, b.patient_name]);
    res.status(201).json({ success: true, message: 'Appointment booked successfully', appt_id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', async function(req, res) {
  var b = req.body;
  try {
    var sql = 'UPDATE appointment SET patient_id = ?, doctor_id = ?, appt_date = ?, appt_time = ?, patient_name = ? WHERE appt_id = ?';
    const [result] = await db.query(sql, [b.patient_id, b.doctor_id, b.appt_date, b.appt_time, b.patient_name, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, message: 'Appointment updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async function(req, res) {
  try {
    const [result] = await db.query('DELETE FROM appointment WHERE appt_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;