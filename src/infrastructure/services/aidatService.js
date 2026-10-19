// services/aidatService.js
import apiService from './api.js'
import { MAX_PAGE_SIZE } from './pagedResult.js'
import { invalidateFinanceCaches } from '@/application/stores/cacheInvalidation'

// Not: Health-check/fallback mantığı kaldırıldı; hatalar diğer servislerde olduğu gibi çağırana iletilir
// (önceden hata/erişilemezlik durumunda sahte başarı dönülüyordu).
class AidatService {
  // -----------------------
  // A) AİDAT TANIMLARI (definitions)
  // -----------------------
  async getAidatDefinitions(filters = {}) {
    const params = {}
    if (filters.year) params.year = filters.year
    if (filters.tenantId) params.tenantId = filters.tenantId
    if (filters.unit) params.unit = filters.unit
    // Backend PagedResult<T> döner; tümünü (backend üst sınırı) iste ve aç.
    params.pageSize = MAX_PAGE_SIZE
    const response = await apiService.get('/aidat-definitions', params)
    return Array.isArray(response) ? response : (response?.items ?? [])
  }

  async getAidatDefinitionById(id) {
    return apiService.get(`/aidat-definitions/${id}`)
  }

  async createAidatDefinition(payload) {
    return apiService.post('/aidat-definitions', payload)
  }

  async updateAidatDefinition(id, payload) {
    return apiService.put(`/aidat-definitions/${id}`, payload)
  }

  async deleteAidatDefinition(id) {
    return apiService.delete(`/aidat-definitions/${id}`)
  }

  async getAidatStats() {
    return apiService.get('/aidat-definitions/stats')
  }

  // -----------------------
  // B) AİDAT KAYITLARI / BORÇLAR (dues / utilitydebts)
  // -----------------------
  // Listele (sayfan ve filteredDues bunu bekliyor)
  async getDues(filters = {}) {
    const params = {}
    if (filters.period) params.period = filters.period       // 'YYYY-MM'
    if (filters.flatId) params.flatId = filters.flatId
    if (filters.status) params.status = filters.status       // 'paid' | 'unpaid'
    // Backend PagedResult<T> döner; tümünü (backend üst sınırı) iste ve aç.
    params.pageSize = MAX_PAGE_SIZE
    const response = await apiService.get('/utilitydebts', params)
    return Array.isArray(response) ? response : (response?.items ?? [])
  }

  // Dönemden aidat üret (Create Modal bunu yapıyor)
  async createPeriodDues({ period, dueDate, year }) {
    const result = await apiService.post('/utilitydebts/create-aidat', { period, dueDate, year })
    invalidateFinanceCaches()
    return result
  }

  // Tek kaydı getir (gerekirse)
  async getDueById(id) {
    return apiService.get(`/utilitydebts/${id}`)
  }

  // Düzenle (Edit Modal burada: updateAidat)
  async updateAidat(id, payload) {
    const result = await apiService.patch(`/utilitydebts/${id}`, payload)
    invalidateFinanceCaches()
    return result
  }

  // Sil (Delete Modal burada)
  async deleteAidat(id) {
    const result = await apiService.delete(`/utilitydebts/${id}`)
    invalidateFinanceCaches()
    return result
  }

  // Ödendi işaretle (istersen)
  async markAsPaid(id, paidAmount) {
    const result = await apiService.patch(`/utilitydebts/${id}`, { isPaid: true, remainingAmount: 0, paidAmount })
    invalidateFinanceCaches()
    return result
  }
}

export default new AidatService()
