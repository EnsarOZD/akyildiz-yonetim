<template>
  <div class="p-4 sm:p-10 min-h-screen pb-24 md:pb-10 transition-colors duration-500">
    <div class="max-w-5xl mx-auto space-y-6">

      <!-- ─── Row 1: Greeting & Primary Action Card ─── -->
      <section class="animate-slide-up">
        <div class="app-card-premium p-6 sm:p-8 bg-brand-gradient text-white overflow-hidden relative group">
          <!-- Background Abstract Shapes -->
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <div class="absolute -left-10 -bottom-10 w-32 h-32 bg-brand-400/20 rounded-full blur-2xl"></div>

          <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div class="space-y-1">
              <p class="text-premium-label text-white/70">Mevcut Durum</p>
              <h1 class="text-3xl sm:text-4xl text-high-density tracking-tighter">
                {{ formatCurrency(totalDebt) }}
              </h1>
              <p class="text-xs font-bold text-white/60 flex items-center gap-2 uppercase tracking-widest mt-1">
                <span v-if="totalDebt > 0" class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                  {{ overdueItems.length > 0 ? overdueItems.length + ' ADET VADESİ GEÇMİŞ ÖDEME' : 'YAKLAŞAN ÖDEMELERİNİZ VAR' }}
                </span>
                <span v-else class="flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                  Tebrikler, tüm borçlarınız ödenmiş!
                </span>
              </p>
            </div>

            <router-link to="/my-payments" 
              class="px-8 py-3.5 bg-white text-brand-600 rounded-2xl text-[11px] font-black uppercase tracking-[2px] shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all outline-none">
              ÖDEMELERİ GÖR
            </router-link>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- ─── Row 2: Pending Debts (Primary List) ─── -->
        <section class="lg:col-span-12 xl:col-span-7 space-y-4 animate-slide-up">
          <div class="flex items-center justify-between px-1">
            <h2 class="text-premium-label">Bekleyen Ödemeler</h2>
            <span class="text-[10px] font-black text-brand-500 bg-brand-500/10 px-2.5 py-1 rounded-full uppercase">{{ pendingDebts.length }} Kalem</span>
          </div>

          <div v-if="pendingDebts.length > 0" class="space-y-3">
            <div
              v-for="debt in pendingDebts"
              :key="debt.id"
              class="app-card hover:border-brand-500/30 group p-4 flex items-center justify-between gap-4"
            >
              <div class="flex items-center gap-4 min-w-0">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300" 
                  :class="getDebtTypeClass(debt.type)">
                  <!-- Aidat -->
                  <svg v-if="[0,'Aidat'].includes(debt.type)" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1.707.293l5.414 5.414a1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <!-- Elektrik -->
                  <svg v-else-if="[1,'Electricity'].includes(debt.type)" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <!-- Su -->
                  <svg v-else-if="[2,'Water'].includes(debt.type)" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10C22 6.48 17.52 2 11 2zm-1 14H9V8l5 5-3 3zm3-3l-3-3V7h2l1 4z" />
                  </svg>
                  <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{{ getDebtTypeLabel(debt.type) }}</p>
                  <p class="text-[11px] font-bold text-slate-400 dark:text-[#626885]">Vade: {{ formatDate(debt.dueDate) }}</p>
                </div>
              </div>
              <div class="text-right shrink-0">
                <p class="text-base font-black text-brand-500 tabular-nums">{{ formatCurrency(debt.remainingAmount ?? debt.amount ?? 0) }}</p>
                <div class="flex items-center justify-end gap-1.5 mt-0.5">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ debt.periodMonth }}/{{ debt.periodYear }}</span>
                  <span v-if="isOverdue(debt.dueDate)" class="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="app-card border-dashed py-12 flex flex-col items-center text-center">
            <div class="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Borcunuz Bulunmuyor</h3>
            <p class="text-[11px] font-bold text-slate-400 dark:text-[#626885] mt-1">Her şey yolunda! Tüm ödemeleriniz güncel.</p>
          </div>
        </section>

        <!-- ─── Row 3: Quick Insights & Info ─── -->
        <aside class="lg:col-span-12 xl:col-span-5 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="app-card p-5 space-y-3">
              <div class="p-2.5 w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p class="text-premium-label mb-1">Geciken</p>
                <p class="text-xl font-black text-slate-800 dark:text-white tabular-nums">{{ formatCurrency(overdueDebt) }}</p>
              </div>
            </div>
            <div class="app-card p-5 space-y-3">
              <div class="p-2.5 w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <div>
                <p class="text-premium-label mb-1">Son Ödeme</p>
                <p class="text-xl font-black text-slate-800 dark:text-white tabular-nums">{{ lastPaymentAmount > 0 ? formatCurrency(lastPaymentAmount) : '-' }}</p>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h2 class="text-premium-label px-1">Hızlı İşlemler</h2>
            <div class="grid grid-cols-2 gap-4">
              <router-link to="/service-requests" class="app-card p-5 group hover:bg-brand-500 transition-colors duration-300">
                <div class="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center mb-3">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
                </div>
                <p class="text-xs font-black text-slate-800 dark:text-white uppercase group-hover:text-white tracking-widest">ARIZA BİLDİR</p>
              </router-link>
              <router-link to="/profile" class="app-card p-5 group hover:bg-indigo-500 transition-colors duration-300">
                <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center mb-3">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <p class="text-xs font-black text-slate-800 dark:text-white uppercase group-hover:text-white tracking-widest">PROFİLİM</p>
              </router-link>
            </div>
          </div>

          <div v-if="tenantInfo?.flats?.length > 0" class="app-card bg-slate-50 dark:bg-white/[0.02] border-none p-5">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-white dark:bg-white/5 flex items-center justify-center text-brand-500 shadow-sm shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">KAYITLI ÜNİTELER</p>
                <div class="flex flex-wrap gap-x-3 mt-1">
                  <span v-for="flat in tenantInfo.flats" :key="flat.id" class="text-sm font-black text-brand-600 dark:text-brand-400">
                    #{{ flat.code }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/application/stores/auth'
