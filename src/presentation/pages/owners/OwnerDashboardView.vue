<template>
  <div class="p-4 sm:p-6 min-h-screen pb-24 md:pb-6">
    <div class="max-w-4xl mx-auto">

      <PageHeader :title="`Hoş Geldiniz, ${authStore.fullName}`" subtitle="Mülklerinize ait borç ve kiracı durumu">
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </template>
      </PageHeader>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div v-for="i in 3" :key="i" class="app-card p-5 animate-pulse">
          <div class="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/2 mb-3"></div>
          <div class="h-7 bg-slate-100 dark:bg-slate-700 rounded w-2/3"></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="app-card p-5 border-red-200 dark:border-red-800/50 mb-6">
        <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        <button @click="loadData" class="mt-2 text-xs font-semibold text-blue-600 hover:underline">Tekrar dene</button>
      </div>

      <template v-else>
        <!-- Özet Kartları -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="app-card p-5">
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Toplam Borcum</p>
            <p class="text-2xl font-bold" :class="data.totalOwnerDebt > 0 ? 'text-red-500' : 'text-emerald-500'">
              {{ formatCurrency(data.totalOwnerDebt) }}
            </p>
            <span class="mt-2 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              :class="data.totalOwnerDebt > 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'">
              {{ data.totalOwnerDebt > 0 ? 'Ödeme Bekliyor' : 'Borç Yok' }}
            </span>
          </div>

          <div class="app-card p-5">
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Gecikmiş Kalem</p>
            <p class="text-2xl font-bold" :class="data.overdueCount > 0 ? 'text-orange-500' : 'text-slate-300 dark:text-slate-600'">
              {{ data.overdueCount }}
            </p>
            <p class="mt-2 text-xs text-slate-400">{{ data.overdueCount > 0 ? 'adet vadesi geçmiş' : 'Gecikmiş kalem yok' }}</p>
          </div>

          <div class="app-card p-5">
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Kiracı Sayısı</p>
            <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ data.myTenants.length }}</p>
            <p class="mt-2 text-xs text-slate-400">aktif kiracı</p>
          </div>
        </div>

        <!-- Borçlarım -->
        <div class="app-card overflow-hidden mb-5">
          <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-800 dark:text-slate-100">Bekleyen Borçlarım</h2>
            <span v-if="data.myDebts.length > 0" class="badge badge-warning badge-sm">{{ data.myDebts.length }} kalem</span>
          </div>

          <div v-if="data.myDebts.length === 0" class="px-5 py-10 flex flex-col items-center gap-2">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-300">Ödenmemiş borcunuz bulunmamaktadır.</p>
          </div>

          <div v-else class="divide-y divide-slate-50 dark:divide-slate-800">
            <div v-for="debt in data.myDebts" :key="debt.id"
              class="px-5 py-3.5 flex items-center justify-between table-row-hover">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
                  :class="debtTypeClass(debt.type)">
                  {{ debtTypeIcon(debt.type) }}
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ debtTypeLabel(debt.type) }}</p>
                  <p class="text-xs text-slate-400">{{ debt.periodMonth }}/{{ debt.periodYear }}
                    <span v-if="debt.flatCode" class="ml-1">· {{ debt.flatCode }}</span>
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-slate-900 dark:text-white">{{ formatCurrency(debt.remainingAmount) }}</p>
                <span v-if="debt.isOverdue" class="badge badge-error badge-xs text-white">Gecikmiş</span>
                <p v-else class="text-[10px] text-slate-400">{{ formatDate(debt.dueDate) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Kiracılarım -->
        <div class="app-card overflow-hidden mb-5" v-if="data.myTenants.length > 0">
          <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 class="text-sm font-semibold text-slate-800 dark:text-slate-100">Kiracılarım</h2>
          </div>
          <div class="divide-y divide-slate-50 dark:divide-slate-800">
            <div v-for="tenant in data.myTenants" :key="tenant.tenantId"
              class="px-5 py-3.5 flex items-center justify-between table-row-hover">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ tenant.displayName }}</p>
                  <p v-if="tenant.flatCode" class="text-xs text-slate-400">{{ tenant.flatCode }}</p>
                </div>
              </div>
              <span :class="tenant.isActive ? 'badge badge-success badge-sm' : 'badge badge-ghost badge-sm'">
                {{ tenant.isActive ? 'Aktif' : 'Pasif' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Son Ödemeler -->
        <div class="app-card overflow-hidden" v-if="data.recentPayments.length > 0">
          <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 class="text-sm font-semibold text-slate-800 dark:text-slate-100">Son Ödemelerim</h2>
          </div>
          <div class="divide-y divide-slate-50 dark:divide-slate-800">
            <div v-for="p in data.recentPayments" :key="p.id"
              class="px-5 py-3 flex items-center justify-between table-row-hover">
              <div>
                <p class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ p.description || p.type || 'Ödeme' }}</p>
                <p class="text-xs text-slate-400">{{ formatDate(p.paymentDate) }}</p>
              </div>
              <span class="font-bold text-emerald-600 dark:text-emerald-400">+{{ formatCurrency(p.amount) }}</span>
            </div>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import { useAuthStore } from '@/application/stores/auth'
import dashboardService from '@/infrastructure/services/dashboardService'
import { formatCurrency } from '@/core/utils/currencyUtils'

const authStore = useAuthStore()
const loading = ref(true)
const error = ref(null)
const data = ref({ myDebts: [], myTenants: [], recentPayments: [], totalOwnerDebt: 0, overdueCount: 0 })

const loadData = async () => {
  loading.value = true
  error.value = null
  try {
    const result = await dashboardService.getOwnerDashboard()
    data.value = result || data.value
  } catch (err) {
    console.error('Owner dashboard yüklenirken hata:', err)
    error.value = 'Veriler yüklenemedi. Lütfen sayfayı yenileyin.'
  } finally {
    loading.value = false
  }
}

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const debtTypeLabel = (t) => ({ Aidat: 'Aidat', Electricity: 'Elektrik', Water: 'Su' }[t] ?? 'Diğer')
const debtTypeIcon = (t) => ({ Aidat: '📋', Electricity: '⚡', Water: '💧' }[t] ?? '💰')
const debtTypeClass = (t) => ({
  Aidat: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
  Electricity: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
  Water: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
}[t] ?? 'bg-slate-50 dark:bg-slate-700 text-slate-500')

onMounted(loadData)
</script>
