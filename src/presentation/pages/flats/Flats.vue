<template>
  <div class="p-4 sm:p-6 min-h-screen pb-24 md:pb-6">

    <!-- Sayfa Başlığı -->
    <PageHeader title="Ünite Yönetimi" subtitle="İş hanındaki tüm üniteleri yönetin">
      <template #icon>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
      </template>
      <template #actions>
        <button
          v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER"
          @click="showCreateModal = true"
          class="btn btn-sm btn-primary shrink-0"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Yeni Ünite
        </button>
      </template>
    </PageHeader>

    <!-- Filtreler -->
    <div class="app-card mb-6">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <label class="text-[10px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-widest mb-1.5 block px-1">Arama</label>
          <input
            v-model="filters.searchTerm"
            @input="handleSearch"
            class="input input-bordered input-sm w-full font-bold text-xs"
            placeholder="Kod veya kat..."
          />
        </div>
        <div>
          <label class="text-[10px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-widest mb-1.5 block px-1">Tip</label>
          <select v-model="filters.type" @change="handleSearch" class="select select-bordered select-sm w-full font-bold text-xs">
            <option value="null">Tümü</option>
            <option v-for="t in UNIT_TYPES" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </div>
        <div>
          <label class="text-[10px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-widest mb-1.5 block px-1">Durum</label>
          <select v-model="filters.isActive" @change="handleSearch" class="select select-bordered select-sm w-full font-bold text-xs">
            <option value="null">Tümü</option>
            <option value="true">Aktif</option>
            <option value="false">Pasif</option>
          </select>
        </div>
        <div>
          <label class="text-[10px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-widest mb-1.5 block px-1">Doluluk</label>
          <select v-model="filters.isOccupied" @change="handleSearch" class="select select-bordered select-sm w-full font-bold text-xs">
            <option value="null">Tümü</option>
            <option value="true">Dolu</option>
            <option value="false">Boş</option>
          </select>
        </div>
        <div>
          <label class="text-[10px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-widest mb-1.5 block px-1">Kat No</label>
          <input
            v-model.number="filters.floorNumber"
            @input="handleSearch"
            type="number"
            class="input input-bordered input-sm w-full font-bold text-xs"
            placeholder="Örn: 3"
          />
        </div>
      </div>
      <div class="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-white/[0.04]">
        <button @click="clearFilters" class="btn btn-ghost btn-xs text-slate-400 font-bold uppercase tracking-wider gap-2">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Temizle
        </button>
        <span class="text-[11px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-widest">{{ filteredFlats.length }} ünite listeleniyor</span>
      </div>
    </div>

    <!-- Ünite Kartları -->
    <div v-if="filteredFlats.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="flat in paginatedFlats"
        :key="flat.id"
        class="group app-card relative flex flex-col gap-4 hover:shadow-2xl hover:shadow-brand-500/5 transition-all duration-500"
      >
        <!-- Ünite Kodu (Badge) -->
        <div class="flex items-start justify-between gap-4">
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white shrink-0 shadow-lg shadow-current/20 transition-transform group-hover:scale-110"
            :class="getFlatStatusColor(flat)"
          >
            {{ flat.code }}
          </div>
          <div class="min-w-0 flex-1 pt-1">
            <p class="text-[17px] font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight group-hover:text-brand-500 transition-colors">
              {{ flat.code }}
            </p>
            <div class="flex flex-wrap gap-1.5 mt-2">
              <span class="bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-[#9aa0b4] px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider tabular-nums">{{ floorLabel(flat) }}</span>
              <span class="bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">{{ typeLabel(flat.type) }}</span>
            </div>
          </div>
        </div>

        <!-- Durum Pills -->
        <div class="flex items-center gap-2">
          <span :class="[
            'px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest',
            flat.isActive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
            : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
          ]">
            {{ flat.isActive ? 'Aktif' : 'Pasif' }}
          </span>
          <span :class="[
            'px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest',
            flat.isOccupied ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' 
            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
          ]">
            {{ flat.isOccupied ? 'Dolu' : 'Boş' }}
          </span>
        </div>

        <!-- Detaylar -->
        <div class="space-y-2 pt-4 border-t border-slate-100 dark:border-white/[0.04]">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-widest">Alan</span>
            <span class="text-xs font-black text-slate-700 dark:text-white tabular-nums tracking-tight">{{ flat.unitArea }} m²</span>
          </div>
          <div v-if="flat.monthlyRent && flat.monthlyRent > 0" class="flex justify-between items-center">
            <span class="text-[10px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-widest">Aylık Kira</span>
            <span class="text-xs font-black text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">{{ formatCurrency(flat.monthlyRent) }}</span>
          </div>
          <p v-if="flat.description" class="text-[10px] font-medium italic text-slate-400 dark:text-[#626885] pt-1 border-t border-dashed border-slate-100 dark:border-white/[0.04] mt-1">{{ flat.description }}</p>
        </div>

        <!-- İşlem Menüsü -->
        <div class="absolute top-4 right-4">
          <div class="dropdown dropdown-end">
            <button tabindex="0" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/>
              </svg>
            </button>
            <ul tabindex="0" class="dropdown-content menu p-1.5 shadow-xl bg-white dark:bg-[#0f1322] border border-slate-200 dark:border-white/[0.07] rounded-xl w-40 z-10 text-xs">
              <li v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER">
                <a @click="editFlat(flat)" class="rounded-lg">Düzenle</a>
              </li>
              <li v-if="authStore.role === ROLES.ADMIN">
                <a v-if="canDelete(flat)" @click="deleteFlat(flat)" class="rounded-lg text-error">Sil</a>
                <a v-else class="rounded-lg opacity-40 pointer-events-none text-error">Sil (Dolu)</a>
              </li>
              <li v-if="(authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER) && flat.type === 2">
                <a @click="deactivateFlat(flat)" class="rounded-lg">Pasifleştir</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Boş Durum -->
    <div v-else class="app-card">
      <EmptyState title="Ünite bulunamadı" description="Arama kriterlerinize uygun ünite bulunmamaktadır." />
    </div>

    <!-- Sayfalama -->
    <div class="mt-4">
      <PaginationBar
        v-model:currentPage="currentPage"
        :total-count="filteredFlats.length"
        :page-size="pageSize"
        :page-size-options="[]"
      />
    </div>

    <!-- Modals -->
    <FlatCreateModal :visible="showCreateModal" @save="handleCreateFlat" @close="showCreateModal = false" />
    <FlatEditModal v-if="editingFlat" :visible="showEditModal" :flat="editingFlat" @save="handleUpdateFlat" @close="closeEditModal" />
    <ConfirmModal :isOpen="showDeleteModal" title="Ünite Silinecek" :message="`'${flatToDelete?.code}' ünitesini silmek istediğinizden emin misiniz?`" confirmLabel="Evet, Sil" confirmClass="btn-error" :loading="deleting" @confirm="handleConfirmDelete" @cancel="closeDeleteModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ROLES } from '@/core/constants/roles'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import { useAuthStore } from '@/application/stores/auth'
import FlatEditModal from './components/FlatEditModal.vue'
import FlatCreateModal from './components/FlatCreateModal.vue'
import flatsService from '@/infrastructure/services/flatsService'
import { errorHandler } from '@/core/utils/errorHandler'
import ConfirmModal from '@/presentation/components/common/ConfirmModal.vue'
import PaginationBar from '@/presentation/components/common/PaginationBar.vue'
import EmptyState from '@/presentation/components/ui/EmptyState.vue'

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

const showDeleteModal = ref(false)
const flatToDelete = ref(null)
const deleting = ref(false)

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


const deleteFlat = (flat) => {
  flatToDelete.value = flat
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  flatToDelete.value = null
  showDeleteModal.value = false
  deleting.value = false
}

const handleConfirmDelete = async () => {
  if (!flatToDelete.value) return
  deleting.value = true
  try {
    await flatsService.deleteFlat(flatToDelete.value.id)
    errorHandler.logSuccess('success', 'Ünite başarıyla silindi.', { component:'UnitsPage', action:'delete' })
    await fetchFlats()
    closeDeleteModal()
  } catch (error) {
    console.error('Ünite silinirken hata:', error)
    errorHandler.logError(error, { component:'UnitsPage', action:'delete' })
    deleting.value = false
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