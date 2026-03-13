import apiService from './api.js'

class AuthService {
  constructor() {
    this.currentUser = null
    this.authListeners = []
  }

  // Kullanıcı girişi
  async login(email, password) {
    try {
      const response = await apiService.post('/Auth/login', { email, password })
      console.log('Backend login response:', response)

      if (response) {
        const token = response.token || response.accessToken || response.access_token || response.jwt

        if (token) {
          localStorage.setItem('authToken', token)
          console.log('✅ JWT Token kaydedildi')

          this.currentUser = response.user || response.data || response
          this.notifyAuthListeners(this.currentUser)

          return response
        } else {
          console.error('❌ JWT Token bulunamadı')
          throw new Error('Giriş başarısız: Token alınamadı')
        }
      } else {
        throw new Error('Boş yanıt alındı')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Kullanıcı çıkışı
  async logout() {
    try {
      await apiService.post('/Auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('authToken')
      this.currentUser = null
      this.notifyAuthListeners(null)
    }
  }

  // Mevcut kullanıcıyı kontrol et
  async checkAuthStatus() {
    try {
      if (this.currentUser) {
        return this.currentUser
      }

      const token = localStorage.getItem('authToken')
      if (!token || !this.isTokenValid(token)) {
        console.log('❌ Token yok veya geçersiz')
        await this.logout() // Garantili temizlik
        return null
      }

      console.log('✅ JWT Token geçerli, backend\'den bilgi alınıyor...')
      try {
        const response = await apiService.get('/Auth/me')
        this.currentUser = response.user || response
        this.notifyAuthListeners(this.currentUser)
        return this.currentUser
      } catch (apiError) {
        console.error('❌ API auth check failed, logging out:', apiError)
        await this.logout()
        return null
      }
    } catch (error) {
      console.error('❌ Auth check error:', error)
      await this.logout()
      return null
    }
  }

  // Şifre sıfırlama (Token talebi)
  async resetPassword(email) {
    return apiService.post('/auth/reset-password-request', { email })
  }

  // Yeni şifre belirleme (Token ile)
  async setPassword(email, token, newPassword) {
    return apiService.post('/auth/reset-password', {
      email,
      token,
      newPassword
    })
  }

  // Şifre değiştirme (Profil içinden)
  async changePassword(currentPassword, newPassword) {
    return apiService.post('/auth/change-password', {
      currentPassword,
      newPassword
    })
  }

  // Auth state listener ekle
  onAuthStateChanged(callback) {
    this.authListeners.push(callback)

    // Mevcut kullanıcıyı hemen callback'e gönder
    if (this.currentUser) {
      callback(this.currentUser)
    }

    // Cleanup fonksiyonu döndür
    return () => {
      const index = this.authListeners.indexOf(callback)
      if (index > -1) {
        this.authListeners.splice(index, 1)
      }
    }
  }

  // Auth listeners'ları bildir
  notifyAuthListeners(user) {
    this.authListeners.forEach(callback => {
      try {
        callback(user)
      } catch (error) {
        console.error('Auth listener error:', error)
      }
    })
  }

  // Token'ı al
  getToken() {
    return localStorage.getItem('authToken')
  }

  // Kullanıcının giriş yapıp yapmadığını kontrol et
  isAuthenticated() {
    return !!this.currentUser && !!this.getToken()
  }

  // Kullanıcı rolünü kontrol et
  hasRole(role) {
    return this.currentUser && this.currentUser.role === role
  }

  // JWT Token'ı decode et
  decodeJWT(token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('JWT decode error:', error)
      return null
    }
  }

  // JWT Token'ın geçerliliğini kontrol et
  isTokenValid(token) {
    if (!token) return false

    try {
      const decoded = this.decodeJWT(token)
      if (!decoded) return false

      // Token'ın süresi dolmuş mu kontrol et
      const currentTime = Date.now() / 1000
      if (decoded.exp && decoded.exp < currentTime) {
        console.log('JWT Token süresi dolmuş')
        return false
      }

      return true
    } catch (error) {
      console.error('Token validation error:', error)
      return false
    }
  }

  // Backend bağlantısını test et
  async testBackendConnection() {
    try {
      const response = await apiService.get('/health')
      console.log('Backend health check response:', response)
      return response
    } catch (error) {
      console.error('Backend connection test failed:', error)
      throw error
    }
  }

  // Backend auth endpoint'lerini test et
  async testAuthEndpoints() {
    try {
      // /auth/me endpoint'ini test et
      const meResponse = await apiService.get('/auth/me')
      console.log('✅ /auth/me endpoint response:', meResponse)
      return meResponse
    } catch (error) {
      console.log('❌ /auth/me endpoint not available:', error.message)
      return null
    }
  }

  // JWT Token test fonksiyonu
  async testJWTToken() {
    const token = localStorage.getItem('authToken')
    if (token) {
      const decoded = this.decodeJWT(token)
      console.log('🔍 JWT Token decoded:', decoded)
      return decoded
    }
    return null
  }
}

export default new AuthService() 