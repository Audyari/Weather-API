# Weather API Wrapper Service

Projek ini adalah layanan API wrapper untuk cuaca yang menyediakan data cuaca real-time dari berbagai lokasi. Layanan ini menggunakan [OpenWeatherMap API](https://openweathermap.org/) sebagai sumber data cuaca utama dan dilengkapi dengan caching Redis untuk performa yang lebih baik.

## 🔗 Referensi Proyek

Proyek ini mengikuti panduan dari **roadmap.sh**:

- [Weather API Wrapper Service](https://roadmap.sh/projects/weather-api-wrapper-service)

## ✨ Fitur Utama

### 1. **Get Weather by Location**

- Mendapatkan data cuaca berdasarkan nama kota
- Menyediakan informasi suhu, kelembaban, kecepatan angin, kondisi cuaca, dll
- Support parameter units (metric, imperial, standard)

### 2. **Caching dengan Redis**

- Mengurangi request ke API eksternal
- Meningkatkan performa dan respons time
- TTL (Time To Live) yang dapat dikonfigurasi

### 3. **Rate Limiting**

- Mencegah abuse dan DDoS attacks
- Melindungi API key dan resource
- Konfigurasi limit yang fleksibel

### 4. **Error Handling**

- Global error handler untuk menangani semua error
- Response yang konsisten dan informatif
- Logging untuk debugging

### 5. **Environment Configuration**

- Konfigurasi mudah melalui file `.env`
- Support untuk development dan production environment
- Manajemen API key yang aman

### 6. **Docker Support**

- Containerization untuk deployment yang mudah
- Docker Compose untuk multi-container setup
- Consistent environment across deployments

## 📦 Dependensi Utama

### Dependencies

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "redis": "^4.6.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### Penjelasan Dependensi

- **express**: Framework web utama untuk Node.js
- **axios**: HTTP client untuk request ke OpenWeatherMap API
- **redis**: Client Redis untuk caching
- **express-rate-limit**: Middleware untuk rate limiting
- **dotenv**: Manajemen environment variables
- **cors**: Cross-Origin Resource Sharing
- **helmet**: Security middleware untuk Express
- **nodemon**: Auto-restart server saat development

## 🚀 Cara Penggunaan

### Prasyarat

- Node.js (v18+)
- Redis Server
- OpenWeatherMap API Key

### Instalasi

1. **Clone repository**

```bash
git clone <repository-url>
cd Weather API
```

2. **Install dependencies**

```bash
cd Backend
npm install
```

3. **Konfigurasi environment**

```bash
cp .env.example .env
```

Edit file `.env` dengan konfigurasi Anda:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Weather API Configuration
WEATHER_API_KEY=your_openweathermap_api_key

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_CACHE_TTL=3600
```

4. **Jalankan Redis**

```bash
# Windows
redis-server

# Atau dengan Docker
docker run -d -p 6379:6379 redis
```

5. **Jalankan server**

```bash
npm run dev
```

### Menggunakan Docker

```bash
docker-compose up -d
```

## 📡 API Endpoints

### Get Weather by City

```
GET /api/weather/:city
```

**Parameters:**

- `city` (required): Nama kota
- `units` (optional): `metric` (Celsius), `imperial` (Fahrenheit), `standard` (Kelvin)

**Example:**

```bash
curl http://localhost:3001/api/weather/jakarta?units=metric
```

**Response:**

```json
{
  "success": true,
  "data": {
    "location": "Jakarta",
    "temperature": 30.5,
    "feels_like": 33.2,
    "humidity": 70,
    "wind_speed": 3.5,
    "description": "clear sky",
    "timestamp": "2026-01-03T00:00:00.000Z"
  },
  "cached": false
}
```

## 🛡️ Security Features

- **Rate Limiting**: Maksimal 100 request per 15 menit per IP
- **Helmet**: Security headers untuk melindungi dari serangan umum
- **CORS**: Kontrol akses origin yang diizinkan
- **Environment Variables**: API key tidak terpapar di code

## 📊 Performance

- **Response Time**: < 100ms (dengan cache)
- **Cache Hit Rate**: Tinggi untuk query yang sering diakses
- **Scalability**: Mendukung horizontal scaling dengan Redis cluster

## 🐛 Debugging

Lihat logs di console untuk debugging:

- Redis connection status
- API requests
- Cache hits/misses
- Error details

## 📝 License

MIT License - Feel free to use and modify.

## 🤝 Contributing

Kontribusi selalu welcome! Silakan buat issue atau pull request.

---

**Dibuat dengan ❤️ menggunakan Node.js, Express, dan Redis**
