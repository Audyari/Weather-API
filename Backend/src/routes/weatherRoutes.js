const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Get weather by coordinates
router.get('/', weatherController.getWeather);

// Get weather by city name (optional)
router.get('/city/:city', weatherController.getWeatherByCity);

module.exports = router;