import api from './api'

class DashboardService {
    async getDebtsSummary(year) {
        const params = {}
        if (year) params.year = year
        return api.get('/dashboard/debts-summary', params)
    }

    async getDashboardSummary(dateFilter) {
        const params = {}
        if (dateFilter && dateFilter !== 'all') params.dateFilter = dateFilter
        return api.get('/dashboard/summary', params)
    }

    async getOwnerDashboard() {
        return api.get('/dashboard/owner')
    }

    async getFinancialSummary(startDate, endDate) {
        return api.get('/reports/finance/summary', { startDate, endDate })
    }

    async getTenantFinancialReport(startDate, endDate, tenantId, ownerId) {
        return api.get('/reports/tenant/financial', { startDate, endDate, tenantId, ownerId })
    }
}

export default new DashboardService()
