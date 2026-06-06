const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Billing Invoice Schema
const invoiceSchema = new mongoose.Schema({
  patient_id: String,
  appt_id: String,
  visit_id: String,
  invoice_number: { type: String, unique: true },
  invoice_date: { type: Date, default: Date.now },
  due_date: Date,
  subtotal: Number,
  discount_amt: { type: Number, default: 0 },
  tax_amt: { type: Number, default: 0 },
  total_amount: Number,
  paid_amount: { type: Number, default: 0 },
  balance_due: Number,
  status: { type: String, enum: ['pending', 'paid', 'partial', 'overdue'], default: 'pending' }
});

// Billing Payment Schema
const paymentSchema = new mongoose.Schema({
  invoice_id: String,
  patient_id: String,
  payment_date: { type: Date, default: Date.now },
  amount_paid: Number,
  payment_method: { type: String, enum: ['cash', 'card', 'upi', 'netbanking'] },
  transaction_id: String,
  payment_gateway: String,
  payment_status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
const Payment = mongoose.model('Payment', paymentSchema);

// GET all invoices
router.get('/invoices', async function(req, res) {
  try {
    const invoices = await Invoice.find().sort({ invoice_date: -1 });
    res.json({ success: true, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET invoice by patient
router.get('/invoices/patient/:patient_id', async function(req, res) {
  try {
    const invoices = await Invoice.find({ patient_id: req.params.patient_id });
    res.json({ success: true, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create invoice
router.post('/invoices', async function(req, res) {
  try {
    var b = req.body;
    var invoiceNumber = 'INV-' + Date.now();
    var subtotal = b.subtotal || 0;
    var discount = b.discount_amt || 0;
    var tax = b.tax_amt || 0;
    var total = subtotal - discount + tax;
    var invoice = new Invoice({
      ...b,
      invoice_number: invoiceNumber,
      total_amount: total,
      balance_due: total - (b.paid_amount || 0)
    });
    await invoice.save();
    res.status(201).json({ success: true, message: 'Invoice created successfully', data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update invoice status
router.put('/invoices/:id', async function(req, res) {
  try {
    const result = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!result) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, message: 'Invoice updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE invoice
router.delete('/invoices/:id', async function(req, res) {
  try {
    const result = await Invoice.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all payments
router.get('/payments', async function(req, res) {
  try {
    const payments = await Payment.find().sort({ payment_date: -1 });
    res.json({ success: true, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create payment
router.post('/payments', async function(req, res) {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    // Update invoice paid amount
    const invoice = await Invoice.findById(req.body.invoice_id);
    if (invoice) {
      var newPaid = (invoice.paid_amount || 0) + req.body.amount_paid;
      var newBalance = invoice.total_amount - newPaid;
      var newStatus = newBalance <= 0 ? 'paid' : 'partial';
      await Invoice.findByIdAndUpdate(req.body.invoice_id, {
        paid_amount: newPaid,
        balance_due: newBalance,
        status: newStatus
      });
    }
    res.status(201).json({ success: true, message: 'Payment recorded successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;