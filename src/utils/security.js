/**
 * Input sanitization için güvenlik fonksiyonları
 */

// XSS koruması için HTML escape
export function escapeHtml(text) {
  if (typeof text !== 'string') return text
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// SQL Injection koruması için input validation
export function validateInput(input, type = 'text') {
  if (!input) return false
  
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[0-9\s\-\(\)]{10,}$/,
    number: /^[0-9]+(\.[0-9]+)?$/,
    currency: /^[0-9]+(\.[0-9]{1,2})?$/,
    text: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s\-\.\,]+$/,
    alphanumeric: /^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s\-\.\,]+$/
  }
  
  return patterns[type]?.test(input) || false
}

// Dosya upload güvenliği
export function validateFile(file, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']) {
  if (!file) return false
  
  // Dosya boyutu kontrolü (5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('Dosya boyutu 5MB\'dan büyük olamaz')
  }
  
  // Dosya tipi kontrolü
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Geçersiz dosya tipi')
  }
  
  return true
}

// Rate limiting için basit implementasyon
export class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
    this.attempts = new Map()
  }
  
  isAllowed(key) {
    const now = Date.now()
    const userAttempts = this.attempts.get(key)
    
    if (!userAttempts) {
      this.attempts.set(key, { count: 1, lastAttempt: now })
      return true
    }
    
    // Zaman penceresi dışındaysa sıfırla
    if (now - userAttempts.lastAttempt > this.windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now })
      return true
    }
    
    // Limit kontrolü
    if (userAttempts.count >= this.maxAttempts) {
      return false
    }
    
    userAttempts.count++
    userAttempts.lastAttempt = now
    return true
  }
  
  reset(key) {
    this.attempts.delete(key)
  }
}

// CSRF token oluşturma
export function generateCSRFToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Güvenli şifre kontrolü
export function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Şifre en az 8 karakter olmalıdır' }
  }
  
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return { 
      valid: false, 
      message: 'Şifre büyük harf, küçük harf, rakam ve özel karakter içermelidir' 
    }
  }
  
  return { valid: true, message: 'Şifre güvenli' }
}

// Audit log için güvenlik bilgileri
export function getSecurityContext() {
  return {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    url: window.location.href
  }
} 