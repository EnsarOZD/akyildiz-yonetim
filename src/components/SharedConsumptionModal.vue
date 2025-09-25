<template>
  <div class="modal-overlay" v-if="isVisible" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Ortak Tüketim Dağıtımı</h3>
        <button @click="closeModal" class="close-btn">&times;</button>
      </div>
      
      <div class="modal-body">
        <!-- 1. Giriş Aşaması -->
        <div v-if="step === 1" class="input-step">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Dönem Seçimi
            </label>
            <div class="flex gap-4">
              <select v-model="formData.periodYear" class="select select-bordered select-lg flex-1">
                <option v-for="year in availableYears" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
              <select v-model="formData.periodMonth" class="select select-bordered select-lg flex-1">
                <option v-for="month in months" :key="month.value" :value="month.value">
                  {{ month.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Tüketim Türü Seçimi -->
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Ortak Tüketim Türü
            </label>
            <div class="flex gap-8">
              <label class="cursor-pointer flex items-center">
                <input 
                  type="radio" 
                  v-model="formData.consumptionType" 
                  value="electricity" 
                  class="radio radio-primary radio-lg mr-3" 
                />
                <span class="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  ⚡️ Elektrik
                </span>
              </label>
              <label class="cursor-pointer flex items-center">
                <input 
                  type="radio" 
                  v-model="formData.consumptionType" 
                  value="water" 
                  class="radio radio-primary radio-lg mr-3" 
                />
                <span class="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  💧 Su
                </span>
              </label>
            </div>
          </div>
          
          <!-- Fiyatlandırma Bilgileri -->
          <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
            <h4 class="text-lg font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
              💰 Fiyatlandırma Bilgileri
            </h4>
            
            <!-- Elektrik için tek birim fiyat -->
            <div v-if="formData.consumptionType === 'electricity'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Birim Fiyat (₺/kWh)
                </label>
                <input 
                  type="number" 
                  step="0.01" 
                  v-model="formData.unitPrice"
                  placeholder="2.50"
                  class="input input-bordered input-lg w-full"
                />
              </div>
              
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  KDV Oranı (%)
                </label>
                <input 
                  type="number" 
                  step="0.01" 
                  v-model="formData.vatRate"
                  placeholder="20.00"
                  class="input input-bordered input-lg w-full"
                />
              </div>
              
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  BTV Oranı (%)
                </label>
                <input 
                  type="number" 
                  step="0.01" 
                  v-model="formData.btvRate"
                  placeholder="5.00"
                  class="input input-bordered input-lg w-full"
                />
              </div>
            </div>
            
            <!-- Su için çift birim fiyat -->
            <div v-if="formData.consumptionType === 'water'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Su Birim Fiyatı (₺/m³) - %1 KDV
                </label>
                <input 
                  type="number" 
                  step="0.01" 
                  v-model="formData.waterUnitPrice"
                  placeholder="112.54"
                  class="input input-bordered input-lg w-full"
                />
              </div>
              
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Atık Su Birim Fiyatı (₺/m³) - %10 KDV
                </label>
                <input 
                  type="number" 
                  step="0.01" 
                  v-model="formData.wasteWaterUnitPrice"
                  placeholder="56.27"
                  class="input input-bordered input-lg w-full"
                />
              </div>
            </div>
          </div>
          
          <!-- Elektrik Tüketimi -->
          <div v-if="formData.consumptionType === 'electricity'" class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
            <h4 class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
              ⚡️ Elektrik Tüketimi
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Ortak Alan Tüketimi (kWh)
                </label>
                <input 
                  type="number" 
                  step="0.01" 
                  v-model="formData.sharedAreaElectricityConsumption"
                  placeholder="0.00"
                  class="input input-bordered input-lg w-full"
                />
              </div>
              
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Mescit Tüketimi (kWh)
                </label>
                <input 
                  type="number" 
                  step="0.01" 
                  v-model="formData.mescitElectricityConsumption"
                  placeholder="0.00"
                  class="input input-bordered input-lg w-full"
                />
              </div>
            </div>
          </div>

          <!-- Su Tüketimi -->
          <div v-if="formData.consumptionType === 'water'" class="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg mb-4">
            <h4 class="text-lg font-semibold text-cyan-800 dark:text-cyan-200 mb-3 flex items-center gap-2">
              💧 Su Tüketimi
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Ortak Alan Tüketimi (m³)
                </label>
                <input 
                  type="number" 
                  step="0.01" 
                  v-model="formData.sharedAreaWaterConsumption"
                  placeholder="0.00"
                  class="input input-bordered input-lg w-full"
                />
              </div>
              
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Mescit Tüketimi (m³)
                </label>
                <input 
                  type="number" 
                  step="0.01" 
                  v-model="formData.mescitWaterConsumption"
                  placeholder="0.00"
                  class="input input-bordered input-lg w-full"
                />
              </div>
            </div>
          </div>
          
          
          <div class="form-actions">
            <button @click="calculateDistribution" class="btn btn-primary" :disabled="!canCalculate || loading">
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              {{ loading ? 'Hesaplanıyor...' : 'Hesapla' }}
            </button>
          </div>
        </div>
        
        <!-- 2. Sonuçları Kontrol Etme Aşaması -->
        <div v-if="step === 2" class="results-step">
          <div class="summary bg-base-200 p-4 rounded-lg mb-4">
            <h4 class="text-lg font-semibold mb-3">Dağıtım Özeti</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div v-if="formData.consumptionType === 'electricity'" class="stat bg-base-100 rounded-lg p-3">
                <div class="stat-title text-sm">Elektrik Tüketimi</div>
                <div class="stat-value text-lg text-blue-600">{{ totalSharedElectricityConsumption.toFixed(2) }} kWh</div>
              </div>
              <div v-if="formData.consumptionType === 'water'" class="stat bg-base-100 rounded-lg p-3">
                <div class="stat-title text-sm">Su Tüketimi</div>
                <div class="stat-value text-lg text-cyan-600">{{ totalSharedWaterConsumption.toFixed(2) }} m³</div>
              </div>
              <div class="stat bg-base-100 rounded-lg p-3">
                <div class="stat-title text-sm">Toplam Hisse</div>
                <div class="stat-value text-lg">{{ totalShares }}</div>
              </div>
            </div>
          </div>
          
          <div class="results-table overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr class="bg-base-200">
                  <th>Daire</th>
                  <th>Kiracı</th>
                  <th>Hisse</th>
                  <th v-if="formData.consumptionType === 'electricity'" class="text-right">Elektrik (kWh)</th>
                  <th v-if="formData.consumptionType === 'water'" class="text-right">Su (m³)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in distributionResults" :key="item.flatId">
                  <td class="font-medium">{{ item.flatNumber }}</td>
                  <td>{{ getTenantName(item.flatId) }}</td>
                  <td>{{ item.shareCount }}</td>
                  <td v-if="formData.consumptionType === 'electricity'" class="text-right font-semibold text-blue-600">{{ item.distributedConsumption?.toFixed(2) || '0.00' }}</td>
                  <td v-if="formData.consumptionType === 'water'" class="text-right font-semibold text-cyan-600">{{ item.distributedConsumption?.toFixed(2) || '0.00' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="form-actions">
            <button @click="step = 1" class="btn btn-outline">Geri</button>
            <button @click="step = 3" class="btn btn-primary">Devam Et</button>
          </div>
        </div>
        
        <!-- 3. Uygulama Onayı Aşaması -->
        <div v-if="step === 3" class="apply-step">
          <div class="mb-6">
            <div class="form-group">
              <label class="label">
                <span class="label-text">Vade Tarihi</span>
              </label>
              <input type="date" v-model="applyData.dueDate" class="input input-bordered input-lg w-full" />
            </div>
            
            <div class="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>
              <span>Fiyatlandırma endpoint henüz hazır değil. Şimdilik varsayılan değerler kullanılıyor.</span>
            </div>
            
            <!-- Sistem Fiyatlandırma Bilgileri -->
            <div v-if="pricingData.electricity || pricingData.water" class="bg-base-200 p-4 rounded-lg">
              <h4 class="text-lg font-semibold mb-3">Sistem Fiyatlandırması</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-if="pricingData.electricity && formData.consumptionType === 'electricity'" class="border border-base-300 p-3 rounded">
                  <h5 class="font-medium text-blue-600 mb-2">⚡️ Elektrik</h5>
                  <div class="text-sm space-y-1">
                    <div>Birim Fiyat: <strong>{{ pricingData.electricity.unitPrice }} TL/kWh</strong></div>
                    <div>KDV: <strong>%{{ pricingData.electricity.vatRate }}</strong></div>
                    <div>BTV: <strong>%{{ pricingData.electricity.btvRate }}</strong></div>
                  </div>
                </div>
                
                <div v-if="pricingData.water && formData.consumptionType === 'water'" class="border border-base-300 p-3 rounded">
                  <h5 class="font-medium text-cyan-600 mb-2">💧 Su</h5>
                  <div class="text-sm space-y-1">
                    <div>Birim Fiyat: <strong>{{ pricingData.water.unitPrice }} TL/m³</strong></div>
                    <div>KDV: <strong>%{{ pricingData.water.vatRate }}</strong></div>
                    <div>BTV: <strong>%{{ pricingData.water.btvRate }}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="cost-summary bg-base-200 p-4 rounded-lg">
            <h4 class="text-lg font-semibold mb-3">Maliyet Özeti</h4>
            <div class="space-y-2">
              <div v-for="item in distributionResults" :key="item.flatId" class="border-b border-base-300 pb-2">
                <div class="flex justify-between items-center">
                  <span class="font-medium">{{ item.flatNumber || item.flatCode }}:</span>
                  <span class="font-semibold text-success">{{ item.totalAmount || 0 }} TL</span>
                </div>
                <div v-if="formData.consumptionType === 'both'" class="text-sm text-gray-600 ml-4">
                  <span class="text-blue-600">Elektrik: {{ item.electricityAmount?.toFixed(2) || '0.00' }} TL</span>
                  <span class="mx-2">•</span>
                  <span class="text-cyan-600">Su: {{ item.waterAmount?.toFixed(2) || '0.00' }} TL</span>
                </div>
                <div v-else-if="formData.consumptionType === 'electricity'" class="text-sm text-gray-600 ml-4">
                  <span class="text-blue-600">Elektrik: {{ item.electricityAmount?.toFixed(2) || '0.00' }} TL</span>
                </div>
                <div v-else-if="formData.consumptionType === 'water'" class="text-sm text-gray-600 ml-4">
                  <span class="text-cyan-600">Su: {{ item.waterAmount?.toFixed(2) || '0.00' }} TL</span>
                </div>
              </div>
              <div class="divider"></div>
              <div class="flex justify-between items-center text-lg">
                <strong>Toplam:</strong>
                <strong class="text-success">{{ distributionResults.reduce((sum, item) => sum + (item.totalAmount || 0), 0).toFixed(2) }} TL</strong>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button @click="step = 2" class="btn btn-outline">Geri</button>
            <button @click="applyDistribution" class="btn btn-success" :disabled="!canApply || loading">
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              {{ loading ? 'Uygulanıyor...' : 'Uygula ve Kaydet' }}
            </button>
          </div>
        </div>
        
        <!-- 4. Başarı Aşaması -->
        <div v-if="step === 4" class="success-step text-center">
          <div class="text-6xl mb-4">✅</div>
          <h4 class="text-2xl font-bold text-success mb-4">Ortak Tüketim Başarıyla Uygulandı!</h4>
          <div class="success-details bg-base-200 p-4 rounded-lg text-left max-w-md mx-auto">
            <div class="space-y-2">
              <p><strong>İşlem ID:</strong> {{ applyResult?.operationId }}</p>
              <p><strong>Oluşturulan Sayaç Okumaları:</strong> {{ applyResult?.createdMeterReadings }}</p>
              <p><strong>Oluşturulan Borç Kayıtları:</strong> {{ applyResult?.createdUtilityDebts }}</p>
              <p><strong>Toplam Tutar:</strong> {{ applyResult?.totalAmount }} TL</p>
            </div>
            
            <div v-if="applyResult?.pricingUsed" class="mt-4 p-3 bg-base-100 rounded">
              <h5 class="font-semibold mb-2">Kullanılan Fiyatlandırma</h5>
              <div class="text-sm">
                <div>Birim Fiyat: {{ applyResult.pricingUsed.unitPrice }} TL</div>
                <div>KDV: %{{ applyResult.pricingUsed.vatRate }}</div>
                <div>BTV: %{{ applyResult.pricingUsed.btvRate }}</div>
                <div class="text-xs text-gray-500 mt-1">{{ applyResult.pricingUsed.description }}</div>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button @click="closeModal" class="btn btn-primary">Tamam</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import meterReadingsService from '@/services/meterReadingsService'
import apiService from '@/services/api'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'success'])


const step = ref(1)
const loading = ref(false)
const distributionResults = ref([])
const applyResult = ref(null)

// Form verileri
const formData = ref({
  periodYear: new Date().getFullYear(),
  periodMonth: new Date().getMonth() + 1,
  consumptionType: 'electricity', // 'electricity', 'water'
  // Elektrik tüketimi
  sharedAreaElectricityConsumption: 0,
  mescitElectricityConsumption: 0,
  // Su tüketimi
  sharedAreaWaterConsumption: 0,
  mescitWaterConsumption: 0,
  // Elektrik fiyatlandırma bilgileri
  unitPrice: 2.50, // Varsayılan elektrik fiyatı
  vatRate: 20.00,
  btvRate: 5.00,
  // Su fiyatlandırma bilgileri
  waterUnitPrice: 112.54, // Su birim fiyatı (%1 KDV)
  wasteWaterUnitPrice: 56.27 // Atık su birim fiyatı (%10 KDV)
})

// Uygulama verileri
const applyData = ref({
  dueDate: ''
})

// Sistem fiyatlandırma bilgileri
const pricingData = ref({
  electricity: null,
  water: null
})

// Tüketim türü değiştiğinde varsayılan fiyatları güncelle
watch(() => formData.value.consumptionType, (newType) => {
  if (newType === 'electricity') {
    formData.value.unitPrice = 2.50 // Elektrik varsayılan fiyatı
    formData.value.vatRate = 20.00 // Elektrik KDV
    formData.value.btvRate = 5.00 // Elektrik BTV
  } else if (newType === 'water') {
    formData.value.waterUnitPrice = 112.54 // Su birim fiyatı
    formData.value.wasteWaterUnitPrice = 56.27 // Atık su birim fiyatı
  }
})

// Flat bilgileri
const flatsData = ref([])

// Yardımcı veriler
const months = [
  { value: 1, label: 'Ocak' },
  { value: 2, label: 'Şubat' },
  { value: 3, label: 'Mart' },
  { value: 4, label: 'Nisan' },
  { value: 5, label: 'Mayıs' },
  { value: 6, label: 'Haziran' },
  { value: 7, label: 'Temmuz' },
  { value: 8, label: 'Ağustos' },
  { value: 9, label: 'Eylül' },
  { value: 10, label: 'Ekim' },
  { value: 11, label: 'Kasım' },
  { value: 12, label: 'Aralık' }
]

const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
})

