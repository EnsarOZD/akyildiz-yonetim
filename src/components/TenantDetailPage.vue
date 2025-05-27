<template>
  <div class="min-h-screen bg-base-200">
    <div class="max-w-4xl mx-auto bg-base-100 shadow-lg rounded-xl p-6 space-y-6">
      <h1 class="text-xl font-bold text-center">{{ tenant?.company }} - Kiracı Detayları</h1>

      <div v-if="tenant">
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
            <p><strong>Bakiye:</strong> {{ balance }} ₺</p>
          </div>
        </div>

        <div>
          <h3 class="font-semibold mt-6 mb-2">Ödeme Geçmişi</h3>
          <ul class="list-disc list-inside space-y-1">
            <li v-for="(p, index) in payments" :key="index">
              {{ p.date }} - {{ p.amount }} ₺ ({{ p.type }})
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold mt-6 mb-2">Gider Geçmişi</h3>
          <ul class="list-disc list-inside space-y-1">
            <li v-for="(e, index) in expenses" :key="index">
              {{ e.date }} - {{ e.amount }} ₺ ({{ e.type }}: {{ e.description }})
            </li>
          </ul>
        </div>

      </div>
      <div v-else class="text-center text-gray-500">Kiracı bilgisi yükleniyor...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '../firebase'
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'

const route = useRoute()
const tenantId = route.params.id
const tenant = ref(null)
const payments = ref([])
const expenses = ref([])

const totalPaid = ref(0)
const totalDebt = ref(0)

const balance = computed(() => totalDebt.value - totalPaid.value)

const fetchTenantData = async () => {
  const docRef = doc(db, 'tenants', tenantId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    tenant.value = docSnap.data()
  }
}

const fetchPayments = async () => {
  const q = query(collection(db, 'payments'), where('tenantId', '==', tenantId))
  const snapshot = await getDocs(q)
  payments.value = snapshot.docs.map(doc => doc.data())
  totalPaid.value = payments.value.reduce((sum, p) => sum + (p.amount || 0), 0)
}

const fetchExpenses = async () => {
  const q = query(collection(db, 'expenses'), where('tenantId', '==', tenantId))
  const snapshot = await getDocs(q)
  expenses.value = snapshot.docs.map(doc => doc.data())
  totalDebt.value = expenses.value.reduce((sum, e) => sum + (e.amount || 0), 0)
}

onMounted(() => {
  fetchTenantData()
  fetchPayments()
  fetchExpenses()
})
</script>
