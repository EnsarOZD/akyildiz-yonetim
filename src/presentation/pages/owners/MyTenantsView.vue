<template>
  <div class="p-4 sm:p-6 min-h-screen pb-24 md:pb-6">
    <div class="max-w-4xl mx-auto">

      <PageHeader title="Kiracılarım" subtitle="Mülklerinizdeki kiracıların durumu ve bakiye özeti">
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </template>
      </PageHeader>

      <!-- Loading -->
      <div v-if="loading" class="space-y-3 mt-6">
        <div v-for="i in 3" :key="i" class="app-card p-5 animate-pulse h-20"></div>
      </div>

      <template v-else>
        <!-- Boş durum -->
        <div v-if="occupiedFlats.length === 0" class="app-card p-12 text-center mt-6">
          <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <p class="font-semibold text-slate-700 dark:text-slate-300">Şu an aktif kiracınız bulunmamaktadır.</p>
          <p class="text-sm text-slate-400 mt-1">Mülkleriniz boş veya kiracı bilgisi eklenmemiş.</p>
        </div>

        <!-- Kiracı listesi -->
        <div v-else class="space-y-3 mt-6">
          <!-- Özet -->
          <div class="grid grid-cols-2 gap-3 mb-5">
            <div class="app-card p-4 border-l-4 border-l-emerald-500">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Aktif Kiracı</p>
              <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400">{{ occupiedFlats.length }}</p>
            </div>
            <div class="app-card p-4 border-l-4 border-l-blue-500">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Toplam Kiracı Borcu</p>
              <p class="text-2xl font-black text-blue-600 dark:text-blue-400">{{ formatCurrency(totalTenantDebt) }}</p>
            </div>
          </div>

          <div
            v-for="flat in occupiedFlats"
            :key="flat.flatId"
            class="app-card p-5 transition-all hover:shadow-md"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-bold text-slate-800 dark:text-slate-100">{{ flat.tenantName }}</p>
                  <p class="text-xs text-slate-400 font-medium mt-0.5">Ünite: <span class="text-slate-600 dark:text-slate-300 font-bold">{{ flat.code }}</span></p>
                </div>
              </div>

              <div class="text-right shrink-0">
                <p v-if="getTenantDebt(flat.flatId) > 0" class="text-sm font-black text-red-500">
                  {{ formatCurrency(getTenantDebt(flat.flatId)) }}
                </p>
                <p v-else class="text-sm font-black text-emerald-500">Borç Yok</p>
                <p class="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Bakiye</p>
              </div>
            </div>

            <!-- Borç kalemleri -->
            <div v-if="getFlatDebts(flat.flatId).length > 0" class="mt-4 space-y-1.5 border-t border-slate-100 dark:border-slate-700 pt-3">
              <div
                v-for="debt in getFlatDebts(flat.flatId)"
                :key="debt.id"
                class="flex items-center justify-between text-xs"
              >
                <span class="text-slate-500 flex items-center gap-1.5">
                  <span>{{ debtTypeIcon(debt.type) }}</span>
                  <span>{{ debtTypeLabel(debt.type) }} · {{ debt.periodMonth }}/{{ debt.periodYear }}</span>
                  <span v-if="debt.isOverdue" class="badge badge-error badge-xs text-white font-bold">Gecikmiş</span>
                </span>
                <span class="font-bold text-slate-700 dark:text-slate-300">{{ formatCurrency(debt.remainingAmount) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Boş üniteler özeti -->
        <div v-if="emptyFlats.length > 0" class="mt-8">
          <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Boş Üniteler ({{ emptyFlats.length }})</h3>
          <div class="app-card divide-y divide-slate-50 dark:divide-slate-800">
            <div v-for="flat in emptyFlats" :key="flat.flatId" class="px-4 py-3 flex items-center justify-between">
              <span class="text-sm font-semibold text-slate-600 dark:text-slate-300">Ünite {{ flat.code }}</span>
              <span v-if="getOwnerDebt(flat.flatId) > 0" class="text-sm font-bold text-amber-500">{{ formatCurrency(getOwnerDebt(flat.flatId)) }}</span>
              <span v-else class="text-xs text-slate-400">Borç yok</span>
            </div>
          </div>
        </div>
      </template>
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
const properties = ref([])
const debts = ref([])

const occupiedFlats = computed(() => properties.value.filter(p => p.isOccupied))
const emptyFlats    = computed(() => properties.value.filter(p => !p.isOccupied))

const totalTenantDebt = computed(() =>
  debts.value.filter(d => !d.isVacantDebt).reduce((s, d) => s + Number(d.remainingAmount || 0), 0)
)

const getFlatDebts  = (flatId) => debts.value.filter(d => d.flatId === flatId && !d.isVacantDebt)
const getOwnerDebt  = (flatId) => debts.value.filter(d => d.flatId === flatId && d.isVacantDebt).reduce((s, d) => s + Number(d.remainingAmount || 0), 0)
const getTenantDebt = (flatId) => getFlatDebts(flatId).reduce((s, d) => s + Number(d.remainingAmount || 0), 0)

const debtTypeLabel = (t) => ({ Aidat: 'Aidat', Electricity: 'Elektrik', Water: 'Su' }[t] ?? 'Diğer')
const debtTypeIcon  = (t) => ({ Aidat: '📋', Electricity: '⚡', Water: '💧' }[t] ?? '💰')

const loadData = async () => {
  try {
    const result = await dashboardService.getOwnerDashboard()
    if (result) {
      properties.value = result.myProperties || []
      debts.value      = result.myDebts || []
    }
  } catch (e) {
    console.error('Kiracı verisi yüklenemedi:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (authStore.isInitialized) {
    loadData()
  } else {
    const stop = watch(() => authStore.isInitialized, (ready) => {
      if (ready) { stop(); loadData() }
    })
  }
})
</script>
