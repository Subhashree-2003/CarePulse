import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const API = 'http://localhost:5000/api/appointments';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    patient_id: '', patient_name: '',
    doctor_id: '', appt_date: '', appt_time: ''
  });

  const loadAppointments = async () => {
    try {
      const res = await axios.get(API);
      setAppointments(res.data.data || []);
    } catch {}
  };

  useEffect(() => { loadAppointments(); }, []);

  const handleSave = async () => {
    try {
      await axios.post(API, form);
      setOpen(false);
      loadAppointments();
    } catch {
      alert('Error booking appointment');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await axios.delete(API + '/' + id);
      loadAppointments();
    } catch {}
  };

  const getStatus = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const date = dateStr ? dateStr.split('T')[0] : '';
    if (date === today) return 'today';
    if (date > today) return 'upcoming';
    return 'past';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700} color="#2d6a9f">
          📅 Appointment Scheduling
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}
          sx={{ backgroundColor: '#2d6a9f' }}
          onClick={() => setOpen(true)}>
          Book Appointment
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#e8f0f9' }}>
            <TableRow>
              <TableCell><b>Patient</b></TableCell>
              <TableCell><b>Doctor ID</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Time</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((a: any) => {
              const status = getStatus(a.appt_date);
              return (
                <TableRow key={a._id}>
                  <TableCell>
                    <b>{a.patient_name}</b>
                    <br /><small style={{ color: '#888' }}>{a.patient_id}</small>
                  </TableCell>
                  <TableCell>{a.doctor_id}</TableCell>
                  <TableCell>{a.appt_date ? a.appt_date.split('T')[0] : '—'}</TableCell>
                  <TableCell>{a.appt_time || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={status}
                      color={status === 'today' ? 'warning' : status === 'upcoming' ? 'info' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="small" color="error" onClick={() => handleDelete(a._id)}>
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book Appointment</DialogTitle>
        <DialogContent>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
            <TextField label="Patient ID *" value={form.patient_id} onChange={e => setForm({ ...form, patient_id: e.target.value })} />
            <TextField label="Patient Name *" value={form.patient_name} onChange={e => setForm({ ...form, patient_name: e.target.value })} />
            <TextField label="Doctor ID *" value={form.doctor_id} onChange={e => setForm({ ...form, doctor_id: e.target.value })} sx={{ gridColumn: 'span 2' }} />
            <TextField label="Date *" type="date" InputLabelProps={{ shrink: true }} value={form.appt_date} onChange={e => setForm({ ...form, appt_date: e.target.value })} />
            <TextField label="Time *" type="time" InputLabelProps={{ shrink: true }} value={form.appt_time} onChange={e => setForm({ ...form, appt_time: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: '#2d6a9f' }} onClick={handleSave}>Book</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}