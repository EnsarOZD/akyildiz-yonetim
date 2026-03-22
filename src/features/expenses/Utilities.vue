<template>
  <div class="p-4 sm:p-6 min-h-screen pb-24 md:pb-6">

    <!-- Sayfa Başlığı -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="page-title">Borçlar</h1>
        <p class="page-subtitle">Aidat ve fatura borçlarını takip edin</p>
      </div>
      <div v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" class="flex flex-wrap gap-2 shrink-0">
        <button @click="openManualDebt(0)" class="btn btn-sm btn-ghost border border-slate-300 dark:border-slate-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Aidat
        </button>
        <button @click="openManualDebt(1)" class="btn btn-sm btn-ghost border border-slate-300 dark:border-slate-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          Elektrik
        </button>
        <button @click="openManualDebt(2)" class="btn btn-sm btn-ghost border border-slate-300 dark:border-slate-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 3v1m0 16v1m8-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
          </svg>
          Su
        </button>
        <button @click="showImportModal = true" class="btn btn-sm btn-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
          </svg>
          Excel'den Yükle
        </button>
      </div>
    </div>

    <!-- Yükleniyor -->
    <div v-if="dataStatus.loading" class="space-y-3">
      <div v-for="i in 6" :key="i" class="app-card animate-pulse">
        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Hata -->
    <div v-else-if="dataStatus.error" class="app-card border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10 mb-5">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-red-800 dark:text-red-200">Veri yüklenemedi</p>
          <p class="text-xs text-red-600 dark:text-red-300">{{ dataStatus.error }}</p>
        </div>
      </div>
    </div>

    <template v-else>
      <!-- Özet Kartları -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <!-- Toplam Kayıt -->
        <div class="app-card flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-none mb-1">Toplam</p>
            <p class="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none">{{ dues.length }}</p>
          </div>
        </div>
        <!-- Aidat -->
        <div class="app-card flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-none mb-1">Aidat</p>
            <p class="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none">{{ dues.filter(d => d.type === 0).length }}</p>
          </div>
        </div>
        <!-- Elektrik -->
        <div class="app-card flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-none mb-1">Elektrik</p>
            <p class="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none">{{ dues.filter(d => d.type === 1).length }}</p>
          </div>
        </div>
        <!-- Su -->
        <div class="app-card flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 3v1m0 16v1m8-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-none mb-1">Su</p>
            <p class="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none">{{ dues.filter(d => d.type === 2).length }}</p>
          </div>
        </div>
      </div>

      <!-- Filtre + Liste Kartı -->
      <div class="app-card !p-0">
        <!-- Filtre Başlığı -->
        <div class="px-4 pt-4 pb-3 border-b border-slate-200 dark:border-slate-700">
          <FilterBar
            v-model:search="searchTerm"
            v-model:period="selectedPeriod"
            v-model:select-type="selectedType"
            :select-type-options="typeOptions"
            @clear-filters="handleClearFilters"
          />
        </div>

        <!-- Liste Başlığı -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Borç Listesi</span>
            <span class="text-xs text-slate-400">{{ filteredDues.length }} kayıt</span>
          </div>
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-x-2"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 translate-x-2"
          >
            <div v-if="selectedIds.length > 0" class="flex items-center gap-2">
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ selectedIds.length }} seçildi</span>
              <button @click="showBulkDeleteConfirm = true" class="btn btn-error btn-xs">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Sil
              </button>
            </div>
          </Transition>
        </div>

        <!-- Seçim Satırı (toplu işlem) -->
        <div v-if="filteredDues.length > 0 && (authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER)" class="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
          <input
            type="checkbox"
            class="checkbox checkbox-xs checkbox-primary"
            :checked="isAllSelected"
            :indeterminate="isPartiallySelected"
            @change="toggleSelectAll"
          />
          <span class="text-xs text-slate-400 uppercase tracking-wider">Tümünü Seç</span>
        </div>

        <!-- Boş Durum -->
        <div v-if="filteredDues.length === 0" class="py-12 px-4">
          <div class="text-center">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Borç kaydı bulunamadı</p>
            <p class="text-xs text-slate-400 mt-1">Farklı filtreler deneyin</p>
          </div>
        </div>

        <!-- Borç Satırları -->
        <div v-else class="divide-y divide-slate-100 dark:divide-slate-700/50">
          <div
            v-for="d in duesPaged"
            :key="d.id || (d.flatId + '-' + d.periodYear + '-' + d.periodMonth)"
            class="table-row-hover flex items-center gap-3 px-4 py-3"
            :class="selectedIds.includes(d.id) ? 'bg-blue-50/60 dark:bg-blue-900/10' : ''"
          >
            <!-- Checkbox -->
            <div v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" class="shrink-0">
              <input
                v-if="d.id"
                type="checkbox"
                class="checkbox checkbox-xs checkbox-primary"
                :value="d.id"
                v-model="selectedIds"
              />
              <span v-else class="w-3 h-3 block"></span>
            </div>

            <!-- Tip İkonu -->
            <div class="shrink-0">
              <div :class="[
                'w-9 h-9 rounded-xl flex items-center justify-center',
                d.type === 1 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                  : d.type === 2 ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              ]">
                <svg v-if="d.type === 1" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <svg v-else-if="d.type === 2" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 3v1m0 16v1m8-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
            </div>

            <!-- İsim + Bilgi -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                {{ d.tenantCompany || d.flatNumber || '-' }}
              </p>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs text-slate-400">{{ d.periodYear }}/{{ String(d.periodMonth).padStart(2,'0') }}</span>
                <span class="text-slate-300 dark:text-slate-600">·</span>
                <span class="text-xs text-slate-400">Son: {{ formatDate(d.dueDate) }}</span>
              </div>
            </div>

            <!-- Tutar -->
            <div class="text-right shrink-0">
              <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ formatNumber(d.amount) }} ₺</p>
              <span :class="[
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-0.5',
                d.status === 'Paid'
                  ? 'badge-active'
                  : d.status === 'Partial'
                    ? 'badge-pending'
                    : 'badge-overdue'
              ]">
                {{ d.status === 'Paid' ? 'Ödendi' : d.status === 'Partial' ? 'Kısmi' : 'Bekliyor' }}
              </span>
              <!-- Kuruş farkı uyarısı -->
              <p v-if="d.status !== 'Paid' && d.remainingAmount > 0 && d.remainingAmount < 1"
                class="text-[10px] text-amber-500 font-medium mt-0.5">
                {{ formatNumber(d.remainingAmount) }} ₺ kaldı
              </p>
            </div>

            <!-- Dropdown Menü -->
            <div v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" class="shrink-0">
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-xs btn-circle">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                  </svg>
                </label>
                <ul tabindex="0" class="dropdown-content menu menu-sm p-1.5 shadow-lg bg-base-100 border border-slate-200 dark:border-slate-700 rounded-xl w-40 z-30">
                  <li><a @click="editDebt(d)" class="text-sm">Düzenle</a></li>
                  <li v-if="d.status !== 'Paid' && d.remainingAmount > 0 && d.remainingAmount < 1">
                    <a @click="openCloseDebt(d)" class="text-sm text-amber-600 dark:text-amber-400">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Borcu Kapat
                    </a>
                  </li>
                  <li v-if="authStore.role === ROLES.ADMIN">
                    <a @click="openAidatDelete(d)" class="text-sm text-red-500">Sil</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="border-t border-slate-200 dark:border-slate-700">
          <PaginationBar
            v-model:currentPage="duesPage"
            v-model:pageSize="pageSize"
            :total-count="duesTotal"
          />
        </div>
      </div>
    </template>

    <!-- Modallar -->
    <AidatEditModal
      v-if="showAidatEditModal && selectedDue"
      :record="selectedDue"
      @close="handleClose"
      @updated="refreshAll"
    />
    <AidatDeleteModal
      v-if="showAidatDeleteModal && selectedDue"
      :record="selectedDue"
      @close="handleClose"
      @deleted="refreshAll"
    />

    <!-- Toplu Silme Onay Modal -->
    <dialog v-if="showBulkDeleteConfirm" class="modal modal-bottom sm:modal-middle" open>
      <div class="modal-box">
        <h3 class="font-bold text-lg text-red-600">Toplu Silme Onayı</h3>
        <p class="py-4">Seçili <strong>{{ selectedIds.length }}</strong> borç/aidat kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="showBulkDeleteConfirm = false" :disabled="isBulkDeleting">Vazgeç</button>
          <button class="btn btn-error text-white" @click="confirmBulkDelete" :disabled="isBulkDeleting">
            <span v-if="isBulkDeleting" class="loading loading-spinner loading-sm"></span>
            Evet, Sil
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="showBulkDeleteConfirm = false" :disabled="isBulkDeleting">Kapat</button>
      </form>
    </dialog>

    <!-- Borcu Kapat Onay Modal -->
    <dialog v-if="showCloseDebtConfirm && selectedDue" class="modal modal-bottom sm:modal-middle" open>
      <div class="modal-box">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100">Borcu Kapat</h3>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-300 mb-1">
          <strong>{{ selectedDue.tenantCompany || selectedDue.flatNumber }}</strong> –
          {{ selectedDue.periodYear }}/{{ String(selectedDue.periodMonth).padStart(2, '0') }}
        </p>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Kalan <strong class="text-amber-600 dark:text-amber-400">{{ formatNumber(selectedDue.remainingAmount) }} ₺</strong>
          kuruş farkı sıfırlanarak borç kapatılacak. Bu işlem geri alınamaz.
        </p>
        <div class="modal-action">
          <button class="btn btn-ghost btn-sm" @click="showCloseDebtConfirm = false; selectedDue = null" :disabled="isClosingDebt">Vazgeç</button>
          <button class="btn btn-warning btn-sm text-white" @click="confirmCloseDebt" :disabled="isClosingDebt">
            <span v-if="isClosingDebt" class="loading loading-spinner loading-xs"></span>
            Evet, Kapat
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="showCloseDebtConfirm = false; selectedDue = null" :disabled="isClosingDebt">Kapat</button>
      </form>
    </dialog>

    <!-- Manuel Borç Modalı -->
    <ManualDebtModal
      v-if="showManualModal"
      :type="manualType"
      :initial-data="selectedDue"
      @close="handleClose"
      @refresh="refreshAll"
    />

    <!-- Excel Aktarım Modalı -->
    <UtilityDebtImportModal
      v-if="showImportModal"
      @close="showImportModal = false"
      @refresh="refreshAll"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ROLES } from '@/constants/roles'