// Hesaplamalar
const totalSharedElectricityConsumption = computed(() => {
  return formData.value.sharedAreaElectricityConsumption + formData.value.mescitElectricityConsumption
})

const totalSharedWaterConsumption = computed(() => {
  return formData.value.sharedAreaWaterConsumption + formData.value.mescitWaterConsumption
})

const totalSharedConsumption = computed(() => {
  return totalSharedElectricityConsumption.value + totalSharedWaterConsumption.value
})

const totalShares = computed(() => {
  return distributionResults.value.reduce((sum, item) => sum + item.shareCount, 0)
})

const perShareElectricityConsumption = computed(() => {
  return totalShares.value > 0 ? totalSharedElectricityConsumption.value / totalShares.value : 0
})

const perShareWaterConsumption = computed(() => {
  return totalShares.value > 0 ? totalSharedWaterConsumption.value / totalShares.value : 0
})

// Validasyonlar
const canCalculate = computed(() => {
  if (!formData.value.periodYear || !formData.value.periodMonth || !formData.value.consumptionType) {
    return false
  }
  
  switch (formData.value.consumptionType) {
    case 'electricity':
      return totalSharedElectricityConsumption.value > 0
    case 'water':
      return totalSharedWaterConsumption.value > 0
    default:
      return false
  }
})

