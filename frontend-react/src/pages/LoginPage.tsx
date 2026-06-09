import { useState } from 'react';
import axios from 'axios';
import {
  Box, Button, TextField, Typography, Paper,
  Tabs, Tab, Alert, MenuItem, Select,
  FormControl, InputLabel, Divider
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LockIcon from '@mui/icons-material/Lock';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const API = 'http://localhost:5000/api/auth';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [tab, setTab] = useState(0);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    user_name: '', email: '', password: '', role: 'patient'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      const res = await axios.post(API + '/login', loginForm);
      if (res.data.success) {
        localStorage.setItem('carepulse_token', res.data.token);
        localStorage.setItem('carepulse_user', JSON.stringify(res.data.user));
        onLogin(res.data.user);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  const handleRegister = async () => {
    try {
      setError('');
      if (!registerForm.user_name || !registerForm.email || !registerForm.password) {
        setError('Please fill all fields');
        return;
      }
      await axios.post(API + '/register', registerForm);
      setSuccess('Registration successful! Please login.');
      setTab(0);
      setLoginForm({ email: registerForm.email, password: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a6b5a 0%, #2d6a9f 50%, #1a237e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2
    }}>
      <Box sx={{ width: '100%', maxWidth: 450 }}>
        {/* Logo */}
        <Box textAlign="center" mb={4}>
          <LocalHospitalIcon sx={{ fontSize: 60, color: 'white' }} />
          <Typography variant="h3" fontWeight={800} color="white" sx={{ letterSpacing: 1 }}>
            CarePulse
          </Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.8)">
            Telemedicine Platform
          </Typography>
        </Box>

        <Paper elevation={10} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(''); setSuccess(''); }}
            variant="fullWidth" sx={{ backgroundColor: '#f5f5f5' }}>
            <Tab icon={<LockIcon />} label="Login" />
            <Tab icon={<PersonAddIcon />} label="Register" />
          </Tabs>

          <Box p={4}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            {/* LOGIN TAB */}
            {tab === 0 && (
              <Box display="flex" flexDirection="column" gap={2.5}>
                <Typography variant="h5" fontWeight={700} color="#1a6b5a" textAlign="center">
                  Welcome Back! 👋
                </Typography>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  value={loginForm.email}
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                  onKeyPress={e => e.key === 'Enter' && handleLogin()}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  onKeyPress={e => e.key === 'Enter' && handleLogin()}
                />
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ backgroundColor: '#1a6b5a', borderRadius: 2, py: 1.5, fontSize: '1rem', fontWeight: 700 }}
                  onClick={handleLogin}>
                  Login
                </Button>

                <Divider>or login as demo</Divider>

                <Box display="flex" gap={1}>
                  <Button fullWidth variant="outlined" size="small" color="success"
                    onClick={() => setLoginForm({ email: 'patient@demo.com', password: 'demo123' })}>
                    Patient
                  </Button>
                  <Button fullWidth variant="outlined" size="small" color="primary"
                    onClick={() => setLoginForm({ email: 'doctor@demo.com', password: 'demo123' })}>
                    Doctor
                  </Button>
                  <Button fullWidth variant="outlined" size="small" color="error"
                    onClick={() => setLoginForm({ email: 'admin@demo.com', password: 'demo123' })}>
                    Admin
                  </Button>
                </Box>
              </Box>
            )}

            {/* REGISTER TAB */}
            {tab === 1 && (
              <Box display="flex" flexDirection="column" gap={2.5}>
                <Typography variant="h5" fontWeight={700} color="#1a6b5a" textAlign="center">
                  Create Account 🏥
                </Typography>
                <TextField
                  label="Full Name"
                  fullWidth
                  value={registerForm.user_name}
                  onChange={e => setRegisterForm({ ...registerForm, user_name: e.target.value })}
                />
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  value={registerForm.email}
                  onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={registerForm.password}
                  onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                />
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select value={registerForm.role} label="Role"
                    onChange={e => setRegisterForm({ ...registerForm, role: e.target.value })}>
                    <MenuItem value="patient">🤒 Patient</MenuItem>
                    <MenuItem value="doctor">👨‍⚕️ Doctor</MenuItem>
                    <MenuItem value="admin">🛡️ Admin</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ backgroundColor: '#1a6b5a', borderRadius: 2, py: 1.5, fontSize: '1rem', fontWeight: 700 }}
                  onClick={handleRegister}>
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}