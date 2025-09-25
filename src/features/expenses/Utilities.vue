<template>
  <!-- Ana Sayfa Konteyneri -->
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      
      <!-- Başlık -->
      <h1 class="text-3xl font-bold text-gray-800 mb-6 dark:text-gray-100">Sayaç Okumaları</h1>

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
            {{ meterReadings.length }} sayaç okuması
          </div>
        </div>
      </div>


      <!-- Sayaç Okumaları -->
        <!-- Özet Bilgi Kartları -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
            <div class="bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Toplam Sayaç Okuması</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ meterReadings.length }}</p>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
            <div class="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-full p-3">
             <span class="text-2xl">⚡️</span>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Elektrik Tüketimi</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ formatUsage(meterStats.electricityConsumption, 'kWh') }}</p>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
            <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full p-3">
              <span class="text-2xl">💧</span>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Su Tüketimi</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ formatUsage(meterStats.waterConsumption, 'm³') }}</p>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
           <div class="flex flex-col gap-2 w-full">
            <div class="flex flex-col gap-2 w-full">
  <!-- Ortak Dağılım Butonu -->
  <button @click="showSharedConsumptionModal = true" class="btn btn-info btn-sm w-full">
    🧪 Ortak Tüketim 
  </button>
  
  <!-- Elektrik -->
  <div class="dropdown dropdown-end w-full">
    <label tabindex="0" class="btn btn-primary btn-sm w-full">⚡ Elektrik</label>
    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52 z-10">
      <li><a @click="showElectricityModal = true">Yeni Okuma</a></li>
    </ul>
  </div>

  <!-- Su -->
  <div class="dropdown dropdown-end w-full">
    <label tabindex="0" class="btn btn-secondary btn-sm w-full">💧 Su</label>
    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52 z-10">
      <li><a @click="showWaterModal = true">Yeni Okuma</a></li>
    </ul>
  </div>
</div>
           </div>
          </div>
        </section>

        <!-- Sayaç Okumaları Listesi -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <FilterBar
              v-model:search="searchTerm"
              search-placeholder="Daire ara..."
              v-model:period="selectedPeriod"
              v-model:select-type="selectedMeterType"
              :select-type-options="meterTypeOptions"
              @clear-filters="handleClearFilters"
          />

          <!-- Sayaç Okumaları Tablosu -->
          <div class="mt-6 space-y-2">
             <div v-if="filteredMeterReadings.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>Aramanızla eşleşen sayaç okuması bulunamadı.</p>
            </div>
            <div v-else>
              <div 
                v-for="reading in filteredMeterReadings" 
                :key="reading.id"
                class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b dark:border-gray-700/50"
              >
                <div class="md:col-span-3 flex items-center gap-4">
                  <div class="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-2xl">
                    {{ getMeterIcon(reading.type) }}
                  </div>
                  <div>
                    <p class="font-bold text-gray-800 dark:text-gray-100">{{ reading.flatNumber }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ (reading.type === 'Electricity' || reading.type === 0) ? 'Elektrik' : 'Su' }}</p>
                    <p class="text-xs text-gray-400 dark:text-gray-500">{{ formatDate(reading.readingDate) }}</p>
                  </div>
                </div>
                <div class="md:col-span-2 text-center">
                  <span class="text-sm text-gray-500">Dönem:</span>
                  <p class="font-semibold">{{ reading.periodYear }}/{{ reading.periodMonth.toString().padStart(2, '0') }}</p>
                </div>
                <div class="md:col-span-2 text-center">
                  <span class="text-sm text-gray-500">Sayaç Değeri:</span>
                  <p class="font-semibold text-lg">{{ formatNumber(reading.readingValue) }}</p>
                </div>
                <div class="md:col-span-2 text-center">
                  <span class="text-sm text-gray-500">Tüketim:</span>
                  <p class="font-semibold text-lg text-sky-600 dark:text-sky-400">
                    {{ formatUsage(reading.consumption, (reading.type === 'Electricity' || reading.type === 0) ? 'kWh' : 'm³') }}
                  </p>
                </div>
                <div class="md:col-span-2 text-center">
                  <p v-if="reading.note" class="text-sm text-gray-600 dark:text-gray-400 truncate" :title="reading.note">
                    {{ reading.note }}
                  </p>
                  <p v-else class="text-sm text-gray-400">Not yok</p>
                </div>
                <div class="md:col-span-1 text-right">
                  <div class="dropdown dropdown-end">
                    <label tabindex="0" class="btn btn-ghost btn-sm">İşlemler</label>
                    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-32 z-10">
                      <li><a @click="editMeterReading(reading)">Düzenle</a></li>
                      <li><a @click="deleteMeterReading(reading.id)" class="text-red-500">Sil</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    <!-- Modal Bileşenleri -->
    <MeterReadingModal v-if="showMeterReadingModal" :reading="selectedMeterReading" @close="handleClose" />
    <ElectricityModal v-if="showElectricityModal" @close="handleClose" />
    <WaterModal v-if="showWaterModal" @close="handleClose" />
    <SharedConsumptionModal v-if="showSharedConsumptionModal" :isVisible="showSharedConsumptionModal" @close="handleClose" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ElectricityModal from './ElectricityModal.vue';
