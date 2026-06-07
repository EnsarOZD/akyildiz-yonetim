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

    // Devreden bakiye: beforeDate'ten önceki tüm tahakkuk/tahsilat hareketlerinin neti
    async getOpeningBalance({ beforeDate, tenantId, ownerId, utilityType, debtorType } = {}) {
        const params = { beforeDate }
        if (tenantId) params.tenantId = tenantId
        if (ownerId) params.ownerId = ownerId
        if (utilityType) params.utilityType = utilityType
        if (debtorType && debtorType !== 'All') params.debtorType = debtorType
        return api.get('/reports/opening-balance', params)
    }

    // Birim bazlı gelir/gider karşılaştırması (Elektrik, Su, Aidat) - bina geneli
    async getCategoryComparison({ startDate, endDate, debtorType } = {}) {
        const params = {}
        if (startDate) params.startDate = startDate
        if (endDate) params.endDate = endDate
        if (debtorType && debtorType !== 'All') params.debtorType = debtorType
        return api.get('/reports/category-comparison', params)
    }
}

export default new DashboardService()
