<template>
  <div v-if="isManagerOrViewer || userRole === 'tenant'" class="p-4 sm:p-6 min-h-screen dark:bg-base-200">
    <div class="max-w-7xl mx-auto">
      
      <!-- Başlık -->
      <PageHeader title="Geciken Ödemeler" subtitle="Tahsilatı bekleyen ve vadesi geçmiş tüm kayıtlar">
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
        <template #actions>
          <div class="flex items-center gap-2">
            <div class="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200 dark:border-red-800/50">
              {{ filteredOverdueItems.length }} Gecikme
            </div>
          </div>
        </template>
      </PageHeader>

      <!-- Filtreler -->
      <section class="bg-white dark:bg-[#0f1322] p-6 rounded-xl shadow-md border border-gray-200 dark:border-white/[0.07] mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-[#f1f3f9] mb-4">Filtreler</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-700 dark:text-[#f1f3f9]">Kiracı</span>
            </label>
            <select v-model="filterTenant" class="select select-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-700 dark:text-[#f1f3f9]">
              <option value="">Tüm Kiracılar</option>
              <option v-for="tenant in uniqueTenants" :key="tenant" :value="tenant">{{ tenant }}</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-700 dark:text-[#f1f3f9]">Tip</span>
            </label>
            <select v-model="filterType" class="select select-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-700 dark:text-[#f1f3f9]">
              <option value="">Tüm Tipler</option>
              <option v-for="type in debtTypesList" :key="type.value" :value="type.value">{{ type.label }}</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-700 dark:text-[#f1f3f9]">Dönem</span>
            </label>
            <select v-model="filterPeriod" class="select select-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-700 dark:text-[#f1f3f9]">
              <option value="">Tüm Dönemler</option>
              <option v-for="period in uniquePeriods" :key="period" :value="period">{{ period }}</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-700 dark:text-[#f1f3f9]">Tutar Aralığı</span>
            </label>
            <select v-model="filterAmountRange" class="select select-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-700 dark:text-[#f1f3f9]">
              <option value="">Tüm Tutarlar</option>
              <option value="0-1000">0 - 1.000 ₺</option>
              <option value="1000-5000">1.000 - 5.000 ₺</option>
              <option value="5000-10000">5.000 - 10.000 ₺</option>
              <option value="10000+">10.000 ₺+</option>
            </select>
          </div>
        </div>

        <!-- Filtre Temizleme Butonu -->
        <div class="mt-4 flex justify-end">
          <button 
            @click="clearFilters" 
            class="btn btn-outline btn-sm"
            :disabled="!hasActiveFilters"
          >
            Filtreleri Temizle
          </button>
        </div>
      </section>

      <!-- Özet Bilgi -->
      <section class="bg-white dark:bg-[#0f1322] p-6 rounded-xl shadow-md border border-gray-200 dark:border-white/[0.07] mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-[#f1f3f9]">Geciken Ödeme Listesi</h2>
          <div class="flex items-center gap-3">
            <div v-if="hasActiveFilters" class="bg-brand-100 dark:bg-blue-900/50 text-brand-600 dark:text-brand-400 px-3 py-1 rounded-full text-sm font-medium">
              Filtrelenmiş
            </div>
            <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm font-medium">
              {{ filteredOverdueItems.length }} adet geciken ödeme
            </div>
            <button @click="exportToExcel" class="btn btn-sm btn-ghost border border-gray-300 dark:border-white/[0.1]" title="Excel Olarak İndir">
              <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              </svg>
              Excel
            </button>
            <button @click="exportToPDF" class="btn btn-sm btn-ghost border border-gray-300 dark:border-white/[0.1]" title="PDF Olarak İndir">
              <svg class="w-4 h-4 text-rose-500 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              PDF
            </button>
          </div>
        </div>
        
        <div v-if="filteredOverdueItems.length > 0" class="space-y-3">
          <div 
            v-for="item in filteredOverdueItems" 
            :key="item.id"
            class="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
          >
            <div class="flex items-center gap-4">
              <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-800 dark:text-[#f1f3f9]">{{ item.company }}</p>
                <p class="text-sm text-gray-500 dark:text-[#9aa0b4]">{{ item.unit }} - {{ item.typeLabel }}</p>
                <p class="text-xs text-gray-400 dark:text-[#626885]">Dönem: {{ item.period || '-' }}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="flex items-center justify-end gap-2 mb-1">
                <span class="badge" :class="{
                  'badge-success': item.paymentStatus.status === 'paid',
                  'badge-warning': item.paymentStatus.status === 'partial',
                  'badge-error': item.paymentStatus.status === 'unpaid'
                }">
                  {{ item.paymentStatus.label }}
                </span>
              </div>
              <p class="font-bold text-red-600 dark:text-red-400 text-lg">{{ formatCurrency(item.unpaidAmount) }}</p>
              <p class="text-sm text-gray-500 dark:text-[#9aa0b4]">Son Ödeme: {{ item.dueDateFormatted }}</p>
              <div class="flex items-center gap-2 text-xs">
                <span class="text-red-500 dark:text-red-400 font-medium">
                  {{ getDaysOverdue(item.dueDate) }} gün gecikmiş
                </span>
                <span v-if="item.paymentStatus.status === 'partial'" class="text-yellow-600 dark:text-yellow-400">
                  ({{ formatCurrency(item.paidAmount) }} ödendi)
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full p-4 w-fit mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-[#f1f3f9] mb-2">
            {{ hasActiveFilters ? 'Filtrelenmiş Sonuç Yok' : 'Geciken Ödeme Yok' }}
          </h3>
          <p class="text-gray-500 dark:text-[#9aa0b4]">
            {{ hasActiveFilters ? 'Seçilen kriterlere uygun geciken ödeme bulunmuyor.' : 'Tüm ödemeler zamanında yapılmış.' }}
          </p>
        </div>
      </section>

    </div>
  </div>

  <div v-else class="flex items-center justify-center min-h-screen dark:bg-base-200">
    <div class="text-center">
      <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-4 w-fit mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <p class="text-gray-500 dark:text-[#9aa0b4] text-lg">Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiService from '@/infrastructure/services/api'
import { useAuthStore } from '@/application/stores/auth'
import utilityDebtsService from '@/infrastructure/services/utilityDebtsService'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import { getDebtTypeLabel, DEBT_TYPES } from '@/core/constants/enums'

const debtTypesList = DEBT_TYPES

const overduePayments = ref([])
const tenants = ref([])
const loading = ref(false)
const authStore = useAuthStore()
const userRole = computed(() => authStore.role)
const userId = computed(() => authStore.userId)

// Filtre değişkenleri
const filterTenant = ref('')
const filterType = ref('')
const filterPeriod = ref('')
const filterAmountRange = ref('')

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '₺0.00'
  return Number(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

const getDaysOverdue = (dueDate) => {
  if (!dueDate) return 0
  const now = new Date()
  const due = new Date(dueDate)
  const diffTime = now - due
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

// Filtreleme mantığı
const filteredOverdueItems = computed(() => {
  return overduePayments.value.filter(item => {
    // Kiracı filtresi
    const matchesTenant = !filterTenant.value || item.company === filterTenant.value
    
    // Tip filtresi
    const matchesType = !filterType.value || String(item.type) === String(filterType.value)
    
    // Dönem filtresi
    const matchesPeriod = !filterPeriod.value || item.period === filterPeriod.value
    
    // Tutar aralığı filtresi
    const amount = Number(item.amount || 0)
    let matchesAmount = true
    if (filterAmountRange.value) {
      switch (filterAmountRange.value) {
        case '0-1000':
          matchesAmount = amount >= 0 && amount <= 1000
          break
        case '1000-5000':
          matchesAmount = amount > 1000 && amount <= 5000
          break
        case '5000-10000':
          matchesAmount = amount > 5000 && amount <= 10000
          break
        case '10000+':
          matchesAmount = amount > 10000
          break
      }
    }
    
    return matchesTenant && matchesType && matchesPeriod && matchesAmount
  })
})

// Aktif filtre kontrolü
const hasActiveFilters = computed(() => {
  return filterTenant.value || filterType.value || filterPeriod.value || filterAmountRange.value
})

// Filtre temizleme
const clearFilters = () => {
  filterTenant.value = ''
  filterType.value = ''
  filterPeriod.value = ''
  filterAmountRange.value = ''
}

// Benzersiz değerler için computed'lar
const uniqueTenants = computed(() => {
  const tenants = [...new Set(overduePayments.value.map(item => item.company))]
  return tenants.filter(tenant => tenant && tenant !== 'Bilinmiyor').sort()
})

const uniquePeriods = computed(() => {
  const periods = [...new Set(overduePayments.value.map(item => item.period))]
  return periods.filter(period => period).sort().reverse()
})

const TYPE_LABELS = { Rent: 'Kira', Dues: 'Aidat', Utility: 'Fatura', Other: 'Diğer' }

const fetchTenants = async () => {
  try {
    const response = await apiService.get('/tenants', { pageSize: 100 })
    const data = Array.isArray(response) ? response : (response?.items ?? [])
    tenants.value = data
  } catch (error) {
    console.error('Kiracılar yüklenirken hata:', error)
    tenants.value = []
  }
}

const fetchOverduePayments = async () => {
  loading.value = true
  try {
    const response = await utilityDebtsService.getUtilityDebts({ excludePaid: true })
    const items = Array.isArray(response) ? response : (response?.items ?? [])
    const now = new Date()
    
    const overdueItems = items.filter(d => {
      // dueDate yoksa gecikmiş sayıyoruz — tarihi girilmemiş eski borçlar
      const isOverdue = !d.dueDate || new Date(d.dueDate) < now
      const hasUnpaidAmount = d.status !== 'Paid' && Number(d.remainingAmount || 0) > 0
      return isOverdue && hasUnpaidAmount
    })

    overduePayments.value = overdueItems.map(debt => {
      const period = debt.periodYear && debt.periodMonth
        ? `${debt.periodYear}-${String(debt.periodMonth).padStart(2, '0')}`
        : null
      
      const mapStatus = (s) => {
        if (s === 'Paid') return { status: 'paid', label: 'Ödendi' }
        if (s === 'Partial') return { status: 'partial', label: 'Kısmi Ödendi' }
        return { status: 'unpaid', label: 'Ödenmedi' }
      }

      return {
        ...debt,
        company: debt.tenantName || (debt.ownerName ? `${debt.ownerName} (Mal Sahibi)` : 'Bilinmiyor'),
        unit: debt.flatInfo || '-',
        typeLabel: getDebtTypeLabel(debt.type),
        period,
        dueDate: debt.dueDate,
        dueDateFormatted: formatDate(debt.dueDate),
        paymentStatus: mapStatus(debt.status),
        unpaidAmount: Number(debt.remainingAmount ?? debt.amount ?? 0),
        paidAmount: Number((debt.amount ?? 0) - (debt.remainingAmount ?? 0)),
      }
    })
  } catch (error) {
    console.error('Geciken borçlar yüklenirken hata:', error)
    overduePayments.value = []
  } finally {
    loading.value = false
  }
}

const markAsPaid = async (paymentId) => {
  try {
    const payment = overduePayments.value.find(p => p.id === paymentId)
    await apiService.put(`/payments/${paymentId}`, {
      id: paymentId,
      amount: payment?.amount,
      type: payment?.type,
      status: 'Completed',
      paymentDate: payment?.paymentDate,
      description: payment?.description,
      receiptNumber: payment?.receiptNumber,
      tenantId: payment?.tenantId,
      ownerId: payment?.ownerId,
    })
    await fetchOverduePayments()
  } catch (error) {
    console.error('Ödeme durumu güncellenirken hata:', error)
  }
}

const totalOverdueAmount = computed(() => {
  return overduePayments.value.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
})

const isManagerOrViewer = computed(() =>
  ['admin', 'manager', 'observer', 'dataentry'].includes(userRole.value)
)

onMounted(() => {
  fetchOverduePayments()
})

// ── EXPORT: Excel ────────────────────────────────────────────────────────────
const exportToExcel = async () => {
  const XLSX = await import('xlsx')
  const data = filteredOverdueItems.value.map(item => ({
    'Kiracı / Firma': item.company,
    'Ünite': item.unit,
    'Tür': item.typeLabel,
    'Dönem': item.period || '-',
    'Son Ödeme Tarihi': item.dueDateFormatted,
    'Gecikme (Gün)': getDaysOverdue(item.dueDate),
    'Durum': item.paymentStatus.label,
    'Ödenen Tutar (₺)': item.paidAmount,
    'Kalan Tutar (₺)': item.unpaidAmount,
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Gecikmiş Ödemeler')

  ws['!cols'] = [
    { wch: 28 }, { wch: 14 }, { wch: 14 }, { wch: 12 },
    { wch: 18 }, { wch: 16 }, { wch: 14 }, { wch: 18 }, { wch: 18 }
  ]

  XLSX.writeFile(wb, `Gecikmiş_Ödemeler_${new Date().toISOString().split('T')[0]}.xlsx`)
}

// ── EXPORT: PDF ─────────────────────────────────────────────────────────────
const exportToPDF = async () => {
  const { jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')
  const { arialBase64 } = await import('../reports/utils/pdfFonts')

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  doc.addFileToVFS('arial.ttf', arialBase64)
  doc.addFont('arial.ttf', 'Arial', 'normal')
  doc.setFont('Arial', 'normal')

  const pageW  = doc.internal.pageSize.getWidth()
  const pageH  = doc.internal.pageSize.getHeight()
  const margin = 14
  const genDate = new Date().toLocaleString('tr-TR')
  const dateStr = new Date().toISOString().split('T')[0]

  const NAVY  = [15, 52, 96]
  const GOLD  = [180, 145, 40]
  const WHITE = [255, 255, 255]
  const RED   = [200, 30, 30]
  const GRAY  = [110, 110, 110]

  const drawHeader = (isFirst) => {
    doc.setFillColor(...NAVY)
    doc.rect(0, 0, pageW, isFirst ? 36 : 24, 'F')
    doc.setFillColor(...GOLD)
    doc.rect(0, isFirst ? 36 : 24, pageW, 1.5, 'F')

    doc.setTextColor(...WHITE)
    doc.setFontSize(isFirst ? 15 : 10)
    doc.text('AKYILDIZ IS MERKEZI', margin, isFirst ? 13 : 10)
    if (isFirst) {
      doc.setFontSize(8)
      doc.text('Yonetim ve Isletme Sistemi', margin, 21)
    }
    doc.setFontSize(isFirst ? 19 : 10)
    doc.text('GECIKMIŞ ÖDEMELER RAPORU', pageW - margin, isFirst ? 17 : 10, { align: 'right' })
    if (isFirst) {
      doc.setFontSize(7.5)
      doc.text(`Olusturulma: ${genDate}`, pageW - margin, 25, { align: 'right' })
    }
  }

  const drawFooter = (pageNum, pageTotal) => {
    doc.setFillColor(243, 244, 246)
    doc.rect(0, pageH - 11, pageW, 11, 'F')
    doc.setDrawColor(210, 215, 220)
    doc.setLineWidth(0.3)
    doc.line(0, pageH - 11, pageW, pageH - 11)
    doc.setTextColor(...GRAY)
    doc.setFontSize(7)
    doc.text('Akyildiz Is Merkezi | Yonetim Sistemi | Gizli ve Kuruma Ozel', margin, pageH - 4)
    doc.text(`Sayfa ${pageNum} / ${pageTotal}`, pageW / 2, pageH - 4, { align: 'center' })
    doc.text(`Olusturulma: ${genDate}`, pageW - margin, pageH - 4, { align: 'right' })
  }

  drawHeader(true)

  // Özet kutu
  const totalUnpaid = filteredOverdueItems.value.reduce((s, i) => s + i.unpaidAmount, 0)
  const count = filteredOverdueItems.value.length

  doc.setTextColor(...GRAY)
  doc.setFontSize(7.5)
  doc.text(`Toplam ${count} kayit listelenmistir. Toplam gecikmiş tutar: ${formatCurrency(totalUnpaid)}`, margin, 43)

  // Tablo satırları
  const rows = filteredOverdueItems.value.map(item => ([
    item.company,
    item.unit,
    item.typeLabel,
    item.period || '-',
    item.dueDateFormatted,
    `${getDaysOverdue(item.dueDate)} gün`,
    item.paymentStatus.label,
    formatCurrency(item.paidAmount),
    formatCurrency(item.unpaidAmount),
  ]))

  let totalPDFPages = 1

  autoTable(doc, {
    head: [[
      'Kiracı / Firma', 'Ünite', 'Tür', 'Dönem',
      'Son Ödeme Tar.', 'Gecikme', 'Durum', 'Ödenen', 'Kalan'
    ]],
    body: rows,
    startY: 48,
    margin: { left: margin, right: margin, bottom: 18 },
    styles: {
      fontSize: 7.5,
      font: 'Arial',
      cellPadding: { top: 2.5, right: 3, bottom: 2.5, left: 3 },
      textColor: [30, 30, 30],
      lineColor: [215, 220, 228],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: NAVY,
      textColor: WHITE,
      fontSize: 7.5,
      fontStyle: 'normal',
      cellPadding: { top: 4, right: 3, bottom: 4, left: 3 },
      halign: 'center',
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 44 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 16, halign: 'center' },
      4: { cellWidth: 24, halign: 'center' },
      5: { cellWidth: 18, halign: 'center', textColor: RED },
      6: { cellWidth: 20, halign: 'center' },
      7: { cellWidth: 28, halign: 'right' },
      8: { cellWidth: 28, halign: 'right', textColor: RED },
    },
    didParseCell(data) {
      if (data.section !== 'body' || data.column.index !== 6) return
      if (data.cell.raw === 'Ödenmedi') {
        data.cell.styles.textColor = [160, 20, 20]
        data.cell.styles.fillColor = [254, 242, 242]
      } else if (data.cell.raw === 'Kısmi Ödendi') {
        data.cell.styles.textColor = [146, 60, 14]
        data.cell.styles.fillColor = [255, 251, 235]
      } else if (data.cell.raw === 'Ödendi') {
        data.cell.styles.textColor = [16, 100, 45]
      }
    },
    willDrawPage(data) {
      if (data.pageNumber > 1) drawHeader(false)
    },
    didDrawPage(data) {
      totalPDFPages = data.pageCount ?? doc.internal.getNumberOfPages()
      drawFooter(data.pageNumber, totalPDFPages)
    }
  })

  doc.save(`Gecikmiş_Ödemeler_${dateStr}.pdf`)
}
</script>
