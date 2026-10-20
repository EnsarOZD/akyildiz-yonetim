// src/infrastructure/services/settingsService.js
import apiService from '@/infrastructure/services/api'

const base = '/settings'

// Sunucuya ulaşılamazsa ödeme formu bu listeyle çalışır (backend varsayılanıyla aynı)
export const DEFAULT_BANKS = ['Ziraat', 'İş Bankası', 'Garanti', 'Yapı Kredi', 'Halkbank']

const settingsService = {
  // Ödeme formundaki banka listesi
  async getBanks() {
    return apiService.get(`${base}/banks`)
  },

  async saveBanks(banks) {
    return apiService.put(`${base}/banks`, { banks })
  }
}

export default settingsService
