<template>
  <div class="p-4 sm:p-6 min-h-screen dark:bg-base-200">
    <div class="max-w-7xl mx-auto">
      
      <!-- Başlık -->
      <PageHeader title="Tüm İşlemler" subtitle="Gelir, gider ve borç kayıtlarının tamamını görün">
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </template>
        <template #actions>
          <div class="flex flex-wrap items-center gap-2">
            <div class="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-200 dark:border-emerald-800/50">
              Gelir: {{ formatCurrency(totalIncome) }}
            </div>
            <div class="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200 dark:border-red-800/50">
              Gider: {{ formatCurrency(totalExpense) }}
            </div>
            <div class="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-200 dark:border-amber-800/50">
              Borç: {{ formatCurrency(totalDebt) }}
            </div>
          </div>
        </template>
      </PageHeader>

      <!-- Filtreler -->
      <section class="bg-white dark:bg-[#0f1322] p-6 rounded-xl shadow-md border border-gray-200 dark:border-white/[0.07] mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-[#f1f3f9] mb-4">Filtreler</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-700 dark:text-[#f1f3f9]">İşlem Tipi</span>
            </label>
            <select v-model="filterType" class="select select-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-700 dark:text-[#f1f3f9]">
              <option value="">Tüm Tipler</option>
              <option value="income">Gelir</option>
              <option value="expense">Gider</option>
              <option value="debt">Borç</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-700 dark:text-[#f1f3f9]">Başlangıç Tarihi</span>
            </label>
            <input type="date" v-model="filterStart" class="input input-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-700 dark:text-[#f1f3f9]" />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-700 dark:text-[#f1f3f9]">Bitiş Tarihi</span>
            </label>
            <input type="date" v-model="filterEnd" class="input input-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-700 dark:text-[#f1f3f9]" />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-700 dark:text-[#f1f3f9]">Arama</span>
            </label>
            <input type="text" v-model="searchTerm" placeholder="Açıklama ara..." class="input input-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-700 dark:text-[#f1f3f9]" />
          </div>
        </div>
      </section>

      <!-- İşlem Listesi -->
      <section class="bg-white dark:bg-[#0f1322] p-6 rounded-xl shadow-md border border-gray-200 dark:border-white/[0.07]">
        <PageHeader title="İşlem Geçmişi" subtitle="Tüm finansal hareketlerin listesi">
          <template #actions>
            <div class="bg-brand-100 dark:bg-blue-900/50 text-brand-600 dark:text-brand-400 px-3 py-1 rounded-full text-sm font-medium">
              {{ filteredTransactions.length }} işlem
            </div>
          </template>
        </PageHeader>

        <div v-if="filteredTransactions.length > 0" class="space-y-3">
          <div 
            v-for="(item, index) in filteredTransactions" 
            :key="index"
            class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-white/[0.07] hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
          >
            <div class="flex items-center gap-4">
              <div 
                :class="{
                  'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400': item.type === 'income',
                  'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400': item.type === 'expense',
                  'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400': item.type === 'debt'
                }"
                class="rounded-full p-3"
              >
                <svg v-if="item.type === 'income'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <svg v-else-if="item.type === 'expense'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-800 dark:text-[#f1f3f9]">
                  {{ item.type === 'debt' ? (item.company || 'Borç') : (item.payer || item.description || 'İşlem') }}
                  <span v-if="item.type === 'debt'" class="text-xs font-normal text-gray-400 ml-1">
                    ({{ item.typeLabel }})
                  </span>
                </p>
                <p class="text-sm text-gray-500 dark:text-[#9aa0b4]">{{ formatDate(item.date) }}</p>
                <p v-if="item.bank" class="text-xs text-gray-400 dark:text-[#626885]">{{ item.bank }}</p>
                <p v-if="item.unit && item.unit !== '-'" class="text-xs text-gray-400 dark:text-[#626885]">{{ item.unit }}</p>
              </div>
            </div>
            <div class="text-right">
              <p 
                :class="{
                  'text-green-600 dark:text-green-400': item.type === 'income',
                  'text-red-600 dark:text-red-400': item.type === 'expense',
                  'text-orange-600 dark:text-orange-400': item.type === 'debt'
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
                {{ item.type === 'income' ? 'Gelir' : (item.type === 'expense' ? 'Gider' : 'Borç') }}
              </p>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <div class="bg-gray-100 dark:bg-[#1c2238] text-gray-500 dark:text-[#9aa0b4] rounded-full p-4 w-fit mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-[#f1f3f9] mb-2">İşlem Bulunamadı</h3>
          <p class="text-gray-500 dark:text-[#9aa0b4]">Seçilen kriterlere uygun işlem bulunmuyor.</p>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import { usePaymentsStore } from '@/application/stores/payments'
import { useUtilityDebtsStore } from '@/application/stores/utilityDebts'
import { useExpensesStore } from '@/application/stores/expenses'
import { useTenantsStore } from '@/application/stores/tenants'

const paymentsStore = usePaymentsStore()
const utilityDebtsStore = useUtilityDebtsStore()
const expensesStore = useExpensesStore()
const tenantsStore = useTenantsStore()

const tenants = ref([])
const payments = ref([])
const expenses = ref([])
const debts = ref([])

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
  try {
    const list = await tenantsStore.fetchIfNeeded()
    tenants.value = list || []
  } catch (error) {
    console.error('Kiracılar yüklenirken hata:', error)
    tenants.value = []
  }
}

const fetchData = async () => {
  try {
    const [paymentsResponse, expensesResponse, debtsResponse] = await Promise.all([
      paymentsStore.fetchIfNeeded({ pageSize: 50 }),
      expensesStore.fetchIfNeeded({ pageSize: 50 }),
      utilityDebtsStore.fetchIfNeeded({ pageSize: 50 })
    ])

    payments.value = (paymentsResponse || []).map(payment => {
      // Backend artık isim ve daire bilgisini (TenantName/OwnerName/FlatInfo) kendisi getiriyor
      return {
        ...payment,
        type: 'income',
        payer: payment.tenantName || payment.ownerName || 'Bilinmiyor',
        unit: payment.flatInfo || '-'
      }
    })

    expenses.value = (expensesResponse || []).map(expense => ({
      ...expense,
      type: 'expense'
    }))

    debts.value = (debtsResponse || []).map(debt => {
        const tenant = tenants.value.find(t => t.id === debt.tenantId)
        return {
            ...debt,
            type: 'debt',
            date: debt.dueDate || debt.createdAt, // Borcun tarihi olarak vade tarihi veya oluşturulma tarihi
            description: debt.description || 'Borç Tahakkuku',
            company: debt.tenantName || tenant?.companyName || tenant?.company || tenant?.fullName || debt.description || 'Bilinmiyor',
            typeLabel: debt.type === 0 || debt.type === 'Aidat' ? 'Aidat' : (debt.type === 1 || debt.type === 'Electricity' ? 'Elektrik' : 'Su')
        }
    })
  } catch (error) {
    console.error('Veriler yüklenirken hata:', error)
    payments.value = []
    expenses.value = []
    debts.value = []
  }
}

const allTransactions = computed(() => {
  return [...payments.value, ...expenses.value, ...debts.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

const totalIncome = computed(() => {
  return payments.value.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
})

const totalExpense = computed(() => {
  return expenses.value.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
})

const totalDebt = computed(() => {
  return debts.value.reduce((sum, debt) => sum + Number(debt.remainingAmount || 0), 0)
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
