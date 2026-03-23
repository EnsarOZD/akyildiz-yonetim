<template>
  <div class="p-4 sm:p-6 min-h-screen pb-24 md:pb-6">

    <!-- Sayfa Başlığı -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div>
        <h1 class="page-title">Ödemelerim ve Borçlarım</h1>
        <p v-if="tenantInfo?.companyName || authStore.companyName" class="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
          {{ tenantInfo?.companyName || authStore.companyName }}
          <span v-if="tenantInfo?.flats && tenantInfo.flats.length" class="text-slate-400 font-normal">
            — Ünite: {{ tenantInfo.flats.map(f => f.code).join(', ') }}
          </span>
        </p>
        <p class="page-subtitle">Geçmiş ödemelerinizi ve güncel borç durumunuzu takip edin</p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button @click="exportToExcel" :disabled="loading || reportItems.length === 0" class="btn btn-sm btn-ghost border border-slate-300 dark:border-slate-600">
          <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          </svg>
          Excel
        </button>
        <button @click="exportToPDF" :disabled="loading || reportItems.length === 0" class="btn btn-sm btn-ghost border border-slate-300 dark:border-slate-600">
          <svg class="w-4 h-4 text-rose-500 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
          PDF
        </button>
        <button @click="fetchData" :disabled="loading" class="btn btn-sm btn-primary">
          <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
          </svg>
          <span v-else class="loading loading-spinner loading-xs"></span>
          Sorgula
        </button>
      </div>
    </div>

    <!-- Filtreler -->
    <div class="app-card mb-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="form-control">
          <label class="label py-1"><span class="label-text text-xs font-semibold uppercase tracking-wide">Başlangıç</span></label>
          <input v-model="filters.startDate" type="date" class="input input-sm input-bordered w-full" />
        </div>
        <div class="form-control">
          <label class="label py-1"><span class="label-text text-xs font-semibold uppercase tracking-wide">Bitiş</span></label>
          <input v-model="filters.endDate" type="date" class="input input-sm input-bordered w-full" />
        </div>
        <div class="form-control">
          <label class="label py-1"><span class="label-text text-xs font-semibold uppercase tracking-wide">İşlem Tipi</span></label>
          <select v-model="filters.type" class="select select-sm select-bordered w-full">
            <option value="all">Tümü (Borç & Ödeme)</option>
            <option value="debt">Sadece Borçlar</option>
            <option value="payment">Sadece Ödemeler</option>
          </select>
        </div>
        <div class="form-control">
          <label class="label py-1"><span class="label-text text-xs font-semibold uppercase tracking-wide">Ödeme Durumu</span></label>
          <select v-model="filters.status" class="select select-sm select-bordered w-full" :disabled="filters.type === 'payment'">
            <option value="all">Tümü</option>
            <option value="unpaid">Ödenmeyenler</option>
            <option value="paid">Ödenenler</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
        <button @click="clearFilters" class="btn btn-ghost btn-xs text-slate-400">Filtreleri Temizle</button>
      </div>
    </div>

    <!-- Özet Kartları -->
    <div v-if="reportItems.length > 0 || !loading" class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
      <div class="app-card flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-none mb-1">Toplam Borç Tahakkuku</p>
          <p class="text-base font-bold text-slate-800 dark:text-slate-100 leading-none">{{ formatCurrency(rawSummary.totalDebt) }}</p>
        </div>
      </div>
      <div class="app-card flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-none mb-1">Toplam Yapılan Ödeme</p>
          <p class="text-base font-bold text-slate-800 dark:text-slate-100 leading-none">{{ formatCurrency(rawSummary.totalPayment) }}</p>
        </div>
      </div>
      <div class="app-card flex items-center gap-3">
        <div :class="[
          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
          rawSummary.balance >= 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-red-100 dark:bg-red-900/30 text-red-500'
        ]">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-none mb-1">Güncel Bakiye</p>
          <p :class="[
            'text-base font-bold leading-none',
            rawSummary.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-500'
          ]">
            {{ formatCurrency(Math.abs(rawSummary.balance)) }}
            <span class="text-xs font-medium opacity-70">{{ rawSummary.balance < 0 ? '(Borçlu)' : '(Dengede)' }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Tablo Kartı -->
    <div class="app-card !p-0">
      <!-- Tablo Başlığı -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">İşlem Listesi</span>
          <span class="text-xs text-slate-400">{{ reportItems.length }} kayıt</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400 hidden sm:block">Sayfa başına</span>
          <select v-model="pageSize" class="select select-xs select-bordered">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>

      <!-- Tablo -->
      <div class="overflow-x-auto">
        <table class="table table-sm w-full" id="report-table">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              <th class="font-semibold">Tarih</th>
              <th class="font-semibold">Dönem</th>
              <th class="font-semibold">İşlem</th>
              <th class="font-semibold">Açıklama</th>
              <th class="font-semibold">Fatura No</th>
              <th class="font-semibold text-right">Borç (−)</th>
              <th class="font-semibold text-right">Ödeme (+)</th>
              <th class="font-semibold text-center">Durum</th>
              <th class="font-semibold text-center">Vade Tarihi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
            <tr v-if="loading">
              <td colspan="9" class="text-center py-10">
                <span class="loading loading-spinner loading-md text-slate-400"></span>
              </td>
            </tr>
            <tr v-else-if="reportItems.length === 0">
              <td colspan="9" class="py-12">
                <div class="text-center">
                  <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Kayıt bulunamadı</p>
                  <p class="text-xs text-slate-400 mt-1">Farklı filtre kriterleri deneyin</p>
                </div>
              </td>
            </tr>
            <tr
              v-else
              v-for="(item, idx) in paginatedReports"
              :key="idx"
              class="table-row-hover"
            >
              <td class="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">{{ formatDate(item.date) }}</td>
              <td class="whitespace-nowrap text-xs font-mono text-slate-500 dark:text-slate-400">{{ formatPeriod(item.periodYear, item.periodMonth) }}</td>
              <td>
                <span :class="[
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                  item.isPayment ? 'badge-active' : 'badge-overdue'
                ]">
                  {{ item.isPayment ? 'Ödeme' : 'Borç' }}
                </span>
              </td>
              <td class="max-w-[200px] truncate text-xs text-slate-600 dark:text-slate-300">{{ item.description }}</td>
              <td class="text-xs font-mono text-slate-400">{{ item.invoiceNumber || '—' }}</td>
              <td class="text-right text-sm font-semibold" :class="!item.isPayment ? 'text-red-500' : 'text-slate-300 dark:text-slate-600'">
                {{ !item.isPayment ? formatCurrency(item.amount) : '—' }}
              </td>
              <td class="text-right text-sm font-semibold" :class="item.isPayment ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'">
                {{ item.isPayment ? formatCurrency(item.amount) : '—' }}
              </td>
              <td class="text-center">
                <span v-if="!item.isPayment" :class="[
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                  item.isPaid ? 'badge-active' : 'badge-pending'
                ]">
                  {{ item.isPaid ? 'Ödendi' : 'Bekliyor' }}
                </span>
                <span v-else class="text-slate-300 dark:text-slate-600 text-xs">—</span>
              </td>
              <td class="whitespace-nowrap text-xs text-center" :class="
                !item.lastPaymentDate ? 'text-slate-300 dark:text-slate-600' :
                (!item.isPaid && new Date(item.lastPaymentDate) < new Date()) ? 'text-red-500 font-medium' :
                'text-slate-500 dark:text-slate-400'
              ">
                {{ item.lastPaymentDate ? formatDate(item.lastPaymentDate) : '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 dark:border-slate-700">
        <p class="text-xs text-slate-400">
          {{ reportItems.length }} kayıttan
          {{ (currentPage - 1) * pageSize + 1 }}–{{ Math.min(currentPage * pageSize, reportItems.length) }} arası
        </p>
        <div class="flex items-center gap-1">
          <button @click="currentPage = 1" :disabled="currentPage === 1" class="btn btn-ghost btn-xs" aria-label="İlk">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>
          </button>
          <button @click="currentPage--" :disabled="currentPage === 1" class="btn btn-ghost btn-xs">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'btn btn-xs',
              currentPage === page ? 'btn-primary' : 'btn-ghost text-slate-500 dark:text-slate-400'
            ]"
          >
            {{ page }}
          </button>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="btn btn-ghost btn-xs">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
          <button @click="currentPage = totalPages" :disabled="currentPage === totalPages" class="btn btn-ghost btn-xs" aria-label="Son">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/application/stores/auth'
import utilityDebtsService from '@/infrastructure/services/utilityDebtsService'
import paymentsService from '@/infrastructure/services/paymentsService'
import tenantsService from '@/infrastructure/services/tenantsService'

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
  status: 'all'
})

