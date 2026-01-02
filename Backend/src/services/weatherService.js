const https = require('https');

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
  fetchWeatherData: (lat, lon) => {
    return new Promise((resolve, reject) => {
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=us&key=EDWYD8W72GEEVYT8UJSJBEMEV&contentType=json`;
      
      https.get(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            
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
            
            resolve(formattedResponse);
          } catch (error) {
            reject(new Error('Failed to parse weather data'));
          }
        });
      }).on('error', (error) => {
        reject(new Error('Failed to fetch weather data: ' + error.message));
      });
    });
  },

  // Get weather by city name
  getWeatherByCity: (cityName) => {
    return new Promise((resolve, reject) => {
      try {
        const city = weatherService.getCityCoordinates(cityName);
        weatherService.fetchWeatherData(city.lat, city.lon)
          .then(weatherData => {
            // Add city name to response
            weatherData.city = city.name;
            resolve(weatherData);
          })
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = weatherService;
