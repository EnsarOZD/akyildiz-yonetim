<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 pb-24">
    <div class="max-w-7xl mx-auto">
      <!-- Header Area -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <span class="text-4xl">💳</span>
            Ödemelerim ve Borçlarım
          </h1>
          <p v-if="tenantInfo" class="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
            {{ tenantInfo.companyName }}
            <span v-if="tenantInfo.flats && tenantInfo.flats.length" class="text-gray-400 font-normal">
              — Ünite: {{ tenantInfo.flats.map(f => f.code).join(', ') }}
            </span>
          </p>
          <p class="text-gray-500 dark:text-gray-400 mt-0.5 text-xs">Geçmiş ödemelerinizi ve güncel borç durumunuzu takip edin</p>
        </div>
        <div class="flex gap-2">
          <button @click="exportToExcel" class="btn btn-success text-white shadow-md normal-case btn-sm sm:btn-md" :disabled="loading || reportItems.length === 0">
            <span>📗 Excel</span>
          </button>
          <button @click="exportToPDF" class="btn btn-error text-white shadow-md normal-case btn-sm sm:btn-md" :disabled="loading || reportItems.length === 0">
            <span>📕 PDF</span>
          </button>
        </div>
      </div>

      <!-- Filters Card -->
      <div class="card bg-white dark:bg-gray-800 shadow-xl mb-8 overflow-visible border border-gray-100 dark:border-gray-700">
        <div class="card-body p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Tarih Aralığı -->
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Başlangıç Tarihi</span></label>
              <input v-model="filters.startDate" type="date" class="input input-bordered w-full bg-white dark:bg-gray-700" />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Bitiş Tarihi</span></label>
              <input v-model="filters.endDate" type="date" class="input input-bordered w-full bg-white dark:bg-gray-700" />
            </div>

            <!-- İşlem Tipi -->
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">İşlem Tipi</span></label>
              <select v-model="filters.type" class="select select-bordered w-full bg-white dark:bg-gray-700">
                <option value="all">Tümü (Borç & Ödeme)</option>
                <option value="debt">Sadece Borçlar</option>
                <option value="payment">Sadece Ödemeler</option>
              </select>
            </div>

            <!-- Ödeme Durumu -->
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Ödeme Durumu</span></label>
              <select v-model="filters.status" class="select select-bordered w-full bg-white dark:bg-gray-700" :disabled="filters.type === 'payment'">
                <option value="all">Tümü</option>
                <option value="unpaid">Ödenmeyenler</option>
                <option value="paid">Ödenenler</option>
              </select>
            </div>
          </div>
          
          <div class="flex justify-end mt-4 pt-4 border-t dark:border-gray-700 gap-2">
            <button @click="clearFilters" class="btn btn-ghost btn-sm">Filtreleri Temizle</button>
            <button @click="fetchData" class="btn btn-primary btn-sm px-6" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner loading-xs"></span>
              Sorgula
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div v-if="reportItems.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card bg-error/5 text-error dark:bg-error/10 shadow-sm p-5 border-l-4 border-error">
          <div class="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">Toplam Borç Tahakkuku</div>
          <div class="text-2xl font-bold">{{ formatCurrency(summary.totalDebt) }}</div>
        </div>
        <div class="card bg-success/5 text-success dark:bg-success/10 shadow-sm p-5 border-l-4 border-success">
          <div class="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">Toplam Yapılan Ödeme</div>
          <div class="text-2xl font-bold">{{ formatCurrency(summary.totalPayment) }}</div>
        </div>
        <div class="card bg-primary/5 text-primary-content dark:bg-primary/10 shadow-sm p-5 border-l-4 border-primary">
          <div class="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">Güncel Bakiye Durumu</div>
          <div class="text-2xl font-bold" :class="summary.balance < 0 ? 'text-error' : 'text-success'">
            {{ formatCurrency(Math.abs(summary.balance)) }}
            <span class="text-sm font-medium opacity-80">{{ summary.balance < 0 ? '(Borçlu)' : '(Alacaklı/Dengede)' }}</span>
          </div>
        </div>
      </div>

      <!-- Main Table Card -->
      <div class="card bg-white dark:bg-gray-800 shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div class="overflow-x-auto min-h-[300px]">
          <table class="table table-zebra w-full" id="report-table">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200">
                <th scope="col">Tarih</th>
                <th scope="col">Dönem</th>
                <th scope="col">İşlem Türü</th>
                <th scope="col">Açıklama</th>
                <th scope="col" class="text-right">Borç(-)</th>
                <th scope="col" class="text-right">Ödeme(+)</th>
                <th scope="col" class="text-center">Durum</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in paginatedReports" :key="idx" class="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                <td class="whitespace-nowrap">{{ formatDate(item.date) }}</td>
                <td class="whitespace-nowrap font-mono text-sm">{{ formatPeriod(item.periodYear, item.periodMonth) }}</td>
                <td>
                  <span :class="['badge badge-sm font-semibold px-2 py-1', item.isPayment ? 'badge-success py-3' : 'badge-error py-3']">
                    {{ item.isPayment ? 'ÖDEME' : 'BORÇ' }}
                  </span>
                </td>
                <td class="max-w-xs truncate">{{ item.description }}</td>
                <td class="text-right font-semibold" :class="{'text-error': !item.isPayment}">
                  {{ !item.isPayment ? formatCurrency(item.amount) : '-' }}
                </td>
                <td class="text-right font-semibold" :class="{'text-success': item.isPayment}">
                  {{ item.isPayment ? formatCurrency(item.amount) : '-' }}
                </td>
                <td class="text-center font-medium">
                   <div v-if="!item.isPayment">
                      <span v-if="item.isPaid" class="text-success flex items-center justify-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-success"></span> Ödendi
                      </span>
                      <span v-else class="text-warning flex items-center justify-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-warning animate-pulse"></span> Bekliyor
                      </span>
                   </div>
                   <span v-else class="opacity-30">-</span>
                </td>
              </tr>
              <tr v-if="reportItems.length === 0 && !loading">
                <td colspan="7" class="text-center py-20 text-gray-400">
                  <div class="flex flex-col items-center gap-2">
                    <span class="text-5xl opacity-20">📁</span>
                    <p class="italic">Kriterlere uygun kayıt bulunamadı.</p>
                  </div>
                </td>
              </tr>
              <tr v-if="loading">
                <td colspan="7" class="text-center py-20">
                  <span class="loading loading-dots loading-lg text-primary opacity-50"></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Control -->
        <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800/20 border-t dark:border-gray-700">
          <div class="flex items-center gap-4">
            <p class="text-xs sm:text-sm text-gray-500">
              Toplam <span class="font-medium text-gray-800 dark:text-gray-200">{{ reportItems.length }}</span> kayıttan 
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, reportItems.length) }}</span> arası
            </p>
            <select v-model="pageSize" class="select select-xs select-bordered bg-white dark:bg-gray-700 border-gray-300">
              <option :value="10">10 / sayfa</option>
              <option :value="25">25 / sayfa</option>
              <option :value="50">50 / sayfa</option>
            </select>
          </div>

          <div class="flex items-center gap-1">
            <button @click="currentPage--" :disabled="currentPage === 1" class="btn btn-xs sm:btn-sm btn-ghost border border-gray-300 dark:border-gray-600 disabled:opacity-30">
              Geri
            </button>
            <div class="flex items-center gap-1 px-2">
              <button 
                v-for="page in displayedPages" :key="page"
                @click="currentPage = page"
                class="btn btn-xs sm:btn-sm px-3"
                :class="currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'btn-ghost'"
              >
                {{ page }}
              </button>
            </div>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="btn btn-xs sm:btn-sm btn-ghost border border-gray-300 dark:border-gray-600 disabled:opacity-30">
              İleri
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import utilityDebtsService from '@/services/utilityDebtsService'
import paymentsService from '@/services/paymentsService'
import tenantsService from '@/services/tenantsService'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { arialBase64 } from '../reports/utils/pdfFonts'

