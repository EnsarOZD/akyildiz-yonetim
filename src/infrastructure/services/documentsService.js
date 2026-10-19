// src/infrastructure/services/documentsService.js
import apiService from '@/infrastructure/services/api'

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

function cleanParams({ tenantId, ownerId, startDate, endDate }) {
  const p = {}
  if (tenantId) p.tenantId = tenantId
  if (ownerId) p.ownerId = ownerId
  p.startDate = startDate
  p.endDate = endDate
  return p
}

const documentsService = {
  async downloadReceipt(paymentId) {
    const { blob, filename } = await apiService.getBlob(`/payments/${paymentId}/receipt.pdf`)
    saveBlob(blob, filename || `Makbuz-${paymentId}.pdf`)
  },

  // { receiptSerial, receiptEmailStatus, receiptEmailedAt }
  async resendReceipt(paymentId) {
    return apiService.post(`/payments/${paymentId}/receipt/send`)
  },

  async downloadStatement(args) {
    const p = cleanParams(args)
    const { blob, filename } = await apiService.getBlob('/statements/pdf', p)
    saveBlob(blob, filename || `Ekstre-${p.startDate}-${p.endDate}.pdf`)
  },

  async sendStatement(args) {
    return apiService.post('/statements/send', cleanParams(args))
  }
}

export default documentsService
