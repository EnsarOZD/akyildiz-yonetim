<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-3">
            <span class="text-4xl">🏢</span>
            İş Hanı Kiracıları
          </h1>
          <p class="text-gray-600 dark:text-gray-400">İş hanındaki tüm kiracıları yönetin</p>
        </div>
        <button @click="showCreateModal = true" class="btn btn-success bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 text-white shadow-lg">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Yeni Kiracı Ekle
        </button>
      </div>
    </div>

    <!-- Filtreler -->
    <div class="card bg-white dark:bg-gray-800 shadow-lg mb-6">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Arama -->
          <div class="form-control">
            <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Arama</span></label>
            <input v-model="filters.searchTerm" @input="handleSearch" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" placeholder="Şirket, kişi, kimlik no..." />
          </div>

          <!-- Durum -->
          <div class="form-control">
            <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Durum</span></label>
            <select v-model="filters.isActive" @change="handleSearch" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
              <option value="">Tümü</option>
              <option value="true">Aktif</option>
              <option value="false">Pasif</option>
            </select>
          </div>

          <!-- Kat -->
          <div class="form-control">
            <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Kat</span></label>
            <select v-model="filters.floorNumber" @change="handleSearch" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
              <option value="">Tüm Katlar</option>
              <option v-for="floor in availableFloors" :key="floor" :value="floor">{{ floor }}. Kat</option>
            </select>
          </div>

          <!-- İş Türü (client-side) -->
          <div class="form-control">
            <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">İş Türü</span></label>
            <select v-model="filters.businessType" @change="handleSearch" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
              <option value="">Tümü</option>
              <option value="Ticaret">Ticaret</option>
              <option value="Hizmet">Hizmet</option>
              <option value="Üretim">Üretim</option>
              <option value="Ofis">Ofis</option>
              <option value="Depo">Depo</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>
        </div>

        <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex gap-2">
            <button @click="clearFilters" class="btn btn-outline btn-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Filtreleri Temizle
            </button>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ filteredTenants.length }} kiracı bulundu
          </div>
        </div>
      </div>
    </div>

    <!-- Kartlar -->
    <div v-if="filteredTenants.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="tenant in paginatedTenants" :key="tenant.id" class="relative group bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl p-6 flex flex-col">
        <!-- Menü -->
        <div class="absolute top-4 right-4 z-10">
          <div class="dropdown dropdown-end">
            <button tabindex="0" class="btn btn-ghost btn-circle btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></svg>
            </button>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-40 z-10">
              <li><a @click="viewTenant(tenant)">Detayları Gör</a></li>
              <li><a @click="editTenant(tenant)">Düzenle</a></li>
              <li><a @click="openDeleteModal(tenant)" class="text-error">Sil</a></li>
            </ul>
          </div>
        </div>

        <!-- Baş -->
        <div class="flex items-center gap-4 mb-4">
          <div :class="getAvatarColor(tenant.contactPersonName) + ' flex items-center justify-center rounded-full w-16 h-16 text-2xl font-bold text-white shadow-lg'">
            {{ getAvatarInitial(tenant.companyName) }}
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-lg font-bold text-gray-800 dark:text-gray-100">{{ tenant.companyName }}</span>
              <span v-if="tenant.flats?.length" class="badge badge-info text-xs">
                Ünite {{ tenant.flats[0].code }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span :class="['badge font-semibold', tenant.isActive ? 'badge-success' : 'badge-ghost']">
                {{ tenant.isActive ? 'Aktif' : 'Pasif' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Tarih + iletişim -->
        <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span>Giriş: {{ formatDate(tenant.contractStartDate) }}</span>
        </div>
        <div v-if="tenant.contactPersonEmail" class="text-xs text-gray-400 truncate mb-1">{{ tenant.contactPersonEmail }}</div>
        <div v-if="tenant.contactPersonPhone" class="text-xs text-gray-400 truncate">{{ tenant.contactPersonPhone }}</div>
      </div>
    </div>

    <!-- Sayfalama -->
    <div class="card-body border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, filteredTenants.length) }} / {{ filteredTenants.length }} kiracı
        </div>
        <div class="join">
          <button @click="currentPage--" :disabled="currentPage === 1" class="join-item btn btn-sm">«</button>
          <button class="join-item btn btn-sm">{{ currentPage }}</button>
          <button @click="currentPage++" :disabled="currentPage >= totalPages" class="join-item btn btn-sm">»</button>
        </div>
      </div>
    </div>

    <!-- Modallar -->
    <TenantCreateModal
      :visible="showCreateModal"
      @save="handleCreateTenant"
      @close="showCreateModal = false"
    />

    <ConfirmDeleteModal
      :visible="showDeleteModal"
      :tenant="tenantToDelete"
      :title="deleteModalTitle"
      :message="deleteModalMessage"
      confirm-label="Evet, Sil"
      cancel-label="İptal"
      :loading="deleteLoading"
      @confirm="confirmDelete"
      @cancel="closeDeleteModal"
    />

    <TenantEditModal
      v-if="editingTenant"
      :visible="showEditModal"
      :tenant="editingTenant"
      @save="handleUpdateTenant"
      @close="closeEditModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import TenantEditModal from './components/TenantEditModal.vue'
import TenantCreateModal from './components/TenantCreateModal.vue'
import tenantsService from '@/features/tenants/services/tenantsService.js'
import { errorHandler } from '@/utils/errorHandler'
import ConfirmDeleteModal from './components/ConfirmDeleteModal.vue'
import { useEventBus } from '@/composables/useEventBus'

const router = useRouter()
const { emit: emitEvent } = useEventBus()

// Delete modal state
const showDeleteModal = ref(false)
const deleteLoading = ref(false)
const tenantToDelete = ref(null)
const deleteModalTitle = computed(() =>
  tenantToDelete.value ? `${tenantToDelete.value.companyName} silinsin mi?` : 'Silinsin mi?'
)
const deleteModalMessage = computed(() =>
  tenantToDelete.value ? `${tenantToDelete.value.companyName} kiracısını silerseniz ilgili ünite boşaltılacaktır.` : ''
)
const openDeleteModal = (tenant) => { tenantToDelete.value = tenant; showDeleteModal.value = true }
const closeDeleteModal = () => { showDeleteModal.value = false; tenantToDelete.value = null }

// Page state
const tenants = ref([])
const loading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTenant = ref(null)
const currentPage = ref(1)
const pageSize = 10

// Filters
const filters = ref({
  searchTerm: '',
  isActive: '',
  floorNumber: '',
  businessType: '' // client-side filter
})

// Computeds
const filteredTenants = computed(() => {
  let list = tenants.value

  if (filters.value.searchTerm) {
    const s = String(filters.value.searchTerm).toLowerCase()
    list = list.filter(t =>
      String(t.companyName || '').toLowerCase().includes(s) ||
      String(t.contactPersonName || '').toLowerCase().includes(s) ||
      String(t.identityNumber || '').includes(s) ||
      String(t.contactPersonEmail || '').toLowerCase().includes(s) ||
      String(t.contactPersonPhone || '').includes(s)
    )
  }

  if (filters.value.isActive !== '') {
    const wanted = (filters.value.isActive === 'true')
    list = list.filter(t => t.isActive === wanted)
  }

  if (filters.value.floorNumber !== '') {
    const f = parseInt(filters.value.floorNumber, 10)
    list = list.filter(t => t.flats?.some(fl => fl.floorNumber === f))
  }

  if (filters.value.businessType) {
    list = list.filter(t => t.businessType === filters.value.businessType)
  }

  return list
})

const paginatedTenants = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredTenants.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(filteredTenants.value.length / pageSize))

const availableFloors = computed(() => {
  const set = new Set()
  tenants.value.forEach(t => t.flats?.forEach(fl => {
    if (fl.floorNumber !== null && fl.floorNumber !== undefined) set.add(fl.floorNumber)
  }))
  return Array.from(set).sort((a, b) => a - b)
})

// Methods
const fetchTenants = async () => {
  loading.value = true
  try {
    const response = await tenantsService.getTenants({
      isActive: filters.value.isActive !== '' ? filters.value.isActive : undefined,
      searchTerm: filters.value.searchTerm || undefined,
      // Server tarafında 'floor' bekleniyor (controller FromQuery floor -> FloorNumber mapliyor)
      floor: filters.value.floorNumber !== '' ? filters.value.floorNumber : undefined
    })
    tenants.value = response
  } catch (err) {
    console.error('Kiracılar yüklenirken hata:', err)
    errorHandler.logError(err, { component: 'Tenants', action: 'fetch' })
  } finally {
    loading.value = false
  }
}

const leaseableFlats = computed(() =>
  flats.value.filter(f => f.isActive && !f.isOccupied) // tip filtresi YOK
)

const leaseableIdSet = computed(() =>
  new Set(leaseableFlats.value.map(f => f.id))
)

const handleSearch = () => { currentPage.value = 1 }
const clearFilters = () => {
  filters.value = { searchTerm: '', isActive: '', floorNumber: '', businessType: '' }
  currentPage.value = 1
}

const handleCreateTenant = async (data) => {
  try {
    await tenantsService.createTenant(data)
    errorHandler.logSuccess('success', 'Kiracı başarıyla eklendi', { component: 'Tenants', action: 'create' })
    showCreateModal.value = false
    await fetchTenants()
  } catch (err) {
    // Sunucu mesajını yakala
    const serverText = err?.serverMessage || err?.message || ''
    const isActiveExists = /aktif.*kiracı.*var/i.test(serverText)
    const selectedIds = (data.flatIds && data.flatIds.length) ? data.flatIds
                       : (data.flatId ? [data.flatId] : [])

    if (isActiveExists && selectedIds.length) {
      try {
        // Aynı kimlik no ile mevcut aktif kiracıyı bul
        const candidates = await tenantsService.getTenants({
          searchTerm: data.identityNumber,
          isActive: true
        })
        const existing = Array.isArray(candidates) ? candidates[0] : null

        if (existing) {
          const ok = window.confirm(
            `Bu kimlik numarasıyla zaten aktif bir kiracı var: "${existing.companyName}". ` +
            `Seçili ${selectedIds.length} üniteyi bu kiracıya bağlayalım mı?`
          )
          if (ok) {
            // BE hazır olduğunda çalışır
            await tenantsService.assignFlats(existing.id, {
              flatIds: selectedIds,
              contractStartDate: data.contractStartDate || null
            })
            errorHandler.logSuccess('success', 'Üniteler mevcut kiracıya atandı.', { component: 'Tenants', action: 'assign-flats' })
            showCreateModal.value = false
            await fetchTenants()
            return
          }
        }
      } catch (e) {
        console.warn('Mevcut kiracıya atama akışı başarısız:', e)
      }
    }

    console.error('Kiracı eklenirken hata:', err)
    errorHandler.logError(err, { component: 'Tenants', action: 'create' })
  }
}

const handleUpdateTenant = async (data) => {
  try {
    await tenantsService.updateTenant(editingTenant.value.id, data)
    errorHandler.logSuccess('success', 'Kiracı başarıyla güncellendi', { component: 'Tenants', action: 'update' })
    closeEditModal()
    await fetchTenants()
  } catch (err) {
    console.error('Kiracı güncellenirken hata:', err)
    errorHandler.logError(err, { component: 'Tenants', action: 'update' })
  }
}

const editTenant = (t) => { editingTenant.value = t; showEditModal.value = true }
const closeEditModal = () => { editingTenant.value = null; showEditModal.value = false }
const viewTenant = (t) => { router.push(`/tenants/${t.id}`) }

// Silme onayı
const confirmDelete = async () => {
  if (!tenantToDelete.value) return
  deleteLoading.value = true
  try {
    await tenantsService.deleteTenant(tenantToDelete.value.id)
    // Not: BE tarafında DeleteTenant kiracının bağlı olduğu ünitede IsOccupied=false ve TenantId=null yapmalı.
    // FE’den ayrıca /flats PUT ile boşaltma göndermiyoruz (UpdateFlat tam DTO ister, kısmi patch değil).
    errorHandler.logSuccess('success', 'Kiracı silindi', { component: 'Tenants', action: 'delete' })
    emitEvent('tenant:deleted')
    await fetchTenants()
  } catch (err) {
    console.error('Kiracı silme hatası:', err)
    errorHandler.logError(err, { component: 'Tenants', action: 'delete' })
  } finally {
    deleteLoading.value = false
    closeDeleteModal()
  }
}

// Utils
const formatDate = (d) => d ? new Date(d).toLocaleDateString('tr-TR') : '-'
const getAvatarColor = (name) => {
  const colors = ['bg-red-500','bg-blue-500','bg-green-500','bg-yellow-500','bg-purple-500']
  const hash = String(name || '').split('').reduce((a,c)=>a+c.charCodeAt(0),0)
  return colors[hash % colors.length]
}
const getAvatarInitial = (companyName) => (companyName ? companyName.substring(0,3).toUpperCase() : '?')

// Lifecycle
onMounted(fetchTenants)
watch(filters, handleSearch, { deep: true })
</script>
