import apiService from './api.js'

const _cache = new Map()
const CACHE_TTL = 3 * 60 * 1000 // 3 dakika

class PaymentsService {
  // Tüm ödemeleri getir
  async getPayments(filters = {}) {
    const params = {}

    if (filters.type) params.type = filters.type
    if (filters.status) params.status = filters.status
    if (filters.ownerId) params.ownerId = filters.ownerId
    if (filters.tenantId) params.tenantId = filters.tenantId
    if (filters.startDate) params.startDate = filters.startDate
    if (filters.endDate) params.endDate = filters.endDate
    if (filters.utilityType) params.utilityType = filters.utilityType
    if (filters.debtorType !== undefined && filters.debtorType !== null && filters.debtorType !== '') params.debtorType = filters.debtorType
    if (filters.excludeAdvanceUse !== undefined) params.excludeAdvanceUse = filters.excludeAdvanceUse

    const cacheKey = 'payments:' + JSON.stringify(params)
    const cached = _cache.get(cacheKey)
    if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data

    params.pageSize = 1000
    let pageNumber = 1
    const allItems = []

    while (true) {
      const requestParams = { ...params, pageNumber }
      const response = await apiService.get('/payments', requestParams)
      const items = Array.isArray(response) ? response : (response?.items ?? [])
      const actualPageSize = response?.pageSize ?? params.pageSize

      if (items.length === 0) break
      allItems.push(...items)

      if (items.length < actualPageSize) break // Son sayfa
      pageNumber++
    }

    _cache.set(cacheKey, { data: allItems, ts: Date.now() })
    return allItems
  }

  invalidateCache() {
    _cache.clear()
  }

  // ID'ye göre ödeme getir
  async getPaymentById(id) {
    return apiService.get(`/payments/${id}`)
  }

  // Yeni ödeme oluştur
  async createPayment(paymentData) {
    const result = await apiService.post('/payments', paymentData)
    this.invalidateCache()
    return result
  }

  // Yeni transactional ödeme oluştur (borç eşleştirme ile)
  async createPaymentWithAllocation(paymentData) {
    const result = await apiService.post('/payments/with-allocation', paymentData)
    this.invalidateCache()
    return result
  }

  // Ödeme güncelle
  async updatePayment(id, paymentData) {
    const result = await apiService.put(`/payments/${id}`, paymentData)
    this.invalidateCache()
    return result
  }

  // Ödeme sil
  async deletePayment(id) {
    const result = await apiService.delete(`/payments/${id}`)
    this.invalidateCache()
    return result
  }

  // Toplu ödeme sil
  async bulkDeletePayments(ids) {
    const result = await apiService.post('/payments/bulk-delete', { ids: ids })
    this.invalidateCache()
    return result
  }

  // Avans hesaplarını getir
  async getAdvanceAccounts(filters = {}) {
    const params = {}

    if (filters.tenantId) params.tenantId = filters.tenantId
    if (filters.activeOnly !== undefined) params.activeOnly = filters.activeOnly

    // Backend now returns PagedResult<T>; callers (store + AdvanceAccountManager) already
    // handle both array and {items} shapes — just ensure we fetch the full page.
    params.pageSize = 100
    return apiService.get('/advanceaccounts', params)
  }

  // Avans hesabı oluştur
  async createAdvanceAccount(advanceData) {
    return apiService.post('/advanceaccounts', advanceData)
  }

  // Avans hesabı güncelle
  async updateAdvanceAccount(id, advanceData) {
    return apiService.put(`/advanceaccounts/${id}`, advanceData)
  }

  // Avans hesabı sil
  async deleteAdvanceAccount(id) {
    return apiService.delete(`/advanceaccounts/${id}`)
  }

  // Avans hesabından borç öde
  async useAdvanceAccount(data) {
    return apiService.post('/advanceaccounts/use', data)
  }

  // Finansal raporları getir
  async getFinancialReports(filters = {}) {
    const params = {}
    if (filters.startDate) params.startDate = filters.startDate
    if (filters.endDate) params.endDate = filters.endDate
    if (filters.tenantId) params.tenantId = filters.tenantId
    if (filters.ownerId) params.ownerId = filters.ownerId

    // ÖNEMLİ: R büyük
    const raw = await apiService.get('/Reports/financial', params)

    // Backend -> UI mapping
    const paymentsTotal = raw?.payments?.totalAmount ?? 0
    const debtsTotal = raw?.debts?.totalAmount ?? 0

    return {
      // Özetler
      totalPayments: paymentsTotal,
      paymentCount: raw?.payments?.count ?? 0,

      totalDebts: debtsTotal,
      debtCount: raw?.debts?.count ?? 0,

      advanceBalance: raw?.advanceAccounts?.totalBalance ?? 0,
      advanceAccountCount: raw?.advanceAccounts?.count ?? 0,

      netBalance: paymentsTotal - debtsTotal,

      // Tablo için (backend details yoksa boş dizi gönder)
      details: raw?.details ?? []
    }
  }

  // Audit logları getir
  async getAuditLogs(filters = {}) {
    const params = {}

    if (filters.startDate) params.startDate = filters.startDate
    if (filters.endDate) params.endDate = filters.endDate
    if (filters.entityType) params.entityType = filters.entityType
    if (filters.userId) params.userId = filters.userId
    if (filters.action) params.action = filters.action

    return apiService.get('/AuditLogs', params)
  }

  // Ödeme istatistikleri — /payments/stats backend'de yok, /expenses/stats kullanılır
  async getPaymentStats() {
    return apiService.get('/expenses/stats')
  }
}

export default new PaymentsService() 