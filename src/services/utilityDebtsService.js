import apiService from './api.js'

class UtilityDebtsService {
  // Tüm utility debt'leri getir
  async getUtilityDebts(filters = {}) {
    const params = {}

    if (filters.flatId) params.flatId = filters.flatId
    if (filters.type) params.type = filters.type
    if (filters.period && filters.period.includes('-')) {
      const [y, m] = filters.period.split('-').map(Number)
      params.periodYear = y
      params.periodMonth = m
    }
    if (filters.periodYear) params.periodYear = filters.periodYear
    if (filters.periodMonth) params.periodMonth = filters.periodMonth
    if (filters.status) params.status = filters.status
    if (filters.tenantId) params.tenantId = filters.tenantId
    if (filters.ownerId) params.ownerId = filters.ownerId
    if (filters.startDate) params.startDate = filters.startDate
    if (filters.endDate) params.endDate = filters.endDate

    return apiService.get('/UtilityDebts', params)
  }

  // ID'ye göre utility debt getir
  async getUtilityDebtById(id) {
    return apiService.get(`/utilitydebts/${id}`)
  }

  // Yeni utility debt oluştur
  async createUtilityDebt(utilityDebtData) {
    return apiService.post('/utilitydebts', utilityDebtData)
  }

  // Utility debt güncelle
  async updateUtilityDebt(id, utilityDebtData) {
    return apiService.put(`/utilitydebts/${id}`, utilityDebtData)
  }

  // Toplu utility debt oluştur (sıralı veya toplu request)
  async createBulkUtilityDebts(debts) {
    // Backend'de toplu endpoint yoksa tek tek atar, varsa doğrudan post eder
    try {
      return await apiService.post('/utilitydebts/bulk', { debts })
    } catch (e) {
      // Fallback: Tek tek gönder (backend desteği yoksa)
      const results = []
      for (const debt of debts) {
        results.push(await this.createUtilityDebt(debt))
      }
      return results
    }
  }

  // Utility debt sil
  async deleteUtilityDebt(id) {
    return apiService.delete(`/utilitydebts/${id}`)
  }

  // Döneme göre utility debt'leri sil
  async deleteUtilityDebtsByPeriod(period) {
    return apiService.delete(`/utilitydebts/period/${period}`)
  }

  // Ortak gider paylaştır
  async distributeSharedExpense(period, utilityType) {
    return apiService.post('/utilitydebts/distribute', {
      period: period,
      utilityType: utilityType
    })
  }
}

export default new UtilityDebtsService() 