<template>
  <section class="min-h-screen bg-base-200 p-6">
    <div class="max-w-6xl mx-auto space-y-8">

      <!-- Özet Kartları -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card bg-base-100 shadow-md">
          <div class="card-body text-center">
            <h3 class="text-center text-sm text-base-content/70 font-medium uppercase tracking-wide">Kasa Bakiyesi</h3>
            <p class="text-3xl font-bold text-green-600">{{ formatCurrency(balance) }}</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-md">
          <div class="card-body text-center">
            <h3 class="text-center text-sm text-base-content/70 font-medium uppercase tracking-wide">Toplam Gelir</h3>
            <p class="text-3xl font-bold text-blue-600">{{ formatCurrency(totalIncome) }}</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-md">
          <div class="card-body text-center">
            <h3 class="text-center text-sm text-base-content/70 font-medium uppercase tracking-wide">Toplam Gider</h3>
            <p class="text-3xl font-bold text-red-600">{{ formatCurrency(totalExpense) }}</p>
          </div>
        </div>
      </div>
      <!-- Geciken Ödemeler -->
<div class="card bg-base-100 shadow-md border border-base-300">
  <div class="card-body">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg font-semibold text-red-500">⏰ Geciken Ödemeler</h2>
      <router-link to="/transactions" class="btn btn-sm btn-outline btn-warning">Tümünü Gör</router-link>
    </div>

    <div class="overflow-x-auto">
      <table class="table table-sm w-full text-sm">
        <thead>
          <tr>
            <th>Firma</th>
            <th>Tip</th>
            <th>Dönem</th>
            <th>Son Ödeme</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in overdueExpenses.slice(0, 5)" :key="i">
            <td class="whitespace-normal">{{ item.company }}</td>
            <td>{{ item.typeLabel }}</td>
            <td>{{ item.period || '-' }}</td>
            <td>{{ new Date(item.dueDate).toLocaleDateString('tr-TR') }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="!overdueExpenses.length" class="text-gray-400 italic text-sm mt-2">Geciken ödeme bulunmuyor.</p>
    </div>
  </div>
</div>

      <!-- Son İşlemler -->
<div class="card bg-base-100 shadow-md border border-base-300">
  <div class="card-body">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg font-semibold text-base-content">🔄 Son İşlemler</h2>

      <!-- Tür filtresi -->
      <div class="flex gap-2">
        <button @click="filterTransactionType = ''" :class="filterTransactionType === '' ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-outline'">
          Tümü
        </button>
        <button @click="filterTransactionType = 'income'" :class="filterTransactionType === 'income' ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-outline'">
          Gelir
        </button>
        <button @click="filterTransactionType = 'expense'" :class="filterTransactionType === 'expense' ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-outline'">
          Gider
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="table table-sm w-full text-sm">
        <thead>
          <tr>
            <th class="text-center">Tarih</th>
            <th class="text-center">Açıklama</th>
            <th class="text-center">Ödeyen</th>
            <th class="text-center">Tutar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in recentActivities" :key="index">
            <td class="text-center">{{ formatDate(item.date) }}</td>
            <td class="text-center">{{ item.description || '-' }}</td>
            <td class="text-center whitespace-normal break-words text-sm">
              <span v-if="item.type === 'income'">{{ item.payer }}</span>
              <span v-else>-</span>
            </td>
            <td class="text-center font-medium">
              <span v-if="item.type === 'income'" class="inline-flex items-center gap-1 text-green-600">
                💰 {{ formatCurrency(item.amount) }}
              </span>
              <span v-else class="inline-flex items-center gap-1 text-red-600">
                📤 -{{ formatCurrency(item.amount) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!recentActivities.length" class="text-gray-400 italic text-sm mt-2">Son işlem kaydı bulunamadı.</p>

      <div class="text-right mt-4">
        <router-link to="/transactions" class="text-sm text-blue-600 hover:underline">
          Tümünü Gör →
        </router-link>
      </div>
    </div>
  </div>
</div>


    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

const payments = ref([])
const expenses = ref([])
const filterTransactionType = ref('')
const tenants = ref([])

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('tr-TR', options)
}

const overdueExpenses = computed(() => {
  const now = new Date()
  return expenses.value
    .filter(e => e.dueDate && new Date(e.dueDate) < now)
    .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
    .map(e => {
      const tenant = tenants.value.find(t => t.id === e.tenantId)
      return {
        ...e,
        company: tenant?.company || 'Bilinmiyor',
        typeLabel: e.type === 'aidat' ? 'Aidat' : e.type === 'water' ? 'Su' : 'Elektrik',
      }
    })
})

const fetchTenants = async () => {
  const snapshot = await getDocs(collection(db, 'tenants'))
  tenants.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

const totalIncome = computed(() => {
  return payments.value.reduce((sum, p) => sum + Number(p.amount || 0), 0)
})

const totalExpense = computed(() => {
  return expenses.value.reduce((sum, e) => sum + Number(e.amount || 0), 0)
})

const balance = computed(() => totalIncome.value - totalExpense.value)

const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '-'
  return Number(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

const recentActivities = computed(() => {
  const items = [
    ...payments.value.map(p => ({ ...p, type: 'income' })),
    ...expenses.value.map(e => ({ ...e, type: 'expense' }))
  ]

  const filtered = filterTransactionType.value
    ? items.filter(item => item.type === filterTransactionType.value)
    : items

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

onMounted(() => {
  fetchTenants().then(() => fetchDashboardData())
})
</script>
