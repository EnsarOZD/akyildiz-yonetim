import ExcelJS from 'exceljs'

export class ExcelExporter {
  constructor() {
    this.workbook = new ExcelJS.Workbook()
  }

  // Yeni worksheet oluştur
  createWorksheet(name) {
    return this.workbook.addWorksheet(name)
  }

  // Başlık satırı ekle
  addHeaders(worksheet, headers) {
    const headerRow = worksheet.addRow(headers)
    headerRow.font = { bold: true }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    }
  }

  // Veri ekle
  addData(worksheet, data) {
    data.forEach(row => {
      worksheet.addRow(row)
    })
  }

  // Sütun genişliklerini otomatik ayarla
  autoSizeColumns(worksheet) {
    worksheet.columns.forEach(column => {
      let maxLength = 0
      column.eachCell({ includeEmpty: true }, cell => {
        const columnLength = cell.value ? cell.value.toString().length : 10
        if (columnLength > maxLength) {
          maxLength = columnLength
        }
      })
      column.width = Math.min(maxLength + 2, 50)
    })
  }

  // Para formatı
  formatCurrency(worksheet, columnIndex) {
    worksheet.getColumn(columnIndex).numFmt = '₺#,##0.00'
  }

  // Tarih formatı
  formatDate(worksheet, columnIndex) {
    worksheet.getColumn(columnIndex).numFmt = 'dd.mm.yyyy'
  }

  // Excel dosyasını indir
  async download(filename) {
    const buffer = await this.workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  // Kiracı listesi export
  async exportTenants(tenants) {
    const worksheet = this.createWorksheet('Kiracılar')
    
    const headers = [
      'Ad Soyad',
      'E-posta',
      'Telefon',
      'Kat',
      'Kira Tutarı',
      'Sözleşme Başlangıcı',
      'Sözleşme Bitişi',
      'Durum'
    ]
    
    this.addHeaders(worksheet, headers)
    
    const data = tenants.map(tenant => [
      `${tenant.firstName} ${tenant.lastName}`,
      tenant.email,
      tenant.phone,
      tenant.unit,
      tenant.rentAmount,
      tenant.contractStartDate,
      tenant.contractEndDate,
      tenant.isActive ? 'Aktif' : 'Pasif'
    ])
    
    this.addData(worksheet, data)
    this.autoSizeColumns(worksheet)
    this.formatCurrency(worksheet, 5) // Kira tutarı
    this.formatDate(worksheet, 6) // Başlangıç tarihi
    this.formatDate(worksheet, 7) // Bitiş tarihi
    
    await this.download('kiracilar')
  }

  // Ödemeler export
  async exportPayments(payments) {
    const worksheet = this.createWorksheet('Ödemeler')
    
    const headers = [
      'Kiracı',
      'Tutar',
      'Ödeme Tarihi',
      'Ödeme Tipi',
      'Açıklama',
      'Durum'
    ]
    
    this.addHeaders(worksheet, headers)
    
    const data = payments.map(payment => [
      payment.tenantName,
      payment.amount,
      payment.paymentDate,
      payment.paymentType,
      payment.description,
      payment.status
    ])
    
    this.addData(worksheet, data)
    this.autoSizeColumns(worksheet)
    this.formatCurrency(worksheet, 2) // Tutar
    this.formatDate(worksheet, 3) // Ödeme tarihi
    
    await this.download('odemeler')
  }

  // Giderler export
  async exportExpenses(expenses) {
    const worksheet = this.createWorksheet('Giderler')
    
    const headers = [
      'Şirket',
      'Tutar',
      'Tarih',
      'Kategori',
      'Kat',
      'Açıklama'
    ]
    
    this.addHeaders(worksheet, headers)
    
    const data = expenses.map(expense => [
      expense.company,
      expense.amount,
      expense.date,
      expense.category,
      expense.unit,
      expense.description
    ])
    
    this.addData(worksheet, data)
    this.autoSizeColumns(worksheet)
    this.formatCurrency(worksheet, 2) // Tutar
    this.formatDate(worksheet, 3) // Tarih
    
    await this.download('giderler')
  }

  // Rapor export
  async exportReport(data, reportType) {
    const worksheet = this.createWorksheet(reportType)
    
    // Rapor tipine göre farklı formatlar
    switch (reportType) {
      case 'Aylık Rapor':
        await this.exportMonthlyReport(worksheet, data)
        break
      case 'Yıllık Rapor':
        await this.exportYearlyReport(worksheet, data)
        break
      default:
        await this.exportGenericReport(worksheet, data)
    }
    
    await this.download(`rapor_${reportType.toLowerCase().replace(/\s+/g, '_')}`)
  }

  // Aylık rapor
  async exportMonthlyReport(worksheet, data) {
    const headers = [
      'Ay',
      'Toplam Gelir',
      'Toplam Gider',
      'Net Kar',
      'Kiracı Sayısı',
      'Ortalama Kira'
    ]
    
    this.addHeaders(worksheet, headers)
    this.addData(worksheet, data)
    this.autoSizeColumns(worksheet)
    this.formatCurrency(worksheet, 2) // Toplam gelir
    this.formatCurrency(worksheet, 3) // Toplam gider
    this.formatCurrency(worksheet, 4) // Net kar
    this.formatCurrency(worksheet, 6) // Ortalama kira
  }

  // Yıllık rapor
  async exportYearlyReport(worksheet, data) {
    const headers = [
      'Yıl',
      'Toplam Gelir',
      'Toplam Gider',
      'Net Kar',
      'Kar Marjı (%)',
      'Kiracı Sayısı'
    ]
    
    this.addHeaders(worksheet, headers)
    this.addData(worksheet, data)
    this.autoSizeColumns(worksheet)
    this.formatCurrency(worksheet, 2) // Toplam gelir
    this.formatCurrency(worksheet, 3) // Toplam gider
    this.formatCurrency(worksheet, 4) // Net kar
  }

  // Genel rapor
  async exportGenericReport(worksheet, data) {
    if (data.headers && data.rows) {
      this.addHeaders(worksheet, data.headers)
      this.addData(worksheet, data.rows)
      this.autoSizeColumns(worksheet)
    }
  }
}

// Utility fonksiyonlar
export const formatExcelDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('tr-TR')
}

export const formatExcelCurrency = (amount) => {
  if (!amount) return '₺0,00'
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(amount)
}

// Excel import fonksiyonu (gelecekte kullanım için)
export class ExcelImporter {
  static async importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const workbook = new ExcelJS.Workbook()
          await workbook.xlsx.load(e.target.result)
          
          const worksheet = workbook.getWorksheet(1)
          const data = []
          
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // İlk satır başlık
              const rowData = []
              row.eachCell((cell, colNumber) => {
                rowData.push(cell.value)
              })
              data.push(rowData)
            }
          })
          
          resolve(data)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }
} 