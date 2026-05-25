import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const API = 'http://localhost:5000/api/patients';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    patient_id: '', first_name: '', last_name: '',
    email_id: '', phone_no: '', date_of_birth: '',
    gender: '', blood_group: '', Patient_address: '',
    blood_pressure: '', diabetes: '', thyroid: '', cholesterol: ''
  });

  const loadPatients = async () => {
    try {
      const res = await axios.get(API);
      setPatients(res.data.data || []);
    } catch {}
  };

  useEffect(() => { loadPatients(); }, []);

  const handleSave = async () => {
    try {
      await axios.post(API, form);
      setOpen(false);
      loadPatients();
    } catch (err) {
      alert('Error saving patient');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deactivate this patient?')) return;
    try {
      await axios.delete(API + '/' + id);
      loadPatients();
    } catch {}
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700} color="#1a6b5a">
          🏥 Patient Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}
          sx={{ backgroundColor: '#1a6b5a' }}
          onClick={() => setOpen(true)}>
          Add Patient
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#e8f5f2' }}>
            <TableRow>
              <TableCell><b>Patient</b></TableCell>
              <TableCell><b>Gender</b></TableCell>
              <TableCell><b>Blood Group</b></TableCell>
              <TableCell><b>Phone</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((p: any) => (
              <TableRow key={p._id}>
                <TableCell>
                  <b>{p.first_name} {p.last_name}</b>
                  <br /><small style={{ color: '#888' }}>{p.patient_id} · {p.email_id}</small>
                </TableCell>
                <TableCell>{p.gender || '—'}</TableCell>
                <TableCell>
                  {p.blood_group ? <Chip label={p.blood_group} size="small" color="warning" /> : '—'}
                </TableCell>
                <TableCell>{p.phone_no || '—'}</TableCell>
                <TableCell>
                  <Chip label={p.is_active ? 'Active' : 'Inactive'}
                    color={p.is_active ? 'success' : 'error'} size="small" />
                </TableCell>
                <TableCell>
                  <Button size="small" color="error"
                    onClick={() => handleDelete(p.patient_id)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Patient</DialogTitle>
        <DialogContent>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
            <TextField label="Patient ID *" value={form.patient_id} onChange={e => setForm({ ...form, patient_id: e.target.value })} />
            <TextField label="First Name *" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
            <TextField label="Last Name *" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
            <TextField label="Email *" value={form.email_id} onChange={e => setForm({ ...form, email_id: e.target.value })} />
            <TextField label="Phone" value={form.phone_no} onChange={e => setForm({ ...form, phone_no: e.target.value })} />
            <TextField label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} />
            <FormControl>
              <InputLabel>Gender</InputLabel>
              <Select value={form.gender} label="Gender" onChange={e => setForm({ ...form, gender: e.target.value })}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Blood Group</InputLabel>
              <Select value={form.blood_group} label="Blood Group" onChange={e => setForm({ ...form, blood_group: e.target.value })}>
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => <MenuItem key={bg} value={bg}>{bg}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Address" value={form.Patient_address} onChange={e => setForm({ ...form, Patient_address: e.target.value })} sx={{ gridColumn: 'span 2' }} />
            <TextField label="Blood Pressure" value={form.blood_pressure} onChange={e => setForm({ ...form, blood_pressure: e.target.value })} />
            <TextField label="Diabetes" value={form.diabetes} onChange={e => setForm({ ...form, diabetes: e.target.value })} />
            <TextField label="Thyroid" value={form.thyroid} onChange={e => setForm({ ...form, thyroid: e.target.value })} />
            <TextField label="Cholesterol" value={form.cholesterol} onChange={e => setForm({ ...form, cholesterol: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: '#1a6b5a' }} onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}