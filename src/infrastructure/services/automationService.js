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

  // Aidat fatura dökümü (period: 'yyyy-MM')
  async getAidatInvoices(period) {
    return apiService.get(`${base}/aidat-invoices`, { period })
  },

  // items: [{ debtId, invoiceNumber }] — boş invoiceNumber numarayı siler
  async saveAidatInvoiceNumbers(period, items) {
    return apiService.put(`${base}/aidat-invoices?period=${encodeURIComponent(period)}`, items)
  },

  async downloadAidatInvoicesPdf(period) {
    const { blob, filename } = await apiService.getBlob(`${base}/aidat-invoices/report.pdf?period=${encodeURIComponent(period)}`)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || `Aidat-${period}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
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
