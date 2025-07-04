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

  // Ödeme istatistikleri
  async getPaymentStats() {
    return apiService.get('/payments/stats')
  }
}

export default new PaymentsService() 