import { useAuthStore } from '@/stores/auth'
import FilterBar from '@/components/common/FilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { useErrorHandler } from '@/composables/useErrorHandler'
import api from '@/services/api'
import utilityDebtsService from '@/services/utilityDebtsService'
import AidatEditModal from './EditAidatModal.vue'
import AidatDeleteModal from './AidatDeleteModal.vue'
import ManualDebtModal from './ManualDebtModal.vue'
import UtilityDebtImportModal from './UtilityDebtImportModal.vue'

const { handleNetworkError, showSuccess } = useErrorHandler()
const authStore = useAuthStore()

/* ---------- Helpers (period) ---------- */
function getYearMonth(o) {
  const safe = String(o?.period ?? '')
  const [py, pm] = safe && safe.includes('-') ? safe.split('-') : [null, null]
  const y = Number(o?.periodYear ?? py) || null
  const m = Number(o?.periodMonth ?? pm) || null
  return { y, m }
}
function periodKeyOf(o) {
  const { y, m } = getYearMonth(o)
  return y && m ? `${y}-${String(m).padStart(2, '0')}` : ''
}

/* ---------- State ---------- */
const dues = ref([])

const searchTerm = ref('')
const selectedPeriod = ref('')          // YYYY-MM
const selectedType = ref('all')
const selectedDue = ref(null)
const showAidatEditModal = ref(false)
const showAidatDeleteModal = ref(false)
const showManualModal = ref(false)
const showImportModal = ref(false)
const manualType = ref(1)

