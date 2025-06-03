<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-base-200 dark:bg-gray-800 dark:text-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl p-6 space-y-6 relative">

      <button @click="$emit('close')" class="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost">✕</button>

      <h2 class="text-2xl font-bold text-center">{{ tenant.company }} – Özet Bilgiler</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="card bg-base-100 dark:bg-gray-700 shadow-md border border-base-200 p-4 space-y-2">
          <p><span class="font-semibold">👤 Ad Soyad:</span> {{ tenant.firstName }} {{ tenant.lastName }}</p>
          <p><span class="font-semibold">📞 Telefon:</span> {{ tenant.phone }}</p>
          <p><span class="font-semibold">✉️ E-posta:</span> {{ tenant.email }}</p>
          <p>
            <span class="font-semibold">🏢 Kat:</span>
            <span>
              {{ Array.isArray(tenant.units) ? tenant.units.join(', ') : tenant.unit }}
            </span>
          </p>
        </div>

        <div class="card bg-base-100 dark:bg-gray-700 shadow-md border border-base-200 p-4 space-y-2">
          <p><span class="font-semibold text-green-600 dark:text-green-400">💰 Toplam Ödeme:</span> {{ totalPaid.toLocaleString() }} ₺</p>
          <p><span class="font-semibold text-red-600 dark:text-red-400">📉 Toplam Borç:</span> {{ totalDebt.toLocaleString() }} ₺</p>
          <p><span class="font-semibold text-blue-600 dark:text-blue-400">🧾 Kalan Bakiye:</span> {{ balance.toLocaleString() }} ₺</p>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-semibold mb-2">🕑 Son 5 Ödeme</h3>
        <div v-if="lastPayments.length" class="overflow-x-auto">
          <table class="table table-sm w-full border">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Tutar (₺)</th>
                <th>Tip</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, index) in lastPayments" :key="index">
                <td>{{ p.date }}</td>
                <td>{{ p.amount.toLocaleString() }}</td>
                <td>{{ p.type }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-gray-500 dark:text-gray-400 italic">Henüz ödeme bulunmuyor.</p>
      </div>

      <div class="flex justify-end gap-3">
        <RouterLink :to="`/tenant/${tenant.id}`" class="btn btn-info btn-sm">Detay Sayfa</RouterLink>
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
const readings = ref([])

const totalPaid = ref(0)
const totalDebt = ref(0)
const totalReadingDebt = ref(0)

const lastPayments = ref([])

const fetchPaymentsAndExpenses = async () => {
  if (!props.tenant?.id) return

  // Ödemeler
  const paymentsQuery = query(collection(db, 'payments'), where('tenantId', '==', props.tenant.id))
  const paymentsSnapshot = await getDocs(paymentsQuery)
  payments.value = paymentsSnapshot.docs.map(doc => doc.data())

  totalPaid.value = payments.value.reduce((sum, p) => sum + (p.amount || 0), 0)
  lastPayments.value = payments.value
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  // Giderler
  const expensesQuery = query(collection(db, 'expenses'), where('tenantId', '==', props.tenant.id))
  const expensesSnapshot = await getDocs(expensesQuery)
  expenses.value = expensesSnapshot.docs.map(doc => doc.data())

  // Sayaçlar
  const readingsQuery = query(collection(db, 'readings'), where('tenantId', '==', props.tenant.id))
  const readingsSnapshot = await getDocs(readingsQuery)
  readings.value = readingsSnapshot.docs.map(doc => doc.data())

  totalReadingDebt.value = readings.value.reduce((sum, r) => sum + (r.toplamTutar || 0), 0)

  // Toplam borç = gider + sayaç
  totalDebt.value = expenses.value.reduce((sum, e) => sum + (e.amount || 0), 0) + totalReadingDebt.value
}

const balance = computed(() => totalDebt.value - totalPaid.value)

watch(() => props.tenant?.id, fetchPaymentsAndExpenses, { immediate: true })
</script>
