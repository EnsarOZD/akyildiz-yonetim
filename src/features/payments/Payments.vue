<template>
  <div class="p-4 sm:p-6 min-h-screen pb-24 md:pb-6">

    <!-- Sayfa Başlığı -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="page-title">Ödemeler</h1>
        <p class="page-subtitle">{{ paymentsCount }} ödeme kaydı</p>
      </div>
      <div v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" class="flex flex-wrap gap-2 shrink-0">
        <button @click="showAdvanceManager = true" class="btn btn-sm btn-ghost">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          Avans
        </button>
        <button @click="showFinancialReports = true" class="btn btn-sm btn-ghost">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          Raporlar
        </button>
        <button v-if="authStore.role === ROLES.ADMIN" @click="showAuditLogs = true" class="btn btn-sm btn-ghost">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Loglar
        </button>
        <button @click="showModal = true" class="btn btn-sm btn-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Yeni Ödeme
        </button>
      </div>
    </div>

    <!-- İstatistik Kartları -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
      <div class="app-card flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
          <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">Bu Ay</p>
          <p class="text-sm font-bold text-slate-800 dark:text-white tabular-nums">{{ formatCurrency(thisMonthIncome) }}</p>
        </div>
      </div>
      <div class="app-card flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">Toplam</p>
          <p class="text-sm font-bold text-slate-800 dark:text-white tabular-nums">{{ formatCurrency(totalIncome) }}</p>
        </div>
      </div>
      <div class="app-card flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">Bu Ay İşlem</p>
          <p class="text-xl font-bold text-slate-800 dark:text-white tabular-nums">{{ thisMonthCount }}</p>
        </div>
      </div>
      <div class="app-card flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
          <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">Avans</p>
          <p class="text-sm font-bold text-slate-800 dark:text-white tabular-nums">{{ formatCurrency(totalAdvance) }}</p>
        </div>
      </div>
    </div>

    <!-- Aylık Grafik + Tip Dağılımı yan yana -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">

      <!-- Aylık Ödeme Grafiği -->
      <div class="app-card">
        <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Aylık Ödeme Grafiği</h2>
        <div class="h-40 flex items-end gap-1.5">
          <div v-for="(month, index) in monthlyPaymentData" :key="index" class="flex-1 flex flex-col items-center gap-1.5">
            <div
              class="w-full bg-blue-500 dark:bg-blue-400 rounded-t transition-all duration-500"
              :style="{ height: `${Math.max((month.total / maxMonthlyPayment) * 130, month.total > 0 ? 4 : 2)}px` }"
            ></div>
            <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{{ month.month }}</span>
          </div>
        </div>
      </div>

      <!-- Ödeme Tipi Dağılımı -->
      <div class="app-card">
        <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Tip Dağılımı</h2>
        <div class="space-y-2.5">
          <div v-for="type in paymentTypeStats" :key="type.name" class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">{{ type.label }}</p>
                <p class="text-[10px] text-slate-400 dark:text-slate-500">{{ type.count }} ödeme</p>
              </div>
            </div>
            <p class="text-sm font-bold text-green-600 dark:text-green-400 tabular-nums">{{ formatCurrency(type.total) }}</p>
          </div>
          <div v-if="paymentTypeStats.length === 0" class="text-xs text-slate-400 dark:text-slate-500 text-center py-4">Veri yok</div>
        </div>
      </div>
    </div>

    <!-- Avans Hesapları -->
    <div v-if="advanceAccounts.length > 0" class="app-card mb-5">
      <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
        <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        Avans Hesapları
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="advance in advanceAccounts"
          :key="advance.id"
          class="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30"
        >
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{{ getTenantCompany(advance.tenantId) }}</span>
            <span class="badge badge-xs badge-success">Aktif</span>
          </div>
          <p class="text-base font-bold text-purple-600 dark:text-purple-400 tabular-nums">{{ formatCurrency(Number(advance.balance ?? advance.amount ?? 0)) }}</p>
          <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{{ formatDate(advance.updatedAt || advance.lastMovementAt || advance.createdAt || advance.paymentDate) }}</p>
        </div>
      </div>
    </div>

    <!-- Filtreler ve Liste -->
    <div class="app-card !p-0 overflow-hidden">
      <!-- Filtreler -->
      <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <CustomFilterBar
          class="flex-1"
          :search="filters.searchTerm"
          search-placeholder="Firma, tutar, tip veya banka ara..."
          :period="filters.period"
          :select-type="filters.type"
          :select-type-options="paymentTypeFilterOptions"
          @update:search="val => (filters.searchTerm = val)"
          @update:period="val => (filters.period = val)"
          @update:selectType="val => (filters.type = val)"
          @clearFilters="handleClearFilters"
        />
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="selectedIds.length > 0" class="flex items-center gap-2 shrink-0">
            <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">{{ selectedIds.length }} seçildi</span>
            <button @click="showBulkDeleteConfirm = true" class="btn btn-error btn-xs text-white gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Sil
            </button>
          </div>
        </Transition>
      </div>

      <!-- Tümünü Seç Başlık -->
      <div v-if="filteredPayments.length > 0" class="flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/50">
        <input
          type="checkbox"
          class="checkbox checkbox-sm checkbox-primary"
          :checked="isAllSelected"
          :indeterminate="isPartiallySelected"
          @change="toggleSelectAll"
        />
        <span class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tümünü Seç</span>
      </div>

      <!-- Yükleniyor -->
      <div v-if="loading" class="p-4">
        <SkeletonRows :rows="6" />
      </div>

      <!-- Boş Durum -->
      <div v-else-if="filteredPayments.length === 0">
        <EmptyState title="Ödeme bulunamadı" description="Seçilen kriterlere uygun ödeme kaydı yok.">
          <template #action>
            <button @click="handleClearFilters" class="btn btn-sm btn-outline">Filtreleri Temizle</button>
          </template>
        </EmptyState>
      </div>

      <!-- Ödeme Listesi -->
      <div v-else class="divide-y divide-slate-100 dark:divide-slate-700/60">
        <div
          v-for="p in paymentsView"
          :key="p.id"
          :class="['flex items-center gap-3 px-4 py-3 transition-colors', selectedIds.includes(p.id) ? 'bg-blue-50/60 dark:bg-blue-900/10' : 'table-row-hover']"
        >
          <!-- Checkbox -->
          <input
            type="checkbox"
            class="checkbox checkbox-sm checkbox-primary shrink-0"
            :value="p.id"
            v-model="selectedIds"
          />

          <!-- Avatar -->
          <div class="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white" :class="getAvatarColor(p.company)">
            {{ getAvatarInitial(p.company) }}
          </div>

          <!-- Bilgi -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{{ p.company }}</p>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs text-slate-400 dark:text-slate-500">{{ formatDate(getPaymentDate(p)) }}</span>
              <span v-if="p.periodYear && p.periodYear > 2000" class="badge badge-xs badge-ghost tabular-nums">
                {{ p.periodYear }}-{{ String(p.periodMonth).padStart(2, '0') }}
              </span>
              <span class="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[140px]" :title="p.description">{{ getPaymentDisplayLabel(p) }}</span>
            </div>
          </div>

          <!-- Tutar -->
          <div class="shrink-0 text-right">
            <p class="text-sm font-bold text-green-600 dark:text-green-400 tabular-nums">{{ formatCurrency(p.amount) }}</p>
            <p v-if="p.bank" class="text-[10px] text-slate-400 dark:text-slate-500">{{ p.bank }}</p>
          </div>

          <!-- İşlem Menüsü -->
          <div v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" class="shrink-0">
            <div class="dropdown dropdown-end">
              <button tabindex="0" class="btn btn-ghost btn-xs btn-square text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/>
                </svg>
              </button>
              <ul tabindex="0" class="dropdown-content menu p-1.5 shadow-card bg-base-100 border border-slate-200 dark:border-slate-700 rounded-xl w-32 z-10 text-xs">
                <li><a @click="startEdit(p)" class="rounded-lg">Düzenle</a></li>
                <li><a @click="deletePayment(p.id)" class="rounded-lg text-error">Sil</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Sayfalama -->
      <div class="px-4 py-3 border-t border-slate-100 dark:border-slate-700/60">
        <PaginationBar
          v-model:currentPage="currentPage"
          v-model:pageSize="pageSize"
          :total-count="filteredPayments.length"
        />
      </div>
    </div>

    <!-- Payment Modal -->
    <PaymentModal
      :visible="showModal"
      :payment="newPayment"
      :tenants="tenants"
      :banks="banks"
      :editMode="editMode"
      :debtRefreshKey="debtRefreshKey"
      @save="handlePaymentSave"
      @cancel="handleModalClose"
      @dirty-changed="v => (isPaymentModalDirty = v)"
    />

    <!-- Confirm Dialog -->
    <dialog v-if="confirmModalVisible" class="modal" open>
      <div class="modal-box">
        <h3 class="font-bold text-lg">Değişiklikler kaybolacak</h3>
        <p class="py-4">Kaydetmeden çıkmak istediğine emin misin?</p>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="cancelClose">Vazgeç</button>
          <button class="btn btn-primary" @click="confirmClose">Devam Et</button>
        </div>
      </div>
    </dialog>

    <!-- Toplu Silme Onay Modal -->
    <dialog v-if="showBulkDeleteConfirm" class="modal modal-bottom sm:modal-middle" open>
      <div class="modal-box">
        <h3 class="font-bold text-lg text-red-600">Toplu Silme Onayı</h3>
        <p class="py-4">Seçili <strong>{{ selectedIds.length }}</strong> ödeme kaydını silmek istediğinize emin misiniz?</p>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="showBulkDeleteConfirm = false" :disabled="isBulkDeleting">Vazgeç</button>
          <button class="btn btn-error text-white" @click="confirmBulkDelete" :disabled="isBulkDeleting">
            <span v-if="isBulkDeleting" class="loading loading-spinner loading-sm"></span>
            Evet, Sil
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop"><button @click="showBulkDeleteConfirm = false" :disabled="isBulkDeleting">Kapat</button></form>
    </dialog>

    <!-- Avans Hesabı Yönetimi Modal -->
    <dialog v-if="showAdvanceManager" class="modal" open>
      <div class="modal-box max-w-4xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">Avans Hesabı Yönetimi</h3>
          <button @click="showAdvanceManager = false" class="btn btn-sm btn-ghost btn-square">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <AdvanceAccountManager @success="handleAdvanceSuccess" />
      </div>
    </dialog>

    <!-- Finansal Raporlar Modal -->
    <dialog v-if="showFinancialReports" class="modal" open>
      <div class="modal-box max-w-6xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">Finansal Raporlar</h3>
          <button @click="showFinancialReports = false" class="btn btn-sm btn-ghost btn-square">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <FinancialReports />
      </div>
    </dialog>

    <!-- Audit Logs Modal -->
    <dialog v-if="showAuditLogs" class="modal" open>
      <div class="modal-box max-w-6xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">Sistem Logları</h3>
          <button @click="showAuditLogs = false" class="btn btn-sm btn-ghost btn-square">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <AuditLogs />
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ROLES } from '@/constants/roles'
import { useAuthStore } from '@/stores/auth'
import PaymentModal from './PaymentModal.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import SkeletonRows from '@/components/common/SkeletonRows.vue'
import CustomFilterBar from '@/components/common/CustomFilterBar.vue'
import AdvanceAccountManager from '@/components/AdvanceAccountManager.vue'
import FinancialReports from '@/components/FinancialReports.vue'
import AuditLogs from '@/components/AuditLogs.vue'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useNotify } from '@/composables/useNotify'
import { usePaymentsStore } from '@/stores/payments.js'
import { useTenantsStore } from '@/stores/tenants.js'
import { paymentTypes, getPaymentTypeLabel, paymentTypeToValue } from '@/constants/enums'
import { safeFormatDate } from '@/utils/dateUtils'
import { formatCurrency, getAvatarColor, getAvatarInitial } from '@/utils/uiHelpers'
import EmptyState from '@/components/ui/EmptyState.vue'

