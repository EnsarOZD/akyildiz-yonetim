<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-3">
            <span class="text-3xl sm:text-4xl">🏢</span>
            İş Hanı Kiracıları
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-sm sm:text-base">İş hanındaki tüm kiracıları yönetin</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button v-if="authStore.role === ROLES.ADMIN" @click="handleSyncBalances" :disabled="syncLoading" class="btn btn-outline btn-primary btn-sm sm:btn-md shadow-lg transition-all flex-1 sm:flex-none">
            <span v-if="syncLoading" class="loading loading-spinner loading-xs"></span>
            <svg v-else class="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span class="text-[10px] sm:text-sm">Senkronize Et</span>
          </button>
          <button v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" @click="showCreateModal = true" class="btn btn-success btn-sm sm:btn-md bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 text-white shadow-lg transition-all flex-1 sm:flex-none">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <span class="text-[10px] sm:text-sm">Yeni Ekle</span>
          </button>
        </div>
      </div>
    </div>
    <!-- Stats Widgets -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card bg-white dark:bg-gray-800 shadow-xl border-l-4 border-primary">
        <div class="card-body p-6 flex-row items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl">👤</div>
          <div>
            <div class="text-sm font-semibold text-gray-500">Aktif Kiracılar</div>
            <div class="text-2xl font-bold">{{ stats.activeCount }}</div>
          </div>
        </div>
      </div>
      <div class="card bg-white dark:bg-gray-800 shadow-xl border-l-4 border-success">
        <div class="card-body p-6 flex-row items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success text-2xl">📊</div>
          <div>
            <div class="text-sm font-semibold text-gray-500">Doluluk Oranı</div>
            <div class="text-2xl font-bold">%{{ stats.occupancyRate }}</div>
          </div>
        </div>
      </div>
      <div class="card bg-white dark:bg-gray-800 shadow-xl border-l-4 border-error">
        <div class="card-body p-6 flex-row items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error text-2xl">💰</div>
          <div>
            <div class="text-sm font-semibold text-gray-500">Toplam Bakiye</div>
            <div class="text-2xl font-bold">{{ formatCurrency(stats.totalDebt) }}</div>
          </div>
        </div>
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
        <div v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" class="absolute top-4 right-4 z-10">
          <div class="dropdown dropdown-end">
            <button tabindex="0" class="btn btn-ghost btn-circle btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></svg>
            </button>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-40 z-10">
              <li><a @click="viewTenant(tenant)">Detayları Gör</a></li>
              <li><a @click="editTenant(tenant)">Düzenle</a></li>
              <li v-if="authStore.role === ROLES.ADMIN"><a @click="openDeleteModal(tenant)" class="text-error">Sil</a></li>
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

        
        <!-- Bakiye Bilgisi -->
        <div class="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Güncel Bakiye</span>
            <span :class="['text-sm font-bold', tenant.totalBalance > 0 ? 'text-error' : 'text-success']">
              {{ formatCurrency(tenant.totalBalance) }}
            </span>
          </div>
        </div>

        <!-- Hızlı Aksiyonlar -->
        <div class="mt-auto pt-4 flex gap-2">
          <button @click="viewTenant(tenant)" class="btn btn-sm btn-outline flex-1 normal-case">Detay</button>
          <a :href="`https://wa.me/${tenant.contactPersonPhone?.replace(/\D/g,'')}`" target="_blank" class="btn btn-sm btn-ghost btn-circle text-success" title="WhatsApp">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.628 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          <button v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" @click="router.push(`/payments?tenantId=${tenant.id}`)" class="btn btn-sm btn-ghost btn-circle text-primary" title="Ödeme Al">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          </button>
        </div>
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
import { ROLES } from '@/constants/roles'
import { useAuthStore } from '@/stores/auth'
import tenantsService from '@/features/tenants/services/tenantsService'
import TenantEditModal from './components/TenantEditModal.vue'
import TenantCreateModal from './components/TenantCreateModal.vue'
import { useTenantsStore } from '@/stores/tenants.js'
import { errorHandler } from '@/utils/errorHandler'
import ConfirmDeleteModal from './components/ConfirmDeleteModal.vue'
import { useEventBus } from '@/composables/useEventBus'
import { safeFormatDate as formatDate } from '@/utils/dateUtils'
import { getAvatarColor, getAvatarInitial } from '@/utils/uiHelpers'