// Lifecycle
onMounted(async () => {
  if (route.query.type) filters.type = route.query.type
  if (route.query.status) filters.status = route.query.status
  if (route.query.startDate) filters.startDate = route.query.startDate
  if (route.query.endDate) filters.endDate = route.query.endDate
  await fetchData()
})

const fetchData = async () => {
  loading.value = true
  try {
    const tenantId = authStore.role?.toLowerCase() === 'tenant' ? authStore.companyId : undefined

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
        date: d.dueDate || d.createdAt || d.date,
        periodYear: d.periodYear,
        periodMonth: d.periodMonth,
        description: d.description || `${d.type === 'Electricity' ? 'Elektrik' : d.type === 'Water' ? 'Su' : 'Aidat'} faturası`,
        invoiceNumber: d.invoiceNumber || null,
        amount: Number(d.amount ?? 0),
        isPayment: false,
        isPaid,
        lastPaymentDate: d.dueDate || null
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
          invoiceNumber: p.receiptNumber || null,
          amount: Number(p.amount ?? 0),
          isPayment: true,
          isPaid: true,
          lastPaymentDate: null
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

// Özet kartlar ve export için ham veriden hesapla (filtreden bağımsız)
const rawSummary = computed(() => {
  const totalDebt = debtsData.value.reduce((s, d) => s + Number(d.amount ?? 0), 0)
  const totalPayment = paymentsData.value.reduce((s, p) => s + Number(p.amount ?? 0), 0)
  return { totalDebt, totalPayment, balance: totalPayment - totalDebt }
})

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = computed(() => Math.ceil(reportItems.value.length / pageSize.value))

const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return reportItems.value.slice(start, start + pageSize.value)
})

