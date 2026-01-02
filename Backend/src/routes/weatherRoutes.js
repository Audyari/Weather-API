const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Get available cities
router.get('/cities', weatherController.getCities);

// Get weather by coordinates
router.get('/', weatherController.getWeather);

// Get weather by city name
router.get('/city/:city', weatherController.getWeatherByCity);

module.exports = router;