const typeOptions = [
  { value: 'all', label: 'Tüm Borçlar' },
  { value: '0', label: 'Aidat', icon: '📋' },
  { value: '1', label: 'Elektrik', icon: '⚡' },
  { value: '2', label: 'Su', icon: '💧' }
]

// Pagination
const PAGE_SIZE_DEFAULT = 10
const duesPage = ref(1)
const pageSize = ref(PAGE_SIZE_DEFAULT)

// Seçim State'i
const selectedIds = ref([])
const showBulkDeleteConfirm = ref(false)
const isBulkDeleting = ref(false)
const showCloseDebtConfirm = ref(false)
const isClosingDebt = ref(false)

/* ---------- Computed (filters) ---------- */

const duesTotal = computed(() => filteredDues.value.length)
const duesPaged = computed(() => {
  const start = (duesPage.value - 1) * pageSize.value
  return filteredDues.value.slice(start, start + pageSize.value)
})

const isAllSelected = computed(() => {
  const validDues = duesPaged.value.filter(d => d.id)
  return validDues.length > 0 && validDues.every(d => selectedIds.value.includes(d.id))
})

const isPartiallySelected = computed(() => {
  const validDues = duesPaged.value.filter(d => d.id)
  const selectedCount = validDues.filter(d => selectedIds.value.includes(d.id)).length
  return selectedCount > 0 && selectedCount < validDues.length
})