const route = useRoute()
const authStore = useAuthStore()
const loading = ref(false)
const debtsData = ref([])
const paymentsData = ref([])
const tenantInfo = ref(null)

const filters = reactive({
  startDate: '',
  endDate: '',
  type: 'all',
  status: 'all' // 'all', 'unpaid', 'paid'
})

// Lifecycle
onMounted(async () => {
  // Deep-link / Bildirim filtrelerini oku
  if (route.query.type) filters.type = route.query.type
  if (route.query.status) filters.status = route.query.status
  if (route.query.startDate) filters.startDate = route.query.startDate
  if (route.query.endDate) filters.endDate = route.query.endDate

  await fetchData()
})

const fetchData = async () => {
  loading.value = true
  try {
    const tenantId = authStore.role.toLowerCase() === 'tenant' ? authStore.companyId : undefined

    const promises = [
      utilityDebtsService.getUtilityDebts({
        tenantId,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      }).then(d => { debtsData.value = d || [] }),
      paymentsService.getPayments({
        tenantId,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        excludeAdvanceUse: true
      }).then(p => { paymentsData.value = p || [] })
    ]

    if (tenantId && !tenantInfo.value) {
      promises.push(tenantsService.getTenantById(tenantId).then(t => { tenantInfo.value = t }))
    }

    await Promise.allSettled(promises)
  } catch (e) {
    console.error('Veri çekme hatası:', e)
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  filters.type = 'all'
  filters.status = 'all'
  filters.startDate = ''
  filters.endDate = ''
  fetchData()
}

// Data Processing
const reportItems = computed(() => {
  const items = []

  if (filters.type === 'all' || filters.type === 'debt') {
    debtsData.value.forEach(d => {
      const isPaid = d.status?.toLowerCase() === 'paid'
      if (filters.status === 'unpaid' && isPaid) return
      if (filters.status === 'paid' && !isPaid) return

      items.push({
        date: d.date || d.createdAt || d.dueDate,
        periodYear: d.periodYear,
        periodMonth: d.periodMonth,
        description: d.description || `${d.type === 'Electricity' ? 'Elektrik' : d.type === 'Water' ? 'Su' : 'Aidat'} faturası`,
        amount: Number(d.remainingAmount ?? d.amount ?? 0),
        isPayment: false,
        isPaid
      })
    })
  }

  if (filters.type === 'all' || filters.type === 'payment') {
    if (filters.status !== 'unpaid') {
      paymentsData.value.forEach(p => {
        items.push({
          date: p.paymentDate || p.createdAt || p.date,
          periodYear: p.periodYear,
          periodMonth: p.periodMonth,
          description: p.description || p.Type || 'Tahsilat kaydı',
          amount: Number(p.amount ?? 0),
          isPayment: true,
          isPaid: true
        })
      })
    }
  }

  return items.sort((a, b) => {
    const dA = a.date ? new Date(a.date) : new Date(0)
    const dB = b.date ? new Date(b.date) : new Date(0)
    return dB - dA
  })
})

// Güncel bakiye her zaman ham veriden hesaplanır — filtre etkilemez
const rawSummary = computed(() => {
  // Toplam tahakkuk: orijinal borç tutarlarının toplamı (kalan değil)
  const totalDebt = debtsData.value.reduce((s, d) => s + Number(d.amount ?? 0), 0)
  const totalPayment = paymentsData.value.reduce((s, p) => s + Number(p.amount ?? 0), 0)
  // Güncel bakiye: kalan borçlar - ödemeler
  const remainingDebt = debtsData.value.reduce((s, d) => s + Number(d.remainingAmount ?? d.amount ?? 0), 0)
  return { totalDebt, totalPayment, balance: totalPayment - remainingDebt }
})

// Tabloda gösterilen satırların toplamları (filtre uygulanmış)
const summary = computed(() => {
  const totalDebt = reportItems.value.filter(i => !i.isPayment).reduce((s, i) => s + i.amount, 0)
  const totalPayment = reportItems.value.filter(i => i.isPayment).reduce((s, i) => s + i.amount, 0)
  return { totalDebt, totalPayment, balance: rawSummary.value.balance }
})

/** Pagination */
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = computed(() => Math.ceil(reportItems.value.length / pageSize.value))

const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return reportItems.value.slice(start, end)
})

