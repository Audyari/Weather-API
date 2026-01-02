require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  weatherApiKey: process.env.WEATHER_API_KEY || 'EDWYD8W72GEEVYT8UJSJBEMEV',
  weatherApiUrl: 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline',
  rateLimit: {
    // General rate limit settings
    general: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    },
    // Weather endpoint specific settings
    weather: {
      windowMs: 60 * 1000, // 1 minute
      max: 10 // limit each IP to 10 requests per minute
    },
    // Health check settings
    health: {
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 50 // limit each IP to 50 requests per 5 minutes
    }
  }
};

module.exports = config;