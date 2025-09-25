import apiService from '@/services/api'

const base = '/owners' // BE'de farklıysa bunu değiştir

const ownersService = {
  async getOwners (filters = {}) {
    const p = new URLSearchParams()
    if (filters.searchTerm) p.append('searchTerm', filters.searchTerm)
    if (filters.isActive !== undefined) p.append('isActive', String(filters.isActive))
    const qs = p.toString()
    const url = qs ? `${base}?${qs}` : base
    return await apiService.get(url)
  }
}

export default ownersService
