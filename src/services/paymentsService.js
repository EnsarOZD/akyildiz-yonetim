import apiService from './api.js'

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

    return apiService.get('/payments', params)
  }

  // ID'ye göre ödeme getir
  async getPaymentById(id) {
    return apiService.get(`/payments/${id}`)
  }

  // Yeni ödeme oluştur
  async createPayment(paymentData) {
    return apiService.post('/payments', paymentData)
  }

  // Yeni transactional ödeme oluştur (borç eşleştirme ile)
  async createPaymentWithAllocation(paymentData) {
    return apiService.post('/payments/with-allocation', paymentData)
  }

  // Ödeme güncelle
  async updatePayment(id, paymentData) {
    return apiService.put(`/payments/${id}`, paymentData)
  }

  // Ödeme sil
  async deletePayment(id) {
    return apiService.delete(`/payments/${id}`)
  }

  // Avans hesaplarını getir
  async getAdvanceAccounts(filters = {}) {
    const params = {}

    if (filters.tenantId) params.tenantId = filters.tenantId
    if (filters.activeOnly !== undefined) params.activeOnly = filters.activeOnly

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

    return apiService.get('/audit-logs', params)
  }

  // Ödeme istatistikleri
  async getPaymentStats() {
    return apiService.get('/payments/stats')
  }
}

export default new PaymentsService() 