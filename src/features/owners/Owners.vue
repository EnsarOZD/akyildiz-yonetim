<template>
  <!-- Ana Sayfa Konteyneri -->
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">

      <!-- Başlık -->
      <h1 class="text-3xl font-bold text-gray-800 mb-6 dark:text-gray-100">Mal Sahipleri</h1>

      <!-- Özet Bilgi Kartları -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Toplam Mal Sahibi Kartı -->
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
          <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Toplam Mal Sahibi</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ totalOwnersCount }}</p>
          </div>
        </div>
        <!-- Toplam Kat Sayısı Kartı -->
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
          <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full p-3">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Sahip Olunan Toplam Kat</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ totalOwnedUnitsCount }}</p>
          </div>
        </div>
        <!-- Boş Kat Sayısı Kartı -->
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
          <div class="bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Boşta Olan Kat</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ vacantUnitsCount }}</p>
          </div>
        </div>
        <!-- Yeni Mal Sahibi Ekle Butonu -->
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-300" @click="createModalVisible = true">
           <button class="w-full h-full text-blue-500 dark:text-blue-400 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            <span class="font-semibold">Yeni Mal Sahibi Ekle</span>
          </button>
        </div>
      </section>

      <!-- Filtreler ve Liste Alanı -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <FilterBar
            :search="search"
            @update:search="val => search = val"
            search-placeholder="Mal sahibi adı veya kat ara..."
            @clear-filters="handleClearFilters"
        />
        
        <!-- Mal Sahibi Kart Listesi -->
        <div class="mt-6 space-y-2">
          <div v-if="filteredOwnersWithVacantUnits.length === 0" class="text-center py-12 text-gray-500">
            <p>Boşta katı olan mal sahibi bulunamadı.</p>
          </div>
          <div v-else>
            <!-- Liste Başlıkları (Sadece büyük ekranlar için) -->
            <div class="hidden sm:grid grid-cols-12 gap-4 px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <div class="col-span-5">Mal Sahibi</div>
              <div class="col-span-4">Sahip Olduğu Boş Katlar</div>
              <div class="col-span-3 text-center">İşlemler</div>
            </div>
            <!-- Mal Sahibi Kartı Döngüsü -->
            <div 
              v-for="owner in filteredOwnersWithVacantUnits" 
              :key="owner.id" 
              class="grid grid-cols-12 gap-4 items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b dark:border-gray-700/50"
            >
              <div class="col-span-12 sm:col-span-5 flex items-center gap-4">
                <div class="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-500 text-white rounded-full text-xl font-bold" :class="getAvatarColor(owner.name)">
                  {{ getAvatarInitial(owner.name) }}
                </div>
                <div>
                  <p class="font-bold text-gray-800 dark:text-gray-100">{{ owner.name }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ owner.email }}</p>
                </div>
              </div>
              <div class="col-span-12 sm:col-span-4 text-sm text-gray-600 dark:text-gray-300">
                <span class="sm:hidden font-semibold text-gray-500">Boş Katlar: </span>
                <span v-if="owner.vacantUnits.length > 0" class="font-semibold text-gray-800 dark:text-gray-100">
                  {{ owner.vacantUnits.join(', ') }}
                </span>
              </div>
              <div class="col-span-12 sm:col-span-3 flex justify-end items-center">
                <div class="dropdown dropdown-end">
                  <label tabindex="0" class="btn btn-ghost btn-sm m-1">İşlemler</label>
                  <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a @click="startEdit(owner)">Düzenle</a></li>
                    <li><a @click="askDelete(owner)" class="text-red-500">Sil</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modallar -->
    <OwnerCreateModal
      :visible="createModalVisible"
      :available-units="availableUnitsForCreation"
      @save="saveOwner"
      @close="createModalVisible = false"
    />
    <ConfirmDeleteModal
      :visible="deleteModalVisible"
      :item-name="ownerToDelete ? ownerToDelete.name : ''"
      item-type="mal sahibini"
      @confirm="confirmDelete"
      @cancel="deleteModalVisible = false"
    />
     <!-- Edit Modal will be needed here -->
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ownersService from '@/services/ownersService'
import tenantsService from '@/services/tenantsService'
import { useErrorHandler } from '@/composables/useErrorHandler'
import ConfirmDeleteModal from '../tenants/components/ConfirmDeleteModal.vue';
import FilterBar from '@/components/common/FilterBar.vue';
import OwnerCreateModal from './components/OwnerCreateModal.vue';
import { useNotification } from '@/composables/useNotification';

const { handleNetworkError, handleValidationError, showSuccess } = useErrorHandler()
const { showCreateSuccess, showUpdateSuccess, showDeleteSuccess } = useNotification();

const owners = ref([]);
const tenants = ref([]);
const selectedOwner = ref(null);
const editModalVisible = ref(false);
const createModalVisible = ref(false);
const deleteModalVisible = ref(false);
const ownerToDelete = ref(null);
const search = ref('');

onMounted(() => {
  try {
    owners.value = ownersService.getAllOwners();
    tenants.value = tenantsService.getAllTenants();
  } catch (error) {
    handleNetworkError(error, { component: 'Owners', action: 'fetchOwners' });
  }
});

// --- Computed Properties for Summary Cards ---
const totalOwnersCount = computed(() => owners.value.length);

const allOwnedUnits = computed(() => owners.value.flatMap(owner => owner.units || []));

const totalOwnedUnitsCount = computed(() => new Set(allOwnedUnits.value).size);

const occupiedUnits = computed(() => {
  const units = new Set();
  tenants.value.forEach(tenant => {
    if (tenant.isActive && tenant.units) {
      tenant.units.forEach(unit => {
        const unitId = typeof unit === 'object' && unit.id ? unit.id : unit;
        units.add(unitId);
      });
    }
  });
  return units;
});

const vacantUnitsCount = computed(() => {
  const allOwnedUnitsSet = new Set(allOwnedUnits.value);
  return [...allOwnedUnitsSet].filter(unit => !occupiedUnits.value.has(unit)).length;
});

// --- Computed Properties for Filtering and Display ---
const filteredOwners = computed(() => {
  if (!search.value) {
    return owners.value;
  }
  const searchTerm = search.value.toLowerCase();
  return owners.value.filter(owner => {
    const nameMatch = owner.name && owner.name.toLowerCase().includes(searchTerm);
    const emailMatch = owner.email && owner.email.toLowerCase().includes(searchTerm);
    const unitMatch = owner.units && owner.units.some(u => String(u).toLowerCase().includes(searchTerm));
    return nameMatch || emailMatch || unitMatch;
  });
});

const filteredOwnersWithVacantUnits = computed(() => {
  return filteredOwners.value
    .map(owner => {
      const vacantUnits = owner.units ? owner.units.filter(unit => !occupiedUnits.value.has(unit)) : [];
      return {
        ...owner,
        vacantUnits
      };
    })
    .filter(owner => owner.vacantUnits.length > 0);
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
  if (!name) return '?';
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
    await ownersService.deleteOwner(ownerToDelete.value.id);
    showDeleteSuccess('Mal Sahibi');
    deleteModalVisible.value = false;
  } catch (error) {
    handleValidationError(error, { component: 'Owners', action: 'deleteOwner' });
  }
};

const saveOwner = async (owner) => {
  try {
    await ownersService.createOwner(owner);
    showCreateSuccess('Mal Sahibi');
    createModalVisible.value = false;
  } catch (error) {
    handleValidationError(error, { component: 'Owners', action: 'saveOwner' });
  }
};

const startEdit = (owner) => {
  selectedOwner.value = { ...owner };
  editModalVisible.value = true;
};
</script> 