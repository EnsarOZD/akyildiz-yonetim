<template>
  <section class="p-4 space-y-6 max-w-5xl mx-auto">

    <!-- Ödeme Ekle/Güncelle Kartı -->
    <div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
      <h2 class="text-center text-lg font-semibold mb-4">Ödeme {{ editMode ? 'Güncelle' : 'Ekle' }}</h2>
      <form @submit.prevent="savePayment" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input v-model="newPayment.date" type="date" class="input input-bordered w-full" required />

        <select v-model="newPayment.tenantId" class="select select-bordered w-full" required>
          <option disabled value="">Kiracı seçin</option>
          <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
            {{ tenant.company }}
          </option>
        </select>

        <input v-model.number="newPayment.amount" type="number" placeholder="Tutar (₺)" class="input input-bordered w-full" required />

        <select v-model="newPayment.type" class="select select-bordered w-full" required>
          <option disabled value="">Ödeme Tipi</option>
          <option value="Aidat">Aidat</option>
          <option value="Elektrik">Elektrik</option>
          <option value="Su">Su</option>
        </select>

        <select v-model="newPayment.bank" class="select select-bordered w-full" required>
          <option disabled value="">Banka Seçin</option>
          <option v-for="b in banks" :key="b" :value="b">{{ b }}</option>
        </select>

        <div class="md:col-span-3 flex justify-end gap-2">
          <button type="submit" class="btn btn-success">{{ editMode ? 'Kaydet' : 'Ekle' }}</button>
          <button v-if="editMode" type="button" @click="cancelEdit" class="btn btn-outline btn-warning">Vazgeç</button>
        </div>
      </form>
    </div>

    <!-- Ödeme Listesi -->
    <div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
      <h3 class="text-center text-lg font-semibold mb-4">Ödeme Geçmişi</h3>
      <div class="overflow-x-auto">
        <table class="table table-zebra w-full text-sm">
          <thead>
            <tr>
              <th class="text-center">Tarih</th>
              <th class="text-center">Firma</th>
              <th class="text-center">Tutar</th>
              <th class="text-center">Tip</th>
              <th class="text-center">Banka</th>
              <th class="text-center">İşlem</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, index) in payments" :key="index">
              <td class="text-center">{{ p.date }}</td>
              <td class="text-center">{{ getTenantCompany(p.tenantId) }}</td>
              <td class="text-center text-green-600">{{ p.amount }} ₺</td>
              <td class="text-center">{{ p.type }}</td>
              <td class="text-center">{{ p.bank }}</td>
              <td class="text-center">
                <div class="flex justify-center gap-2">
                  <button @click="startEdit(p)" class="btn btn-xs btn-info">Düzenle</button>
                  <button @click="deletePayment(p.id)" class="btn btn-xs btn-error">Sil</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'

const payments = ref([])
const tenants = ref([])
const banks = ref([
  'Ziraat',
  'İş Bankası',
  'Garanti',
  'Yapı Kredi',
  'Halkbank'
])

const newPayment = ref({
  date: new Date().toISOString().substring(0, 10),
  tenantId: '',
  amount: null,
  type: '',
  bank: ''
})

const editMode = ref(false)
const selectedPaymentId = ref(null)

const fetchPayments = async () => {
  payments.value = []
  const querySnapshot = await getDocs(collection(db, "payments"))
  querySnapshot.forEach(docSnapshot => {
    payments.value.push({
      id: docSnapshot.id,
      ...docSnapshot.data()
    })
  })
}

const fetchTenants = async () => {
  tenants.value = []
  const querySnapshot = await getDocs(collection(db, "tenants"))
  querySnapshot.forEach(docSnapshot => {
    tenants.value.push({
      id: docSnapshot.id,
      ...docSnapshot.data()
    })
  })
}

const getTenantCompany = (id) => {
  const tenant = tenants.value.find(t => t.id === id)
  return tenant ? tenant.company : 'Bilinmiyor'
}

const savePayment = async () => {
  if (editMode.value && selectedPaymentId.value) {
    const paymentRef = doc(db, "payments", selectedPaymentId.value)
    await updateDoc(paymentRef, { ...newPayment.value })
  } else {
    await addDoc(collection(db, "payments"), { ...newPayment.value })
  }

  newPayment.value = {
    date: new Date().toISOString().substring(0, 10),
    tenantId: '',
    amount: null,
    type: '',
    bank: ''
  }
  editMode.value = false
  selectedPaymentId.value = null
  await fetchPayments()
}

const deletePayment = async (id) => {
  await deleteDoc(doc(db, "payments", id))
  payments.value = payments.value.filter(p => p.id !== id)
}

const startEdit = (payment) => {
  newPayment.value = {
    date: payment.date,
    tenantId: payment.tenantId,
    amount: payment.amount,
    type: payment.type,
    bank: payment.bank
  }
  selectedPaymentId.value = payment.id
  editMode.value = true
}

const cancelEdit = () => {
  newPayment.value = {
    date: new Date().toISOString().substring(0, 10),
    tenantId: '',
    amount: null,
    type: '',
    bank: ''
  }
  editMode.value = false
  selectedPaymentId.value = null
}

onMounted(() => {
  fetchTenants()
  fetchPayments()
})
</script>
