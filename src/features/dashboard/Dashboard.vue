<template>
  <div v-if="canViewDashboard && userRole" class="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      
      <!-- Başlık -->
      <h1 class="text-3xl font-bold text-gray-800 mb-6 dark:text-gray-100">Dashboard</h1>

      <!-- Özet Kartları -->
      <section v-if="userRole !== 'viewer'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <router-link to="/transactions" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Kasa Bakiyesi</p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ formatCurrency(balance) }}</p>
            </div>
            <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </router-link>

        <router-link to="/payments" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Toplam Gelir</p>
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ formatCurrency(totalIncome) }}</p>
              <div class="flex items-center gap-4 mt-1">
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ tenantPaymentsCount }} kiracı ödemesi</p>
                <p class="text-xs text-blue-600 dark:text-blue-400">Bu ay: {{ formatCurrency(thisMonthTenantPayments) }}</p>
              </div>
            </div>
            <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
        </router-link>

        <router-link to="/expenses" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Toplam Gider</p>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ formatCurrency(totalExpense) }}</p>
            </div>
            <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </router-link>
      </section>

      <!-- Mal Sahibi Özet Kartları -->
      <section v-if="userRole !== 'viewer' && userRole !== 'tenant'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <router-link to="/owner-dues-list" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Mal Sahibi Aidat Geliri</p>
              <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ formatCurrency(ownerDuesIncome) }}</p>
              <div class="flex items-center gap-4 mt-1">
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ ownerDuesCount }} aidat kaydı</p>
                <p class="text-xs text-purple-600 dark:text-purple-400">Bu ay: {{ formatCurrency(thisMonthOwnerDues) }}</p>
              </div>
            </div>
            <div class="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </router-link>

        <router-link to="/owner-payments" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Mal Sahibi Ödemeleri</p>
              <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ formatCurrency(ownerPaymentsTotal) }}</p>
              <div class="flex items-center gap-4 mt-1">
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ ownerPaymentsCount }} ödeme</p>
                <p class="text-xs text-orange-600 dark:text-orange-400">Bu ay: {{ formatCurrency(thisMonthOwnerPayments) }}</p>
              </div>
            </div>
            <div class="bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </router-link>

        <router-link to="/overdue-owner-payments" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Geciken Mal Sahibi Ödemeleri</p>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ overdueOwnerPaymentsCount }}</p>
              <div class="flex items-center gap-4 mt-1">
                <p class="text-xs text-gray-500 dark:text-gray-400">Toplam tutar</p>
                <p class="text-xs text-red-600 dark:text-red-400">{{ formatCurrency(overdueOwnerPaymentsTotal) }}</p>
              </div>
            </div>
            <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </router-link>
      </section>

      <!-- Geciken Ödemeler -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Geciken Ödemeler</h2>
          <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm font-medium">
            {{ overdueExpenses.length }} adet
          </div>
        </div>
        
        <div v-if="overdueExpenses.length > 0" class="space-y-3">
          <div 
            v-for="expense in overdueExpenses.slice(0, 5)" 
            :key="expense.id"
            class="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
          >
            <div class="flex items-center gap-3">
              <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-800 dark:text-gray-100">{{ expense.company }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ expense.floor }} - {{ expense.typeLabel }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-red-600 dark:text-red-400">{{ formatCurrency(expense.amount) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(expense.dueDate) }}</p>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8">
          <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full p-3 w-fit mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400">Geciken ödeme bulunmuyor.</p>
        </div>

        <!-- Tümünü Gör Butonu -->
        <div v-if="overdueExpenses.length > 0" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <router-link 
            to="/overdue" 
            class="inline-flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
          >
            Tümünü Gör
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </section>

      <!-- Son İşlemler -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Son İşlemler</h2>
          <div class="flex items-center gap-2">
            <select 
              v-model="dashboardType" 
              class="select select-sm select-bordered bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            >
              <option value="">Tümü</option>
              <option value="income">Gelir</option>
              <option value="expense">Gider</option>
            </select>
          </div>
        </div>

        <div v-if="recentActivities.length > 0" class="space-y-3">
          <div 
            v-for="activity in recentActivities" 
            :key="activity.id"
            class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
          >
            <div class="flex items-center gap-3">
              <div 
                :class="{
                  'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400': activity.type === 'income',
                  'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400': activity.type === 'expense'
                }"
                class="rounded-full p-2"
              >
                <svg v-if="activity.type === 'income'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-800 dark:text-gray-100">
                  {{ activity.payer || activity.description || 'İşlem' }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(activity.date) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p 
                :class="{
                  'text-green-600 dark:text-green-400': activity.type === 'income',
                  'text-red-600 dark:text-red-400': activity.type === 'expense'
                }"
                class="font-semibold"
              >
                {{ activity.type === 'income' ? '+' : '-' }}{{ formatCurrency(activity.amount) }}
              </p>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <div class="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full p-3 w-fit mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400">Henüz işlem bulunmuyor.</p>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <router-link 
            to="/transactions" 
            class="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Tümünü Gör
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </section>

    </div>
  </div>

  <div v-else class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-4 w-fit mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <p class="text-gray-500 dark:text-gray-400 text-lg">Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '../../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth'