const toggleSelectAll = (e) => {
  const validDues = duesPaged.value.filter(d => d.id)
  if (e.target.checked) {
    const toAdd = validDues.map(d => d.id).filter(id => !selectedIds.value.includes(id))
    selectedIds.value.push(...toAdd)
  } else {
    selectedIds.value = selectedIds.value.filter(id => !validDues.map(d => d.id).includes(id))
  }
}

const filteredDues = computed(() => {
  return dues.value
    .filter(d => {
      const search = searchTerm.value.toLowerCase()
      const matchesSearch =
        !search ||
        (d.flatNumber || '').toLowerCase().includes(search) ||
        (d.tenantCompany || '').toLowerCase().includes(search) ||
        (d.description || '').toLowerCase().includes(search)

      const matchesType = selectedType.value === 'all' || String(d.type) === selectedType.value

      const periodKey = periodKeyOf(d)
      const matchesPeriod = !selectedPeriod.value || periodKey === selectedPeriod.value

      return matchesSearch && matchesType && matchesPeriod
    })
    .sort((a,b) =>
      (b.periodYear ?? 0) - (a.periodYear ?? 0) ||
      (b.periodMonth ?? 0) - (a.periodMonth ?? 0)
    )
})

/* ---------- Data Status ---------- */
const dataStatus = ref({ loading: false, error: null, lastUpdated: null })
const inFlight = ref(0)
const setLoading = (inc) => {
  inFlight.value += inc ? 1 : -1
  dataStatus.value.loading = inFlight.value > 0
}

/* ---------- API ---------- */
const fetchFlats = async () => {
  try {
    const response = await api.get('/Flats?pageSize=100')
    return Array.isArray(response) ? response : (response?.items ?? [])
  } catch (error) {
    console.error('Flat bilgileri alınırken hata:', error)
    return []
  }
}

const openAidatDelete = (d) => {
  selectedDue.value = d
  showAidatDeleteModal.value = true
}

const openManualDebt = (type) => {
  manualType.value = type
  selectedDue.value = null
  showManualModal.value = true
}

const confirmBulkDelete = async () => {
  if (selectedIds.value.length === 0) return
  isBulkDeleting.value = true
  try {
    await utilityDebtsService.bulkDeleteDebts(selectedIds.value)
    showSuccess(`${selectedIds.value.length} kayıt başarıyla silindi.`)
    selectedIds.value = []
    showBulkDeleteConfirm.value = false
    await refreshAll()
  } catch (err) {
    handleNetworkError(err)
  } finally {
    isBulkDeleting.value = false
  }
}

// Excel aktarımı modal aracılığıyla yönetiliyor

const openCloseDebt = (d) => {
  selectedDue.value = d
  showCloseDebtConfirm.value = true
}

const confirmCloseDebt = async () => {
  if (!selectedDue.value) return
  isClosingDebt.value = true
  try {
    await utilityDebtsService.patchUtilityDebt(selectedDue.value.id, {
      isPaid: true,
    })
    showSuccess('Borç başarıyla kapatıldı.')
    showCloseDebtConfirm.value = false
    selectedDue.value = null
    await refreshAll()
  } catch (err) {
    handleNetworkError(err)
  } finally {
    isClosingDebt.value = false
  }
}

const editDebt = (d) => {
  selectedDue.value = d
  if (d.type === 0) {
    showAidatEditModal.value = true
  } else {
    manualType.value = d.type
    showManualModal.value = true
  }
}


