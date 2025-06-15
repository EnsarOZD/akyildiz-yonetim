<template>
  <section class="p-4 space-y-6 max-w-5xl mx-auto">

    <button class="btn btn-primary mb-4" @click="showModal = true">➕ Ödeme Ekle</button>
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

    <PaymentModal
  :visible="showModal"
  :payment="newPayment"
  :tenants="tenants"
  :banks="banks"
  :editMode="editMode"
  @save="savePayment"
  @cancel="cancelEdit"
/>

  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import PaymentModal from '../components/PaymentModal.vue'

const payments = ref([])
const tenants = ref([])
const banks = ref([
  'Ziraat',
  'İş Bankası',
  'Garanti',
  'Yapı Kredi',
  'Halkbank'
])
const showModal = ref(false)

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
  showModal.value = false
}

const deletePayment = async (id) => {
  const confirmed = confirm("Bu ödemeyi silmek istediğinize emin misiniz?")
  if (!confirmed) return

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
  showModal.value = true  // ✅ Modalı aç
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
  showModal.value = false
}


onMounted(() => {
  fetchTenants()
  fetchPayments()
})
</script>
