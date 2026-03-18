<template>
  <!-- Ana Sayfa Konteyneri -->
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center md:text-left">Ödemeler</h1>
        <div class="flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-4">
          <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            <span class="hidden sm:inline">Toplam:</span><span class="sm:hidden text-[10px]">TOPLAM</span> {{ formatCurrency(totalIncome) }}
          </div>
          <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            <span class="hidden sm:inline">Bu Ay:</span><span class="sm:hidden text-[10px]">BU AY</span> {{ formatCurrency(thisMonthIncome) }}
          </div>
          <div class="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            {{ paymentsCount }} <span class="hidden sm:inline">ödeme</span><span class="sm:hidden text-[10px]">KAYIT</span>
          </div>
        </div>
      </div>

      <!-- Özet Bilgi Kartları -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
          <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Bu Ayki Gelir</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ formatCurrency(thisMonthIncome) }}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
          <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full p-3">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Toplam Gelir</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ formatCurrency(totalIncome) }}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
          <div class="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Bu Ayki İşlem Sayısı</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ thisMonthCount }}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
          <div class="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Toplam Avans</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ formatCurrency(totalAdvance) }}</p>
          </div>
        </div>
      </section>

      <!-- Aylık Ödeme Grafiği -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Aylık Ödeme Grafiği</h2>
        </div>
        <div class="h-64 flex items-end justify-between gap-2">
          <div v-for="(month, index) in monthlyPaymentData" :key="index" class="flex-1 flex flex-col items-center gap-2">
            <div class="w-full bg-green-500 rounded-t" :style="{ height: `${(month.total / maxMonthlyPayment) * 200}px` }"></div>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ month.month }}</span>
          </div>
        </div>
      </section>

      <!-- Ödeme Tipi Dağılımı -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Ödeme Tipi Dağılımı</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div v-for="type in paymentTypeStats" :key="type.name" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-2xl">{{ type.icon }}</span>
              <div>
                <p class="font-semibold text-gray-800 dark:text-gray-100">{{ type.label }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ type.count }} ödeme</p>
              </div>
            </div>
            <p class="text-lg font-bold text-green-600 dark:text-green-400">{{ formatCurrency(type.total) }}</p>
          </div>
        </div>
      </section>

      <!-- Yeni Ödeme Ekle Butonu -->
      <div v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" class="mb-6">
        <button @click="showModal = true" class="btn btn-primary w-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Yeni Ödeme Ekle
        </button>
      </div>

      <!-- Yeni Özellikler Butonları -->
      <div v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button @click="showAdvanceManager = true" class="btn btn-secondary w-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          Avans Hesabı
        </button>

        <button @click="showFinancialReports = true" class="btn btn-success w-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          Finansal Raporlar
        </button>

        <button v-if="authStore.role === ROLES.ADMIN" @click="showAuditLogs = true" class="btn btn-warning w-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Sistem Logları
        </button>
      </div>

      <!-- Avans Hesapları -->
      <div v-if="advanceAccounts.length > 0" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          Avans Hesapları
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="advance in advanceAccounts" :key="advance.id" class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold text-gray-800 dark:text-gray-100">{{ getTenantCompany(advance.tenantId) }}</span>
              <span class="badge badge-success badge-sm">Aktif</span>
            </div>
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {{ formatCurrency(Number(advance.balance ?? advance.amount ?? 0)) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatDate(advance.updatedAt || advance.lastMovementAt || advance.createdAt || advance.paymentDate) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Filtreler ve Liste -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <!-- Filtreler ve Toplu İşlemler -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
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

          <!-- Seçili Ödemeleri Sil Butonu -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-2 sm:translate-y-0 sm:translate-x-2"
            enter-to-class="opacity-100 translate-y-0 sm:translate-x-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:translate-x-0"
            leave-to-class="opacity-0 translate-y-2 sm:translate-y-0 sm:translate-x-2"
          >
            <div v-if="selectedIds.length > 0" class="flex items-center gap-2 mt-2 sm:mt-0">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{ selectedIds.length }} kayıt seçildi
              </span>
              <button @click="showBulkDeleteConfirm = true" class="btn btn-error btn-sm text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Seçilenleri Sil
              </button>
            </div>
          </Transition>
        </div>

        <!-- Seçim Başlığı / Satırı -->
        <div v-if="filteredPayments.length > 0" class="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-t-lg border-b border-gray-200 dark:border-gray-600 mt-2">
          <input 
            type="checkbox" 
            class="checkbox checkbox-sm checkbox-primary rounded"
            :checked="isAllSelected"
            :indeterminate="isPartiallySelected"
            @change="toggleSelectAll"
          />
          <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tümünü Seç</span>
        </div>

        <!-- Ödeme Kart Listesi -->
        <div class="mt-2 space-y-2">
          <div v-if="filteredPayments.length === 0" class="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
            <h3 class="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">Ödeme Bulunamadı</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Seçilen kriterlere uygun ödeme kaydı yok.</p>
            <button @click="handleClearFilters" class="btn btn-outline btn-sm">Filtreleri Temizle</button>
          </div>
            <div v-else>
              <div 
                v-for="p in paymentsView" 
                :key="p.id"
                :class="[
                  'grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 transition-colors duration-200 border-b dark:border-gray-700/50',
                  selectedIds.includes(p.id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                ]"
              >
                <!-- Seçim Kutusu -->
                <div class="md:col-span-1 flex items-center justify-center md:justify-start">
                  <input 
                    type="checkbox" 
                    class="checkbox checkbox-sm checkbox-primary rounded"
                    :value="p.id"
                    v-model="selectedIds"
                  />
                </div>

                <div class="md:col-span-4 flex items-center gap-4">
                  <div class="flex-shrink-0 h-12 w-12 flex items-center justify-center text-white rounded-full text-xl font-bold" :class="getAvatarColor(p.company)">
                     {{ getAvatarInitial(p.company) }}
                  </div>
                  <div>
                    <p class="font-bold text-gray-800 dark:text-gray-100">{{ p.company }}</p>
                    <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{{ formatDate(getPaymentDate(p)) }}</span>
                      <span v-if="p.periodYear && p.periodYear > 2000" class="badge badge-outline badge-xs text-xs">
                        {{ p.periodYear }}-{{ String(p.periodMonth).padStart(2, '0') }}
                      </span>
                    </div>
                    <p v-if="p.description" class="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate max-w-xs" :title="p.description">
                      {{ p.description }}
                    </p>
                  </div>
                </div>
              <div class="md:col-span-3 text-left md:text-center text-2xl font-semibold text-green-600 dark:text-green-400">
                {{ formatCurrency(p.amount) }}
              </div>
              <div class="md:col-span-2 text-left md:text-center text-sm text-gray-600 dark:text-gray-300">
                <p class="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <span>{{ getPaymentDisplayIcon(p) }}</span>
                  <span>{{ getPaymentDisplayLabel(p) }}</span>
                </p>
                <p>{{ p.bank }}</p>
              </div>
              <div v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" class="md:col-span-2 text-right">
                <div class="dropdown dropdown-end">
                  <label tabindex="0" class="btn btn-ghost btn-sm">İşlemler</label>
                  <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-32 z-10">
                    <li><a @click="startEdit(p)">Düzenle</a></li>
                    <li><a @click="deletePayment(p.id)" class="text-red-500">Sil</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <PaginationBar
              v-model:currentPage="currentPage"
              v-model:pageSize="pageSize"
              :total-count="filteredPayments.length"
            />
          </div>
        </div>
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

    <!-- Confirm Dialog (DaisyUI) -->
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
        <p class="py-4">Seçili <strong>{{ selectedIds.length }}</strong> ödeme kaydını silmek istediğinize emin misiniz? Bu ödemelere bağlı tahsilat ve avans kullanım durumları da geri alınacaktır.</p>
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

    <!-- Avans Hesabı Yönetimi Modal -->
    <dialog v-if="showAdvanceManager" class="modal" open>
      <div class="modal-box max-w-4xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold">Avans Hesabı Yönetimi</h3>
          <button @click="showAdvanceManager = false" class="btn btn-sm btn-ghost">✕</button>
        </div>
        <AdvanceAccountManager @success="handleAdvanceSuccess" />
      </div>
    </dialog>

    <!-- Finansal Raporlar Modal -->
    <dialog v-if="showFinancialReports" class="modal" open>
      <div class="modal-box max-w-6xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold">Finansal Raporlar</h3>
          <button @click="showFinancialReports = false" class="btn btn-sm btn-ghost">✕</button>
        </div>
        <FinancialReports />
      </div>
    </dialog>

    <!-- Audit Logs Modal -->
    <dialog v-if="showAuditLogs" class="modal" open>
      <div class="modal-box max-w-6xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold">Sistem Logları</h3>
          <button @click="showAuditLogs = false" class="btn btn-sm btn-ghost">✕</button>
        </div>
        <AuditLogs />
      </div>
    </dialog>

    <div v-if="loading">
      <SkeletonRows :rows="6" />
    </div>
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
