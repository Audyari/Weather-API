const weatherService = require('../services/weatherService');

const weatherController = {
  // Get available cities
  getCities: async (req, res) => {
    try {
      const cities = weatherService.getCities();
      
      // Format response untuk hanya menampilkan nama kota
      const cityList = Object.keys(cities).map(key => ({
        name: cities[key].name,
        slug: key
      }));
      
      res.json({
        status: 'success',
        data: cityList
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

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
      const weatherData = await weatherService.getWeatherByCity(city);
      
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