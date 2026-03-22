<template>
  <div class="p-4 sm:p-6 min-h-screen pb-24 md:pb-6">
    <div class="max-w-4xl mx-auto">

      <!-- Başlık -->
      <div class="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 class="page-title">Hoş Geldiniz, {{ authStore.fullName }}</h1>
          <p v-if="tenantInfo?.companyName || authStore.companyName" class="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {{ tenantInfo?.companyName || authStore.companyName }}
          </p>
          <p class="page-subtitle mt-0.5">Mülkünüzün özet finansal durumu aşağıdadır.</p>
        </div>

        <div v-if="tenantInfo?.flats?.length > 0" class="flex flex-wrap gap-2 shrink-0">
          <div
            v-for="flat in tenantInfo.flats"
            :key="flat.id"
            class="app-card !py-1.5 !px-3 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300"
          >
            <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <span class="text-slate-400 dark:text-slate-500">Daire:</span>
            <b>{{ flat.code }}</b>
          </div>
        </div>
      </div>

      <!-- Özet Kartları -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        <!-- Toplam Borç -->
        <div class="app-card col-span-1">
          <div class="flex items-start justify-between mb-3">
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Toplam Borç</p>
            <div
              class="p-2 rounded-xl"
              :class="totalDebt > 0 ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-green-50 dark:bg-green-900/20 text-green-500'"
            >
              <svg v-if="totalDebt > 0" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p
            class="text-3xl font-black tabular-nums"
            :class="totalDebt > 0 ? 'text-red-500' : 'text-green-500'"
          >
            {{ formatCurrency(totalDebt) }}
          </p>
          <span
            class="mt-2 inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            :class="totalDebt > 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'"
          >
            {{ totalDebt > 0 ? 'Ödeme Bekliyor' : 'Borç Bulunmuyor' }}
          </span>
        </div>

        <!-- Vadesi Geçen -->
        <div class="app-card">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-500 shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Vadesi Geçen</p>
          </div>
          <div class="flex items-baseline gap-2">
            <p class="text-2xl font-bold text-slate-800 dark:text-white tabular-nums">{{ formatCurrency(overdueDebt) }}</p>
            <span v-if="overdueItems.length > 0" class="text-xs font-bold text-red-500">{{ overdueItems.length }} kalem</span>
          </div>
        </div>

        <!-- Son Ödeme -->
        <div class="app-card">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Son Ödeme</p>
          </div>
          <p class="text-xl font-bold text-slate-800 dark:text-white">{{ lastPaymentDate || 'Bilinmiyor' }}</p>
          <p v-if="lastPaymentAmount > 0" class="text-xs text-slate-400 dark:text-slate-500 mt-0.5 tabular-nums">{{ formatCurrency(lastPaymentAmount) }}</p>
        </div>
      </div>

      <!-- Firma Bilgi Kartı -->
      <div v-if="tenantInfo || authStore.companyName" class="app-card mb-4">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div class="w-9 h-9 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
              <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Firma Bilgileri</p>
              <p class="text-sm font-bold text-slate-800 dark:text-white truncate">{{ tenantInfo?.companyName || authStore.companyName }}</p>
            </div>
          </div>
          <div v-if="tenantInfo" class="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span v-if="tenantInfo.identityNumber">
              <span class="font-semibold text-slate-600 dark:text-slate-300">VKN:</span> {{ tenantInfo.identityNumber }}
            </span>
            <span v-if="tenantInfo.contactPersonPhone">
              <span class="font-semibold text-slate-600 dark:text-slate-300">Tel:</span> {{ tenantInfo.contactPersonPhone }}
            </span>
            <span v-if="tenantInfo.contactPersonEmail">
              <span class="font-semibold text-slate-600 dark:text-slate-300">E-posta:</span> {{ tenantInfo.contactPersonEmail }}
            </span>
            <span v-if="tenantInfo.flats?.length > 0">
              <span class="font-semibold text-slate-600 dark:text-slate-300">Ünite:</span> {{ tenantInfo.flats.map(f => f.code).join(', ') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Bekleyen Borç Listesi -->
      <div class="app-card !p-0 overflow-hidden">
        <div class="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Bekleyen Borçlar</h2>
          <router-link to="/my-payments" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Tümünü Gör
          </router-link>
        </div>

        <div v-if="pendingDebts.length > 0" class="divide-y divide-slate-100 dark:divide-slate-700/60">
          <div
            v-for="debt in pendingDebts"
            :key="debt.id"
            class="table-row-hover px-5 py-3.5 flex items-center justify-between gap-4"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" :class="getDebtTypeClass(debt.type)">
                <!-- Aidat -->
                <svg v-if="[0,'Aidat'].includes(debt.type)" class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <!-- Elektrik -->
                <svg v-else-if="[1,'Electricity'].includes(debt.type)" class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <!-- Su -->
                <svg v-else-if="[2,'Water'].includes(debt.type)" class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10C22 6.48 17.52 2 12 2zm-1 14H9V8l5 5-3 3zm3-3l-3-3V7h2l1 4z" />
                </svg>
                <!-- Diğer -->
                <svg v-else class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{{ getDebtTypeLabel(debt.type) }}</p>
                <p class="text-xs text-slate-400 dark:text-slate-500">Vade: {{ formatDate(debt.dueDate) }}</p>
              </div>
            </div>
            <div class="text-right shrink-0">
              <p class="text-sm font-bold text-slate-800 dark:text-slate-100 tabular-nums">{{ formatCurrency(debt.remainingAmount ?? debt.amount ?? 0) }}</p>
              <span class="text-[10px] text-slate-400 dark:text-slate-500">{{ debt.periodMonth }}/{{ debt.periodYear }}</span>
            </div>
          </div>
        </div>

        <!-- Boş Durum -->
        <div v-else class="py-12 flex flex-col items-center text-center">
          <div class="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center mb-3">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">Tebrikler!</p>
          <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Ödenmemiş borcunuz bulunmamaktadır.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import utilityDebtsService from '@/services/utilityDebtsService'
import paymentsService from '@/services/paymentsService'
import tenantsService from '@/services/tenantsService'
import { formatCurrency } from '@/utils/currencyUtils'

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
  return debts.value.filter(d => (!d.dueDate || new Date(d.dueDate) < now) && d.status?.toLowerCase() !== 'paid')
})

