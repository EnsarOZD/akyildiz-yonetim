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

    // Backend now returns PagedResult<T>; fetch max page and unwrap so callers receive a plain array.
    params.pageSize = 100
    const response = await apiService.get('/UtilityDebts', params)
    return Array.isArray(response) ? response : (response?.items ?? [])
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

  // Toplu utility debt sil
  async bulkDeleteDebts(ids) {
    return apiService.delete('/utilitydebts/bulk', {
      body: JSON.stringify(ids)
    })
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

  // Excel'den borç içe aktar
  async importUtilityDebtsFromExcel(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    return apiService.post('/UtilityDebts/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default new UtilityDebtsService() 