import utilityDebtsService from '@/infrastructure/services/utilityDebtsService'
import paymentsService from '@/infrastructure/services/paymentsService'
import tenantsService from '@/infrastructure/services/tenantsService'
import { formatCurrency } from '@/core/utils/currencyUtils'

const authStore = useAuthStore()
const loading = ref(true)
const debts = ref([])
const payments = ref([])
const tenantInfo = ref(null)

const totalDebt = computed(() =>
  debts.value
    .filter(d => d.status?.toLowerCase() !== 'paid')
    .reduce((sum, d) => sum + Number(d.remainingAmount ?? d.amount ?? 0), 0)
)

const overdueItems = computed(() => {
  const now = new Date()
  return debts.value.filter(d => d.dueDate && new Date(d.dueDate) < now && d.status?.toLowerCase() !== 'paid')
})

const overdueDebt = computed(() =>
  overdueItems.value.reduce((sum, d) => sum + Number(d.remainingAmount ?? d.amount ?? 0), 0)
)

const pendingDebts = computed(() =>
  debts.value
    .filter(d => d.status?.toLowerCase() !== 'paid')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 10)
)

const lastPayment = computed(() => 
  payments.value.length > 0 ? payments.value.sort((a, b) => new Date(b.paymentDate || b.date) - new Date(a.paymentDate || a.date))[0] : null
)

const lastPaymentAmount = computed(() => lastPayment.value?.amount || 0)

const isOverdue = (dateStr) => {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

const loadData = async () => {
  loading.value = true
  try {
    const tenantId = authStore.companyId
    
    const promises = [
      utilityDebtsService.getUtilityDebts({ tenantId }).then(d => debts.value = d || []),
      paymentsService.getPayments({ tenantId }).then(p => payments.value = p || [])
    ]

    if (tenantId) {
      promises.push(tenantsService.getTenantById(tenantId).then(t => tenantInfo.value = t))
    }

    await Promise.allSettled(promises)
  } catch (error) {
    console.error('Veri yükleme hatası:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const getDebtTypeLabel = (type) => {
  const types = { 0: 'Aidat Ödemesi', 1: 'Elektrik Gideri', 2: 'Su Gideri', 'Aidat': 'Aidat Ödemesi', 'Electricity': 'Elektrik Gideri', 'Water': 'Su Gideri' }
  return types[type] || 'Diğer Borç'
}

const getDebtTypeClass = (type) => {
  const classes = { 
    0: 'bg-emerald-500/10 text-emerald-500',
    1: 'bg-amber-500/10 text-amber-500', 
    2: 'bg-brand-500/10 text-brand-500',
    'Aidat': 'bg-emerald-500/10 text-emerald-500',
    'Electricity': 'bg-amber-500/10 text-amber-500', 
    'Water': 'bg-brand-500/10 text-brand-500'
  }
  return classes[type] || 'bg-slate-500/10 text-slate-500'
}

onMounted(() => {
  loadData()
})
</script>
