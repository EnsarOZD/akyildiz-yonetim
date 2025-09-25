<template>
  <dialog id="electricityModal" class="modal" open>
    <div class="modal-box max-w-7xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Elektrik Sayaç Okuması</h3>
        </div>
        <button @click="$emit('close')" class="btn btn-ghost btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Ortak Alanlar ve Form -->
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
        
        <!-- Fiyat ve Oran Alanları -->
        <div class="flex flex-wrap gap-4 items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div class="form-control">
            <label class="label"><span class="label-text">Birim Fiyat (₺/kWh)</span></label>
            <input type="number" v-model.number="unitPrice" step="0.01" class="input input-bordered w-32" placeholder="0.00" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">BTV Oranı (%)</span></label>
            <input type="number" v-model.number="btvRate" step="0.01" class="input input-bordered w-32" placeholder="0.00" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">KDV Oranı (%)</span></label>
            <input type="number" v-model.number="kdvRate" step="0.01" class="input input-bordered w-32" placeholder="20.00" />
          </div>
          <button class="btn btn-info mt-6" @click="distributeSharedConsumption" :disabled="loading">Ortak Tüketimi Katlara Bölüştür</button>
        </div>
      </div>

      <!-- Kat Bazlı Tablo -->
      <div class="overflow-x-auto">
        <table class="table w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <thead class="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th>Kat/Daire</th>
              <th>Önceki Değer</th>
              <th>Sonraki Değer</th>
              <th>Tüketim (kWh)</th>
              <th>Tutar (₺)</th>
              <th>Not</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <!-- Ortak Alan Satırı -->
            <tr class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
              <td class="font-semibold text-blue-700 dark:text-blue-300">Ortak Alan</td>
              <td>
                <input type="number" v-model.number="sharedArea.previousReading" @input="updateSharedAreaConsumption" class="input input-bordered input-sm w-24" placeholder="örn. 12345" />
              </td>
              <td>
                <input type="number" v-model.number="sharedArea.currentReading" @input="updateSharedAreaConsumption" class="input input-bordered input-sm w-24" placeholder="örn. 12500" />
              </td>
              <td>{{ sharedArea.individualConsumption }}</td>
              <td>{{ calculateAmount(sharedArea.individualConsumption) }}</td>
              <td>
                <input type="text" v-model="sharedArea.note" class="input input-bordered input-sm w-32" placeholder="Açıklama..." />
              </td>
            </tr>
            <!-- Mescit Satırı -->
            <tr class="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500">
              <td class="font-semibold text-green-700 dark:text-green-300">Mescit</td>
              <td>
                <input type="number" v-model.number="mescit.previousReading" @input="updateMescitConsumption" class="input input-bordered input-sm w-24" placeholder="örn. 12345" />
              </td>
              <td>
                <input type="number" v-model.number="mescit.currentReading" @input="updateMescitConsumption" class="input input-bordered input-sm w-24" placeholder="örn. 12500" />
              </td>
              <td>{{ mescit.individualConsumption }}</td>
              <td>{{ calculateAmount(mescit.individualConsumption) }}</td>
              <td>
                <input type="text" v-model="mescit.note" class="input input-bordered input-sm w-32" placeholder="Açıklama..." />
              </td>
            </tr>
            <!-- Normal Katlar -->
            <tr v-for="r in readings" :key="r.flatId">
              <td>{{ r.flatNumber }}</td>
              <td>
                <input type="number" v-model.number="r.previousReading" @input="updateTotalConsumptions" class="input input-bordered input-sm w-24" placeholder="örn. 12345" />
              </td>
              <td>
                <input type="number" v-model.number="r.currentReading" @input="updateTotalConsumptions" class="input input-bordered input-sm w-24" placeholder="örn. 12500" />
              </td>
              <td>{{ r.individualConsumption }}</td>
              <td>{{ calculateAmount(r.individualConsumption) }}</td>
              <td>
                <input type="text" v-model="r.note" class="input input-bordered input-sm w-32" placeholder="Açıklama..." />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Actions -->
      <div class="modal-action flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <button class="btn btn-primary" @click="saveAll" :disabled="loading">Tümünü Kaydet</button>
        <button class="btn btn-outline" @click="$emit('close')">Kapat</button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiService from '@/services/api'
import meterReadingsService from '@/services/meterReadingsService'

const emit = defineEmits(['close'])
const selectedPeriod = ref(new Date().toISOString().slice(0, 7))
const firstReadingDate = ref('')
const lastReadingDate = ref('')
const paymentDueDate = ref('')
const readings = ref([])
const loading = ref(false)

// Fiyat ve oran değişkenleri
const unitPrice = ref(0)
const btvRate = ref(0)
const kdvRate = ref(20)

// Ortak alan ve mescit için sayaç okuma alanları
const sharedArea = ref({
  individualConsumption: 0,
  totalConsumption: 0,
  kdvHaric: 0,
  kdvDahil: 0,
  note: '',
  previousReading: 0,
  currentReading: 0
})

const mescit = ref({
  individualConsumption: 0,
  totalConsumption: 0,
  kdvHaric: 0,
  kdvDahil: 0,
  note: '',
  previousReading: 0,
  currentReading: 0
})

