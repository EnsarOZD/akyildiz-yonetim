// src/infrastructure/services/automationService.js
import apiService from '@/infrastructure/services/api'

const base = '/automation'

const automationService = {
  // Otomasyon ayarları
  async getSettings() {
    return apiService.get(`${base}/settings`)
  },

  async saveSettings(settings) {
    return apiService.put(`${base}/settings`, settings)
  },

  // Aylık aidat tahakkuku (period: 'yyyy-MM')
  async previewAccrual(period) {
    return apiService.post(`${base}/accrual/preview?period=${encodeURIComponent(period)}`)
  },

  async runAccrual(period) {
    return apiService.post(`${base}/accrual/run?period=${encodeURIComponent(period)}`)
  },

  // period: kapsanan ay ('yyyy-MM')
  async runStatements(period) {
    return apiService.post(`${base}/statements/run?period=${encodeURIComponent(period)}`)
  },

  async runReminders() {
    return apiService.post(`${base}/reminders/run`)
  },

  async getRuns(take = 20) {
    return apiService.get(`${base}/runs`, { take })
  },

  async getUnmatchedDefinitions(year) {
    return apiService.get(`${base}/unmatched-definitions`, year ? { year } : {})
  },

  // Hatırlatma tercihi
  async setTenantReminders(id, enabled) {
    return apiService.patch(`/tenants/${id}/reminders`, { enabled: !!enabled })
  },

  async setOwnerReminders(id, enabled) {
    return apiService.patch(`/owners/${id}/reminders`, { enabled: !!enabled })
  }
}

export default automationService
