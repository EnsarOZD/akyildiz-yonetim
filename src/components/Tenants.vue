<template>
  <section class="p-4 space-y-6 max-w-5xl mx-auto">

    <!-- Kiracı Ekle/Güncelle -->
    <div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
      <h2 class="text-center text-lg font-semibold mb-4">Kiracı {{ editMode ? 'Güncelle' : 'Ekle' }}</h2>
      <form @submit.prevent="saveTenant" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input v-model="newTenant.firstName" placeholder="Ad" class="input input-bordered w-full" required />
        <input v-model="newTenant.lastName" placeholder="Soyad" class="input input-bordered w-full" required />
        <input v-model="newTenant.unit" placeholder="Daire No" class="input input-bordered w-full" required />
        <input v-model="newTenant.phone" placeholder="Telefon" class="input input-bordered w-full" required />
        <input v-model="newTenant.email" placeholder="E-posta" class="input input-bordered w-full" />
        <input v-model="newTenant.company" placeholder="Şirket Unvanı" class="input input-bordered w-full" required />
        <div class="md:col-span-3 flex justify-end gap-2">
          <button type="submit" class="btn btn-success">{{ editMode ? 'Kaydet' : 'Ekle' }}</button>
          <button v-if="editMode" type="button" @click="cancelEdit" class="btn btn-outline btn-warning">Vazgeç</button>
        </div>
      </form>
    </div>

    <!-- Kiracı Listesi -->
    <div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
      <h3 class="text-center text-lg font-semibold mb-4">Kiracılar</h3>
      <div class="overflow-x-auto">
        <table class="table table-zebra w-full text-sm">
          <thead>
            <tr>
              <th class="text-center">Ad</th>
              <th class="text-center">Soyad</th>
              <th class="text-center">Daire</th>
              <th class="text-center">Telefon</th>
              <th class="text-center">E-posta</th>
              <th class="text-center">Şirket</th>
              <th class="text-center">İşlem</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(t, index) in tenants" :key="index">
              <td class="text-center">{{ t.firstName }}</td>
              <td class="text-center">{{ t.lastName }}</td>
              <td class="text-center">{{ t.unit }}</td>
              <td class="text-center">{{ t.phone }}</td>
              <td class="text-center">{{ t.email }}</td>
              <td class="text-center">{{ t.company }}</td>
              <td class="text-center">
                <div class="flex justify-center gap-2">
                  <button @click="startEdit(t)" class="btn btn-xs btn-info">Düzenle</button>
                  <button @click="deleteTenant(t.id)" class="btn btn-xs btn-error">Sil</button>
                  <button @click="showSummary(t)" class="btn btn-xs btn-primary">Özet</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <TenantSummary v-if="summaryVisible" :tenant="selectedTenant" @close="summaryVisible = false" />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import TenantSummary from './TenantSummary.vue'

const tenants = ref([])
const newTenant = ref({
  firstName: '',
  lastName: '',
  unit: '',
  phone: '',
  email: '',
  company: ''
})
const editMode = ref(false)
const selectedTenantId = ref(null)
const selectedTenant = ref(null)
const summaryVisible = ref(false)

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

const saveTenant = async () => {
  if (editMode.value && selectedTenantId.value) {
    const tenantRef = doc(db, "tenants", selectedTenantId.value)
    await updateDoc(tenantRef, { ...newTenant.value })
  } else {
    await addDoc(collection(db, "tenants"), { ...newTenant.value })
  }

  newTenant.value = {
    firstName: '',
    lastName: '',
    unit: '',
    phone: '',
    email: '',
    company: ''
  }
  editMode.value = false
  selectedTenantId.value = null
  fetchTenants()
}

const deleteTenant = async (id) => {
  await deleteDoc(doc(db, "tenants", id))
  tenants.value = tenants.value.filter(t => t.id !== id)
}

const startEdit = (tenant) => {
  newTenant.value = {
    firstName: tenant.firstName || '',
    lastName: tenant.lastName || '',
    unit: tenant.unit || '',
    phone: tenant.phone || '',
    email: tenant.email || '',
    company: tenant.company || ''
  }
  selectedTenantId.value = tenant.id
  editMode.value = true
}

const cancelEdit = () => {
  newTenant.value = {
    firstName: '',
    lastName: '',
    unit: '',
    phone: '',
    email: '',
    company: ''
  }
  editMode.value = false
  selectedTenantId.value = null
}

const showSummary = (tenant) => {
  selectedTenant.value = tenant
  summaryVisible.value = true
}

onMounted(fetchTenants)
</script>
