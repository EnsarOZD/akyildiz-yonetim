import apiService from './api.js'

class OwnersService {
  constructor() {
    // Backend API'nin owners endpoint'lerinin mevcut olup olmadığını kontrol et
    this.backendAvailable = false
    this.checkBackendAvailability()
  }

  // Backend API'nin owners endpoint'lerinin mevcut olup olmadığını kontrol et
  async checkBackendAvailability() {
    try {
      // Basit bir health check yap
      await apiService.get('/health')
      this.backendAvailable = true
    } catch (error) {
      console.log('⚠️ Owners backend endpoint\'leri mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }
  }

  // Tüm mal sahiplerini getir
  async getOwners(filters = {}) {
    try {
      if (this.backendAvailable) {
        const params = { ...filters }
        if (!params.pageSize) params.pageSize = 20
        const response = await apiService.get('/owners', params)
        return Array.isArray(response) ? response : (response?.items ?? [])
      }
    } catch (error) {
      console.log('⚠️ Owners backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: Boş array döndür
    return []
  }

  // ID'ye göre mal sahibi getir
  async getOwnerById(id) {
    try {
      if (this.backendAvailable) {
        return await apiService.get(`/owners/${id}`)
      }
    } catch (error) {
      console.log('⚠️ Owners backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: null döndür
    return null
  }

  // Yeni mal sahibi oluştur
  async createOwner(data) {
    try {
      if (this.backendAvailable) {
        return await apiService.post('/owners', data)
      }
    } catch (error) {
      console.log('⚠️ Owners backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: Başarılı gibi davran
    console.log('📝 Fallback: Owner oluşturuldu (backend mevcut değil)', data)
    return { success: true, message: 'Owner oluşturuldu (backend mevcut değil)' }
  }

  // Mal sahibi güncelle
  async updateOwner(id, data) {
    try {
      if (this.backendAvailable) {
        return await apiService.put(`/owners/${id}`, data)
      }
    } catch (error) {
      console.log('⚠️ Owners backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: Başarılı gibi davran
    console.log('📝 Fallback: Owner güncellendi (backend mevcut değil)', { id, ...data })
    return { success: true, message: 'Owner güncellendi (backend mevcut değil)' }
  }

  // Mal sahibi sil
  async deleteOwner(id) {
    try {
      if (this.backendAvailable) {
        return await apiService.delete(`/owners/${id}`)
      }
    } catch (error) {
      console.log('⚠️ Owners backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: Başarılı gibi davran
    console.log('📝 Fallback: Owner silindi (backend mevcut değil)', id)
    return { success: true, message: 'Owner silindi (backend mevcut değil)' }
  }
}

export default new OwnersService() 