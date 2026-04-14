require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection Logic for Serverless
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  if (!process.env.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is not defined in environment variables');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('--- MongoDB Connection Error ---');
    if (err.name === 'MongoAuthenticationError') {
      console.error('ERROR: Authentication failed. Please check your database username and password in MONGODB_URI.');
    } else if (err.name === 'MongoServerSelectionError') {
      console.error('ERROR: Could not connect to any server. This is often caused by:');
      console.error('1. IP Whitelist issues (Ensure 0.0.0.0/0 is allowed in Atlas)');
      console.error('2. Network connectivity problems');
    } else if (err.name === 'MongoNetworkError') {
      console.error('ERROR: Network error. Please check your internet connection.');
    } else {
      console.error(`ERROR: ${err.message}`);
    }
    console.error('---------------------------------');
  }
};

// Global middleware to ensure DB is connected for API routes
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api') && req.path !== '/api/health') {
    await connectDB();
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Health Check (Always available, even if DB is down)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: {
      mongodb: !!process.env.MONGODB_URI,
      jwt: !!process.env.JWT_SECRET
    }
  });
});

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the Express app for Vercel
module.exports = app;
