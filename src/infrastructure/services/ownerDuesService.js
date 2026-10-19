import apiService from './api.js'

// Not: Hatalar artık yutulmuyor; diğer servislerde olduğu gibi çağırana iletilir.
class OwnerDuesService {
  // Tüm mal sahibi aidat borçlarını getir
  async getOwnerDues(filters = {}) {
    return await apiService.get('/owners/dues', filters)
  }

  // ID'ye göre mal sahibi aidat borcu getir
  async getOwnerDueById(id) {
    return await apiService.get(`/owners/dues/${id}`)
  }

  // Yeni mal sahibi aidat borcu oluştur
  async createOwnerDue(data) {
    return await apiService.post('/owners/dues', data)
  }

  // Mal sahibi aidat borcunu güncelle
  async updateOwnerDue(id, data) {
    return await apiService.put(`/owners/dues/${id}`, data)
  }

  // Mal sahibi aidat borcunu sil
  async deleteOwnerDue(id) {
    return await apiService.delete(`/owners/dues/${id}`)
  }
}

export default new OwnerDuesService()
