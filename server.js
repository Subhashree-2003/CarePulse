import express from 'express';
import bodyParser from 'body-parser';
import './db.js'; // This initializes the connection



// 1. Import router files using 'import' and explicit '.js' extensions
import doctorRoutes from './routes/doctorRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';


const app = express();

// Middleware
app.use(bodyParser.json());



// Base Route
app.get('/', (req, res) => {
    res.send("Server is running and DB is connected!");
});

// 2. Use the routers (Variable names now match the imports above)
app.use('/doctor', doctorRoutes);
app.use('/users', usersRoutes);
app.use('/appointment', appointmentRoutes);

// Start Server
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});



