# Docker & Redis Setup Guide

## Prerequisites

- Docker Desktop installed and running
- Docker Compose available

## Quick Start

### 1. Start with Docker Compose

```bash
# Navigate to Backend directory
cd Backend

# Start all services (Redis + Weather API)
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 2. Manual Docker Build

```bash
# Build the image
docker build -t weather-api .

# Run with Redis
docker run -p 3000:3000 \
  -e REDIS_HOST=redis \
  -e REDIS_PORT=6379 \
  --link weather-redis:redis \
  weather-api
```

## Services

### Redis

- **Port**: 6379
- **Container**: `weather-redis`
- **Data**: Persistent via Docker volume
- **Health**: `redis-cli ping`

### Weather API

- **Port**: 3000
- **Container**: `weather-api`
- **Depends on**: Redis (healthy)

## API Endpoints

### Weather Endpoints

- `GET /api/weather/cities` - List available cities
- `GET /api/weather/city/:name` - Get weather by city name
- `GET /api/weather?lat=...&lon=...` - Get weather by coordinates

### Cache Management

- `GET /api/cache/clear` - Clear all weather cache
- `DELETE /api/cache/clear/:city` - Clear cache for specific city

### Health & Monitoring

- `GET /api/health` - Health check with Redis status

## Environment Variables

```env
NODE_ENV=production
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_CACHE_TTL=3600
PORT=3000
```

## Cache Behavior

- Weather data is cached for 1 hour (3600 seconds)
- Cache key format: `weather:{city_name}`
- First request hits API, subsequent requests use cache
- Cache automatically expires after TTL

## Monitoring

### Check Redis Connection

```bash
docker exec -it weather-redis redis-cli ping
```

### View Redis Keys

```bash
docker exec -it weather-redis redis-cli keys '*'
```

### Monitor Redis in Real-time

```bash
docker exec -it weather-redis redis-cli monitor
```

## Troubleshooting

### Redis Connection Issues

```bash
# Check if Redis is running
docker ps | grep redis

# Restart Redis
docker-compose restart redis

# View Redis logs
docker-compose logs redis
```

### API Not Starting

```bash
# Check API logs
docker-compose logs weather-api

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Clear All Data

```bash
# Remove volumes
docker-compose down -v

# Remove containers and volumes
docker-compose down --volumes
```

## Development vs Production

### Development (Local)

```bash
# Install dependencies
npm install

# Start Redis locally (if installed)
redis-server

# Start API
npm run dev
```

### Production (Docker)

```bash
# Use docker-compose
docker-compose up -d
```

## Performance Notes

- Cache hit rate should be high for repeated requests
- First request to each city will be slower (API call)
- Subsequent requests within TTL are instant (cache)
- Redis memory usage grows with unique city requests

## Security Considerations

- Cache management endpoints should be protected in production
- Consider adding authentication for `/api/cache/*` routes
- Use environment variables for sensitive data
- Redis is exposed on port 6379 - restrict access in production
