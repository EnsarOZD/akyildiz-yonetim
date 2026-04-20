<template>
  <div class="p-4 sm:p-6 min-h-screen pb-20 md:pb-6">
    <div class="max-w-5xl mx-auto space-y-5">

      <!-- Başlık -->
      <PageHeader :title="`Hoş Geldiniz, ${authStore.fullName}`" subtitle="Mülklerinize ait borç ve ödeme durumu">
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </template>
      </PageHeader>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="app-card h-24 animate-pulse"></div>
      </div>

      <template v-else>
        <!-- ─── Özet Kartları ─── -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="app-card p-5" :class="ownerTotalDebt > 0 ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-emerald-500'">
            <p class="text-xs font-semibold text-slate-400 dark:text-[#9aa0b4] uppercase tracking-wider mb-1">Kendi Borcum</p>
            <p class="text-2xl font-black" :class="ownerTotalDebt > 0 ? 'text-red-500' : 'text-emerald-500'">
              {{ formatCurrency(ownerTotalDebt) }}
            </p>
            <span class="mt-2 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              :class="ownerTotalDebt > 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'">
              {{ ownerTotalDebt > 0 ? `${ownerDebts.length} kalem` : 'Borç Yok' }}
            </span>
          </div>

          <div class="app-card p-5">
            <p class="text-xs font-semibold text-slate-400 dark:text-[#9aa0b4] uppercase tracking-wider mb-1">Kiracı Borçları</p>
            <p class="text-2xl font-black text-amber-500">{{ formatCurrency(tenantTotalDebt) }}</p>
            <p class="mt-2 text-[10px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-wider">
              {{ tenantDebts.length }} kalem
            </p>
          </div>

          <div class="app-card p-5">
            <p class="text-xs font-semibold text-slate-400 dark:text-[#9aa0b4] uppercase tracking-wider mb-1">Vadesi Geçen</p>
            <p class="text-2xl font-black" :class="ownerOverdueDebt > 0 ? 'text-orange-500' : 'text-slate-300 dark:text-[#626885]'">
              {{ formatCurrency(ownerOverdueDebt) }}
            </p>
            <p class="mt-2 text-[10px] text-slate-400 dark:text-[#626885]">
              {{ ownerOverdueItems.length > 0 ? `${ownerOverdueItems.length} kalem gecikmiş` : 'Gecikmiş kalem yok' }}
            </p>
          </div>

          <div class="app-card p-5">
            <p class="text-xs font-semibold text-slate-400 dark:text-[#9aa0b4] uppercase tracking-wider mb-1">Son Ödeme</p>
            <p class="text-lg font-bold text-slate-800 dark:text-[#f1f3f9] mt-1 truncate">
              {{ lastPaymentDate || '—' }}
            </p>
            <p v-if="lastPaymentAmount > 0" class="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              {{ formatCurrency(lastPaymentAmount) }}
            </p>
            <p v-else class="mt-1 text-xs text-slate-400">Ödeme kaydı yok</p>
          </div>
        </div>

        <!-- ─── Kendi Borçlarım ─── -->
        <div class="app-card overflow-hidden">
          <!-- Header + Arama/Filtre -->
          <div class="px-5 py-4 border-b border-slate-100 dark:border-white/[0.05] space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-1 h-5 bg-red-500 rounded-full"></span>
                <h2 class="text-sm font-bold text-slate-800 dark:text-[#f1f3f9]">Kendi Borçlarım</h2>
              </div>
              <span v-if="ownerDebts.length > 0" class="badge-overdue text-[10px] font-bold px-2.5 py-1 rounded-full">
                {{ ownerDebts.length }} kalem
              </span>
            </div>

            <div v-if="ownerDebts.length > 0" class="flex flex-col sm:flex-row gap-2">
              <!-- Arama -->
              <div class="relative flex-1">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  v-model="ownerSearch"
                  @input="ownerPage = 1"
                  type="text"
                  placeholder="Ünite, tür veya dönem ara..."
                  class="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#151a2e] text-slate-700 dark:text-[#f1f3f9] placeholder-slate-400 dark:placeholder-[#626885] focus:outline-none focus:border-brand-500"
                />
              </div>
              <!-- Tür filtresi -->
              <select
                v-model="ownerTypeFilter"
                @change="ownerPage = 1"
                class="text-xs rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#151a2e] text-slate-700 dark:text-[#f1f3f9] px-3 py-2 focus:outline-none focus:border-brand-500">
                <option value="">Tüm Türler</option>
                <option value="Aidat">Aidat</option>
                <option value="Electricity">Elektrik</option>
                <option value="Water">Su</option>
              </select>
              <!-- Durum filtresi -->
              <select
                v-model="ownerStatusFilter"
                @change="ownerPage = 1"
                class="text-xs rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#151a2e] text-slate-700 dark:text-[#f1f3f9] px-3 py-2 focus:outline-none focus:border-brand-500">
                <option value="">Tüm Durumlar</option>
                <option value="overdue">Gecikmiş</option>
                <option value="upcoming">Vadesi Gelmemiş</option>
              </select>
            </div>
          </div>

          <div v-if="ownerDebts.length === 0" class="px-5 py-10 flex flex-col items-center gap-2 text-center">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="text-sm font-semibold text-slate-700 dark:text-[#f1f3f9]">Tebrikler!</p>
            <p class="text-xs text-slate-400">Ödenmemiş kişisel borcunuz bulunmamaktadır.</p>
          </div>

          <template v-else>
            <!-- Sonuç yok -->
            <div v-if="ownerFiltered.length === 0" class="px-5 py-8 text-center text-sm text-slate-400">
              Arama kriterlerine uygun borç bulunamadı.
            </div>

            <div v-else class="divide-y divide-slate-50 dark:divide-white/[0.03]">
              <div v-for="debt in ownerPaged" :key="debt.id"
                class="px-5 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0" :class="debtTypeClass(debt.type)">
                    {{ debtTypeIcon(debt.type) }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-slate-800 dark:text-[#f1f3f9]">{{ debtTypeLabel(debt.type) }}</p>
                    <p class="text-xs text-slate-400 dark:text-[#9aa0b4] mt-0.5">
                      {{ debt.periodMonth }}/{{ debt.periodYear }}
                      <span v-if="debt.flatCode" class="mx-1">·</span>
                      <span v-if="debt.flatCode">Ünite {{ debt.flatCode }}</span>
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold text-red-500">{{ formatCurrency(debt.remainingAmount) }}</p>
                  <span v-if="isOverdue(debt)" class="text-[10px] font-bold text-orange-500 uppercase">Gecikmiş</span>
                  <p v-else class="text-[10px] text-slate-400">Vade: {{ formatDate(debt.dueDate) }}</p>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <PaginationBar
              v-if="ownerFiltered.length > PAGE_SIZE"
              :current-page="ownerPage"
              :total-count="ownerFiltered.length"
              :page-size="PAGE_SIZE"
              :page-size-options="[]"
              @update:current-page="ownerPage = $event"
            />
          </template>
        </div>

        <!-- ─── Kiracıların Borçları ─── -->
        <div class="app-card overflow-hidden">
          <!-- Header + Arama/Filtre -->
          <div class="px-5 py-4 border-b border-slate-100 dark:border-white/[0.05] space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-1 h-5 bg-amber-500 rounded-full"></span>
                <h2 class="text-sm font-bold text-slate-800 dark:text-[#f1f3f9]">Kiracıların Borçları</h2>
              </div>
              <span v-if="tenantDebts.length > 0" class="badge-pending text-[10px] font-bold px-2.5 py-1 rounded-full">
                {{ tenantDebts.length }} kalem
              </span>
            </div>

            <div v-if="tenantDebts.length > 0" class="flex flex-col sm:flex-row gap-2">
              <div class="relative flex-1">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  v-model="tenantSearch"
                  @input="tenantPage = 1"
                  type="text"
                  placeholder="Kiracı, ünite veya dönem ara..."
                  class="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#151a2e] text-slate-700 dark:text-[#f1f3f9] placeholder-slate-400 dark:placeholder-[#626885] focus:outline-none focus:border-brand-500"
                />
              </div>
              <select
                v-model="tenantTypeFilter"
                @change="tenantPage = 1"
                class="text-xs rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#151a2e] text-slate-700 dark:text-[#f1f3f9] px-3 py-2 focus:outline-none focus:border-brand-500">
                <option value="">Tüm Türler</option>
                <option value="Aidat">Aidat</option>
                <option value="Electricity">Elektrik</option>
                <option value="Water">Su</option>
              </select>
              <select
                v-model="tenantStatusFilter"
                @change="tenantPage = 1"
                class="text-xs rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#151a2e] text-slate-700 dark:text-[#f1f3f9] px-3 py-2 focus:outline-none focus:border-brand-500">
                <option value="">Tüm Durumlar</option>
                <option value="overdue">Gecikmiş</option>
                <option value="upcoming">Vadesi Gelmemiş</option>
              </select>
            </div>
          </div>

          <div v-if="tenantDebts.length === 0" class="px-5 py-10 text-center">
            <p class="text-sm text-slate-400">Kiracıya ait açık borç bulunmamaktadır.</p>
          </div>

          <template v-else>
            <div v-if="tenantFiltered.length === 0" class="px-5 py-8 text-center text-sm text-slate-400">
              Arama kriterlerine uygun borç bulunamadı.
            </div>

            <div v-else class="divide-y divide-slate-50 dark:divide-white/[0.03]">
              <div v-for="debt in tenantPaged" :key="debt.id"
                class="px-5 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0" :class="debtTypeClass(debt.type)">
                    {{ debtTypeIcon(debt.type) }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-slate-800 dark:text-[#f1f3f9]">{{ debtTypeLabel(debt.type) }}</p>
                    <p class="text-xs text-slate-400 dark:text-[#9aa0b4] mt-0.5">
                      {{ debt.periodMonth }}/{{ debt.periodYear }}
                      <span v-if="debt.flatCode" class="mx-1">·</span>
                      <span v-if="debt.flatCode">Ünite {{ debt.flatCode }}</span>
                      <span v-if="debt.tenantName" class="mx-1">·</span>
                      <span v-if="debt.tenantName" class="text-amber-600 dark:text-amber-400">{{ debt.tenantName }}</span>
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold text-amber-600 dark:text-amber-400">{{ formatCurrency(debt.remainingAmount) }}</p>
                  <span v-if="isOverdue(debt)" class="text-[10px] font-bold text-orange-500 uppercase">Gecikmiş</span>
                  <p v-else class="text-[10px] text-slate-400">Vade: {{ formatDate(debt.dueDate) }}</p>
                </div>
              </div>
            </div>

            <PaginationBar
              v-if="tenantFiltered.length > PAGE_SIZE"
              :current-page="tenantPage"
              :total-count="tenantFiltered.length"
              :page-size="PAGE_SIZE"
              :page-size-options="[]"
              @update:current-page="tenantPage = $event"
            />
          </template>
        </div>

        <!-- ─── Ödemeler ─── -->
        <div class="app-card overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-100 dark:border-white/[0.05] space-y-3">
            <div class="flex items-center justify-between">
              <h2 class="text-sm font-bold text-slate-800 dark:text-[#f1f3f9]">Ödemeler</h2>
              <span class="text-[10px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-wider">
                {{ payments.length }} kayıt
              </span>
            </div>

            <div v-if="payments.length > 0" class="flex flex-col sm:flex-row gap-2">
              <div class="relative flex-1">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  v-model="paymentSearch"
                  @input="paymentPage = 1"
                  type="text"
                  placeholder="Açıklama veya tür ara..."
                  class="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#151a2e] text-slate-700 dark:text-[#f1f3f9] placeholder-slate-400 dark:placeholder-[#626885] focus:outline-none focus:border-brand-500"
                />
              </div>
              <!-- Yıl filtresi -->
              <select
                v-model="paymentYearFilter"
                @change="paymentPage = 1"
                class="text-xs rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#151a2e] text-slate-700 dark:text-[#f1f3f9] px-3 py-2 focus:outline-none focus:border-brand-500">
                <option value="">Tüm Yıllar</option>
                <option v-for="y in paymentYears" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
          </div>

          <div v-if="payments.length === 0" class="px-5 py-10 text-center text-sm text-slate-400">
            Henüz ödeme kaydı bulunmuyor.
          </div>

          <template v-else>
            <div v-if="paymentFiltered.length === 0" class="px-5 py-8 text-center text-sm text-slate-400">
              Arama kriterlerine uygun ödeme bulunamadı.
            </div>

            <div v-else class="divide-y divide-slate-50 dark:divide-white/[0.03]">
              <div v-for="payment in paymentPaged" :key="payment.id"
                class="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-slate-800 dark:text-[#f1f3f9]">
                      {{ payment.description || payment.type || 'Ödeme' }}
                    </p>
                    <p class="text-xs text-slate-400 dark:text-[#9aa0b4]">{{ formatDate(payment.paymentDate || payment.date) }}</p>
                  </div>
                </div>
                <span class="text-sm font-bold text-emerald-600 dark:text-emerald-400">+{{ formatCurrency(payment.amount) }}</span>
              </div>
            </div>

            <PaginationBar
              v-if="paymentFiltered.length > PAGE_SIZE"
              :current-page="paymentPage"
              :total-count="paymentFiltered.length"
              :page-size="PAGE_SIZE"
              :page-size-options="[]"
              @update:current-page="paymentPage = $event"
            />
          </template>
        </div>

      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import PaginationBar from '@/presentation/components/common/PaginationBar.vue'
import dashboardService from '@/infrastructure/services/dashboardService'
import { useAuthStore } from '@/application/stores/auth'
import { formatCurrency } from '@/core/utils/currencyUtils'

const authStore = useAuthStore()
const loading = ref(true)
const debts = ref([])
const payments = ref([])

const PAGE_SIZE = 10

// ─── Search / filter state ────────────────────────────────────────────────────
const ownerSearch       = ref('')
const ownerTypeFilter   = ref('')
const ownerStatusFilter = ref('')
const ownerPage         = ref(1)

const tenantSearch       = ref('')
const tenantTypeFilter   = ref('')
const tenantStatusFilter = ref('')
const tenantPage         = ref(1)

const paymentSearch     = ref('')
const paymentYearFilter = ref('')
const paymentPage       = ref(1)

// ─── Borç ayrıştırma ─────────────────────────────────────────────────────────

const allPendingDebts = computed(() =>
  debts.value.filter(d => d.status !== 'paid' && d.status !== 'Paid')
)

const ownerDebts = computed(() =>
  allPendingDebts.value
    .filter(d => d.isVacantDebt === true || d.isVacantDebt === 'true')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
)

const tenantDebts = computed(() =>
  allPendingDebts.value
    .filter(d => !d.isVacantDebt || d.isVacantDebt === false || d.isVacantDebt === 'false')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
)

// ─── Filtreleme ───────────────────────────────────────────────────────────────

function applyDebtFilters(list, search, typeFilter, statusFilter) {
  const q = search.trim().toLowerCase()
  const now = new Date()
  return list.filter(d => {
    if (typeFilter && normalizeType(d.type) !== typeFilter) return false
    if (statusFilter === 'overdue' && !(d.dueDate && new Date(d.dueDate) < now)) return false
    if (statusFilter === 'upcoming' && (d.dueDate && new Date(d.dueDate) < now)) return false
    if (!q) return true
    const typeLabel = debtTypeLabel(d.type).toLowerCase()
    const unit = (d.flatCode || '').toLowerCase()
    const period = `${d.periodMonth}/${d.periodYear}`
    return typeLabel.includes(q) || unit.includes(q) || period.includes(q)
  })
}

const ownerFiltered = computed(() =>
  applyDebtFilters(ownerDebts.value, ownerSearch.value, ownerTypeFilter.value, ownerStatusFilter.value)
)

const tenantFiltered = computed(() =>
  applyDebtFilters(tenantDebts.value, tenantSearch.value, tenantTypeFilter.value, tenantStatusFilter.value)
)

// ─── Pagination ───────────────────────────────────────────────────────────────

const ownerTotalPages  = computed(() => Math.ceil(ownerFiltered.value.length / PAGE_SIZE))
const ownerPaged       = computed(() => ownerFiltered.value.slice((ownerPage.value - 1) * PAGE_SIZE, ownerPage.value * PAGE_SIZE))

const tenantTotalPages = computed(() => Math.ceil(tenantFiltered.value.length / PAGE_SIZE))
const tenantPaged      = computed(() => tenantFiltered.value.slice((tenantPage.value - 1) * PAGE_SIZE, tenantPage.value * PAGE_SIZE))

// ─── Ödeme filtreleme ─────────────────────────────────────────────────────────

const sortedPayments = computed(() =>
  [...payments.value].sort((a, b) => new Date(b.paymentDate || b.date) - new Date(a.paymentDate || a.date))
)

const paymentYears = computed(() => {
  const years = new Set(sortedPayments.value.map(p => {
    const d = p.paymentDate || p.date
    return d ? new Date(d).getFullYear() : null
  }).filter(Boolean))
  return [...years].sort((a, b) => b - a)
})

const paymentFiltered = computed(() => {
  const q = paymentSearch.value.trim().toLowerCase()
  return sortedPayments.value.filter(p => {
    if (paymentYearFilter.value) {
      const d = p.paymentDate || p.date
      if (!d || new Date(d).getFullYear() !== Number(paymentYearFilter.value)) return false
    }
    if (!q) return true
    const desc = (p.description || p.type || '').toLowerCase()
    return desc.includes(q)
  })
})

const paymentTotalPages = computed(() => Math.ceil(paymentFiltered.value.length / PAGE_SIZE))
const paymentPaged      = computed(() => paymentFiltered.value.slice((paymentPage.value - 1) * PAGE_SIZE, paymentPage.value * PAGE_SIZE))

// ─── Özet hesaplar ───────────────────────────────────────────────────────────

const ownerTotalDebt = computed(() =>
  ownerDebts.value.reduce((sum, d) => sum + Number(d.remainingAmount || 0), 0)
)
const tenantTotalDebt = computed(() =>
  tenantDebts.value.reduce((sum, d) => sum + Number(d.remainingAmount || 0), 0)
)
const ownerOverdueItems = computed(() => {
  const now = new Date()
  return ownerDebts.value.filter(d => !d.dueDate || new Date(d.dueDate) < now)
})
const ownerOverdueDebt = computed(() =>
  ownerOverdueItems.value.reduce((sum, d) => sum + Number(d.remainingAmount || 0), 0)
)

const lastPayment = computed(() => sortedPayments.value[0] ?? null)
const lastPaymentDate = computed(() => lastPayment.value ? formatDate(lastPayment.value.paymentDate || lastPayment.value.date) : null)
const lastPaymentAmount = computed(() => lastPayment.value?.amount ?? 0)

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isOverdue = (debt) => debt.dueDate && new Date(debt.dueDate) < new Date()

const normalizeType = (type) => {
  const map = { 0: 'Aidat', 1: 'Electricity', 2: 'Water' }
  return map[type] ?? type
}

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
    2: 'bg-brand-50 dark:bg-brand-500/[0.08] text-brand-600',
    Aidat: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
    Electricity: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
    Water: 'bg-brand-50 dark:bg-brand-500/[0.08] text-brand-600',
  }
  return map[type] ?? 'bg-slate-50 dark:bg-[#1c2238] text-gray-500'
}

// ─── Data ────────────────────────────────────────────────────────────────────

const loadData = async () => {
  loading.value = true
  try {
    const result = await dashboardService.getOwnerDashboard()
    debts.value    = result?.myDebts        || []
    payments.value = result?.recentPayments || []
  } catch (error) {
    console.error('Mülk verisi yüklenirken hata:', error)
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
