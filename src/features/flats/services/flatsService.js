// src/services/flatsService.js
import apiService from '@/services/api'

// ASP.NET Core route'lar case-insensitive ama projede hep küçük harf kullanıyorsun:
const base = '/flats'
const tenantsBase = '/tenants'

const flatsService = {
  // Tüm üniteleri getir (server-side filtre opsiyonel)
  // Desteklenen filtreler: isActive, isOccupied, type, floorNumber, code, searchTerm, ownerId, tenantId
  async getFlats(filters = {}) {
    const params = new URLSearchParams()

    // Boole string/boolean karışıklığına dayanıklı ol
    if (filters.isActive !== '' && filters.isActive !== undefined) {
      params.append('isActive', String(filters.isActive))
    }
    if (filters.isOccupied !== '' && filters.isOccupied !== undefined) {
      params.append('isOccupied', String(filters.isOccupied))
    }

    // Yeni model alanları
    if (filters.type) params.append('type', filters.type) // Floor | Entry | Parking
    if (filters.floorNumber !== '' && filters.floorNumber !== null && filters.floorNumber !== undefined) {
      params.append('floorNumber', filters.floorNumber)
    }
    if (filters.code) params.append('code', filters.code)

    // Geriye dönük: bazı backend query’leri searchTerm destekliyor olabilir
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm)

    // Opsiyonel ilişkisel filtreler (liste sayfanda şart değil ama dursun)
    if (filters.ownerId) params.append('ownerId', filters.ownerId)
    if (filters.tenantId) params.append('tenantId', filters.tenantId)

    // Eski alışkanlıkla gelen floor varsa floorNumber’a geçir (geriye dönük)
    if (!params.has('floorNumber') && filters.floor !== undefined && filters.floor !== '') {
      params.append('floorNumber', filters.floor)
    }

    const qs = params.toString()
    const url = qs ? `${base}?${qs}` : base
    return await apiService.get(url)
  },

  // Ünite detay
  async getFlatById(id) {
    return await apiService.get(`${base}/${id}`)
  },

  // Yeni ünite oluştur
  // Beklenen DTO (CreateFlatDto):
  // { code, type, floorNumber?, section?, groupKey?, groupStrategy?, unitArea, ownerId?, monthlyRent?, shareCount?, isActive?, description? }
  async createFlat(dto) {
    // İstersen burada küçük normalize’lar yapabilirsin:
    // dto.code = String(dto.code || '').trim().toUpperCase()
    return await apiService.post(base, dto)
  },

  // Ünite güncelle
  // Beklenen DTO (UpdateFlatDto): Create + Id
  async updateFlat(id, dto) {
    // Backend, route id ile body.Id’nin aynı olmasını istiyor → garantiye al
    const body = { id, ...dto }
    return await apiService.put(`${base}/${id}`, body)
  },

  // Ünite sil (soft delete)
  async deleteFlat(id) {
    return await apiService.delete(`${base}/${id}`)
  },

  // Boş üniteleri getir
  // Not: Bu endpoint TenantsController altında: GET /tenants/available-flats
  // Query: ?floor=  (controller tarafında [FromQuery(Name = "floor")] ile FloorNumber’a map ediliyor)
  async getAvailableFlats(filters = {}) {
    const params = new URLSearchParams()
    // FE’de floorNumber kullanıyoruz; Tenants endpoint’i için alias’ı floor olarak gönderiyoruz:
    if (filters.floorNumber !== undefined && filters.floorNumber !== '') {
      params.append('floor', filters.floorNumber)
    }
    // Basit metin arama destekliyorsa:
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm)

    const qs = params.toString()
    const url = qs ? `${tenantsBase}/available-flats?${qs}` : `${tenantsBase}/available-flats`
    return await apiService.get(url)
  },

  // Ünite istatistikleri (varsa)
  async getFlatStats() {
    return await apiService.get(`${base}/stats`)
  }
}

export default flatsService
