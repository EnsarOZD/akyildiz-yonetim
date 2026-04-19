<template>
  <div class="p-4 sm:p-6 min-h-screen pb-24 md:pb-6">

    <!-- Sayfa Başlığı -->
    <PageHeader title="Borçlar" subtitle="Aidat ve fatura borçlarını takip edin">
      <template #icon>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </template>
      <template #actions>
        <div v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" class="flex flex-wrap gap-2 shrink-0">
          <button @click="openManualDebt(0)" class="btn btn-sm btn-ghost bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/[0.08] font-bold text-xs">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            AİDAT
          </button>
          <button @click="openManualDebt(1)" class="btn btn-sm btn-ghost bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/[0.08] font-bold text-xs">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            ELEKTRİK
          </button>
          <button @click="openManualDebt(2)" class="btn btn-sm btn-ghost bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/[0.08] font-bold text-xs">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m8-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
            </svg>
            SU
          </button>
          <button @click="showImportModal = true" class="btn btn-sm btn-primary font-bold text-xs">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
            YÜKLE (EXCEL)
          </button>
        </div>
      </template>
    </PageHeader>

    <!-- Yükleniyor -->
    <div v-if="dataStatus.loading" class="space-y-3">
      <div v-for="i in 6" :key="i" class="app-card animate-pulse">
        <div class="h-4 bg-slate-200 dark:bg-[#1c2238] rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-slate-200 dark:bg-[#1c2238] rounded w-1/2"></div>
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
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Toplam Kayıt -->
        <div class="app-card group hover:shadow-xl hover:shadow-slate-500/5 transition-all duration-300">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-[#9aa0b4] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#626885]">Toplam Kayıt</p>
              <p class="text-2xl font-black text-slate-800 dark:text-white tabular-nums tracking-tight mt-0.5">{{ dues.length }}</p>
            </div>
          </div>
        </div>
        <!-- Aidat -->
        <div class="app-card group hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#626885]">Aidat</p>
              <p class="text-2xl font-black text-slate-800 dark:text-white tabular-nums tracking-tight mt-0.5">{{ dues.filter(d => d.type === 0).length }}</p>
            </div>
          </div>
        </div>
        <!-- Elektrik -->
        <div class="app-card group hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#626885]">Elektrik</p>
              <p class="text-2xl font-black text-slate-800 dark:text-white tabular-nums tracking-tight mt-0.5">{{ dues.filter(d => d.type === 1).length }}</p>
            </div>
          </div>
        </div>
        <!-- Su -->
        <div class="app-card group hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 3v1m0 16v1m8-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#626885]">Su</p>
              <p class="text-2xl font-black text-slate-800 dark:text-white tabular-nums tracking-tight mt-0.5">{{ dues.filter(d => d.type === 2).length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtre + Liste Kartı -->
      <div class="app-card !p-0">
        <!-- Filtre Bar -->
        <div class="px-4 pt-4 pb-3 border-b border-slate-200 dark:border-white/[0.07]">
          <FilterBar
            v-model:search="searchTerm"
            v-model:period="selectedPeriod"
            v-model:select-type="selectedType"
            :select-type-options="typeOptions"
            @clear-filters="handleClearFilters"
          />
        </div>

        <!-- Liste Başlığı -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
          <div class="flex items-center gap-3">
            <h3 class="text-[13.5px] font-black text-slate-800 dark:text-[#f1f3f9] uppercase tracking-tight">Borç Listesi</h3>
            <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ filteredDues.length }} Kayıt</span>
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
              <span class="text-xs font-medium text-slate-500 dark:text-[#9aa0b4]">{{ selectedIds.length }} seçildi</span>
              <button @click="showBulkDeleteConfirm = true" class="btn btn-error btn-xs">Sil</button>
            </div>
          </Transition>
        </div>

        <!-- Seçim Satırı -->
        <div v-if="filteredDues.length > 0 && (authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER)" class="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/10 border-b border-white/[0.05]">
          <input
            type="checkbox"
            class="checkbox checkbox-xs checkbox-primary"
            :checked="isAllSelected"
            :indeterminate="isPartiallySelected"
            @change="toggleSelectAll"
          />
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tümünü Seç</span>
        </div>

        <!-- Tablo -->
        <div class="overflow-x-auto">
          <table class="table table-sm w-full border-collapse">
            <thead>
              <tr class="border-b border-white/[0.08]">
                <th class="w-10 px-4 py-4 text-center"></th>
                <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest text-left px-4">Kiracı / Ünite</th>
                <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest text-left px-4">Dönem</th>
                <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest text-left px-4">Vade</th>
                <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest text-right px-4">Tutar (Borç)</th>
                <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest text-center px-4">Durum</th>
                <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest text-center px-4">Aksiyon</th>
              </tr>
            </thead>
            <tbody class="divide-y-0">
              <tr v-if="dataStatus.loading">
                <td colspan="7" class="py-12 text-center text-slate-400">Yükleniyor...</td>
              </tr>
              <tr v-else-if="filteredDues.length === 0">
                <td colspan="7" class="py-20 text-center">
                  <p class="text-sm font-medium text-slate-500">Borç kaydı bulunamadı</p>
                </td>
              </tr>
              <tr 
                v-else 
                v-for="d in duesPaged" 
                :key="d.id || (d.flatId + '-' + d.periodYear + '-' + d.periodMonth)"
                class="group hover:bg-white/[0.02] transition-colors border-b border-white/[0.02]/50 last:border-0"
                :class="selectedIds.includes(d.id) ? 'bg-brand-500/5' : ''"
              >
                <td class="px-4 py-3 text-center">
                  <input
                    v-if="d.id"
                    type="checkbox"
                    class="checkbox checkbox-xs checkbox-primary"
                    :value="d.id"
                    v-model="selectedIds"
                  />
                </td>
                <td class="px-4 py-3">
                  <p class="text-[13.5px] font-black text-slate-800 dark:text-white uppercase tracking-tight truncate group-hover:text-brand-500 transition-colors">
                    {{ d.tenantCompany || d.flatNumber || '-' }}
                  </p>
                  <p v-if="d.invoiceNumber" class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">FAT: {{ d.invoiceNumber }}</p>
                </td>
                <td class="px-4 py-3 text-[11px] font-black text-slate-500 dark:text-[#9aa0b4] tabular-nums tracking-tighter">
                  {{ d.periodYear }}/{{ String(d.periodMonth).padStart(2,'0') }}
                </td>
                <td class="px-4 py-3 text-[11px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-tight">
                  {{ formatDate(d.dueDate) }}
                </td>
                <td class="px-4 py-3 text-right">
                  <p class="text-[14px] font-black text-red-500 tabular-nums tracking-tight">{{ formatNumber(d.amount) }} ₺</p>
                  <p v-if="d.status !== 'paid' && d.remainingAmount > 0 && d.remainingAmount < d.amount"
                    class="text-[9px] text-amber-500 font-bold uppercase tracking-tight mt-0.5">
                    Kalan: {{ formatNumber(d.remainingAmount) }} ₺
                  </p>
                </td>
                <td class="px-4 py-3 text-center">
                  <span :class="[
                    'px-2 py-0.5 rounded-lg text-[9.5px] font-black uppercase tracking-widest shadow-sm border border-transparent',
                    d.status === 'paid'
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                      : d.status === 'partial'
                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                        : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                  ]">
                    {{ d.status === 'paid' ? 'Ödendi' : d.status === 'partial' ? 'Kısmi' : 'Bekliyor' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="dropdown dropdown-end">
                    <button tabindex="0" class="btn btn-ghost btn-xs btn-square text-slate-400 hover:text-brand-500">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/>
                      </svg>
                    </button>
                    <ul tabindex="0" class="dropdown-content menu p-1.5 shadow-card bg-base-100 border border-slate-200 dark:border-white/[0.07] rounded-xl w-32 z-10 text-xs text-left">
                      <li v-if="d.status !== 'paid' && d.remainingAmount > 0 && d.remainingAmount < 1">
                        <a @click="openCloseDebt(d)" class="rounded-lg text-amber-600">Borcu Kapat</a>
                      </li>
                      <li><a @click="editDebt(d)" class="rounded-lg">Düzenle</a></li>
                      <li v-if="authStore.role === ROLES.ADMIN">
                        <a @click="openAidatDelete(d)" class="rounded-lg text-error font-bold">Sil</a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Sayfalama -->
        <div class="border-t border-slate-200 dark:border-white/[0.07]">
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
    <BaseModal
      v-if="showBulkDeleteConfirm"
      :model-value="showBulkDeleteConfirm"
      title="TOPLU SİLME ONAYI"
      icon="🗑️"
      size="sm"
      @close="showBulkDeleteConfirm = false"
    >
      <div class="space-y-6">
        <div class="flex flex-col items-center text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/5">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </div>
          <div class="space-y-2 px-2">
            <p class="text-sm font-black text-[#f1f3f9] uppercase tracking-tight leading-relaxed">
              Kritik İşlem: <span class="text-red-400 font-bold">{{ selectedIds.length }}</span> Kayıt Siliniyor
            </p>
            <p class="text-[11px] text-[#626885] font-medium leading-relaxed italic px-4">
              Seçili tüm borç ve aidat kayıtları kalıcı olarak silinecektir. Bu işlem geri alınamaz.
            </p>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-ghost !bg-transparent border border-white/[0.08] text-[#9aa0b4] flex-1" @click="showBulkDeleteConfirm = false" :disabled="isBulkDeleting">Vazgeç</button>
        <button class="btn btn-error flex-1 font-black uppercase tracking-widest" @click="confirmBulkDelete" :disabled="isBulkDeleting">
          <span v-if="isBulkDeleting" class="loading loading-spinner loading-xs mr-2"></span>
          Kayıtları Sil
        </button>
      </template>
    </BaseModal>

    <!-- Borcu Kapat Onay Modal -->
    <BaseModal
      v-if="showCloseDebtConfirm && selectedDue"
      :model-value="showCloseDebtConfirm"
      title="BAKİYE SIFIRLAMA"
      icon="⚖️"
      size="sm"
      @close="showCloseDebtConfirm = false"
    >
      <div class="space-y-6">
        <div class="flex flex-col items-center text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/5">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="space-y-2 px-2">
            <p class="text-[11px] font-black text-[#f1f3f9] uppercase tracking-widest leading-relaxed">
              {{ selectedDue.tenantCompany || selectedDue.flatNumber }}
            </p>
            <p class="text-xs font-black text-amber-400 tabular-nums uppercase">
              Kalan: {{ formatNumber(selectedDue.remainingAmount) }} ₺
            </p>
            <p class="text-[11px] text-[#626885] font-medium leading-relaxed italic px-4">
              Kuruş farkı sıfırlanarak borç tamamen kapatılacaktır. Onaylıyor musunuz?
            </p>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-ghost !bg-transparent border border-white/[0.08] text-[#9aa0b4] flex-1" @click="showCloseDebtConfirm = false; selectedDue = null" :disabled="isClosingDebt">Vazgeç</button>
        <button class="btn btn-warning flex-1 font-black uppercase tracking-widest text-[#0f1322]" @click="confirmCloseDebt" :disabled="isClosingDebt">
          <span v-if="isClosingDebt" class="loading loading-spinner loading-xs mr-2"></span>
          Borcu Kapat
        </button>
      </template>
    </BaseModal>

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
import { ROLES } from '@/core/constants/roles'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import { useAuthStore } from '@/application/stores/auth'
import FilterBar from '@/presentation/components/common/FilterBar.vue'
import PaginationBar from '@/presentation/components/common/PaginationBar.vue'
import { useErrorHandler } from '@/application/composables/useErrorHandler'
import api from '@/infrastructure/services/api'
import utilityDebtsService from '@/infrastructure/services/utilityDebtsService'
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
        paidAmount: d.paidAmount != null ? Number(d.paidAmount) : (d.PaidAmount != null ? Number(d.PaidAmount) : null),
        paidDate: d.paidDate ?? d.PaidDate ?? null,
        remainingAmount: Number(d.remainingAmount ?? d.RemainingAmount ?? 0),
        tenantId: d.tenantId ?? d.TenantId ?? null,
        ownerId: d.ownerId ?? d.OwnerId ?? null,
        description: d.description ?? d.Description ?? null,
        invoiceNumber: d.invoiceNumber ?? d.InvoiceNumber ?? null,
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
