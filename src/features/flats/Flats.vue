<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-3">
            <span class="text-4xl">🏢</span>
            Ünite Yönetimi
          </h1>
          <p class="text-gray-600 dark:text-gray-400">İş hanındaki tüm üniteleri yönetin</p>
        </div>
        <button v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" @click="showCreateModal = true" class="btn btn-success bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 text-white shadow-lg">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Yeni Ünite Ekle
        </button>
      </div>
    </div>

    <!-- Filtreler -->
    <div class="card bg-white dark:bg-gray-800 shadow-lg mb-6">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Arama -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Arama</span>
            </label>
            <input v-model="filters.searchTerm" @input="handleSearch" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" placeholder="Kod (3A, GA, OTOPARK) veya kat" />
          </div>

          <!-- Tip -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Tip</span>
            </label>
            <select v-model="filters.type" @change="handleSearch" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400">
              <option value="null">Tümü</option>
              <option v-for="t in UNIT_TYPES" :key="t.value" :value="t.value">{{ t.label }}</option>
            </select>
          </div>

          <!-- Durum Filtresi -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Durum</span>
            </label>
            <select v-model="filters.isActive" @change="handleSearch" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400">
              <option value="null">Tümü</option>
              <option value="true">Aktif</option>
              <option value="false">Pasif</option>
            </select>
          </div>

          <!-- Dolu/Boş Filtresi -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Doluluk</span>
            </label>
            <select v-model="filters.isOccupied" @change="handleSearch" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400">
              <option value="null">Tümü</option>
              <option value="true">Dolu</option>
              <option value="false">Boş</option>
            </select>
          </div>

          <!-- Kat No -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Kat</span>
            </label>
            <input v-model.number="filters.floorNumber" @input="handleSearch" type="number" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" placeholder="Örn: 3" />
          </div>
        </div>

        <!-- Filtre Butonları -->
        <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex gap-2">
            <button @click="clearFilters" class="btn btn-outline btn-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Filtreleri Temizle
            </button>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ filteredFlats.length }} ünite bulundu
          </div>
        </div>
      </div>
    </div>

    <!-- Kartlar -->
    <div v-if="filteredFlats.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="flat in paginatedFlats" :key="flat.id" class="relative group bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl p-6 flex flex-col">
        <!-- İşlem menüsü -->
        <div class="absolute top-4 right-4 z-10">
          <div class="dropdown dropdown-end">
            <button tabindex="0" class="btn btn-ghost btn-circle btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></svg>
            </button>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-40 z-10">
              <li v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER"><a @click="editFlat(flat)">Düzenle</a></li>
              <li v-if="authStore.role === ROLES.ADMIN">
                <a v-if="canDelete(flat)" @click="deleteFlat(flat)" class="text-error">Sil</a>
                <a v-else class="opacity-50 pointer-events-none text-error">Sil (Dolu)</a>
              </li>
              <li v-if="(authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER) && flat.type === 2">
                <a @click="deactivateFlat(flat)">Pasifleştir</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Ünite bilgileri başlık -->
        <div class="flex items-center gap-4 mb-4">
          <div class="flex items-center justify-center rounded-full w-16 h-16 text-2xl font-bold text-white shadow-lg" :class="getFlatStatusColor(flat)">
            {{ flat.code }}
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-lg font-bold text-gray-800 dark:text-gray-100">{{ flat.code }}</span>
              <span class="badge badge-info text-xs">{{ floorLabel(flat) }}</span>
              <span class="badge badge-ghost text-xs">{{ typeLabel(flat.type) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span :class="['badge font-semibold', flat.isActive ? 'badge-success' : 'badge-ghost']">
                {{ flat.isActive ? 'Aktif' : 'Pasif' }}
              </span>
              <span :class="['badge font-semibold', flat.isOccupied ? 'badge-warning' : 'badge-info']">
                {{ flat.isOccupied ? 'Dolu' : 'Boş' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Detay bilgileri -->
        <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div class="flex justify-between">
            <span>Alan:</span>
            <span class="font-semibold">{{ flat.unitArea }} m²</span>
          </div>
          <div v-if="flat.monthlyRent && flat.monthlyRent > 0" class="flex justify-between">
            <span>Aylık Kira:</span>
            <span class="font-semibold text-green-600">{{ formatCurrency(flat.monthlyRent) }}</span>
          </div>
          <div v-if="flat.description" class="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
            {{ flat.description }}
          </div>
        </div>
      </div>
    </div>

    <!-- Boş durum -->
    <div v-else class="text-center py-12">
      <div class="text-gray-500 dark:text-gray-400">
        <svg class="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        <p class="text-lg font-medium">Ünite bulunamadı</p>
        <p class="text-sm">Arama kriterlerinize uygun ünite bulunmamaktadır.</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="card-body border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, filteredFlats.length) }} / {{ filteredFlats.length }} ünite
        </div>
        <div class="join">
          <button @click="currentPage--" :disabled="currentPage === 1" class="join-item btn btn-sm">«</button>
          <button class="join-item btn btn-sm">{{ currentPage }}</button>
          <button @click="currentPage++" :disabled="currentPage >= totalPages" class="join-item btn btn-sm">»</button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <FlatCreateModal 
      :visible="showCreateModal" 
      @save="handleCreateFlat" 
      @close="showCreateModal = false" 
    />
    
    <FlatEditModal 
      v-if="editingFlat"
      :visible="showEditModal" 
      :flat="editingFlat"
      @save="handleUpdateFlat" 
      @close="closeEditModal" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ROLES } from '@/constants/roles'
import { useAuthStore } from '@/stores/auth'
import FlatEditModal from './components/FlatEditModal.vue'
import FlatCreateModal from './components/FlatCreateModal.vue'
import flatsService from '@/features/flats/services/flatsService'
import { errorHandler } from '@/utils/errorHandler'

const canDelete = (flat) => !flat?.isOccupied  

// API ile uyumlu (0:Floor, 1:Entry, 2:Parking)
const UNIT_TYPES = [
  { value: 0, label: 'Kat' },
  { value: 1, label: 'Giriş' },
  { value: 2, label: 'Otopark' }
]

const normalizeFlatPayload = (d) => ({
  ...d,
  type: Number(d.type),
  floorNumber: d.type === 2 ? null : Number(d.floorNumber ?? 0) // otoparkta kat no null olabilir
});

const router = useRouter()
const authStore = useAuthStore()

// State
const flats = ref([])
const loading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingFlat = ref(null)
const currentPage = ref(1)
const pageSize = 10

// Filtreler
const filters = ref({
  searchTerm: '',
  isActive: null,
  isOccupied: null,
  type: null,
  floorNumber: null,
})

// Computed
const filteredFlats = computed(() => {
  let filtered = flats.value

  // Arama
  if (filters.value.searchTerm) {
    const search = String(filters.value.searchTerm).toLowerCase()
    filtered = filtered.filter(flat =>
      String(flat.code ?? '').toLowerCase().includes(search) ||
      String(flat.floorNumber ?? '').toLowerCase().includes(search)
    )
  }

  // Tip
if (filters.value.type !== null) {
  const t = Number(filters.value.type)
  filtered = filtered.filter(f => Number(f.type) === t)
}

  // Aktif / Pasif
  if (filters.value.isActive !== null) {
    filtered = filtered.filter(f => f.isActive === filters.value.isActive)
  }

  // Dolu / Boş
  if (filters.value.isOccupied !== null) {
    filtered = filtered.filter(f => f.isOccupied === filters.value.isOccupied)
  }

  // Kat
  const fn = filters.value.floorNumber
  if (fn !== null && fn !== '' && Number.isFinite(Number(fn))) {
    const n = Number(fn)
    filtered = filtered.filter(f => Number(f.floorNumber) === n)
  }

  return filtered
})

const paginatedFlats = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredFlats.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredFlats.value.length / pageSize))

// Methods
const fetchFlats = async () => {
  loading.value = true
  try {
    const response = await flatsService.getFlats({})
    flats.value = response || []
  } catch (error) {
    console.error('Üniteler yüklenirken hata:', error)
    errorHandler.logError(error, { component:'UnitsPage', action:'fetch' })
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  filters.value = {
    searchTerm: '',
    isActive: null,
    isOccupied: null,
    type: null,
    floorNumber: null
  }
  currentPage.value = 1
}

const handleCreateFlat = async (flatData) => {
  try {
    // Backend 'Description' zorunlu ise boşta kısa not ekle (opsiyonel)
    const payload = { ...flatData }
    if (!payload.description || !payload.description.trim()) {
      payload.description = `UI üzerinden oluşturuldu (${new Date().toLocaleString('tr-TR')})`
    }

    await flatsService.createFlat(normalizeFlatPayload(payload))
    errorHandler.logSuccess('success', 'Ünite başarıyla eklendi.', {
      component:'UnitsPage', action:'create'
    })
    showCreateModal.value = false
    await fetchFlats()
  } catch (error) {
    console.error('Ünite eklenirken hata:', error)
    errorHandler.logError(error, { component:'UnitsPage', action:'create' })
  }
}

const handleUpdateFlat = async (flatData) => {
  try {
    await flatsService.updateFlat(editingFlat.value.id, normalizeFlatPayload({ ...flatData, id: editingFlat.value.id }))
    errorHandler.logSuccess('success', 'Ünite başarıyla güncellendi.', {
      component:'UnitsPage', action:'update'
    })
    closeEditModal()
    await fetchFlats()
  } catch (error) {
    console.error('Ünite güncellenirken hata:', error)
    errorHandler.logError(error, { component:'UnitsPage', action:'update' })
  }
}

const editFlat = (flat) => {
  editingFlat.value = flat
  showEditModal.value = true
}

const closeEditModal = () => {
  editingFlat.value = null
  showEditModal.value = false
}


const deleteFlat = async (flat) => {
  if (!confirm(`${flat.code} ünitesini silmek istediğinizden emin misiniz?`)) return
  try {
    await flatsService.deleteFlat(flat.id)
    errorHandler.logSuccess('success', 'Ünite başarıyla silindi.', { component:'UnitsPage', action:'delete' })
    await fetchFlats()
  } catch (error) {
    console.error('Ünite silinirken hata:', error)
    errorHandler.logError(error, { component:'UnitsPage', action:'delete' })
  }
}


// Otopark için alternatif işlem
 const deactivateFlat = async (flat) => {
   try {
     await flatsService.updateFlat(flat.id, { ...flat, isActive: false })
     errorHandler.logSuccess('success', 'Otopark pasifleştirildi.', {
      component:'UnitsPage', action:'deactivate'
     })
     await fetchFlats()
   } catch (error) {
     console.error('Pasifleştirme hatası:', error)
     errorHandler.logError(error, { component:'UnitsPage', action:'deactivate' })
   }
 }

const formatCurrency = (amount) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)

// 0/1/2 için renk
const getFlatStatusColor = (flat) => {
  if (!flat.isActive) return 'bg-gray-500'
  if (flat.isOccupied) return 'bg-orange-500'
  return 'bg-green-500'
}

// 0/1/2 için kat etiketi
const floorLabel = (flat) => {
  if (flat.type === 2) return 'Otopark'
  if (flat.type === 1) return 'Giriş'
  return `${flat.floorNumber}. Kat`
}

// 0/1/2 → label
const typeLabel = (t) => {
  const map = { 0: 'Kat', 1: 'Giriş', 2: 'Otopark' }
  return map[t] ?? t
}

// Lifecycle
onMounted(fetchFlats)

// Watchers
watch(filters, handleSearch, { deep: true })
</script>