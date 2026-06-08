import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box,
  Drawer, List, ListItemIcon, ListItemText,
  ListItemButton, Divider, CssBaseline
} from '@mui/material';

import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import EHR from './pages/EHR';
import Billing from './pages/Billing';
import Doctors from './pages/Doctors';
import AdminDashboard from './pages/AdminDashboard';
import Authentication from './pages/Authentication';
import Telemedicine from './pages/Telemedicine';

import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LockIcon from '@mui/icons-material/Lock';
import VideoCallIcon from '@mui/icons-material/VideoCall';

const DRAWER_WIDTH = 220;

const menuItems = [
  { label: 'Patients', path: '/patients', icon: <PeopleIcon />, color: '#1a6b5a' },
  { label: 'Appointments', path: '/appointments', icon: <CalendarMonthIcon />, color: '#2d6a9f' },
  { label: 'EHR', path: '/ehr', icon: <MedicalServicesIcon />, color: '#1565c0' },
  { label: 'Billing', path: '/billing', icon: <ReceiptIcon />, color: '#6a1b9a' },
  { label: 'Doctors', path: '/doctors', icon: <LocalHospitalIcon />, color: '#00695c' },
  { label: 'Admin', path: '/admin', icon: <AdminPanelSettingsIcon />, color: '#4a148c' },
  { label: 'Auth & Security', path: '/auth', icon: <LockIcon />, color: '#b71c1c' },
  { label: 'Telemedicine', path: '/telemedicine', icon: <VideoCallIcon />, color: '#01579b' },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer variant="permanent" sx={{
      width: DRAWER_WIDTH,
      flexShrink: 0,
      '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', mt: '64px' }
    }}>
      <List>
        {menuItems.map((item, index) => (
          <>
            <ListItemButton key={item.path}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{ '&.Mui-selected': { backgroundColor: item.color + '15', borderLeft: '3px solid ' + item.color } }}>
              <ListItemIcon sx={{ color: item.color, minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 500 }} />
            </ListItemButton>
            {(index === 3 || index === 5) && <Divider sx={{ my: 1 }} />}
          </>
        ))}
      </List>
    </Drawer>
  );
}

function App() {
  return (
    <Router>
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: '#1a6b5a', zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
            🏥 CarePulse — Telemedicine Platform
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', mt: '64px' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, ml: DRAWER_WIDTH + 'px' }}>
          <Routes>
            <Route path="/" element={<Patients />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/ehr" element={<EHR />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/telemedicine" element={<Telemedicine />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;