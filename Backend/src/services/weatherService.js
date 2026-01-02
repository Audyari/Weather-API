const https = require('https');

const weatherService = {
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

  // Fetch weather by city name (using coordinates as fallback)
  fetchWeatherByCity: (city) => {
    // For demo purposes, we'll use default coordinates
    // In production, you'd use a geocoding service
    const cityCoordinates = {
      'jakarta': { lat: '-6.2849', lon: '106.9187' },
      'surabaya': { lat: '-7.2575', lon: '112.7521' },
      'bandung': { lat: '-6.9175', lon: '107.6191' }
    };
    
    const coords = cityCoordinates[city.toLowerCase()] || { lat: '-6.2849', lon: '106.9187' };
    return weatherService.fetchWeatherData(coords.lat, coords.lon);
  }
};

module.exports = weatherService;