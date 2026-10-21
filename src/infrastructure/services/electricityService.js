// src/infrastructure/services/electricityService.js
import apiService from '@/infrastructure/services/api'

const base = '/electricity'

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const electricityService = {
  // Sayaçlar
  async getMeters() {
    return apiService.get(`${base}/meters`)
  },
  async createMeter(body) {
    return apiService.post(`${base}/meters`, body)
  },
  async updateMeter(id, body) {
    return apiService.put(`${base}/meters/${id}`, body)
  },
  async deleteMeter(id) {
    return apiService.delete(`${base}/meters/${id}`)
  },

  // Dönemler
  async getPeriods() {
    return apiService.get(`${base}/periods`)
  },
  async createPeriod(body) {
    return apiService.post(`${base}/periods`, body)
  },
  async getPeriod(id) {
    return apiService.get(`${base}/periods/${id}`)
  },
  async updatePeriod(id, body) {
    return apiService.put(`${base}/periods/${id}`, body)
  },
  async finalizePeriod(id) {
    return apiService.post(`${base}/periods/${id}/finalize`)
  },
  async revertPeriod(id) {
    return apiService.post(`${base}/periods/${id}/revert`)
  },
  async deletePeriod(id) {
    return apiService.delete(`${base}/periods/${id}`)
  },
  // items: [{ debtId, invoiceNumber }] (gövde düz dizi)
  async saveInvoiceNumbers(id, items) {
    return apiService.put(`${base}/periods/${id}/invoice-numbers`, items)
  },
  async downloadReport(id) {
    const { blob, filename } = await apiService.getBlob(`${base}/periods/${id}/report.pdf`)
    saveBlob(blob, filename || 'Elektrik-rapor.pdf')
  }
}

export default electricityService
