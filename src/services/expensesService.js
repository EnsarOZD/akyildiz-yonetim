import apiService from './api.js'

class ExpensesService {
  // Tüm giderleri getir
  async getExpenses(filters = {}) {
    const params = {}
    
    if (filters.type) params.type = filters.type
    if (filters.ownerId) params.ownerId = filters.ownerId
    if (filters.startDate) params.startDate = filters.startDate
    if (filters.endDate) params.endDate = filters.endDate
    if (filters.searchTerm) params.searchTerm = filters.searchTerm
    
    return apiService.get('/expenses', params)
  }

  // ID'ye göre gider getir
  async getExpenseById(id) {
    return apiService.get(`/expenses/${id}`)
  }

  // Yeni gider oluştur
  async createExpense(expenseData) {
    return apiService.post('/expenses', expenseData)
  }

  // Gider güncelle
  async updateExpense(id, expenseData) {
    return apiService.put(`/expenses/${id}`, expenseData)
  }

  // Gider sil
  async deleteExpense(id) {
    return apiService.delete(`/expenses/${id}`)
  }

  // İstatistikler
  async getExpenseStats() {
    return apiService.get('/expenses/stats')
  }
}

export default new ExpensesService() 