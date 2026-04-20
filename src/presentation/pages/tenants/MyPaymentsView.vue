<template>
  <div class="p-4 sm:p-10 min-h-screen pb-24 md:pb-10 transition-all duration-500">
    <div class="max-w-6xl mx-auto space-y-6">

      <!-- ─── Row 1: Page Header ─── -->
      <section class="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-slide-up">
        <div>
          <h1 class="text-2xl font-black text-high-density text-slate-800 dark:text-white tracking-tighter">
            Ödemelerim ve Borçlarım
          </h1>
          <p class="text-sm font-bold text-slate-400 dark:text-[#626885] mt-1 uppercase tracking-widest flex items-center gap-2">
            {{ tenantInfo?.companyName || authStore.companyName }}
            <span v-if="tenantInfo?.flats?.length" class="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/20"></span>
            <span v-if="tenantInfo?.flats?.length" class="text-brand-500 font-black">UNITE: {{ tenantInfo.flats.map(f => f.code).join(', ') }}</span>
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <div class="flex bg-white dark:bg-[#0f1322] p-1 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm">
            <button @click="exportToExcel" :disabled="loading || reportItems.length === 0" 
              class="flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-wider text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all disabled:opacity-30">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
              EXCEL
            </button>
            <button @click="exportToPDF" :disabled="loading || reportItems.length === 0" 
              class="flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-wider text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all disabled:opacity-30">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              PDF
            </button>
          </div>
          <button @click="fetchData" :disabled="loading" 
            class="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-500/25 flex items-center gap-2 disabled:opacity-50">
            <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
            <span v-else class="loading loading-spinner loading-xs"></span>
            SORGULA
          </button>
        </div>
      </section>

      <!-- ─── Row 2: Summary Cards ─── -->
      <section v-if="reportItems.length > 0 || !loading" class="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up">
        <div class="app-card border-none bg-slate-50 dark:bg-white/[0.02] p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/></svg>
          </div>
          <div>
            <p class="text-premium-label mb-1">Toplam Tahakkuk</p>
            <p class="text-xl font-black text-slate-800 dark:text-white">{{ formatCurrency(rawSummary.totalDebt) }}</p>
          </div>
        </div>

        <div class="app-card border-none bg-slate-50 dark:bg-white/[0.02] p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          </div>
          <div>
            <p class="text-premium-label mb-1">Toplam Ödenen</p>
            <p class="text-xl font-black text-slate-800 dark:text-white">{{ formatCurrency(rawSummary.totalPayment) }}</p>
          </div>
        </div>

        <div class="app-card-premium p-5 flex items-center gap-4 border-none" 
          :class="rawSummary.balance >= 0 ? 'bg-brand-gradient' : 'bg-rose-500 shadow-rose-500/20'">
          <div class="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
          </div>
          <div>
            <p class="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Cari Bakiye</p>
            <p class="text-xl font-black text-white">{{ formatCurrency(Math.abs(rawSummary.balance)) }}</p>
          </div>
        </div>
      </section>

      <!-- ─── Row 3: Filters ─── -->
      <section class="app-card animate-slide-up p-5">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="form-control">
            <label class="text-premium-label mb-2">BAŞLANGIÇ</label>
            <input v-model="filters.startDate" type="date" class="bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 transition-colors" />
          </div>
          <div class="form-control">
            <label class="text-premium-label mb-2">BİTİŞ</label>
            <input v-model="filters.endDate" type="date" class="bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 transition-colors" />
          </div>
          <div class="form-control">
            <label class="text-premium-label mb-2">İŞLEM TİPİ</label>
            <select v-model="filters.type" class="bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 transition-colors appearance-none">
              <option value="all">Tümü (Borç & Ödeme)</option>
              <option value="debt">Sadece Borçlar</option>
              <option value="payment">Sadece Ödemeler</option>
            </select>
          </div>
          <div class="form-control">
            <label class="text-premium-label mb-2">DURUM</label>
            <select v-model="filters.status" :disabled="filters.type === 'payment'" class="bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 transition-colors appearance-none disabled:opacity-30">
              <option value="all">Tümü</option>
              <option value="unpaid">Bekleyenler</option>
              <option value="paid">Ödenenler</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end mt-4 pt-4 border-t border-slate-100 dark:border-white/[0.05]">
          <button @click="clearFilters" class="text-[10px] font-black text-slate-400 hover:text-brand-500 uppercase tracking-widest transition-colors">Filtreleri Temizle</button>
        </div>
      </section>

      <!-- ─── Row 4: Transaction List ─── -->
      <section class="space-y-4 animate-slide-up">
        <div class="flex items-center justify-between px-1">
          <h2 class="text-premium-label">İşlem Listesi</h2>
          <div class="flex items-center gap-4">
             <span class="text-[10px] font-bold text-slate-400 uppercase">{{ reportItems.length }} Kayıt</span>
             <select v-model="pageSize" class="bg-transparent text-[10px] font-bold text-brand-500 uppercase outline-none">
                <option :value="10">10 Satır</option>
                <option :value="25">25 Satır</option>
                <option :value="50">50 Satır</option>
             </select>
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden md:block app-card !p-0 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-white/[0.02]">
                  <th class="px-6 py-4 text-premium-label">Tarih</th>
                  <th class="px-6 py-4 text-premium-label text-center">Dönem</th>
                  <th class="px-6 py-4 text-premium-label text-center">Tür</th>
                  <th class="px-6 py-4 text-premium-label">Açıklama</th>
                  <th class="px-6 py-4 text-premium-label text-right">Miktar</th>
                  <th class="px-6 py-4 text-premium-label text-center">Durum</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-white/[0.05]">
                <tr v-if="loading"><td colspan="6" class="py-20 text-center"><span class="loading loading-spinner text-brand-500"></span></td></tr>
                <tr v-else-if="reportItems.length === 0"><td colspan="6" class="py-20 text-center text-slate-400 font-bold uppercase text-xs">Kayıt Bulunamadı</td></tr>
                <tr v-else v-for="(item, idx) in paginatedReports" :key="idx" class="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td class="px-6 py-4 text-xs font-black text-slate-500 dark:text-[#9aa0b4]">{{ formatDate(item.date) }}</td>
                  <td class="px-6 py-4 text-center text-xs font-black text-slate-500 dark:text-[#9aa0b4]">{{ formatPeriod(item.periodYear, item.periodMonth) }}</td>
                  <td class="px-6 py-4 text-center">
                    <span :class="item.isPayment ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'" class="px-3 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap">
                      {{ item.isPayment ? 'Ödeme' : (item.debtTypeLabel || 'Borç') }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-xs font-bold text-slate-800 dark:text-white max-w-xs">
                    <p class="truncate">{{ item.description }}</p>
                    <p v-if="!item.isPayment && item.flatCode" class="text-[10px] font-bold text-brand-500 dark:text-brand-400 mt-0.5">Ünite {{ item.flatCode }}</p>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <p class="text-sm font-black" :class="item.isPayment ? 'text-emerald-500' : 'text-rose-500'">
                      {{ item.isPayment ? '+' : '-' }} {{ formatCurrency(item.amount) }}
                    </p>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span v-if="!item.isPayment" class="px-3 py-1 rounded-full text-[10px] font-black uppercase" 
                      :class="item.isPaid ? 'bg-brand-500/10 text-brand-500' : 'bg-rose-500/10 text-rose-500'">
                      {{ item.isPaid ? 'Ödendi' : 'Bekliyor' }}
                    </span>
                    <span v-else class="text-slate-300 dark:text-white/20">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden space-y-4">
           <div v-if="loading" class="py-10 text-center"><span class="loading loading-spinner text-brand-500"></span></div>
           <div v-else-if="reportItems.length === 0" class="py-10 text-center text-slate-400 font-bold uppercase text-xs">Kayıt Bulunmuyor</div>
           <div v-for="(item, idx) in paginatedReports" :key="idx" class="app-card relative overflow-hidden group pl-10 transition-all hover:bg-slate-50 dark:hover:bg-white/[0.04]">
              <!-- Indicators -->
              <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="item.isPayment ? 'bg-emerald-500 shadow-[2px_0_10px_rgba(16,185,129,0.2)]' : 'bg-amber-500 shadow-[2px_0_10px_rgba(245,158,11,0.2)]'"></div>
              
              <div class="flex justify-between items-start mb-3">
                 <div class="min-w-0 flex-1 pr-3">
                    <span class="text-premium-label opacity-70">{{ formatDate(item.date) }}</span>
                    <h3 class="text-sm font-black text-slate-800 dark:text-white mt-0.5 uppercase tracking-tight truncate">{{ item.description }}</h3>
                    <div class="flex items-center gap-1.5 flex-wrap mt-1">
                      <span v-if="!item.isPayment && item.debtTypeLabel"
                        class="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 uppercase">
                        {{ item.debtTypeLabel }}
                      </span>
                      <span v-if="!item.isPayment && item.flatCode"
                        class="text-[9px] font-black px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 uppercase">
                        Ünite {{ item.flatCode }}
                      </span>
                    </div>
                 </div>
                 <div class="text-right shrink-0">
                    <p class="text-sm font-black" :class="item.isPayment ? 'text-emerald-500' : 'text-rose-500'">
                       {{ item.isPayment ? '+' : '-' }}{{ formatCurrency(item.amount) }}
                    </p>
                    <span class="text-[10px] font-bold text-slate-400">{{ formatPeriod(item.periodYear, item.periodMonth) }}</span>
                 </div>
              </div>

              <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/[0.05]">
                 <span class="text-[10px] font-black uppercase" :class="item.isPayment ? 'text-emerald-500' : 'text-amber-500'">
                    {{ item.isPayment ? 'TAHSİLAT' : 'TAHAKKUK' }}
                 </span>
                 <div v-if="!item.isPayment" class="flex items-center gap-2">
                    <span class="text-[10px] font-black uppercase" :class="item.isPaid ? 'text-brand-500' : 'text-rose-500'">
                       {{ item.isPaid ? 'ÖDENDİ' : 'BEKLİYOR' }}
                    </span>
                    <span v-if="!item.isPaid && isOverdue(item.lastPaymentDate)" class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                 </div>
              </div>
           </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-4">
          <button @click="currentPage--" :disabled="currentPage === 1" class="w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-white/5 border border-slate-200 dark:border-white/[0.08] disabled:opacity-20">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <span class="text-xs font-black text-slate-600 dark:text-[#f1f3f9] px-4">SAYFA {{ currentPage }} / {{ totalPages }}</span>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-white/5 border border-slate-200 dark:border-white/[0.08] disabled:opacity-20">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>
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
        description: d.description || `${debtTypeLabel(d.type) || 'Aidat'} faturası`,
        invoiceNumber: d.invoiceNumber ?? d.InvoiceNumber ?? null,
        amount: Number(d.amount ?? 0),
        isPayment: false,
        isPaid,
        lastPaymentDate: d.dueDate || null,
        flatCode: d.flatCode || d.unit || null,
        debtTypeLabel: debtTypeLabel(d.type)
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
          invoiceNumber: p.receiptNumber ?? p.ReceiptNumber ?? p.invoiceNumber ?? p.InvoiceNumber ?? null,
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

watch([filters, pageSize], () => { currentPage.value = 1 }, { deep: true })

// Helpers
const debtTypeLabel = (type) => {
  const map = { 0: 'Aidat', 1: 'Elektrik', 2: 'Su', Aidat: 'Aidat', Electricity: 'Elektrik', Water: 'Su' }
  return map[type] ?? null
}

const formatCurrency = (val) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Number(val ?? 0))

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('tr-TR')
}

const isOverdue = (date) => {
  if (!date) return false
  return new Date(date) < new Date()
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
      const pdfTotalPages = data.pageCount ?? doc.internal.getNumberOfPages()
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
.form-control select {
   background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='6b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
   background-position: right 0.5rem center;
   background-repeat: no-repeat;
   background-size: 1.5em 1.5em;
   padding-right: 2.5rem;
   -webkit-print-color-adjust: exact;
   print-color-adjust: exact;
}
</style>
