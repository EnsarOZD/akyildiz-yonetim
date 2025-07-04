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

      <!-- Yeni Ödeme Ekle Butonu -->
      <div class="mb-6">
        <button @click="showModal = true" class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Yeni Ödeme Ekle</span>
        </button>
      </div>

      <!-- Avans Hesapları Bölümü -->
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
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">{{ formatCurrency(advance.amount) }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ advance.paymentDate }}</p>
          </div>
        </div>
      </div>

      <!-- Filtreler ve Liste Alanı -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <FilterBar
            v-model:search="filters.searchTerm"
            search-placeholder="Firma, tutar, tip veya banka ara..."
            v-model:period="filters.period"
            @clear-filters="handleClearFilters"
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
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ p.date }}</p>
                </div>
              </div>
              <div class="md:col-span-3 text-left md:text-center text-2xl font-semibold text-green-600 dark:text-green-400">
                {{ formatCurrency(p.amount) }}
              </div>
              <div class="md:col-span-2 text-left md:text-center text-sm text-gray-600 dark:text-gray-300">
                <p class="font-semibold text-gray-800 dark:text-gray-100">
                  <span v-if="p.type === 'Karma'" class="badge badge-primary badge-sm">Karma Ödeme</span>
                  <span v-else>{{ p.type }}</span>
                </p>
                <p>{{ p.bank }}</p>
              </div>
              <div class="md:col-span-2 text-right">
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
    <PaymentModal
      :visible="showModal"
      :payment="newPayment"
      :tenants="tenants"
      :banks="banks"
      :editMode="editMode"
      @save="handlePaymentSave"
      @cancel="handleModalClose"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PaymentModal from './PaymentModal.vue'
import FilterBar from '@/components/common/FilterBar.vue'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useNotification } from '@/composables/useNotification'
import { useEventBus } from '@/composables/useEventBus'
import paymentsService from '@/services/paymentsService'
import tenantsService from '@/services/tenantsService'

const { handleNetworkError, handleValidationError, showSuccess } = useErrorHandler()
const { showCreateSuccess, showUpdateSuccess, showDeleteSuccess } = useNotification()
const { emit: emitEvent } = useEventBus()

const payments = ref([])
const tenants = ref([])
const advanceAccounts = ref([])
const banks = ref(['Ziraat', 'İş Bankası', 'Garanti', 'Yapı Kredi', 'Halkbank'])
const showModal = ref(false)
const useBackend = ref(true) // Backend kullanım durumunu takip etmek için

const filters = ref({
  searchTerm: '',
  period: '',
})