const { handleNetworkError } = useErrorHandler()
const { notifySuccess, notifyError } = useNotify()

const authStore = useAuthStore()

const paymentsStore = usePaymentsStore()
const tenantsStore = useTenantsStore()

const formatDate = (d) => safeFormatDate(d, 'dd MMM yyyy')

const payments = computed(() => paymentsStore.payments)
const tenants = computed(() => tenantsStore.tenants)
const advanceAccounts = computed(() => paymentsStore.advanceAccounts)
const banks = ref(['Ziraat', 'İş Bankası', 'Garanti', 'Yapı Kredi', 'Halkbank'])

const showModal = ref(false)
const showAdvanceManager = ref(false)
const debtRefreshKey = ref(0)
const showFinancialReports = ref(false)
const showAuditLogs = ref(false)
const loading = computed(() => paymentsStore.loading || tenantsStore.loading)

const isPaymentModalDirty = ref(false)
const confirmModalVisible = ref(false)
const pendingCloseAction = ref(null)

const filters = ref({
  searchTerm: '',
  period: '',
  type: ''
})

/* ---- Tip yardımcıları ---- */
const normalizePaymentType = (t) => {
  if (t === '' || t === null || t === undefined) return '';
  const v = paymentTypeToValue(t);
  return v !== null ? v : '';
}

