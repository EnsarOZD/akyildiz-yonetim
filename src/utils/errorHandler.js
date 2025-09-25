// errorHandler.js

// Hata tipleri
export const ERROR_TYPES = {
  NETWORK: 'network',
  AUTH: 'auth',
  VALIDATION: 'validation',
  PERMISSION: 'permission',
  NOT_FOUND: 'not_found',
  SYSTEM: 'system'
};

// Hata mesajları
export const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: {
    title: 'Bağlantı Hatası',
    message: 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.',
    action: 'Tekrar Dene'
  },
  [ERROR_TYPES.AUTH]: {
    title: 'Yetkilendirme Hatası',
    message: 'Bu işlem için yetkiniz bulunmuyor. Lütfen tekrar giriş yapın.',
    action: 'Giriş Yap'
  },
  [ERROR_TYPES.VALIDATION]: {
    title: 'Geçersiz Veri',
    message: 'Lütfen girdiğiniz bilgileri kontrol edin.',
    action: 'Düzelt'
  },
  [ERROR_TYPES.PERMISSION]: {
    title: 'Erişim Reddedildi',
    message: 'Bu sayfaya erişim yetkiniz bulunmuyor.',
    action: 'Ana Sayfaya Dön'
  },
  [ERROR_TYPES.NOT_FOUND]: {
    title: 'Bulunamadı',
    message: 'Aradığınız kayıt bulunamadı.',
    action: 'Geri Dön'
  },
  [ERROR_TYPES.SYSTEM]: {
    title: 'Sistem Hatası',
    message: 'Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
    action: 'Tekrar Dene'
  }
};

// HTTP hata kodları
export const HTTP_ERROR_MESSAGES = {
  400: 'Geçersiz istek gönderildi.',
  401: 'Oturum süresi doldu. Lütfen tekrar giriş yapın.',
  403: 'Bu işlem için yetkiniz bulunmuyor.',
  404: 'Aradığınız kayıt bulunamadı.',
  409: 'Bu kayıt zaten mevcut.',
  422: 'Geçersiz veri gönderildi.',
  429: 'Çok fazla istek gönderildi. Lütfen bir süre bekleyin.',
  500: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
  502: 'Sunucu geçici olarak kullanılamıyor.',
  503: 'Servis geçici olarak kullanılamıyor.',
  504: 'Sunucu yanıt vermiyor.'
};

// AppError sınıfı
export class AppError extends Error {
  constructor(type, message, originalError = null, context = {}) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.originalError = originalError;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
  getDisplayMessage() {
    const fallback = { title: 'Hata', message: 'Beklenmeyen bir hata oluştu.', action: 'Tekrar Dene' };
    const meta = ERROR_MESSAGES[this.type] || fallback;
    return {
      title: meta.title,
      // Sunucudan/JS’ten gelen detaylı mesaj varsa onu göster; yoksa tipin varsayılan mesajını kullan
      message: this.message || meta.message,
      action: meta.action
    };
  }
}

// Hata objesi oluştur
export function createError(type, message, originalError = null, context = {}) {
  return {
    type,
    message,
    originalError,
    context,
    timestamp: new Date().toISOString(),
    id: Math.random().toString(36).substr(2, 9)
  };
}

// Hata mesajını al
export function getErrorMessage(error) {

   // 1) API hata mesajı varsa onu tercih et
  try {
      const data = error?.response?.data
      if (data) {
        if (typeof data === 'string' && data.trim()) return data
        if (typeof data?.message === 'string' && data.message.trim()) return data.message
        if (typeof data?.title === 'string' && data.title.trim()) return data.title
        // ModelState / validation errors
        if (data?.errors && typeof data.errors === 'object') {
          const firstKey = Object.keys(data.errors)[0]
          const firstMsg = Array.isArray(data.errors[firstKey]) ? data.errors[firstKey][0] : data.errors[firstKey]
          if (firstMsg) return String(firstMsg)
        }
      }
    } catch (_) {}
  
    // 2) Sunucu mesajı yoksa HTTP map'e düş
    if (error?.response?.status && HTTP_ERROR_MESSAGES[error.response.status]) {
      return HTTP_ERROR_MESSAGES[error.response.status];
    }

  // Genel hata mesajları
  if (error?.message) {
    return error.message;
  }

  return 'Beklenmeyen bir hata oluştu.';
}

