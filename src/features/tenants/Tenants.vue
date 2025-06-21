<template>
  <!-- Ana Sayfa Konteyneri -->
  <div class="p-4 sm:p-6 bg-base-200 min-h-screen">
    <div class="max-w-7xl mx-auto">

      <!-- Başlık -->
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Kiracılar</h1>

      <!-- Özet Kartlar ve Yeni Kiracı Butonu -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="stat bg-base-100 shadow-lg rounded-box">
          <div class="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <div class="stat-title">Toplam Kiracı</div>
          <div class="stat-value text-primary">{{ totalTenantsCount }}</div>
        </div>
        <div class="stat bg-base-100 shadow-lg rounded-box">
          <div class="stat-figure text-success">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div class="stat-title">Aktif Kiracı</div>
          <div class="stat-value text-success">{{ activeTenantsCount }}</div>
        </div>
        <div class="stat bg-base-100 shadow-lg rounded-box">
          <div class="stat-figure text-warning">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
          </div>
          <div class="stat-title">Pasif Kiracı</div>
          <div class="stat-value text-warning">{{ passiveTenantsCount }}</div>
        </div>
        <button class="btn btn-primary btn-lg h-full" @click="createModalVisible = true">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Yeni Kiracı Ekle
        </button>
      </section>

      <!-- Filtreler ve Arama -->
      <div class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <FilterBar
            :search="search" @update:search="val => search = val"
            :status="statusFilter" @update:status="val => statusFilter = val"
            search-placeholder="Şirket, kişi veya daire ara..."
            :status-options="[
              { value: 'all', label: 'Tümü' },
              { value: 'active', label: 'Aktif' },
              { value: 'passive', label: 'Pasif' }
            ]"
            @clear-filters="handleClearFilters"
          />
        </div>
      </div>

      <!-- Kiracı Kart Listesi -->
      <div v-if="filteredTenants.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="tenant in filteredTenants" :key="tenant.id" 
             class="card bg-base-100 shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
          <div class="card-body">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <div class="avatar placeholder">
                  <div :class="getAvatarColor(tenant.company || tenant.firstName)" class="bg-neutral-focus text-neutral-content rounded-full w-14">
                    <span class="text-xl font-bold">{{ getAvatarInitial(tenant.company || tenant.firstName) }}</span>
                  </div>
                </div>
                <div>
                  <h2 class="card-title text-base-content">{{ tenant.company || `${tenant.firstName} ${tenant.lastName}` }}</h2>
                  <p v-if="tenant.company" class="text-sm text-base-content/70">
                    {{ tenant.firstName }} {{ tenant.lastName }}
                  </p>
                  <p class="text-sm text-base-content/70">
                    Daire: {{ tenant.units.join(', ') }}
                  </p>
                </div>
              </div>
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-sm btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                </label>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-40 z-10">
                  <li><a @click="viewTenantDetail(tenant.id)">Detayları Gör</a></li>
                  <li><a @click="startEdit(tenant)">Düzenle</a></li>
                  <li v-if="!tenant.isActive"><a @click="activateTenant(tenant.id)">Aktif Et</a></li>
                  <li v-else><a @click="deactivateTenant(tenant.id)">Pasif Et</a></li>
                  <li><a @click="askDelete(tenant)" class="text-error">Sil</a></li>
                </ul>
              </div>
            </div>

            <div class="divider my-3"></div>
            
            <div class="flex justify-between items-center text-sm">
              <span :class="['badge font-semibold', tenant.isActive ? 'badge-success' : 'badge-ghost']">
                {{ tenant.isActive ? 'Aktif' : 'Pasif' }}
              </span>
              <div class="text-right">
                <div class="font-semibold text-base-content/80">Toplam Borç</div>
                <div class="text-lg font-bold" :class="tenant.totalDebt > 0 ? 'text-error' : 'text-success'">
                  {{ formatCurrency(tenant.totalDebt) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-16">
        <p class="text-xl text-base-content/60">Aramanızla eşleşen kiracı bulunamadı.</p>
      </div>
    </div>
    
    <!-- Modallar -->
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../../firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where, getDoc } from 'firebase/firestore'
import TenantEditModal from './components/TenantEditModal.vue'
import TenantCreateModal from './components/TenantCreateModal.vue'
import { UNIT_OPTIONS } from '../../constants/units'
import ConfirmDeleteModal from './components/ConfirmDeleteModal.vue'
import FilterBar from '@/components/common/FilterBar.vue'

const router = useRouter()
const tenants = ref([])
const selectedTenant = ref(null)
const editModalVisible = ref(false)
const createModalVisible = ref(false)
const deleteModalVisible = ref(false)
const tenantToDelete = ref(null)
const statusFilter = ref("all")
const search = ref('')

const fetchTenants = async () => {
  const tenantsSnapshot = await getDocs(collection(db, "tenants"))
  const tenantsData = tenantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

  const debtPromises = tenantsData.map(async tenant => {
    let totalDebt = 0
    
    const readingsQuery = query(collection(db, 'readings'), where('tenantId', '==', tenant.id), where('isPaid', '==', false))
    const readingsSnapshot = await getDocs(readingsQuery)
    readingsSnapshot.forEach(doc => {
      totalDebt += Number(doc.data().toplamTutar) || 0
    })

    const aidatQuery = query(collection(db, 'aidatRecords'), where('tenantId', '==', tenant.id), where('isPaid', '==', false))
    const aidatSnapshot = await getDocs(aidatQuery)
    aidatSnapshot.forEach(doc => {
      totalDebt += Number(doc.data().amount) || 0
    })
    
    return { ...tenant, totalDebt }
  })

  tenants.value = await Promise.all(debtPromises)
}

const totalTenantsCount = computed(() => tenants.value.length)
const activeTenantsCount = computed(() => tenants.value.filter(t => t.isActive).length)
const passiveTenantsCount = computed(() => tenants.value.filter(t => !t.isActive).length)

const filteredTenants = computed(() => {
  let filtered = tenants.value

  if (statusFilter.value === "active") {
    filtered = filtered.filter(t => t.isActive)
  } else if (statusFilter.value === "passive") {
    filtered = filtered.filter(t => !t.isActive)
  }

  if (search.value) {
    const s = search.value.toLowerCase()
    filtered = filtered.filter(t =>
      (t.company || '').toLowerCase().includes(s) ||
      `${t.firstName} ${t.lastName}`.toLowerCase().includes(s) ||
      (t.units || []).join(' ').toLowerCase().includes(s)
    )
  }
  return filtered.sort((a,b) => a.company.localeCompare(b.company))
})

const getAvatarInitial = (name) => (name ? name.charAt(0).toUpperCase() : '?')
const getAvatarColor = (name) => {
  if (!name) return 'bg-gray-500'
  const colors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-info', 'bg-success', 'bg-warning', 'bg-error']
  const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[charCodeSum % colors.length]
}

const viewTenantDetail = (tenantId) => {
  router.push({ name: 'TenantDetailPage', params: { id: tenantId } })
}

const startEdit = (tenant) => {
  selectedTenant.value = { ...tenant }
  editModalVisible.value = true
}

const activateTenant = async (tenantId) => {
  await updateDoc(doc(db, "tenants", tenantId), { isActive: true })
  await fetchTenants()
}

const deactivateTenant = async (tenantId) => {
  await updateDoc(doc(db, "tenants", tenantId), { isActive: false })
  await fetchTenants()
}

const handleClearFilters = () => {
  search.value = ''
  statusFilter.value = 'all'
}

const handleTenantUpdate = async (updatedTenant) => {
  await updateDoc(doc(db, "tenants", updatedTenant.id), updatedTenant)
  editModalVisible.value = false
  await fetchTenants()
}

const saveTenant = async (newTenant) => {
  await addDoc(collection(db, "tenants"), newTenant)
  createModalVisible.value = false
  await fetchTenants()
}

const askDelete = (tenant) => {
  tenantToDelete.value = tenant
  deleteModalVisible.value = true
}

const confirmDelete = async () => {
  await deleteDoc(doc(db, "tenants", tenantToDelete.value.id))
  deleteModalVisible.value = false
  await fetchTenants()
}

const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '₺0,00'
  return Number(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

onMounted(fetchTenants)
</script>
