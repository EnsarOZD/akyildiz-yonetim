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
    const fallback = {
      title: 'Hata',
      message: 'Beklenmeyen bir hata oluştu.',
      action: 'Tekrar Dene'
    };

    const meta = ERROR_MESSAGES[this.type] || fallback;

    return {
      title: meta.title,
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

// ================================
// MESAJ PARSER (Backend uyumlu)
// ================================
export function getErrorMessage(error) {

  const stringifyErrors = (errs) => {
    if (!errs) return null;

    // Result formatı: errors: ["msg1", "msg2"]
    if (Array.isArray(errs) && errs.length) {
      return errs.join("\n"); // İstersen " • " yapabilirsin
    }

    // ModelState formatı: errors: { field: ["msg"], ... }
    if (typeof errs === "object") {
      const flat = [];
      for (const key of Object.keys(errs)) {
        const v = errs[key];
        if (Array.isArray(v)) flat.push(...v.filter(Boolean));
        else if (typeof v === "string" && v.trim()) flat.push(v);
      }
      if (flat.length) return flat.join("\n");
    }

    return null;
  };

  try {
    // 1️⃣ Yeni fetch apiError yapısı
    const apiData = error?.apiError?.data;
    if (apiData) {
      const errs = stringifyErrors(apiData.errors);
      if (errs) return errs;

      if (typeof apiData.errorMessage === "string" && apiData.errorMessage.trim()) {
        return apiData.errorMessage;
      }

      if (typeof apiData === "string" && apiData.trim()) return apiData;
      if (typeof apiData.message === "string" && apiData.message.trim()) return apiData.message;
      if (typeof apiData.title === "string" && apiData.title.trim()) return apiData.title;
    }

    // 2️⃣ Axios fallback
    const data = error?.response?.data;
    if (data) {
      if (typeof data === "string" && data.trim()) return data;

      const errs = stringifyErrors(data.errors);
      if (errs) return errs;

      if (typeof data.errorMessage === "string" && data.errorMessage.trim()) return data.errorMessage;
      if (typeof data.message === "string" && data.message.trim()) return data.message;
      if (typeof data.title === "string" && data.title.trim()) return data.title;
    }

  } catch (_) { }

  // 3️⃣ HTTP fallback
  const status = error?.apiError?.status || error?.status || error?.response?.status;
  if (status && HTTP_ERROR_MESSAGES[status]) {
    return HTTP_ERROR_MESSAGES[status];
  }

  // 4️⃣ Final fallback
  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }

  return 'Beklenmeyen bir hata oluştu.';
}

// ================================
// HATA TÜRÜ BELİRLEME
// ================================
export function getErrorType(error) {
  const status = error?.apiError?.status || error?.status || error?.response?.status;

  if (status) {
    if (status === 401) return ERROR_TYPES.AUTH;
    if (status === 403) return ERROR_TYPES.PERMISSION;
    if (status === 404) return ERROR_TYPES.NOT_FOUND;
    if (status === 400 || status === 422) return ERROR_TYPES.VALIDATION;
    if (status >= 500) return ERROR_TYPES.SYSTEM;
    if (status >= 400) return ERROR_TYPES.VALIDATION;
  }

  if (
    error?.message?.toLowerCase().includes('network') ||
    error?.message?.toLowerCase().includes('fetch')
  ) {
    return ERROR_TYPES.NETWORK;
  }

  return ERROR_TYPES.SYSTEM;
}

// ================================
// GLOBAL ERROR HANDLER
// ================================
export class ErrorHandler {
  constructor() {
    this.errorListeners = [];
    this.errorHistory = [];
  }

  logError(error, context = {}) {
    const appError = error instanceof AppError
      ? error
      : new AppError(
        getErrorType(error),
        getErrorMessage(error),
        error,
        context
      );

    console.error('Application Error:', {
      type: appError.type,
      message: appError.message,
      context: appError.context,
      timestamp: appError.timestamp
    });

    this.errorHistory.push(appError);
    this.notifyListeners(appError);

    return appError;
  }

  logSuccess(type, message, context = {}) {
    const payload = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      context,
      timestamp: new Date().toISOString()
    };

    console.log(`Success Notification (${type}):`, message);
    this.notifyListeners(payload);
    return payload;
  }

  addListener(callback) {
    if (typeof callback === 'function') this.errorListeners.push(callback);
  }

  removeListener(cb) {
    this.errorListeners = this.errorListeners.filter(x => x !== cb);
  }

  notifyListeners(payload) {
    this.errorListeners.forEach(callback => {
      try {
        callback(payload);
      } catch (listenerError) {
        console.error('Error listener failed:', listenerError);
      }
    });
  }

  getErrorHistory() {
    return this.errorHistory;
  }

  clearErrorHistory() {
    this.errorHistory = [];
  }
}

// Global instance
export const errorHandler = new ErrorHandler();

// Global JS hataları
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

// Utility
export function handleError(error, context = {}) {
  return errorHandler.logError(error, context);
}