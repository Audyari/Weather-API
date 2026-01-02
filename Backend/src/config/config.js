require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  weatherApiKey: process.env.WEATHER_API_KEY || 'EDWYD8W72GEEVYT8UJSJBEMEV',
  weatherApiUrl: 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline'
};

module.exports = config;