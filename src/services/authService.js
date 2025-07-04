import apiService from './api.js'

class AuthService {
  constructor() {
    this.currentUser = null
    this.authListeners = []
  }

  // Kullanıcı girişi
  async login(email, password) {
    try {
      const response = await apiService.post('/auth/login', { email, password })
      console.log('Backend login response:', response)
      
      // Backend yanıt formatını kontrol et
      if (response) {
        // JWT Token kontrolü - ASP.NET Core formatı
        const token = response.token || response.accessToken || response.access_token || response.jwt
        
        if (token) {
          // JWT Token'ı localStorage'a kaydet
          localStorage.setItem('authToken', token)
          console.log('✅ JWT Token kaydedildi')
          
          // Kullanıcı bilgilerini güncelle
          this.currentUser = response.user || response.data || response
          
          // Auth state değişikliğini bildir
          this.notifyAuthListeners(this.currentUser)
          
          return response
        } else {
          // JWT Token yoksa geçici olarak kullanıcı bilgilerini kullan
          console.log('⚠️ JWT Token bulunamadı, geçici auth kullanılıyor')
          
          // Kullanıcı bilgilerini güncelle
          this.currentUser = response.user || response.data || response
          
          // Geçici bir session token oluştur
          const tempToken = btoa(JSON.stringify(this.currentUser))
          localStorage.setItem('authToken', tempToken)
          
          // Auth state değişikliğini bildir
          this.notifyAuthListeners(this.currentUser)
          
          return response
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
      await apiService.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Local storage'ı temizle
      localStorage.removeItem('authToken')
      this.currentUser = null
      
      // Auth state değişikliğini bildir
      this.notifyAuthListeners(null)
    }
  }

  // Kullanıcı kaydı
  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData)
      
      if (response.token) {
        localStorage.setItem('authToken', response.token)
        this.currentUser = response.user
        this.notifyAuthListeners(this.currentUser)
      }
      
      return response
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  // Mevcut kullanıcıyı kontrol et
  async checkAuthStatus() {
    try {
      // Eğer zaten kullanıcı varsa, tekrar kontrol etme
      if (this.currentUser) {
        console.log('👤 Kullanıcı zaten mevcut, tekrar kontrol edilmiyor')
        return this.currentUser
      }

      console.log('🔍 Auth status kontrol ediliyor...')
      const token = localStorage.getItem('authToken')
      console.log('🎫 Token var mı:', !!token)
      
      if (!token) {
        console.log('❌ Token yok, kullanıcı null')
        this.currentUser = null
        this.notifyAuthListeners(null)
        return null
      }

      // JWT Token'ın geçerliliğini kontrol et
      if (!this.isTokenValid(token)) {
        console.log('⚠️ JWT Token geçersiz, geçici token kontrol ediliyor...')
        
        // Geçici token kontrolü
        try {
          const tempUser = JSON.parse(atob(token))
          if (tempUser && tempUser.email) {
            console.log('✅ Geçici token geçerli:', tempUser.email)
            this.currentUser = tempUser
            this.notifyAuthListeners(this.currentUser)
            return this.currentUser
          }
        } catch (tempError) {
          console.log('❌ Geçici token da geçersiz:', tempError.message)
        }
        
        console.log('🗑️ Token temizleniyor')
        localStorage.removeItem('authToken')
        this.currentUser = null
        this.notifyAuthListeners(null)
        return null
      }

      console.log('✅ JWT Token geçerli, backend\'den bilgi alınıyor...')
      // Token geçerliyse backend'den kullanıcı bilgilerini al
      try {
        const response = await apiService.get('/auth/me')
        console.log('📡 Backend /auth/me yanıtı:', response)
        this.currentUser = response.user || response
        this.notifyAuthListeners(this.currentUser)
        return this.currentUser
      } catch (apiError) {
        console.error('❌ API auth check failed:', apiError)
        
        // API hatası durumunda JWT'den kullanıcı bilgilerini çıkar
        const decodedToken = this.decodeJWT(token)
        if (decodedToken && decodedToken.sub) {
          console.log('🔍 JWT\'den kullanıcı bilgileri çıkarılıyor')
          this.currentUser = {
            id: decodedToken.sub,
            email: decodedToken.email,
            role: decodedToken.role || decodedToken.role_name,
            firstName: decodedToken.firstName || decodedToken.given_name,
            lastName: decodedToken.lastName || decodedToken.family_name
          }
          this.notifyAuthListeners(this.currentUser)
          return this.currentUser
        }
        
        // Hiçbir şekilde kullanıcı bilgisi alınamazsa temizle
        console.log('🗑️ Hiçbir kullanıcı bilgisi alınamadı, temizleniyor')
        localStorage.removeItem('authToken')
        this.currentUser = null
        this.notifyAuthListeners(null)
        return null
      }
    } catch (error) {
      console.error('❌ Auth check error:', error)
      localStorage.removeItem('authToken')
      this.currentUser = null
      this.notifyAuthListeners(null)
      return null
    }
  }

  // Şifre sıfırlama
  async resetPassword(email) {
    return apiService.post('/auth/reset-password', { email })
  }

  // Şifre değiştirme
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
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
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