const canApply = computed(() => {
  return applyData.value.dueDate && distributionResults.value.length > 0
})

// Fonksiyonlar

// Flat bilgilerini yükle
const loadFlatsData = async () => {
  try {
    console.log('🏠 Flat bilgileri yükleniyor...')
    const response = await apiService.get('/flats')
    flatsData.value = response
    console.log('✅ Flat bilgileri yüklendi:', flatsData.value.length, 'flat')
  } catch (error) {
    console.error('❌ Flat bilgileri yüklenirken hata:', error)
    flatsData.value = []
  }
}

// Tenant adını getir
const getTenantName = (flatId) => {
  const flat = flatsData.value.find(f => f.id === flatId)
  return flat?.tenantCompanyName || 'Bilinmiyor'
}

// Sistem fiyatlandırma bilgilerini yükle
const loadPricingData = async () => {
  try {
    console.log('⚠️ Fiyatlandırma endpoint henüz hazır değil, varsayılan değerler kullanılıyor')
    // Backend'de UtilityPricingConfigurations tablosu henüz hazır değil
    // Şimdilik varsayılan değerler kullanıyoruz
    pricingData.value = {
      electricity: { unitPrice: 2.50, vatRate: 20, btvRate: 5 },
      water: { unitPrice: 15.00, vatRate: 20, btvRate: 5 }
    }
    
    console.log('💰 Varsayılan fiyatlar yüklendi:', pricingData.value)
  } catch (error) {
    console.error('❌ Fiyatlandırma bilgileri yüklenirken hata:', error)
    // Hata durumunda varsayılan değerler
    pricingData.value = {
      electricity: { unitPrice: 2.50, vatRate: 20, btvRate: 5 },
      water: { unitPrice: 15.00, vatRate: 20, btvRate: 5 }
    }
  }
}