const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '₺0.00'
  return Number(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

const totalIncome = computed(() => payments.value.reduce((sum, p) => sum + Number(p.amount || 0), 0))

const thisMonthIncome = computed(() => {
  const today = new Date();
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
  return payments.value
    .filter(p => p.date.startsWith(currentMonth))
    .reduce((sum, p) => sum + Number(p.amount || 0), 0)
})

const thisMonthCount = computed(() => {
  const today = new Date();
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
  return payments.value.filter(p => p.date.startsWith(currentMonth)).length
})

const paymentsCount = computed(() => {
  return payments.value.length
})

const totalAdvance = computed(() => {
  return advanceAccounts.value.reduce((sum, advance) => sum + Number(advance.amount || 0), 0)
})

const clearFilters = () => {
  filters.value = { searchTerm: '', period: '' }
}

const getAvatarInitial = (name) => {
  if (!name || name === 'Bilinmiyor') return '?'
  return name.charAt(0).toUpperCase()
}

const getAvatarColor = (name) => {
  if (!name) return 'bg-gray-500'
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-emerald-500', 'bg-red-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500']
  const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[charCodeSum % colors.length]
}

const filteredPayments = computed(() => {
  let filtered = payments.value
  const searchTerm = filters.value.searchTerm.toLowerCase()

  if (filters.value.period) {
    filtered = filtered.filter(p => p.date.startsWith(filters.value.period))
  }

  if (searchTerm) {
    filtered = filtered.filter(p =>
      p.amount.toString().includes(searchTerm) ||
      getTenantCompany(p.tenantId).toLowerCase().includes(searchTerm) ||
      p.type.toLowerCase().includes(searchTerm) ||
      p.bank.toLowerCase().includes(searchTerm)
    )
  }
  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
})

const newPayment = ref({
  date: new Date().toISOString().substring(0, 10),
  tenantId: '',
  amount: null,
  type: '',
  bank: ''
})

const editMode = ref(false)
const selectedPaymentId = ref(null)

const fetchPayments = async () => {
  try {
    const data = await paymentsService.getPayments();
    payments.value = data;
    console.log('✅ Backend API kullanılıyor - Ödemeler');
  } catch (error) {
    console.error('Ödemeler yüklenirken hata:', error);
    handleNetworkError(error, { component: 'Payments', action: 'fetchPayments' })
  }
}

const fetchTenants = async () => {
  try {
    const data = await tenantsService.getTenants();
    tenants.value = data;
    console.log('✅ Backend API kullanılıyor - Kiracılar');
  } catch (error) {
    console.error('Kiracılar yüklenirken hata:', error);
    handleNetworkError(error, { component: 'Payments', action: 'fetchTenants' })
  }
}

const fetchAdvanceAccounts = async () => {
  try {
    const data = await paymentsService.getAdvanceAccounts();
    const validAdvances = data.filter(advance => advance.balance > 0);
    advanceAccounts.value = validAdvances;
    console.log(`✅ Backend API kullanılıyor - ${validAdvances.length} adet avans hesabı`);
  } catch (error) {
    console.error('Avans hesapları yüklenirken hata:', error)
    advanceAccounts.value = []
    handleNetworkError(error, { component: 'Payments', action: 'fetchAdvanceAccounts' })
  }
}

const getTenantCompany = (id) => {
  const tenant = tenants.value.find(t => t.id === id)
  return tenant ? (tenant.company || `${tenant.firstName} ${tenant.lastName}`) : 'Bilinmiyor'
}

const handleModalClose = () => {
  console.log('🚪 Modal kapatılıyor...')
  showModal.value = false
  
  // Formu sıfırla
  newPayment.value = {
    date: new Date().toISOString().substring(0, 10),
    tenantId: '',
    amount: null,
    type: '',
    bank: ''
  }
  editMode.value = false
  selectedPaymentId.value = null
}

const deletePayment = async (id) => {
  try {
    await paymentsService.deletePayment(id);
    showDeleteSuccess('Ödeme');
    await fetchPayments();
    await fetchAdvanceAccounts();
  } catch (error) {
    handleNetworkError(error, { component: 'Payments', action: 'deletePayment' })
  }
}

const startEdit = (payment) => {
  newPayment.value = { ...payment }
  selectedPaymentId.value = payment.id
  editMode.value = true
  showModal.value = true
}

const handleClearFilters = () => {
  clearFilters()
  fetchPayments()
}

const handlePaymentSave = async () => {
  console.log('🔄 Ödeme kaydedildi, listeler güncelleniyor...')
  
  // Modal'ı kapat
  showModal.value = false
  
  // Formu sıfırla
  newPayment.value = {
    date: new Date().toISOString().substring(0, 10),
    tenantId: '',
    amount: null,
    type: '',
    bank: ''
  }
  editMode.value = false
  selectedPaymentId.value = null
  
  // Listeleri güncelle
  await Promise.all([
    fetchPayments(),
    fetchAdvanceAccounts()
  ])
  
  showCreateSuccess('Ödeme')
  console.log('✅ Ödeme işlemi tamamlandı')
}

onMounted(() => {
  fetchTenants()
  fetchAdvanceAccounts()
  fetchPayments()
})
</script>
