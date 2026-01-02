const weatherService = require('../services/weatherService');

const weatherController = {
  // Get weather by coordinates
  getWeather: async (req, res) => {
    try {
      const lat = req.query.lat || '-6.2849';
      const lon = req.query.lon || '106.9187';
      
      const weatherData = await weatherService.fetchWeatherData(lat, lon);
      
      res.json({
        status: 'success',
        data: weatherData
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Get weather by city name
  getWeatherByCity: async (req, res) => {
    try {
      const { city } = req.params;
      const weatherData = await weatherService.fetchWeatherByCity(city);
      
      res.json({
        status: 'success',
        data: weatherData
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = weatherController;