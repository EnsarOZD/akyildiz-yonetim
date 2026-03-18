<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header Area -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <span class="text-4xl">📊</span>
            Finansal Raporlama
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Borç ve tahsilat kayıtlarını listeleyin ve dışa aktarın</p>
        </div>
        <div class="flex gap-2">
          <button @click="exportToExcel" class="btn btn-success text-white shadow-md normal-case">
            <span>📗 Excel'e Al</span>
          </button>
          <button @click="exportToPDF" class="btn btn-error text-white shadow-md normal-case">
            <span>📕 PDF'e Al</span>
          </button>
        </div>
      </div>

      <!-- Filters Card -->
      <div class="card bg-white dark:bg-gray-800 shadow-xl mb-8 overflow-visible">
        <div class="card-body p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Tarih Aralığı -->
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Başlangıç Tarihi</span></label>
              <input v-model="filters.startDate" type="date" class="input input-bordered w-full bg-white dark:bg-gray-700" />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Bitiş Tarihi</span></label>
              <input v-model="filters.endDate" type="date" class="input input-bordered w-full bg-white dark:bg-gray-700" />
            </div>

            <!-- Kiracı Seçimi -->
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Kiracı</span></label>
              <select v-model="filters.tenantId" class="select select-bordered w-full bg-white dark:bg-gray-700">
                <option value="">Tüm Kiracılar</option>
                <option v-for="t in tenants" :key="t.id" :value="t.id">{{ t.companyName }}</option>
              </select>
            </div>

            <!-- Mal Sahibi Seçimi -->
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Mal Sahibi</span></label>
              <select v-model="filters.ownerId" class="select select-bordered w-full bg-white dark:bg-gray-700">
                <option value="">Tüm Mal Sahipleri</option>
                <option v-for="o in owners" :key="o.id" :value="o.id">{{ o.firstName }} {{ o.lastName }}</option>
              </select>
            </div>

            <!-- İşlem Tipi (Borç/Tahsilat) -->
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">İşlem Tipi</span></label>
              <select v-model="filters.type" class="select select-bordered w-full bg-white dark:bg-gray-700">
                <option value="all">Tümü (Borç & Tahsilat)</option>
                <option value="debt">Sadece Borçlar</option>
                <option value="payment">Sadece Tahsilatlar</option>
              </select>
            </div>

            <!-- Borç Kategorisi -->
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Borç Kategorisi</span></label>
              <select v-model="filters.utilityType" class="select select-bordered w-full bg-white dark:bg-gray-700">
                <option value="">Tümü (Aidat, Elektrik, Su)</option>
                <option value="Aidat">Aidat</option>
                <option value="Electricity">Elektrik</option>
                <option value="Water">Su</option>
              </select>
            </div>
          </div>
          
          <div class="flex justify-end mt-4 pt-4 border-t dark:border-gray-700">
            <button @click="clearFilters" class="btn btn-ghost btn-sm">Filtreleri Temizle</button>
            <button @click="fetchData" class="btn btn-primary btn-sm ml-2" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner loading-xs"></span>
              Sorgula
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div v-if="reportItems.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card bg-error/10 text-error-content shadow-sm p-4 border-l-4 border-error">
          <div class="text-xs font-bold uppercase tracking-wider opacity-70">Toplam Tahakkuk (Borç)</div>
          <div class="text-2xl font-bold">{{ formatCurrency(summary.totalDebt) }}</div>
        </div>
        <div class="card bg-success/10 text-success-content shadow-sm p-4 border-l-4 border-success">
          <div class="text-xs font-bold uppercase tracking-wider opacity-70">Toplam Tahsilat (Ödeme)</div>
          <div class="text-2xl font-bold">{{ formatCurrency(summary.totalPayment) }}</div>
        </div>
        <div class="card bg-primary/10 text-primary-content shadow-sm p-4 border-l-4 border-primary">
          <div class="text-xs font-bold uppercase tracking-wider opacity-70">Net Bakiye</div>
          <div class="text-2xl font-bold">{{ formatCurrency(summary.balance) }}</div>
        </div>
      </div>

      <!-- Main Table Card -->
      <div class="card bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="table table-zebra w-full" id="report-table">
            <thead>
              <tr class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <th scope="col">Tarih</th>
                <th scope="col">Dönem</th>
                <th scope="col">Kiracı / Ünite</th>
                <th scope="col">İşlem</th>
                <th scope="col">Açıklama</th>
                <th scope="col">Fatura No</th>
                <th scope="col" class="text-right">Borç(-)</th>
                <th scope="col" class="text-right">Alacak(+)</th>
                <th scope="col" class="text-center">Durum</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in paginatedReports" :key="idx" class="hover">
                <td class="whitespace-nowrap">{{ formatDate(item.date) }}</td>
                <td class="whitespace-nowrap font-mono text-sm">{{ formatPeriod(item.periodYear, item.periodMonth) }}</td>
                <td>
                  <div class="font-bold">{{ item.tenantName }}</div>
                  <div class="text-xs opacity-60">{{ item.unitCode }}</div>
                </td>
                <td>
                  <span :class="['badge badge-sm font-semibold', item.isPayment ? 'badge-success' : 'badge-error']">
                    {{ item.isPayment ? 'Tahsilat' : 'Borç' }}
                  </span>
                </td>
                <td class="max-w-xs truncate">{{ item.description }}</td>
                <td class="text-xs font-mono text-gray-500 dark:text-gray-400">{{ item.invoiceNumber || '-' }}</td>
                <td class="text-right font-semibold" :class="{'text-error': !item.isPayment}">
                  {{ !item.isPayment ? formatCurrency(item.amount) : '-' }}
                </td>
                <td class="text-right font-semibold" :class="{'text-success': item.isPayment}">
                  {{ item.isPayment ? formatCurrency(item.amount) : '-' }}
                </td>
                <td class="text-center">
                   <div v-if="!item.isPayment">
                      <span v-if="item.isPaid" class="badge badge-success badge-sm">Ödendi</span>
                      <span v-else class="badge badge-warning badge-sm">Bekliyor</span>
                   </div>
                   <span v-else>-</span>
                </td>
              </tr>
              <tr v-if="reportItems.length === 0">
                <td colspan="9" class="text-center py-12 text-gray-500 italic">
                  {{ loading ? 'Veriler yükleniyor...' : 'Kritere uygun kayıt bulunamadı.' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Control -->
        <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700">
          <div class="flex items-center gap-4">
            <p class="text-sm text-gray-500">
              Toplam <span class="font-medium">{{ reportItems.length }}</span> kayıttan 
              <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> - 
              <span class="font-medium">{{ Math.min(currentPage * pageSize, reportItems.length) }}</span> arası gösteriliyor
            </p>
            <select v-model="pageSize" class="select select-xs select-bordered bg-white dark:bg-gray-700">
              <option :value="10">10 / sayfa</option>
              <option :value="25">25 / sayfa</option>
              <option :value="50">50 / sayfa</option>
              <option :value="100">100 / sayfa</option>
            </select>
          </div>

          <div class="flex items-center gap-1">
            <button 
              @click="currentPage = 1" 
              :disabled="currentPage === 1"
              class="btn btn-sm btn-ghost"
              aria-label="İlk Sayfa"
            >
              ««
            </button>
            <button 
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="btn btn-sm btn-ghost"
            >
              Önceki
            </button>
            
            <div class="flex items-center gap-1">
              <button 
                v-for="page in displayedPages" 
                :key="page"
                @click="currentPage = page"
                class="btn btn-sm"
                :class="currentPage === page ? 'bg-blue-600 text-white shadow-sm' : 'btn-ghost text-gray-700 dark:text-gray-300'"
              >
                {{ page }}
              </button>
            </div>

            <button 
              @click="currentPage++" 
              :disabled="currentPage === totalPages"
              class="btn btn-sm btn-ghost"
            >
              Sonraki
            </button>
            <button 
              @click="currentPage = totalPages" 
              :disabled="currentPage === totalPages"
              class="btn btn-sm btn-ghost"
              aria-label="Son Sayfa"
            >
              »»
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import tenantsService from '@/services/tenantsService'
import ownersService from '@/services/ownersService'
import utilityDebtsService from '@/services/utilityDebtsService'
import paymentsService from '@/services/paymentsService'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { arialBase64 } from './utils/pdfFonts'

// State
const loading = ref(false)
const tenants = ref([])
const owners = ref([])
const debtsData = ref([])
const paymentsData = ref([])
const filters = reactive({
  startDate: '',
  endDate: '',
  tenantId: '',
  ownerId: '',
  type: 'all',
  utilityType: ''
})

// Lifecycle
onMounted(async () => {
  // Varsayılan olarak tüm zamanlar (boş bırakıldı)
  filters.startDate = ''
  filters.endDate = ''
  
  await Promise.all([
    fetchTenants(),
    fetchOwners()
  ])
  await fetchData()
})

const fetchOwners = async () => {
  try {
    const res = await ownersService.getOwners()
    owners.value = Array.isArray(res) ? res : (res?.items || [])
  } catch (e) {
    console.error('Mal sahipleri yüklenemedi:', e)
  }
}

const fetchTenants = async () => {
  try {
    const res = await tenantsService.getTenants()
    tenants.value = Array.isArray(res) ? res : (res?.items || [])
  } catch (e) {
    console.error('Kiracılar yüklenemedi:', e)
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const [debts, payments] = await Promise.all([
      utilityDebtsService.getUtilityDebts({
        tenantId: filters.tenantId || undefined,
        ownerId: filters.ownerId || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        type: filters.utilityType || undefined
      }),
      paymentsService.getPayments({
        tenantId: filters.tenantId || undefined,
        ownerId: filters.ownerId || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        utilityType: filters.utilityType || undefined,
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
  filters.tenantId = ''
  filters.ownerId = ''
  filters.type = 'all'
  filters.utilityType = ''
  filters.startDate = ''
  filters.endDate = ''
  fetchData()
}

// Data Processing
const reportItems = computed(() => {
  const items = []
  
  // Borçlar (Expense context)
  if (filters.type === 'all' || filters.type === 'debt') {
    debtsData.value.forEach(d => {
      const owner = owners.value.find(o => o.id === d.ownerId)
      items.push({
        date: d.date || d.createdAt || d.dueDate,
        periodYear: d.periodYear,
        periodMonth: d.periodMonth,
        tenantName: d.tenantName || (owner ? `${owner.firstName} ${owner.lastName} (M. Sahibi)` : 'Bilinmiyor'),
        unitCode: d.flatInfo || d.unit || '-',
        description: d.description || `${d.type === 'Electricity' ? 'Elektrik' : d.type === 'Water' ? 'Su' : 'Aidat'} faturası`,
        invoiceNumber: d.invoiceNumber || null,
        amount: Number(d.amount ?? 0),
        isPayment: false,
        isPaid: d.status === 'Paid'
      })
    })
  }
  
  // Ödemeler (Income context)
  if (filters.type === 'all' || filters.type === 'payment') {
    paymentsData.value.forEach(p => {
      items.push({
        date: p.paymentDate || p.createdAt || p.date,
        periodYear: p.periodYear,
        periodMonth: p.periodMonth,
        tenantName: p.tenantName || p.ownerName || 'Bilinmiyor',
        unitCode: p.flatInfo || '-',
        description: p.description || p.Type || 'Tahsilat kaydı',
        invoiceNumber: p.receiptNumber || null,
        amount: Number(p.amount ?? 0),
        isPayment: true,
        isPaid: true
      })
    })
  }
  
  // Sıralama: Dönem (Yıl-Ay) -> Tarih (Giriş sırası)
  // Sıralama: Sadece Tarih (Yeniden Eskiye - Descending)
  return items.sort((a, b) => {
    const dA = a.date ? new Date(a.date) : new Date(0)
    const dB = b.date ? new Date(b.date) : new Date(0)
    return dB - dA
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

/** Sayfalama Mantığı */
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
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  
  const curr = currentPage.value
  let start = Math.max(1, curr - 3)
  let end = Math.min(total, curr + 3)
  
  if (curr <= 4) end = 7
  if (curr >= total - 3) start = total - 6
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// Filtreler veya sayfa boyutu değişince ilk sayfaya dön
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

// EXPORT FUNCTIONS
const exportToExcel = () => {
  const data = reportItems.value.map(i => ({
    'Tarih': formatDate(i.date),
    'Dönem': formatPeriod(i.periodYear, i.periodMonth),
    'Kiracı': i.tenantName,
    'Ünite': i.unitCode,
    'Tür': i.isPayment ? 'Tahsilat' : 'Borç Tahakkuku',
    'Açıklama': i.description,
    'Fatura No': i.invoiceNumber || '',
    'Borç (-)': !i.isPayment ? i.amount : 0,
    'Tahsilat (+)': i.isPayment ? i.amount : 0,
    'Durum': i.isPaid ? 'Ödendi' : 'Bekliyor'
  }))
  
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Finansal Rapor")
  
  // Sütun genişlikleri ayarı
  const wscols = [
    {wch: 12}, {wch: 25}, {wch: 10}, {wch: 15}, {wch: 30}, {wch: 12}, {wch: 12}, {wch: 10}
  ]
  ws['!cols'] = wscols
  
  XLSX.writeFile(wb, `Akyildiz_Finans_Raporu_${new Date().toISOString().split('T')[0]}.xlsx`)
}

const exportToPDF = () => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  doc.addFileToVFS('arial.ttf', arialBase64)
  doc.addFont('arial.ttf', 'Arial', 'normal')
  doc.setFont('Arial', 'normal')

  const pageW  = doc.internal.pageSize.getWidth()   // 297 mm
  const pageH  = doc.internal.pageSize.getHeight()  // 210 mm
  const margin = 14
  const genDate = new Date().toLocaleString('tr-TR')
  const dateStr = new Date().toISOString().split('T')[0]

  // ── Renk Paleti ────────────────────────────────────────────────────────────
  const NAVY  = [15,  52,  96]
  const GOLD  = [180, 145, 40]
  const WHITE = [255, 255, 255]
  const RED   = [200, 30,  30]
  const GREEN = [22,  140, 60]
  const GRAY  = [110, 110, 110]

  // ── Sayfa başlığı (header band) ────────────────────────────────────────────
  const drawPageHeader = (isFirstPage) => {
    // Navy band
    doc.setFillColor(...NAVY)
    doc.rect(0, 0, pageW, isFirstPage ? 36 : 24, 'F')

    // Gold accent strip
    doc.setFillColor(...GOLD)
    doc.rect(0, isFirstPage ? 36 : 24, pageW, 1.5, 'F')

    // Sol: Şirket adı
    doc.setTextColor(...WHITE)
    doc.setFontSize(isFirstPage ? 15 : 10)
    doc.text('AKYILDIZ IS MERKEZI', margin, isFirstPage ? 13 : 10)

    if (isFirstPage) {
      doc.setFontSize(8)
      doc.text('Yonetim ve Isletme Sistemi', margin, 21)
    }

    // Sağ: Rapor etiketi
    doc.setFontSize(isFirstPage ? 19 : 10)
    doc.text('FINANSAL RAPOR', pageW - margin, isFirstPage ? 17 : 10, { align: 'right' })

    if (isFirstPage) {
      doc.setFontSize(7.5)
      doc.text(`Olusturulma: ${genDate}`, pageW - margin, 25, { align: 'right' })

      const periStr =
        filters.startDate && filters.endDate
          ? `${formatDate(filters.startDate)} - ${formatDate(filters.endDate)}`
          : filters.startDate
            ? `${formatDate(filters.startDate)} tarihinden itibaren`
            : filters.endDate
              ? `${formatDate(filters.endDate)} tarihine kadar`
              : 'Tum Donemler'
      doc.text(`Donem: ${periStr}`, pageW - margin, 31, { align: 'right' })
    }
  }

  // ── Her sayfanın altbilgisi ────────────────────────────────────────────────
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

  // ── Sayfa 1: header + filtre bilgisi + özet kartlar ───────────────────────
  drawPageHeader(true)

  // Aktif filtreler
  const filterParts = []
  if (filters.tenantId) {
    const t = tenants.value.find(t => t.id == filters.tenantId)
    if (t) filterParts.push(`Kiraci: ${t.companyName}`)
  }
  if (filters.ownerId) {
    const o = owners.value.find(o => o.id == filters.ownerId)
    if (o) filterParts.push(`Mal Sahibi: ${o.firstName} ${o.lastName}`)
  }
  if (filters.utilityType) filterParts.push(`Kategori: ${filters.utilityType}`)
  if (filters.type !== 'all') filterParts.push(`Tur: ${filters.type === 'debt' ? 'Borclar' : 'Tahsilatlar'}`)

  doc.setTextColor(...GRAY)
  doc.setFontSize(7.5)
  doc.text(
    `Filtreler: ${filterParts.length ? filterParts.join('  |  ') : 'Filtre uygulanmamis - tum kayitlar'}`,
    margin, 43
  )

  // Özet kartlar
  const boxY = 47
  const boxH = 23
  const gap  = 5
  const boxW = (pageW - margin * 2 - gap * 2) / 3

  const drawSummaryCard = (x, label, value, bg, border, textColor) => {
    doc.setFillColor(...bg)
    doc.setDrawColor(...border)
    doc.setLineWidth(0.6)
    doc.roundedRect(x, boxY, boxW, boxH, 2, 2, 'FD')
    doc.setTextColor(...border)
    doc.setFontSize(6.5)
    doc.text(label, x + boxW / 2, boxY + 7, { align: 'center' })
    doc.setTextColor(...textColor)
    doc.setFontSize(12)
    doc.text(formatCurrency(value), x + boxW / 2, boxY + 18, { align: 'center' })
  }

  drawSummaryCard(margin,                      'TOPLAM TAHAKKUK (BORC)',
    summary.value.totalDebt,   [254,242,242], RED,   [160,20,20])
  drawSummaryCard(margin + boxW + gap,         'TOPLAM TAHSILAT',
    summary.value.totalPayment,[240,253,244], GREEN, [16,90,40])
  const isPos = summary.value.balance >= 0
  drawSummaryCard(margin + (boxW + gap) * 2,   'NET BAKIYE',
    summary.value.balance,
    isPos ? [239,246,255] : [254,242,242],
    isPos ? [37,99,235]   : RED,
    isPos ? [20,70,180]   : [160,20,20])

  // Bölüm başlığı
  doc.setTextColor(...NAVY)
  doc.setFontSize(8)
  doc.text('ISLEM DETAYLARI', margin, boxY + boxH + 8)
  doc.setDrawColor(...NAVY)
  doc.setLineWidth(0.4)
  doc.line(margin, boxY + boxH + 10, pageW - margin, boxY + boxH + 10)

  // ── Tablo ─────────────────────────────────────────────────────────────────
  const tableStartY = boxY + boxH + 14

  const rows = reportItems.value.map(i => ({
    date:    formatDate(i.date),
    period:  formatPeriod(i.periodYear, i.periodMonth),
    tenant:  i.tenantName || '-',
    unit:    i.unitCode   || '-',
    desc:    (i.description || '-').length > 42
               ? (i.description || '').substring(0, 42) + '...'
               : (i.description || '-'),
    invoice: i.invoiceNumber || '-',
    debt:    !i.isPayment ? formatCurrency(i.amount) : '-',
    payment: i.isPayment  ? formatCurrency(i.amount) : '-',
    status:  i.isPayment  ? 'Tahsilat' : (i.isPaid ? 'Odendi' : 'Bekliyor')
  }))

  let totalPages = 1

  autoTable(doc, {
    columns: [
      { header: 'Tarih',              dataKey: 'date'    },
      { header: 'Donem',              dataKey: 'period'  },
      { header: 'Kiraci / Mal Sahibi',dataKey: 'tenant'  },
      { header: 'Unite',              dataKey: 'unit'    },
      { header: 'Aciklama',           dataKey: 'desc'    },
      { header: 'Fatura No',          dataKey: 'invoice' },
      { header: 'Borc (-)',           dataKey: 'debt'    },
      { header: 'Tahsilat (+)',       dataKey: 'payment' },
      { header: 'Durum',              dataKey: 'status'  },
    ],
    body: rows,
    startY: tableStartY,
    margin: { left: margin, right: margin, bottom: 18 },
    styles: {
      fontSize:    7.5,
      font:        'Arial',
      cellPadding: { top: 2.5, right: 3, bottom: 2.5, left: 3 },
      textColor:   [30, 30, 30],
      lineColor:   [215, 220, 228],
      lineWidth:   0.1,
    },
    headStyles: {
      fillColor:   NAVY,
      textColor:   WHITE,
      fontSize:    7.5,
      fontStyle:   'normal',
      cellPadding: { top: 4, right: 3, bottom: 4, left: 3 },
      halign:      'center',
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      date:    { halign: 'center', cellWidth: 22 },
      period:  { halign: 'center', cellWidth: 18 },
      tenant:  { cellWidth: 44 },
      unit:    { halign: 'center', cellWidth: 20 },
      desc:    { cellWidth: 'auto' },
      invoice: { halign: 'center', cellWidth: 24, fontSize: 7 },
      debt:    { halign: 'right',  cellWidth: 28, textColor: RED },
      payment: { halign: 'right',  cellWidth: 28, textColor: GREEN },
      status:  { halign: 'center', cellWidth: 22 },
    },
    didParseCell(data) {
      if (data.section !== 'body' || data.column.dataKey !== 'status') return
      if (data.cell.raw === 'Tahsilat') {
        data.cell.styles.textColor   = [16, 100, 45]
        data.cell.styles.fillColor   = [240, 253, 244]
      } else if (data.cell.raw === 'Bekliyor') {
        data.cell.styles.textColor   = [146, 60, 14]
        data.cell.styles.fillColor   = [255, 251, 235]
      } else if (data.cell.raw === 'Odendi') {
        data.cell.styles.textColor   = [16, 100, 45]
      }
    },
    willDrawPage(data) {
      if (data.pageNumber > 1) {
        drawPageHeader(false)
      }
    },
    didDrawPage(data) {
      totalPages = data.pageCount ?? doc.internal.getNumberOfPages()
      drawPageFooter(data.pageNumber, totalPages)
    }
  })

  // ── Son sayfada özet kutu ──────────────────────────────────────────────────
  const finalY = doc.lastAutoTable.finalY + 6

  if (finalY < pageH - 38) {
    const tbW = 88
    const tbX = pageW - margin - tbW
    const tbH = 32

    // Arka plan
    doc.setFillColor(...NAVY)
    doc.roundedRect(tbX, finalY, tbW, tbH, 2, 2, 'F')

    // Gold başlık çizgisi
    doc.setTextColor(...GOLD)
    doc.setFontSize(8)
    doc.text('RAPOR OZETI', tbX + tbW / 2, finalY + 8, { align: 'center' })
    doc.setDrawColor(...GOLD)
    doc.setLineWidth(0.4)
    doc.line(tbX + 5, finalY + 10, tbX + tbW - 5, finalY + 10)

    // Satırlar
    doc.setTextColor(...WHITE)
    doc.setFontSize(7.5)
    doc.text('Toplam Borc:',     tbX + 5,        finalY + 17)
    doc.text(formatCurrency(summary.value.totalDebt),     tbX + tbW - 5, finalY + 17, { align: 'right' })
    doc.text('Toplam Tahsilat:', tbX + 5,        finalY + 23)
    doc.text(formatCurrency(summary.value.totalPayment),  tbX + tbW - 5, finalY + 23, { align: 'right' })

    // Ayraç
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    doc.line(tbX + 5, finalY + 25.5, tbX + tbW - 5, finalY + 25.5)

    // Net bakiye
    doc.setTextColor(...GOLD)
    doc.setFontSize(8.5)
    doc.text('NET BAKIYE:', tbX + 5, finalY + 31)
    doc.text(formatCurrency(summary.value.balance), tbX + tbW - 5, finalY + 31, { align: 'right' })

    // Kayıt adedi
    doc.setTextColor(...GRAY)
    doc.setFontSize(7)
    doc.text(
      `Toplam ${reportItems.value.length} kayit listelenmistir.`,
      margin, finalY + 10
    )
  }

  doc.save(`Akyildiz_Finansal_Rapor_${dateStr}.pdf`)
}
</script>

<style scoped>
.table th {
  @apply text-xs uppercase tracking-wider;
}
</style>
