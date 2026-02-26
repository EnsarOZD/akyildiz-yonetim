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
          <p class="text-gray-500 dark:text-gray-400 mt-1">Geçmiş ödemelerinizi ve güncel borç durumunuzu takip edin</p>
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
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <th>Tarih</th>
                <th>Dönem</th>
                <th>İşlem Türü</th>
                <th>Açıklama</th>
                <th class="text-right">Borç(-)</th>
                <th class="text-right">Ödeme(+)</th>
                <th class="text-center">Durum</th>
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
import { useAuthStore } from '@/stores/auth'
import utilityDebtsService from '@/services/utilityDebtsService'
import paymentsService from '@/services/paymentsService'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { arialBase64 } from '../reports/utils/pdfFonts'

const authStore = useAuthStore()
const loading = ref(false)
const debtsData = ref([])
const paymentsData = ref([])

const filters = reactive({
  startDate: '',
  endDate: '',
  type: 'all'
})

// Lifecycle
onMounted(async () => {
  await fetchData()
})

const fetchData = async () => {
  loading.value = true
  try {
    // Kiracı ID'sini auth store'dan alıyoruz
    const tenantId = authStore.role.toLowerCase() === 'tenant' ? authStore.companyId : undefined
    
    const [debts, payments] = await Promise.all([
      utilityDebtsService.getUtilityDebts({
        tenantId,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      }),
      paymentsService.getPayments({
        tenantId,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        excludeAdvanceUse: true
      })
    ])
    
    debtsData.value = debts || []
    paymentsData.value = payments || []
  } catch (e) {
    console.error('Veri çekme hatası:', e)
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  filters.type = 'all'
  filters.startDate = ''
  filters.endDate = ''
  fetchData()
}

// Data Processing
const reportItems = computed(() => {
  const items = []
  
  if (filters.type === 'all' || filters.type === 'debt') {
    debtsData.value.forEach(d => {
      items.push({
        date: d.date || d.createdAt || d.dueDate,
        periodYear: d.periodYear,
        periodMonth: d.periodMonth,
        description: d.description || `${d.type === 'Electricity' ? 'Elektrik' : d.type === 'Water' ? 'Su' : 'Aidat'} faturası`,
        amount: Number(d.amount ?? 0),
        isPayment: false,
        isPaid: d.status === 'Paid'
      })
    })
  }
  
  if (filters.type === 'all' || filters.type === 'payment') {
    paymentsData.value.forEach(p => {
      items.push({
        date: p.paymentDate,
        periodYear: p.periodYear,
        periodMonth: p.periodMonth,
        description: p.description || p.Type || 'Tahsilat kaydı',
        amount: Number(p.amount ?? 0),
        isPayment: true,
        isPaid: true
      })
    })
  }
  
  return items.sort((a, b) => {
    const pA = (a.periodYear || 0) * 100 + (a.periodMonth || 0)
    const pB = (b.periodYear || 0) * 100 + (b.periodMonth || 0)
    if (pA !== pB) return pB - pA
    return new Date(b.date) - new Date(a.date)
  })
})

const summary = computed(() => {
  const totalDebt = reportItems.value.filter(i => !i.isPayment).reduce((s, i) => s + i.amount, 0)
  const totalPayment = reportItems.value.filter(i => i.isPayment).reduce((s, i) => s + i.amount, 0)
  return {
    totalDebt,
    totalPayment,
    balance: totalPayment - totalDebt
  }
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
  const data = reportItems.value.map(i => ({
    'Tarih': formatDate(i.date),
    'Dönem': formatPeriod(i.periodYear, i.periodMonth),
    'Tür': i.isPayment ? 'Ödeme' : 'Borç Tahakkuku',
    'Açıklama': i.description,
    'Borç (-)': !i.isPayment ? i.amount : 0,
    'Ödeme (+)': i.isPayment ? i.amount : 0,
    'Durum': i.isPaid ? 'Ödendi' : 'Bekliyor'
  }))
  
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Odemelerim ve Borclarim")
  XLSX.writeFile(wb, `Akyildiz_Finansal_Durum_${new Date().toISOString().split('T')[0]}.xlsx`)
}

const exportToPDF = () => {
  const doc = new jsPDF()
  doc.addFileToVFS('arial.ttf', arialBase64)
  doc.addFont('arial.ttf', 'Arial', 'normal')
  doc.setFont('Arial')
  
  doc.setFontSize(18)
  doc.text("AKYILDIZ IS MERKEZI - Odemelerim ve Borclarim", 15, 20)
  
  doc.setFontSize(10)
  doc.text(`Kiracı: ${authStore.fullName}`, 15, 28)
  doc.text(`Rapor Tarihi: ${new Date().toLocaleString('tr-TR')}`, 15, 34)
  
  const columns = [
    { header: 'Tarih', dataKey: 'date' },
    { header: 'Donem', dataKey: 'period' },
    { header: 'Aciklama', dataKey: 'desc' },
    { header: 'Borc', dataKey: 'debt' },
    { header: 'Odeme', dataKey: 'payment' },
    { header: 'Durum', dataKey: 'status' }
  ]
  
  const rows = reportItems.value.map(i => ({
    date: formatDate(i.date),
    period: formatPeriod(i.periodYear, i.periodMonth),
    desc: i.description,
    debt: !i.isPayment ? formatCurrency(i.amount) : '-',
    payment: i.isPayment ? formatCurrency(i.amount) : '-',
    status: i.isPayment ? '-' : (i.isPaid ? 'Odendi' : 'Bekliyor')
  }))
  
  autoTable(doc, {
    columns,
    body: rows,
    startY: 40,
    styles: { fontSize: 8, font: 'Arial' },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'normal' },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  })
  
  const finalY = doc.lastAutoTable.finalY + 10
  doc.setFontSize(11)
  doc.text(`Toplam Borc: ${formatCurrency(summary.value.totalDebt)}`, 140, finalY)
  doc.text(`Toplam Odeme: ${formatCurrency(summary.value.totalPayment)}`, 140, finalY + 7)
  doc.text(`NET BAKIYE: ${formatCurrency(Math.abs(summary.value.balance))} ${summary.value.balance < 0 ? '(Borclu)' : '(Alacakli)'}`, 140, finalY + 14)
  
  doc.save(`Akyildiz_Finansal_Extre_${new Date().getTime()}.pdf`)
}
</script>

<style scoped>
.table th {
  @apply text-[11px] uppercase tracking-wider font-bold;
}
</style>