const calculateDistribution = async () => {
  loading.value = true
  try {
    // Önce gerekli verileri yükle
    await Promise.all([
      loadPricingData(),
      loadFlatsData()
    ])
    
    // Yeni API dokümantasyonuna göre request hazırla
    const request = {
      periodYear: formData.value.periodYear,
      periodMonth: formData.value.periodMonth,
      meterType: getConsumptionTypeAsNumber(formData.value.consumptionType) // ✅ meterType kullanılıyor
    }
    
    // Tüketim türüne göre alanları ekle
    if (formData.value.consumptionType === 'electricity') {
      request.sharedAreaConsumption = formData.value.sharedAreaElectricityConsumption
      request.mescitConsumption = formData.value.mescitElectricityConsumption
    }
    
    if (formData.value.consumptionType === 'water') {
      request.sharedAreaConsumption = formData.value.sharedAreaWaterConsumption
      request.mescitConsumption = formData.value.mescitWaterConsumption
    }
    
    console.log('📤 Dağıtım request gönderiliyor:', request)
    
    const results = await meterReadingsService.distributeSharedConsumption(request)
    
    // Flat numaralarını ekle ve maliyet hesapla
    distributionResults.value = results.map(item => {
      const flat = flatsData.value.find(f => f.id === item.flatId)
      
      // Basit maliyet hesaplama (geçici çözüm)
      let totalAmount = 0
      let electricityAmount = 0
      let waterAmount = 0
      
      // ⚠️ Backend'den type bilgisi gelmiyor, frontend'de türü belirle
      const consumptionType = formData.value.consumptionType
      
      if (consumptionType === 'electricity') {
        // Sadece elektrik
        const baseAmount = (item.distributedConsumption || 0) * (pricingData.value.electricity?.unitPrice || 2.5)
        const vatAmount = baseAmount * ((pricingData.value.electricity?.vatRate || 20) / 100)
        const btvAmount = baseAmount * ((pricingData.value.electricity?.btvRate || 5) / 100)
        electricityAmount = baseAmount + vatAmount + btvAmount
        totalAmount = electricityAmount
      } else if (consumptionType === 'water') {
        // Sadece su
        const baseAmount = (item.distributedConsumption || 0) * (pricingData.value.water?.unitPrice || 15.0)
        const vatAmount = baseAmount * ((pricingData.value.water?.vatRate || 20) / 100)
        const btvAmount = baseAmount * ((pricingData.value.water?.btvRate || 5) / 100)
        waterAmount = baseAmount + vatAmount + btvAmount
        totalAmount = waterAmount
      }
      
      return {
        ...item,
        flatNumber: flat?.code || 'Bilinmiyor',
        totalAmount: totalAmount,
        electricityAmount: electricityAmount,
        waterAmount: waterAmount,
        consumptionType: consumptionType // Frontend'de belirlenen tür
      }
    })
    
    console.log('📊 Dağıtım sonuçları hazırlandı:', distributionResults.value)
    step.value = 2
  } catch (error) {
    console.error('Dağıtım hesaplanırken hata:', error)
    alert('Dağıtım hesaplanırken hata oluştu: ' + error.message)
  } finally {
    loading.value = false
  }
}

