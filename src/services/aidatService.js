// services/aidatService.js
import apiService from './api.js'

class AidatService {
  constructor() {
    this.backendAvailable = null  // bilinmiyor
    this.lastHealthCheck = 0
    this.healthTTLms = 60_000 // 1 dk
  }

  async ensureAvailable() {
    const now = Date.now()
    if (this.backendAvailable !== null && (now - this.lastHealthCheck) < this.healthTTLms) {
      return this.backendAvailable
    }
    try {
      await apiService.get('/health')
      this.backendAvailable = true
    } catch (e) {
      console.log('⚠️ Aidat backend şu an erişilemedi, fallback devrede.')
      this.backendAvailable = false
    } finally {
      this.lastHealthCheck = now
    }
    return this.backendAvailable
  }

  // -----------------------
  // A) AİDAT TANIMLARI (definitions)
  // -----------------------
  async getAidatDefinitions(filters = {}) {
    const ok = await this.ensureAvailable()
    if (ok) {
      const params = {}
      if (filters.year) params.year = filters.year
      if (filters.tenantId) params.tenantId = filters.tenantId
      if (filters.unit) params.unit = filters.unit
      // Backend now returns PagedResult<T>; fetch max page and unwrap.
      params.pageSize = 100
      const response = await apiService.get('/aidat-definitions', params)
      return Array.isArray(response) ? response : (response?.items ?? [])
    }
    return []
  }

  async getAidatDefinitionById(id) {
    const ok = await this.ensureAvailable()
    if (ok) return apiService.get(`/aidat-definitions/${id}`)
    return null
  }

  async createAidatDefinition(payload) {
    const ok = await this.ensureAvailable()
    if (ok) return apiService.post('/aidat-definitions', payload)
    console.log('📝 Fallback: createAidatDefinition', payload)
    return { success: true, message: 'Aidat tanımı oluşturuldu (fallback)' }
  }

  async updateAidatDefinition(id, payload) {
    const ok = await this.ensureAvailable()
    if (ok) return apiService.put(`/aidat-definitions/${id}`, payload)
    console.log('📝 Fallback: updateAidatDefinition', { id, ...payload })
    return { success: true, message: 'Aidat tanımı güncellendi (fallback)' }
  }

  async deleteAidatDefinition(id) {
    const ok = await this.ensureAvailable()
    if (ok) return apiService.delete(`/aidat-definitions/${id}`)
    console.log('📝 Fallback: deleteAidatDefinition', id)
    return { success: true, message: 'Aidat tanımı silindi (fallback)' }
  }

  async getAidatStats() {
    const ok = await this.ensureAvailable()
    if (ok) return apiService.get('/aidat-definitions/stats')
    return { totalCount: 0, totalAmount: 0, thisMonthCount: 0, thisMonthAmount: 0 }
  }

  // -----------------------
  // B) AİDAT KAYITLARI / BORÇLAR (dues / utilitydebts)
  // -----------------------
  // Listele (sayfan ve filteredDues bunu bekliyor)
  async getDues(filters = {}) {
    const ok = await this.ensureAvailable()
    const params = {}
    if (filters.period) params.period = filters.period       // 'YYYY-MM'
    if (filters.flatId) params.flatId = filters.flatId
    if (filters.status) params.status = filters.status       // 'paid' | 'unpaid'
    if (ok) {
      // Backend now returns PagedResult<T>; fetch max page and unwrap.
      params.pageSize = 100
      const response = await apiService.get('/utilitydebts', params)
      return Array.isArray(response) ? response : (response?.items ?? [])
    }
    return []
  }

  // Dönemden aidat üret (Create Modal bunu yapıyor)
  async createPeriodDues({ period, dueDate, year }) {
    const ok = await this.ensureAvailable()
    const payload = { period, dueDate, year }
    if (ok) return apiService.post('/utilitydebts/create-aidat', payload)
    console.log('📝 Fallback: createPeriodDues', payload)
    // örnek sahte dönüş:
    return { tenantDuesCreated: 0, ownerDuesCreated: 0 }
  }

  // Tek kaydı getir (gerekirse)
  async getDueById(id) {
    const ok = await this.ensureAvailable()
    if (ok) return apiService.get(`/utilitydebts/${id}`)
    return null
  }

  // Düzenle (Edit Modal burada: updateAidat)
  async updateAidat(id, payload) {
    const ok = await this.ensureAvailable()
    if (ok) return apiService.patch(`/utilitydebts/${id}`, payload)
    console.log('📝 Fallback: updateAidat', { id, ...payload })
    return { success: true }
  }

  // Sil (Delete Modal burada)
  async deleteAidat(id) {
    const ok = await this.ensureAvailable()
    if (ok) return apiService.delete(`/utilitydebts/${id}`)
    console.log('📝 Fallback: deleteAidat', id)
    return { success: true }
  }

  // Ödendi işaretle (istersen)
  async markAsPaid(id, paidAmount) {
    const ok = await this.ensureAvailable()
    const payload = { isPaid: true, remainingAmount: 0, paidAmount }
    if (ok) return apiService.patch(`/utilitydebts/${id}`, payload)
    console.log('📝 Fallback: markAsPaid', { id, paidAmount })
    return { success: true }
  }
}

export default new AidatService()
