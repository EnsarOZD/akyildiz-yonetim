import apiService from '@/services/api'

const base = '/tenants'

const tenantsService = {
  // Tüm kiracıları getir
  // BE (controller) şu query’leri destekliyor: isActive, searchTerm, period, showOnlyOccupied, floor
  // Not: 'floor' controller içinde FloorNumber’a map ediliyor.
  async getTenants(filters = {}) {
    const params = new URLSearchParams()


    if (filters.isActive !== undefined && filters.isActive !== '') {
      params.append('isActive', String(filters.isActive))
    }
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm)

    // period bir Date ise ISO gönder
    if (filters.period instanceof Date) {
      params.append('period', filters.period.toISOString())
    } else if (filters.period) {
      params.append('period', String(filters.period))
    }

    if (filters.showOnlyOccupied !== undefined) {
      params.append('showOnlyOccupied', String(filters.showOnlyOccupied))
    }

    // Controller param adı 'floor' (FloorNumber’a aktarılıyor)
    if (filters.floor !== undefined && filters.floor !== '') {
      params.append('floor', String(filters.floor))
    }
    // Eski çağrılar 'floorNumber' gönderiyorsa uyumlu ol:
    if (!params.has('floor') && filters.floorNumber !== undefined && filters.floorNumber !== '') {
      params.append('floor', String(filters.floorNumber))
    }

    const qs = params.toString()
    const url = qs ? `${base}?${qs}` : base
    return await apiService.get(url)
  },

  // Boş üniteleri getir (TenantsController: GET /tenants/available-flats?floor=&searchTerm=)
  async getAvailableFlats(filters = {}) {
    const params = new URLSearchParams()
    if (filters.floor !== undefined && filters.floor !== '') params.append('floor', String(filters.floor))
    if (filters.floorNumber !== undefined && filters.floorNumber !== '' && !params.has('floor')) {
      params.append('floor', String(filters.floorNumber))
    }
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm)

    const qs = params.toString()
    const url = qs ? `${base}/available-flats?${qs}` : `${base}/available-flats`
    return await apiService.get(url)
  },

  // Kiracı detay
  async getTenantById(id) {
    return await apiService.get(`${base}/${id}`)
  },

  // Yeni kiracı (CreateTenantCommand)
  // { companyName, businessType, companyType, identityNumber, contactPersonName, contactPersonPhone, contactPersonEmail,
  //   floorNumber?, flatId?, monthlyAidat, contractStartDate?, contractEndDate?, isActive? }
  async createTenant(payload) {
    return await apiService.post(base, payload)
  },

  // Kiracı güncelle (UpdateTenantCommand)
  async updateTenant(id, payload) {
    return await apiService.put(`${base}/${id}`, { id, ...payload })
  },

  // Kiracı sil (soft-delete + bağlı üniteyi boşaltma BE’de yapılmalı)
  async deleteTenant(id) {
    return await apiService.delete(`${base}/${id}`)
  },

  // İstatistik (varsa)
  async getTenantStats() {
    return await apiService.get(`${base}/stats`)
  },

  // Mevcut kiracıya birden fazla ünite bağlama (BE: POST /tenants/{id}/assign-flats)
  async assignFlats(tenantId, { flatIds, contractStartDate = null }) {
    return await apiService.post(`${base}/${tenantId}/assign-flats`, { flatIds, contractStartDate })
  },

  // Avans bakiyelerini geçmişe dönük denetle ve düzelt (BE: POST /AdvanceAccounts/recalculate)
  async syncAdvanceBalances() {
    return await apiService.post('/AdvanceAccounts/recalculate')
  }
}

export default tenantsService
