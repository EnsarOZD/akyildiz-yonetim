<template>
  <div class="p-4 sm:p-6 min-h-screen pb-24 md:pb-6">
    <div class="max-w-6xl mx-auto">

      <PageHeader :title="`Hoş Geldiniz, ${authStore.fullName}`" subtitle="Mülk portföyünüz ve finansal durum özeti">
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </template>
      </PageHeader>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div v-for="i in 4" :key="i" class="app-card p-6 animate-pulse h-32"></div>
      </div>

      <template v-else>
        <!-- Üst Özet Kartları -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="app-card p-6 bg-gradient-to-br from-white to-red-50/30 dark:from-slate-800 dark:to-red-900/5 border-l-4 border-l-red-500">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Ödeyeceğim Toplam (Boş Üniteler)</p>
            <p class="text-2xl font-black text-red-600 dark:text-red-400">{{ formatCurrency(data.totalOwnerDebt) }}</p>
            <div class="mt-3 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span class="text-[10px] font-bold text-red-500 uppercase italic">Ödeme Bekliyor</span>
            </div>
          </div>

          <div class="app-card p-6 border-l-4 border-l-blue-500">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Kiracı Toplam Bakiyesi</p>
            <p class="text-2xl font-black text-brand-600 dark:text-brand-400">{{ formatCurrency(data.totalTenantDebt) }}</p>
            <p class="mt-3 text-[10px] font-medium text-slate-500 italic">Bağımsız bölümlerdeki toplam alacak</p>
          </div>

          <div class="app-card p-6 border-l-4 border-l-amber-500">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Vadesi Geçmiş Kalem</p>
            <p class="text-2xl font-black text-amber-600 dark:text-amber-400">{{ data.overdueCount }}</p>
            <p class="mt-3 text-[10px] font-medium text-slate-500 italic">Acil kontrol edilmesi gerekenler</p>
          </div>

          <div class="app-card p-6 border-l-4 border-l-indigo-500">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Toplam Ünite</p>
            <p class="text-2xl font-black text-indigo-600 dark:text-indigo-400">{{ data.myProperties.length }}</p>
            <p class="mt-3 text-[10px] font-medium text-slate-500 italic">Portföyünüzdeki toplam mülk</p>
          </div>
        </div>

        <!-- Master-Detail Portföy Görünümü -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- Master: Property List -->
          <div class="lg:col-span-5 space-y-3">
            <div class="flex items-center justify-between mb-4 px-1">
              <h2 class="text-lg font-bold text-slate-800 dark:text-white font-cormorantSC tracking-wide">Mülk Portföyünüz</h2>
              <span class="text-[10px] font-bold text-slate-400 uppercase">{{ data.myProperties.length }} Ünite</span>
            </div>

            <div v-for="prop in data.myProperties" :key="prop.flatId"
              @click="selectedFlatId = prop.flatId"
              :class="[
                'app-card p-4 transition-all duration-300 cursor-pointer border-l-4 group',
                selectedFlatId === prop.flatId 
                  ? 'border-l-blue-600 shadow-lg shadow-blue-500/10 ring-1 ring-brand-500/20 translate-x-1' 
                  : 'border-l-transparent hover:border-l-slate-300 dark:hover:border-l-slate-700'
              ]">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div :class="[
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                    selectedFlatId === prop.flatId ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-[#151a2e] text-slate-400'
                  ]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-base font-bold text-slate-800 dark:text-[#f1f3f9] group-hover:text-brand-600 transition-colors">No: {{ prop.code }}</h3>
                    <p class="text-[10px] font-bold tracking-tight" :class="prop.isOccupied ? 'text-emerald-500' : 'text-slate-400'">
                      {{ prop.isOccupied ? `Kiracı: ${prop.tenantName}` : 'Daire Boş (Müstakil)' }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-xs font-black text-slate-700 dark:text-[#f1f3f9]">{{ formatCurrency(getPropertyDebtTotal(prop.flatId)) }}</p>
                  <p class="text-[9px] font-bold uppercase text-slate-400 mt-1">Borç Bakiyesi</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Detail: Property Finances -->
          <div class="lg:col-span-7">
            <template v-if="selectedFlat">
              <div class="app-card p-0 overflow-hidden min-h-[400px]">
                <!-- Detail Header -->
                <div class="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700/50">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <h2 class="text-2xl font-bold text-slate-900 dark:text-white font-cormorantSC">Ünite Detayı: {{ selectedFlat.code }}</h2>
                      <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs font-bold text-slate-500">Durum:</span>
                        <span :class="selectedFlat.isOccupied ? 'text-emerald-500' : 'text-slate-400'" class="text-xs font-bold uppercase tracking-wider">
                          {{ selectedFlat.isOccupied ? 'Kiracılı' : 'Boş / Kendi Kullanımı' }}
                        </span>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-xs font-bold text-slate-400 uppercase mb-1">Toplam Alacak</p>
                      <p class="text-2xl font-black text-slate-900 dark:text-white">{{ formatCurrency(getPropertyDebtTotal(selectedFlat.flatId)) }}</p>
                    </div>
                  </div>
                </div>

                <!-- Debts List for Selected Property -->
                <div class="p-0">
                  <div v-if="selectedPropertyDebts.length === 0" class="p-12 text-center">
                    <div class="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 mx-auto mb-3 flex items-center justify-center">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <p class="text-sm font-bold text-slate-700 dark:text-[#f1f3f9]">Bu üniteye ait borç bulunmamaktadır.</p>
                  </div>
                  
                  <div v-else class="divide-y divide-slate-50 dark:divide-white/[0.04]">
                    <div v-for="debt in selectedPropertyDebts" :key="debt.id" class="p-4 flex items-center justify-between transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs" :class="debtTypeClass(debt.type)">
                          {{ debtTypeIcon(debt.type) }}
                        </div>
                        <div>
                          <p class="text-sm font-bold text-slate-800 dark:text-[#f1f3f9]">{{ debtTypeLabel(debt.type) }}</p>
                          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            {{ debt.periodMonth }}/{{ debt.periodYear }} · 
                            <span :class="debt.isVacantDebt ? 'text-amber-600' : 'text-brand-500'">{{ debt.isVacantDebt ? 'Benim Borcum' : `Kiracı: ${debt.tenantName}` }}</span>
                          </p>
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="text-sm font-black text-slate-800 dark:text-white">{{ formatCurrency(debt.remainingAmount) }}</p>
                        <span v-if="debt.isOverdue" class="badge badge-error badge-xs font-bold text-white px-1.5 py-2">Vadesi Geçmiş</span>
                        <p v-else class="text-[9px] font-bold text-slate-400 uppercase">{{ formatDate(debt.dueDate) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- Boş Seçim Durumu -->
            <div v-else class="app-card h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50/30 dark:bg-slate-800/20 border-dashed border-2">
              <div class="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-[#151a2e] text-slate-300 flex items-center justify-center mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 class="text-base font-bold text-slate-700 dark:text-[#f1f3f9]">Portföy Detayı</h3>
              <p class="text-xs text-slate-500 mt-1 max-w-[240px]">Herhangi bir ünitenin detaylarını, kiracı durumunu ve borç geçmişini görmek için soldaki listeden seçim yapın.</p>
            </div>
          </div>
        </div>

        <!-- Son İşlemler (Ekranın en altı) -->
        <div class="mt-8">
          <h2 class="text-lg font-bold text-slate-800 dark:text-white font-cormorantSC mb-4 px-1">Son Ödemelerim</h2>
          <div class="app-card p-0 overflow-hidden">
            <div v-if="data.recentPayments.length === 0" class="p-8 text-center text-slate-400 italic text-sm">Henüz bir ödeme kaydı bulunmamaktadır.</div>
            <div v-else class="divide-y divide-slate-50 dark:divide-white/[0.04]">
              <div v-for="p in data.recentPayments" :key="p.id" class="p-4 flex items-center justify-between table-row-hover">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-800 dark:text-[#f1f3f9]">{{ p.description || p.type || 'Tahsilat' }}</p>
                    <p class="text-[10px] font-medium text-slate-400">{{ formatDate(p.paymentDate) }}</p>
                  </div>
                </div>
                <span class="text-base font-black text-emerald-600 dark:text-emerald-400">+{{ formatCurrency(p.amount) }}</span>
              </div>
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
import { useAuthStore } from '@/application/stores/auth'
import dashboardService from '@/infrastructure/services/dashboardService'
import { formatCurrency } from '@/core/utils/currencyUtils'

const authStore = useAuthStore()
const loading = ref(true)
const error = ref(null)
const data = ref({ 
  myDebts: [], 
  myTenants: [], 
  myProperties: [],
  recentPayments: [], 
  totalOwnerDebt: 0, 
  totalTenantDebt: 0,
  overdueCount: 0 
})

const selectedFlatId = ref(null)

const selectedFlat = computed(() => {
  if (!selectedFlatId.value) return null
  return data.value.myProperties.find(p => p.flatId === selectedFlatId.value)
})

const selectedPropertyDebts = computed(() => {
  if (!selectedFlatId.value) return []
  return data.value.myDebts.filter(d => d.flatId === selectedFlatId.value)
})

const loadData = async () => {
  loading.value = true
  error.value = null
  try {
    const result = await dashboardService.getOwnerDashboard()
    data.value = result || data.value
    
    // Default selection
    if (data.value.myProperties?.length > 0 && !selectedFlatId.value) {
      selectedFlatId.value = data.value.myProperties[0].flatId
    }
  } catch (err) {
    console.error('Owner dashboard yüklenirken hata:', err)
    error.value = 'Veriler yüklenemedi. Lütfen sayfayı yenileyin.'
  } finally {
    loading.value = false
  }
}

const getPropertyDebtTotal = (flatId) => {
  return data.value.myDebts
    .filter(d => d.flatId === flatId)
    .reduce((sum, d) => sum + d.remainingAmount, 0)
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
  Water: 'bg-brand-50 dark:bg-brand-500/[0.08] text-brand-600',
}[t] ?? 'bg-slate-50 dark:bg-[#1c2238] text-slate-500')

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

<style scoped>
.font-cormorantSC {
  font-family: 'Cormorant SC', serif;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.table-row-hover {
  transition: all 0.2s ease;
}
</style>
