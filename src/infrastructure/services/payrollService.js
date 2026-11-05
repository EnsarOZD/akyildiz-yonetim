// src/infrastructure/services/payrollService.js
import apiService from '@/infrastructure/services/api'

const base = '/payroll'
const enc = encodeURIComponent

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const fileForm = (file) => {
  const fd = new FormData()
  fd.append('file', file)
  return fd
}

// period: 'yyyy-MM'
const payrollService = {
  // ───── personel ─────
  getEmployees() { return apiService.get(`${base}/employees`) },
  createEmployee(data) { return apiService.post(`${base}/employees`, data) },
  updateEmployee(id, data) { return apiService.put(`${base}/employees/${id}`, data) },
  deleteEmployee(id) { return apiService.delete(`${base}/employees/${id}`) },
  addWage(id, data) { return apiService.post(`${base}/employees/${id}/wages`, data) },
  updateWage(id, wageId, data) { return apiService.put(`${base}/employees/${id}/wages/${wageId}`, data) },
  deleteWage(id, wageId) { return apiService.delete(`${base}/employees/${id}/wages/${wageId}`) },

  // ───── dönem ─────
  /** Dönem yoksa (404) null döner. */
  async getPeriod(period) {
    try {
      return await apiService.get(`${base}/periods/${period}`)
    } catch (e) {
      if (e?.status === 404) return null
      throw e
    }
  },
  createPeriod(period) { return apiService.post(`${base}/periods/${period}`) },
  addLine(period, employeeId) { return apiService.post(`${base}/periods/${period}/lines`, { employeeId }) },
  saveLines(period, inputs) { return apiService.put(`${base}/periods/${period}/lines`, inputs) },
  refreshWages(period) { return apiService.post(`${base}/periods/${period}/refresh-wages`) },

  async downloadAccountingPdf(period) {
    const { blob, filename } = await apiService.getBlob(`${base}/periods/${period}/accounting.pdf`)
    triggerDownload(blob, filename || `muhasebe-listesi-${period}.pdf`)
  },

  // ───── bordro ─────
  previewPayroll(period, file) { return apiService.post(`${base}/periods/${period}/payroll/preview`, fileForm(file)) },
  savePayroll(period, file) { return apiService.post(`${base}/periods/${period}/payroll`, fileForm(file)) },
  importHistory(files) {
    const fd = new FormData()
    for (const f of files) fd.append('files', f)
    return apiService.post(`${base}/history-import`, fd)
  },

  // ───── onay ─────
  /** Başarıda dönem DTO'su; farklılık/mevcut gider varsa 409 + gövdede ApproveOutcome (error.response.data). */
  approve(period, { confirmDifferences = false, confirmExistingExpenses = false } = {}) {
    const q = `confirmDifferences=${confirmDifferences}&confirmExistingExpenses=${confirmExistingExpenses}`
    return apiService.post(`${base}/periods/${period}/approve?${q}`)
  },
  unapprove(period) { return apiService.post(`${base}/periods/${period}/unapprove`) },

  // ───── ödemeler ─────
  getPayments(period) { return apiService.get(`${base}/periods/${period}/payments`) },
  addPayment(period, data) { return apiService.post(`${base}/periods/${period}/payments`, data) },
  deletePayment(period, id) { return apiService.delete(`${base}/periods/${period}/payments/${id}`) },

  // ───── kıdem tazminatı fonu ─────
  getSeveranceSummary() { return apiService.get(`${base}/severance`) },
  getSeveranceMovements(employeeId) { return apiService.get(`${base}/severance/${employeeId}`) },
  addSeveranceAdjustment(data) { return apiService.post(`${base}/severance/adjustments`, data) },
  deleteSeveranceAdjustment(id) { return apiService.delete(`${base}/severance/adjustments/${id}`) },
  addSeverancePayment(data) { return apiService.post(`${base}/severance/payments`, data) },
  deleteSeverancePayment(id) { return apiService.delete(`${base}/severance/payments/${id}`) },
  getSeveranceCeilings() { return apiService.get(`${base}/settings/severance-ceilings`) },
  saveSeveranceCeilings(ceilings) { return apiService.put(`${base}/settings/severance-ceilings`, ceilings) }
}

export default payrollService
