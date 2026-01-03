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

// Import Redis client
const { connectRedis, redisClient } = require('./src/config/redisClient');

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
app.get('/api/health', healthLimiter, async (req, res) => {
  const redisStatus = redisClient.isReady ? 'connected' : 'disconnected';
  
  res.status(200).json({
    status: 'success',
    message: 'Weather API is running',
    timestamp: new Date().toISOString(),
    services: {
      redis: redisStatus
    }
  });
});

// Cache management routes (admin only - you can add authentication)
app.get('/api/cache/clear', async (req, res) => {
  try {
    const { clearAllWeatherCache } = require('./src/services/weatherService');
    const cleared = await clearAllWeatherCache();
    res.status(200).json({
      status: 'success',
      message: `Cleared ${cleared} cache entries`
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

app.delete('/api/cache/clear/:city', async (req, res) => {
  try {
    const { clearCityCache } = require('./src/services/weatherService');
    const city = req.params.city;
    const result = await clearCityCache(city);
    
    if (result) {
      res.status(200).json({
        status: 'success',
        message: `Cache cleared for city: ${city}`
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: `No cache found for city: ${city}`
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
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

// Initialize Redis connection on startup
const initializeApp = async () => {
  try {
    await connectRedis();
    console.log('Redis connection initialized');
  } catch (err) {
    console.warn('Redis connection failed, continuing without cache:', err.message);
  }
};

module.exports = { app, initializeApp };