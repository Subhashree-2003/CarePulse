import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Tabs, Tab, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MedicationIcon from '@mui/icons-material/Medication';
import DeleteIcon from '@mui/icons-material/Delete';

const TELE_API = 'http://localhost:5000/api/telemedicine/sessions';
const PRESC_API = 'http://localhost:5000/api/telemedicine/prescriptions';

export default function Telemedicine() {
  const [tab, setTab] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    patient_id: '', doctor_id: '', session_date: '',
    session_time: '', duration_minutes: '30', notes: ''
  });
  const [prescForm, setPrescForm] = useState({
    patient_id: '', doctor_id: '', diagnosis: '',
    notes: '', medicine_name: '', dosage: '',
    frequency: '', duration: '', instructions: ''
  });

  const loadData = async () => {
    try {
      const [s, p] = await Promise.all([
        axios.get(TELE_API),
        axios.get(PRESC_API)
      ]);
      setSessions(s.data.data || []);
      setPrescriptions(p.data.data || []);
    } catch {}
  };

  useEffect(() => { loadData(); }, []);

  const handleSaveSession = async () => {
    try {
      await axios.post(TELE_API, sessionForm);
      setOpen(false);
      loadData();
    } catch { alert('Error creating session'); }
  };

  const handleSavePrescription = async () => {
    try {
      var body = {
        patient_id: prescForm.patient_id,
        doctor_id: prescForm.doctor_id,
        diagnosis: prescForm.diagnosis,
        notes: prescForm.notes,
        medicines: [{
          medicine_name: prescForm.medicine_name,
          dosage: prescForm.dosage,
          frequency: prescForm.frequency,
          duration: prescForm.duration,
          instructions: prescForm.instructions
        }]
      };
      await axios.post(PRESC_API, body);
      setOpen(false);
      loadData();
    } catch { alert('Error creating prescription'); }
  };

  const handleDeleteSession = async (id: string) => {
    if (!window.confirm('Cancel this session?')) return;
    try {
      await axios.delete(TELE_API + '/' + id);
      loadData();
    } catch {}
  };

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'success';
    if (status === 'ongoing') return 'warning';
    if (status === 'cancelled') return 'error';
    return 'info';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700} color="#01579b">
          📹 Telemedicine & Prescriptions
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}
          sx={{ backgroundColor: '#01579b' }} onClick={() => setOpen(true)}>
          {tab === 0 ? 'New Session' : 'New Prescription'}
        </Button>
      </Box>

      {/* Stats */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 140, borderTop: '4px solid #01579b' }}>
          <Typography variant="h4" fontWeight={700} color="#01579b">{sessions.length}</Typography>
          <Typography variant="body2" color="text.secondary">Total Sessions</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 140, borderTop: '4px solid #2e7d32' }}>
          <Typography variant="h4" fontWeight={700} color="#2e7d32">
            {(sessions as any[]).filter((s: any) => s.status === 'completed').length}
          </Typography>
          <Typography variant="body2" color="text.secondary">Completed</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 140, borderTop: '4px solid #6a1b9a' }}>
          <Typography variant="h4" fontWeight={700} color="#6a1b9a">{prescriptions.length}</Typography>
          <Typography variant="body2" color="text.secondary">Prescriptions</Typography>
        </Paper>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab icon={<VideoCallIcon />} label="Sessions" />
        <Tab icon={<MedicationIcon />} label="Prescriptions" />
      </Tabs>

      {/* Sessions Tab */}
      {tab === 0 && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#e1f5fe' }}>
              <TableRow>
                <TableCell><b>Session ID</b></TableCell>
                <TableCell><b>Patient ID</b></TableCell>
                <TableCell><b>Doctor ID</b></TableCell>
                <TableCell><b>Date & Time</b></TableCell>
                <TableCell><b>Duration</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Meeting Link</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((s: any) => (
                <TableRow key={s._id}>
                  <TableCell>{s.session_id}</TableCell>
                  <TableCell>{s.patient_id}</TableCell>
                  <TableCell>{s.doctor_id}</TableCell>
                  <TableCell>
                    {s.session_date ? new Date(s.session_date).toLocaleDateString() : '—'}
                    {' '}{s.session_time}
                  </TableCell>
                  <TableCell>{s.duration_minutes} min</TableCell>
                  <TableCell>
                    <Chip label={s.status} size="small" color={getStatusColor(s.status) as any} />
                  </TableCell>
                  <TableCell>
                    {s.meeting_link && (
                      <Button size="small" variant="outlined" color="primary"
                        onClick={() => window.open(s.meeting_link, '_blank')}>
                        Join
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="error" onClick={() => handleDeleteSession(s._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Prescriptions Tab */}
      {tab === 1 && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#e1f5fe' }}>
              <TableRow>
                <TableCell><b>Prescription ID</b></TableCell>
                <TableCell><b>Patient ID</b></TableCell>
                <TableCell><b>Doctor ID</b></TableCell>
                <TableCell><b>Diagnosis</b></TableCell>
                <TableCell><b>Medicines</b></TableCell>
                <TableCell><b>Date</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prescriptions.map((p: any) => (
                <TableRow key={p._id}>
                  <TableCell>{p.prescription_id}</TableCell>
                  <TableCell>{p.patient_id}</TableCell>
                  <TableCell>{p.doctor_id}</TableCell>
                  <TableCell>{p.diagnosis}</TableCell>
                  <TableCell>
                    {p.medicines?.map((m: any, i: number) => (
                      <Chip key={i} label={m.medicine_name + ' ' + m.dosage} size="small" sx={{ mr: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>{new Date(p.prescribed_date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{tab === 0 ? 'New Telemedicine Session' : 'New Prescription'}</DialogTitle>
        <DialogContent>
          {tab === 0 && (
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
              <TextField label="Patient ID *" value={sessionForm.patient_id} onChange={e => setSessionForm({ ...sessionForm, patient_id: e.target.value })} />
              <TextField label="Doctor ID *" value={sessionForm.doctor_id} onChange={e => setSessionForm({ ...sessionForm, doctor_id: e.target.value })} />
              <TextField label="Session Date" type="date" InputLabelProps={{ shrink: true }} value={sessionForm.session_date} onChange={e => setSessionForm({ ...sessionForm, session_date: e.target.value })} />
              <TextField label="Session Time" type="time" InputLabelProps={{ shrink: true }} value={sessionForm.session_time} onChange={e => setSessionForm({ ...sessionForm, session_time: e.target.value })} />
              <TextField label="Duration (minutes)" type="number" value={sessionForm.duration_minutes} onChange={e => setSessionForm({ ...sessionForm, duration_minutes: e.target.value })} />
              <TextField label="Notes" value={sessionForm.notes} onChange={e => setSessionForm({ ...sessionForm, notes: e.target.value })} />
            </Box>
          )}
          {tab === 1 && (
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
              <TextField label="Patient ID *" value={prescForm.patient_id} onChange={e => setPrescForm({ ...prescForm, patient_id: e.target.value })} />
              <TextField label="Doctor ID *" value={prescForm.doctor_id} onChange={e => setPrescForm({ ...prescForm, doctor_id: e.target.value })} />
              <TextField label="Diagnosis" value={prescForm.diagnosis} onChange={e => setPrescForm({ ...prescForm, diagnosis: e.target.value })} sx={{ gridColumn: 'span 2' }} />
              <TextField label="Medicine Name *" value={prescForm.medicine_name} onChange={e => setPrescForm({ ...prescForm, medicine_name: e.target.value })} />
              <TextField label="Dosage" value={prescForm.dosage} onChange={e => setPrescForm({ ...prescForm, dosage: e.target.value })} />
              <TextField label="Frequency" value={prescForm.frequency} onChange={e => setPrescForm({ ...prescForm, frequency: e.target.value })} />
              <TextField label="Duration" value={prescForm.duration} onChange={e => setPrescForm({ ...prescForm, duration: e.target.value })} />
              <TextField label="Instructions" value={prescForm.instructions} onChange={e => setPrescForm({ ...prescForm, instructions: e.target.value })} sx={{ gridColumn: 'span 2' }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: '#01579b' }}
            onClick={tab === 0 ? handleSaveSession : handleSavePrescription}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}