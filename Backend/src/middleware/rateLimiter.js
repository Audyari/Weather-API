const rateLimit = require('express-rate-limit');
const config = require('../config/config');

// Rate limiter untuk semua request
const generalLimiter = rateLimit({
  windowMs: config.rateLimit.general.windowMs,
  max: config.rateLimit.general.max,
  message: {
    status: 'error',
    message: `Terlalu banyak request dari IP ini, coba lagi dalam ${config.rateLimit.general.windowMs / 60000} menit`,
    retryAfter: Math.ceil(config.rateLimit.general.windowMs / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !req.ip
});

// Rate limiter khusus untuk endpoint weather (lebih ketat)
const weatherLimiter = rateLimit({
  windowMs: config.rateLimit.weather.windowMs,
  max: config.rateLimit.weather.max,
  message: {
    status: 'error',
    message: `Terlalu banyak request ke endpoint weather, coba lagi dalam ${config.rateLimit.weather.windowMs / 1000} detik`,
    retryAfter: config.rateLimit.weather.windowMs / 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !req.ip
});

// Rate limiter untuk health check (lebih longgar)
const healthLimiter = rateLimit({
  windowMs: config.rateLimit.health.windowMs,
  max: config.rateLimit.health.max,
  message: {
    status: 'error',
    message: `Terlalu banyak request ke health check endpoint, coba lagi dalam ${config.rateLimit.health.windowMs / 1000} detik`,
    retryAfter: config.rateLimit.health.windowMs / 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !req.ip
});

module.exports = {
  generalLimiter,
  weatherLimiter,
  healthLimiter
};