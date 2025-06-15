<template>
  <section class="p-6 max-w-6xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold">Tüm İşlemler</h1>

    <!-- Filtre Alanları -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <select v-model="filterType" class="select select-bordered w-full">
        <option value="">Tüm Tipler</option>
        <option value="income">Gelir</option>
        <option value="expense">Gider</option>
      </select>

      <input type="date" v-model="filterStart" class="input input-bordered w-full" />
      <input type="date" v-model="filterEnd" class="input input-bordered w-full" />
      <input type="text" v-model="searchTerm" placeholder="Açıklama ara..." class="input input-bordered w-full" />
    </div>

    <!-- İşlem Tablosu -->
    <div class="overflow-x-auto border rounded-lg mt-4">
      <table class="table table-zebra w-full text-sm">
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Ödeyen</th>
            <th>Açıklama</th>
            <th>Banka</th>
            <th>Tip</th>
            <th>Tutar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredTransactions" :key="index">
            <td>{{ formatDate(item.date) }}</td>
            <td class="whitespace-normal break-words text-sm">
              <span v-if="item.type === 'income'">{{ item.payer }}</span>
              <span v-else>-</span>
            </td>
            <td>{{ item.description }}</td>
            <td>{{ item.bank || '-' }}</td>
            <td>
              <span :class="item.type === 'income' ? 'text-green-600' : 'text-red-600'">
                {{ item.type === 'income' ? 'Gelir' : 'Gider' }}
              </span>
            </td>
            <td class="font-medium">
              <span v-if="item.type === 'income'" class="text-green-600">+{{ formatCurrency(item.amount) }}</span>
              <span v-else class="text-red-600">-{{ formatCurrency(item.amount) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
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
  if (value === undefined || value === null || isNaN(value)) return '-'
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
