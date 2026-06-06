const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

// Megha's Routes
const patientRoutes = require('./routes/patientRoutes');
app.use('/api/patients', patientRoutes);

const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/api/appointments', appointmentRoutes);

const ehrRoutes = require('./routes/ehrRoutes');
app.use('/api/ehr', ehrRoutes);

const billingRoutes = require('./routes/billingRoutes');
app.use('/api/billing', billingRoutes);

// Subha's Routes
const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api/doctors', doctorRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// Saurabh's Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const telemedicineRoutes = require('./routes/telemedicineRoutes');
app.use('/api/telemedicine', telemedicineRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
  console.log('Server running on port ' + PORT);
});