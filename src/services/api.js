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
      console.log(`🌐 API Request [${config.method}]:`, endpoint)
      const response = await fetch(url, config)
      
      if (!response.ok) {
        console.warn(`📡 API Response Error: ${response.status} ${response.statusText}`, { url: endpoint });
        
        let errorData = null;
        let errorMessage = `Sunucu hatası. (HTTP ${response.status})`;

        try {
          const text = await response.text();
          if (text) {
            try {
              errorData = JSON.parse(text);
              errorMessage = errorData.errorMessage || errorData.message || errorData.errors?.[0] || errorMessage;
            } catch {
              errorData = text;
            }
          }
        } catch (e) {
          console.error('API response parse error:', e);
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        error.response = { status: response.status, data: errorData };
        error.apiError = {
          status: response.status,
          data: errorData,
          message: errorMessage
        };

        // Oturum süresi doldu kontrolü (Login isteği değilse ve login sayfasında değilsek)
        const isLoginRequest = endpoint.toLowerCase().includes('/auth/login');
        const isLoginPage = window.location.pathname === '/login' || window.location.hash.includes('/login');

        if (response.status === 401 && !isLoginRequest && !isLoginPage) {
          console.error('🔒 401 Unauthorized detected! Clearing token and redirecting to login.', {
            endpoint,
            currentPath: window.location.pathname
          });
          
          localStorage.removeItem('authToken');
          
          // Sadece eğer login sayfasında değilsek yönlendir (XSS/Loop koruması)
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login?reason=session_expired';
          }
        }

        throw error;
      }

      const responseText = await response.text();
      if (!responseText) return null;

      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('Invalid JSON response:', responseText.substring(0, 100));
        throw new Error('Geçersiz sunucu yanıtı (JSON formatlanamadı)');
      }
    } catch (error) {
      if (error.status !== 401) {
        console.error('🚩 API Request Exception:', error.message, { endpoint });
      }
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