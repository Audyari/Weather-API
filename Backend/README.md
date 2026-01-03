# Weather API Backend

Express.js backend dengan struktur profesional untuk mengakses Visual Crossing Weather API dengan Redis caching.

## Struktur Folder

```
Backend/
├── src/
│   ├── config/          # Konfigurasi aplikasi
│   │   ├── config.js    # Main configuration
│   │   └── redisClient.js # Redis client setup
│   ├── controllers/     # Logic bisnis
│   ├── services/        # External API calls + Redis caching
│   ├── routes/          # Endpoint definitions
│   └── middleware/      # Custom middleware
├── tests/               # Unit & integration tests
├── .env                 # Environment variables
├── .env.example         # Template environment
├── .gitignore
├── .dockerignore        # Docker ignore files
├── package.json
├── Dockerfile           # Docker image definition
├── docker-compose.yml   # Docker Compose setup
├── app.js               # Express app initialization
├── server.js            # Server startup
├── DOCKER_SETUP.md      # Docker & Redis guide
└── README.md
```

## Instalasi

### Local Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file from template:

```bash
cp .env.example .env
```

3. Jalankan server:

```bash
npm start
```

Atau untuk development mode:

```bash
npm run dev
```

### Docker Installation (Recommended)

1. Start with Docker Compose:

```bash
docker-compose up -d
```

2. View logs:

```bash
docker-compose logs -f
```

3. Check status:

```bash
docker-compose ps
```

## Features

### Redis Caching

- Automatic caching of weather data
- Cache TTL: 1 hour (configurable)
- Cache key format: `weather:{city_name}`
- Significantly improves response time for repeated requests

### Cache Management

- `GET /api/cache/clear` - Clear all weather cache
- `DELETE /api/cache/clear/:city` - Clear cache for specific city

## Endpoints

### Health Check

- `GET /api/health` - Server health status with Redis connection status

### Weather API

- `GET /api/weather?lat=-6.2849&lon=106.9187` - Get weather by coordinates
- `GET /api/weather/city/jakarta` - Get weather by city name
- `GET /api/weather/cities` - List available cities

### Cache Management

- `GET /api/cache/clear` - Clear all weather cache
- `DELETE /api/cache/clear/:city` - Clear cache for specific city

## Response Format

```json
{
  "status": "success",
  "data": {
    "city": "Jakarta",
    "location": "-6.2849,106.9187",
    "timezone": "Asia/Jakarta",
    "current": {
      "temperature": 85,
      "conditions": "Partially cloudy",
      "humidity": 70,
      "windSpeed": 5.5,
      "icon": "partly-cloudy-day"
    },
    "forecast": [
      {
        "date": "2024-01-03",
        "tempmax": 88,
        "tempmin": 75,
        "conditions": "Rain",
        "icon": "rain"
      }
    ]
  }
}
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `WEATHER_API_KEY` - Visual Crossing API key
- `REDIS_HOST` - Redis host (localhost or 'redis' for Docker)
- `REDIS_PORT` - Redis port (default: 6379)
- `REDIS_CACHE_TTL` - Cache TTL in seconds (default: 3600)

## Dependencies

- express - Web framework
- cors - CORS middleware
- dotenv - Environment variables
- helmet - Security headers
- morgan - Logger
- redis - Redis client for caching
- axios - HTTP client
- express-rate-limit - Rate limiting
- nodemon - Auto-restart (dev)

## Docker Services

### Redis

- Image: `redis:7-alpine`
- Port: 6379
- Data persistence: Docker volume
- Health check: `redis-cli ping`

### Weather API

- Build: Dockerfile
- Port: 3000
- Depends on: Redis (healthy)
- Environment: Configurable via env vars

## Performance

### Without Cache

- Each request hits Visual Crossing API
- Response time: ~500ms - 2s per request

### With Redis Cache

- First request: ~500ms (API call + cache write)
- Subsequent requests: ~10-50ms (cache hit)
- Cache hit rate: 90%+ for repeated requests

## Monitoring

### Check Redis Connection

```bash
# Local
redis-cli ping

# Docker
docker exec -it weather-redis redis-cli ping
```

### View Cached Keys

```bash
# Local
redis-cli keys 'weather:*'

# Docker
docker exec -it weather-redis redis-cli keys 'weather:*'
```

### Monitor Cache Performance

```bash
# Check health endpoint for Redis status
curl http://localhost:3000/api/health
```

## Troubleshooting

### Redis Connection Issues

```bash
# Start Redis locally
redis-server

# Or use Docker
docker-compose up redis -d
```

### API Not Starting

```bash
# Check logs
docker-compose logs weather-api

# Rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

For detailed Docker setup instructions, see [DOCKER_SETUP.md](DOCKER_SETUP.md).
