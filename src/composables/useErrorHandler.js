import { useNotification } from './useNotification'
import { ERROR_TYPES, createError, getErrorMessage } from '@/utils/errorHandler'

export function useErrorHandler() {
  const { showError, showSuccess } = useNotification()

  // Backend API işlemleri için hata yönetimi
  const handleNetworkError = (error, context = {}) => {
    console.error('Network Error:', error, context)

    const status = error?.apiError?.status || error?.status || error?.response?.status
    const message = getErrorMessage(error)

    // ✅ errorType tanımlı ve default'u var
    let errorType = ERROR_TYPES.SYSTEM

    if (status === 400 || status === 422) {
      errorType = ERROR_TYPES.VALIDATION
    } else if (status === 401) {
      errorType = ERROR_TYPES.AUTH
    } else if (status === 403) {
      errorType = ERROR_TYPES.PERMISSION
    } else if (status === 404) {
      errorType = ERROR_TYPES.NOT_FOUND
    } else if (status >= 500) {
      errorType = ERROR_TYPES.SYSTEM
    } else if (!status) {
      // status yoksa çoğunlukla network/fetch hatasıdır
      errorType = ERROR_TYPES.NETWORK
    }

    const errorObj = createError(
      errorType,
      message,
      error,
      context
    )

    showError(errorObj)
  }

  // ✅ artık hem string hem Error objesi kabul ediyor
  const handleValidationError = (errorOrMessage, context = {}) => {
    console.error('Validation Error:', errorOrMessage, context)

    const message =
      typeof errorOrMessage === 'string'
        ? errorOrMessage
        : (errorOrMessage?.message || 'Geçersiz veri gönderildi.')

    const errorObj = createError(
      ERROR_TYPES.VALIDATION,
      message,
      errorOrMessage,
      context
    )

    showError(errorObj)
  }

  const handleAuthError = (error, context = {}) => {
    console.error('Auth Error:', error, context)

    // ✅ getErrorMessage artık her şeyi parse ediyor, burada override yapma
    const message = getErrorMessage(error)

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
      // ✅ artık mesaj kaybolmuyor
      handleValidationError(errors.join('\n'), { component: 'Form', action: 'validation' })
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