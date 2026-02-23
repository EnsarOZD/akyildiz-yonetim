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
                <th>Tarih</th>
                <th>Kiracı / Ünite</th>
                <th>İşlem</th>
                <th>Açıklama</th>
                <th class="text-right">Borç(-)</th>
                <th class="text-right">Alacak(+)</th>
                <th class="text-center">Durum</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in reportItems" :key="idx" class="hover">
                <td class="whitespace-nowrap">{{ formatDate(item.date) }}</td>
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
                <td colspan="7" class="text-center py-12 text-gray-500 italic">
                  {{ loading ? 'Veriler yükleniyor...' : 'Kritere uygun kayıt bulunamadı.' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
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
        utilityType: filters.utilityType || undefined
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
      items.push({
        date: d.date || d.createdAt || d.dueDate,
        tenantName: d.tenantName || 'Bilinmiyor',
        unitCode: d.flatInfo || d.unit || '-',
        description: d.description || `${d.type === 'Electricity' ? 'Elektrik' : d.type === 'Water' ? 'Su' : 'Aidat'} faturası`,
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
        date: p.paymentDate,
        tenantName: p.tenantName || p.tenant?.companyName || 'Bilinmiyor',
        unitCode: p.flatInfo || '-',
        description: p.description || 'Tahsilat kaydı',
        amount: Number(p.amount ?? 0),
        isPayment: true,
        isPaid: true
      })
    })
  }
  
  // Sıralama: Tarihe göre eski -> yeni veya yeni -> eski
  return items.sort((a, b) => new Date(b.date) - new Date(a.date))
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

// Helpers
const formatCurrency = (val) => 
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Number(val ?? 0))

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('tr-TR')
}

// EXPORT FUNCTIONS
const exportToExcel = () => {
  const data = reportItems.value.map(i => ({
    'Tarih': formatDate(i.date),
    'Kiracı': i.tenantName,
    'Ünite': i.unitCode,
    'Tür': i.isPayment ? 'Tahsilat' : 'Borç Tahakkuku',
    'Açıklama': i.description,
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
  const doc = new jsPDF()
  
  // Türkçe karakter desteği için Arial fontunu ekle
  doc.addFileToVFS('arial.ttf', arialBase64)
  doc.addFont('arial.ttf', 'Arial', 'normal')
  doc.setFont('Arial')
  
  doc.setFontSize(20)
  doc.text("AKYILDIZ IS MERKEZI FINANSAL RAPORU", 15, 20)
  
  doc.setFontSize(10)
  doc.text(`Rapor Tarihi: ${new Date().toLocaleString('tr-TR')}`, 15, 28)
  doc.text(`Filtre: ${filters.startDate} / ${filters.endDate}`, 15, 34)
  
  const columns = [
    { header: 'Tarih', dataKey: 'date' },
    { header: 'Kiraci', dataKey: 'tenant' },
    { header: 'Unit', dataKey: 'unit' },
    { header: 'Aciklama', dataKey: 'desc' },
    { header: 'Borc', dataKey: 'debt' },
    { header: 'Tahsilat', dataKey: 'payment' }
  ]
  
  const rows = reportItems.value.map(i => ({
    date: formatDate(i.date),
    tenant: i.tenantName,
    unit: i.unitCode,
    desc: i.description,
    debt: !i.isPayment ? formatCurrency(i.amount) : '-',
    payment: i.isPayment ? formatCurrency(i.amount) : '-'
  }))
  
  autoTable(doc, {
    columns,
    body: rows,
    startY: 40,
    styles: { fontSize: 8, font: 'Arial' },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'normal' },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  })
  
  // Summary at bottom
  const finalY = doc.lastAutoTable.finalY + 10
  doc.setFontSize(11)
  doc.text(`Toplam Borc: ${formatCurrency(summary.value.totalDebt)}`, 140, finalY)
  doc.text(`Toplam Tahsilat: ${formatCurrency(summary.value.totalPayment)}`, 140, finalY + 7)
  doc.text(`NET BAKIYE: ${formatCurrency(summary.value.balance)}`, 140, finalY + 14)
  
  doc.save(`Akyildiz_Rapor_${new Date().getTime()}.pdf`)
}
</script>

<style scoped>
.table th {
  @apply text-xs uppercase tracking-wider;
}
</style>
