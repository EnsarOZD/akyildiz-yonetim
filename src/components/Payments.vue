<template>
  <section class="p-4 space-y-6 max-w-5xl mx-auto">

    <!-- Ödeme Ekleme Kartı -->
    <div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
      <h2 class="text-center text-lg font-semibold text-base-content mb-4">Ödeme Ekle</h2>
      <form @submit.prevent="addPayment" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input v-model="newPayment.date" type="date" class="input input-bordered w-full" required />
        <input v-model="newPayment.name" placeholder="Kiracı Adı" class="input input-bordered w-full" required />
        <input v-model="newPayment.amount" type="number" placeholder="Tutar" class="input input-bordered w-full" required />
        <div class="md:col-span-3 flex justify-end">
          <button type="submit" class="btn btn-primary">Ekle</button>
        </div>
      </form>
    </div>

    <!-- Ödeme Geçmişi Tablosu -->
    <div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
      <h3 class="text-center text-lg font-semibold text-base-content mb-4">Ödeme Geçmişi</h3>
      <div class="overflow-x-auto rounded-lg border border-base-300">
        <table class="table table-zebra w-full text-sm">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Kiracı</th>
              <th>Tutar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, index) in payments" :key="index">
              <td>{{ p.date }}</td>
              <td>{{ p.name }}</td>
              <td class="text-green-600 font-medium">{{ p.amount }} ₺</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, getDocs } from 'firebase/firestore'

const payments = ref([])
const newPayment = ref({ date: '', name: '', amount: '' })

const fetchPayments = async () => {
  payments.value = []
  const querySnapshot = await getDocs(collection(db, "payments"))
  querySnapshot.forEach(doc => {
    payments.value.push(doc.data())
  })
}

const addPayment = async () => {
  await addDoc(collection(db, "payments"), {
    date: newPayment.value.date,
    name: newPayment.value.name,
    amount: newPayment.value.amount
  })
  newPayment.value = { date: '', name: '', amount: '' }
  fetchPayments()
}

onMounted(fetchPayments)
</script>
