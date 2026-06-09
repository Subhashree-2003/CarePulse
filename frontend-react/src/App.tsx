import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, Drawer, List,
  ListItemIcon, ListItemText, ListItemButton, Divider,
  CssBaseline, Avatar, Menu, MenuItem, Chip
} from '@mui/material';

import LoginPage from './pages/LoginPage';
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
import LogoutIcon from '@mui/icons-material/Logout';

const DRAWER_WIDTH = 220;

// Role based menu items
const allMenuItems = [
  { label: 'Patients', path: '/patients', icon: <PeopleIcon />, color: '#1a6b5a', roles: ['patient', 'doctor', 'admin'] },
  { label: 'Appointments', path: '/appointments', icon: <CalendarMonthIcon />, color: '#2d6a9f', roles: ['patient', 'doctor', 'admin'] },
  { label: 'EHR', path: '/ehr', icon: <MedicalServicesIcon />, color: '#1565c0', roles: ['doctor', 'admin'] },
  { label: 'Billing', path: '/billing', icon: <ReceiptIcon />, color: '#6a1b9a', roles: ['patient', 'admin'] },
  { label: 'Doctors', path: '/doctors', icon: <LocalHospitalIcon />, color: '#00695c', roles: ['doctor', 'admin'] },
  { label: 'Admin', path: '/admin', icon: <AdminPanelSettingsIcon />, color: '#4a148c', roles: ['admin'] },
  { label: 'Auth & Security', path: '/auth', icon: <LockIcon />, color: '#b71c1c', roles: ['admin'] },
  { label: 'Telemedicine', path: '/telemedicine', icon: <VideoCallIcon />, color: '#01579b', roles: ['patient', 'doctor', 'admin'] },
];

const getRoleColor = (role: string) => {
  if (role === 'admin') return 'error';
  if (role === 'doctor') return 'primary';
  return 'success';
};

function Sidebar({ user, onLogout }: { user: any, onLogout: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuItems = allMenuItems.filter(item => item.roles.includes(user?.role));

  return (
    <Drawer variant="permanent" sx={{
      width: DRAWER_WIDTH,
      flexShrink: 0,
      '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', mt: '64px' }
    }}>
      {/* User Info */}
      <Box sx={{ p: 2, backgroundColor: '#f5f5f5', cursor: 'pointer' }}
        onClick={e => setAnchorEl(e.currentTarget)}>
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ bgcolor: '#1a6b5a', width: 36, height: 36, fontSize: '0.9rem' }}>
            {user?.user_name?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={700} noWrap>{user?.user_name}</Typography>
            <Chip label={user?.role} size="small" color={getRoleColor(user?.role) as any} sx={{ height: 18, fontSize: '0.7rem' }} />
          </Box>
        </Box>
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={onLogout}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
        </MenuItem>
      </Menu>

      <Divider />

      <List>
        {menuItems.map((item, index) => (
          <div key={item.path}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{ '&.Mui-selected': { backgroundColor: item.color + '15', borderLeft: '3px solid ' + item.color } }}>
              <ListItemIcon sx={{ color: item.color, minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 500 }} />
            </ListItemButton>
            {(index === 1 || index === 3) && <Divider sx={{ my: 0.5 }} />}
          </div>
        ))}
      </List>
    </Drawer>
  );
}

function MainApp({ user, onLogout }: { user: any, onLogout: () => void }) {
  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#1a6b5a', zIndex: 1201 }}>
        <Toolbar>
          <LocalHospitalIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>
            CarePulse — Telemedicine Platform
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Welcome, {user?.user_name}!
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', mt: '64px' }}>
        <Sidebar user={user} onLogout={onLogout} />
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
    </>
  );
}

function App() {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('carepulse_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('carepulse_token');
    localStorage.removeItem('carepulse_user');
    setUser(null);
  };

  return (
    <Router>
      <CssBaseline />
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <MainApp user={user} onLogout={handleLogout} />
      )}
    </Router>
  );
}

export default App;