const fetchFlatsAndPrevious = async () => {
  const flatList = await apiService.get('/flats')
  readings.value = []
  
  // Sadece aktif ve dolu daireleri filtrele (Floor tipi)
  const activeFlats = flatList.filter(flat => 
    flat.isActive && 
    flat.isOccupied && 
    flat.type === 0 // UnitType.Floor
  )
  
  for (const flat of activeFlats) {
    try {
      const lastReading = await meterReadingsService.getLastReading(flat.id, 'Electricity')
      readings.value.push({
        flatId: flat.id,
        flatNumber: flat.code || flat.unitNumber,
        previousReading: lastReading ? lastReading.readingValue : 0,
        currentReading: 0,
        individualConsumption: 0,
        sharedConsumption: 0,
        totalConsumption: 0,
        kdvHaric: 0,
        kdvDahil: 0,
        note: ''
      })
    } catch (error) {
      console.error(`Daire ${flat.unitNumber} için son okuma alınırken hata:`, error)
      readings.value.push({
        flatId: flat.id,
        flatNumber: flat.code || flat.unitNumber,
        previousReading: 0,
        currentReading: 0,
        individualConsumption: 0,
        sharedConsumption: 0,
        totalConsumption: 0,
        kdvHaric: 0,
        kdvDahil: 0,
        note: ''
      })
    }
  }
}
onMounted(fetchFlatsAndPrevious)

// Tutar hesaplama fonksiyonu
const calculateAmount = (consumption) => {
  if (!consumption || consumption <= 0) return '0.00'
  
  const baseAmount = consumption * unitPrice.value
  const btvAmount = baseAmount * (btvRate.value / 100)
  const subtotal = baseAmount + btvAmount
  const kdvAmount = subtotal * (kdvRate.value / 100)
  const total = subtotal + kdvAmount
  
  return total.toFixed(2)
}

const updateSharedAreaConsumption = () => {
  sharedArea.value.individualConsumption = Math.max(0, sharedArea.value.currentReading - sharedArea.value.previousReading)
}

const updateMescitConsumption = () => {
  mescit.value.individualConsumption = Math.max(0, mescit.value.currentReading - mescit.value.previousReading)
}

const updateTotalConsumptions = () => {
  readings.value.forEach(r => {
    r.individualConsumption = Math.max(0, r.currentReading - r.previousReading)
  })
}

const distributeSharedConsumption = async () => {
  loading.value = true
  try {
    const [year, month] = selectedPeriod.value.split('-').map(Number)
    const response = await meterReadingsService.distributeSharedConsumption({
      sharedAreaConsumption: sharedArea.value.individualConsumption,
      mescitConsumption: mescit.value.individualConsumption,
      periodYear: year,
      periodMonth: month
    })
    response.forEach(item => {
      const r = readings.value.find(x => x.flatId === item.flatId)
      if (r) r.sharedConsumption = item.distributedConsumption
    })
    updateTotalConsumptions()
  } finally {
    loading.value = false
  }
}

const saveAll = async () => {
  loading.value = true
  try {
    const [year, month] = selectedPeriod.value.split('-').map(Number)
    
    // Validation: Check if required fields are filled
    if (!selectedPeriod.value || !lastReadingDate.value) {
      alert('Lütfen dönem ve son okuma tarihini doldurun.')
      return
    }
    
    // Toplu kaydetme için bulk-upsert kullan - DOĞRU FORMAT
    const items = []
    let validItemsCount = 0
    
    // Ortak alan ve mescit kaydetme - SADECE GEÇERLİ FLATID'LER İÇİN
    // Not: Ortak alan ve mescit için flatId null olduğundan bunları ayrı endpoint'e gönder
    // Şimdilik sadece normal katları kaydet
    
    // Normal katlar kaydetme
    readings.value.forEach(r => {
      if (r.currentReading > 0 && r.flatId) { // flatId kontrolü eklendi
        // Consumption hesapla: current - previous
        const consumption = Math.max(0, parseFloat(r.currentReading) - parseFloat(r.previousReading || 0))
        
        // Validation: Warn if consumption seems too low
        if (consumption === 0 && r.previousReading > 0) {
          console.warn(`Dikkat: ${r.flatNumber} için tüketim 0 - önceki okuma: ${r.previousReading}, şimdiki okuma: ${r.currentReading}`)
        }
        
        items.push({
          id: null, // Yeni kayıt için null
          flatId: r.flatId, // GUID string olarak
          type: 0, // Electricity = 0
          periodYear: year,
          periodMonth: month,
          readingValue: parseFloat(r.currentReading),
          consumption: consumption, // Hesaplanan consumption
          readingDate: lastReadingDate.value ? new Date(lastReadingDate.value).toISOString() : new Date().toISOString(),
          note: r.note || null
        })
        validItemsCount++
      }
    })
    
    // Validation: Check if any valid items to save
    if (validItemsCount === 0) {
      alert('Kaydedilecek geçerli sayaç okuması bulunamadı. Lütfen en az bir daire için okuma değeri girin.')
      return
    }
    
    // Debug için console log
    console.log('BulkUpsert Request Items:', JSON.stringify(items, null, 2))
    console.log(`Toplam ${validItemsCount} kayıt kaydediliyor...`)
    
    let result = null
    if (items.length > 0) {
      result = await meterReadingsService.bulkUpsertMeterReadings(items)
      console.log('BulkUpsert Result:', result)
      
      if (result && result.affected > 0) {
        // Başarı mesajı Utilities.vue'da gösterilecek
        console.log(`✅ ${result.affected} sayaç okuması başarıyla kaydedildi.`)
      } else {
        alert('Sayaç okumaları kaydedildi ancak hiçbir kayıt etkilenmedi. Verileri kontrol edin.')
      }
    }
    
    // Modal'ı kapat ve veri yenileme işlemini tetikle
    emit('close', { shouldRefresh: true, successMessage: result ? `${result.affected} sayaç okuması başarıyla kaydedildi.` : 'Kayıt işlemi tamamlandı.' })
  } catch (error) {
    console.error('Kaydetme hatası:', error)
    alert('Sayaç okumaları kaydedilirken bir hata oluştu: ' + error.message)
  } finally {
    loading.value = false
  }
}
</script>