// Hesaplama işlemleri backend'de yapılacak

// ConsumptionType string'ini numeric type'a çevir
const getConsumptionTypeAsNumber = (consumptionType) => {
  switch (consumptionType) {
    case 'electricity': return 0
    case 'water': return 1
    default: return 0
  }
}

const applyDistribution = async () => {
  loading.value = true
  try {
    const request = {
      operationId: `shared-consumption-${formData.value.periodYear}-${formData.value.periodMonth}-${Date.now()}`,
      periodYear: formData.value.periodYear,
      periodMonth: formData.value.periodMonth,
      dueDate: applyData.value.dueDate,
      meterType: getConsumptionTypeAsNumber(formData.value.consumptionType), // ✅ meterType kullanılıyor
      vatRate: formData.value.consumptionType === 'electricity' ? formData.value.vatRate : 1.00, // Su için %1 KDV
      btvRate: formData.value.consumptionType === 'electricity' ? formData.value.btvRate : 10.00, // Su için %10 KDV (atık su)
      defaultUnitPrice: formData.value.consumptionType === 'electricity' ? formData.value.unitPrice : formData.value.waterUnitPrice,
      items: distributionResults.value.map(item => {
        const flat = flatsData.value.find(f => f.id === item.flatId)
        const flatNumber = flat?.code || flat?.unitNumber || 'Bilinmiyor'
        const consumptionTypeText = formData.value.consumptionType === 'electricity' ? 'Elektrik' : 'Su'
        
        // Su için özel hesaplama
        let unitPrice = formData.value.unitPrice
        if (formData.value.consumptionType === 'water') {
          // Su için: Su birim fiyatı + Atık su birim fiyatı
          unitPrice = formData.value.waterUnitPrice + formData.value.wasteWaterUnitPrice
        }
        
        return {
          flatId: item.flatId,
          shareCount: item.shareCount,
          distributedConsumption: item.distributedConsumption || 0,
          unitPrice: unitPrice, // ✅ Hesaplanmış birim fiyat
          note: `Ortak Alan Tüketimi - ${flatNumber} (${consumptionTypeText}) - MeterType:${getConsumptionTypeAsNumber(formData.value.consumptionType)}`
        }
      })
    }
    
    const result = await meterReadingsService.applySharedConsumption(request)
    applyResult.value = result
    step.value = 4
    
    // Parent component'e başarı bildirimi gönder
    emit('success', result)
  } catch (error) {
    console.error('Dağıtım uygulanırken hata:', error)
    alert('Dağıtım uygulanırken hata oluştu: ' + error.message)
  } finally {
    loading.value = false
  }
}


