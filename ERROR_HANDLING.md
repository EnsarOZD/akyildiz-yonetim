# Hata Yönetimi Rehberi

## 🚨 Hata Türleri

Bu uygulama aşağıdaki hata türlerini destekler:

#### 1. **NETWORK** - Ağ Hataları
- Bağlantı kesintileri
- Timeout hataları
- DNS çözümleme hataları

#### 2. **AUTH** - Kimlik Doğrulama Hataları
- Geçersiz kimlik bilgileri
- Süresi dolmuş token'lar
- Yetkilendirme hataları

#### 3. **VALIDATION** - Doğrulama Hataları
- Form doğrulama hataları
- Veri format hataları
- Zorunlu alan eksiklikleri

#### 4. **PERMISSION** - İzin Hataları
- Yetki yetersizliği
- Erişim reddedildi
- Rol tabanlı kısıtlamalar

#### 5. **NOT_FOUND** - Bulunamadı Hataları
- Kayıt bulunamadı
- Sayfa bulunamadı
- Dosya bulunamadı

#### 6. **SYSTEM** - Sistem Hataları
- Sunucu hataları
- Veritabanı hataları
- Backend API hataları

#### 7. **BACKEND** - Backend API Hataları
- API endpoint hataları
- Backend servis hataları
- Veritabanı işlem hataları

## 🛠️ Hata Yönetimi Kullanımı

### Temel Kullanım

```javascript
import { useErrorHandler } from '@/composables/useErrorHandler'

const { handleNetworkError, handleValidationError, showSuccess } = useErrorHandler()

// Ağ hatası
try {
  const data = await apiService.get('/endpoint')
} catch (error) {
  handleNetworkError(error, { component: 'MyComponent', action: 'fetchData' })
}

// Doğrulama hatası
try {
  await validateForm(data)
} catch (error) {
  handleValidationError(error, { component: 'MyComponent' })
}
```

### Özel Hata Yönetimi

```javascript
import { ERROR_TYPES, createError } from '@/utils/errorHandler'

// Özel hata oluştur
const customError = createError(
  ERROR_TYPES.BACKEND,
  'Özel hata mesajı',
  originalError,
  { component: 'MyComponent', action: 'customAction' }
)

// Hata göster
showError(customError)
```

### Backend API Hataları

```javascript
// Backend API hatası
try {
  const response = await apiService.post('/api/endpoint', data)
} catch (error) {
  if (error.response?.status === 401) {
    // Kimlik doğrulama hatası
    handleNetworkError(error, { component: 'Auth', action: 'login' })
  } else if (error.response?.status === 404) {
    // Bulunamadı hatası
    handleNetworkError(error, { component: 'Data', action: 'fetch' })
  } else {
    // Genel backend hatası
    handleNetworkError(error, { component: 'API', action: 'request' })
  }
}
```

## 📋 Hata Mesajları

### Türkçe Hata Mesajları

```javascript
const ERROR_MESSAGES = {
  NETWORK: 'Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edin.',
  AUTH: 'Oturum süresi doldu. Lütfen tekrar giriş yapın.',
  VALIDATION: 'Geçersiz veri gönderildi. Lütfen formu kontrol edin.',
  PERMISSION: 'Bu işlem için yetkiniz bulunmuyor.',
  NOT_FOUND: 'Aradığınız kayıt bulunamadı.',
  SYSTEM: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
  BACKEND: 'Backend servis hatası oluştu.'
}
```

## 🔧 Hata Yönetimi Konfigürasyonu

### Error Handler Konfigürasyonu

```javascript
// src/composables/useErrorHandler.js
export function useErrorHandler() {
  const { showError, showSuccess } = useNotification()

  const handleNetworkError = (error, context = {}) => {
    console.error('Network Error:', error, context)
    
    let errorType = ERROR_TYPES.NETWORK
    let message = 'Bağlantı hatası oluştu.'
    
    if (error?.response?.status === 401) {
      errorType = ERROR_TYPES.AUTH
      message = 'Oturum süresi doldu. Lütfen tekrar giriş yapın.'
    } else if (error?.response?.status === 403) {
      errorType = ERROR_TYPES.PERMISSION
      message = 'Bu işlem için yetkiniz bulunmuyor.'
    } else if (error?.response?.status === 404) {
      errorType = ERROR_TYPES.NOT_FOUND
      message = 'Aradığınız kayıt bulunamadı.'
    } else if (error?.response?.status === 422) {
      errorType = ERROR_TYPES.VALIDATION
      message = 'Geçersiz veri gönderildi.'
    } else if (error?.response?.status >= 500) {
      errorType = ERROR_TYPES.SYSTEM
      message = 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.'
    }

    const errorObj = createError(errorType, message, error, context)
    showError(errorObj)
  }

  return {
    handleNetworkError,
    handleValidationError,
    showSuccess
  }
}
```

## 📊 Hata İzleme

### Console Logging

```javascript
// Hata detayları console'da görüntülenir
console.error('Error Details:', {
  type: error.type,
  message: error.message,
  component: error.context?.component,
  action: error.context?.action,
  timestamp: error.timestamp,
  originalError: error.originalError
})
```

### Hata Raporlama

```javascript
// Hata raporlama için
const reportError = (error) => {
  // Hata raporlama servisi entegrasyonu
  // Sentry, LogRocket, vb.
  console.error('Error reported:', error)
}
```

## 🎯 En İyi Uygulamalar

1. **Her zaman try-catch kullanın**
2. **Hata bağlamını belirtin** (component, action)
3. **Kullanıcı dostu mesajlar gösterin**
4. **Hataları loglayın**
5. **Fallback mekanizmaları ekleyin**
6. **Hata durumlarını test edin** 