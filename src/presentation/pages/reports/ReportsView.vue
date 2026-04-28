<template>
  <div class="p-4 sm:p-6 min-h-screen pb-24 md:pb-6">

    <!-- Sayfa Başlığı -->
    <PageHeader title="Mali Raporlar" subtitle="Gelir, gider ve bakiye durumunu analiz edin">
      <template #icon>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </template>
      <template #actions>
        <button @click="exportToExcel" class="btn btn-sm btn-outline btn-success gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Excel Aktar
        </button>
        <button @click="exportToPDF" class="btn btn-sm btn-ghost border border-slate-300 dark:border-white/[0.1]">
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
      </template>
    </PageHeader>

    <!-- Filtreler -->
    <div class="app-card mb-6">
      <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        <div v-for="field in [
          { label: 'Başlangıç', model: 'startDate', type: 'date' },
          { label: 'Bitiş', model: 'endDate', type: 'date' }
        ]" :key="field.label">
          <label class="text-[10px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-widest mb-1.5 block px-1">{{ field.label }}</label>
          <input v-model="filters[field.model]" :type="field.type" class="input input-sm input-bordered w-full font-bold text-xs" />
        </div>
        
        <div>
          <label class="text-[10px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-widest mb-1.5 block px-1">Kiracı</label>
          <select v-model="filters.tenantId" class="select select-sm select-bordered w-full font-bold text-xs">
            <option value="">Tüm Kiracılar</option>
            <option v-for="t in tenants" :key="t.id" :value="t.id">{{ t.companyName }}</option>
          </select>
        </div>

        <div>
          <label class="text-[10px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-widest mb-1.5 block px-1">Mal Sahibi</label>
          <select v-model="filters.ownerId" class="select select-sm select-bordered w-full font-bold text-xs">
            <option value="">Tüm Mal Sahipleri</option>
            <option v-for="o in owners" :key="o.id" :value="o.id">{{ o.firstName }} {{ o.lastName }}</option>
          </select>
        </div>

        <div>
          <label class="text-[10px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-widest mb-1.5 block px-1">İşlem Tipi</label>
          <select v-model="filters.type" class="select select-sm select-bordered w-full font-bold text-xs">
            <option value="all">Tümü</option>
            <option value="debt">Sadece Borçlar</option>
            <option value="payment">Sadece Tahsilatlar</option>
          </select>
        </div>

        <div>
          <label class="text-[10px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-widest mb-1.5 block px-1">Kategori</label>
          <select v-model="filters.utilityType" class="select select-sm select-bordered w-full font-bold text-xs">
            <option value="">Tümü</option>
            <option value="Aidat">Aidat</option>
            <option value="Electricity">Elektrik</option>
            <option value="Water">Su</option>
          </select>
        </div>

        <div>
          <label class="text-[10px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-widest mb-1.5 block px-1">Borçlu Türü</label>
          <select v-model="filters.debtorType" class="select select-sm select-bordered w-full font-bold text-xs">
            <option value="All">Tümü</option>
            <option value="OnlyTenants">Yalnızca Kiracılar</option>
            <option value="OnlyOwners">Yalnızca Mal Sahipleri</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end mt-4 pt-4 border-t border-slate-100 dark:border-white/[0.04]">
        <button @click="clearFilters" class="btn btn-ghost btn-xs text-slate-400 font-bold uppercase tracking-wider">
          Filtreleri Temizle
        </button>
      </div>
    </div>

    <!-- Özet Kartları -->
    <div v-if="reportItems.length > 0" class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div class="app-card group hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#626885]">Toplam Tahakkuk</p>
            <p class="text-xl font-black text-slate-800 dark:text-white tabular-nums tracking-tight mt-0.5">{{ formatCurrency(summary.totalDebt) }}</p>
          </div>
        </div>
      </div>
      <div class="app-card group hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#626885]">Toplam Tahsilat</p>
            <p class="text-xl font-black text-slate-800 dark:text-white tabular-nums tracking-tight mt-0.5">{{ formatCurrency(summary.totalPayment) }}</p>
          </div>
        </div>
      </div>
      <div class="app-card group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
        <div class="flex items-center gap-4">
          <div :class="[
            'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110',
            summary.balance >= 0 ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'bg-red-50 dark:bg-red-500/10 text-red-500'
          ]">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#626885]">Net Bakiye</p>
            <p :class="[
              'text-xl font-black tabular-nums tracking-tight mt-0.5',
              summary.balance >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-red-500'
            ]">{{ formatCurrency(summary.balance) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tablo Kartı -->
    <div class="app-card !p-0">
      <!-- Tablo Başlığı -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/[0.07]">
        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold text-slate-700 dark:text-[#f1f3f9]">İşlem Listesi</span>
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
            <tr class="border-b border-white/[0.08]">
              <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest whitespace-nowrap px-4 text-left">Tarih</th>
              <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest whitespace-nowrap px-4 text-left">Dönem</th>
              <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest whitespace-nowrap px-4 text-left">Kiracı / Ünite</th>
              <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest whitespace-nowrap px-4 text-left">İşlem</th>
              <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest whitespace-nowrap px-4 text-left">Açıklama</th>
              <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest whitespace-nowrap px-4 text-left">Fatura No</th>
              <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest text-right whitespace-nowrap px-4">Borç (−)</th>
              <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest text-right whitespace-nowrap px-4">Alacak (+)</th>
              <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest text-center whitespace-nowrap px-4">Durum</th>
              <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest text-center whitespace-nowrap px-4">Vade</th>
            </tr>
          </thead>
          <tbody class="divide-y-0">
            <tr v-if="loading">
              <td colspan="10" class="text-center py-10">
                <span class="loading loading-spinner loading-md text-slate-400"></span>
              </td>
            </tr>
            <tr v-else-if="reportItems.length === 0">
              <td colspan="10" class="py-12">
                <div class="text-center">
                  <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#1c2238] flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <p class="text-sm font-medium text-slate-500 dark:text-[#9aa0b4]">Kayıt bulunamadı</p>
                  <p class="text-xs text-slate-400 mt-1">Farklı filtre kriterleri deneyin</p>
                </div>
              </td>
            </tr>
            <tr
              v-else
              v-for="(item, idx) in paginatedReports"
              :key="idx"
              class="group hover:bg-white/[0.02] transition-colors border-b border-white/[0.02]/50 last:border-0"
            >
              <td class="px-4 py-3 whitespace-nowrap text-[11px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-tight">{{ formatDate(item.date) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-[11px] font-mono font-black text-slate-600 dark:text-[#9aa0b4] tracking-tighter">{{ formatPeriod(item.periodYear, item.periodMonth) }}</td>
              <td class="px-4 py-3">
                <p class="text-[13.5px] font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight truncate group-hover:text-brand-500 transition-colors">{{ item.tenantName }}</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{{ item.unitCode }}</p>
              </td>
              <td class="px-4 py-3">
                <span :class="[
                  'px-2 py-0.5 rounded-lg text-[9.5px] font-black uppercase tracking-widest',
                  item.isPayment ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                  : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                ]">
                  {{ item.isPayment ? 'Tahsilat' : 'Borç' }}
                </span>
              </td>
              <td class="px-4 py-3 max-w-[180px] truncate text-[11px] font-black text-slate-500 dark:text-white/70 uppercase tracking-tight">{{ item.description }}</td>
              <td class="px-4 py-3 text-[11px] font-mono font-black text-slate-400 uppercase tracking-tighter">{{ item.invoiceNumber || '—' }}</td>
              <td class="px-4 py-3 text-right text-[13px] font-black tabular-nums tracking-tight" :class="!item.isPayment ? 'text-red-500' : 'text-slate-300 dark:text-[#3a3f55]'">
                {{ !item.isPayment ? formatCurrency(item.amount) : '—' }}
              </td>
              <td class="px-4 py-3 text-right text-[13px] font-black tabular-nums tracking-tight" :class="item.isPayment ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-[#3a3f55]'">
                {{ item.isPayment ? formatCurrency(item.amount) : '—' }}
              </td>
              <td class="px-4 py-3 text-center">
                <span v-if="!item.isPayment" :class="[
                  'px-2 py-0.5 rounded-lg text-[9.5px] font-black uppercase tracking-widest',
                  item.isPaid ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                ]">
                  {{ item.isPaid ? 'Ödendi' : 'Bekliyor' }}
                </span>
                <span v-else class="text-slate-300 dark:text-[#3a3f55] text-xs">—</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-[11px] font-black text-center uppercase tracking-tight" :class="
                !item.lastPaymentDate ? 'text-slate-300 dark:text-[#3a3f55]' :
                (!item.isPaid && new Date(item.lastPaymentDate) < new Date()) ? 'text-red-500' :
                'text-slate-400 dark:text-[#626885]'
              ">
                {{ item.lastPaymentDate ? formatDate(item.lastPaymentDate) : '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 dark:border-white/[0.07]">
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
              currentPage === page ? 'btn-primary' : 'btn-ghost text-slate-500 dark:text-[#9aa0b4]'
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
import tenantsService from '@/infrastructure/services/tenantsService'
import ownersService from '@/infrastructure/services/ownersService'
import utilityDebtsService from '@/infrastructure/services/utilityDebtsService'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import paymentsService from '@/infrastructure/services/paymentsService'

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
  utilityType: '',
  debtorType: 'All'
})

// Lifecycle
onMounted(async () => {
  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 1)
  
  filters.startDate = startOfYear.toISOString().substring(0, 10)
  filters.endDate = today.toISOString().substring(0, 10)
  
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
        type: filters.utilityType || undefined,
        debtorType: filters.debtorType === 'All' ? undefined : filters.debtorType,
        pageSize: 1000 // Rappor için limit artırıldı
      }),
      paymentsService.getPayments({
        tenantId: filters.tenantId || undefined,
        ownerId: filters.ownerId || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        utilityType: filters.utilityType || undefined,
        debtorType: filters.debtorType === 'All' ? undefined : filters.debtorType,
        excludeAdvanceUse: true,
        pageSize: 1000 // Rapor için limit artırıldı
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
  filters.debtorType = 'All'
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
        date: d.dueDate || d.createdAt || d.date,
        periodYear: d.periodYear,
        periodMonth: d.periodMonth,
        tenantName: d.tenantName || (owner ? `${owner.firstName} ${owner.lastName} (M. Sahibi)` : 'Bilinmiyor'),
        unitCode: d.flatInfo || d.unit || '-',
        description: d.description || `${d.type === 'Electricity' ? 'Elektrik' : d.type === 'Water' ? 'Su' : 'Aidat'} faturası`,
        invoiceNumber: d.invoiceNumber ?? d.InvoiceNumber ?? null,
        amount: Number(d.amount ?? 0),
        isPayment: false,
        isPaid: d.status === 'Paid',
        lastPaymentDate: d.dueDate || null
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
        invoiceNumber: p.receiptNumber ?? p.ReceiptNumber ?? p.invoiceNumber ?? p.InvoiceNumber ?? null,
        amount: Number(p.amount ?? 0),
        isPayment: true,
        isPaid: true,
        lastPaymentDate: null
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
const exportToExcel = async () => {
  const XLSX = await import('xlsx')
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
    'Durum': i.isPaid ? 'Ödendi' : 'Bekliyor',
    'Vade Tarihi': i.lastPaymentDate ? formatDate(i.lastPaymentDate) : ''
  }))
  
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Finansal Rapor")
  
  // Sütun genişlikleri ayarı
  const wscols = [
    {wch: 12}, {wch: 25}, {wch: 10}, {wch: 15}, {wch: 30}, {wch: 12}, {wch: 12}, {wch: 10}, {wch: 14}
  ]
  ws['!cols'] = wscols
  
  XLSX.writeFile(wb, `Akyildiz_Finans_Raporu_${new Date().toISOString().split('T')[0]}.xlsx`)
}