const fetchDues = async () => {
  try {
    const [duesRes, flatsRes, tenantsRes, ownersRes] = await Promise.all([
      utilityDebtsService.getUtilityDebts({ period: selectedPeriod.value || undefined }),
      api.get('/Flats?pageSize=100'),
      api.get('/Tenants?pageSize=100'),
      api.get('/Owners?pageSize=100'),
    ])

    const toArray = (r) => Array.isArray(r) ? r : (r?.items ?? [])
    const flatById = new Map(toArray(flatsRes).map(f => [f.id, f]))
    const tenantById = new Map(toArray(tenantsRes).map(t => [t.id, t]))
    const ownerById = new Map(toArray(ownersRes).map(o => [o.id, o]))

    const normStatus = (s) => {
      if (typeof s === 'number') { // 0:Unpaid 1:Partial 2:Paid
        return s === 2 ? 'paid' : (s === 1 ? 'partial' : 'unpaid')
      }
      return String(s || '').toLowerCase()
    }

    dues.value = (duesRes || []).map(d => {
      const flat   = flatById.get(d.flatId)
      const tenant = tenantById.get(d.tenantId)
      const owner  = ownerById.get(d.ownerId)
      const { y, m } = getYearMonth(d)

      return {
        id: d.id,
        flatId: d.flatId,
        type: (() => {
          if (d.type === 'Aidat' || d.type === 0) return 0;
          if (d.type === 'Electricity' || d.type === 'Elektrik' || d.type === 1) return 1;
          if (d.type === 'Water' || d.type === 'Su' || d.type === 2) return 2;
          return 0; // Default
        })(),
        flatNumber: d.flatNumber ?? d.flat_code ?? d.FlatCode ?? flat?.code ?? '-',
        tenantCompany: d.tenantName ?? d.TenantCompanyName ?? tenant?.companyName ?? (owner ? `${owner.firstName} ${owner.lastName} (M. Sahibi)` : null) ?? tenant?.company ?? tenant?.fullName ?? flat?.tenantCompanyName ?? null,
        periodYear: y,
        periodMonth: m,
        amount: Number(d.amount ?? d.value ?? d.total ?? 0),
        dueDate: (() => {
  const raw = d.dueDate ?? d.DueDate ?? d.due_date ?? null
  // 0001-01-01 / 1899-12-30 gibi anlamsız tarihleri boş say
  if (!raw) return null
  const t = new Date(raw)
  return (isNaN(t) || t.getFullYear() < 1900) ? null : raw
})(),
        status: normStatus(d.status),
        remainingAmount: Number(d.remainingAmount ?? d.RemainingAmount ?? 0),
        tenantId: d.tenantId ?? d.TenantId ?? null,
        ownerId: d.ownerId ?? d.OwnerId ?? null,
      }
    })
  } catch (e) {
    console.error('Aidatlar alınırken hata:', e)
    dues.value = []
  }
}

/* ---------- Helpers ---------- */

const handleClose = (shouldRefresh) => {
  showAidatEditModal.value = false
  showAidatDeleteModal.value = false
  showManualModal.value = false
  selectedDue.value = null
  if (shouldRefresh) {
    refreshAll()
  }
}

const refreshAll = () => fetchDues()


const handleClearFilters = () => {
  searchTerm.value = ''
  selectedPeriod.value = ''
  selectedType.value = 'all'
  duesPage.value = 1
  console.log('⚡️ Tüm filtreler temizlendi')
}

/* ---------- Formatters ---------- */
const formatNumber = (value) => (value === undefined || value === null || isNaN(value) ? '-' : Number(value).toLocaleString('tr-TR'))
const formatDate = (val) => {
  if (!val) return '-'
  const dt = new Date(val)
  if (isNaN(dt)) return '-'
  if (dt.getFullYear() < 1900) return '-'
  return dt.toLocaleDateString('tr-TR')
}

const typeLabel = (t) => {
  const map = { 0: 'Aidat', 1: 'Elektrik', 2: 'Su' }
  return map[t] ?? 'Diğer'
}


/* ---------- Watchers ---------- */
watch([searchTerm, selectedPeriod, selectedType], () => {
  duesPage.value = 1
})
watch(pageSize, () => { duesPage.value = 1 })
watch(selectedPeriod, () => { fetchDues() })

/* ---------- Mount ---------- */
onMounted(() => {
  refreshAll()
})
</script>