const router = useRouter()
const authStore = useAuthStore()
const { emit: emitEvent } = useEventBus()
const tenantsStore = useTenantsStore()

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
const loading = computed(() => tenantsStore.loading)
const tenants = computed(() => tenantsStore.tenants)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTenant = ref(null)
const currentPage = ref(1)
const pageSize = 10
const syncLoading = ref(false)

// Filters
const filters = ref({
  searchTerm: '',
  isActive: '',
  floorNumber: '',
  businessType: '' // client-side filter
})

// Stats
const stats = computed(() => tenantsStore.stats)

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

const formatCurrency = (amount) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })
    .format(Number(amount || 0))

// Methods
const fetchTenants = async () => {
  try {
    // Pinia store üzerinden çekiyoruz
    await tenantsStore.fetchTenants()
  } catch (err) {
    console.error('Kiracılar yüklenirken hata:', err)
  }
}

const handleSyncBalances = async () => {
  if (!confirm('Tüm kiracıların avans bakiyeleri geçmiş işlem verilerine göre yeniden hesaplanacak ve eşitlenecektir. Devam etmek istiyor musunuz?')) return
  
  syncLoading.value = true
  try {
    const response = await tenantsService.syncAdvanceBalances()
    errorHandler.logSuccess('success', `Senkronizasyon tamamlandı. ${response.updatedAccountsCount} hesap güncellendi.`, { component: 'Tenants', action: 'sync-balances' })
    await fetchTenants()
  } catch (err) {
    console.error('Senkronizasyon hatası:', err)
    errorHandler.logError(err, { component: 'Tenants', action: 'sync-balances' })
  } finally {
    syncLoading.value = false
  }
}

const handleSearch = () => { currentPage.value = 1 }
const clearFilters = () => {
  filters.value = { searchTerm: '', isActive: '', floorNumber: '', businessType: '' }
  currentPage.value = 1
}

const handleCreateTenant = async (data) => {
  try {
    await tenantsStore.createTenant(data)
    errorHandler.logSuccess('success', 'Kiracı başarıyla eklendi', { component: 'Tenants', action: 'create' })
    showCreateModal.value = false
  } catch (err) {
    // Sunucu mesajını yakala
    const serverText = err?.serverMessage || err?.message || ''
    const isActiveExists = /aktif.*kiracı.*var/i.test(serverText)
    const selectedIds = (data.flatIds && data.flatIds.length) ? data.flatIds
                       : (data.flatId ? [data.flatId] : [])

    if (isActiveExists && selectedIds.length) {
      try {
        // Aynı kimlik no ile mevcut aktif kiracıyı bul
        const candidates = tenants.value.filter(t => t.identityNumber === data.identityNumber && t.isActive)
        const existing = candidates[0]

        if (existing) {
          const ok = window.confirm(
            `Bu kimlik numarasıyla zaten aktif bir kiracı var: "${existing.companyName}". ` +
            `Seçili ${selectedIds.length} üniteyi bu kiracıya bağlayalım mı?`
          )
          if (ok) {
            // BE hazır olduğunda çalışır
            await tenantsStore.updateTenant(existing.id, {
              ...existing,
              flatIds: [...(existing.flatIds || []), ...selectedIds]
            })
            errorHandler.logSuccess('success', 'Üniteler mevcut kiracıya atandı.', { component: 'Tenants', action: 'assign-flats' })
            showCreateModal.value = false
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
    await tenantsStore.updateTenant(editingTenant.value.id, data)
    errorHandler.logSuccess('success', 'Kiracı başarıyla güncellendi', { component: 'Tenants', action: 'update' })
    closeEditModal()
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
    await tenantsStore.deleteTenant(tenantToDelete.value.id)
    errorHandler.logSuccess('success', 'Kiracı silindi', { component: 'Tenants', action: 'delete' })
    emitEvent('tenant:deleted')
  } catch (err) {
    console.error('Kiracı silme hatası:', err)
    errorHandler.logError(err, { component: 'Tenants', action: 'delete' })
  } finally {
    deleteLoading.value = false
    closeDeleteModal()
  }
}

// Lifecycle
onMounted(fetchTenants)
watch(filters, handleSearch, { deep: true })
</script>
