<template>
  <div class="p-4 sm:p-6 min-h-screen pb-24 md:pb-6">

    <!-- Sayfa Başlığı -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="page-title">Mal Sahipleri</h1>
        <p class="page-subtitle">{{ totalOwnersCount }} mal sahibi kayıtlı</p>
      </div>
      <button
        v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER"
        @click="createModalVisible = true"
        class="btn btn-sm btn-primary shrink-0"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        Yeni Mal Sahibi
      </button>
    </div>

    <!-- İstatistik Kartları -->
    <div class="grid grid-cols-3 gap-3 sm:gap-4 mb-5">
      <div class="app-card flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center shrink-0">
          <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">Mal Sahibi</p>
          <p class="text-xl font-bold text-slate-800 dark:text-white tabular-nums">{{ totalOwnersCount }}</p>
        </div>
      </div>
      <div class="app-card flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center shrink-0">
          <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">Sahip Ünite</p>
          <p class="text-xl font-bold text-slate-800 dark:text-white tabular-nums">{{ totalOwnedUnitsCount }}</p>
        </div>
      </div>
      <div class="app-card flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center shrink-0">
          <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">Boş Ünite</p>
          <p class="text-xl font-bold text-slate-800 dark:text-white tabular-nums">{{ vacantUnitsCount }}</p>
        </div>
      </div>
    </div>

    <!-- Arama + Liste -->
    <div class="app-card !p-0 overflow-hidden">
      <!-- Arama -->
      <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-700/60">
        <FilterBar
          :search="search"
          @update:search="val => search = val"
          search-placeholder="Mal sahibi adı veya kat ara..."
          @clear-filters="handleClearFilters"
        />
      </div>

      <!-- Tablo Başlıkları -->
      <div v-if="filteredOwnersWithUnits.length > 0" class="hidden sm:grid grid-cols-12 gap-4 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700/60">
        <div class="col-span-5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Mal Sahibi</div>
        <div class="col-span-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Üniteler</div>
        <div v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" class="col-span-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-right">İşlemler</div>
      </div>

      <!-- Boş Durum -->
      <EmptyState v-if="filteredOwnersWithUnits.length === 0" title="Mal sahibi bulunamadı" />

      <!-- Liste -->
      <div v-else class="divide-y divide-slate-100 dark:divide-slate-700/60">
        <div
          v-for="owner in filteredOwnersWithUnits"
          :key="owner.id"
          class="table-row-hover grid grid-cols-12 gap-4 items-center px-4 py-3"
        >
          <!-- Ad + E-posta -->
          <div class="col-span-12 sm:col-span-5 flex items-center gap-3">
            <div class="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white" :class="getAvatarColor(owner.name)">
              {{ getAvatarInitial(owner.name) }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{{ owner.name }}</p>
              <p class="text-xs text-slate-400 dark:text-slate-500 truncate">{{ owner.email }}</p>
            </div>
          </div>

          <!-- Üniteler -->
          <div class="col-span-12 sm:col-span-4">
            <div v-if="owner.allUnits && owner.allUnits.length > 0" class="flex flex-wrap gap-1">
              <span
                v-for="unit in owner.allUnits"
                :key="unit"
                :class="[
                  'px-1.5 py-0.5 rounded text-[10px] font-semibold',
                  owner.vacantUnits.includes(unit)
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700/60 dark:text-slate-400'
                ]"
              >
                {{ unit }}
              </span>
            </div>
            <span v-else class="text-xs text-slate-400 dark:text-slate-500">—</span>
          </div>

          <!-- İşlemler -->
          <div v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" class="col-span-12 sm:col-span-3 flex justify-end">
            <div class="dropdown dropdown-end">
              <button tabindex="0" class="btn btn-ghost btn-xs btn-square text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/>
                </svg>
              </button>
              <ul tabindex="0" class="dropdown-content menu p-1.5 shadow-card bg-base-100 border border-slate-200 dark:border-slate-700 rounded-xl w-36 z-10 text-xs">
                <li><a @click="startEdit(owner)" class="rounded-lg">Düzenle</a></li>
                <li><a @click="askDelete(owner)" class="rounded-lg text-error">Sil</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modallar -->
    <OwnerCreateModal :visible="createModalVisible" :available-units="availableUnitsForCreation" @save="saveOwner" @close="createModalVisible = false" />
    <ConfirmModal :isOpen="deleteModalVisible" title="Mal Sahibi Silinecek" :message="`'${ownerToDelete?.name}' mal sahibini silmek istediğinizden emin misiniz?`" confirmLabel="Evet, Sil" confirmClass="btn-error" :loading="deleting" @confirm="confirmDelete" @cancel="deleteModalVisible = false" />
    <OwnerEditModal :visible="editModalVisible" :initial-data="selectedOwner" :available-units="availableUnitsForCreation" @save="updateOwner" @close="editModalVisible = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ROLES } from '@/constants/roles'
import ownersService from '@/services/ownersService'
import tenantsService from '@/services/tenantsService'
import { useErrorHandler } from '@/composables/useErrorHandler'
import ConfirmModal from '@/components/common/ConfirmModal.vue';
import FilterBar from '@/components/common/FilterBar.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import OwnerCreateModal from './components/OwnerCreateModal.vue';
import OwnerEditModal from './components/OwnerEditModal.vue';
import { useNotification } from '@/composables/useNotification';
import { UNIT_OPTIONS } from '@/constants/units';

