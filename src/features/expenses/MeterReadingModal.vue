<template>
  <dialog id="meterReadingModal" class="modal" open>
    <div class="modal-box max-w-7xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
            {{ isEditMode ? 'Sayaç Okuması Düzenle' : 'Yeni Sayaç Okuması' }}
          </h3>
        </div>
        <button @click="$emit('close')" class="btn btn-ghost btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- Sayaç Tipi Seçimi -->
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Sayaç Tipi</span>
          </label>
          <select 
            v-model="form.type" 
            class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            :disabled="isEditMode"
          >
            <option value="Electricity">⚡ Elektrik</option>
            <option value="Water">💧 Su</option>
          </select>
        </div>

        <!-- Daire Seçimi -->
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Daire</span>
          </label>
          <select 
            v-model="form.flatId" 
            class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            :disabled="isEditMode"
          >
            <option value="">Daire seçin...</option>
            <option v-for="flat in flats" :key="flat.id" :value="flat.id">
              {{ flat.code || flat.unitNumber }} - {{ flat.floorNumber || flat.floor }}. Kat ({{ flat.unitArea }}m²)
            </option>
          </select>
        </div>

        <!-- Dönem Seçimi -->
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Dönem</span>
          </label>
          <input 
            type="month" 
            v-model="form.period" 
            class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" 
          />
        </div>

        <!-- Okuma Tarihi -->
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Okuma Tarihi</span>
          </label>
          <input 
            type="date" 
            v-model="form.readingDate" 
            class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" 
          />
        </div>

        <!-- Sayaç Değeri -->
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-gray-300">
              Sayaç Değeri ({{ form.type === 'Electricity' ? 'kWh' : 'm³' }})
            </span>
          </label>
          <input 
            type="number" 
            v-model.number="form.readingValue" 
            class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            step="0.01"
            min="0"
          />
        </div>

        <!-- Önceki Okuma (Sadece düzenleme modunda) -->
        <div v-if="isEditMode && previousReading" class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Önceki Okuma</span>
          </label>
          <input 
            type="number" 
            :value="previousReading.readingValue" 
            class="input input-bordered w-full bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
            disabled
          />
        </div>

        <!-- Tüketim (Sadece düzenleme modunda) -->
        <div v-if="isEditMode && previousReading" class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-gray-300">
              Tüketim ({{ form.type === 'Electricity' ? 'kWh' : 'm³' }})
            </span>
          </label>
          <input 
            type="number" 
            :value="consumption" 
            class="input input-bordered w-full bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300"
            disabled
          />
        </div>

        <!-- Not -->
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Not</span>
          </label>
          <textarea 
            v-model="form.note" 
            class="textarea textarea-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            placeholder="Sayaç okuması hakkında not..."
            rows="3"
          ></textarea>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="modal-action flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <div class="flex gap-2">
          <button 
            class="btn btn-primary btn-sm" 
            @click="saveReading"
            :disabled="!isFormValid || loading"
          >
            <div v-if="loading" class="loading loading-spinner loading-sm"></div>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {{ isEditMode ? 'Güncelle' : 'Kaydet' }}
          </button>
        </div>
        <button class="btn btn-outline btn-sm" @click="$emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Kapat
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useNotification } from '@/composables/useNotification'
import meterReadingsService from '@/services/meterReadingsService.js'
import apiService from '@/services/api.js'

// Props ve Emits
const props = defineProps({
  reading: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

// Reactive state
const loading = ref(false)
const flats = ref([])
const previousReading = ref(null)

// Form data
const form = ref({
  type: 'Electricity',
  flatId: '',
  period: new Date().toISOString().slice(0, 7),
  readingDate: new Date().toISOString().slice(0, 10),
  readingValue: null,
  note: ''
})

// Computed properties
const isEditMode = computed(() => !!props.reading)

const isFormValid = computed(() => {
  return form.value.type && 
         form.value.flatId && 
         form.value.period && 
         form.value.readingDate && 
         form.value.readingValue !== null && 
         form.value.readingValue >= 0
})

const consumption = computed(() => {
  if (!previousReading.value || !form.value.readingValue) return 0
  return Math.max(0, form.value.readingValue - previousReading.value.readingValue)
})

// Methods
const fetchFlats = async () => {
  try {
    const response = await apiService.get('/flats')
    // Sadece aktif ve dolu daireleri filtrele (Floor tipi)
    flats.value = (response || []).filter(flat => 
      flat.isActive && 
      flat.isOccupied && 
      flat.type === 0 // UnitType.Floor
    )
  } catch (error) {
    console.error('Daireler yüklenirken hata:', error)
  }
}

const fetchPreviousReading = async () => {
  if (!form.value.flatId || !form.value.type) return
  
  try {
    const lastReading = await meterReadingsService.getLastReading(form.value.flatId, form.value.type)
    previousReading.value = lastReading
  } catch (error) {
    console.error('Önceki okuma yüklenirken hata:', error)
    previousReading.value = null
  }
}

const saveReading = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  try {
    const [year, month] = form.value.period.split('-').map(Number)
    const readingData = {
      flatId: form.value.flatId,
      type: form.value.type === 'Electricity' ? 0 : 1, // String'den number'a çevir
      periodYear: year,
      periodMonth: month,
      readingValue: parseFloat(form.value.readingValue),
      consumption: null, // Otomatik hesapla
      readingDate: form.value.readingDate,
      note: form.value.note || null
    }

    // Debug için console log
    console.log('MeterReading Request Data:', JSON.stringify(readingData, null, 2))

    if (isEditMode.value) {
      await meterReadingsService.updateMeterReading(props.reading.id, readingData)
      useNotification().showSuccess('Sayaç okuması başarıyla güncellendi')
    } else {
      await meterReadingsService.createMeterReading(readingData)
      useNotification().showSuccess('Sayaç okuması başarıyla kaydedildi')
    }
    
    emit('close', true) // Refresh parent data
  } catch (error) {
    useErrorHandler().handleNetworkError(error, { 
      component: 'MeterReadingModal', 
      action: isEditMode.value ? 'updateMeterReading' : 'createMeterReading' 
    })
  } finally {
    loading.value = false
  }
}

// Initialize form for edit mode
const initializeForm = () => {
  if (props.reading) {
    form.value = {
      type: props.reading.type,
      flatId: props.reading.flatId,
      period: `${props.reading.periodYear}-${props.reading.periodMonth.toString().padStart(2, '0')}`,
      readingDate: props.reading.readingDate,
      readingValue: props.reading.readingValue,
      note: props.reading.note || ''
    }
  }
}

// Watchers
watch(() => form.value.flatId, () => {
  if (form.value.flatId && form.value.type) {
    fetchPreviousReading()
  }
})

watch(() => form.value.type, () => {
  if (form.value.flatId && form.value.type) {
    fetchPreviousReading()
  }
})

// Lifecycle
onMounted(async () => {
  await fetchFlats()
  initializeForm()
  if (form.value.flatId && form.value.type) {
    await fetchPreviousReading()
  }
})
</script> 