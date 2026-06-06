import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Tabs, Tab, MenuItem, Select,
  FormControl, InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';

const API = 'http://localhost:5000/api/billing';

export default function Billing() {
  const [tab, setTab] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [open, setOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    patient_id: '', appt_id: '', subtotal: '',
    discount_amt: '', tax_amt: '', paid_amount: '',
    due_date: '', status: 'pending'
  });
  const [paymentForm, setPaymentForm] = useState({
    invoice_id: '', patient_id: '', amount_paid: '',
    payment_method: 'cash', transaction_id: ''
  });

  const loadData = async () => {
    try {
      const [inv, pay] = await Promise.all([
        axios.get(API + '/invoices'),
        axios.get(API + '/payments')
      ]);
      setInvoices(inv.data.data || []);
      setPayments(pay.data.data || []);
    } catch {}
  };

  useEffect(() => { loadData(); }, []);

  const handleSaveInvoice = async () => {
    try {
      await axios.post(API + '/invoices', invoiceForm);
      setOpen(false);
      loadData();
    } catch { alert('Error creating invoice'); }
  };

  const handleSavePayment = async () => {
    try {
      await axios.post(API + '/payments', paymentForm);
      setOpen(false);
      loadData();
    } catch { alert('Error recording payment'); }
  };

  const getStatusColor = (status: string) => {
    if (status === 'paid') return 'success';
    if (status === 'overdue') return 'error';
    if (status === 'partial') return 'warning';
    return 'default';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700} color="#6a1b9a">
          💰 Billing Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}
          sx={{ backgroundColor: '#6a1b9a' }} onClick={() => setOpen(true)}>
          {tab === 0 ? 'Create Invoice' : 'Record Payment'}
        </Button>
      </Box>

      {/* Stats */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 140, borderTop: '4px solid #6a1b9a' }}>
          <Typography variant="h4" fontWeight={700} color="#6a1b9a">{invoices.length}</Typography>
          <Typography variant="body2" color="text.secondary">Total Invoices</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 140, borderTop: '4px solid #2e7d32' }}>
          <Typography variant="h4" fontWeight={700} color="#2e7d32">
            {(invoices as any[]).filter((i: any) => i.status === 'paid').length}
          </Typography>
          <Typography variant="body2" color="text.secondary">Paid</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 140, borderTop: '4px solid #f57c00' }}>
          <Typography variant="h4" fontWeight={700} color="#f57c00">
            {(invoices as any[]).filter((i: any) => i.status === 'pending').length}
          </Typography>
          <Typography variant="body2" color="text.secondary">Pending</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 140, borderTop: '4px solid #c62828' }}>
          <Typography variant="h4" fontWeight={700} color="#c62828">
            {(invoices as any[]).filter((i: any) => i.status === 'overdue').length}
          </Typography>
          <Typography variant="body2" color="text.secondary">Overdue</Typography>
        </Paper>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab icon={<ReceiptIcon />} label="Invoices" />
        <Tab icon={<PaymentIcon />} label="Payments" />
      </Tabs>

      {/* Invoices Tab */}
      {tab === 0 && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f3e5f5' }}>
              <TableRow>
                <TableCell><b>Invoice #</b></TableCell>
                <TableCell><b>Patient ID</b></TableCell>
                <TableCell><b>Total</b></TableCell>
                <TableCell><b>Paid</b></TableCell>
                <TableCell><b>Balance</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Due Date</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((inv: any) => (
                <TableRow key={inv._id}>
                  <TableCell><b>{inv.invoice_number}</b></TableCell>
                  <TableCell>{inv.patient_id}</TableCell>
                  <TableCell>₹{inv.total_amount}</TableCell>
                  <TableCell>₹{inv.paid_amount}</TableCell>
                  <TableCell>₹{inv.balance_due}</TableCell>
                  <TableCell>
                    <Chip label={inv.status} size="small"
                      color={getStatusColor(inv.status) as any} />
                  </TableCell>
                  <TableCell>{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Payments Tab */}
      {tab === 1 && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f3e5f5' }}>
              <TableRow>
                <TableCell><b>Invoice ID</b></TableCell>
                <TableCell><b>Patient ID</b></TableCell>
                <TableCell><b>Amount Paid</b></TableCell>
                <TableCell><b>Method</b></TableCell>
                <TableCell><b>Transaction ID</b></TableCell>
                <TableCell><b>Status</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((p: any) => (
                <TableRow key={p._id}>
                  <TableCell>{p.invoice_id}</TableCell>
                  <TableCell>{p.patient_id}</TableCell>
                  <TableCell>₹{p.amount_paid}</TableCell>
                  <TableCell><Chip label={p.payment_method} size="small" /></TableCell>
                  <TableCell>{p.transaction_id || '—'}</TableCell>
                  <TableCell>
                    <Chip label={p.payment_status} size="small"
                      color={p.payment_status === 'success' ? 'success' : 'error'} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{tab === 0 ? 'Create Invoice' : 'Record Payment'}</DialogTitle>
        <DialogContent>
          {tab === 0 && (
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
              <TextField label="Patient ID *" value={invoiceForm.patient_id} onChange={e => setInvoiceForm({ ...invoiceForm, patient_id: e.target.value })} />
              <TextField label="Appointment ID" value={invoiceForm.appt_id} onChange={e => setInvoiceForm({ ...invoiceForm, appt_id: e.target.value })} />
              <TextField label="Subtotal (₹)" type="number" value={invoiceForm.subtotal} onChange={e => setInvoiceForm({ ...invoiceForm, subtotal: e.target.value })} />
              <TextField label="Discount (₹)" type="number" value={invoiceForm.discount_amt} onChange={e => setInvoiceForm({ ...invoiceForm, discount_amt: e.target.value })} />
              <TextField label="Tax (₹)" type="number" value={invoiceForm.tax_amt} onChange={e => setInvoiceForm({ ...invoiceForm, tax_amt: e.target.value })} />
              <TextField label="Paid Amount (₹)" type="number" value={invoiceForm.paid_amount} onChange={e => setInvoiceForm({ ...invoiceForm, paid_amount: e.target.value })} />
              <TextField label="Due Date" type="date" InputLabelProps={{ shrink: true }} value={invoiceForm.due_date} onChange={e => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })} />
              <FormControl>
                <InputLabel>Status</InputLabel>
                <Select value={invoiceForm.status} label="Status" onChange={e => setInvoiceForm({ ...invoiceForm, status: e.target.value })}>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="partial">Partial</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
          {tab === 1 && (
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
              <TextField label="Invoice ID *" value={paymentForm.invoice_id} onChange={e => setPaymentForm({ ...paymentForm, invoice_id: e.target.value })} />
              <TextField label="Patient ID *" value={paymentForm.patient_id} onChange={e => setPaymentForm({ ...paymentForm, patient_id: e.target.value })} />
              <TextField label="Amount Paid (₹) *" type="number" value={paymentForm.amount_paid} onChange={e => setPaymentForm({ ...paymentForm, amount_paid: e.target.value })} />
              <FormControl>
                <InputLabel>Payment Method</InputLabel>
                <Select value={paymentForm.payment_method} label="Payment Method" onChange={e => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="netbanking">Net Banking</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Transaction ID" value={paymentForm.transaction_id} onChange={e => setPaymentForm({ ...paymentForm, transaction_id: e.target.value })} sx={{ gridColumn: 'span 2' }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: '#6a1b9a' }}
            onClick={tab === 0 ? handleSaveInvoice : handleSavePayment}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}