<template>
  <div class="p-4 sm:p-6 min-h-screen pb-24 md:pb-6">

    <!-- Sayfa Başlığı -->
    <PageHeader title="Giderler" subtitle="İşletme giderlerini takip edin ve yeni harcamaları buradan yönetin">
      <template #icon>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </template>
      <template #actions>
        <div class="flex items-center gap-3">
          <select v-model="dateFilter" @change="fetchExpenses" class="select select-sm select-bordered h-10 border-slate-200 dark:border-white/[0.07] bg-white/50 dark:bg-slate-800/50">
            <option value="all">Tüm Zamanlar</option>
            <option value="this_month">Bu Ay</option>
            <option value="last_month">Geçen Ay</option>
            <option value="this_year">Bu Yıl</option>
          </select>
          <button
            @click="openNewExpenseModal"
            class="btn btn-sm btn-primary h-10 px-4"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Yeni Gider
          </button>
        </div>
      </template>
    </PageHeader>

    <!-- Yükleniyor -->
    <div v-if="loading" class="space-y-3">
      <SkeletonRows :rows="6" />
    </div>

    <!-- Hata -->
    <div v-else-if="error" class="app-card border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10 mb-5">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-red-800 dark:text-red-200">Veri yüklenemedi</p>
          <p class="text-xs text-red-600 dark:text-red-300">{{ error }}</p>
        </div>
        <button @click="fetchExpenses" class="btn btn-error btn-xs ml-auto">Tekrar Dene</button>
      </div>
    </div>

    <template v-else>
      <!-- İstatistik Kartları -->
      <div class="grid grid-cols-3 gap-3 sm:gap-4 mb-5">
        <div class="app-card flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center shrink-0">
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-[#626885] truncate">Bu Ay</p>
            <p class="text-sm font-bold text-slate-800 dark:text-white tabular-nums">{{ formatCurrency(thisMonthExpense) }}</p>
          </div>
        </div>
        <div class="app-card flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-500/[0.08] text-brand-500 flex items-center justify-center shrink-0">
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 7h6m0 0v6m0-6L9 13"/>
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-[#626885] truncate">Toplam</p>
            <p class="text-sm font-bold text-slate-800 dark:text-white tabular-nums">{{ formatCurrency(totalExpense) }}</p>
          </div>
        </div>
        <div class="app-card flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center shrink-0">
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-[#626885] truncate">Bu Ay İşlem</p>
            <p class="text-xl font-bold text-slate-800 dark:text-white tabular-nums">{{ thisMonthCount }}</p>
          </div>
        </div>
      </div>

      <!-- Grafik + Tip Dağılımı -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <div class="app-card">
          <h2 class="text-sm font-semibold text-slate-700 dark:text-[#f1f3f9] mb-4">Aylık Gider Grafiği</h2>
          <div class="h-40 flex items-end gap-1.5">
            <div v-for="(month, index) in monthlyData" :key="index" class="flex-1 flex flex-col items-center gap-1.5">
              <div
                class="w-full bg-red-400 dark:bg-red-500 rounded-t transition-all duration-500"
                :style="{ height: `${Math.max((month.expense / maxAmount) * 130, month.expense > 0 ? 4 : 2)}px` }"
              ></div>
              <span class="text-[10px] text-slate-400 dark:text-[#626885] font-medium">{{ month.month }}</span>
            </div>
          </div>
        </div>
        <div class="app-card">
          <h2 class="text-sm font-semibold text-slate-700 dark:text-[#f1f3f9] mb-4">Tip Dağılımı</h2>
          <div class="space-y-2.5">
            <div v-for="type in expenseTypeStats" :key="type.name" class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-semibold text-slate-700 dark:text-[#f1f3f9]">{{ type.label }}</p>
                  <p class="text-[10px] text-slate-400 dark:text-[#626885]">{{ type.count }} gider</p>
                </div>
              </div>
              <p class="text-sm font-bold text-red-500 dark:text-red-400 tabular-nums">{{ formatCurrency(type.total) }}</p>
            </div>
            <div v-if="expenseTypeStats.length === 0" class="text-xs text-slate-400 dark:text-[#626885] text-center py-4">Veri yok</div>
          </div>
        </div>
      </div>

      <!-- Filtreler + Liste -->
      <div class="app-card !p-0">
        <!-- Filtreler -->
        <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-700/60">
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
        </div>

        <!-- Boş Durum -->
        <EmptyState v-if="filteredExpenses.length === 0" title="Gider bulunamadı" description="Seçilen kriterlere uygun gider kaydı yok.">
          <template #action>
            <button @click="handleClearFilters" class="btn btn-sm btn-outline">Filtreleri Temizle</button>
          </template>
        </EmptyState>

        <!-- Liste -->
        <div v-else class="divide-y divide-slate-100 dark:divide-white/[0.06]/60">
          <div
            v-for="e in paginatedExpenses"
            :key="e.id"
            class="table-row-hover flex items-center gap-3 px-4 py-3"
          >
            <!-- İkon -->
            <div class="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center shrink-0">
              <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
              </svg>
            </div>

            <!-- Bilgi -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-slate-800 dark:text-[#f1f3f9] truncate">{{ e.title || 'Açıklama Yok' }}</p>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs text-slate-400 dark:text-[#626885]">{{ formatDate(e.expenseDate) || 'Tarih yok' }}</span>
                <span class="badge badge-xs badge-info">{{ getExpenseTypeName(e.type) || 'Tip Yok' }}</span>
              </div>
            </div>

            <!-- Tutar -->
            <p class="text-sm font-bold text-red-500 dark:text-red-400 tabular-nums shrink-0">{{ formatCurrency(e.amount) }}</p>

            <!-- İşlem Menüsü -->
            <div class="shrink-0 dropdown dropdown-end">
              <button tabindex="0" class="btn btn-ghost btn-xs btn-square text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/>
                </svg>
              </button>
              <ul tabindex="0" class="dropdown-content menu p-1.5 shadow-card bg-base-100 border border-slate-200 dark:border-white/[0.07] rounded-xl w-32 z-10 text-xs">
                <li><a @click="startEdit(e)" class="rounded-lg">Düzenle</a></li>
                <li><a @click="deleteExpense(e)" class="rounded-lg text-error">Sil</a></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Sayfalama -->
        <div v-if="filteredExpenses.length > 0" class="px-4 py-3 border-t border-slate-100 dark:border-slate-700/60">
          <PaginationBar v-model:currentPage="currentPage" v-model:pageSize="pageSize" :total-count="filteredExpenses.length" />
        </div>
      </div>
    </template>

    <ExpenseModal :visible="showModal" :expense="newExpense" :types="expenseTypeOptions" :editMode="editMode" :loading="modalLoading" :error="modalError" @save="saveExpense" @close="cancelEdit" />
    <ConfirmModal :isOpen="showDeleteModal" title="Gider Silinecek" :message="`'${expenseToDelete?.title || 'Seçili gider'}' silinecek. Bu işlem geri alınamaz.`" confirmLabel="Evet, Sil" confirmClass="btn-error" :loading="deleting" @confirm="handleConfirmDelete" @cancel="closeDeleteModal" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import expensesService from '@/infrastructure/services/expensesService'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import ExpenseModal from './ExpenseModal.vue'
import ConfirmModal from '@/presentation/components/common/ConfirmModal.vue'
import PaginationBar from '@/presentation/components/common/PaginationBar.vue'
import SkeletonRows from '@/presentation/components/common/SkeletonRows.vue'
import CustomFilterBar from '@/presentation/components/common/CustomFilterBar.vue'
import EmptyState from '@/presentation/components/ui/EmptyState.vue'
import { useErrorHandler } from '@/application/composables/useErrorHandler'

/* ✅ Enums’tan merkezi import */
import {
  expenseTypeOptions,
  getExpenseTypeString,
  getExpenseTypeName,
  getExpenseIcon
} from '@/core/constants/enums'

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

const showDeleteModal = ref(false)
const expenseToDelete = ref(null)
const deleting = ref(false)

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

/** Sayfalama Mantığı */
const currentPage = ref(1)
const pageSize = ref(10)

const totalPages = computed(() => Math.ceil(filteredExpenses.value.length / pageSize.value))

const paginatedExpenses = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredExpenses.value.slice(start, end)
})


// Filtreler veya sayfa boyutu değişince ilk sayfaya dön
watch([filters, pageSize], () => {
  currentPage.value = 1
}, { deep: true })
watch(dateFilter, () => {
  currentPage.value = 1
})

/** Yeni kayıt formu */
const today = new Date().toISOString().substr(0, 10)
const newExpense = ref({
  expenseDate: today,
  title: '',
  amount: '',
  type: 'Other',
  description: '',
  receiptNumber: ''
})

/** API çağrıları */
import { useNotify } from '@/application/composables/useNotify'
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
    description: '',
    receiptNumber: ''
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
    description: '',
    receiptNumber: ''
  }
  editMode.value = false
  selectedExpenseId.value = null
  showModal.value = false
  modalError.value = null
  modalLoading.value = false
}
const deleteExpense = (expense) => {
  expenseToDelete.value = expense
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  expenseToDelete.value = null
  showDeleteModal.value = false
  deleting.value = false
}

const handleConfirmDelete = async () => {
  if (!expenseToDelete.value) return
  
  deleting.value = true
  try {
    await expensesService.deleteExpense(expenseToDelete.value.id)
    showSuccess('Gider')
    await fetchExpenses()
    closeDeleteModal()
  } catch (err) {
    console.error('Gider silinirken hata:', err)
    notifyError('Gider silinirken bir hata oluştu')
    deleting.value = false
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
      description: expenseData.description?.trim() || '',
      receiptNumber: expenseData.receiptNumber?.trim() || null
    }

    if (editMode.value && selectedExpenseId.value) {
      data.id = selectedExpenseId.value
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