const { handleNetworkError, handleValidationError, showSuccess } = useErrorHandler()
const { showCreateSuccess, showUpdateSuccess, showDeleteSuccess } = useNotification();
const authStore = useAuthStore()

const owners = ref([]);
const tenants = ref([]);
const selectedOwner = ref(null);
const editModalVisible = ref(false);
const createModalVisible = ref(false);
const deleteModalVisible = ref(false);
const ownerToDelete = ref(null);
const deleting = ref(false);
const search = ref('');

const fetchOwners = async () => {
  try {
    owners.value = await ownersService.getOwners();
    tenants.value = await tenantsService.getTenants();
  } catch (error) {
    handleNetworkError(error, { component: 'Owners', action: 'fetchOwners' });
  }
};

onMounted(() => {
  fetchOwners();
});

// --- Computed Properties for Summary Cards ---
const totalOwnersCount = computed(() => owners.value.length);

const allOwnedUnits = computed(() => owners.value.flatMap(owner => owner.flats || []));

const totalOwnedUnitsCount = computed(() => {
  const units = allOwnedUnits.value;
  return new Set(units.map(u => typeof u === 'object' ? u.id : u)).size;
});

const occupiedUnits = computed(() => {
  const units = new Set();
  tenants.value.forEach(tenant => {
    if (tenant.isActive && tenant.flats) {
      tenant.flats.forEach(flat => {
        const flatId = typeof flat === 'object' && flat.id ? flat.id : flat;
        units.add(flatId);
      });
    }
  });
  return units;
});

const vacantUnitsCount = computed(() => {
  const allOwnedUnitsSet = new Set(allOwnedUnits.value.map(u => typeof u === 'object' ? u.id : u));
  return [...allOwnedUnitsSet].filter(unit => !occupiedUnits.value.has(unit)).length;
});

// --- Computed Properties for Filtering and Display ---
const filteredOwners = computed(() => {
  const searchTerm = search.value?.toLowerCase() || '';
  
  return owners.value.map(o => ({
    ...o,
    name: `${o.firstName} ${o.lastName}`.trim() || o.email || 'İsimsiz Mal Sahibi'
  })).filter(owner => {
    if (!searchTerm) return true;
    
    const nameMatch = owner.name.toLowerCase().includes(searchTerm);
    const emailMatch = owner.email && owner.email.toLowerCase().includes(searchTerm);
    const flatMatch = owner.flats && owner.flats.some(f => {
      const flatCode = typeof f === 'object' ? f.code : f;
      return String(flatCode).toLowerCase().includes(searchTerm);
    });
    
    return nameMatch || emailMatch || flatMatch;
  });
});

const filteredOwnersWithUnits = computed(() => {
  return filteredOwners.value.map(owner => {
    const flats = owner.flats || [];
    // Kat nesne ise code'u, değilse kendisini al
    const flatCodes = flats.map(f => typeof f === 'object' ? f.code : f);
    const flatIds = flats.map(f => typeof f === 'object' ? f.id : f);
    
    const vacantUnits = flatCodes.filter((code, index) => !occupiedUnits.value.has(flatIds[index]));
    
    return {
      ...owner,
      allUnits: flatCodes,
      vacantUnits: vacantUnits
    };
  });
});

const availableUnitsForCreation = computed(() => {
  const assignedUnits = new Set(allOwnedUnits.value);
  return UNIT_OPTIONS.filter(unit => !assignedUnits.has(unit));
});

// --- Methods ---
const handleClearFilters = () => {
  search.value = '';
};

const getAvatarInitial = (name) => {
  if (!name || name === 'İsimsiz Mal Sahibi') return '?';
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length > 1) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

const getAvatarColor = (name) => {
  if (!name) return 'bg-gray-500';
  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-emerald-500',
    'bg-red-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};

const askDelete = (owner) => {
  ownerToDelete.value = owner;
  deleteModalVisible.value = true;
};

const confirmDelete = async () => {
  try {
    deleting.value = true;
    await ownersService.deleteOwner(ownerToDelete.value.id);
    showDeleteSuccess('Mal Sahibi');
    deleteModalVisible.value = false;
    await fetchOwners();
  } catch (error) {
    handleValidationError(error, { component: 'Owners', action: 'deleteOwner' });
  } finally {
    deleting.value = false;
  }
};

const saveOwner = async (owner) => {
  try {
    await ownersService.createOwner(owner);
    showCreateSuccess('Mal Sahibi');
    createModalVisible.value = false;
    await fetchOwners();
  } catch (error) {
    handleValidationError(error, { component: 'Owners', action: 'saveOwner' });
  }
};

const updateOwner = async (owner) => {
  try {
    await ownersService.updateOwner(owner.id, owner);
    showUpdateSuccess('Mal Sahibi');
    editModalVisible.value = false;
    await fetchOwners();
  } catch (error) {
    handleValidationError(error, { component: 'Owners', action: 'updateOwner' });
  }
};

const startEdit = (owner) => {
  selectedOwner.value = { ...owner };
  editModalVisible.value = true;
};
</script> 