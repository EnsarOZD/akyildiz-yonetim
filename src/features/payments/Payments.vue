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
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-300" @click="showModal = true">
           <button class="w-full h-full text-blue-500 dark:text-blue-400 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            <span class="font-semibold">Yeni Ödeme Ekle</span>
          </button>
        </div>
      </section>

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
                <p class="font-semibold text-gray-800 dark:text-gray-100">{{ p.type }}</p>
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
      @save="savePayment"
      @cancel="cancelEdit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '../../firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import PaymentModal from './PaymentModal.vue'
import FilterBar from '@/components/common/FilterBar.vue'

const payments = ref([])
const tenants = ref([])
const banks = ref(['Ziraat', 'İş Bankası', 'Garanti', 'Yapı Kredi', 'Halkbank'])
const showModal = ref(false)

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
  payments.value = []
  const querySnapshot = await getDocs(collection(db, "payments"))
  querySnapshot.forEach(docSnapshot => {
    payments.value.push({
      id: docSnapshot.id,
      ...docSnapshot.data()
    })
  })
}

const fetchTenants = async () => {
  tenants.value = []
  const querySnapshot = await getDocs(collection(db, "tenants"))
  querySnapshot.forEach(docSnapshot => {
    tenants.value.push({
      id: docSnapshot.id,
      ...docSnapshot.data()
    })
  })
}

const getTenantCompany = (id) => {
  const tenant = tenants.value.find(t => t.id === id)
  return tenant ? (tenant.company || `${tenant.firstName} ${tenant.lastName}`) : 'Bilinmiyor'
}

const savePayment = async () => {
  if (editMode.value && selectedPaymentId.value) {
    const paymentRef = doc(db, "payments", selectedPaymentId.value)
    await updateDoc(paymentRef, { ...newPayment.value })
  } else {
    await addDoc(collection(db, "payments"), { ...newPayment.value })
  }

  newPayment.value = {
    date: new Date().toISOString().substring(0, 10),
    tenantId: '',
    amount: null,
    type: '',
    bank: ''
  }
  editMode.value = false
  selectedPaymentId.value = null
  await fetchPayments()
  showModal.value = false
}

const deletePayment = async (id) => {
  const confirmed = confirm("Bu ödemeyi silmek istediğinize emin misiniz?")
  if (!confirmed) return

  await deleteDoc(doc(db, "payments", id))
  payments.value = payments.value.filter(p => p.id !== id)
}

const startEdit = (payment) => {
  newPayment.value = { ...payment }
  selectedPaymentId.value = payment.id
  editMode.value = true
  showModal.value = true
}

const cancelEdit = () => {
  newPayment.value = {
    date: new Date().toISOString().substring(0, 10),
    tenantId: '',
    amount: null,
    type: '',
    bank: ''
  }
  editMode.value = false
  selectedPaymentId.value = null
  showModal.value = false
}

const handleClearFilters = () => {
  clearFilters()
  fetchPayments()
}

onMounted(() => {
  fetchTenants()
  fetchPayments()
})
</script>
