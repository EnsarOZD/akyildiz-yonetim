import apiService from './api.js'
import { invalidateFinanceCaches } from '@/application/stores/cacheInvalidation'
import { unwrapPaged, MAX_PAGE_SIZE } from './pagedResult.js'

class ExpensesService {
  async getExpenses(filters = {}) {
    const params = {}
    
    if (filters.type) params.type = filters.type
    if (filters.ownerId) params.ownerId = filters.ownerId
    if (filters.startDate) params.startDate = filters.startDate
    if (filters.endDate) params.endDate = filters.endDate
    if (filters.searchTerm) params.searchTerm = filters.searchTerm

    const requestParams = {
      ...params,
      // Liste/grafik istemci tarafında filtrelendiği için varsayılan olarak tümü (backend üst sınırı) istenir
      pageSize: Math.min(filters.pageSize || MAX_PAGE_SIZE, MAX_PAGE_SIZE),
      pageNumber: filters.pageNumber || 1
    }

    const response = await apiService.get('/expenses', requestParams)
    return unwrapPaged(response, 'gider', requestParams.pageSize >= MAX_PAGE_SIZE && requestParams.pageNumber === 1)
  }

  // ID'ye göre gider getir
  async getExpenseById(id) {
    return apiService.get(`/expenses/${id}`)
  }

  // Yeni gider oluştur
  async createExpense(expenseData) {
    const result = await apiService.post('/expenses', expenseData)
    this.invalidateCache()
    return result
  }

  // Gider güncelle
  async updateExpense(id, expenseData) {
    const result = await apiService.put(`/expenses/${id}`, expenseData)
    this.invalidateCache()
    return result
  }

  // Gider sil
  async deleteExpense(id) {
    const result = await apiService.delete(`/expenses/${id}`)
    this.invalidateCache()
    return result
  }

  // İstatistikler
  async getExpenseStats(filters = {}) {
    const params = {}
    if (filters.startDate) params.startDate = filters.startDate
    if (filters.endDate) params.endDate = filters.endDate
    return apiService.get('/expenses/stats', params)
  }

  // Store önbelleklerini (tüm filtre anahtarları) temizle — mutasyonlardan sonra çağrılır
  invalidateCache() {
    invalidateFinanceCaches()
  }
}

export default new ExpensesService() 