// API servis katmanı - Backend ile iletişim için
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // Authentication token'ını al
  getAuthToken() {
    return localStorage.getItem('authToken')
  }

  // Generic HTTP metodları
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    // Authentication token'ını ekle
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    const token = this.getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const config = {
      headers,
      // JWT için credentials gerekli değil, Authorization header kullanılıyor
      ...options
    }

    try {
      console.log('🌐 API Request:', { url, method: config.method, headers: config.headers })
      const response = await fetch(url, config)
      console.log('📡 API Response Status:', response.status, response.statusText)
      
      // 401 Unauthorized durumunda token'ı temizle
      if (response.status === 401) {
        localStorage.removeItem('authToken')
        window.location.href = '/login'
        throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.')
      }
      
      if (!response.ok) {
        // Hata mesajını almaya çalış
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.text()
          console.log('❌ API Error Response:', errorData)
          if (errorData) {
            errorMessage += ` - ${errorData}`
          }
        } catch (e) {
          // Error response'u parse edemezse sadece status code'u göster
        }
        throw new Error(errorMessage)
      }
      
      // Response'un boş olup olmadığını kontrol et
      const responseText = await response.text()
      console.log('API Response Text:', responseText)
      
      if (!responseText) {
        return null // Boş response için null döndür
      }
      
      try {
        return JSON.parse(responseText)
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        console.error('Response text:', responseText)
        throw new Error('Geçersiz JSON yanıtı')
      }
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // GET isteği
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    return this.request(url, { method: 'GET' })
  }

  // POST isteği
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // PUT isteği
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  // DELETE isteği
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  // File upload için
  async uploadFile(endpoint, file, onProgress = null) {
    const formData = new FormData()
    formData.append('file', file)
    
    const headers = {}
    const token = this.getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: formData
    })
  }
}

// Singleton instance
const apiService = new ApiService()

export default apiService 