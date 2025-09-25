import { errorHandler } from '@/utils/errorHandler'

export function useNotification() {
  
  // Hata mesajı göster
  const showError = (message, context = {}) => {
    errorHandler.logError('error', message, context)
  }
  
  // Başarı mesajı göster
  const showSuccess = (message, context = {}) => {
    errorHandler.logSuccess('success', message, context)
  }

  // Bilgi mesajı göster
  const showInfo = (message, context = {}) => {
    errorHandler.logSuccess('info', message, context)
  }

  // Uyarı mesajı göster
  const showWarning = (message, context = {}) => {
    errorHandler.logSuccess('warning', message, context)
  }

  // İşlem başarı mesajları
  const showCreateSuccess = (itemName) => {
    showSuccess(`${itemName} başarıyla oluşturuldu.`, { action: 'create' })
  }

  const showUpdateSuccess = (itemName) => {
    showSuccess(`${itemName} başarıyla güncellendi.`, { action: 'update' })
  }

  const showDeleteSuccess = (itemName) => {
    showSuccess(`${itemName} başarıyla silindi.`, { action: 'delete' })
  }

  const showSaveSuccess = (itemName) => {
    showSuccess(`${itemName} başarıyla kaydedildi.`, { action: 'save' })
  }

  const showImportSuccess = (count) => {
    showSuccess(`${count} kayıt başarıyla içe aktarıldı.`, { action: 'import' })
  }

  const showExportSuccess = (fileName) => {
    showSuccess(`${fileName} başarıyla dışa aktarıldı.`, { action: 'export' })
  }

  return {
    showError,
    showSuccess,
    showInfo,
    showWarning,
    showCreateSuccess,
    showUpdateSuccess,
    showDeleteSuccess,
    showSaveSuccess,
    showImportSuccess,
    showExportSuccess
  }
} 