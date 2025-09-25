<template>
  <dialog id="waterModal" class="modal" open>
    <div class="modal-box max-w-7xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Su Sayaç Okuması</h3>
        </div>
        <button @click="$emit('close')" class="btn btn-ghost btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Tarih Alanları ve Form -->
      <div class="space-y-4 mb-6">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="form-control">
            <label class="label"><span class="label-text">Dönem (Yıl/Ay)</span></label>
            <input type="month" v-model="selectedPeriod" class="input input-bordered" placeholder="örn. 2024-07" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">İlk Okuma Tarihi</span></label>
            <input type="date" v-model="firstReadingDate" class="input input-bordered" placeholder="örn. 2024-07-01" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Son Okuma Tarihi</span></label>
            <input type="date" v-model="lastReadingDate" class="input input-bordered" placeholder="örn. 2024-07-31" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Son Ödeme Tarihi</span></label>
            <input type="date" v-model="paymentDueDate" class="input input-bordered" placeholder="örn. 2024-08-10" />
          </div>
        </div>
      </div>

      <!-- Fiyatlandırma Bilgileri -->
      <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6">
        <h4 class="text-lg font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
          💰 Su Fiyatlandırma Bilgileri
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Su Birim Fiyatı (₺/m³) - %1 KDV
            </label>
            <input 
              type="number" 
              step="0.01" 
              v-model="waterUnitPrice"
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
              v-model="wasteWaterUnitPrice"
              placeholder="56.27"
              class="input input-bordered input-lg w-full"
            />
          </div>
        </div>
      </div>

        <!-- Sayaç Tablosu -->
        <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Sayaç Okumaları</h4>
            <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
              {{ readings.length }} Birim
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="table w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <thead class="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th class="text-gray-700 dark:text-gray-300 font-semibold">Daire</th>
                  <th class="text-gray-700 dark:text-gray-300 font-semibold">Önceki Sayaç</th>
                  <th class="text-gray-700 dark:text-gray-300 font-semibold">Yeni Sayaç</th>
                  <th class="text-gray-700 dark:text-gray-300 font-semibold">Tüketim (m³)</th>
                  <th class="text-gray-700 dark:text-gray-300 font-semibold">Not</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(reading, index) in readings" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  <td class="font-medium text-gray-800 dark:text-gray-100">
                    {{ reading.flatNumber }}
                    <span v-if="!reading.isActive" class="badge badge-warning badge-xs ml-1">Pasif</span>
                  </td>
                  
                  <!-- Önceki Sayaç -->
                  <td>
                    <input
                      type="number"
                      class="input input-bordered input-sm w-24 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                      :value="reading.previousReading"
                      disabled
                    />
                  </td>
                  
                  <!-- Yeni Sayaç -->
                  <td>
                    <input
                      type="number"
                      class="input input-bordered input-sm w-24 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      v-model.number="reading.currentReading"
                      @input="calculate(index)"
                      step="0.01"
                    />
                  </td>
                  
                  <!-- Tüketim -->
                  <td class="font-semibold text-blue-600 dark:text-blue-400">{{ formatDecimal(reading.consumption) }}</td>
                  
                  <!-- Not -->
                  <td>
                    <input
                      type="text"
                      class="input input-bordered input-sm w-32 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      v-model="reading.note"
                      placeholder="Not..."
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      <!-- Modal Actions -->
      <div class="modal-action flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <div class="flex gap-2">
          <button 
            class="btn btn-success btn-sm" 
            @click="savePartialReadings"
            :disabled="!hasAnyReadings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Girilenleri Kaydet
          </button>
          <button 
            class="btn btn-primary btn-sm" 
            @click="saveReadings"
            :disabled="!hasAllReadings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tümünü Kaydet
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
import { ref, onMounted, computed } from 'vue'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useNotification } from '@/composables/useNotification'
import meterReadingsService from '@/services/meterReadingsService.js'
import apiService from '@/services/api.js'

// Emit tanımı
const emit = defineEmits(['close'])

const selectedPeriod = ref(new Date().toISOString().slice(0, 7))
const firstReadingDate = ref('')
const lastReadingDate = ref('')
const paymentDueDate = ref('')
const readings = ref([])

// Su fiyatlandırma bilgileri
const waterUnitPrice = ref(112.54) // Su birim fiyatı (%1 KDV)
const wasteWaterUnitPrice = ref(56.27) // Atık su birim fiyatı (%10 KDV)

// Kayıt durumu kontrolleri
const hasAnyReadings = computed(() => {
  return readings.value.some(r => r.currentReading > 0)
})

const hasAllReadings = computed(() => {
  return readings.value.every(r => r.currentReading > 0)
})

const formatDecimal = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '0.00'
  return Number(value).toFixed(2)
}

const calculate = (index) => {
  const r = readings.value[index]
  r.consumption = Math.max(0, r.currentReading - r.previousReading)
}

const fetchFlatsAndPrevious = async () => {
  try {
    // Daireleri getir
    const flats = await apiService.get('/flats')
    
    readings.value = []
    
    // Sadece aktif ve dolu daireleri filtrele (Floor tipi)
    const activeFlats = flats.filter(flat => 
      flat.isActive && 
      flat.isOccupied && 
      flat.type === 0 // UnitType.Floor
    )
    
    // Her daire için son okumayı getir
    for (const flat of activeFlats) {
      try {
        const lastReading = await meterReadingsService.getLastReading(flat.id, 'Water')
        readings.value.push({
          flatId: flat.id,
          flatNumber: flat.code || flat.unitNumber,
          isActive: flat.isActive,
          previousReading: lastReading ? lastReading.readingValue : 0,
          currentReading: 0,
          consumption: 0,
          note: ''
        })
      } catch (error) {
        console.error(`Daire ${flat.unitNumber} için son okuma alınırken hata:`, error)
        readings.value.push({
          flatId: flat.id,
          flatNumber: flat.code || flat.unitNumber,
          isActive: flat.isActive,
          previousReading: 0,
          currentReading: 0,
          consumption: 0,
          note: ''
        })
      }
    }

  } catch (error) {
    console.error('Veri yükleme hatası:', error)
    alert('Veriler yüklenirken bir hata oluştu.')
  }
}

