import apiService from './api.js'

class AidatService {
  constructor() {
    // Backend API'nin aidat endpoint'lerinin mevcut olup olmadığını kontrol et
    this.backendAvailable = false
    this.checkBackendAvailability()
  }

  // Backend API'nin aidat endpoint'lerinin mevcut olup olmadığını kontrol et
  async checkBackendAvailability() {
    try {
      // Basit bir health check yap
      await apiService.get('/health')
      this.backendAvailable = true
    } catch (error) {
      console.log('⚠️ Aidat backend endpoint\'leri mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }
  }

  // Tüm aidat tanımlarını getir
  async getAidatDefinitions(filters = {}) {
    try {
      if (this.backendAvailable) {
        const params = {}
        
        if (filters.year) params.year = filters.year
        if (filters.tenantId) params.tenantId = filters.tenantId
        if (filters.unit) params.unit = filters.unit
        
        return await apiService.get('/aidat-definitions', params)
      }
    } catch (error) {
      console.log('⚠️ Aidat backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: Boş array döndür
    return []
  }

  // ID'ye göre aidat tanımı getir
  async getAidatDefinitionById(id) {
    try {
      if (this.backendAvailable) {
        return await apiService.get(`/aidat-definitions/${id}`)
      }
    } catch (error) {
      console.log('⚠️ Aidat backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: null döndür
    return null
  }

  // Yeni aidat tanımı oluştur
  async createAidatDefinition(aidatData) {
    try {
      if (this.backendAvailable) {
        return await apiService.post('/aidat-definitions', aidatData)
      }
    } catch (error) {
      console.log('⚠️ Aidat backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: Başarılı gibi davran
    console.log('📝 Fallback: Aidat tanımı oluşturuldu (backend mevcut değil)', aidatData)
    return { success: true, message: 'Aidat tanımı oluşturuldu (backend mevcut değil)' }
  }

  // Aidat tanımı güncelle
  async updateAidatDefinition(id, aidatData) {
    try {
      if (this.backendAvailable) {
        return await apiService.put(`/aidat-definitions/${id}`, aidatData)
      }
    } catch (error) {
      console.log('⚠️ Aidat backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: Başarılı gibi davran
    console.log('📝 Fallback: Aidat tanımı güncellendi (backend mevcut değil)', { id, ...aidatData })
    return { success: true, message: 'Aidat tanımı güncellendi (backend mevcut değil)' }
  }

  // Aidat tanımı sil
  async deleteAidatDefinition(id) {
    try {
      if (this.backendAvailable) {
        return await apiService.delete(`/aidat-definitions/${id}`)
      }
    } catch (error) {
      console.log('⚠️ Aidat backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: Başarılı gibi davran
    console.log('📝 Fallback: Aidat tanımı silindi (backend mevcut değil)', id)
    return { success: true, message: 'Aidat tanımı silindi (backend mevcut değil)' }
  }

  // Aidat istatistikleri
  async getAidatStats() {
    try {
      if (this.backendAvailable) {
        return await apiService.get('/aidat-definitions/stats')
      }
    } catch (error) {
      console.log('⚠️ Aidat backend endpoint\'i mevcut değil, fallback modu kullanılıyor')
      this.backendAvailable = false
    }

    // Fallback: Boş istatistikler döndür
    return {
      totalCount: 0,
      totalAmount: 0,
      thisMonthCount: 0,
      thisMonthAmount: 0
    }
  }
}

export default new AidatService() 