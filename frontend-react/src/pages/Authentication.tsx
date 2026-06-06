import { useState } from 'react';
import axios from 'axios';
import {
  Box, Button, TextField, Typography, Paper, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Select, FormControl, InputLabel,
  Alert
} from '@mui/material';
import { useEffect } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';

const API = 'http://localhost:5000/api/auth';

export default function Authentication() {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ user_name: '', email: '', password: '', role: 'patient' });
  const [loginResult, setLoginResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await axios.get(API + '/users');
      setUsers(res.data.data || []);
    } catch {}
  };

  useEffect(() => { loadUsers(); }, []);

  const handleLogin = async () => {
    try {
      setError('');
      const res = await axios.post(API + '/login', loginForm);
      setLoginResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async () => {
    try {
      setError('');
      await axios.post(API + '/register', registerForm);
      setOpen(false);
      loadUsers();
      alert('User registered successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const getRoleColor = (role: string) => {
    if (role === 'admin') return 'error';
    if (role === 'doctor') return 'primary';
    return 'success';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700} color="#b71c1c">
          🔐 Authentication & Security
        </Typography>
        <Button variant="contained" startIcon={<PersonAddIcon />}
          sx={{ backgroundColor: '#b71c1c' }} onClick={() => setOpen(true)}>
          Register User
        </Button>
      </Box>

      {/* Stats */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 140, borderTop: '4px solid #b71c1c' }}>
          <Typography variant="h4" fontWeight={700} color="#b71c1c">{users.length}</Typography>
          <Typography variant="body2" color="text.secondary">Total Users</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 140, borderTop: '4px solid #1565c0' }}>
          <Typography variant="h4" fontWeight={700} color="#1565c0">
            {(users as any[]).filter((u: any) => u.role === 'doctor').length}
          </Typography>
          <Typography variant="body2" color="text.secondary">Doctors</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 140, borderTop: '4px solid #2e7d32' }}>
          <Typography variant="h4" fontWeight={700} color="#2e7d32">
            {(users as any[]).filter((u: any) => u.role === 'patient').length}
          </Typography>
          <Typography variant="body2" color="text.secondary">Patients</Typography>
        </Paper>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab icon={<LockIcon />} label="Login Test" />
        <Tab icon={<GroupIcon />} label="Users" />
      </Tabs>

      {/* Login Test Tab */}
      {tab === 0 && (
        <Box maxWidth={500}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Test Login</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {loginResult && (
              <Alert severity="success" sx={{ mb: 2 }}>
                ✅ Login successful! Role: {loginResult.user?.role} | Token: {loginResult.token?.substr(0, 30)}...
              </Alert>
            )}
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField label="Email" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
              <TextField label="Password" type="password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
              <Button variant="contained" sx={{ backgroundColor: '#b71c1c' }} onClick={handleLogin}>
                Login
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Users Tab */}
      {tab === 1 && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#ffebee' }}>
              <TableRow>
                <TableCell><b>User ID</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Role</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Created</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u: any) => (
                <TableRow key={u._id}>
                  <TableCell>{u.user_id}</TableCell>
                  <TableCell><b>{u.user_name}</b></TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Chip label={u.role} size="small" color={getRoleColor(u.role) as any} />
                  </TableCell>
                  <TableCell>
                    <Chip label={u.is_active ? 'Active' : 'Inactive'}
                      color={u.is_active ? 'success' : 'error'} size="small" />
                  </TableCell>
                  <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Register Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Register New User</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="Full Name *" value={registerForm.user_name} onChange={e => setRegisterForm({ ...registerForm, user_name: e.target.value })} />
            <TextField label="Email *" value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} />
            <TextField label="Password *" type="password" value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} />
            <FormControl>
              <InputLabel>Role</InputLabel>
              <Select value={registerForm.role} label="Role" onChange={e => setRegisterForm({ ...registerForm, role: e.target.value })}>
                <MenuItem value="patient">Patient</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: '#b71c1c' }} onClick={handleRegister}>Register</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}