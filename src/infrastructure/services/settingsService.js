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
  },

  // Kurum bilgileri (e-posta tasarımı: IBAN, iletişim, logo)
  async getBranding() {
    return apiService.get(`${base}/branding`)
  },

  async saveBranding(data) {
    return apiService.put(`${base}/branding`, data)
  },

  // Kaydetmeden örnek hatırlatma e-postası → { html }
  async previewBranding(data, kind = 'Overdue') {
    return apiService.post(`${base}/branding/preview?kind=${encodeURIComponent(kind)}`, data)
  },

  async uploadLogo(file) {
    const form = new FormData()
    form.append('file', file)
    return apiService.post(`${base}/branding/logo`, form)
  },

  async deleteLogo() {
    return apiService.delete(`${base}/branding/logo`)
  },

  // Herkese açık logo adresi (önizleme için)
  logoUrl(version) {
    return `${apiService.baseURL}${base}/branding/logo?v=${encodeURIComponent(version || '')}`
  }
}

export default settingsService