const exportToPDF = async () => {
  const { jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')
  const { arialBase64 } = await import('./utils/pdfFonts')
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
    date:      formatDate(i.date),
    period:    formatPeriod(i.periodYear, i.periodMonth),
    tenant:    i.tenantName || '-',
    unit:      i.unitCode   || '-',
    desc:      (i.description || '-').length > 42
                 ? (i.description || '').substring(0, 42) + '...'
                 : (i.description || '-'),
    invoice:   i.invoiceNumber || '-',
    debt:      !i.isPayment ? formatCurrency(i.amount) : '-',
    payment:   i.isPayment  ? formatCurrency(i.amount) : '-',
    status:    i.isPayment  ? 'Tahsilat' : (i.isPaid ? 'Odendi' : 'Bekliyor'),
    lastPaid:  i.lastPaymentDate ? formatDate(i.lastPaymentDate) : '-'
  }))

  let totalPages = 1

  autoTable(doc, {
    columns: [
      { header: 'Tarih',              dataKey: 'date'     },
      { header: 'Donem',              dataKey: 'period'   },
      { header: 'Kiraci / Mal Sahibi',dataKey: 'tenant'   },
      { header: 'Unite',              dataKey: 'unit'     },
      { header: 'Aciklama',           dataKey: 'desc'     },
      { header: 'Fatura No',          dataKey: 'invoice'  },
      { header: 'Borc (-)',           dataKey: 'debt'     },
      { header: 'Tahsilat (+)',       dataKey: 'payment'  },
      { header: 'Durum',              dataKey: 'status'   },
      { header: 'Vade Tarihi',         dataKey: 'lastPaid' },
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
      debt:     { halign: 'right',  cellWidth: 26, textColor: RED },
      payment:  { halign: 'right',  cellWidth: 26, textColor: GREEN },
      status:   { halign: 'center', cellWidth: 20 },
      lastPaid: { halign: 'center', cellWidth: 22, textColor: [16, 100, 45] },
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
