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
            {{ readings.length }} kayıt
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
           <div v-if="filteredReadings.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Aramanızla eşleşen kayıt bulunamadı.</p>
          </div>
          <div v-else>
            <div 
              v-for="r in filteredReadings" 
              :key="r.id"
              class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b dark:border-gray-700/50"
            >
              <div class="md:col-span-4 flex items-center gap-4">
                <div class="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-2xl">
                  {{ getUtilityIcon(r.type) }}
                </div>
                <div>
                  <p class="font-bold text-gray-800 dark:text-gray-100">{{ r.tenantName || '-' }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Dönem: {{ r.period }}</p>
                  <p v-if="r.unitInfo" class="text-xs text-gray-400 dark:text-gray-500">Kat: {{ r.unitInfo }}</p>
                </div>
              </div>
              <div class="md:col-span-3 text-left md:text-center text-lg font-semibold text-gray-700 dark:text-gray-200">
                <span class="font-normal text-sm text-gray-500">Tüketim:</span> {{ formatUsage(r.consumption ?? r.usage, r.type === 'electricity' ? 'kWh' : (r.type === 'water' ? 'm³' : '')) }}
              </div>
              <div class="md:col-span-3 text-left md:text-center text-xl font-bold text-sky-600 dark:text-sky-400">
                {{ formatCurrency(r.toplamTutar ?? r.kdvDahil) }}
              </div>
              <div class="md:col-span-2 text-right">
                <div class="dropdown dropdown-end">
                  <label tabindex="0" class="btn btn-ghost btn-sm">İşlemler</label>
                  <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-32 z-10">
                    <li><a @click="editRecord(r)">Düzenle</a></li>
                    <li><a @click="deleteRecord(r.id)" class="text-red-500">Sil</a></li>
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
    <AidatModal v-if="showAidatModal" @close="() => (showAidatModal = false)" @refresh="fetchReadings" />
    <EditElectricityModal v-if="showEditElectricityModal" :record="selectedElectricityRecord" @close="() => { showEditElectricityModal = false; selectedElectricityRecord = null }" @updated="fetchReadings" />
    <EditWaterModal v-if="showEditWaterModal" :record="selectedWaterRecord" @close="() => { showEditWaterModal = false; selectedWaterRecord = null }" @updated="fetchReadings" />
    <EditAidatModal v-if="showEditAidatModal" :record="selectedAidatRecord" @close="() => { showEditAidatModal = false; selectedAidatRecord = null }" @updated="fetchReadings" />
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
            <option value="electricity">Elektrik</option>
            <option value="water">Su</option>
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
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc, addDoc, query, where, writeBatch, onSnapshot } from 'firebase/firestore';
import ElectricityModal from './ElectricityModal.vue';
import WaterModal from './WaterModal.vue';
import AidatModal from './AidatModal.vue';
import EditElectricityModal from './EditElectricityModal.vue';
import EditWaterModal from './EditWaterModal.vue';
import EditAidatModal from './EditAidatModal.vue';
import FilterBar from '@/components/common/FilterBar.vue';
import { meterManager } from '../../utils/meterUtils';

const readings = ref([]);
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
  { value: 'electricity', label: 'Elektrik' },
  { value: 'water', label: 'Su' },
  { value: 'aidat', label: 'Aidat' },
  { value: 'ownerAidat', label: 'Mal Sahibi Aidatı' }
];

const filteredReadings = computed(() => {
  return readings.value.filter(r => {
    const tenantName = r.tenantName || '';
    const matchesSearch = searchTerm.value === '' || tenantName.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchesPeriod = !selectedPeriod.value || r.period === selectedPeriod.value;
    const matchesType = selectedType.value === 'all' || r.type === selectedType.value;
    return matchesSearch && matchesPeriod && matchesType;
  }).sort((a, b) => (b.period + b.tenantName).localeCompare(a.period + a.tenantName));
});

const thisMonthTotal = computed(() => {
  const today = new Date();
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
  return filteredReadings.value
    .filter(r => r.period === currentMonth)
    .reduce((sum, r) => sum + Number(r.toplamTutar ?? r.kdvDahil ?? 0), 0);
});

