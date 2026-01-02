const app = require('./app');
const config = require('./src/config/config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌤️  Weather API: http://localhost:${PORT}/api/weather`);
});