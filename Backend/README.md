# Weather API Backend

Express.js backend dengan struktur profesional untuk mengakses Visual Crossing Weather API.

## Struktur Folder

```
Backend/
├── src/
│   ├── config/          # Konfigurasi aplikasi
│   ├── controllers/     # Logic bisnis
│   ├── services/        # External API calls
│   ├── routes/          # Endpoint definitions
│   └── middleware/      # Custom middleware
├── tests/               # Unit & integration tests
├── .env                 # Environment variables
├── .gitignore
├── package.json
├── app.js               # Express app initialization
├── server.js            # Server startup
└── README.md
```

## Instalasi

1. Install dependencies:

```bash
npm install
```

2. Jalankan server:

```bash
npm start
```

Atau untuk development mode:

```bash
npm run dev
```

## Endpoints

### Health Check

- `GET /api/health` - Server health status

### Weather API

- `GET /api/weather?lat=-6.2849&lon=106.9187` - Get weather by coordinates
- `GET /api/weather/city/jakarta` - Get weather by city name

## Response Format

```json
{
  "status": "success",
  "data": {
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

## Dependencies

- express - Web framework
- cors - CORS middleware
- dotenv - Environment variables
- helmet - Security headers
- morgan - Logger
- nodemon - Auto-restart (dev)
