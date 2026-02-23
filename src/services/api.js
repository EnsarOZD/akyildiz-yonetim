const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (import.meta.env.DEV) return 'http://localhost:5000/api';

  // Eğer envUrl varsa onu kullan, yoksa fallback kullan
  let base = envUrl || 'https://api.akyildizyonetim.com/api';

  // URL'in sonunda /api olduğundan emin ol (Eğer kullanıcı unutursa otomatik ekle)
  if (base && !base.endsWith('/api') && !base.endsWith('/api/')) {
    base = base.endsWith('/') ? `${base}api` : `${base}/api`;
  }

  return base;
};

const API_BASE_URL = getBaseUrl();
console.log('🚀 Final API Base URL:', API_BASE_URL);

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
        let errorData = null;
        let errorMessage = `Bir hata oluştu. (HTTP ${response.status})`;

        try {
          const text = await response.text();
          if (text) {
            try {
              errorData = JSON.parse(text);
              errorMessage = errorData.errorMessage || errorData.message || errorMessage;
            } catch {
              errorData = text;
            }
          }
        } catch (e) {
          console.error('Error parsing response:', e);
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        error.response = { status: response.status, data: errorData };
        error.apiError = {
          status: response.status,
          data: errorData,
          message: errorMessage
        };

        // Oturum süresi doldu kontrolü
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }

        throw error;
      }

      const responseText = await response.text();
      if (!responseText) return null;

      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Geçersiz JSON yanıtı');
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
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

  // PATCH isteği
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
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