const paymentTypeIconMap = {
  0: '🏢', // Aidat
  1: '⚡️', // Elektrik
  2: '💧', // Su
  3: '🔥', // Doğalgaz
  4: '💳'  // Diğer
}
const getPaymentTypeIcon = (t) => paymentTypeIconMap[normalizePaymentType(t)] ?? '💳'

const paymentTypeOptions = computed(() =>
  Object.entries(paymentTypes).map(([k, label]) => ({
    value: Number(k),
    label,
    icon: getPaymentTypeIcon(Number(k))
  }))
)
const getPaymentDisplayLabel = (p) => {
  const baseLabel = getPaymentTypeLabel(p.type)
  // Eski kayıtlarda debtTypes boş olabilir
  if (p.debtTypes && p.debtTypes.length > 0) {
    const types = p.debtTypes.map(t => getDebtTypeLabel(t)).join(', ')
    return `${baseLabel} (${types})`
  }
  return baseLabel
}

const getPaymentDisplayIcon = (p) => {
  if (p.debtTypes && p.debtTypes.length === 1) {
    return getDebtTypeIcon(p.debtTypes[0])
  }
  return getPaymentTypeIcon(p.type)
}

import { getDebtTypeLabel, getDebtTypeIcon } from '@/constants/enums'

const paymentTypeFilterOptions = computed(() => [
  { value: '', label: 'Tüm Tipler', icon: '📦' },
  ...paymentTypeOptions.value,
  { value: 'debt:1', label: 'Elektrik', icon: '⚡️' },
  { value: 'debt:2', label: 'Su', icon: '💧' }
])

