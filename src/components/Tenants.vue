<template>
  <section class="p-4 space-y-6 max-w-5xl mx-auto">

    <!-- Kiracı Ekleme Kartı -->
 <div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
  <h2 class="text-center text-lg font-semibold text-base-content mb-4">Kiracı Ekle</h2>
  <form class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <input placeholder="Ad Soyad" class="input input-bordered w-full" required />
    <input placeholder="Daire No" class="input input-bordered w-full" required />
    <input placeholder="Telefon" class="input input-bordered w-full" required />
    <div class="md:col-span-3 flex justify-end">
      <button type="submit" class="btn btn-primary">Ekle</button>
    </div>
  </form>
</div>


    <!-- Kiracılar Listesi -->
    <div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
      <h3 class="text-center text-lg font-semibold text-base-content mb-4">Kiracılar</h3>
      <div class="overflow-x-auto rounded-lg border border-base-300">
        <table class="table table-zebra w-full text-sm">
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Daire No</th>
              <th>Telefon</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(t, index) in tenants" :key="index">
              <td>{{ t.name }}</td>
              <td>{{ t.unit }}</td>
              <td>{{ t.phone }}</td>
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

const tenants = ref([])
const newTenant = ref({ name: '', unit: '', phone: '' })

const fetchTenants = async () => {
  tenants.value = []
  const querySnapshot = await getDocs(collection(db, "tenants"))
  querySnapshot.forEach(doc => {
    tenants.value.push(doc.data())
  })
}

const addTenant = async () => {
  await addDoc(collection(db, "tenants"), {
    name: newTenant.value.name,
    unit: newTenant.value.unit,
    phone: newTenant.value.phone,
  })
  newTenant.value = { name: '', unit: '', phone: '' }
  fetchTenants()
}

onMounted(fetchTenants)
</script>