const displayedPages = computed(() => {
  const total = totalPages.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const curr = currentPage.value
  let start = Math.max(1, curr - 3)
  let end = Math.min(total, curr + 3)
  if (curr <= 4) end = 7
  if (curr >= total - 3) start = total - 6
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

watch([filters, pageSize], () => { currentPage.value = 1 }, { deep: true })

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
const exportToExcel = async () => {
  const XLSX = await import('xlsx')
  const dateStr = new Date().toISOString().split('T')[0]
  const companyName = tenantInfo.value?.companyName || authStore.fullName

  const wb = XLSX.utils.book_new()
  const wsData = []

  wsData.push(['AKYILDIZ IS MERKEZI - KIRACI BORC VE ODEME EKSTRESI'])
  wsData.push([`Kiraci: ${companyName}`])
  wsData.push([`Olusturulma: ${new Date().toLocaleString('tr-TR')}`])
  wsData.push([])
  wsData.push(['Tarih', 'Donem', 'Tur', 'Aciklama', 'Fatura No', 'Borc (-)', 'Odeme (+)', 'Durum', 'Vade Tarihi'])

  reportItems.value.forEach(i => {
    wsData.push([
      formatDate(i.date),
      formatPeriod(i.periodYear, i.periodMonth),
      i.isPayment ? 'Odeme' : 'Borc Tahakkuku',
      i.description,
      i.invoiceNumber || '',
      !i.isPayment ? i.amount : '',
      i.isPayment ? i.amount : '',
      i.isPayment ? 'Odendi' : (i.isPaid ? 'Odendi' : 'Bekliyor'),
      i.lastPaymentDate ? formatDate(i.lastPaymentDate) : ''
    ])
  })

  wsData.push([])
  wsData.push(['', '', '', 'TOPLAM BORC TAHAKKUKU', '', rawSummary.value.totalDebt, '', '', ''])
  wsData.push(['', '', '', 'TOPLAM ODEME', '', '', rawSummary.value.totalPayment, '', ''])
  wsData.push(['', '', '', 'NET BAKIYE', '', '', rawSummary.value.balance, '', ''])

  const ws = XLSX.utils.aoa_to_sheet(wsData)
  ws['!cols'] = [{ wch: 14 }, { wch: 10 }, { wch: 18 }, { wch: 40 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 12 }, { wch: 14 }]
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }]
  XLSX.utils.book_append_sheet(wb, ws, 'Borc ve Odeme Ekstresi')
  XLSX.writeFile(wb, `Akyildiz_Ekstresi_${dateStr}.xlsx`)
}

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
      const periStr = filters.startDate && filters.endDate
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

  drawCard(margin,                      'TOPLAM BORC TAHAKKUKU',  rawSummary.value.totalDebt,    [254,242,242], RED,   [160,20,20])
  drawCard(margin + boxW + gap,         'TOPLAM ODEME',           rawSummary.value.totalPayment, [240,253,244], GREEN, [16,90,40])
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
    date:     formatDate(i.date),
    period:   formatPeriod(i.periodYear, i.periodMonth),
    desc:     (i.description || '-').length > 42 ? (i.description || '').substring(0, 42) + '...' : (i.description || '-'),
    invoice:  i.invoiceNumber || '-',
    debt:     !i.isPayment ? formatCurrency(i.amount) : '-',
    payment:  i.isPayment  ? formatCurrency(i.amount) : '-',
    status:   i.isPayment  ? 'Odeme' : (i.isPaid ? 'Odendi' : 'Bekliyor'),
    lastPaid: i.lastPaymentDate ? formatDate(i.lastPaymentDate) : '-'
  }))

  let pdfTotalPages = 1

  autoTable(doc, {
    columns: [
      { header: 'Tarih',      dataKey: 'date'     },
      { header: 'Donem',      dataKey: 'period'   },
      { header: 'Aciklama',   dataKey: 'desc'     },
      { header: 'Fatura No',  dataKey: 'invoice'  },
      { header: 'Borc (-)',   dataKey: 'debt'     },
      { header: 'Odeme (+)',  dataKey: 'payment'  },
      { header: 'Durum',      dataKey: 'status'   },
      { header: 'Vade Tarihi', dataKey: 'lastPaid' },
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
      date:     { halign: 'center', cellWidth: 22 },
      period:   { halign: 'center', cellWidth: 18 },
      desc:     { cellWidth: 'auto' },
      invoice:  { halign: 'center', cellWidth: 22, fontSize: 7 },
      debt:     { halign: 'right', cellWidth: 26, textColor: RED },
      payment:  { halign: 'right', cellWidth: 26, textColor: GREEN },
      status:   { halign: 'center', cellWidth: 20 },
      lastPaid: { halign: 'center', cellWidth: 22, textColor: [16, 100, 45] },
    },
    didParseCell(data) {
      if (data.section !== 'body' || data.column.dataKey !== 'status') return
      if (data.cell.raw === 'Odeme' || data.cell.raw === 'Odendi') {
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
      pdfTotalPages = data.pageCount ?? doc.internal.getNumberOfPages()
      drawPageFooter(data.pageNumber, pdfTotalPages)
    }
  })

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
  @apply text-xs uppercase tracking-wider;
}
</style>
