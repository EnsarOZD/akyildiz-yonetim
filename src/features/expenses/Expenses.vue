<template>
  <!-- Ana Sayfa Konteyneri -->
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      <!-- Başlık ve Kontroller -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center md:text-left">Giderler</h1>

        <div class="flex items-center justify-center md:justify-end gap-3 flex-wrap">
          <!-- Tarih Filtresi -->
          <select
            v-model="dateFilter"
            @change="fetchExpenses"
            class="select select-sm select-bordered bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 min-w-[140px]"
          >
            <option value="all">Tüm Zamanlar</option>
            <option value="this_month">Bu Ay</option>
            <option value="last_month">Geçen Ay</option>
            <option value="this_year">Bu Yıl</option>
          </select>

          <!-- Refresh Butonu -->
          <button
            @click="fetchExpenses"
            :disabled="loading"
            class="btn btn-sm btn-outline btn-primary shadow-sm"
          >
            <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div>
            Yenile
          </button>
        </div>
      </div>

      <!-- Loading durumu -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400 text-lg">Giderler yükleniyor...</p>
        </div>
      </div>

      <!-- Error durumu -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
        <div class="flex items-center gap-3">
          <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-red-800 dark:text-red-200">Veri Yükleme Hatası</h3>
            <p class="text-red-600 dark:text-red-300">{{ error }}</p>
          </div>
        </div>
        <button
          @click="fetchExpenses"
          class="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Tekrar Dene
        </button>
      </div>

      <!-- Sayfa içeriği -->
      <div v-else>
        <!-- Özet Bilgi Kartları -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
            <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 17h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Bu Ayki Gider</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ formatCurrency(thisMonthExpense) }}</p>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
            <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 0v6m0-6L9 13" /></svg>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Toplam Gider</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ formatCurrency(totalExpense) }}</p>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
            <div class="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">İşlem Sayısı (Bu Ay)</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ thisMonthCount }}</p>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-400 transition-colors duration-300" @click="openNewExpenseModal">
            <button class="w-full h-full text-red-500 dark:text-red-400 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              <span class="font-semibold">Yeni Gider Ekle</span>
            </button>
          </div>
        </section>

        <!-- Aylık Gider Grafiği -->
        <section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Aylık Gider Grafiği</h2>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Gider</span>
              </div>
            </div>
          </div>

          <div class="h-64 flex items-end justify-between gap-2">
            <div
              v-for="(month, index) in monthlyData"
              :key="index"
              class="flex-1 flex flex-col items-center gap-2"
            >
              <div
                class="w-full bg-red-500 rounded-t"
                :style="{ height: `${(month.expense / maxAmount) * 200}px` }"
              ></div>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ month.month }}</span>
            </div>
          </div>
        </section>

        <!-- Gider Tipi Dağılımı -->
        <section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Gider Tipi Dağılımı</h2>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              v-for="type in expenseTypeStats"
              :key="type.name"
              class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">{{ getExpenseIcon(type.name) }}</span>
                <div>
                  <p class="font-semibold text-gray-800 dark:text-gray-100">{{ type.label }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ type.count }} gider</p>
                </div>
              </div>
              <p class="text-lg font-bold text-red-600 dark:text-red-400">{{ formatCurrency(type.total) }}</p>
            </div>
          </div>
        </section>

        <!-- Filtreler ve Liste Alanı -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <CustomFilterBar
            :search="filters.searchTerm"
            :period="filters.period"
            :select-type="filters.type"
            :select-type-options="expenseTypeOptions"
            @update:search="val => (filters.searchTerm = val)"
            @update:period="val => (filters.period = val)"
            @update:select-type="val => (filters.type = val)"
            @clearFilters="handleClearFilters"
          />

          <!-- Gider Kart Listesi -->
          <div class="mt-6 space-y-2">
            <div v-if="filteredExpenses.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>Aramanızla eşleşen gider bulunamadı.</p>
            </div>
            <div v-else>
              <div
                v-for="e in filteredExpenses"
                :key="e.id"
                class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b dark:border-gray-700/50"
              >
                <div class="md:col-span-5 flex items-center gap-4">
                  <div class="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-2xl">
                    {{ getExpenseIcon(e.type) }}
                  </div>
                  <div>
                    <p class="font-bold text-gray-800 dark:text-gray-100">{{ e.title || 'Açıklama Yok' }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(e.expenseDate) || 'Tarih Yok' }}</p>
                  </div>
                </div>
                <div class="md:col-span-3 text-left md:text-center text-xl font-semibold text-red-600 dark:text-red-400">
                  {{ formatCurrency(e.amount) }}
                </div>
                <div class="md:col-span-2 text-left md:text-center">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                    {{ getExpenseTypeName(e.type) || 'Tip Yok' }}
                  </span>
                </div>
                <div class="md:col-span-2 text-right">
                  <div class="dropdown dropdown-end">
                    <label tabindex="0" class="btn btn-ghost btn-sm">İşlemler</label>
                    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-32 z-10">
                      <li><a @click="startEdit(e)">Düzenle</a></li>
                      <li><a @click="deleteExpense(e.id)" class="text-red-500">Sil</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- /Filtreler ve Liste Alanı -->
      </div>
    </div>

    <ExpenseModal
      :visible="showModal"
      :expense="newExpense"
      :types="expenseTypeOptions"
      :editMode="editMode"
      :loading="modalLoading"
      :error="modalError"
      @save="saveExpense"
      @close="cancelEdit"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import expensesService from '@/services/expensesService'
