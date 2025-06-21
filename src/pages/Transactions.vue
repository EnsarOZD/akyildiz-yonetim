<template>
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      
      <!-- Başlık -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">Tüm İşlemler</h1>
        <div class="flex items-center gap-4">
          <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm">
            Toplam Gelir: {{ formatCurrency(totalIncome) }}
          </div>
          <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm">
            Toplam Gider: {{ formatCurrency(totalExpense) }}
          </div>
          <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm">
            {{ totalTransactionsCount }} işlem
          </div>
        </div>
      </div>

      <!-- Filtreler -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Filtreler</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-700 dark:text-gray-300">İşlem Tipi</span>
            </label>
            <select v-model="filterType" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              <option value="">Tüm Tipler</option>
              <option value="income">Gelir</option>
              <option value="expense">Gider</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-700 dark:text-gray-300">Başlangıç Tarihi</span>
            </label>
            <input type="date" v-model="filterStart" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-700 dark:text-gray-300">Bitiş Tarihi</span>
            </label>
            <input type="date" v-model="filterEnd" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-700 dark:text-gray-300">Arama</span>
            </label>
            <input type="text" v-model="searchTerm" placeholder="Açıklama ara..." class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" />
          </div>
        </div>
      </section>

      <!-- İşlem Listesi -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">İşlem Geçmişi</h2>
          <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
            {{ filteredTransactions.length }} işlem
          </div>
        </div>

        <div v-if="filteredTransactions.length > 0" class="space-y-3">
          <div 
            v-for="(item, index) in filteredTransactions" 
            :key="index"
            class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
          >
            <div class="flex items-center gap-4">
              <div 
                :class="{
                  'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400': item.type === 'income',
                  'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400': item.type === 'expense'
                }"
                class="rounded-full p-3"
              >
                <svg v-if="item.type === 'income'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-800 dark:text-gray-100">
                  {{ item.payer || item.description || 'İşlem' }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(item.date) }}</p>
                <p v-if="item.bank" class="text-xs text-gray-400 dark:text-gray-500">{{ item.bank }}</p>
              </div>
            </div>
            <div class="text-right">
              <p 
                :class="{
                  'text-green-600 dark:text-green-400': item.type === 'income',
                  'text-red-600 dark:text-red-400': item.type === 'expense'
                }"
                class="font-bold text-lg"
              >
                {{ item.type === 'income' ? '+' : '-' }}{{ formatCurrency(item.amount) }}
              </p>
              <p 
                :class="{
                  'text-green-500 dark:text-green-400': item.type === 'income',
                  'text-red-500 dark:text-red-400': item.type === 'expense'
                }"
                class="text-sm font-medium"
              >
                {{ item.type === 'income' ? 'Gelir' : 'Gider' }}
              </p>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <div class="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full p-4 w-fit mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">İşlem Bulunamadı</h3>
          <p class="text-gray-500 dark:text-gray-400">Seçilen kriterlere uygun işlem bulunmuyor.</p>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

const tenants = ref([])
const payments = ref([])
const expenses = ref([])

const filterType = ref('')
const filterStart = ref('')
const filterEnd = ref('')
const searchTerm = ref('')

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '₺0.00'
  return Number(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

const fetchTenants = async () => {
  const snapshot = await getDocs(collection(db, 'tenants'))
  tenants.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

const fetchData = async () => {
  const paymentSnapshot = await getDocs(collection(db, 'payments'))
  payments.value = paymentSnapshot.docs.map(doc => {
    const data = doc.data()
    const tenant = tenants.value.find(t => t.id === data.tenantId)
    return {
      ...data,
      type: 'income',
      payer: tenant?.company || 'Bilinmiyor'
    }
  })

  const expenseSnapshot = await getDocs(collection(db, 'expenses'))
  expenses.value = expenseSnapshot.docs.map(doc => ({
    ...doc.data(),
    type: 'expense'
  }))
}

const allTransactions = computed(() => {
  return [...payments.value, ...expenses.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

const totalIncome = computed(() => {
  return payments.value.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
})

const totalExpense = computed(() => {
  return expenses.value.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
})

const totalTransactionsCount = computed(() => {
  return allTransactions.value.length
})

const filteredTransactions = computed(() => {
  return allTransactions.value.filter(item => {
    const matchesType = !filterType.value || item.type === filterType.value
    const matchesStart = !filterStart.value || item.date >= filterStart.value
    const matchesEnd = !filterEnd.value || item.date <= filterEnd.value
    const matchesSearch = !searchTerm.value || item.description?.toLowerCase().includes(searchTerm.value.toLowerCase())
    return matchesType && matchesStart && matchesEnd && matchesSearch
  })
})

onMounted(() => {
  fetchTenants().then(() => fetchData())
})
</script>
