import apiService from './api.js'
import { MAX_PAGE_SIZE } from './pagedResult.js'

// Not: Hatalar artık yutulmuyor; diğer servislerde olduğu gibi çağırana iletilir.
class OwnersService {
  // Tüm mal sahiplerini getir
  // Dropdown'lar ve istemci tarafı filtreleme tüm listeyi beklediği için varsayılan pageSize backend üst sınırıdır
  async getOwners(filters = {}) {
    const params = { ...filters }
    if (!params.pageSize) params.pageSize = MAX_PAGE_SIZE
    const response = await apiService.get('/owners', params)
    return Array.isArray(response) ? response : (response?.items ?? [])
  }

  // ID'ye göre mal sahibi getir
  async getOwnerById(id) {
    return await apiService.get(`/owners/${id}`)
  }

  // Yeni mal sahibi oluştur
  async createOwner(data) {
    return await apiService.post('/owners', data)
  }

  // Mal sahibi güncelle
  async updateOwner(id, data) {
    return await apiService.put(`/owners/${id}`, data)
  }

  // Mal sahibi sil
  async deleteOwner(id) {
    return await apiService.delete(`/owners/${id}`)
  }
}

export default new OwnersService()