const getPaymentDate = (p) => p?.date || p?.paymentDate || p?.createdAt || ''

/* ---- Özetler ---- */
const totalIncome = computed(() =>
  payments.value.reduce((sum, p) => sum + Number(p.amount || 0), 0)
)

const thisMonthIncome = computed(() => {
  const today = new Date()
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  return payments.value
    .filter(p => (getPaymentDate(p) || '').startsWith(currentMonth))
    .reduce((sum, p) => sum + Number(p.amount || 0), 0)
})

const thisMonthCount = computed(() => {
  const today = new Date()
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  return payments.value.filter(p => (getPaymentDate(p) || '').startsWith(currentMonth)).length
})

const paymentsCount = computed(() => payments.value.length)

const totalAdvance = computed(() =>
  advanceAccounts.value.reduce((sum, a) => sum + Number(a.balance ?? 0), 0)
)

/* ---- UI yardımcıları ---- */
const clearFilters = () => {
  filters.value = { searchTerm: '', period: '', type: '' }
}

/* ---- Kiracı adı ---- */
const getTenantCompany = (id) => {
  if (!id) return 'Mal Sahibi Ödemesi'
  const t = tenantsStore.getTenantById(id)
  return (
    t?.companyName ||
    t?.company ||
    t?.contactPersonName ||
    t?.fullName ||
    [t?.firstName, t?.lastName].filter(Boolean).join(' ') ||
    t?.email ||
    `#${id}`
  )
}

