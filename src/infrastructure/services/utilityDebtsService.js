import apiService from './api.js'

class UtilityDebtsService {
  // Tüm utility debt'leri getir
  async getUtilityDebts(filters = {}) {
    const params = {}

    if (filters.flatId) params.flatId = filters.flatId
    if (filters.type !== undefined && filters.type !== null && filters.type !== '') params.type = filters.type
    if (filters.period && filters.period.includes('-')) {
      const [y, m] = filters.period.split('-').map(Number)
      params.periodYear = y
      params.periodMonth = m
    }
    if (filters.periodYear) params.periodYear = filters.periodYear
    if (filters.periodMonth) params.periodMonth = filters.periodMonth
    if (filters.status) params.status = filters.status
    if (filters.excludePaid) params.excludePaid = filters.excludePaid
    if (filters.tenantId) params.tenantId = filters.tenantId
    if (filters.ownerId) params.ownerId = filters.ownerId
    if (filters.startDate) params.startDate = filters.startDate
    if (filters.endDate) params.endDate = filters.endDate
    if (filters.debtorType !== undefined && filters.debtorType !== null && filters.debtorType !== '') params.debtorType = filters.debtorType

    const requestParams = {
      ...params,
      pageSize: Math.min(filters.pageSize || 50, 100),
      pageNumber: filters.pageNumber || 1
    }

    const response = await apiService.get('/UtilityDebts', requestParams)
    return Array.isArray(response) ? response : (response?.items ?? [])
  }

  // ID'ye göre utility debt getir
  async getUtilityDebtById(id) {
    return apiService.get(`/utilitydebts/${id}`)
  }

  // Yeni utility debt oluştur
  async createUtilityDebt(utilityDebtData) {
    const result = await apiService.post('/utilitydebts', utilityDebtData)
    this.invalidateCache()
    return result
  }

  // Utility debt güncelle (tam güncelleme - tüm alanlar gönderilmeli)
  async updateUtilityDebt(id, utilityDebtData) {
    const result = await apiService.put(`/utilitydebts/${id}`, utilityDebtData)
    this.invalidateCache()
    return result
  }

  // Utility debt kısmi güncelle (sadece gönderilen alanlar değişir)
  async patchUtilityDebt(id, fields) {
    const result = await apiService.patch(`/utilitydebts/${id}`, fields)
    this.invalidateCache()
    return result
  }

  // Toplu utility debt oluştur (sıralı veya toplu request)
  async createBulkUtilityDebts(debts) {
    try {
      const result = await apiService.post('/utilitydebts/bulk', { debts })
      this.invalidateCache()
      return result
    } catch (e) {
      const results = []
      for (const debt of debts) {
        results.push(await apiService.post('/utilitydebts', debt))
      }
      this.invalidateCache()
      return results
    }
  }

  // Utility debt sil
  async deleteUtilityDebt(id) {
    const result = await apiService.delete(`/utilitydebts/${id}`)
    this.invalidateCache()
    return result
  }

  // Toplu utility debt sil
  async bulkDeleteDebts(ids) {
    const result = await apiService.post('/utilitydebts/bulk-delete', { ids: ids })
    this.invalidateCache()
    return result
  }

  // Döneme göre utility debt'leri sil
  async deleteUtilityDebtsByPeriod(period) {
    const result = await apiService.delete(`/utilitydebts/period/${period}`)
    this.invalidateCache()
    return result
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
    
    return apiService.request('/UtilityDebts/import', {
      method: 'POST',
      body: formData
    })
  }

  invalidateCache() {}
}

export default new UtilityDebtsService() 