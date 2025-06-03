<template>
  <section class="max-w-3xl mx-auto p-6 space-y-6">
    <h2 class="text-xl font-bold text-center">Yıllık Aidat Tutarı Tanımlama</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4 bg-base-100 p-4 rounded-xl shadow">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="label">Yıl</label>
          <input type="number" v-model.number="year" class="input input-bordered w-full" min="2020" />
        </div>
        <div>
          <label class="label">Şirket</label>
          <select v-model="selectedTenant" class="select select-bordered w-full">
            <option disabled value="">Seçiniz</option>
            <option v-for="t in tenants" :key="t.id" :value="t.id">{{ t.company }}</option>
          </select>
        </div>
        <div>
          <label class="label">Kat</label>
          <select v-model="selectedUnit" class="select select-bordered w-full" :disabled="!selectedTenant">
            <option disabled value="">Seçiniz</option>
            <option v-for="unit in selectedTenantUnits" :key="unit" :value="unit">{{ unit }}</option>
          </select>
        </div>
        <div>
          <label class="label">Aidat (KDV Hariç)</label>
          <input
            :value="amount"
            @input="formatInput"
            class="input input-bordered w-full"
            inputmode="numeric"
            placeholder="Örn: 2.500"
          />
        </div>
        <div>
          <label class="label">KDV Dahil</label>
          <input :value="vatIncludedAmount" class="input input-bordered w-full bg-base-200" disabled />
        </div>
      </div>

      <div class="flex justify-end">
        <button class="btn btn-primary" type="submit">Kaydet</button>
      </div>
    </form>

    <div v-if="duesList.length" class="overflow-x-auto mt-6">
      <h3 class="font-semibold mb-2">Kayıtlı Aidat Tutarları</h3>
      <table class="table w-full table-zebra text-sm">
        <thead>
          <tr>
            <th>Yıl</th>
            <th>Şirket</th>
            <th>Kat</th>
            <th>KDV Dahil</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in duesList" :key="item.id">
            <td>{{ item.year }}</td>
            <td>{{ item.company }}</td>
            <td>{{ item.unit }}</td>
            <td class="text-right text-green-700 font-semibold">
              {{ formatCurrency(item.vatIncludedAmount || item.amount * 1.2) }}
            </td>
            <td class="text-center">
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-sm btn-outline">İşlemler</label>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 z-10">
                  <li><a @click.prevent="editDues(item)">Düzenle</a></li>
                  <li><a @click.prevent="deleteDues(item.id)">Sil</a></li>
                </ul>
              </div>
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
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore'

const tenants = ref([])
const selectedTenant = ref('')
const selectedUnit = ref('')
const year = ref(new Date().getFullYear())
const amount = ref('')
const duesList = ref([])
const selectedId = ref(null)

const formatCurrency = (val) => {
  return parseFloat(val).toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺'
}

const parseAmount = () => {
  const raw = amount.value.replace(/\./g, '').replace(',', '.')
  return parseFloat(raw) || 0
}

const vatIncludedAmount = computed(() => {
  return (parseAmount() * 1.2).toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺'
})

const formatInput = (e) => {
  let digits = e.target.value.replace(/\D/g, '')
  amount.value = new Intl.NumberFormat('tr-TR').format(Number(digits))
}

const selectedTenantUnits = computed(() => {
  const tenant = tenants.value.find(t => t.id === selectedTenant.value)
  return tenant ? tenant.units || [] : []
})

const fetchDues = async () => {
  duesList.value = []
  const snap = await getDocs(collection(db, 'annualDues'))
  snap.forEach(docSnap => {
    const data = docSnap.data()
    const tenant = tenants.value.find(t => t.id === data.tenantId)
    if (tenant) {
      duesList.value.push({
        id: docSnap.id,
        year: data.year,
        amount: data.amount,
        vatIncludedAmount: data.vatIncludedAmount,
        unit: data.unit,
        company: tenant.company,
        tenantId: data.tenantId
      })
    }
  })
}

const deleteDues = async (id) => {
  if (confirm('Bu aidat kaydını silmek istiyor musunuz?')) {
    await deleteDoc(doc(db, 'annualDues', id))
    await fetchDues()
  }
}

const editDues = (item) => {
  selectedTenant.value = item.tenantId
  selectedUnit.value = item.unit
  amount.value = new Intl.NumberFormat('tr-TR').format(item.amount)
  year.value = item.year
  selectedId.value = item.id
}

const handleSubmit = async () => {
  const rawAmount = parseAmount()
  if (!selectedTenant.value || !selectedUnit.value || rawAmount <= 0 || year.value < 2020) {
    alert('Lütfen tüm alanları eksiksiz doldurun.')
    return
  }

  const vatAmount = parseFloat((rawAmount * 1.2).toFixed(2))

  if (selectedId.value) {
    const refDoc = doc(db, 'annualDues', selectedId.value)
    await setDoc(refDoc, {
      tenantId: selectedTenant.value,
      unit: selectedUnit.value,
      year: year.value,
      amount: rawAmount,
      vatIncludedAmount: vatAmount
    })
    alert('Aidat güncellendi.')
  } else {
    const exists = duesList.value.find(
      d => d.year === year.value && d.tenantId === selectedTenant.value && d.unit === selectedUnit.value
    )
    if (exists) {
      alert('Bu şirketin bu katı için bu yıl zaten aidat tanımlanmış.')
      return
    }

    await addDoc(collection(db, 'annualDues'), {
      tenantId: selectedTenant.value,
      unit: selectedUnit.value,
      year: year.value,
      amount: rawAmount,
      vatIncludedAmount: vatAmount
    })
    alert('Aidat kaydı eklendi.')
  }

  selectedTenant.value = ''
  selectedUnit.value = ''
  amount.value = ''
  selectedId.value = null
  await fetchDues()
}

onMounted(async () => {
  const tenantSnap = await getDocs(collection(db, 'tenants'))
  tenants.value = tenantSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
  fetchDues()
})
</script>