import ExpenseModal from './ExpenseModal.vue'
import CustomFilterBar from '@/components/common/CustomFilterBar.vue'
import { useErrorHandler } from '@/composables/useErrorHandler'

/* ✅ Enums’tan merkezi import */
import {
  expenseTypeOptions,
  getExpenseTypeString,
  getExpenseTypeName,
  getExpenseIcon
} from '@/constants/enums'

const { handleNetworkError, showSuccess } = useErrorHandler()

const expenses = ref([])
const loading = ref(false)
const error = ref(null)
const expenseStats = ref({})
const showModal = ref(false)
const editMode = ref(false)
const selectedExpenseId = ref(null)
const dateFilter = ref('all')
const modalLoading = ref(false)
const modalError = ref(null)

/** reactive filtre nesnesi */
const filters = reactive({
  searchTerm: '',
  period: '',
  type: ''
})

/** Para/Tarih formatları */
const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '₺0.00'
  return Number(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR')
}

/** Tarih aralığı yardımcı */
const getDateRange = (filter) => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  switch (filter) {
    case 'this_month':
      return {
        startDate: new Date(year, month, 1).toISOString().split('T')[0],
        endDate: new Date(year, month + 1, 0).toISOString().split('T')[0]
      }
    case 'last_month':
      return {
        startDate: new Date(year, month - 1, 1).toISOString().split('T')[0],
        endDate: new Date(year, month, 0).toISOString().split('T')[0]
      }
    case 'this_year':
      return {
        startDate: new Date(year, 0, 1).toISOString().split('T')[0],
        endDate: new Date(year, 11, 31).toISOString().split('T')[0]
      }
    default:
      return { startDate: null, endDate: null }
  }
}

/** Özetler */
const totalExpense = computed(() => expenseStats.value?.totalAmount || 0)
const thisMonthExpense = computed(() => expenseStats.value?.thisMonthAmount || 0)
const thisMonthCount = computed(() => expenseStats.value?.thisMonthCount || 0)

/** Aylık grafikte eşleştirme için */
const monthKeyOf = (d) => {
  const dd = new Date(d)
  return `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, '0')}`
}
const monthlyData = computed(() => {
  const months = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = date.toLocaleDateString('tr-TR', { month: 'short' })
    const monthExpense = expenses.value
      .filter(e => e.expenseDate && monthKeyOf(e.expenseDate) === key)
      .reduce((sum, e) => sum + Number(e.amount || 0), 0)
    months.push({ month: label, expense: monthExpense })
  }
  return months
})
const maxAmount = computed(() => {
  const all = monthlyData.value.map(m => m.expense)
  return Math.max(...all, 1)
})

/** Tip istatistikleri */
const expenseTypeStats = computed(() => {
  const stats = {}
  expenses.value.forEach(expense => {
    const type = getExpenseTypeString(expense.type)
    if (!stats[type]) {
      stats[type] = { name: type, label: getExpenseTypeName(type), count: 0, total: 0 }
    }
    stats[type].count++
    stats[type].total += Number(expense.amount || 0)
  })
  return Object.values(stats).sort((a, b) => b.total - a.total)
})