import WaterModal from './WaterModal.vue';
import MeterReadingModal from './MeterReadingModal.vue';
import SharedConsumptionModal from '@/components/SharedConsumptionModal.vue';
import FilterBar from '@/components/common/FilterBar.vue';
import meterReadingsService from '@/services/meterReadingsService'
import { useErrorHandler } from '@/composables/useErrorHandler'
import api from '@/services/api'

const { handleNetworkError, showSuccess } = useErrorHandler()

// Meter readings state
const meterReadings = ref([]);
const searchTerm = ref('');
const selectedPeriod = ref('');
const selectedMeterType = ref('all');
const showMeterReadingModal = ref(false);
const selectedMeterReading = ref(null);

// Modal states
const showElectricityModal = ref(false);
const showWaterModal = ref(false);
const showSharedConsumptionModal = ref(false);

// Meter stats
const meterStats = ref({
  totalReadings: 0,
  electricityConsumption: 0,
  waterConsumption: 0
});

const meterTypeOptions = [
  { value: 'all', label: 'Tümü' },
  { value: 'Electricity', label: 'Elektrik' },
  { value: 'Water', label: 'Su' }
];

// Computed properties for meter readings
const filteredMeterReadings = computed(() => {
  return meterReadings.value.filter(reading => {
    const flatNumber = reading.flatNumber || '';
    const matchesSearch = searchTerm.value === '' || flatNumber.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchesPeriod = !selectedPeriod.value || `${reading.periodYear}-${reading.periodMonth.toString().padStart(2, '0')}` === selectedPeriod.value;
    
    // Type matching - hem numeric hem string değerleri destekle
    let matchesType = true;
    if (selectedMeterType.value !== 'all') {
      if (selectedMeterType.value === 'Electricity') {
        matchesType = reading.type === 'Electricity' || reading.type === 0;
      } else if (selectedMeterType.value === 'Water') {
        matchesType = reading.type === 'Water' || reading.type === 1;
      }
    }
    
    return matchesSearch && matchesPeriod && matchesType;
  }).sort((a, b) => new Date(b.readingDate) - new Date(a.readingDate));
});

// Data status tracking
const dataStatus = ref({
  loading: false,
  error: null,
  lastUpdated: null
});

const inFlight = ref(0);
const setLoading = (inc) => {
  inFlight.value += inc ? 1 : -1;
  dataStatus.value.loading = inFlight.value > 0;
};

// Flat bilgilerini al
const fetchFlats = async () => {
  try {
    const response = await api.get('/flats');
    return response || [];
  } catch (error) {
    console.error('Flat bilgileri alınırken hata:', error);
    return [];
  }
};