const displayedPages = computed(() => {
  const total = totalPages.value
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  
  const curr = currentPage.value
  let start = Math.max(1, curr - 2)
  let end = Math.min(total, curr + 2)
  
  if (curr <= 3) end = 5
  if (curr >= total - 2) start = total - 4
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

watch([filters, pageSize], () => {
  currentPage.value = 1
}, { deep: true })

// Helpers
const formatCurrency = (val) => 
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Number(val ?? 0))

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('tr-TR')
}

const formatPeriod = (year, month) => {
  if (!year || !month) return '-'
  return `${year}-${String(month).padStart(2, '0')}`
}

// EXPORTS
const exportToExcel = () => {
  const dateStr = new Date().toISOString().split('T')[0]
  const companyName = tenantInfo.value?.companyName || authStore.fullName

  const wb = XLSX.utils.book_new()
  const wsData = []

  // Başlık satırları
  wsData.push(['AKYILDIZ IS MERKEZI - KIRACI BORC VE ODEME EKSTRESI'])
  wsData.push([`Kiraci: ${companyName}`])
  wsData.push([`Olusturulma: ${new Date().toLocaleString('tr-TR')}`])
  wsData.push([]) // boş satır

  // Tablo başlığı
  wsData.push(['Tarih', 'Donem', 'Tur', 'Aciklama', 'Borc (-)', 'Odeme (+)', 'Durum'])

  // Veri satırları
  reportItems.value.forEach(i => {
    wsData.push([
      formatDate(i.date),
      formatPeriod(i.periodYear, i.periodMonth),
      i.isPayment ? 'Odeme' : 'Borc Tahakkuku',
      i.description,
      !i.isPayment ? i.amount : '',
      i.isPayment ? i.amount : '',
      i.isPayment ? 'Odendi' : (i.isPaid ? 'Odendi' : 'Bekliyor')
    ])
  })

  // Özet satırları
  wsData.push([])
  wsData.push(['', '', '', 'TOPLAM BORC TAHAKKUKU', rawSummary.value.totalDebt, '', ''])
  wsData.push(['', '', '', 'TOPLAM ODEME', '', rawSummary.value.totalPayment, ''])
  wsData.push(['', '', '', 'NET BAKIYE', '', rawSummary.value.balance, ''])

  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Sütun genişlikleri
  ws['!cols'] = [
    { wch: 14 }, { wch: 10 }, { wch: 18 }, { wch: 40 },
    { wch: 16 }, { wch: 16 }, { wch: 12 }
  ]

  // Başlık satırı birleştirme (A1:G1)
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }]

  XLSX.utils.book_append_sheet(wb, ws, 'Borc ve Odeme Ekstresi')
  XLSX.writeFile(wb, `Akyildiz_Ekstresi_${dateStr}.xlsx`)
}