const payments = ref([])
const expenses = ref([])
const tenants = ref([])
const aidats = ref([])
const readings = ref([])
const ownerAidats = ref([])
const ownerPayments = ref([])
const owners = ref([])
const authStore = useAuthStore()
const userRole = computed(() => authStore.role)
const dashboardType = ref('')

const canViewDashboard = computed(() => {
  if (!userRole.value) return false
  return ['admin', 'manager', 'viewer', 'tenant'].includes(userRole.value)
})

const fetchAidats = async () => {
  const snapshot = await getDocs(collection(db, 'aidatRecords'))
  aidats.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'aidat' }))
}

const fetchReadings = async () => {
  const snapshot = await getDocs(collection(db, 'readings'))
  readings.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

const allExpenses = computed(() => {
  return [
    ...expenses.value,
    ...aidats.value,
    ...readings.value
  ]
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('tr-TR', options)
}

const overdueExpenses = computed(() => {
  const now = new Date()
  return allExpenses.value
    .filter(e => {
      const isOverdue = e.dueDate && new Date(e.dueDate) < now
      const isOwnTenant = userRole.value === 'tenant'
        ? e.tenantId === authStore.companyId
        : true
      return isOverdue && isOwnTenant
    })
    .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
    .map(e => {
      const tenant = tenants.value.find(t => t.id === e.tenantId)
      return {
        ...e,
        company: tenant?.company || 'Bilinmiyor',
        floor:
          tenant?.floor ||
          tenant?.unit ||
          (Array.isArray(tenant?.units) ? tenant.units.join(', ') : 'Bilinmiyor'),
        amount: e.amount ?? e.toplamTutar ?? e.kdvDahil ?? 0,
        typeLabel:
          e.type === 'aidat'
            ? 'Aidat'
            : e.type === 'water'
            ? 'Su'
            : e.type === 'electricity'
            ? 'Elektrik'
            : 'Gider',
      }
    })
})

const fetchTenants = async () => {
  const snapshot = await getDocs(collection(db, 'tenants'))
  tenants.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

const totalIncome = computed(() => {
  // Şu anda sadece kiracı ödemeleri var, ama gelecekte başka gelir kaynakları eklenebilir
  const tenantPayments = payments.value.reduce((sum, p) => sum + Number(p.amount || 0), 0)
  const otherIncome = 0 // Gelecekte eklenebilecek diğer gelir kaynakları
  return tenantPayments + otherIncome
})

const totalExpense = computed(() => {
  return expenses.value.reduce((sum, e) => sum + Number(e.amount || 0), 0)
})

const tenantPaymentsCount = computed(() => {
  return payments.value.length
})

const thisMonthTenantPayments = computed(() => {
  const today = new Date()
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0')
  
  return payments.value
    .filter(p => p.date && p.date.startsWith(currentMonth))
    .reduce((sum, p) => sum + Number(p.amount || 0), 0)
})

const balance = computed(() => totalIncome.value - totalExpense.value)

const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '₺0.00'
  return Number(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

const filteredExpenses = computed(() => {
  if (authStore.role === 'tenant') {
    return expenses.value.filter(e => e.tenantId === authStore.companyId)
  }
  return expenses.value
})

const recentActivities = computed(() => {
  const items = [
    ...payments.value.map(p => ({ ...p, type: 'income' })),
    ...expenses.value.map(e => ({ ...e, type: 'expense' }))
  ]

  const filteredByTenant = userRole.value === 'tenant'
    ? items.filter(item => item.tenantId === authStore.companyId)
    : items

  let filtered = filteredByTenant
  if (dashboardType.value) {
    filtered = filtered.filter(item => item.type === dashboardType.value)
  }

  return filtered
    .filter(item => item.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
})

const fetchDashboardData = async () => {
  const paymentSnapshot = await getDocs(collection(db, 'payments'))
  payments.value = paymentSnapshot.docs.map(doc => {
    const data = doc.data()
    const tenant = tenants.value.find(t => t.id === data.tenantId)
    return {
      ...data,
      payer: tenant?.company || 'Bilinmiyor'
    }
  })

  const expenseSnapshot = await getDocs(collection(db, 'expenses'))
  expenses.value = expenseSnapshot.docs.map(doc => {
    const data = doc.data()
    return {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      tenantId: data.tenantId,
      type: data.type,
      period: data.period,
    }
  })
}

const fetchOwnerAidats = async () => {
  const snapshot = await getDocs(collection(db, 'ownerAidatRecords'))
  ownerAidats.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'ownerAidat' }))
}

const fetchOwnerPayments = async () => {
  const snapshot = await getDocs(collection(db, 'ownerPayments'))
  ownerPayments.value = snapshot.docs.map(doc => {
    const data = doc.data()
    const owner = owners.value.find(o => o.id === data.ownerId)
    return {
      ...data,
      ownerName: owner?.name || 'Bilinmiyor'
    }
  })
}

const fetchOwners = async () => {
  const snapshot = await getDocs(collection(db, 'owners'))
  owners.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

const ownerDuesIncome = computed(() => {
  return ownerAidats.value.reduce((sum, aidat) => sum + Number(aidat.amount || 0), 0)
})

const ownerDuesCount = computed(() => {
  return ownerAidats.value.length
})

const thisMonthOwnerDues = computed(() => {
  const today = new Date()
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0')
  
  return ownerAidats.value
    .filter(aidat => aidat.date && aidat.date.startsWith(currentMonth))
    .reduce((sum, aidat) => sum + Number(aidat.amount || 0), 0)
})

const ownerPaymentsTotal = computed(() => {
  return ownerPayments.value.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
})

const ownerPaymentsCount = computed(() => {
  return ownerPayments.value.length
})

const thisMonthOwnerPayments = computed(() => {
  const today = new Date()
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0')
  
  return ownerPayments.value
    .filter(payment => payment.date && payment.date.startsWith(currentMonth))
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
})

const overdueOwnerPayments = computed(() => {
  const now = new Date()
  return ownerAidats.value.filter(aidat => {
    const isOverdue = aidat.dueDate && new Date(aidat.dueDate) < now
    const isPaid = aidat.isPaid === true
    return isOverdue && !isPaid
  })
})

const overdueOwnerPaymentsCount = computed(() => {
  return overdueOwnerPayments.value.length
})

const overdueOwnerPaymentsTotal = computed(() => {
  return overdueOwnerPayments.value.reduce((sum, aidat) => sum + Number(aidat.amount || 0), 0)
})

onMounted(async () => {
  await fetchTenants()
  await Promise.all([
    fetchDashboardData(),
    fetchAidats(),
    fetchReadings(),
    fetchOwnerAidats(),
    fetchOwnerPayments(),
    fetchOwners()
  ])
})
</script>
