const redis = require('redis');
const config = require('./config');

// Create Redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      console.error('Redis connection refused. Is Redis running?');
      return new Error('Redis connection refused');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
});

// Event handlers
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('ready', () => {
  console.log('Redis client ready');
});

redisClient.on('end', () => {
  console.log('Redis connection closed');
});

// Connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected successfully');
  } catch (err) {
    console.error('Failed to connect to Redis:', err.message);
  }
};

// Helper functions
const getCachedData = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Error getting cached data:', err);
    return null;
  }
};

const setCachedData = async (key, data, ttl = 3600) => {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('Error setting cached data:', err);
    return false;
  }
};

const deleteCachedData = async (key) => {
  try {
    await redisClient.del(key);
    return true;
  } catch (err) {
    console.error('Error deleting cached data:', err);
    return false;
  }
};

module.exports = {
  redisClient,
  connectRedis,
  getCachedData,
  setCachedData,
  deleteCachedData
};