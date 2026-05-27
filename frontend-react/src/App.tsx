import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Adminpage from './pages/Adminpage';
import Docdashboardpage from './pages/Docdashboardpage';

function App() {
  return (
    <Router>
      <AppBar position="static" sx={{ backgroundColor: '#1a6b5a' }}>
        <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            🏥 CarePulse
          </Typography>
          <Button color="inherit" href="/patients">Patients</Button>
          <Button color="inherit" href="/appointments">Appointments</Button>
          <Button color="inherit" href="/admin">Admin</Button>
          <Button color="inherit" href="/doctor">Doctor</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 3 }}>
        <Routes>
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/admin" element={<Adminpage />} />
          <Route path="/doctor" element={<Docdashboardpage />} />
          <Route path="/" element={<Patients />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;