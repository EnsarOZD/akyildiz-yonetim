<template>
  <section class="p-4 space-y-6 max-w-5xl mx-auto">

    <!-- Kiracı Ekle/Güncelle -->
    <div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
      <h2 class="text-center text-lg font-semibold mb-4">Kiracı {{ editMode ? 'Güncelle' : 'Ekle' }}</h2>
      <form @submit.prevent="saveTenant" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="label font-semibold">Ad</label>
          <input v-model="newTenant.firstName" placeholder="Ad" class="input input-bordered w-full" required />
        </div>
        <div>
          <label class="label font-semibold">Soyad</label>
          <input v-model="newTenant.lastName" placeholder="Soyad" class="input input-bordered w-full" required />
        </div>
        <div>
          <label class="label font-semibold">Telefon</label>
          <input v-model="newTenant.phone" placeholder="Telefon" class="input input-bordered w-full" required />
        </div>
        <div>
          <label class="label font-semibold">E-posta</label>
          <input v-model="newTenant.email" placeholder="E-posta" class="input input-bordered w-full" />
        </div>
        <div>
          <label class="label font-semibold">Şirket Unvanı</label>
          <input v-model="newTenant.company" placeholder="Şirket Unvanı" class="input input-bordered w-full" required />
        </div>

        <!-- Giriş Tarihi -->
        <div>
          <label class="label font-semibold">Giriş Tarihi</label>
          <input type="date" v-model="newTenant.entryDate" class="input input-bordered w-full" required />
        </div>

        <!-- Çoklu Kat Seçimi (profesyonel ve erişim kontrollü) -->
        <div>
          <label class="label font-semibold">Katlar</label>
          <div class="flex flex-wrap gap-2">
            <label v-for="unit in UNIT_OPTIONS" :key="unit" class="flex items-center gap-1">
              <input
                type="checkbox"
                :value="unit"
                v-model="newTenant.units"
                :disabled="isUnitTaken(unit) && !(editMode && newTenant.units.includes(unit))"
              />
              <span :class="isUnitTaken(unit) && !(editMode && newTenant.units.includes(unit)) ? 'text-gray-400 line-through' : ''">
                {{ unit }}
              </span>
            </label>
          </div>
        </div>

        <!-- Aktif/Pasif Seçimi -->
        <div class="md:col-span-3 flex items-center gap-4">
          <label class="label cursor-pointer">
            <span class="label-text font-semibold">Aktif mi?</span>
            <input type="checkbox" v-model="newTenant.isActive" class="toggle toggle-success" />
          </label>
        </div>

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
              <th class="text-center">Kat(lar)</th>
              <th class="text-center">Telefon</th>
              <th class="text-center">E-posta</th>
              <th class="text-center">Şirket</th>
              <th class="text-center">Giriş Tarihi</th>
              <th class="text-center">Durum</th>
              <th class="text-center">İşlem</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(t, index) in tenants" :key="index">
              <td class="text-center">{{ t.firstName }}</td>
              <td class="text-center">{{ t.lastName }}</td>
              <td class="text-center">{{ t.units?.join(', ') }}</td>
              <td class="text-center">{{ t.phone }}</td>
              <td class="text-center">{{ t.email }}</td>
              <td class="text-center">{{ t.company }}</td>
              <td class="text-center">{{ t.entryDate }}</td>
              <td class="text-center">
                <span :class="t.isActive ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                  {{ t.isActive ? 'Aktif' : 'Pasif' }}
                </span>
              </td>
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
import { UNIT_OPTIONS } from '../constants/units'

const tenants = ref([])
const newTenant = ref({
  firstName: '',
  lastName: '',
  units: [],
  phone: '',
  email: '',
  company: '',
  entryDate: new Date().toISOString().slice(0, 10),
  isActive: true
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

const isUnitTaken = (unit) => {
  return tenants.value.some(t =>
    t.isActive && t.units?.includes(unit) && (!editMode.value || t.id !== selectedTenantId.value)
  )
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
    units: [],
    phone: '',
    email: '',
    company: '',
    entryDate: new Date().toISOString().slice(0, 10),
    isActive: true
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
    units: tenant.units || [],
    phone: tenant.phone || '',
    email: tenant.email || '',
    company: tenant.company || '',
    entryDate: tenant.entryDate || new Date().toISOString().slice(0, 10),
    isActive: tenant.isActive ?? true
  }
  selectedTenantId.value = tenant.id
  editMode.value = true
}

const cancelEdit = () => {
  newTenant.value = {
    firstName: '',
    lastName: '',
    units: [],
    phone: '',
    email: '',
    company: '',
    entryDate: new Date().toISOString().slice(0, 10),
    isActive: true
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
