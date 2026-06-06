import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Tabs, Tab,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';

const API = 'http://localhost:5000/api/admin';

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [auditLogs, setAuditLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [open, setOpen] = useState(false);
  const [notifForm, setNotifForm] = useState({
    user_id: '', user_type: 'patient', title: '', message: '', type: 'general'
  });

  const loadData = async () => {
    try {
      const [logs, notifs, adms] = await Promise.all([
        axios.get(API + '/audit-logs'),
        axios.get(API + '/notifications'),
        axios.get(API + '/admins')
      ]);
      setAuditLogs(logs.data.data || []);
      setNotifications(notifs.data.data || []);
      setAdmins(adms.data.data || []);
    } catch {}
  };

  useEffect(() => { loadData(); }, []);

  const handleSendNotification = async () => {
    try {
      await axios.post(API + '/notifications', notifForm);
      setOpen(false);
      loadData();
    } catch { alert('Error sending notification'); }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.put(API + '/notifications/' + id + '/read');
      loadData();
    } catch {}
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700} color="#4a148c">
          🛡️ Admin Dashboard
        </Typography>
        {tab === 2 && (
          <Button variant="contained" startIcon={<AddIcon />}
            sx={{ backgroundColor: '#4a148c' }} onClick={() => setOpen(true)}>
            Send Notification
          </Button>
        )}
      </Box>

      {/* Stats */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 140, borderTop: '4px solid #4a148c' }}>
          <Typography variant="h4" fontWeight={700} color="#4a148c">{auditLogs.length}</Typography>
          <Typography variant="body2" color="text.secondary">Audit Logs</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 140, borderTop: '4px solid #e91e63' }}>
          <Typography variant="h4" fontWeight={700} color="#e91e63">
            {(notifications as any[]).filter((n: any) => !n.is_read).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">Unread Notifications</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 140, borderTop: '4px solid #1565c0' }}>
          <Typography variant="h4" fontWeight={700} color="#1565c0">{admins.length}</Typography>
          <Typography variant="body2" color="text.secondary">Admins</Typography>
        </Paper>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab icon={<AdminPanelSettingsIcon />} label="Admins" />
        <Tab icon={<HistoryIcon />} label="Audit Logs" />
        <Tab icon={<NotificationsIcon />} label="Notifications" />
      </Tabs>

      {/* Admins Tab */}
      {tab === 0 && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#ede7f6' }}>
              <TableRow>
                <TableCell><b>Admin ID</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Role</b></TableCell>
                <TableCell><b>Status</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((a: any) => (
                <TableRow key={a._id}>
                  <TableCell>{a.admin_id}</TableCell>
                  <TableCell><b>{a.admin_name}</b></TableCell>
                  <TableCell>{a.email}</TableCell>
                  <TableCell><Chip label={a.role} size="small" color="secondary" /></TableCell>
                  <TableCell>
                    <Chip label={a.is_active ? 'Active' : 'Inactive'}
                      color={a.is_active ? 'success' : 'error'} size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Audit Logs Tab */}
      {tab === 1 && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#ede7f6' }}>
              <TableRow>
                <TableCell><b>User ID</b></TableCell>
                <TableCell><b>Action</b></TableCell>
                <TableCell><b>Module</b></TableCell>
                <TableCell><b>Description</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Time</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auditLogs.map((log: any) => (
                <TableRow key={log._id}>
                  <TableCell>{log.user_id}</TableCell>
                  <TableCell><Chip label={log.action} size="small" /></TableCell>
                  <TableCell>{log.module}</TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell>
                    <Chip label={log.status} size="small"
                      color={log.status === 'success' ? 'success' : 'error'} />
                  </TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Notifications Tab */}
      {tab === 2 && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#ede7f6' }}>
              <TableRow>
                <TableCell><b>Title</b></TableCell>
                <TableCell><b>Message</b></TableCell>
                <TableCell><b>Type</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.map((n: any) => (
                <TableRow key={n._id}>
                  <TableCell><b>{n.title}</b></TableCell>
                  <TableCell>{n.message}</TableCell>
                  <TableCell><Chip label={n.type} size="small" color="info" /></TableCell>
                  <TableCell>
                    <Chip label={n.is_read ? 'Read' : 'Unread'} size="small"
                      color={n.is_read ? 'default' : 'warning'} />
                  </TableCell>
                  <TableCell>
                    {!n.is_read && (
                      <Button size="small" onClick={() => markAsRead(n._id)}>
                        Mark Read
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Send Notification Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Notification</DialogTitle>
        <DialogContent>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
            <TextField label="User ID" value={notifForm.user_id} onChange={e => setNotifForm({ ...notifForm, user_id: e.target.value })} />
            <FormControl>
              <InputLabel>User Type</InputLabel>
              <Select value={notifForm.user_type} label="User Type" onChange={e => setNotifForm({ ...notifForm, user_type: e.target.value })}>
                <MenuItem value="patient">Patient</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Title *" value={notifForm.title} onChange={e => setNotifForm({ ...notifForm, title: e.target.value })} sx={{ gridColumn: 'span 2' }} />
            <TextField label="Message *" multiline rows={3} value={notifForm.message} onChange={e => setNotifForm({ ...notifForm, message: e.target.value })} sx={{ gridColumn: 'span 2' }} />
            <FormControl sx={{ gridColumn: 'span 2' }}>
              <InputLabel>Type</InputLabel>
              <Select value={notifForm.type} label="Type" onChange={e => setNotifForm({ ...notifForm, type: e.target.value })}>
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="appointment">Appointment</MenuItem>
                <MenuItem value="billing">Billing</MenuItem>
                <MenuItem value="alert">Alert</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: '#4a148c' }} onClick={handleSendNotification}>Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}