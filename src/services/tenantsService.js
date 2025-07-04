import apiService from './api.js'

class TenantsService {
  // Tüm kiracıları getir
  async getTenants(filters = {}) {
    const params = {}
    
    if (filters.searchTerm) params.searchTerm = filters.searchTerm
    if (filters.isActive !== undefined) params.isActive = filters.isActive
    
    return apiService.get('/tenants', params)
  }

  // ID'ye göre kiracı getir
  async getTenantById(id) {
    return apiService.get(`/tenants/${id}`)
  }

  // Yeni kiracı oluştur
  async createTenant(tenantData) {
    return apiService.post('/tenants', tenantData)
  }

  // Kiracı güncelle
  async updateTenant(id, tenantData) {
    // ID'yi request body'ye ekle
    const requestBody = {
      id: id,
      ...tenantData
    }
    return apiService.put(`/tenants/${id}`, requestBody)
  }

  // Kiracı sil
  async deleteTenant(id) {
    return apiService.delete(`/tenants/${id}`)
  }

  // Kiracı istatistikleri
  async getTenantStats() {
    return apiService.get('/tenants/stats')
  }
}

export default new TenantsService() 