const thisMonthElectricityUsage = computed(() => {
  const today = new Date();
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
  return filteredReadings.value
    .filter(r => r.period === currentMonth && r.type === 'electricity')
    .reduce((sum, r) => sum + Number(r.consumption ?? r.usage ?? 0), 0);
});

const thisMonthWaterUsage = computed(() => {
  const today = new Date();
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
  return filteredReadings.value
    .filter(r => r.period === currentMonth && r.type === 'water')
    .reduce((sum, r) => sum + Number(r.consumption ?? r.usage ?? 0), 0);
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
        'electricity': '⚡️',
        'water': '💧',
        'aidat': '💰',
        'ownerAidat': '🏠'
    };
    return iconMap[type] || '❓';
}

// Data status tracking
const dataStatus = ref({
  loading: false,
  error: null,
  lastUpdated: null
});

// Real-time listeners
let readingsUnsubscribe = null
let aidatUnsubscribe = null
let ownerAidatUnsubscribe = null

const fetchReadings = async () => {
  readings.value = [];
  const tenantsSnapshot = await getDocs(collection(db, 'tenants'));
  const tenantMap = {};
  tenantsSnapshot.forEach(doc => {
    const data = doc.data();
    tenantMap[doc.id] = {
      name: data.company || `${data.firstName} ${data.lastName}`,
    };
  });

  // Real-time listener for readings
  readingsUnsubscribe = onSnapshot(collection(db, 'readings'), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = { id: change.doc.id, ...change.doc.data() };
      let tenantName, unitInfo;
      
      if (data.tenantId === 'ortak') {
        tenantName = 'Ortak Alan';
        unitInfo = data.unit || '';
      } else if (data.tenantId === 'mescit') {
        tenantName = 'Mescit';
        unitInfo = data.unit || '';
      } else {
        const tenant = tenantMap[data.tenantId];
        tenantName = tenant?.name || 'Bilinmiyor';
        unitInfo = data.unit || '';
      }

      const record = { ...data, tenantName, unitInfo };

      if (change.type === 'added') {
        readings.value.push(record);
      } else if (change.type === 'modified') {
        const index = readings.value.findIndex(r => r.id === data.id);
        if (index !== -1) {
          readings.value[index] = record;
        }
      } else if (change.type === 'removed') {
        const index = readings.value.findIndex(r => r.id === data.id);
        if (index !== -1) {
          readings.value.splice(index, 1);
        }
      }
    });
  });

  // Real-time listener for aidat records
  aidatUnsubscribe = onSnapshot(collection(db, 'aidatRecords'), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = { id: change.doc.id, ...change.doc.data() };
      const tenant = tenantMap[data.tenantId];
      const tenantName = tenant?.name || '-';
      const unitInfo = data.unit || '';

      const record = {
        ...data,
        type: 'aidat',
        tenantName: tenantName,
        unitInfo: unitInfo,
        consumption: null,
        kdvDahil: data.toplamTutar
      };

      if (change.type === 'added') {
        readings.value.push(record);
      } else if (change.type === 'modified') {
        const index = readings.value.findIndex(r => r.id === data.id);
        if (index !== -1) {
          readings.value[index] = record;
        }
      } else if (change.type === 'removed') {
        const index = readings.value.findIndex(r => r.id === data.id);
        if (index !== -1) {
          readings.value.splice(index, 1);
        }
      }
    });
  });

  // Real-time listener for owner aidat records
  ownerAidatUnsubscribe = onSnapshot(collection(db, 'ownerAidatRecords'), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = { id: change.doc.id, ...change.doc.data() };
      const tenantName = `Mal Sahibi`;
      const unitInfo = data.unit || '';

      const record = {
        ...data,
        type: 'ownerAidat',
        tenantName: tenantName,
        unitInfo: unitInfo,
        consumption: null,
        kdvDahil: data.toplamTutar
      };

      if (change.type === 'added') {
        readings.value.push(record);
      } else if (change.type === 'modified') {
        const index = readings.value.findIndex(r => r.id === data.id);
        if (index !== -1) {
          readings.value[index] = record;
        }
      } else if (change.type === 'removed') {
        const index = readings.value.findIndex(r => r.id === data.id);
        if (index !== -1) {
          readings.value.splice(index, 1);
        }
      }
    });
  });
};