const overdueDebt = computed(() =>
  overdueItems.value.reduce((sum, d) => sum + Number(d.remainingAmount ?? d.amount ?? 0), 0)
)

const pendingDebts = computed(() =>
  debts.value
    .filter(d => d.status?.toLowerCase() !== 'paid')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)
)

const lastPayment = computed(() => 
  payments.value.length > 0 ? payments.value.sort((a, b) => new Date(b.paymentDate || b.date) - new Date(a.paymentDate || a.date))[0] : null
)

const lastPaymentDate = computed(() => {
  if (!lastPayment.value) return null
  return formatDate(lastPayment.value.paymentDate || lastPayment.value.date)
})

const lastPaymentAmount = computed(() => lastPayment.value?.amount || 0)

const loadData = async () => {
  loading.value = true
  try {
    const tenantId = authStore.companyId
    
    // Gelişmiş Bilgi Sorğuları
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
  const types = { 0: 'Aidat', 1: 'Elektrik', 2: 'Su', 'Aidat': 'Aidat', 'Electricity': 'Elektrik', 'Water': 'Su' }
  return types[type] || 'Diğer Borç'
}

const getDebtTypeIcon = (type) => {
  const icons = { 0: '📋', 1: '⚡', 2: '💧', 'Aidat': '📋', 'Electricity': '⚡', 'Water': '💧' }
  return icons[type] || '💰'
}

const getDebtTypeClass = (type) => {
  const classes = { 
    0: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    1: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400', 
    2: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    'Aidat': 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    'Electricity': 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400', 
    'Water': 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
  }
  return classes[type] || 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400'
}

onMounted(() => {
  loadData()
})
</script>

