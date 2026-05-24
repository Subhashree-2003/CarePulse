import mongoose from 'mongoose';

// 1. Define the connection URL
const mongoURL = 'mongodb://127.0.0.1:27017/carepulse'; // Changed DB name to 'hotels' or your choice

// 2. Set up the connection
// Note: useNewURLParser and useUnifiedTopology are no longer needed in Mongoose 6+
mongoose.connect(mongoURL);

// 3. Get the default connection object
const db = mongoose.connection;

// 4. Define event listeners
db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB server disconnected');
});

// 5. Export the database connection
export default db;