/* ---- Filtrelenmiş liste ---- */
const filteredPayments = computed(() => {
  let filtered = payments.value
  const searchTerm = (filters.value.searchTerm || '').toLowerCase()

  const filterType = filters.value.type
  if (filterType && String(filterType).startsWith('debt:')) {
    const debtTypeIdx = parseInt(filterType.split(':')[1])
    filtered = filtered.filter(p => p.debtTypes && p.debtTypes.includes(debtTypeIdx))
  } else {
    const fType = normalizePaymentType(filterType)
    if (fType !== '' && fType !== undefined) {
      filtered = filtered.filter(p => normalizePaymentType(p.type) === fType)
    }
  }

  if (filters.value.period) {
    filtered = filtered.filter(p => {
      const paymentDate = getPaymentDate(p)
      if (!paymentDate) return false
      const periodDate = new Date(filters.value.period)
      const payDate = new Date(paymentDate)
      return payDate.getFullYear() === periodDate.getFullYear() && 
             payDate.getMonth() === periodDate.getMonth()
    })
  }

  if (searchTerm) {
    filtered = filtered.filter(p =>
      getTenantCompany(p.tenantId).toLowerCase().includes(searchTerm) ||
      getPaymentTypeLabel(normalizePaymentType(p.type)).toLowerCase().includes(searchTerm) ||
      (p.bank && p.bank.toLowerCase().includes(searchTerm)) ||
      (p.amount && String(p.amount).includes(searchTerm))
    )
  }

  return filtered.sort((a, b) => new Date(getPaymentDate(b)) - new Date(getPaymentDate(a)))
})

/* ---- Bulk Seçim ---- */
const selectedIds = ref([])
const showBulkDeleteConfirm = ref(false)
const isBulkDeleting = ref(false)

const isAllSelected = computed(() => {
  const valid = paginatedPayments.value.filter(p => p.id)
  return valid.length > 0 && valid.every(p => selectedIds.value.includes(p.id))
})

const isPartiallySelected = computed(() => {
  const valid = paginatedPayments.value.filter(p => p.id)
  const selectedCount = valid.filter(p => selectedIds.value.includes(p.id)).length
  return selectedCount > 0 && selectedCount < valid.length
})

const toggleSelectAll = (e) => {
  const valid = paginatedPayments.value.filter(p => p.id)
  if (e.target.checked) {
    const toAdd = valid.map(p => p.id).filter(id => !selectedIds.value.includes(id))
    selectedIds.value.push(...toAdd)
  } else {
    selectedIds.value = selectedIds.value.filter(id => !valid.map(p => p.id).includes(id))
  }
}

/* ---- Pagination ---- */
const currentPage = ref(1)
const pageSize = ref(10)

const totalPages = computed(() => Math.ceil(filteredPayments.value.length / pageSize.value))

const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredPayments.value.slice(start, end)
})

const paymentsView = computed(() => paginatedPayments.value.map(p => ({
  ...p,
  company: getTenantCompany(p.tenantId)
})))


// Reset to first page when filters or pageSize change
watch([filters, pageSize], () => {
  currentPage.value = 1
}, { deep: true })

/* ---- Modal form ---- */
const newPayment = ref({
  date: new Date().toISOString().substring(0, 10),
  tenantId: '',
  ownerId: null,
  amount: null,
  type: '',
  bank: '',
  description: ''
})

const editMode = ref(false)
const selectedPaymentId = ref(null)

/* ---- Handlers ---- */
const reallyClosePaymentModal = () => {
  showModal.value = false
  isPaymentModalDirty.value = false
  confirmModalVisible.value = false
  pendingCloseAction.value = null
  newPayment.value = {
    date: new Date().toISOString().substring(0, 10),
    tenantId: '',
    ownerId: null,
    amount: null,
    type: '',
    bank: '',
    description: ''
  }
  editMode.value = false
  selectedPaymentId.value = null
}

