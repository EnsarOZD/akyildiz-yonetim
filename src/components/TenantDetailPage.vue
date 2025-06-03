<template>
  <div class="min-h-screen bg-base-200 dark:bg-gray-900 py-10">
    <div class="max-w-4xl mx-auto bg-base-100 dark:bg-gray-800 shadow-lg rounded-xl p-6 space-y-8 text-white dark:text-gray-100">
      <h1 class="text-2xl font-bold text-center">{{ tenant?.company }} – Kiracı Detayları</h1>

      <div v-if="tenant">
        <!-- Bilgi Kartları -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="card bg-base-100 dark:bg-gray-700 border border-base-300 p-4 space-y-2 shadow-md">
            <p><strong>👤 Ad Soyad:</strong> {{ tenant.firstName }} {{ tenant.lastName }}</p>
            <p><strong>📞 Telefon:</strong> {{ tenant.phone }}</p>
            <p><strong>✉️ E-posta:</strong> {{ tenant.email }}</p>
            <p>
              <strong>🏢 Kat:</strong>
              {{ Array.isArray(tenant.units) ? tenant.units.join(', ') : tenant.unit }}
            </p>
          </div>

          <div class="card bg-base-100 dark:bg-gray-700 border border-base-300 p-4 space-y-2 shadow-md">
            <p><strong class="text-green-500">💰 Toplam Ödeme:</strong> {{ totalPaid.toLocaleString('tr-TR') }} ₺</p>
            <p><strong class="text-red-500">📉 Toplam Borç:</strong> {{ totalDebt.toLocaleString('tr-TR') }} ₺</p>
            <p><strong class="text-blue-400">🧾 Bakiye:</strong> {{ balance.toLocaleString('tr-TR') }} ₺</p>
          </div>
        </div>

        <!-- Ödeme Geçmişi -->
        <div>
          <h3 class="text-lg font-semibold mt-6 mb-2">🕑 Ödeme Geçmişi</h3>
          <div v-if="payments.length" class="overflow-x-auto">
            <table class="table table-sm w-full border">
              <thead>
                <tr>
                  <th>Dönem</th>
                  <th>Tutar (₺)</th>
                  <th>Tip</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, index) in sortedPayments" :key="index">
                  <td>{{ p.date }}</td>
                  <td>{{ p.amount.toLocaleString('tr-TR') }}</td>
                  <td>{{ p.type }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="text-gray-400 italic">Ödeme bulunmuyor.</p>
        </div>

        <!-- Gider Geçmişi -->
        <div>
          <h3 class="text-lg font-semibold mt-6 mb-2">💸 Gider Geçmişi</h3>
          <div v-if="allExpenses.length" class="overflow-x-auto">
            <table class="table table-sm w-full border">
              <thead>
                <tr>
                  <th>Dönem</th>
                  <th>Tutar (₺)</th>
                  <th>Tip</th>
                  <th>Son Ödeme</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, index) in allExpenses" :key="index">
                  <td>{{ r.period || '-' }}</td>
                  <td>{{ r.toplamTutar != null ? Number(r.toplamTutar).toLocaleString('tr-TR') : '-' }}</td>
                  <td>
                    <span :class="{
                      'text-yellow-400': r.type === 'electricity',
                      'text-blue-400': r.type === 'water',
                      'text-green-400': r.type === 'aidat'
                    }">
                      {{ r.type === 'electricity' ? 'Elektrik' : r.type === 'water' ? 'Su' : 'Aidat' }}
                    </span>
                  </td>
                  <td>{{ r.dueDate || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="text-gray-400 italic">Gider verisi bulunmuyor.</p>
        </div>
      </div>

      <div v-else class="text-center text-gray-400">Kiracı bilgisi yükleniyor...</div>
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
const readings = ref([])
const aidats = ref([])
const allExpenses = ref([])

const totalPaid = ref(0)
const totalDebt = ref(0)

const balance = computed(() => totalDebt.value - totalPaid.value)

const sortedPayments = computed(() =>
  [...payments.value].sort((a, b) => new Date(a.date) - new Date(b.date))
)

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

const fetchReadings = async () => {
  const q = query(collection(db, 'readings'), where('tenantId', '==', tenantId))
  const snapshot = await getDocs(q)
  readings.value = snapshot.docs.map(doc => doc.data())
}

const fetchAidats = async () => {
  const q = query(collection(db, 'aidatRecords'), where('tenantId', '==', tenantId))
  const snapshot = await getDocs(q)
  aidats.value = snapshot.docs.map(doc => doc.data())
}

const computeAllExpenses = () => {
  allExpenses.value = [...readings.value, ...aidats.value].sort((a, b) =>
    (a.period || '').localeCompare(b.period || '')
  )
  totalDebt.value = allExpenses.value.reduce((sum, r) => sum + (Number(r.toplamTutar) || 0), 0)
}

onMounted(async () => {
  await fetchTenantData()
  await fetchPayments()
  await fetchReadings()
  await fetchAidats()
  computeAllExpenses()
})
</script>
