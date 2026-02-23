<template>
  <!-- Ana Sayfa Konteyneri -->
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">

      <!-- Başlık -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">Kiracı Ödemeleri</h1>
        <div class="flex items-center gap-4">
          <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm">
            Toplam: {{ formatCurrency(totalIncome) }}
          </div>
          <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm">
            Bu Ay: {{ formatCurrency(thisMonthIncome) }}
          </div>
          <div class="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-sm">
            {{ paymentsCount }} ödeme
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
        <button @click="showModal = true" class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Yeni Ödeme Ekle</span>
        </button>
      </div>

      <!-- Yeni Özellikler Butonları -->
      <div v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button @click="showAdvanceManager = true" class="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <span>Avans Hesabı</span>
        </button>
        
        <button @click="showFinancialReports = true" class="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          <span>Finansal Raporlar</span>
        </button>
        
        <button v-if="authStore.role === ROLES.ADMIN" @click="showAuditLogs = true" class="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Sistem Logları</span>
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
        <CustomFilterBar
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

        <!-- Ödeme Kart Listesi -->
        <div class="mt-6 space-y-2">
          <div v-if="filteredPayments.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Aramanızla eşleşen ödeme bulunamadı.</p>
          </div>
          <div v-else>
            <div 
              v-for="p in filteredPayments" 
              :key="p.id"
              class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b dark:border-gray-700/50"
            >
              <div class="md:col-span-5 flex items-center gap-4">
                <div class="flex-shrink-0 h-12 w-12 flex items-center justify-center text-white rounded-full text-xl font-bold" :class="getAvatarColor(getTenantCompany(p.tenantId))">
                   {{ getAvatarInitial(getTenantCompany(p.tenantId)) }}
                </div>
                <div>
                  <p class="font-bold text-gray-800 dark:text-gray-100">{{ getTenantCompany(p.tenantId) }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(getPaymentDate(p)) }}</p>
                </div>
              </div>
              <div class="md:col-span-3 text-left md:text-center text-2xl font-semibold text-green-600 dark:text-green-400">
                {{ formatCurrency(p.amount) }}
              </div>
              <div class="md:col-span-2 text-left md:text-center text-sm text-gray-600 dark:text-gray-300">
                <p class="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <span>{{ getPaymentTypeIcon(p.type) }}</span>
                  <span>{{ getPaymentTypeLabel(normalizePaymentType(p.type)) }}</span>
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
      @save="handlePaymentSave"
      @cancel="handleModalClose"
    />

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

    <div v-if="loading" class="flex justify-center items-center py-12">
      <LoadingSpinner />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ROLES } from '@/constants/roles'
import { useAuthStore } from '@/stores/auth'
import PaymentModal from './PaymentModal.vue'
import CustomFilterBar from '@/components/common/CustomFilterBar.vue'
import AdvanceAccountManager from '@/components/AdvanceAccountManager.vue'
import FinancialReports from '@/components/FinancialReports.vue'
import AuditLogs from '@/components/AuditLogs.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useNotification } from '@/composables/useNotification'
import { usePaymentsStore } from '@/stores/payments.js'
import { useTenantsStore } from '@/stores/tenants.js'
import { paymentTypes, getPaymentTypeLabel } from '@/constants/enums'
import { safeFormatDate } from '@/utils/dateUtils'
import { formatCurrency, getAvatarColor, getAvatarInitial } from '@/utils/uiHelpers'

const { handleNetworkError } = useErrorHandler()
const { showCreateSuccess, showUpdateSuccess, showDeleteSuccess, showSuccess } = useNotification()

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
const showFinancialReports = ref(false)
const showAuditLogs = ref(false)
const loading = computed(() => paymentsStore.loading || tenantsStore.loading)

const filters = ref({
  searchTerm: '',
  period: '',
  type: ''
})

/* ---- Tip yardımcıları ---- */
const normalizePaymentType = (t) => {
  if (typeof t === 'number') return t
  if (t === '' || t === null || t === undefined) return ''
  if (!Number.isNaN(Number(t))) return Number(t)
  const entry = Object.entries(paymentTypes).find(([, lbl]) => lbl === t)
  return entry ? Number(entry[0]) : ''
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
const paymentTypeFilterOptions = computed(() => [
  { value: '', label: 'Tüm Tipler', icon: '📦' },
  ...paymentTypeOptions.value
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

  const fType = normalizePaymentType(filters.value.type)
  if (fType !== '' && fType !== undefined) {
    filtered = filtered.filter(p => normalizePaymentType(p.type) === fType)
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
const handleModalClose = () => {
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
  editMode.value = false
  selectedPaymentId.value = null
}

const deletePayment = async (id) => {
  try {
    await paymentsStore.deletePayment(id)
    showDeleteSuccess('Ödeme')
  } catch (error) {
    handleNetworkError(error, { component: 'Payments', action: 'deletePayment' })
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

  if (wasEdit) showUpdateSuccess('Ödeme')
  else showCreateSuccess('Ödeme')
}

const handleAdvanceSuccess = () => {
  showAdvanceManager.value = false
  paymentsStore.fetchAdvanceAccounts()
  showSuccess('Avans hesabı işlemi başarıyla tamamlandı')
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
