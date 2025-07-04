import apiService from './api.js'

class UtilityDebtsService {
  // Tüm utility debt'leri getir
  async getUtilityDebts(filters = {}) {
    const params = {}
    
    if (filters.flatId) params.flatId = filters.flatId
    if (filters.type) params.type = filters.type
    if (filters.periodYear) params.periodYear = filters.periodYear
    if (filters.periodMonth) params.periodMonth = filters.periodMonth
    if (filters.status) params.status = filters.status
    if (filters.tenantId) params.tenantId = filters.tenantId
    if (filters.ownerId) params.ownerId = filters.ownerId
    
    return apiService.get('/utilitydebts', params)
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