// Hata türünü belirle
export function getErrorType(error) {
  if (error?.response?.status) {
    const status = error.response.status;

    if (status === 401) return ERROR_TYPES.AUTH;
    if (status === 403) return ERROR_TYPES.PERMISSION;
    if (status === 404) return ERROR_TYPES.NOT_FOUND;
    if (status === 422) return ERROR_TYPES.VALIDATION;
    if (status >= 500) return ERROR_TYPES.SYSTEM;
    if (status >= 400) return ERROR_TYPES.VALIDATION;
  }

  return ERROR_TYPES.SYSTEM;
}

// Hata işleyici
export class ErrorHandler {
  constructor() {
    this.errorListeners = [];
    this.errorHistory = [];
  }

  // Hata kaydet
  logError(error, context = {}) {
    const appError = error instanceof AppError
      ? error
      : new AppError(
          this.determineErrorType(error),
          this.getErrorMessage(error),
          error,
          context
        );

    // Konsola log
    console.error('Application Error:', {
      type: appError.type,
      message: appError.message,
      context: appError.context,
      timestamp: appError.timestamp,
      originalError: appError.originalError
        ? {
            name: appError.originalError.name,
            message: appError.originalError.message,
            code: appError.originalError.code,
            stack: appError.originalError.stack
          }
        : null
    });

    // Hata geçmişine ekle
    this.errorHistory.push(appError);

    // Listener'lara bildir
    this.notifyListeners(appError);

    return appError;
  }

  // Başarı / bilgi / uyarı mesajı kaydet
  logSuccess(type, message, context = {}) {
    const successData = {
      type, // 'success', 'info', 'warning'
      message,
      context,
      timestamp: new Date().toISOString(),
      getDisplayMessage: () => ({
        title: type === 'success' ? 'Başarılı' : type === 'info' ? 'Bilgi' : 'Uyarı',
        message,
        action: null
      })
    };

    // Konsola log
    console.log('Application Success:', {
      type: successData.type,
      message: successData.message,
      context: successData.context,
      timestamp: successData.timestamp
    });

    // Listener'lara bildir
    this.notifyListeners(successData);

    return successData;
  }

  // Hata mesajını al
  getErrorMessage(error) {
    return getErrorMessage(error);
  }

  // Hata tipini belirle
  determineErrorType(error) {
    if (error?.code) {
      if (String(error.code).startsWith('auth/')) return ERROR_TYPES.AUTH;
      if (error.code === 'permission-denied') return ERROR_TYPES.PERMISSION;
      if (error.code === 'not-found') return ERROR_TYPES.NOT_FOUND;
      if (error.code === 'unavailable') return ERROR_TYPES.NETWORK;
    }

    if (error?.message) {
      const message = String(error.message).toLowerCase();
      if (message.includes('network') || message.includes('fetch')) return ERROR_TYPES.NETWORK;
      if (message.includes('permission') || message.includes('access')) return ERROR_TYPES.PERMISSION;
      if (message.includes('validation') || message.includes('invalid')) return ERROR_TYPES.VALIDATION;
      if (message.includes('not found') || message.includes('bulunamadı')) return ERROR_TYPES.NOT_FOUND;
    }

    return ERROR_TYPES.SYSTEM;
  }

  // Listener ekle/çıkar
  addListener(callback) {
    if (typeof callback === 'function') this.errorListeners.push(callback);
  }
  removeListener(cb) {
    this.errorListeners = this.errorListeners.filter(x => x !== cb);
  }

  // Listener'ları bildir
  notifyListeners(payload) {
    this.errorListeners.forEach(callback => {
      try {
        callback(payload);
      } catch (listenerError) {
        console.error('Error listener failed:', listenerError);
      }
    });
  }

  // Hata geçmişi
  getErrorHistory() {
    return this.errorHistory;
  }
  clearErrorHistory() {
    this.errorHistory = [];
  }
}

// Global hata işleyici instance
export const errorHandler = new ErrorHandler();

// Global hata yakalama
window.addEventListener('error', event => {
  errorHandler.logError(event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', event => {
  errorHandler.logError(event.reason, {
    type: 'unhandledrejection'
  });
});

// Utility fonksiyonlar
export function handleError(error, context = {}) {
  return errorHandler.logError(error, context);
}

export function isNetworkError(error) {
  return (
    error?.type === ERROR_TYPES.NETWORK ||
    error?.message?.toLowerCase().includes('network') ||
    error?.message?.toLowerCase().includes('fetch')
  );
}

export function isAuthError(error) {
  return error?.type === ERROR_TYPES.AUTH || String(error?.code || '').startsWith('auth/');
}

export function isPermissionError(error) {
  return error?.type === ERROR_TYPES.PERMISSION || error?.code === 'permission-denied';
}
