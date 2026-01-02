const app = require('./app');
const config = require('./src/config/config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌤️  Weather API: http://localhost:${PORT}/api/weather`);
  console.log(`📋 Available cities: http://localhost:${PORT}/api/weather/cities`);
  console.log(`🔍 Get weather by city: http://localhost:${PORT}/api/weather/city/jakarta`);
  console.log(`📍 Get weather by coordinates: http://localhost:${PORT}/api/weather?lat=-6.2088&lon=106.8456`);
});