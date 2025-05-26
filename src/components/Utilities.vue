<template>
  <section class="p-4 space-y-6 max-w-5xl mx-auto">

    <!-- Sayaç Girişi -->
    <div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
      <h2 class="text-center text-lg font-semibold text-base-content mb-4">Sayaç Girişi</h2>
      <form @submit.prevent="addUtility" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input v-model="newUtility.date" type="date" class="input input-bordered w-full" required />
        <input v-model="newUtility.type" placeholder="Tür (Elektrik, Su, Doğalgaz)" class="input input-bordered w-full" required />
        <input v-model="newUtility.value" type="number" placeholder="Tüketim Miktarı" class="input input-bordered w-full" required />
        <div class="md:col-span-3 flex justify-end">
          <button type="submit" class="btn btn-primary">Ekle</button>
        </div>
      </form>
    </div>

    <!-- Sayaç Kayıtları -->
    <div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
      <h3 class="text-center text-lg font-semibold text-base-content mb-4">Sayaç Kayıtları</h3>
      <div class="overflow-x-auto rounded-lg border border-base-300">
        <table class="table table-zebra w-full text-sm">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Tür</th>
              <th>Tüketim</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(u, index) in utilities" :key="index">
              <td>{{ u.date }}</td>
              <td>{{ u.type }}</td>
              <td class="font-semibold text-blue-600">{{ u.value }}</td>
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

const utilities = ref([])
const newUtility = ref({ date: '', type: '', value: '' })

const fetchUtilities = async () => {
  utilities.value = []
  const querySnapshot = await getDocs(collection(db, "utilities"))
  querySnapshot.forEach(doc => {
    utilities.value.push(doc.data())
  })
}

const addUtility = async () => {
  await addDoc(collection(db, "utilities"), {
    date: newUtility.value.date,
    type: newUtility.value.type,
    value: newUtility.value.value
  })
  newUtility.value = { date: '', type: '', value: '' }
  fetchUtilities()
}

onMounted(fetchUtilities)
</script>