const handleModalClose = () => {
  if (isPaymentModalDirty.value) {
    pendingCloseAction.value = 'closePaymentModal'
    confirmModalVisible.value = true
    return
  }
  reallyClosePaymentModal()
}

const confirmClose = () => {
  if (pendingCloseAction.value === 'closePaymentModal') reallyClosePaymentModal()
}

const cancelClose = () => {
  confirmModalVisible.value = false
  pendingCloseAction.value = null
}

const deletePayment = async (id) => {
  try {
    await paymentsStore.deletePayment(id)
    notifySuccess('Ödeme silindi.')
  } catch (error) {
    notifyError('Ödeme silinemedi.')
    handleNetworkError(error, { component: 'Payments', action: 'deletePayment' })
  }
}

const confirmBulkDelete = async () => {
  if (selectedIds.value.length === 0) return
  isBulkDeleting.value = true
  try {
    await paymentsStore.bulkDeletePayments(selectedIds.value)
    notifySuccess(`${selectedIds.value.length} ödeme başarıyla silindi.`)
    selectedIds.value = []
    showBulkDeleteConfirm.value = false
  } catch (err) {
    notifyError('Toplu silme sırasında hata oluştu.')
    handleNetworkError(err)
  } finally {
    isBulkDeleting.value = false
  }
}

const startEdit = (payment) => {
  newPayment.value = { 
    date: (getPaymentDate(payment) || new Date().toISOString()).substring(0,10),
    tenantId: payment.tenantId || '',
    ownerId: payment.ownerId ?? null,
    amount: payment.amount ?? null,
    type: normalizePaymentType(payment.type),
    bank: payment.bank ?? '',
    description: payment.description ?? ''
  }
  selectedPaymentId.value = payment.id
  editMode.value = true
  showModal.value = true
}

const handleClearFilters = () => {
  clearFilters()
  paymentsStore.fetchPayments(true)
}

const handlePaymentSave = async () => {
  showModal.value = false
  newPayment.value = {
    date: new Date().toISOString().substring(0, 10),
    tenantId: '',
    ownerId: null,
    amount: null,
    type: '',
    bank: '',
    description: ''
  }
  const wasEdit = editMode.value
  editMode.value = false
  selectedPaymentId.value = null

  await Promise.all([
    paymentsStore.fetchPayments(true), 
    paymentsStore.fetchAdvanceAccounts()
  ])

  if (wasEdit) notifySuccess('Ödeme güncellendi.')
  else notifySuccess('Ödeme kaydedildi.')
}

const handleAdvanceSuccess = () => {
  showAdvanceManager.value = false
  debtRefreshKey.value++  // trigger PaymentModal to re-fetch debts
  paymentsStore.fetchAdvanceAccounts()
  paymentsStore.fetchPayments(true)
  notifySuccess('Avans hesabı işlemi başarıyla tamamlandı.')
}

/* ---- Analitik ---- */
const monthlyPaymentData = computed(() => {
  const months = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = date.toLocaleDateString('tr-TR', { month: 'short' })
    const total = payments.value
      .filter(p => (getPaymentDate(p) || '').startsWith(key))
      .reduce((sum, p) => sum + Number(p.amount || 0), 0)
    months.push({ month: label, total })
  }
  return months
})

const maxMonthlyPayment = computed(() => Math.max(...monthlyPaymentData.value.map(m => m.total), 1))

const paymentTypeStats = computed(() => {
  const stats = {}
  payments.value.forEach(p => {
    const key = normalizePaymentType(p.type)
    if (key === '') return
    if (!stats[key]) {
      stats[key] = {
        name: key,
        label: getPaymentTypeLabel(key),
        icon: getPaymentTypeIcon(key),
        count: 0,
        total: 0
      }
    }
    stats[key].count++
    stats[key].total += Number(p.amount || 0)
  })
  return Object.values(stats).sort((a, b) => b.total - a.total)
})

onMounted(() => {
  tenantsStore.fetchTenants()
  paymentsStore.fetchAdvanceAccounts()
  paymentsStore.fetchPayments()
})
</script>
