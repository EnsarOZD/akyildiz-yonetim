<template>
  <section class="p-4 space-y-6 max-w-5xl mx-auto">

    <!-- Kiracı Ekle Butonu -->
    <div class="flex justify-end">
      <button class="btn btn-primary" @click="createModalVisible = true">Yeni Kiracı Ekle</button>
    </div>

    <!-- Kiracı Listeleme -->
    <div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
      <h3 class="text-center text-lg font-semibold mb-4">Kiracılar</h3>
      <div class="overflow-x-auto">
        <div class="flex gap-2 justify-end mb-4">
          <button class="btn btn-sm" :class="{ 'btn-primary': statusFilter === 'all' }" @click="statusFilter = 'all'">Tümü</button>
          <button class="btn btn-sm" :class="{ 'btn-success': statusFilter === 'active' }" @click="statusFilter = 'active'">Aktif</button>
          <button class="btn btn-sm" :class="{ 'btn-error': statusFilter === 'passive' }" @click="statusFilter = 'passive'">Pasif</button>
        </div>

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
              <th class="text-center">İşlem</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(t, index) in filteredTenants" :key="index">
              <td class="text-center">{{ t.firstName }}</td>
              <td class="text-center">{{ t.lastName }}</td>
              <td class="text-center">{{ t.units?.join(', ') }}</td>
              <td class="text-center whitespace-nowrap">{{ formatPhone(t.phone) }}</td>
              <td class="text-center">{{ t.email }}</td>
              <td class="text-center">{{ t.company }}</td>
              <td class="text-center">{{ t.entryDate }}</td>
              <td class="text-center">
                <div class="dropdown dropdown-end">
                  <div tabindex="0" role="button" class="btn btn-sm m-1">İşlem</div>
                  <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36">
                    <li><button @click.stop.prevent="startEdit(t)">Düzenle</button></li>
                    <li><button @click.stop.prevent="showSummary(t)">Özet</button></li>
                    <li><button @click.stop.prevent="askDelete(t)" class="text-error">Sil</button></li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <TenantSummary v-if="summaryVisible" :tenant="selectedTenant" @close="summaryVisible = false" />
    <TenantEditModal
  :tenant="selectedTenant"
  :visible="editModalVisible"
  :unit-options="UNIT_OPTIONS"
  :all-tenants="tenants"
  @save="handleTenantUpdate"
  @close="editModalVisible = false"
/>
<TenantCreateModal
  :visible="createModalVisible"
  :unit-options="UNIT_OPTIONS"
  :all-tenants="tenants"
  @save="saveTenant"
  @close="createModalVisible = false"
/>
    <ConfirmDeleteModal
    :visible="deleteModalVisible"
    :tenant="tenantToDelete"
    @confirm="confirmDelete"
    @cancel="deleteModalVisible = false"
    />

    
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import TenantSummary from './TenantSummary.vue'
import TenantEditModal from './TenantEditModal.vue'
import TenantCreateModal from './TenantCreateModal.vue'
import { UNIT_OPTIONS } from '../constants/units'
import ConfirmDeleteModal from './ConfirmDeleteModal.vue'

const tenants = ref([])
const selectedTenant = ref(null)
const summaryVisible = ref(false)
const editModalVisible = ref(false)
const createModalVisible = ref(false)
const statusFilter = ref("all")
const deleteModalVisible = ref(false)
const tenantToDelete = ref(null)

const askDelete = (tenant) => {
  tenantToDelete.value = tenant
  deleteModalVisible.value = true
}

const confirmDelete = async () => {
  await deleteDoc(doc(db, "tenants", tenantToDelete.value.id))
  tenants.value = tenants.value.filter(t => t.id !== tenantToDelete.value.id)
  deleteModalVisible.value = false
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

const filteredTenants = computed(() => {
  if (statusFilter.value === "active") return tenants.value.filter(t => t.isActive)
  if (statusFilter.value === "passive") return tenants.value.filter(t => !t.isActive)
  return tenants.value
})

const formatPhone = (raw) => {
  if (!raw) return ''
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('0')) {
    return `+90 (${digits.slice(1, 4)}) ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`
  }
  return raw
}

const saveTenant = async (tenantData) => {
  await addDoc(collection(db, "tenants"), { ...tenantData })
  fetchTenants()
  showCreateModal.value = false
}

const deleteTenant = async (id) => {
  await deleteDoc(doc(db, "tenants", id))
  tenants.value = tenants.value.filter(t => t.id !== id)
}

const startEdit = (tenant) => {
  selectedTenant.value = { ...tenant }
  editModalVisible.value = true
}

const handleTenantUpdate = async () => {
  if (selectedTenant.value?.id) {
    const tenantRef = doc(db, "tenants", selectedTenant.value.id)
    await updateDoc(tenantRef, { ...selectedTenant.value })
    fetchTenants()
    editModalVisible.value = false
  }
}

const showSummary = (tenant) => {
  selectedTenant.value = tenant
  summaryVisible.value = true
}

onMounted(fetchTenants)
</script>
