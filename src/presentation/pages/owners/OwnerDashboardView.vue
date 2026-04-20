<template>
  <div class="p-4 sm:p-10 min-h-screen pb-24 md:pb-10 transition-all duration-500">
    <div class="max-w-6xl mx-auto space-y-8">

      <!-- ─── Row 1: Page Header ─── -->
      <PageHeader
        title="Mülk Yönetim Merkezi"
        :subtitle="`Merhaba ${authStore.fullName} | Portföy Yönetimi`"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
        </template>
      </PageHeader>

      <!-- ─── Row 2: Portfolio Stats ─── -->
      <section v-if="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
        <div class="app-card border-none bg-slate-50 dark:bg-white/[0.02] p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="text-premium-label mb-1">Boş Ünite Borcu</p>
            <p class="text-xl font-black text-rose-500">{{ formatCurrency(data.totalOwnerDebt) }}</p>
          </div>
        </div>

        <div class="app-card border-none bg-slate-50 dark:bg-white/[0.02] p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <div>
            <p class="text-premium-label mb-1">Kiracı Bakiyesi</p>
            <p class="text-xl font-black text-slate-800 dark:text-white">{{ formatCurrency(data.totalTenantDebt) }}</p>
          </div>
        </div>

        <div class="app-card border-none bg-slate-50 dark:bg-white/[0.02] p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
          </div>
          <div>
            <p class="text-premium-label mb-1">Geciken Kalem</p>
            <p class="text-xl font-black text-amber-500">{{ data.overdueCount }} Adet</p>
          </div>
        </div>

        <div class="app-card-premium p-5 flex items-center gap-4 border-none bg-brand-gradient shadow-brand-500/20">
          <div class="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          </div>
          <div>
            <p class="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Toplam Ünite</p>
            <p class="text-xl font-black text-white">{{ data.myProperties.length }} Ünite</p>
          </div>
        </div>
      </section>

      <!-- Skeleton Loading -->
      <section v-if="loading" class="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
        <div v-for="i in 4" :key="i" class="app-card h-32 border-none bg-slate-100 dark:bg-white/[0.02]"></div>
      </section>

      <!-- ─── Row 3: Master-Detail Explorer ─── -->
      <section v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-slide-up">
        
        <!-- Master List: Properties -->
        <div class="lg:col-span-5 space-y-4">
          <div class="flex items-center justify-between px-1">
             <h2 class="text-premium-label italic">Portföy Listesi</h2>
             <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ data.myProperties.length }} Ünite</span>
          </div>

          <div class="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="prop in data.myProperties" :key="prop.flatId"
              @click="selectedFlatId = prop.flatId"
              :class="[
                'app-card p-5 cursor-pointer transition-all duration-500 border border-transparent group relative overflow-hidden',
                selectedFlatId === prop.flatId 
                  ? 'bg-white dark:bg-white/[0.05] border-brand-500/30 shadow-2xl shadow-brand-500/10 scale-[1.02]' 
                  : 'bg-slate-50 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/[0.04]'
              ]">
              
              <!-- Active Indicator -->
              <div class="absolute left-0 top-0 bottom-0 w-1 transition-all duration-500" 
                :class="selectedFlatId === prop.flatId ? 'bg-brand-500 h-full' : 'bg-transparent h-0'"></div>

              <div class="flex items-center justify-between relative z-10">
                <div class="flex items-center gap-4">
                  <div :class="[
                    'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm',
                    selectedFlatId === prop.flatId ? 'bg-brand-gradient text-white rotate-6' : 'bg-white dark:bg-white/5 text-slate-400'
                  ]">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                  </div>
                  <div>
                    <h3 class="text-[15px] font-black tracking-tight" :class="selectedFlatId === prop.flatId ? 'text-brand-500' : 'text-slate-800 dark:text-white'">
                       NO: {{ prop.code }}
                    </h3>
                    <p class="text-[10px] font-bold uppercase tracking-widest mt-1" :class="prop.isOccupied ? 'text-emerald-500' : 'text-slate-400'">
                      {{ prop.isOccupied ? prop.tenantName : 'Boş / Müsait' }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-black" :class="getPropertyDebtTotal(prop.flatId) > 0 ? 'text-rose-500' : 'text-slate-400'">
                    {{ formatCurrency(getPropertyDebtTotal(prop.flatId)) }}
                  </p>
                  <p class="text-[9px] font-black uppercase text-slate-400 mt-1">TOPLAM BORÇ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detail Panel: Property Finance -->
        <div class="lg:col-span-7">
          <transition name="fade-slide" mode="out-in">
            <div v-if="selectedFlat" :key="selectedFlat.flatId" class="app-card !p-0 overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-none border-none h-full">
              <!-- Detail Hero Section -->
              <div class="p-8 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/[0.05]">
                <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div class="flex items-center gap-6">
                    <div class="w-16 h-16 rounded-3xl bg-brand-gradient text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                    </div>
                    <div>
                      <h2 class="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase italic">Ünite {{ selectedFlat.code }}</h2>
                      <div class="flex items-center gap-3 mt-2">
                         <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" :class="selectedFlat.isOccupied ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-200 dark:bg-white/5 text-slate-400'">
                            {{ selectedFlat.isOccupied ? 'Dolu / Kiracılı' : 'Boş / Müsait' }}
                         </span>
                         <span v-if="getPropertyDebtTotal(selectedFlat.flatId) > 0" class="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">Borçlu</span>
                      </div>
                    </div>
                  </div>
                  <div class="text-center sm:text-right">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Cari Hesap Toplamı</p>
                    <p class="text-3xl font-black text-slate-800 dark:text-white">{{ formatCurrency(getPropertyDebtTotal(selectedFlat.flatId)) }}</p>
                  </div>
                </div>
              </div>

              <!-- Detailed Debts Ledger -->
              <div class="p-6">
                <div v-if="selectedPropertyDebts.length === 0" class="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div class="w-16 h-16 rounded-3xl bg-emerald-500/5 text-emerald-500 flex items-center justify-center">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <p class="text-sm font-black text-slate-400 uppercase tracking-widest">Sıfır Bakiye / Borç Bulunmuyor</p>
                </div>
                
                <div v-else class="space-y-4">
                   <h3 class="text-premium-label px-1">Hesap Hareketleri</h3>
                   <div class="space-y-3">
                      <div v-for="debt in selectedPropertyDebts" :key="debt.id" 
                        class="p-5 flex items-center justify-between bg-slate-50 dark:bg-white/[0.02] rounded-2xl group hover:scale-[1.01] transition-all">
                        <div class="flex items-center gap-5">
                          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg" :class="debtTypeClass(debt.type)">
                            {{ debtTypeIcon(debt.type) }}
                          </div>
                          <div>
                            <p class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{{ debtTypeLabel(debt.type) }}</p>
                            <p class="text-[10px] font-black uppercase tracking-widest mt-1">
                              {{ debt.periodMonth }}/{{ debt.periodYear }}
                              <span class="mx-2 text-slate-300 dark:text-white/10">|</span>
                              <span :class="debt.isVacantDebt ? 'text-amber-500' : 'text-slate-400'">{{ debt.isVacantDebt ? 'MÜLK SAHİBİ BORCU' : 'KİRACI BORCU' }}</span>
                            </p>
                          </div>
                        </div>
                        <div class="text-right">
                          <p class="text-[15px] font-black text-rose-500">- {{ formatCurrency(debt.remainingAmount) }}</p>
                          <p class="text-[9px] font-black text-slate-400 uppercase mt-1">{{ formatDate(debt.dueDate) }}</p>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <!-- Empty Selection Placeholder -->
            <div v-else class="app-card h-[600px] flex flex-col items-center justify-center p-12 text-center border-dashed border-2 border-slate-200 dark:border-white/[0.05] bg-slate-50/30 dark:bg-transparent">
              <div class="w-24 h-24 rounded-full bg-slate-100 dark:bg-white/5 text-slate-300 flex items-center justify-center mb-8 relative">
                 <div class="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-white/10 animate-[ping_3s_linear_infinite]"></div>
                 <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
              </div>
              <h3 class="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">İzleme Merkezi</h3>
              <p class="text-xs font-bold text-slate-400 mt-3 max-w-[280px] uppercase tracking-widest leading-relaxed">Detaylı finansal verileri ve borç durumunu görmek için sol listeden bir ünite seçin.</p>
            </div>
          </transition>
        </div>
      </section>

      <!-- ─── Row 4: Recent Payments Tracking ─── -->
      <section class="space-y-4 animate-slide-up">
        <h2 class="text-premium-label italic px-1">Gelen Tahsilatlar (Son Dönem)</h2>
        <div class="app-card !p-0 overflow-hidden shadow-xl shadow-slate-200 dark:shadow-none border-none">
          <div v-if="data.recentPayments.length === 0" class="p-12 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">Henüz bir ödeme kaydı bulunmamaktadır.</div>
          <div v-else class="divide-y divide-slate-100 dark:divide-white/[0.05]">
            <div v-for="p in data.recentPayments" :key="p.id" class="p-6 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all">
              <div class="flex items-center gap-5">
                <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center transition-transform group-hover:rotate-12">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <p class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{{ p.description || p.type || 'Sistem Tahsilatı' }}</p>
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{{ formatDate(p.paymentDate) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xl font-black text-emerald-500 tracking-tighter shadow-sm">+ {{ formatCurrency(p.amount) }}</p>
                <div class="flex items-center justify-end gap-1 mt-1">
                  <div class="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span class="text-[9px] font-black text-emerald-500 uppercase">Onaylandı</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