// Fetch meter readings
const fetchMeterReadings = async () => {
  setLoading(true);
  try {
    // Meter readings ve flat bilgilerini paralel olarak al
    const [meterReadingsResponse, flatsData] = await Promise.all([
      meterReadingsService.getMeterReadings(),
      fetchFlats()
    ]);
    
    // Backend'den gelen verileri düzelt ve flat bilgilerini ekle
    meterReadings.value = (meterReadingsResponse || []).map(reading => {
      // Flat bilgisini bul
      const flat = flatsData.find(f => f.id === reading.flatId);
      
      // Eğer ortak tüketim kaydı ise ve note'da MeterType:1 yazıyorsa type'ı 1 yap
      if (reading.note && reading.note.includes('Ortak Alan Tüketimi') && reading.note.includes('MeterType:1')) {
        return { 
          ...reading, 
          type: 1,
          flatNumber: flat?.code || 'Bilinmiyor',
          floorNumber: flat?.floorNumber || null
        };
      }
      
      return {
        ...reading,
        flatNumber: flat?.code || 'Bilinmiyor',
        floorNumber: flat?.floorNumber || null
      };
    });
    
    dataStatus.value.error = null;
    dataStatus.value.lastUpdated = new Date().toLocaleString('tr-TR');
    
    // Update stats
    updateMeterStats();
  } catch (apiError) {
    handleNetworkError(apiError, { component: 'Utilities', action: 'fetchMeterReadings' });
    dataStatus.value.error = apiError?.message || 'Veri çekilirken bir sorun oluştu.';
    meterReadings.value = [];
  } finally {
    setLoading(false);
  }
};

// Update meter statistics
const updateMeterStats = () => {
  const electricityReadings = meterReadings.value.filter(r => r.type === 0 || r.type === 'Electricity');
  const waterReadings = meterReadings.value.filter(r => r.type === 1 || r.type === 'Water');
  
  meterStats.value = {
    totalReadings: meterReadings.value.length,
    electricityConsumption: electricityReadings.reduce((sum, r) => sum + (r.consumption || 0), 0),
    waterConsumption: waterReadings.reduce((sum, r) => sum + (r.consumption || 0), 0)
  };
};

const handleClose = (shouldRefresh) => {
    showElectricityModal.value = false;
    showWaterModal.value = false;
    showMeterReadingModal.value = false;
    showSharedConsumptionModal.value = false;
    selectedMeterReading.value = null;
    if (shouldRefresh) {
        fetchMeterReadings();
    }
}

const handleSuccess = (result) => {
    console.log('Ortak tüketim başarıyla uygulandı:', result);
    showSharedConsumptionModal.value = false;
    fetchMeterReadings(); // Tabloyu yenile
    showSuccess('Ortak tüketim dağıtımı');
}

// Meter reading operations
const editMeterReading = (reading) => {
    selectedMeterReading.value = reading;
    showMeterReadingModal.value = true;
}

const deleteMeterReading = async (id) => {
    if (confirm('Bu sayaç okumasını silmek istediğinizden emin misiniz?')) {
        try {
            await meterReadingsService.deleteMeterReading(id);
            showSuccess('Sayaç okuması');
            await fetchMeterReadings();
        } catch (error) {
            console.error('Silme hatası:', error);
            alert('Sayaç okuması silinirken bir hata oluştu.');
        }
    }
}

const handleClearFilters = () => {
  searchTerm.value = ''
  selectedPeriod.value = ''
  selectedMeterType.value = 'all'
  console.log('✅ Tüm filtreler temizlendi')
}

// Utility functions
const formatUsage = (v, unit) => (v ?? '') === '' || isNaN(v) ? '-' : `${Number(v).toFixed(2)} ${unit}`;

const formatNumber = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '-';
  return Number(value).toLocaleString('tr-TR');
}

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('tr-TR');
}

const getMeterIcon = (type) => {
    const iconMap = {
        'Electricity': '⚡️',
        'Water': '💧',
        0: '⚡️', // Electricity
        1: '💧'  // Water
    };
    return iconMap[type] || '❓';
}

onMounted(() => {
    fetchMeterReadings()
});
</script>
