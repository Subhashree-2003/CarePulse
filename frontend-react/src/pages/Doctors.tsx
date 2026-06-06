import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const API = 'http://localhost:5000/api/doctors';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    doc_id: '', doc_name: '', dept: '', phone_no: '',
    mail_id: '', specialization: '', experience_years: ''
  });

  const loadDoctors = async () => {
    try {
      const res = await axios.get(API);
      setDoctors(res.data.data || []);
    } catch {}
  };

  useEffect(() => { loadDoctors(); }, []);

  const handleSave = async () => {
    try {
      await axios.post(API, form);
      setOpen(false);
      loadDoctors();
    } catch { alert('Error saving doctor'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deactivate this doctor?')) return;
    try {
      await axios.delete(API + '/' + id);
      loadDoctors();
    } catch {}
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700} color="#00695c">
          👨‍⚕️ Doctor Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}
          sx={{ backgroundColor: '#00695c' }} onClick={() => setOpen(true)}>
          Add Doctor
        </Button>
      </Box>

      {/* Stats */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 140, borderTop: '4px solid #00695c' }}>
          <Typography variant="h4" fontWeight={700} color="#00695c">{doctors.length}</Typography>
          <Typography variant="body2" color="text.secondary">Total Doctors</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 140, borderTop: '4px solid #f57c00' }}>
          <Typography variant="h4" fontWeight={700} color="#f57c00">
            {[...new Set((doctors as any[]).map((d: any) => d.dept))].length}
          </Typography>
          <Typography variant="body2" color="text.secondary">Departments</Typography>
        </Paper>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#e0f2f1' }}>
            <TableRow>
              <TableCell><b>Doctor</b></TableCell>
              <TableCell><b>Department</b></TableCell>
              <TableCell><b>Specialization</b></TableCell>
              <TableCell><b>Phone</b></TableCell>
              <TableCell><b>Experience</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((d: any) => (
              <TableRow key={d._id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ bgcolor: '#00695c', width: 36, height: 36, fontSize: '0.85rem' }}>
                      {d.doc_name?.[0]}
                    </Avatar>
                    <Box>
                      <b>Dr. {d.doc_name}</b>
                      <br /><small style={{ color: '#888' }}>{d.doc_id} · {d.mail_id}</small>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{d.dept}</TableCell>
                <TableCell>{d.specialization || '—'}</TableCell>
                <TableCell>{d.phone_no || '—'}</TableCell>
                <TableCell>{d.experience_years ? d.experience_years + ' yrs' : '—'}</TableCell>
                <TableCell>
                  <Chip label={d.status ? 'Active' : 'Inactive'}
                    color={d.status ? 'success' : 'error'} size="small" />
                </TableCell>
                <TableCell>
                  <Button size="small" color="error" onClick={() => handleDelete(d.doc_id)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Doctor</DialogTitle>
        <DialogContent>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
            <TextField label="Doctor ID *" value={form.doc_id} onChange={e => setForm({ ...form, doc_id: e.target.value })} />
            <TextField label="Full Name *" value={form.doc_name} onChange={e => setForm({ ...form, doc_name: e.target.value })} />
            <TextField label="Department *" value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })} />
            <TextField label="Specialization" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} />
            <TextField label="Email *" value={form.mail_id} onChange={e => setForm({ ...form, mail_id: e.target.value })} />
            <TextField label="Phone" value={form.phone_no} onChange={e => setForm({ ...form, phone_no: e.target.value })} />
            <TextField label="Experience (years)" type="number" value={form.experience_years} onChange={e => setForm({ ...form, experience_years: e.target.value })} sx={{ gridColumn: 'span 2' }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: '#00695c' }} onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}