/** Liste filtreleme */
const filteredExpenses = computed(() => {
  let list = expenses.value.slice()
  const q = (filters.searchTerm || '').toLowerCase()

  if (filters.period) {
    list = list.filter(p => {
      const expenseDate = new Date(p.expenseDate)
      const periodDate = new Date(filters.period)
      return (
        expenseDate.getFullYear() === periodDate.getFullYear() &&
        expenseDate.getMonth() === periodDate.getMonth()
      )
    })
  }

  if (filters.type) {
    list = list.filter(e => getExpenseTypeString(e.type) === filters.type)
  }

  if (q) {
    list = list.filter(e =>
      (e.title && e.title.toLowerCase().includes(q)) ||
      (e.description && e.description.toLowerCase().includes(q)) ||
      getExpenseTypeName(e.type).toLowerCase().includes(q) ||
      (e.amount && String(e.amount).includes(q))
    )
  }

  return list.sort((a, b) => {
    const da = a.expenseDate ? new Date(a.expenseDate).getTime() : 0
    const db = b.expenseDate ? new Date(b.expenseDate).getTime() : 0
    return db - da
  })
})

/** Yeni kayıt formu */
const today = new Date().toISOString().substr(0, 10)
const newExpense = ref({
  expenseDate: today,
  title: '',
  amount: '',
  type: 'Other',
  description: ''
})

/** API çağrıları */
import { useNotify } from '@/composables/useNotify'
const { notifyError } = useNotify()

const fetchExpenses = async () => {
  loading.value = true
  error.value = null
  try {
    const query = {}
    if (dateFilter.value !== 'all') {
      const { startDate, endDate } = getDateRange(dateFilter.value)
      query.startDate = startDate
      query.endDate = endDate
    }

    const response = await expensesService.getExpenses(query)
    expenses.value = response || []

    // İstatistik endpoint’i tarih desteklemiyorsa fallback
    try {
      const stats = await expensesService.getExpenseStats(query)
      expenseStats.value = stats || {}
    } catch {
      const stats = await expensesService.getExpenseStats()
      expenseStats.value = stats || {}
    }
  } catch (apiError) {
    handleNetworkError(apiError, { component: 'Expenses', action: 'fetchExpenses' })
    error.value = apiError?.message || 'Giderler yüklenemedi.'
    expenses.value = []
    expenseStats.value = {}
  } finally {
    loading.value = false
  }
}

/** CRUD */
const startEdit = (expense) => {
  newExpense.value = {
    ...expense,
    expenseDate: new Date(expense.expenseDate).toISOString().substr(0, 10)
  }
  selectedExpenseId.value = expense.id
  editMode.value = true
  showModal.value = true
}
const openNewExpenseModal = () => {
  newExpense.value = {
    expenseDate: today,
    title: '',
    amount: '',
    type: 'Other',
    description: ''
  }
  editMode.value = false
  selectedExpenseId.value = null
  showModal.value = true
}
const cancelEdit = () => {
  newExpense.value = {
    expenseDate: today,
    title: '',
    amount: '',
    type: 'Other',
    description: ''
  }
  editMode.value = false
  selectedExpenseId.value = null
  showModal.value = false
  modalError.value = null
  modalLoading.value = false
}
const deleteExpense = async (id) => {
  if (!confirm('Bu gideri silmek istediğinizden emin misiniz?')) return
  try {
    await expensesService.deleteExpense(id)
    showSuccess('Gider')
    await fetchExpenses()
  } catch (err) {
    console.error('Gider silinirken hata:', err)
    notifyError('Gider silinirken bir hata oluştu')
  }
}
const saveExpense = async (expenseData) => {
  modalLoading.value = true
  modalError.value = null
  try {
    const amount = parseFloat(expenseData.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      modalError.value = 'Geçerli bir tutar girin.'
      modalLoading.value = false
      return
    }
    const data = {
      title: expenseData.title?.trim() || '',
      amount,
      type: getExpenseTypeString(expenseData.type),
      expenseDate: new Date(expenseData.expenseDate).toISOString(),
      description: expenseData.description?.trim() || ''
    }

    if (editMode.value && selectedExpenseId.value) {
      await expensesService.updateExpense(selectedExpenseId.value, data)
      showSuccess('Gider güncellendi')
    } else {
      await expensesService.createExpense(data)
      showSuccess('Gider eklendi')
    }
    await fetchExpenses()
    cancelEdit()
  } catch (err) {
    console.error('Gider kaydedilirken hata:', err)
    modalError.value = err?.message || 'Gider kaydedilirken bir hata oluştu'
  } finally {
    modalLoading.value = false
  }
}

/** Filtreleri sıfırla */
const clearFilters = () => {
  Object.assign(filters, { searchTerm: '', period: '', type: '' })
}
const handleClearFilters = () => {
  clearFilters()
  dateFilter.value = 'all'
  fetchExpenses()
}

onMounted(() => {
  fetchExpenses()
})
</script>

<style scoped>
</style>
