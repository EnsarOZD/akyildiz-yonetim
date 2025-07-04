# Güvenlik Rehberi

## 🔒 Güvenlik Önlemleri

Bu uygulama aşağıdaki güvenlik önlemlerini içerir:

### Environment Variables
- Backend API anahtarları ve diğer hassas bilgiler `.env.local` dosyasında saklanır
- Environment variables asla public repository'de paylaşılmaz

### Authentication
- JWT token tabanlı kimlik doğrulama
- Token'lar localStorage'da güvenli şekilde saklanır
- Otomatik token yenileme

### Authorization
- Role-based access control (RBAC)
- Route-level authorization
- Component-level permission checks

## 🛡️ Güvenlik Katmanları

### 1. **Frontend Güvenlik**
- Input validation
- XSS koruması
- CSRF koruması
- Content Security Policy (CSP)

### 2. **Backend API Güvenlik**
- JWT token authentication
- Rate limiting
- CORS configuration
- Input sanitization

### 3. **Data Güvenliği**
- HTTPS zorunluluğu
- Sensitive data encryption
- Secure data transmission

## 🔐 Environment Variables

### Gerekli Environment Variables

```env
# Backend API Configuration
VITE_API_BASE_URL=https://www.akyildizyonetim.com/api

# Development
VITE_DEV_MODE=true
VITE_DEBUG_MODE=false
```

### Güvenlik Kuralları

1. **API Anahtarları**: Backend API anahtarlarını asla public repository'de paylaşmayın
2. **Environment Files**: `.env.local` dosyasını `.gitignore`'a ekleyin
3. **Production**: Production'da debug modunu kapatın
4. **Secrets**: Hassas bilgileri environment variables olarak saklayın

## 🚨 Güvenlik Uyarıları

### Yapılmaması Gerekenler

```javascript
// ❌ YANLIŞ - API anahtarını kodda saklama
const API_KEY = 'your-secret-api-key'

// ❌ YANLIŞ - Hassas bilgileri console'da yazdırma
console.log('User token:', userToken)

// ❌ YANLIŞ - Environment variable'ı public'de paylaşma
// .env dosyasını commit etme
```

### Doğru Kullanım

```javascript
// ✅ DOĞRU - Environment variable kullan
const API_URL = import.meta.env.VITE_API_BASE_URL

// ✅ DOĞRU - Güvenli token saklama
localStorage.setItem('authToken', token)

// ✅ DOĞRU - Güvenli token temizleme
localStorage.removeItem('authToken')
```

## 🔍 Güvenlik Testleri

### Manuel Testler

1. **Authentication Test**
   - Geçersiz token ile API çağrısı
   - Süresi dolmuş token testi
   - Yetkisiz erişim testi

2. **Input Validation Test**
   - SQL injection testi
   - XSS testi
   - Malicious input testi

3. **Authorization Test**
   - Role-based access testi
   - Permission boundary testi
   - Route protection testi

### Otomatik Testler

```bash
# Güvenlik testleri
npm run test:security

# Dependency audit
npm audit

# Code security scan
npm run lint:security
```

## 📋 Güvenlik Checklist

### Development
- [ ] Environment variables güvenli
- [ ] API anahtarları gizli
- [ ] Debug modu kapalı
- [ ] Console.log'lar temizlendi

### Authentication
- [ ] JWT token kullanımı
- [ ] Token expiration kontrolü
- [ ] Secure token storage
- [ ] Logout functionality

### Authorization
- [ ] Role-based access control
- [ ] Route protection
- [ ] Component-level permissions
- [ ] API endpoint protection

### Data Protection
- [ ] HTTPS kullanımı
- [ ] Input validation
- [ ] Output sanitization
- [ ] Secure data transmission

## 🚨 Güvenlik İhlali Durumunda

### Acil Durum Planı

1. **Hemen Tepki**
   - Tüm API anahtarlarını değiştir
   - Kullanıcı şifrelerini sıfırla
   - Güvenlik loglarını kontrol et

2. **İnceleme**
   - Güvenlik açığının kaynağını bul
   - Etkilenen sistemleri belirle
   - Veri sızıntısı olup olmadığını kontrol et

3. **Düzeltme**
   - Güvenlik açığını kapat
   - Güvenlik önlemlerini güçlendir
   - Monitoring sistemlerini iyileştir

4. **Bildirim**
   - Kullanıcıları bilgilendir
   - Gerekirse yetkili makamlara bildir
   - Güvenlik raporu hazırla

## 🔧 Güvenlik Konfigürasyonu

### API Service Güvenlik

```javascript
// src/services/api.js
class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL
    
    // Güvenlik headers
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }

  // Güvenli request
  async request(endpoint, options = {}) {
    const token = this.getAuthToken()
    
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    }

    // HTTPS zorunluluğu
    if (!this.baseURL.startsWith('https://')) {
      console.warn('⚠️ Güvenlik: HTTPS kullanmanız önerilir')
    }

    return fetch(`${this.baseURL}${endpoint}`, options)
  }
}
```

### Router Güvenlik

```javascript
// src/router/index.js
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  
  if (requiresAuth) {
    const user = await authService.checkAuthStatus()
    
    if (!user) {
      return next('/login')
    }
    
    // Role kontrolü
    const requiredRole = to.meta.roles
    if (requiredRole && !requiredRole.includes(user.role)) {
      return next('/unauthorized')
    }
  }
  
  next()
})
```

## 📊 Güvenlik Monitoring

### Logging

```javascript
// Güvenlik logları
const securityLogger = {
  logAuthAttempt: (success, user, ip) => {
    console.log('🔐 Auth Attempt:', { success, user, ip, timestamp: new Date() })
  },
  
  logApiCall: (endpoint, method, user) => {
    console.log('🌐 API Call:', { endpoint, method, user, timestamp: new Date() })
  },
  
  logSecurityViolation: (type, details) => {
    console.error('🚨 Security Violation:', { type, details, timestamp: new Date() })
  }
}
```

### Monitoring

- **Authentication Logs**: Giriş denemeleri
- **API Access Logs**: Endpoint erişimleri
- **Error Logs**: Güvenlik hataları
- **Performance Logs**: Anormal davranışlar 