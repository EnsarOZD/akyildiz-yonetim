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
          <div class="stat-value text-primary">{{ tenantStats?.totalCount || 0 }}</div>
        </div>
        <div class="stat bg-base-100 shadow-lg rounded-box">
          <div class="stat-figure text-success">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div class="stat-title">Aktif Kiracı</div>
          <div class="stat-value text-success">{{ tenantStats?.activeCount || 0 }}</div>
        </div>
        <div class="stat bg-base-100 shadow-lg rounded-box">
          <div class="stat-figure text-warning">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
          </div>
          <div class="stat-title">Pasif Kiracı</div>
          <div class="stat-value text-warning">{{ tenantStats?.passiveCount || 0 }}</div>
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
                  <div :class="getAvatarColor(tenant.firstName)" class="bg-neutral-focus text-neutral-content rounded-full w-14">
                    <span class="text-xl font-bold">{{ getAvatarInitial(tenant.firstName) }}</span>
                  </div>
                </div>
                <div>
                  <h2 class="card-title text-base-content">{{ `${tenant.firstName} ${tenant.lastName}` }}</h2>
                  <p class="text-sm text-base-content/70">
                    Daire: {{ tenant.apartmentNumber }}
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
                <div class="font-semibold text-base-content/80">Aylık Kira</div>
                <div class="text-lg font-bold text-success">
                  {{ formatCurrency(tenant.monthlyRent) }}
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
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import tenantsService from '@/services/tenantsService'
import TenantEditModal from './components/TenantEditModal.vue'
import TenantCreateModal from './components/TenantCreateModal.vue'
import { UNIT_OPTIONS } from '../../constants/units'
import ConfirmDeleteModal from './components/ConfirmDeleteModal.vue'
import FilterBar from '@/components/common/FilterBar.vue'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useNotification } from '@/composables/useNotification'
import { useEventBus } from '@/composables/useEventBus'

const router = useRouter()
const { handleNetworkError, withErrorHandling } = useErrorHandler()
const { showCreateSuccess, showUpdateSuccess, showDeleteSuccess } = useNotification()
const { on, off } = useEventBus()

const tenants = ref([])
const tenantStats = ref(null)
const selectedTenant = ref(null)
const editModalVisible = ref(false)
const createModalVisible = ref(false)
const deleteModalVisible = ref(false)
const tenantToDelete = ref(null)
const statusFilter = ref("all")
const search = ref('')
const loading = ref(false)

const fetchTenants = async () => {
  try {
    loading.value = true
    
    // Filtreleri backend'e gönder
    const apiFilters = {}
    if (search.value) apiFilters.searchTerm = search.value
    if (statusFilter.value === 'active') apiFilters.isActive = true
    else if (statusFilter.value === 'passive') apiFilters.isActive = false
    
    const [tenantsData, statsData] = await Promise.all([
      tenantsService.getTenants(apiFilters),
      tenantsService.getTenantStats()
    ])
    
    tenants.value = tenantsData
    tenantStats.value = statsData
  } catch (error) {
    console.error('Kiracılar yüklenirken hata:', error)
    alert('Kiracılar yüklenirken bir hata oluştu')
  } finally {
    loading.value = false
  }
}

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
      `${t.firstName} ${t.lastName}`.toLowerCase().includes(s) ||
      (t.apartmentNumber || '').toLowerCase().includes(s) ||
      (t.email || '').toLowerCase().includes(s)
    )
  }
  return filtered.sort((a,b) => a.firstName.localeCompare(b.firstName))
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
  try {
    await tenantsService.updateTenant(tenantId, { isActive: true })
    await fetchTenants()
  } catch (error) {
    console.error('Kiracı aktif edilirken hata:', error)
    alert('Kiracı aktif edilirken bir hata oluştu')
  }
}

const deactivateTenant = async (tenantId) => {
  try {
    await tenantsService.updateTenant(tenantId, { isActive: false })
    await fetchTenants()
  } catch (error) {
    console.error('Kiracı pasif edilirken hata:', error)
    alert('Kiracı pasif edilirken bir hata oluştu')
  }
}

const handleClearFilters = () => {
  search.value = ''
  statusFilter.value = 'all'
  fetchTenants()
}

const handleTenantUpdate = async (updatedTenant) => {
  try {
    await tenantsService.updateTenant(updatedTenant.id, updatedTenant)
    editModalVisible.value = false
    await fetchTenants()
    showUpdateSuccess('Kiracı')
  } catch (error) {
    console.error('Kiracı güncellenirken hata:', error)
    alert('Kiracı güncellenirken bir hata oluştu')
  }
}

const saveTenant = async (newTenant) => {
  try {
    await tenantsService.createTenant(newTenant)
    createModalVisible.value = false
    await fetchTenants()
    showCreateSuccess('Kiracı')
  } catch (error) {
    console.error('Kiracı oluşturulurken hata:', error)
    alert('Kiracı oluşturulurken bir hata oluştu')
  }
}

const askDelete = (tenant) => {
  tenantToDelete.value = tenant
  deleteModalVisible.value = true
}

const confirmDelete = async () => {
  try {
    await tenantsService.deleteTenant(tenantToDelete.value.id)
    deleteModalVisible.value = false
    await fetchTenants()
    showDeleteSuccess('Kiracı')
  } catch (error) {
    console.error('Kiracı silinirken hata:', error)
    alert('Kiracı silinirken bir hata oluştu')
  }
}

const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '₺0,00'
  return Number(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

onMounted(() => {
  fetchTenants()
  
  // Ödeme yapıldığında bakiye güncellemesi için event listener
  on('payment:created', handlePaymentCreated)
})

onUnmounted(() => {
  // Event listener'ı temizle
  off('payment:created', handlePaymentCreated)
})

const handlePaymentCreated = async (paymentData) => {
  try {
    console.log('💰 Ödeme yapıldı, kiracı bakiyeleri güncelleniyor:', paymentData)
    await fetchTenants()
  } catch (error) {
    console.error('Ödeme sonrası güncelleme hatası:', error)
  }
}
</script>
