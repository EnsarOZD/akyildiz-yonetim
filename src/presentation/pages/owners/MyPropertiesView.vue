<template>
  <div class="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen pb-20 md:pb-6">
    <div class="max-w-5xl mx-auto">

      <!-- Başlık -->
      <PageHeader :title="`Hoş Geldiniz, ${authStore.fullName}`" subtitle="Mülklerinize ait aidat ve ödeme durumu aşağıda görüntülenmektedir.">
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </template>
      </PageHeader>

      <!-- Özet Kartları -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <!-- Toplam Borç -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Toplam Borç</p>
          <p
            class="text-3xl font-black"
            :class="totalDebt > 0 ? 'text-red-500' : 'text-green-500'"
          >
            {{ formatCurrency(totalDebt) }}
          </p>
          <span
            class="mt-2 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            :class="totalDebt > 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'"
          >
            {{ totalDebt > 0 ? 'Ödeme Bekliyor' : 'Borç Yok' }}
          </span>
        </div>

        <!-- Vadesi Geçen -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Vadesi Geçen</p>
          <p class="text-3xl font-black" :class="overdueDebt > 0 ? 'text-orange-500' : 'text-gray-300 dark:text-gray-600'">
            {{ formatCurrency(overdueDebt) }}
          </p>
          <p class="mt-2 text-xs text-gray-400">
            {{ overdueItems.length > 0 ? `${overdueItems.length} kalem gecikmiş` : 'Gecikmiş kalem yok' }}
          </p>
        </div>

        <!-- Son Ödeme -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Son Ödeme</p>
          <p class="text-xl font-bold text-gray-800 dark:text-white mt-1">
            {{ lastPaymentDate || '—' }}
          </p>
          <p v-if="lastPaymentAmount > 0" class="mt-1 text-xs text-gray-400">
            {{ formatCurrency(lastPaymentAmount) }}
          </p>
          <p v-else class="mt-1 text-xs text-gray-400">Henüz ödeme kaydı yok</p>
        </div>
      </div>

      <!-- Bekleyen Borçlar -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-base font-bold text-gray-800 dark:text-white">Bekleyen Borçlar</h2>
          <span v-if="pendingDebts.length > 0" class="badge badge-warning badge-sm">{{ pendingDebts.length }} kalem</span>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="p-8 text-center">
          <span class="loading loading-spinner loading-md text-primary"></span>
        </div>

        <!-- Boş durum -->
        <div v-else-if="pendingDebts.length === 0" class="p-12 text-center">
          <div class="w-14 h-14 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p class="font-semibold text-gray-700 dark:text-gray-300">Tebrikler!</p>
          <p class="text-sm text-gray-400 mt-1">Ödenmemiş borcunuz bulunmamaktadır.</p>
        </div>

        <!-- Liste -->
        <div v-else class="divide-y divide-gray-50 dark:divide-gray-700">
          <div
            v-for="debt in pendingDebts"
            :key="debt.id"
            class="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
          >
            <div class="flex items-center gap-4">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0" :class="debtTypeClass(debt.type)">
                {{ debtTypeIcon(debt.type) }}
              </div>
              <div>
                <p class="font-semibold text-sm text-gray-800 dark:text-white">{{ debtTypeLabel(debt.type) }}</p>
                <p class="text-xs text-gray-400">
                  {{ debt.periodMonth }}/{{ debt.periodYear }}
                  <span v-if="debt.flatCode" class="ml-1 text-gray-300 dark:text-gray-600">·</span>
                  <span v-if="debt.flatCode" class="ml-1">Ünite {{ debt.flatCode }}</span>
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(debt.remainingAmount) }}</p>
              <span
                v-if="isOverdue(debt)"
                class="badge badge-error badge-xs text-white"
              >Gecikmiş</span>
              <p v-else class="text-[10px] text-gray-400">Vade: {{ formatDate(debt.dueDate) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Son Ödemeler -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-base font-bold text-gray-800 dark:text-white">Son Ödemeler</h2>
        </div>

        <div v-if="loading" class="p-8 text-center">
          <span class="loading loading-spinner loading-md text-primary"></span>
        </div>

        <div v-else-if="recentPayments.length === 0" class="p-10 text-center text-sm text-gray-400">
          Henüz ödeme kaydı bulunmuyor.
        </div>

        <div v-else class="divide-y divide-gray-50 dark:divide-gray-700">
          <div
            v-for="payment in recentPayments"
            :key="payment.id"
            class="px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
          >
            <div>
              <p class="text-sm font-semibold text-gray-800 dark:text-white">
                {{ payment.description || payment.type || 'Ödeme' }}
              </p>
              <p class="text-xs text-gray-400">{{ formatDate(payment.paymentDate || payment.date) }}</p>
            </div>
            <span class="font-bold text-green-600 dark:text-green-400">+{{ formatCurrency(payment.amount) }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import dashboardService from '@/infrastructure/services/dashboardService'
import { useAuthStore } from '@/application/stores/auth'
import { formatCurrency } from '@/core/utils/currencyUtils'

const authStore = useAuthStore()
const loading = ref(true)
const debts = ref([])
const payments = ref([])

// ─── Computed ────────────────────────────────────────────────────────────────

const pendingDebts = computed(() =>
  debts.value
    .filter(d => d.status !== 'paid' && d.status !== 'Paid')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
)

const totalDebt = computed(() =>
  pendingDebts.value.reduce((sum, d) => sum + Number(d.remainingAmount || 0), 0)
)

const overdueItems = computed(() => {
  const now = new Date()
  return pendingDebts.value.filter(d => !d.dueDate || new Date(d.dueDate) < now)
})

const overdueDebt = computed(() =>
  overdueItems.value.reduce((sum, d) => sum + Number(d.remainingAmount || 0), 0)
)

const recentPayments = computed(() =>
  [...payments.value]
    .sort((a, b) => new Date(b.paymentDate || b.date) - new Date(a.paymentDate || a.date))
    .slice(0, 8)
)

const lastPayment = computed(() => recentPayments.value[0] ?? null)
const lastPaymentDate = computed(() => lastPayment.value ? formatDate(lastPayment.value.paymentDate || lastPayment.value.date) : null)
const lastPaymentAmount = computed(() => lastPayment.value?.amount ?? 0)

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isOverdue = (debt) => debt.dueDate && new Date(debt.dueDate) < new Date()

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const debtTypeLabel = (type) => {
  const map = { 0: 'Aidat', 1: 'Elektrik', 2: 'Su', Aidat: 'Aidat', Electricity: 'Elektrik', Water: 'Su' }
  return map[type] ?? 'Diğer'
}

const debtTypeIcon = (type) => {
  const map = { 0: '📋', 1: '⚡', 2: '💧', Aidat: '📋', Electricity: '⚡', Water: '💧' }
  return map[type] ?? '💰'
}

const debtTypeClass = (type) => {
  const map = {
    0: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
    1: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
    2: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
    Aidat: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
    Electricity: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
    Water: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
  }
  return map[type] ?? 'bg-gray-50 dark:bg-gray-700 text-gray-500'
}

// ─── Data ────────────────────────────────────────────────────────────────────

const loadData = async () => {
  loading.value = true
  try {
    const result = await dashboardService.getOwnerDashboard()
    // myDebts comes pre-filtered (Status != Paid) from the backend
    debts.value    = result?.myDebts        || []
    payments.value = result?.recentPayments || []
  } catch (error) {
    console.error('Mülk verisi yüklenirken hata:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Wait for auth to finish initializing before fetching data.
  if (authStore.isInitialized) {
    loadData()
  } else {
    const stop = watch(() => authStore.isInitialized, (ready) => {
      if (ready) { stop(); loadData() }
    })
  }
})
</script>
