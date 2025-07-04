# Production Deployment Guide

## 🚀 Natro Panel Deployment

### 1. **Environment Setup**

`.env.local` dosyasını oluşturun:
```env
# Production Backend API Configuration
VITE_API_BASE_URL=https://www.akyildizyonetim.com/api

# Production Configuration
VITE_DEV_MODE=false
VITE_DEBUG_MODE=false
```

### 2. **Build Process**

```bash
# Dependencies yükle
npm install

# Production build
npm run build

# Build sonucu dist/ klasöründe oluşur
```

### 3. **Natro Panel Upload**

1. **File Manager**'a girin
2. **public_html** klasörüne gidin
3. **dist/** klasöründeki tüm dosyaları yükleyin
4. **index.html** dosyasının root'ta olduğundan emin olun

### 4. **Domain Configuration**

- **Domain**: www.akyildizyonetim.com
- **SSL**: HTTPS aktif olmalı
- **CORS**: Backend API için CORS ayarları

### 5. **Backend API Endpoints**

Backend'inizde şu endpoint'lerin çalıştığından emin olun:

```
GET  /api/health
POST /api/auth/login
GET  /api/auth/me
GET  /api/tenants
GET  /api/expenses
GET  /api/payments
```

### 6. **Testing**

Deployment sonrası test edin:

1. **Frontend**: https://www.akyildizyonetim.com
2. **Backend API**: https://www.akyildizyonetim.com/api/health
3. **Authentication**: Login işlemi
4. **Data Loading**: Kiracı, gider, ödeme listeleri

### 7. **Troubleshooting**

#### CORS Hatası
Backend'de CORS ayarlarını kontrol edin:
```javascript
// Backend CORS configuration
app.use(cors({
  origin: 'https://www.akyildizyonetim.com',
  credentials: true
}))
```

#### 404 Hatası
- Route'ların doğru yapılandırıldığından emin olun
- .htaccess dosyası gerekebilir

#### SSL Hatası
- HTTPS sertifikasının aktif olduğundan emin olun
- Mixed content hatalarını kontrol edin

### 8. **Performance Optimization**

1. **Gzip Compression** aktif edin
2. **Browser Caching** ayarlayın
3. **CDN** kullanmayı düşünün
4. **Image Optimization** yapın

### 9. **Monitoring**

1. **Error Logging** aktif edin
2. **Performance Monitoring** kurun
3. **Uptime Monitoring** ayarlayın
4. **Backup** stratejisi oluşturun

## 🔧 Development vs Production

### Development
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_DEV_MODE=true
VITE_DEBUG_MODE=true
```

### Production
```env
VITE_API_BASE_URL=https://www.akyildizyonetim.com/api
VITE_DEV_MODE=false
VITE_DEBUG_MODE=false
```

## 📞 Support

Deployment sorunları için:
- Natro Panel Support
- Backend API Logs
- Browser Developer Tools
- Network Tab Analysis 