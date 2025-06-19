const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const studentRoutes = require('./routes/students');
const codeforcesRoutes = require('./routes/codeforces');
const settingsRoutes = require('./routes/settings');
const authRoutes = require('./routes/auth');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Connect to MongoDB Atlas
console.log('Connecting to MongoDB Atlas...');
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB Atlas', err);
    process.exit(1);
  });

// API Routes
app.use('/api/students', studentRoutes);
app.use('/api/codeforces', codeforcesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);

// Basic route for API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Student Progress Management API is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Student Progress Management API' });
});

// Initialize cron jobs if not in test mode
if (process.env.NODE_ENV !== 'test') {
  try {
    const { initCronJobs } = require('./utils/cron');
    initCronJobs();
    console.log('Cron jobs initialized successfully');
  } catch (error) {
    console.error('Failed to initialize cron jobs:', error);
  }
}

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Default to 500 server error unless specified
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  
  res.status(statusCode).json({
    status: status,
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

module.exports = app; // For testing purposesconst mongoose = require('mongoose');
