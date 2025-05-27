<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 space-y-4 relative">
      <button @click="$emit('close')" class="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost">✕</button>
      <h2 class="text-xl font-semibold text-center">{{ tenant.company }} – Özet Bilgiler</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="card bg-base-100 p-4 border border-base-300">
          <p><strong>Ad Soyad:</strong> {{ tenant.firstName }} {{ tenant.lastName }}</p>
          <p><strong>Telefon:</strong> {{ tenant.phone }}</p>
          <p><strong>E-posta:</strong> {{ tenant.email }}</p>
          <p><strong>Daire:</strong> {{ tenant.unit }}</p>
        </div>

        <div class="card bg-base-100 p-4 border border-base-300">
          <p><strong>Toplam Ödeme:</strong> {{ totalPaid }} ₺</p>
          <p><strong>Toplam Borç:</strong> {{ totalDebt }} ₺</p>
          <p><strong>Kalan Bakiye:</strong> {{ balance }} ₺</p>
        </div>
      </div>

      <div>
        <h3 class="font-semibold mb-2">Son 5 Ödeme</h3>
        <ul class="list-disc list-inside space-y-1">
          <li v-for="(p, index) in lastPayments" :key="index">
            {{ p.date }} - {{ p.amount }} ₺ ({{ p.type }})
          </li>
        </ul>
      </div>

      <div class="flex justify-end gap-2">
        <RouterLink :to="`/tenant/${tenant.id}`" class="btn btn-outline btn-info btn-sm">Detay Sayfa</RouterLink>
        <button @click="$emit('close')" class="btn btn-outline btn-secondary btn-sm">Kapat</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'

const props = defineProps({
  tenant: Object
})

const payments = ref([])
const expenses = ref([])

const totalPaid = ref(0)
const totalDebt = ref(0)

const lastPayments = ref([])

const fetchPaymentsAndExpenses = async () => {
  if (!props.tenant?.id) return

  // Ödemeleri çek
  const paymentsQuery = query(collection(db, 'payments'), where('tenantId', '==', props.tenant.id))
  const paymentsSnapshot = await getDocs(paymentsQuery)
  payments.value = paymentsSnapshot.docs.map(doc => doc.data())

  totalPaid.value = payments.value.reduce((sum, p) => sum + (p.amount || 0), 0)
  lastPayments.value = payments.value
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  // Giderleri çek
  const expensesQuery = query(collection(db, 'expenses'), where('tenantId', '==', props.tenant.id))
  const expensesSnapshot = await getDocs(expensesQuery)
  expenses.value = expensesSnapshot.docs.map(doc => doc.data())

  totalDebt.value = expenses.value.reduce((sum, e) => sum + (e.amount || 0), 0)
}

const balance = computed(() => totalDebt.value - totalPaid.value)

watch(() => props.tenant?.id, fetchPaymentsAndExpenses, { immediate: true })
</script>