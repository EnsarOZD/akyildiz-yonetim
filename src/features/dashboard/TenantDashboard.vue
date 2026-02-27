<template>
  <div class="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- Başlık -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Hoş Geldiniz, {{ authStore.fullName }}</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Mülkünüzün özet finansal durumu aşağıdadır.</p>
      </div>

      <!-- Özet Kartları -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Toplam Borç -->
        <div 
          class="card bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden group"
          :class="totalDebt > 0 ? 'hover:border-red-200 dark:hover:border-red-900' : 'hover:border-green-200 dark:hover:border-green-900'"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Toplam Borç</p>
              <h2 
                class="text-4xl font-black mt-2 transition-all"
                :class="totalDebt > 0 ? 'text-red-500' : 'text-green-500'"
              >
                {{ formatCurrency(totalDebt) }}
              </h2>
            </div>
            <div 
              class="p-3 rounded-2xl transition-all"
              :class="totalDebt > 0 ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'"
            >
              <svg v-if="totalDebt > 0" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center gap-2">
            <span 
              class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              :class="totalDebt > 0 ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'"
            >
              {{ totalDebt > 0 ? 'Ödeme Bekliyor' : 'Borç Bulunmuyor' }}
            </span>
          </div>
        </div>

        <!-- Vadesi Geçen -->
        <div class="card bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Vadesi Geçen Tutar</p>
              <div class="flex items-baseline gap-2">
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white mt-1">{{ formatCurrency(overdueDebt) }}</h3>
                <span v-if="overdueItems.length > 0" class="text-xs text-red-500 font-bold">({{ overdueItems.length }} Kalem)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Son Ödeme -->
        <div class="card bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Son Ödeme Tarihi</p>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white mt-1">{{ lastPaymentDate || 'Bilinmiyor' }}</h3>
              <p v-if="lastPaymentAmount > 0" class="text-xs text-gray-400">Tutar: {{ formatCurrency(lastPaymentAmount) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bekleyen Borç Listesi -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-lg font-bold text-gray-800 dark:text-white">Bekleyen Borçlar</h2>
          <router-link to="/my-payments" class="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline">Tümünü Gör</router-link>
        </div>
        
        <div v-if="pendingDebts.length > 0">
          <div v-for="debt in pendingDebts" :key="debt.id" class="px-6 py-4 border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div 
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  :class="getDebtTypeClass(debt.type)"
                >
                  {{ getDebtTypeIcon(debt.type) }}
                </div>
                <div>
                  <p class="font-bold text-gray-800 dark:text-white">{{ getDebtTypeLabel(debt.type) }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Vade: {{ formatDate(debt.dueDate) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-black text-gray-800 dark:text-white">{{ formatCurrency(debt.remainingAmount) }}</p>
                <span class="badge badge-sm badge-ghost">{{ debt.periodMonth }}/{{ debt.periodYear }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Boş Durum -->
        <div v-else class="p-12 text-center">
          <div class="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">Tebrikler!</h3>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Ödenmemiş borcunuz bulunmamaktadır.</p>
        </div>
      </div>

      <!-- Mobil Bildirimler Kısayolu -->
      <div class="mt-8 md:hidden">
        <router-link to="/notifications" class="btn btn-block bg-purple-600 hover:bg-purple-700 text-white border-none rounded-xl h-14 normal-case text-lg shadow-lg shadow-purple-200 dark:shadow-none transition-all active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Duyuruları Gör
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import utilityDebtsService from '@/services/utilityDebtsService'
import paymentsService from '@/services/paymentsService'
import { formatCurrency } from '@/utils/currencyUtils'

const authStore = useAuthStore()
const loading = ref(true)
const debts = ref([])
const payments = ref([])

const totalDebt = computed(() => 
  debts.value.reduce((sum, d) => sum + Number(d.remainingAmount || 0), 0)
)

const overdueItems = computed(() => {
  const now = new Date()
  return debts.value.filter(d => d.dueDate && new Date(d.dueDate) < now && d.status !== 'paid')
})

const overdueDebt = computed(() => 
  overdueItems.value.reduce((sum, d) => sum + Number(d.remainingAmount || 0), 0)
)

const pendingDebts = computed(() => 
  debts.value.filter(d => d.status !== 'paid').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5)
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
    const tenantId = authStore.user?.id
    if (tenantId) {
      // Borçları çek
      const debtData = await utilityDebtsService.getUtilityDebts({ tenantId })
      debts.value = debtData || []
      
      // Ödemeleri çek
      const paymentData = await paymentsService.getPayments({ tenantId })
      payments.value = paymentData || []
    }
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

<style scoped>
.card {
  @apply rounded-3xl transition-all duration-300;
}
</style>
