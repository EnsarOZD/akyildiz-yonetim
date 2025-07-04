<template>
  <!-- Ana Sayfa Konteyneri -->
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      
      <!-- Başlık -->
      <h1 class="text-3xl font-bold text-gray-800 mb-6 dark:text-gray-100">Faturalar ve Sayaç Kayıtları</h1>

      <!-- Data Status Indicator -->
      <div v-if="dataStatus.loading" class="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span class="text-blue-700 dark:text-blue-300">Veriler yükleniyor...</span>
        </div>
      </div>

      <div v-if="dataStatus.error" class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-red-700 dark:text-red-300">{{ dataStatus.error }}</span>
        </div>
      </div>

      <div v-if="dataStatus.lastUpdated" class="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="text-green-700 dark:text-green-300">
              Son güncelleme: {{ dataStatus.lastUpdated }}
            </span>
          </div>
          <div class="text-sm text-green-600 dark:text-green-400">
            {{ utilityDebts.length }} kayıt
          </div>
        </div>
      </div>

      <!-- Özet Bilgi ve Aksiyon Kartları -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
          <div class="bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Bu Ayki Fatura Toplamı</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ formatCurrency(thisMonthTotal) }}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
          <div class="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-full p-3">
             <span class="text-2xl">⚡️</span>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Aylık Elektrik Tüketimi</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ formatUsage(thisMonthElectricityUsage, 'kWh') }}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
          <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full p-3">
            <span class="text-2xl">💧</span>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Aylık Su Tüketimi</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ formatUsage(thisMonthWaterUsage, 'm³') }}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
           <div class="flex flex-col gap-2 w-full">
             <button class="btn btn-primary btn-sm w-full" @click="showElectricityModal = true">⚡ Elektrik Girişi</button>
             <button class="btn btn-secondary btn-sm w-full" @click="showWaterModal = true">💧 Su Girişi</button>
             <button class="btn btn-accent btn-sm w-full" @click="showAidatModal = true">💰 Aidat Girişi</button>
           </div>
        </div>
      </section>

      <!-- Filtreler ve Liste Alanı -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <FilterBar
            v-model:search="searchTerm"
            search-placeholder="Şirket Ara..."
            v-model:period="selectedPeriod"
            v-model:select-type="selectedType"
            :select-type-options="utilityTypeOptions"
            @clear-filters="handleClearFilters"
        />
        <div class="mt-4 flex flex-wrap gap-2 items-center border-t dark:border-gray-700 pt-4">
            <button class="btn btn-error btn-sm" @click="deleteByPeriod" :disabled="!selectedPeriod">Dönemi Sil</button>
            <button class="btn btn-outline btn-sm" @click="openEditElectricityModal" :disabled="!selectedPeriod">Toplu Elektrik Düzenle</button>
            <button @click="showDistributeModal = true" class="btn btn-warning btn-sm">Ortak Gider Paylaştır</button>
        </div>

        <!-- Fatura Kart Listesi -->
        <div class="mt-6 space-y-2">
           <div v-if="filteredUtilityDebts.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Aramanızla eşleşen kayıt bulunamadı.</p>
          </div>
          <div v-else>
            <div 
              v-for="debt in filteredUtilityDebts" 
              :key="debt.id"
              class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b dark:border-gray-700/50"
            >
              <div class="md:col-span-4 flex items-center gap-4">
                <div class="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-2xl">
                  {{ getUtilityIcon(debt.utilityType) }}
                </div>
                <div>
                  <p class="font-bold text-gray-800 dark:text-gray-100">{{ debt.tenantName || debt.ownerName || '-' }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Dönem: {{ debt.period }}</p>
                  <p v-if="debt.flatNumber" class="text-xs text-gray-400 dark:text-gray-500">Daire: {{ debt.flatNumber }}</p>
                </div>
              </div>
              <div class="md:col-span-3 text-left md:text-center text-lg font-semibold text-gray-700 dark:text-gray-200">
                <span class="font-normal text-sm text-gray-500">Tüketim:</span> {{ formatUsage(debt.consumption, debt.utilityType === 'Electricity' ? 'kWh' : (debt.utilityType === 'Water' ? 'm³' : '')) }}
              </div>
              <div class="md:col-span-3 text-left md:text-center text-xl font-bold text-sky-600 dark:text-sky-400">
                {{ formatCurrency(debt.amount) }}
              </div>
              <div class="md:col-span-2 text-center">
                <!-- Ödeme Durumu Badge -->
                <div v-if="debt.isPaid" class="badge badge-success badge-sm">Ödendi</div>
                <div v-else-if="debt.paidAmount && debt.paidAmount > 0" class="badge badge-warning badge-sm">Kısmi Ödeme</div>
                <div v-else class="badge badge-error badge-sm">Ödenmedi</div>
              </div>
              <div class="md:col-span-2 text-right">
                <div class="dropdown dropdown-end">
                  <label tabindex="0" class="btn btn-ghost btn-sm">İşlemler</label>
                  <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-32 z-10">
                    <li><a @click="editRecord(debt)">Düzenle</a></li>
                    <li><a @click="deleteRecord(debt.id)" class="text-red-500">Sil</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal Bileşenleri -->
    <ElectricityModal v-if="showElectricityModal" @close="handleClose" />
    <WaterModal v-if="showWaterModal" @close="handleClose" />
    <AidatModal v-if="showAidatModal" @close="() => (showAidatModal = false)" @refresh="fetchUtilityDebts" />
    <EditElectricityModal v-if="showEditElectricityModal" :record="selectedElectricityRecord" @close="() => { showEditElectricityModal = false; selectedElectricityRecord = null }" @updated="fetchUtilityDebts" />
    <EditWaterModal v-if="showEditWaterModal" :record="selectedWaterRecord" @close="() => { showEditWaterModal = false; selectedWaterRecord = null }" @updated="fetchUtilityDebts" />
    <EditAidatModal v-if="showEditAidatModal" :record="selectedAidatRecord" @close="() => { showEditAidatModal = false; selectedAidatRecord = null }" @updated="fetchUtilityDebts" />
    <!-- Ortak Gider Modal -->
    <dialog id="distributeModal" class="modal" :open="showDistributeModal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Ortak Gider Paylaştır</h3>
        <div class="form-control mb-2">
          <label class="label">Dönem</label>
          <input type="month" v-model="selectedPeriod" class="input input-bordered" />
        </div>
        <div class="form-control mb-4">
          <label class="label">Gider Tipi</label>
          <select v-model="selectedType" class="select select-bordered">
            <option value="Electricity">Elektrik</option>
            <option value="Water">Su</option>
          </select>
        </div>
        <div class="modal-action">
          <button @click="distributeSharedExpense" class="btn btn-success">Paylaştır</button>
          <button @click="showDistributeModal = false" class="btn">Kapat</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ElectricityModal from './ElectricityModal.vue';
import WaterModal from './WaterModal.vue';
import AidatModal from './AidatModal.vue';
import EditElectricityModal from './EditElectricityModal.vue';
import EditWaterModal from './EditWaterModal.vue';
import EditAidatModal from './EditAidatModal.vue';
import FilterBar from '@/components/common/FilterBar.vue';
import utilityDebtsService from '@/services/utilityDebtsService'
import tenantsService from '@/services/tenantsService'
import { useErrorHandler } from '@/composables/useErrorHandler'

const { handleNetworkError, handleValidationError, showSuccess } = useErrorHandler()

const utilityDebts = ref([]);
const searchTerm = ref('');
const selectedPeriod = ref('');
const selectedType = ref('all');

const showElectricityModal = ref(false);
const showWaterModal = ref(false);
const showAidatModal = ref(false);
const showEditElectricityModal = ref(false);
const showEditWaterModal = ref(false);
const showEditAidatModal = ref(false);
const showDistributeModal = ref(false);

const selectedElectricityRecord = ref(null);
const selectedWaterRecord = ref(null);
const selectedAidatRecord = ref(null);

const utilityTypeOptions = [
  { value: 'all', label: 'Tümü' },
  { value: 'Electricity', label: 'Elektrik' },
  { value: 'Water', label: 'Su' },
  { value: 'Aidat', label: 'Aidat' },
  { value: 'OwnerAidat', label: 'Mal Sahibi Aidatı' }
];

const filteredUtilityDebts = computed(() => {
  return utilityDebts.value.filter(debt => {
    const tenantName = debt.tenantName || debt.ownerName || '';
    const matchesSearch = searchTerm.value === '' || tenantName.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchesPeriod = !selectedPeriod.value || debt.period === selectedPeriod.value;
    const matchesType = selectedType.value === 'all' || debt.utilityType === selectedType.value;
    return matchesSearch && matchesPeriod && matchesType;
  }).sort((a, b) => (b.period + (a.tenantName || a.ownerName)).localeCompare(a.period + (b.tenantName || b.ownerName)));
});

const thisMonthTotal = computed(() => {
  const today = new Date();
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
  return filteredUtilityDebts.value
    .filter(debt => debt.period === currentMonth)
    .reduce((sum, debt) => sum + Number(debt.amount || 0), 0);
});

const thisMonthElectricityUsage = computed(() => {
  const today = new Date();
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
  return filteredUtilityDebts.value
    .filter(debt => debt.period === currentMonth && debt.utilityType === 'Electricity')
    .reduce((sum, debt) => sum + Number(debt.consumption || 0), 0);
});

const thisMonthWaterUsage = computed(() => {
  const today = new Date();
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
  return filteredUtilityDebts.value
    .filter(debt => debt.period === currentMonth && debt.utilityType === 'Water')
    .reduce((sum, debt) => sum + Number(debt.consumption || 0), 0);
});

const formatUsage = (value, unit) => {
  if (value === undefined || value === null || isNaN(value)) return '-';
  return `${Number(value).toFixed(0)} ${unit}`;
}

const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '₺0.00';
  return Number(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
}

const getUtilityIcon = (type) => {
    const iconMap = {
        'Electricity': '⚡️',
        'Water': '💧',
        'Aidat': '💰',
        'OwnerAidat': '🏠'
    };
    return iconMap[type] || '❓';
}

// Data status tracking
const dataStatus = ref({
  loading: false,
  error: null,
  lastUpdated: null
});

const tenants = ref([])

const fetchUtilityDebts = async () => {
  dataStatus.value.loading = true
  try {
    const response = await utilityDebtsService.getUtilityDebts()
    utilityDebts.value = response || []
    dataStatus.value.error = null
    dataStatus.value.lastUpdated = new Date().toLocaleString('tr-TR')
  } catch (apiError) {
    handleNetworkError(apiError, { component: 'Utilities', action: 'fetchUtilityDebts' })
    dataStatus.value.error = apiError.message
    utilityDebts.value = []
  } finally {
    dataStatus.value.loading = false
  }
}

const fetchTenants = async () => {
  try {
    const response = await tenantsService.getTenants()
    tenants.value = response || []
  } catch (apiError) {
    handleNetworkError(apiError, { component: 'Utilities', action: 'fetchTenants' })
    tenants.value = []
  }
}

const handleClose = (shouldRefresh) => {
    showElectricityModal.value = false;
    showWaterModal.value = false;
    if (shouldRefresh) {
        fetchUtilityDebts();
    }
}

const deleteRecord = async (id) => {
    if (confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
        try {
            await utilityDebtsService.deleteUtilityDebt(id);
            showSuccess('Utility Debt');
            await fetchUtilityDebts();
        } catch (error) {
            console.error('Silme hatası:', error);
            alert('Kayıt silinirken bir hata oluştu.');
        }
    }
}

const deleteByPeriod = async () => {
    if (!selectedPeriod.value) {
        alert('Lütfen silinecek dönemi seçin.');
        return;
    }
    if (confirm(`${selectedPeriod.value} dönemindeki tüm kayıtları silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
        try {
            await utilityDebtsService.deleteUtilityDebtsByPeriod(selectedPeriod.value);
            showSuccess(`${selectedPeriod.value} dönemi kayıtları`);
            await fetchUtilityDebts();
        } catch (error) {
            console.error('Toplu silme hatası:', error);
            alert('Kayıtlar silinirken bir hata oluştu.');
        }
    }
};

const editRecord = (debt) => {
    if (debt.utilityType === 'Electricity') {
        selectedElectricityRecord.value = debt;
        showEditElectricityModal.value = true;
    } else if (debt.utilityType === 'Water') {
        selectedWaterRecord.value = debt;
        showEditWaterModal.value = true;
    } else if (debt.utilityType === 'Aidat') {
        selectedAidatRecord.value = debt;
        showEditAidatModal.value = true;
    } else if (debt.utilityType === 'OwnerAidat') {
        // Mal sahibi aidatları için şimdilik sadece bilgi göster
        alert(`Mal Sahibi Aidatı - ${debt.flatNumber}\nDönem: ${debt.period}\nTutar: ${formatCurrency(debt.amount)}`);
    }
};

const openEditElectricityModal = async () => {
    if (!selectedPeriod.value) {
        alert("Lütfen bir dönem seçin.");
        return;
    }
    
    const records = utilityDebts.value.filter(debt => 
        debt.period === selectedPeriod.value && debt.utilityType === 'Electricity'
    );

    if(records.length > 0) {
        selectedElectricityRecord.value = records; // Pass all records for the period
        showEditElectricityModal.value = true;
    } else {
        alert("Bu dönem için düzenlenecek elektrik kaydı bulunamadı.");
    }
};

const distributeSharedExpense = async () => {
    if (!selectedPeriod.value || selectedType.value === 'all' || (selectedType.value !== 'Electricity' && selectedType.value !== 'Water')) {
        alert('Lütfen dönem ve gider tipi olarak Elektrik veya Su seçiniz.');
        return;
    }

    try {
        await utilityDebtsService.distributeSharedExpense(selectedPeriod.value, selectedType.value);
        showSuccess('Ortak gider başarıyla paylaştırıldı.');
        showDistributeModal.value = false;
        await fetchUtilityDebts();
    } catch (error) {
        console.error('Paylaştırma hatası:', error);
        alert('Ortak gider paylaştırılırken bir hata oluştu.');
    }
};

const handleClearFilters = () => {
  searchTerm.value = ''
  selectedPeriod.value = ''
  selectedType.value = 'all'
  console.log('✅ Tüm filtreler temizlendi')
}

onMounted(() => {
    fetchTenants()
    fetchUtilityDebts()
});
</script>