const saveReadings = async () => {
  try {
    const [year, month] = selectedPeriod.value.split('-').map(Number)
    const filledReadings = readings.value.filter(r => r.currentReading > 0)
    
    // Toplu kaydetme için bulk-upsert kullan - DOĞRU FORMAT
    const items = filledReadings.map(r => {
      // Consumption hesapla: current - previous
      const consumption = Math.max(0, parseFloat(r.currentReading) - parseFloat(r.previousReading || 0))
      
      // Su için fiyatlandırma hesaplaması
      const waterAmount = consumption * waterUnitPrice.value // Su bedeli
      const wasteWaterAmount = consumption * wasteWaterUnitPrice.value // Atık su bedeli
      const waterVat = waterAmount * 0.01 // %1 KDV
      const wasteWaterVat = wasteWaterAmount * 0.10 // %10 KDV
      const totalAmount = waterAmount + wasteWaterAmount + waterVat + wasteWaterVat
      
      return {
        id: null, // Yeni kayıt için null
        flatId: r.flatId, // GUID string olarak
        type: 1, // Water = 1
        periodYear: year,
        periodMonth: month,
        readingValue: parseFloat(r.currentReading),
        consumption: consumption, // Hesaplanan consumption
        readingDate: lastReadingDate.value ? new Date(lastReadingDate.value).toISOString() : new Date().toISOString(),
        note: r.note || `Su: ${waterAmount.toFixed(2)}₺, Atık Su: ${wasteWaterAmount.toFixed(2)}₺, Toplam: ${totalAmount.toFixed(2)}₺`,
        // Fiyatlandırma bilgileri
        waterUnitPrice: waterUnitPrice.value,
        wasteWaterUnitPrice: wasteWaterUnitPrice.value,
        waterAmount: waterAmount,
        wasteWaterAmount: wasteWaterAmount,
        waterVat: waterVat,
        wasteWaterVat: wasteWaterVat,
        totalAmount: totalAmount
      }
    })

    // Debug için console log
    console.log('Water BulkUpsert Request Items:', JSON.stringify(items, null, 2))

    const result = await meterReadingsService.bulkUpsertMeterReadings(items)
    emit('close', { shouldRefresh: true, successMessage: `${result.affected} su okuması başarıyla kaydedildi.` })
  } catch (error) {
    console.error('Kaydetme hatası:', error)
    alert('Kayıtlar kaydedilirken bir hata oluştu: ' + error.message)
  }
}

const savePartialReadings = async () => {
  try {
    const [year, month] = selectedPeriod.value.split('-').map(Number)
    const filledReadings = readings.value.filter(r => r.currentReading > 0)
    
    // Toplu kaydetme için bulk-upsert kullan - DOĞRU FORMAT
    const items = filledReadings.map(r => {
      // Consumption hesapla: current - previous
      const consumption = Math.max(0, parseFloat(r.currentReading) - parseFloat(r.previousReading || 0))
      
      // Su için fiyatlandırma hesaplaması
      const waterAmount = consumption * waterUnitPrice.value // Su bedeli
      const wasteWaterAmount = consumption * wasteWaterUnitPrice.value // Atık su bedeli
      const waterVat = waterAmount * 0.01 // %1 KDV
      const wasteWaterVat = wasteWaterAmount * 0.10 // %10 KDV
      const totalAmount = waterAmount + wasteWaterAmount + waterVat + wasteWaterVat
      
      return {
        id: null, // Yeni kayıt için null
        flatId: r.flatId, // GUID string olarak
        type: 1, // Water = 1
        periodYear: year,
        periodMonth: month,
        readingValue: parseFloat(r.currentReading),
        consumption: consumption, // Hesaplanan consumption
        readingDate: lastReadingDate.value ? new Date(lastReadingDate.value).toISOString() : new Date().toISOString(),
        note: r.note || `Su: ${waterAmount.toFixed(2)}₺, Atık Su: ${wasteWaterAmount.toFixed(2)}₺, Toplam: ${totalAmount.toFixed(2)}₺`,
        // Fiyatlandırma bilgileri
        waterUnitPrice: waterUnitPrice.value,
        wasteWaterUnitPrice: wasteWaterUnitPrice.value,
        waterAmount: waterAmount,
        wasteWaterAmount: wasteWaterAmount,
        waterVat: waterVat,
        wasteWaterVat: wasteWaterVat,
        totalAmount: totalAmount
      }
    })

    // Debug için console log
    console.log('Water Partial BulkUpsert Request Items:', JSON.stringify(items, null, 2))

    const result = await meterReadingsService.bulkUpsertMeterReadings(items)
    emit('close', { shouldRefresh: true, successMessage: `${result.affected} su okuması başarıyla kaydedildi.` })
  } catch (error) {
    console.error('Kaydetme hatası:', error)
    alert('Kayıtlar kaydedilirken bir hata oluştu: ' + error.message)
  }
}

onMounted(fetchFlatsAndPrevious)
</script>