const exportToPDF = () => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  doc.addFileToVFS('arial.ttf', arialBase64)
  doc.addFont('arial.ttf', 'Arial', 'normal')
  doc.setFont('Arial', 'normal')

  const pageW  = doc.internal.pageSize.getWidth()
  const pageH  = doc.internal.pageSize.getHeight()
  const margin = 14
  const genDate = new Date().toLocaleString('tr-TR')
  const dateStr = new Date().toISOString().split('T')[0]
  const companyName = tenantInfo.value?.companyName || authStore.fullName

  const NAVY  = [15,  52,  96]
  const GOLD  = [180, 145, 40]
  const WHITE = [255, 255, 255]
  const RED   = [200, 30,  30]
  const GREEN = [22,  140, 60]
  const GRAY  = [110, 110, 110]

  const drawPageHeader = (isFirstPage) => {
    doc.setFillColor(...NAVY)
    doc.rect(0, 0, pageW, isFirstPage ? 40 : 24, 'F')
    doc.setFillColor(...GOLD)
    doc.rect(0, isFirstPage ? 40 : 24, pageW, 1.5, 'F')

    doc.setTextColor(...WHITE)
    doc.setFontSize(isFirstPage ? 15 : 10)
    doc.text('AKYILDIZ IS MERKEZI', margin, isFirstPage ? 12 : 10)

    if (isFirstPage) {
      doc.setFontSize(8)
      doc.text('Yonetim ve Isletme Sistemi', margin, 20)
      doc.setFontSize(9.5)
      doc.text(`Kiraci: ${companyName}`, margin, 28)
      if (tenantInfo.value?.flats?.length) {
        doc.setFontSize(7.5)
        doc.text(`Unite: ${tenantInfo.value.flats.map(f => f.code).join(', ')}`, margin, 35)
      }
    }

    doc.setFontSize(isFirstPage ? 17 : 10)
    doc.text('KIRACI BORC VE ODEME EKSTRESI', pageW - margin, isFirstPage ? 15 : 10, { align: 'right' })

    if (isFirstPage) {
      doc.setFontSize(7.5)
      doc.text(`Olusturulma: ${genDate}`, pageW - margin, 24, { align: 'right' })
      const periStr =
        filters.startDate && filters.endDate
          ? `${formatDate(filters.startDate)} - ${formatDate(filters.endDate)}`
          : 'Tum Donemler'
      doc.text(`Donem: ${periStr}`, pageW - margin, 31, { align: 'right' })
    }
  }

  const drawPageFooter = (pageNum, pageTotal) => {
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

  drawPageHeader(true)

  // Özet kartlar
  const boxY = 46
  const boxH = 22
  const gap  = 5
  const boxW = (pageW - margin * 2 - gap * 2) / 3

  const drawCard = (x, label, value, bg, border, textColor) => {
    doc.setFillColor(...bg)
    doc.setDrawColor(...border)
    doc.setLineWidth(0.6)
    doc.roundedRect(x, boxY, boxW, boxH, 2, 2, 'FD')
    doc.setTextColor(...border)
    doc.setFontSize(6.5)
    doc.text(label, x + boxW / 2, boxY + 7, { align: 'center' })
    doc.setTextColor(...textColor)
    doc.setFontSize(12)
    doc.text(formatCurrency(value), x + boxW / 2, boxY + 17, { align: 'center' })
  }

  drawCard(margin,                      'TOPLAM BORC TAHAKKUKU',
    rawSummary.value.totalDebt,   [254,242,242], RED,   [160,20,20])
  drawCard(margin + boxW + gap,         'TOPLAM ODEME',
    rawSummary.value.totalPayment,[240,253,244], GREEN, [16,90,40])
  const isPos = rawSummary.value.balance >= 0
  drawCard(margin + (boxW + gap) * 2,   'GUNCEL BAKIYE',
    rawSummary.value.balance,
    isPos ? [239,246,255] : [254,242,242],
    isPos ? [37,99,235]   : RED,
    isPos ? [20,70,180]   : [160,20,20])

  doc.setTextColor(...NAVY)
  doc.setFontSize(8)
  doc.text('ISLEM DETAYLARI', margin, boxY + boxH + 8)
  doc.setDrawColor(...NAVY)
  doc.setLineWidth(0.4)
  doc.line(margin, boxY + boxH + 10, pageW - margin, boxY + boxH + 10)

  const rows = reportItems.value.map(i => ({
    date:    formatDate(i.date),
    period:  formatPeriod(i.periodYear, i.periodMonth),
    desc:    (i.description || '-').length > 48
               ? (i.description || '').substring(0, 48) + '...'
               : (i.description || '-'),
    debt:    !i.isPayment ? formatCurrency(i.amount) : '-',
    payment: i.isPayment  ? formatCurrency(i.amount) : '-',
    status:  i.isPayment  ? 'Odeme' : (i.isPaid ? 'Odendi' : 'Bekliyor')
  }))

  autoTable(doc, {
    columns: [
      { header: 'Tarih',     dataKey: 'date'    },
      { header: 'Donem',     dataKey: 'period'  },
      { header: 'Aciklama',  dataKey: 'desc'    },
      { header: 'Borc (-)',  dataKey: 'debt'    },
      { header: 'Odeme (+)', dataKey: 'payment' },
      { header: 'Durum',     dataKey: 'status'  },
    ],
    body: rows,
    startY: boxY + boxH + 13,
    margin: { left: margin, right: margin, bottom: 18 },
    styles: {
      fontSize: 7.5, font: 'Arial',
      cellPadding: { top: 2.5, right: 3, bottom: 2.5, left: 3 },
      textColor: [30, 30, 30], lineColor: [215, 220, 228], lineWidth: 0.1,
    },
    headStyles: {
      fillColor: NAVY, textColor: WHITE, fontSize: 7.5, fontStyle: 'normal',
      cellPadding: { top: 4, right: 3, bottom: 4, left: 3 }, halign: 'center',
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      date:    { halign: 'center', cellWidth: 24 },
      period:  { halign: 'center', cellWidth: 20 },
      desc:    { cellWidth: 'auto' },
      debt:    { halign: 'right', cellWidth: 32, textColor: RED },
      payment: { halign: 'right', cellWidth: 32, textColor: GREEN },
      status:  { halign: 'center', cellWidth: 26 },
    },
    didParseCell(data) {
      if (data.section !== 'body' || data.column.dataKey !== 'status') return
      if (data.cell.raw === 'Odeme') {
        data.cell.styles.textColor = [16, 100, 45]
        data.cell.styles.fillColor = [240, 253, 244]
      } else if (data.cell.raw === 'Bekliyor') {
        data.cell.styles.textColor = [146, 60, 14]
        data.cell.styles.fillColor = [255, 251, 235]
      }
    },
    willDrawPage(data) {
      if (data.pageNumber > 1) drawPageHeader(false)
    },
    didDrawPage(data) {
      drawPageFooter(data.pageNumber, data.pageCount ?? doc.internal.getNumberOfPages())
    }
  })

  // Son sayfada özet kutusu
  const finalY = doc.lastAutoTable.finalY + 6
  if (finalY < pageH - 38) {
    const tbW = 80
    const tbX = pageW - margin - tbW

    doc.setFillColor(...NAVY)
    doc.roundedRect(tbX, finalY, tbW, 30, 2, 2, 'F')
    doc.setTextColor(...GOLD)
    doc.setFontSize(8)
    doc.text('EKSTRESI OZETI', tbX + tbW / 2, finalY + 8, { align: 'center' })
    doc.setDrawColor(...GOLD)
    doc.setLineWidth(0.4)
    doc.line(tbX + 5, finalY + 10, tbX + tbW - 5, finalY + 10)
    doc.setTextColor(...WHITE)
    doc.setFontSize(7.5)
    doc.text('Toplam Borc:',  tbX + 5, finalY + 17)
    doc.text(formatCurrency(rawSummary.value.totalDebt), tbX + tbW - 5, finalY + 17, { align: 'right' })
    doc.text('Toplam Odeme:', tbX + 5, finalY + 23)
    doc.text(formatCurrency(rawSummary.value.totalPayment), tbX + tbW - 5, finalY + 23, { align: 'right' })
    doc.setDrawColor(200, 200, 200)
    doc.line(tbX + 5, finalY + 25, tbX + tbW - 5, finalY + 25)
    doc.setTextColor(...GOLD)
    doc.setFontSize(8.5)
    doc.text('Net Bakiye:', tbX + 5, finalY + 30)
    doc.text(formatCurrency(rawSummary.value.balance), tbX + tbW - 5, finalY + 30, { align: 'right' })
  }

  doc.save(`Akyildiz_Ekstresi_${dateStr}.pdf`)
}
</script>

<style scoped>
.table th {
  @apply text-[11px] uppercase tracking-wider font-bold;
}
</style>
