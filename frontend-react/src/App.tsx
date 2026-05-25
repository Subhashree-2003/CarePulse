import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function App() {
  return (
    <Router>
      <AppBar position="static" sx={{ backgroundColor: '#1a6b5a' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            🏥 CarePulse
          </Typography>
          <Button color="inherit" href="/patients">Patients</Button>
          <Button color="inherit" href="/appointments">Appointments</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 3 }}>
        <Routes>
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/" element={<Patients />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;