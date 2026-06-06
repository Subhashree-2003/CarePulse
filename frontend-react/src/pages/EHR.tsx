import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Tabs, Tab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const API = 'http://localhost:5000/api/ehr';

export default function EHR() {
  const [tab, setTab] = useState(0);
  const [visits, setVisits] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [open, setOpen] = useState(false);
  const [visitForm, setVisitForm] = useState({
    patient_id: '', doc_id: '', visit_date: '',
    chief_complaint: '', visit_notes: '', follow_up_date: ''
  });
  const [vitalForm, setVitalForm] = useState({
    patient_id: '', visit_id: '', temperature_c: '',
    pulse_bpm: '', bp_systolic: '', bp_diastolic: '',
    spo2_percent: '', height_cm: '', weight_kg: '', bmi: ''
  });
  const [diagnosisForm, setDiagnosisForm] = useState({
    patient_id: '', visit_id: '', icd_code: '',
    diagnosis_name: '', diagnosis_type: '', severity: '',
    notes: '', diagnosed_by: ''
  });

  const loadData = async () => {
    try {
      const [v, vt, d] = await Promise.all([
        axios.get(API + '/visits'),
        axios.get(API + '/vitals'),
        axios.get(API + '/diagnoses')
      ]);
      setVisits(v.data.data || []);
      setVitals(vt.data.data || []);
      setDiagnoses(d.data.data || []);
    } catch {}
  };

  useEffect(() => { loadData(); }, []);

  const handleSaveVisit = async () => {
    try {
      await axios.post(API + '/visits', visitForm);
      setOpen(false);
      loadData();
    } catch { alert('Error saving visit'); }
  };

  const handleSaveVital = async () => {
    try {
      await axios.post(API + '/vitals', vitalForm);
      setOpen(false);
      loadData();
    } catch { alert('Error saving vitals'); }
  };

  const handleSaveDiagnosis = async () => {
    try {
      await axios.post(API + '/diagnoses', diagnosisForm);
      setOpen(false);
      loadData();
    } catch { alert('Error saving diagnosis'); }
  };

  const getSeverityColor = (severity: string) => {
    if (severity === 'critical') return 'error';
    if (severity === 'moderate') return 'warning';
    return 'success';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700} color="#1565c0">
          🏥 Electronic Health Records
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}
          sx={{ backgroundColor: '#1565c0' }} onClick={() => setOpen(true)}>
          Add Record
        </Button>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab icon={<MedicalServicesIcon />} label="Visits" />
        <Tab icon={<MonitorHeartIcon />} label="Vitals" />
        <Tab icon={<LocalHospitalIcon />} label="Diagnoses" />
      </Tabs>

      {/* Visits Tab */}
      {tab === 0 && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
              <TableRow>
                <TableCell><b>Patient ID</b></TableCell>
                <TableCell><b>Doctor ID</b></TableCell>
                <TableCell><b>Visit Date</b></TableCell>
                <TableCell><b>Chief Complaint</b></TableCell>
                <TableCell><b>Follow Up</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visits.map((v: any) => (
                <TableRow key={v._id}>
                  <TableCell>{v.patient_id}</TableCell>
                  <TableCell>{v.doc_id}</TableCell>
                  <TableCell>{v.visit_date ? new Date(v.visit_date).toLocaleDateString() : '—'}</TableCell>
                  <TableCell>{v.chief_complaint}</TableCell>
                  <TableCell>{v.follow_up_date ? new Date(v.follow_up_date).toLocaleDateString() : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Vitals Tab */}
      {tab === 1 && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
              <TableRow>
                <TableCell><b>Patient ID</b></TableCell>
                <TableCell><b>Temp (°C)</b></TableCell>
                <TableCell><b>Pulse</b></TableCell>
                <TableCell><b>BP</b></TableCell>
                <TableCell><b>SpO2%</b></TableCell>
                <TableCell><b>BMI</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vitals.map((v: any) => (
                <TableRow key={v._id}>
                  <TableCell>{v.patient_id}</TableCell>
                  <TableCell>{v.temperature_c}</TableCell>
                  <TableCell>{v.pulse_bpm} bpm</TableCell>
                  <TableCell>{v.bp_systolic}/{v.bp_diastolic}</TableCell>
                  <TableCell>{v.spo2_percent}%</TableCell>
                  <TableCell>{v.bmi}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Diagnoses Tab */}
      {tab === 2 && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
              <TableRow>
                <TableCell><b>Patient ID</b></TableCell>
                <TableCell><b>Diagnosis</b></TableCell>
                <TableCell><b>ICD Code</b></TableCell>
                <TableCell><b>Type</b></TableCell>
                <TableCell><b>Severity</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {diagnoses.map((d: any) => (
                <TableRow key={d._id}>
                  <TableCell>{d.patient_id}</TableCell>
                  <TableCell>{d.diagnosis_name}</TableCell>
                  <TableCell><Chip label={d.icd_code} size="small" /></TableCell>
                  <TableCell>{d.diagnosis_type}</TableCell>
                  <TableCell>
                    <Chip label={d.severity} size="small"
                      color={getSeverityColor(d.severity) as any} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Record Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {tab === 0 ? 'Add Visit' : tab === 1 ? 'Record Vitals' : 'Add Diagnosis'}
        </DialogTitle>
        <DialogContent>
          {tab === 0 && (
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
              <TextField label="Patient ID *" value={visitForm.patient_id} onChange={e => setVisitForm({ ...visitForm, patient_id: e.target.value })} />
              <TextField label="Doctor ID *" value={visitForm.doc_id} onChange={e => setVisitForm({ ...visitForm, doc_id: e.target.value })} />
              <TextField label="Visit Date" type="date" InputLabelProps={{ shrink: true }} value={visitForm.visit_date} onChange={e => setVisitForm({ ...visitForm, visit_date: e.target.value })} />
              <TextField label="Follow Up Date" type="date" InputLabelProps={{ shrink: true }} value={visitForm.follow_up_date} onChange={e => setVisitForm({ ...visitForm, follow_up_date: e.target.value })} />
              <TextField label="Chief Complaint" value={visitForm.chief_complaint} onChange={e => setVisitForm({ ...visitForm, chief_complaint: e.target.value })} sx={{ gridColumn: 'span 2' }} />
              <TextField label="Visit Notes" multiline rows={3} value={visitForm.visit_notes} onChange={e => setVisitForm({ ...visitForm, visit_notes: e.target.value })} sx={{ gridColumn: 'span 2' }} />
            </Box>
          )}
          {tab === 1 && (
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
              <TextField label="Patient ID *" value={vitalForm.patient_id} onChange={e => setVitalForm({ ...vitalForm, patient_id: e.target.value })} />
              <TextField label="Visit ID" value={vitalForm.visit_id} onChange={e => setVitalForm({ ...vitalForm, visit_id: e.target.value })} />
              <TextField label="Temperature (°C)" value={vitalForm.temperature_c} onChange={e => setVitalForm({ ...vitalForm, temperature_c: e.target.value })} />
              <TextField label="Pulse (bpm)" value={vitalForm.pulse_bpm} onChange={e => setVitalForm({ ...vitalForm, pulse_bpm: e.target.value })} />
              <TextField label="BP Systolic" value={vitalForm.bp_systolic} onChange={e => setVitalForm({ ...vitalForm, bp_systolic: e.target.value })} />
              <TextField label="BP Diastolic" value={vitalForm.bp_diastolic} onChange={e => setVitalForm({ ...vitalForm, bp_diastolic: e.target.value })} />
              <TextField label="SpO2 %" value={vitalForm.spo2_percent} onChange={e => setVitalForm({ ...vitalForm, spo2_percent: e.target.value })} />
              <TextField label="BMI" value={vitalForm.bmi} onChange={e => setVitalForm({ ...vitalForm, bmi: e.target.value })} />
            </Box>
          )}
          {tab === 2 && (
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
              <TextField label="Patient ID *" value={diagnosisForm.patient_id} onChange={e => setDiagnosisForm({ ...diagnosisForm, patient_id: e.target.value })} />
              <TextField label="ICD Code" value={diagnosisForm.icd_code} onChange={e => setDiagnosisForm({ ...diagnosisForm, icd_code: e.target.value })} />
              <TextField label="Diagnosis Name *" value={diagnosisForm.diagnosis_name} onChange={e => setDiagnosisForm({ ...diagnosisForm, diagnosis_name: e.target.value })} sx={{ gridColumn: 'span 2' }} />
              <TextField label="Type" value={diagnosisForm.diagnosis_type} onChange={e => setDiagnosisForm({ ...diagnosisForm, diagnosis_type: e.target.value })} />
              <TextField label="Severity" value={diagnosisForm.severity} onChange={e => setDiagnosisForm({ ...diagnosisForm, severity: e.target.value })} />
              <TextField label="Notes" multiline rows={2} value={diagnosisForm.notes} onChange={e => setDiagnosisForm({ ...diagnosisForm, notes: e.target.value })} sx={{ gridColumn: 'span 2' }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: '#1565c0' }}
            onClick={tab === 0 ? handleSaveVisit : tab === 1 ? handleSaveVital : handleSaveDiagnosis}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}