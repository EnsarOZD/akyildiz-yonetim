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
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Su Sayaç Girişi</h3>
        </div>
        <button @click="$emit('close')" class="btn btn-ghost btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form Controls -->
      <div class="space-y-6">
        <!-- Dönem Seçimi -->
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Dönem</span>
          </label>
          <input 
            type="month" 
            v-model="selectedPeriod" 
            class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" 
          />
        </div>

        <!-- Tarih Bilgileri -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Başlangıç Tarihi</span>
            </label>
            <input 
              type="date" 
              v-model="startDate" 
              class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" 
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Bitiş Tarihi</span>
            </label>
            <input 
              type="date" 
              v-model="endDate" 
              class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" 
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Son Ödeme Tarihi</span>
            </label>
            <input 
              type="date" 
              v-model="dueDate" 
              class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" 
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Gün Sayısı</span>
            </label>
            <input 
              type="number" 
              :value="dayCount" 
              disabled 
              class="input input-bordered w-full bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400" 
            />
          </div>
        </div>

        <!-- Birim Fiyatlar -->
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Birim Fiyatlar</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Su Birim Fiyatı (₺/m³)</span>
              </label>
              <input 
                type="number" 
                v-model.number="waterUnitPrice" 
                class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" 
                step="0.01" 
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Atık Su Birim Fiyatı (₺/m³)</span>
              </label>
              <input 
                type="number" 
                v-model.number="wasteUnitPrice" 
                class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" 
                step="0.01" 
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
                  <th class="text-gray-700 dark:text-gray-300 font-semibold">Kat</th>
                  <th class="text-gray-700 dark:text-gray-300 font-semibold">Şirket</th>
                  <th class="text-gray-700 dark:text-gray-300 font-semibold">Önceki Sayaç</th>
                  <th class="text-gray-700 dark:text-gray-300 font-semibold">Yeni Sayaç</th>
                  <th class="text-gray-700 dark:text-gray-300 font-semibold">Tüketim (m³)</th>
                  <th class="text-gray-700 dark:text-gray-300 font-semibold">KDV Hariç</th>
                  <th class="text-gray-700 dark:text-gray-300 font-semibold">KDV Dahil</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(reading, index) in readings" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  <td class="font-medium text-gray-800 dark:text-gray-100">
                    {{ reading.unit }}
                    <span v-if="reading.isActive === false" class="badge badge-warning badge-xs ml-1">Pasif</span>
                  </td>
                  <td class="text-gray-700 dark:text-gray-300">
                    {{ reading.name }}
                    <span v-if="reading.isActive === false" class="text-xs text-gray-500 dark:text-gray-400 block">(Pasif Kiracı)</span>
                  </td>
                  
                  <!-- Önceki Sayaç -->
                  <td>
                    <input
                      type="number"
                      class="input input-bordered input-sm w-24 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      v-model.number="reading.previous"
                      @input="calculate(index)"
                    />
                  </td>
                  
                  <!-- Yeni Sayaç -->
                  <td>
                    <input
                      type="number"
                      class="input input-bordered input-sm w-24 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      v-model.number="reading.current"
                      @input="calculate(index)"
                    />
                  </td>
                  
                  <!-- Tüketim -->
                  <td class="font-semibold text-blue-600 dark:text-blue-400">{{ formatDecimal(reading.usage) }}</td>
                  
                  <!-- KDV Hariç -->
                  <td class="font-medium text-gray-800 dark:text-gray-100">{{ formatDecimal(reading.kdvHaric) }}</td>
                  
                  <!-- KDV Dahil -->
                  <td class="font-bold text-green-600 dark:text-green-400">{{ formatDecimal(reading.kdvDahil) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="modal-action flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <div class="flex gap-2">
          <button 
            class="btn btn-success btn-sm" 
            @click="savePartialReadings"
            :disabled="!hasAnyReadings || !isValidDateRange"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Girilenleri Kaydet
          </button>
          <button 
            class="btn btn-primary btn-sm" 
            @click="saveReadings"
            :disabled="!hasAllReadings || !isValidDateRange"
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
import { ref, computed, onMounted, watch } from 'vue'
import { db } from '../../firebase'
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { meterManager, calculateConsumption, calculateTotalWithVAT } from '../../utils/meterUtils'

const tenants = ref([])
const readings = ref([])
const selectedPeriod = ref(new Date().toISOString().slice(0, 7))
const startDate = ref('')
const endDate = ref('')
const dueDate = ref('')
const waterUnitPrice = ref(0)
const wasteUnitPrice = ref(0)

const dayCount = computed(() => {
  if (!startDate.value || !endDate.value) return 0
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  const diffTime = end - start
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
})

// Validasyon kontrolleri
const isValidDateRange = computed(() => {
  return startDate.value && endDate.value && dayCount.value > 0
})

const hasAnyReadings = computed(() => {
  return readings.value.some(r => r.previous >= 0 && r.current > r.previous)
})

const hasAllReadings = computed(() => {
  return readings.value.every(r => r.previous >= 0 && r.current > r.previous)
})

const formatDecimal = (val) => isNaN(val) ? '0.00' : Number(val).toFixed(2)

const fetchTenants = async () => {
  tenants.value = []
  readings.value = []
  const processedUnits = new Set()

  const staticUnits = [
    { tenantId: 'ortak', unit: 'ORTAK ALAN', name: 'ORTAK ALAN' },
    { tenantId: 'mescit', unit: 'MESCİT', name: 'MESCİT' }
  ]

  // Tüm birimleri topla
  const allUnits = [...staticUnits.map(s => s.unit)]
  
  // Kiracıları getir ve birimleri ekle (aktif/pasif fark etmeksizin)
  const snapshot = await getDocs(collection(db, 'tenants'))
  
  snapshot.forEach(doc => {
    const data = doc.data()
    // isActive kontrolünü kaldırdık - tüm kiracıları göster
    for (const unit of data.units || []) {
      if (!processedUnits.has(unit)) {
        allUnits.push(unit)
        processedUnits.add(unit)
      }
    }
  })

  // Batch olarak son okumaları getir
  const lastReadingsMap = await meterManager.getLastReadingsBatch(allUnits, 'water')

  // Static birimler için okumaları oluştur
  for (const s of staticUnits) {
    const lastReading = lastReadingsMap.get(s.unit)
    readings.value.push({
      ...s,
      previous: lastReading ? lastReading.currentValue : 0,
      current: 0,
      usage: 0,
      kdvHaric: 0,
      kdvDahil: 0
    })
  }

  // Kiracı birimleri için okumaları oluştur (aktif/pasif fark etmeksizin)
  snapshot.forEach(doc => {
    const data = doc.data()
    // isActive kontrolünü kaldırdık - tüm kiracıları göster
    for (const unit of data.units || []) {
      const lastReading = lastReadingsMap.get(unit)
      const reading = {
        tenantId: doc.id,
        unit,
        name: data.company,
        isActive: data.isActive, // Aktiflik durumunu sakla
        previous: lastReading ? lastReading.currentValue : 0,
        current: 0,
        usage: 0,
        kdvHaric: 0,
        kdvDahil: 0
      }
      readings.value.push(reading)
    }
  })
}

const calculate = (i) => {
  const r = readings.value[i]
  r.usage = calculateConsumption(r.current, r.previous)

  const s = r.usage * (waterUnitPrice.value + wasteUnitPrice.value)
  const suKdv = r.usage * waterUnitPrice.value * 0.01
  const atikKdv = r.usage * wasteUnitPrice.value * 0.10

  r.kdvHaric = s
  r.kdvDahil = s + suKdv + atikKdv
  r.toplamTutar = r.kdvDahil
}

watch([waterUnitPrice, wasteUnitPrice], () => {
  readings.value.forEach((_, idx) => calculate(idx))
})

const save = async (onlyFilled = false) => {
  if (!isValidDateRange.value) {
    alert('Lütfen geçerli bir tarih aralığı seçin.')
    return
  }

  const colRef = collection(db, 'readings')
  const dataToSave = onlyFilled
    ? readings.value.filter(r => r.previous >= 0 && r.current > r.previous)
    : readings.value

  for (const r of dataToSave) {
    await addDoc(colRef, {
      tenantId: r.tenantId,
      unit: r.unit,
      period: selectedPeriod.value,
      type: 'water',
      previousValue: r.previous,
      currentValue: r.current,
      usage: r.usage,
      kdvHaric: r.kdvHaric,
      kdvDahil: r.kdvDahil,
      startDate: startDate.value,
      endDate: endDate.value,
      dueDate: dueDate.value,
      dayCount: dayCount.value,
      waterUnitPrice: waterUnitPrice.value,
      wasteUnitPrice: wasteUnitPrice.value,
      createdAt: new Date()
    })
  }

  // Cache'i temizle
  meterManager.clearCache()

  alert(onlyFilled ? 'Girilen kayıtlar eklendi.' : 'Tüm kayıtlar eklendi.')
  readings.value = []
  fetchTenants()
}

const saveReadings = () => save(false)
const savePartialReadings = () => save(true)

onMounted(fetchTenants)
</script>
