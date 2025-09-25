import { useNotification } from './useNotification'
import { ERROR_TYPES, createError } from '@/utils/errorHandler'

export function useErrorHandler() {
  const { showError, showSuccess } = useNotification()

  // Backend API işlemleri için hata yönetimi
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

    const errorObj = createError(
      errorType,
      message,
      error,
      context
    )

    showError(errorObj)
  }

  const handleValidationError = (error, context = {}) => {
    console.error('Validation Error:', error, context)
    
    const message = error?.message || 'Geçersiz veri gönderildi.'
    const errorObj = createError(
      ERROR_TYPES.VALIDATION,
      message,
      error,
      context
    )

    showError(errorObj)
  }

  const handleAuthError = (error, context = {}) => {
    console.error('Auth Error:', error, context)
    
    let message = 'Kimlik doğrulama hatası.'
    
    if (error?.response?.status === 401) {
      message = 'Geçersiz kimlik bilgileri.'
    } else if (error?.response?.status === 403) {
      message = 'Bu işlem için yetkiniz bulunmuyor.'
    }

    const errorObj = createError(
      ERROR_TYPES.AUTH,
      message,
      error,
      context
    )

    showError(errorObj)
  }

  const handleGenericError = (error, message = 'Beklenmeyen bir hata oluştu.', context = {}) => {
    console.error('Generic Error:', error, context)
    
    const errorObj = createError(
      ERROR_TYPES.SYSTEM,
      message,
      error,
      context
    )

    showError(errorObj)
  }

  const withErrorHandling = async (operation, context = {}) => {
    try {
      return await operation()
    } catch (error) {
      handleNetworkError(error, context)
      throw error
    }
  }

  const validateForm = (data, rules) => {
    const errors = []
    
    for (const [field, rule] of Object.entries(rules)) {
      const value = data[field]
      
      if (rule.required && (!value || value.toString().trim() === '')) {
        errors.push(`${rule.label || field} alanı zorunludur.`)
      }
      
      if (rule.minLength && value && value.length < rule.minLength) {
        errors.push(`${rule.label || field} en az ${rule.minLength} karakter olmalıdır.`)
      }
      
      if (rule.maxLength && value && value.length > rule.maxLength) {
        errors.push(`${rule.label || field} en fazla ${rule.maxLength} karakter olmalıdır.`)
      }
      
      if (rule.pattern && value && !rule.pattern.test(value)) {
        errors.push(`${rule.label || field} geçerli bir formatta değil.`)
      }
      
      if (rule.custom && value) {
        const customError = rule.custom(value, data)
        if (customError) {
          errors.push(customError)
        }
      }
    }
    
    if (errors.length > 0) {
      handleValidationError(errors.join(' '), { component: 'Form', action: 'validation' })
      return false
    }
    
    return true
  }

  return {
    handleNetworkError,
    handleValidationError,
    handleAuthError,
    handleGenericError,
    showSuccess,
    showError,
    withErrorHandling,
    validateForm
  }
} 