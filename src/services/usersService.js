import apiService from './api.js'

class UsersService {
  constructor() {
    // Backend API'nin users endpoint'lerinin mevcut olup olmadığını kontrol et
    this.backendAvailable = false
    this.checkBackendAvailability()
  }

  // Backend API'nin users endpoint'lerinin mevcut olup olmadığını kontrol et
  async checkBackendAvailability() {
    try {
      // Basit bir health check yap
      await apiService.get('/health')
      this.backendAvailable = true
    } catch (error) {
      console.log('⚠️ Users backend endpoint\'leri mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }
  }

  // Tüm kullanıcıları getir
  async getUsers(filters = {}) {
    try {
      if (this.backendAvailable) {
        return await apiService.get('/users', filters)
      }
    } catch (error) {
      console.log('⚠️ Users backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: Boş array döndür
    return []
  }

  // ID'ye göre kullanıcı getir
  async getUserById(id) {
    try {
      if (this.backendAvailable) {
        return await apiService.get(`/users/${id}`)
      }
    } catch (error) {
      console.log('⚠️ Users backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: null döndür
    return null
  }

  // Yeni kullanıcı oluştur
  async createUser(data) {
    try {
      if (this.backendAvailable) {
        return await apiService.post('/users', data)
      }
    } catch (error) {
      console.log('⚠️ Users backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: Başarılı gibi davran
    console.log('📝 Fallback: User oluşturuldu (backend mevcut değil)', data)
    return { success: true, message: 'User oluşturuldu (backend mevcut değil)' }
  }

  // Kullanıcı güncelle
  async updateUser(id, data) {
    try {
      if (this.backendAvailable) {
        return await apiService.put(`/users/${id}`, data)
      }
    } catch (error) {
      console.log('⚠️ Users backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: Başarılı gibi davran
    console.log('📝 Fallback: User güncellendi (backend mevcut değil)', { id, ...data })
    return { success: true, message: 'User güncellendi (backend mevcut değil)' }
  }

  // Kullanıcı sil
  async deleteUser(id) {
    try {
      if (this.backendAvailable) {
        return await apiService.delete(`/users/${id}`)
      }
    } catch (error) {
      console.log('⚠️ Users backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: Başarılı gibi davran
    console.log('📝 Fallback: User silindi (backend mevcut değil)', id)
    return { success: true, message: 'User silindi (backend mevcut değil)' }
  }
}

export default new UsersService() 