const closeModal = () => {
  // Form verilerini sıfırla
  step.value = 1
  formData.value = {
    periodYear: new Date().getFullYear(),
    periodMonth: new Date().getMonth() + 1,
    consumptionType: 'electricity',
    sharedAreaElectricityConsumption: 0,
    mescitElectricityConsumption: 0,
    sharedAreaWaterConsumption: 0,
    mescitWaterConsumption: 0
  }
  applyData.value = {
    dueDate: ''
  }
  distributionResults.value = []
  applyResult.value = null
  pricingData.value = {
    electricity: null,
    water: null
  }
  flatsData.value = []
  
  emit('close')
}

</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: hsl(var(--b1));
  border: 1px solid hsl(var(--bc) / 0.2);
  border-radius: 16px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid hsl(var(--bc) / 0.1);
}

.modal-header h3 {
  margin: 0;
  color: hsl(var(--bc));
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: hsl(var(--bc) / 0.7);
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: hsl(var(--bc) / 0.1);
  color: hsl(var(--bc));
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.period-selector {
  display: flex;
  gap: 12px;
}

.period-selector select {
  flex: 1;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
}

.results-table {
  margin: 20px 0;
}

.success-step {
  padding: 20px 0;
}

.success-details {
  margin: 20px 0;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .period-selector {
    flex-direction: column;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
