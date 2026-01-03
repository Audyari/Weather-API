const axios = require('axios');
const { getCachedData, setCachedData } = require('../config/redisClient');
const config = require('../config/config');

// Data kota yang tersedia (hanya 4 kota yang diminta)
const cities = {
  'jakarta': { lat: '-6.2088', lon: '106.8456', name: 'Jakarta' },
  'bandung': { lat: '-6.9175', lon: '107.6191', name: 'Bandung' },
  'madiun': { lat: '-7.6167', lon: '111.5167', name: 'Madiun' },
  'pekalongan': { lat: '-6.8886', lon: '109.6753', name: 'Pekalongan' }
};

const weatherService = {
  // Get available cities
  getCities: () => {
    return cities;
  },

  // Get city coordinates
  getCityCoordinates: (cityName) => {
    const city = cities[cityName.toLowerCase()];
    if (!city) {
      throw new Error(`City "${cityName}" not found. Available cities: ${Object.keys(cities).join(', ')}`);
    }
    return { lat: city.lat, lon: city.lon, name: city.name };
  },

  // Fetch weather data from Visual Crossing API
  fetchWeatherData: async (lat, lon) => {
    try {
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=us&key=EDWYD8W72GEEVYT8UJSJBEMEV&contentType=json`;
      
      const response = await axios.get(url);
      const jsonData = response.data;
      
      // Format response yang sederhana
      const formattedResponse = {
        location: jsonData.address || `${lat},${lon}`,
        timezone: jsonData.timezone,
        current: {
          temperature: jsonData.currentConditions?.temp,
          conditions: jsonData.currentConditions?.conditions,
          humidity: jsonData.currentConditions?.humidity,
          windSpeed: jsonData.currentConditions?.windspeed,
          icon: jsonData.currentConditions?.icon
        },
        forecast: jsonData.days?.slice(0, 3).map(day => ({
          date: day.datetime,
          tempmax: day.tempmax,
          tempmin: day.tempmin,
          conditions: day.conditions,
          icon: day.icon
        })) || []
      };
      
      return formattedResponse;
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        throw new Error(`Failed to fetch weather data: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        // Request was made but no response
        throw new Error('Failed to fetch weather data: No response from server');
      } else {
        // Other errors
        throw new Error('Failed to fetch weather data: ' + error.message);
      }
    }
  },

  // Get weather by city name with Redis caching
  getWeatherByCity: async (cityName) => {
    try {
      const city = weatherService.getCityCoordinates(cityName);
      
      // Create cache key
      const cacheKey = `weather:${cityName.toLowerCase()}`;
      
      // Try to get cached data first
      const cachedData = await getCachedData(cacheKey);
      if (cachedData) {
        console.log(`Cache hit for ${cityName}:`, cachedData);
        // Add city name to cached response
        cachedData.city = city.name;
        return cachedData;
      }
      
      console.log(`Cache miss for ${cityName}, fetching from API...`);
      
      // Fetch fresh data from API
      const weatherData = await weatherService.fetchWeatherData(city.lat, city.lon);
      
      // Add city name to response
      weatherData.city = city.name;
      
      // Cache the result
      const ttl = parseInt(config.redis.cacheTTL) || 3600;
      await setCachedData(cacheKey, weatherData, ttl);
      
      console.log(`Cached weather data for ${cityName} with TTL: ${ttl}s`);
      
      return weatherData;
    } catch (error) {
      throw error;
    }
  },

  // Clear cache for a specific city
  clearCityCache: async (cityName) => {
    const cacheKey = `weather:${cityName.toLowerCase()}`;
    const { deleteCachedData } = require('../config/redisClient');
    return await deleteCachedData(cacheKey);
  },

  // Clear all weather cache
  clearAllWeatherCache: async () => {
    const { redisClient } = require('../config/redisClient');
    try {
      const keys = await redisClient.keys('weather:*');
      if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(`Cleared ${keys.length} weather cache entries`);
        return keys.length;
      }
      return 0;
    } catch (err) {
      console.error('Error clearing all weather cache:', err);
      throw err;
    }
  }
};

module.exports = weatherService;
