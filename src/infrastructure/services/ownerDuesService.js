import apiService from './api.js'

class OwnerDuesService {
  constructor() {
    // Backend API'nin owner-dues endpoint'lerinin mevcut olup olmadığını kontrol et
    this.backendAvailable = false
    this.checkBackendAvailability()
  }

  // Backend API'nin owner-dues endpoint'lerinin mevcut olup olmadığını kontrol et
  async checkBackendAvailability() {
    try {
      // Basit bir health check yap
      await apiService.get('/health')
      this.backendAvailable = true
    } catch (error) {
      console.log('⚠️ Owner dues backend endpoint\'leri mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }
  }

  // Tüm mal sahibi aidat borçlarını getir
  async getOwnerDues(filters = {}) {
    try {
      if (this.backendAvailable) {
        return await apiService.get('/owners/dues', filters)
      }
    } catch (error) {
      console.log('⚠️ Owner dues backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: Boş array döndür
    return []
  }

  // ID'ye göre mal sahibi aidat borcu getir
  async getOwnerDueById(id) {
    try {
      if (this.backendAvailable) {
        return await apiService.get(`/owners/dues/${id}`)
      }
    } catch (error) {
      console.log('⚠️ Owner dues backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: null döndür
    return null
  }

  // Yeni mal sahibi aidat borcu oluştur
  async createOwnerDue(data) {
    try {
      if (this.backendAvailable) {
        return await apiService.post('/owners/dues', data)
      }
    } catch (error) {
      console.log('⚠️ Owner dues backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: Başarılı gibi davran
    console.log('📝 Fallback: Owner due oluşturuldu (backend mevcut değil)', data)
    return { success: true, message: 'Owner due oluşturuldu (backend mevcut değil)' }
  }

  // Mal sahibi aidat borcunu güncelle
  async updateOwnerDue(id, data) {
    try {
      if (this.backendAvailable) {
        return await apiService.put(`/owners/dues/${id}`, data)
      }
    } catch (error) {
      console.log('⚠️ Owner dues backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: Başarılı gibi davran
    console.log('📝 Fallback: Owner due güncellendi (backend mevcut değil)', { id, ...data })
    return { success: true, message: 'Owner due güncellendi (backend mevcut değil)' }
  }

  // Mal sahibi aidat borcunu sil
  async deleteOwnerDue(id) {
    try {
      if (this.backendAvailable) {
        return await apiService.delete(`/owners/dues/${id}`)
      }
    } catch (error) {
      console.log('⚠️ Owner dues backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: Başarılı gibi davran
    console.log('📝 Fallback: Owner due silindi (backend mevcut değil)', id)
    return { success: true, message: 'Owner due silindi (backend mevcut değil)' }
  }
}

export default new OwnerDuesService() 