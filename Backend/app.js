const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const weatherRoutes = require('./src/routes/weatherRoutes');

// Import middleware
const { generalLimiter, weatherLimiter, healthLimiter } = require('./src/middleware/rateLimiter');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logger
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Apply general rate limiter to all requests
app.use(generalLimiter);

// Health check route (with specific rate limiter)
app.get('/api/health', healthLimiter, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Weather API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes (with weather-specific rate limiter)
app.use('/api/weather', weatherLimiter, weatherRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle rate limit errors specifically
  if (err.status === 429) {
    return res.status(429).json({
      status: 'error',
      message: err.message || 'Too many requests, please try again later',
      retryAfter: err.retryAfter || 60
    });
  }
  
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;