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

type Admin = {
  _id: string;
  admin_id: string;
  admin_name: string;
  email: string;
  role: string;
  is_active: boolean;
};

type AuditLog = {
  _id: string;
  user_id: string;
  action: string;
  module: string;
  description: string;
  status: 'success' | 'error' | string;
  timestamp: string;
};

type AdminNotification = {
  _id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
};

type ApiListResponse<T> = {
  data?: T[];
};

type NotificationForm = {
  user_id: string;
  user_type: 'patient' | 'doctor' | 'admin';
  title: string;
  message: string;
  type: 'general' | 'appointment' | 'billing' | 'alert';
};

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [open, setOpen] = useState(false);
  const [notifForm, setNotifForm] = useState<NotificationForm>({
    user_id: '',
    user_type: 'patient',
    title: '',
    message: '',
    type: 'general',
  });

  const loadData = async () => {
    try {
      const [logs, notifs, adms] = await Promise.all([
        axios.get<ApiListResponse<AuditLog>>(API + '/audit-logs'),
        axios.get<ApiListResponse<AdminNotification>>(API + '/notifications'),
        axios.get<ApiListResponse<Admin>>(API + '/admins'),
      ]);
      setAuditLogs(logs.data.data || []);
      setNotifications(notifs.data.data || []);
      setAdmins(adms.data.data || []);
    } catch (error) {
      console.error('Error loading admin dashboard data:', error);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, []);

  const handleSendNotification = async () => {
    try {
      await axios.post(API + '/notifications', notifForm);
      setOpen(false);
      void loadData();
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Error sending notification');
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.put(API + '/notifications/' + id + '/read');
      void loadData();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color="#4a148c" sx={{ fontWeight: 700 }}>
          Admin Dashboard
        </Typography>
        {tab === 2 && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ backgroundColor: '#4a148c' }}
            onClick={() => setOpen(true)}
          >
            Send Notification
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 140, borderTop: '4px solid #4a148c' }}>
          <Typography variant="h4" color="#4a148c" sx={{ fontWeight: 700 }}>{auditLogs.length}</Typography>
          <Typography variant="body2" color="text.secondary">Audit Logs</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 140, borderTop: '4px solid #e91e63' }}>
          <Typography variant="h4" color="#e91e63" sx={{ fontWeight: 700 }}>
            {notifications.filter((notification) => !notification.is_read).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">Unread Notifications</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 140, borderTop: '4px solid #1565c0' }}>
          <Typography variant="h4" color="#1565c0" sx={{ fontWeight: 700 }}>{admins.length}</Typography>
          <Typography variant="body2" color="text.secondary">Admins</Typography>
        </Paper>
      </Box>

      <Tabs value={tab} onChange={(_, value: number) => setTab(value)} sx={{ mb: 3 }}>
        <Tab icon={<AdminPanelSettingsIcon />} label="Admins" />
        <Tab icon={<HistoryIcon />} label="Audit Logs" />
        <Tab icon={<NotificationsIcon />} label="Notifications" />
      </Tabs>

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
              {admins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>{admin.admin_id}</TableCell>
                  <TableCell><b>{admin.admin_name}</b></TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell><Chip label={admin.role} size="small" color="secondary" /></TableCell>
                  <TableCell>
                    <Chip
                      label={admin.is_active ? 'Active' : 'Inactive'}
                      color={admin.is_active ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
              {auditLogs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell>{log.user_id}</TableCell>
                  <TableCell><Chip label={log.action} size="small" /></TableCell>
                  <TableCell>{log.module}</TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={log.status}
                      size="small"
                      color={log.status === 'success' ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
              {notifications.map((notification) => (
                <TableRow key={notification._id}>
                  <TableCell><b>{notification.title}</b></TableCell>
                  <TableCell>{notification.message}</TableCell>
                  <TableCell><Chip label={notification.type} size="small" color="info" /></TableCell>
                  <TableCell>
                    <Chip
                      label={notification.is_read ? 'Read' : 'Unread'}
                      size="small"
                      color={notification.is_read ? 'default' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>
                    {!notification.is_read && (
                      <Button size="small" onClick={() => markAsRead(notification._id)}>
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

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Notification</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
            <TextField
              label="User ID"
              value={notifForm.user_id}
              onChange={(event) => setNotifForm({ ...notifForm, user_id: event.target.value })}
            />
            <FormControl>
              <InputLabel>User Type</InputLabel>
              <Select
                value={notifForm.user_type}
                label="User Type"
                onChange={(event) => setNotifForm({
                  ...notifForm,
                  user_type: event.target.value as NotificationForm['user_type'],
                })}
              >
                <MenuItem value="patient">Patient</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Title *"
              value={notifForm.title}
              onChange={(event) => setNotifForm({ ...notifForm, title: event.target.value })}
              sx={{ gridColumn: 'span 2' }}
            />
            <TextField
              label="Message *"
              multiline
              rows={3}
              value={notifForm.message}
              onChange={(event) => setNotifForm({ ...notifForm, message: event.target.value })}
              sx={{ gridColumn: 'span 2' }}
            />
            <FormControl sx={{ gridColumn: 'span 2' }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={notifForm.type}
                label="Type"
                onChange={(event) => setNotifForm({
                  ...notifForm,
                  type: event.target.value as NotificationForm['type'],
                })}
              >
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
