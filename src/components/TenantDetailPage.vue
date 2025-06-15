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
            <p><strong>💰 Ödeme:</strong> {{ filteredTotalPaid.toLocaleString('tr-TR') }} ₺</p>
            <p><strong>📉 Borç:</strong> {{ filteredTotalDebt.toLocaleString('tr-TR') }} ₺</p>
            <p><strong>🧾 Bakiye:</strong> {{ filteredBalance.toLocaleString('tr-TR') }} ₺</p>
            <p><strong>🕒 Son Ödeme:</strong> {{ lastPaymentDate }}</p>
          </div>
        </div>

        <!-- Yıl Seçici -->
        <div class="mb-4 flex justify-between items-center">
          <h2 class="text-lg font-bold">🗓️ Dönem Filtresi</h2>
          <select v-model="selectedYear" class="select select-bordered w-40">
            <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>

        

        <!-- Ödeme Geçmişi -->
        <div>
          <h3 class="text-lg font-semibold mt-6 mb-2">🕒 Ödeme Geçmişi</h3>

          <div v-if="filteredPayments.length" class="overflow-x-auto">
            <table class="table table-sm w-full border">
              <thead>
                <tr>
                  <th>Dönem</th>
                  <th>Tutar (₺)</th>
                  <th>Tip</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, index) in filteredPayments" :key="index">
                  <td>{{ new Date(p.date).toLocaleDateString('tr-TR') }}</td>
                  <td>{{ p.amount.toLocaleString('tr-TR') }}</td>
                  <td>{{ p.type }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="font-semibold bg-base-200">
                  <td>Toplam</td>
                  <td>{{ filteredTotalPaid.toLocaleString('tr-TR') }} ₺</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p v-else class="text-gray-400 italic">Seçilen yıl için ödeme kaydı bulunamadı.</p>
        </div>

        <!-- Gider Geçmişi -->
        <div>
          <h3 class="text-lg font-semibold mt-6 mb-2">💸 Gider Geçmişi</h3>
          <div v-if="filteredExpenses.length" class="overflow-x-auto">
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
                <tr v-for="(r, index) in filteredExpenses" :key="index">
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
                    <span v-if="r.description?.toLowerCase().includes('ortak')" class="ml-2 badge badge-warning text-xs">
                      Ortak
                    </span>
                  </td>
                  <td>{{ r.dueDate || '-' }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="font-semibold bg-base-200">
                  <td>Toplam</td>
                  <td>{{ filteredTotalDebt.toLocaleString('tr-TR') }} ₺</td>
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p v-else class="text-gray-400 italic">Seçilen yıl için gider kaydı bulunamadı.</p>
        </div>
      </div>
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
const selectedYear = ref(new Date().getFullYear())

const totalPaid = ref(0)
const totalDebt = ref(0)

const lastPaymentDate = computed(() => {
  const latest = [...filteredPayments.value].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
  return latest?.date ? new Date(latest.date).toLocaleDateString('tr-TR') : '-'
})

const availableYears = computed(() => {
  const years = new Set()
  payments.value.forEach(p => years.add(new Date(p.date).getFullYear()))
  allExpenses.value.forEach(e => {
    if (e.period) years.add(new Date(e.period).getFullYear())
  })
  return Array.from(years).sort((a, b) => b - a)
})

const filteredTotalPaid = computed(() =>
  filteredPayments.value.reduce((sum, p) => sum + (p.amount || 0), 0)
)

const filteredTotalDebt = computed(() =>
  filteredExpenses.value.reduce((sum, r) => sum + (Number(r.toplamTutar) || 0), 0)
)

const filteredBalance = computed(() =>
  filteredTotalDebt.value - filteredTotalPaid.value
)

const filteredPayments = computed(() =>
  payments.value.filter(p => new Date(p.date).getFullYear() === Number(selectedYear.value))
)

const filteredExpenses = computed(() =>
  allExpenses.value.filter(e => new Date(e.period).getFullYear() === Number(selectedYear.value))
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
  readings.value = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

const fetchAidats = async () => {
  const q = query(collection(db, 'aidatRecords'), where('tenantId', '==', tenantId))
  const snapshot = await getDocs(q)
  aidats.value = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

const computeAllExpenses = () => {
  allExpenses.value = [...readings.value, ...aidats.value].map(e => {
    return {
      ...e,
      toplamTutar: e.toplamTutar ?? e.kdvDahil ?? 0
    }
  }).sort((a, b) => (a.period || '').localeCompare(b.period || ''))
}

onMounted(async () => {
  await fetchTenantData()
  await fetchPayments()
  await fetchReadings()
  await fetchAidats()
  computeAllExpenses()
})
</script>