// Cleanup function
const cleanup = () => {
  if (readingsUnsubscribe) {
    readingsUnsubscribe();
  }
  if (aidatUnsubscribe) {
    aidatUnsubscribe();
  }
  if (ownerAidatUnsubscribe) {
    ownerAidatUnsubscribe();
  }
};

// Enhanced data fetching with status tracking
const fetchReadingsWithCache = async () => {
  try {
    dataStatus.value.loading = true;
    dataStatus.value.error = null;
    
    // Clear cache first
    meterManager.clearCache();
    
    // Fetch data
    await fetchReadings();
    
    dataStatus.value.lastUpdated = new Date().toLocaleString('tr-TR');
    console.log(`✅ ${readings.value.length} kayıt yüklendi`);
  } catch (error) {
    console.error('Veri yükleme hatası:', error);
    dataStatus.value.error = 'Veriler yüklenirken bir hata oluştu.';
  } finally {
    dataStatus.value.loading = false;
  }
};

const handleClose = (shouldRefresh) => {
    showElectricityModal.value = false;
    showWaterModal.value = false;
    if (shouldRefresh) {
        fetchReadingsWithCache();
    }
}

const deleteRecord = async (id) => {
    if (confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
        try {
            const record = readings.value.find(r => r.id === id);
            if (!record) return;
            
            let collectionName;
            if (record.type === 'aidat') {
                collectionName = 'aidatRecords';
            } else if (record.type === 'ownerAidat') {
                collectionName = 'ownerAidatRecords';
            } else {
                collectionName = 'readings';
            }
            
            await deleteDoc(doc(db, collectionName, id));
            
            // Cache'i temizle
            if (record.type !== 'aidat' && record.type !== 'ownerAidat') {
                meterManager.clearCacheForUnit(record.unit, record.type);
            }
            
            console.log(`✅ ${record.type} kaydı silindi`);
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
    if (confirm(`${selectedPeriod.value} dönemindeki tüm kayıtları (Aidat, Mal Sahibi Aidatı ve Faturalar) silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
        try {
            const batch = writeBatch(db);

            // readings koleksiyonundan sil
            const readingsQuery = query(collection(db, "readings"), where("period", "==", selectedPeriod.value));
            const readingsSnapshot = await getDocs(readingsQuery);
            readingsSnapshot.forEach((doc) => batch.delete(doc.ref));

            // aidatRecords koleksiyonundan sil
            const aidatQuery = query(collection(db, "aidatRecords"), where("period", "==", selectedPeriod.value));
            const aidatSnapshot = await getDocs(aidatQuery);
            aidatSnapshot.forEach((doc) => batch.delete(doc.ref));

            // ownerAidatRecords koleksiyonundan sil
            const ownerAidatQuery = query(collection(db, "ownerAidatRecords"), where("period", "==", selectedPeriod.value));
            const ownerAidatSnapshot = await getDocs(ownerAidatQuery);
            ownerAidatSnapshot.forEach((doc) => batch.delete(doc.ref));

            await batch.commit();
            
            // Cache'i temizle
            meterManager.clearCache();
            
            console.log(`✅ ${selectedPeriod.value} dönemi kayıtları silindi`);
            alert(`${selectedPeriod.value} dönemindeki tüm kayıtlar silindi.`);
        } catch (error) {
            console.error('Toplu silme hatası:', error);
            alert('Kayıtlar silinirken bir hata oluştu.');
        }
    }
};

const editRecord = (record) => {
    if (record.type === 'electricity') {
        selectedElectricityRecord.value = record;
        showEditElectricityModal.value = true;
    } else if (record.type === 'water') {
        selectedWaterRecord.value = record;
        showEditWaterModal.value = true;
    } else if (record.type === 'aidat') {
        selectedAidatRecord.value = record;
        showEditAidatModal.value = true;
    } else if (record.type === 'ownerAidat') {
        // Mal sahibi aidatları için şimdilik sadece bilgi göster
        alert(`Mal Sahibi Aidatı - ${record.unit}\nDönem: ${record.period}\nTutar: ${formatCurrency(record.toplamTutar)}`);
    }
};

const openEditElectricityModal = async () => {
    if (!selectedPeriod.value) {
        alert("Lütfen bir dönem seçin.");
        return;
    }
    
    const q = query(collection(db, "readings"), where("period", "==", selectedPeriod.value), where("type", "==", "electricity"));
    const querySnapshot = await getDocs(q);
    const records = [];
    querySnapshot.forEach(doc => records.push({ id: doc.id, ...doc.data() }));

    if(records.length > 0) {
        selectedElectricityRecord.value = records; // Pass all records for the period
        showEditElectricityModal.value = true;
    } else {
        alert("Bu dönem için düzenlenecek elektrik kaydı bulunamadı.");
    }
};

const distributeSharedExpense = async () => {
    if (!selectedPeriod.value || selectedType.value === 'all' || (selectedType.value !== 'electricity' && selectedType.value !== 'water')) {
        alert('Lütfen dönem ve gider tipi olarak Elektrik veya Su seçiniz.');
        return;
    }

    // 1. Daha önce paylaştırılmış mı kontrolü
    const distCheckQuery = query(collection(db, 'sharedDistributions'), where('period', '==', selectedPeriod.value), where('type', '==', selectedType.value));
    const distCheckSnap = await getDocs(distCheckQuery);
    if (!distCheckSnap.empty) {
        alert("Bu dönem ve tip için ortak gider zaten paylaştırılmış.");
        return;
    }

    // 2. Ortak + mescit toplam tutarı
    const q = query(collection(db, 'readings'), where('period', '==', selectedPeriod.value), where('type', '==', selectedType.value), where('tenantId', 'in', ['ortak', 'mescit']));
    const snapshot = await getDocs(q);
    let total = 0;
    let sharedDueDate = null;
    snapshot.forEach(doc => {
        const data = doc.data();
        total += Number(data.kdvDahil || data.toplamTutar || 0);
        if (!sharedDueDate && data.dueDate) sharedDueDate = data.dueDate;
    });

    if (total === 0) {
        alert("Paylaştırılacak ortak gider bulunamadı.");
        return;
    }

    // 3. Kiracıları ve paylarını al
    const tenantsSnap = await getDocs(collection(db, 'tenants'));
    const entries = [];
    tenantsSnap.forEach(doc => {
        const data = doc.data();
        if (data.units && Array.isArray(data.units) && data.status !== 'inactive') {
            data.units.forEach(unit => {
                entries.push({
                    tenantId: doc.id,
                    tenantName: data.company,
                    unit,
                    // Yiğit Hamdemir'e 2 pay, diğerlerine 1 pay
                    pay: data.company === 'YİĞİT HAMDEMİR' ? 2 : 1
                });
            });
        }
    });

    if (entries.length === 0) {
        alert("Paylaştırma yapılacak aktif kiracı bulunamadı.");
        return;
    }

    // 4. Pay başına düşen tutarı hesapla ve dağıt
    const totalPayCount = entries.reduce((sum, e) => sum + e.pay, 0);
    const amountPerPay = total / totalPayCount;
    const typeLabel = selectedType.value === 'electricity' ? 'Elektrik' : 'Su';
    
    const batch = writeBatch(db);
    for (const e of entries) {
        const totalAmount = amountPerPay * e.pay;
        const newRecordRef = doc(collection(db, 'readings'));
        batch.set(newRecordRef, {
            tenantId: e.tenantId,
            tenantName: e.tenantName,
            unit: e.unit,
            period: selectedPeriod.value,
            type: selectedType.value,
            consumption: null,
            kdvHaric: null,
            kdvDahil: totalAmount,
            toplamTutar: totalAmount,
            dueDate: sharedDueDate || null,
            description: `Ortak ${typeLabel} Gider Payı`,
            isShared: true,
            createdAt: new Date(),
        });
    }

    // 5. Paylaştırma kaydı oluştur
    const newDistRef = doc(collection(db, 'sharedDistributions'));
    batch.set(newDistRef, {
        period: selectedPeriod.value,
        type: selectedType.value,
        distributed: true,
        distributedAt: new Date()
    });

    await batch.commit();

    alert('Ortak gider başarıyla paylaştırıldı.');
    showDistributeModal.value = false;
    fetchReadings();
};

const handleClearFilters = () => {
  searchTerm.value = ''
  selectedPeriod.value = ''
  selectedType.value = 'all'
  console.log('✅ Tüm filtreler temizlendi')
}

onMounted(() => {
    fetchReadingsWithCache();
});

// Cleanup on component unmount
onUnmounted(() => {
    cleanup();
});
</script>
