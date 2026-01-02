# Rate Limiting Documentation

Implementasi express-rate-limit untuk Weather API Backend.

## Overview

Rate limiting telah diimplementasikan untuk mencegah abuse dan menjaga kinerja API. Terdapat 3 level rate limiting yang berbeda:

## Rate Limit Levels

### 1. General Rate Limiter

- **Endpoint**: Semua endpoint
- **Window**: 15 menit
- **Max Request**: 100 request per IP
- **Pesan**: "Terlalu banyak request dari IP ini, coba lagi dalam 15 menit"

### 2. Weather Rate Limiter

- **Endpoint**: `/api/weather/*`
- **Window**: 1 menit
- **Max Request**: 10 request per IP
- **Pesan**: "Terlalu banyak request ke endpoint weather, coba lagi dalam 1 menit"

### 3. Health Check Rate Limiter

- **Endpoint**: `/api/health`
- **Window**: 5 menit
- **Max Request**: 50 request per IP
- **Pesan**: "Terlalu banyak request ke health check endpoint"

## Configuration

Konfigurasi rate limiting dapat ditemukan di:

- `src/config/config.js` - Konfigurasi parameter
- `src/middleware/rateLimiter.js` - Implementasi middleware
- `app.js` - Integrasi ke aplikasi

## Response Headers

Setiap response akan menyertakan headers berikut:

- `X-RateLimit-Limit`: Maksimal request yang diizinkan
- `X-RateLimit-Remaining`: Request yang tersisa dalam window saat ini
- `X-RateLimit-Reset`: Waktu reset rate limit (timestamp)

## Error Response

Ketika rate limit tercapai, API akan mengembalikan:

```json
{
  "status": "error",
  "message": "Terlalu banyak request...",
  "retryAfter": 60
}
```

## Testing

Untuk menguji rate limiting:

```bash
# Test weather endpoint rate limit (10 request/menit)
for i in {1..15}; do
  curl http://localhost:3000/api/weather/city/Jakarta
done

# Test health check rate limit (50 request/5 menit)
for i in {1..55}; do
  curl http://localhost:3000/api/health
done
```

## Customization

Untuk mengubah konfigurasi, edit `src/config/config.js`:

```javascript
rateLimit: {
  general: {
    windowMs: 15 * 60 * 1000, // Ubah window
    max: 100 // Ubah max request
  },
  // ... dll
}
```

## Notes

- Rate limiting berdasarkan IP address client
- Skip untuk request tanpa IP
- Menggunakan standard headers untuk kompatibilitas
- Error handling khusus untuk rate limit errors
