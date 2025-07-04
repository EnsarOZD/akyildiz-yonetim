<template>
  <dialog open class="modal">
    <div class="modal-box max-w-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Su Kaydı Düzenle</h3>
        </div>
        <button @click="$emit('close')" class="btn btn-ghost btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form Content -->
      <div class="space-y-6">
        
        <!-- Bilgi Alanları -->
        <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-4">
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Kayıt Bilgileri</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Kat</span>
              </label>
              <input 
                type="text" 
                class="input input-bordered w-full bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400" 
                :value="record.unit" 
                disabled 
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Şirket</span>
              </label>
              <input 
                type="text" 
                class="input input-bordered w-full bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400" 
                :value="record.tenantName || '-'" 
                disabled 
              />
            </div>
          </div>
        </div>

        <!-- Sayaç Okumaları -->
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-4">
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Sayaç Okumaları</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Önceki Endeks (m³)</span>
                <span class="label-text-alt text-red-500">*</span>
              </label>
              <input 
                type="number" 
                v-model.number="local.previousValue" 
                class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" 
                min="0"
                step="0.01"
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Yeni Endeks (m³)</span>
                <span class="label-text-alt text-red-500">*</span>
              </label>
              <input 
                type="number" 
                v-model.number="local.currentValue" 
                class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" 
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <!-- Hesaplama Sonuçları -->
          <div class="bg-white dark:bg-gray-700 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div class="text-center">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Tüketim</p>
              <p class="text-lg font-bold text-blue-600 dark:text-blue-400">
                {{ local.currentValue - local.previousValue }} m³
              </p>
            </div>
          </div>
        </div>

        <!-- Tutar Bilgileri -->
        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 space-y-4">
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Tutar Bilgileri</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Su Tutarı (₺)</span>
                <span class="label-text-alt text-red-500">*</span>
              </label>
              <input 
                type="number" 
                v-model.number="local.kdvHaric" 
                class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" 
                step="0.01"
                min="0"
              />
              <label class="label">
                <span class="label-text-alt text-gray-500 dark:text-gray-400">KDV hariç su tutarı (%1 KDV)</span>
              </label>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Atık Su Tutarı (₺)</span>
                <span class="label-text-alt text-red-500">*</span>
              </label>
              <input 
                type="number" 
                v-model.number="local.wasteAmount" 
                class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" 
                step="0.01"
                min="0"
              />
              <label class="label">
                <span class="label-text-alt text-gray-500 dark:text-gray-400">KDV hariç atık su tutarı (%10 KDV)</span>
              </label>
            </div>
          </div>

          <!-- Toplam Hesaplama -->
          <div class="bg-white dark:bg-gray-700 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div class="text-center">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Toplam (KDV Dahil)</p>
              <p class="text-lg font-bold text-green-600 dark:text-green-400">
                {{ formatCurrency(totalWithVAT) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Uyarı Kutusu -->
        <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <div class="flex items-start gap-3">
            <div class="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 rounded-full p-1 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div class="text-sm text-gray-700 dark:text-gray-300">
              <p class="font-medium mb-1">Dikkat</p>
              <p>Bu değişiklik su kaydını kalıcı olarak güncelleyecektir. Tüketim ve toplam tutar otomatik olarak hesaplanacaktır.</p>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            class="btn btn-outline btn-sm" 
            @click="$emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            İptal
          </button>
          <button 
            class="btn btn-primary btn-sm" 
            @click="save"
            :disabled="local.previousValue < 0 || local.currentValue < 0 || local.kdvHaric < 0 || local.wasteAmount < 0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue'
import { useErrorHandler } from '@/composables/useErrorHandler'
import expensesService from '@/services/expensesService'

const props = defineProps({ record: Object })
const emit = defineEmits(['close', 'updated'])

const { handleNetworkError, handleValidationError, showSuccess } = useErrorHandler()

const local = ref({
  previousValue: 0,
  currentValue: 0,
  kdvHaric: 0
})

const validation = ref({
  isValid: true,
  issues: [],
  warnings: []
})

const validateInputs = () => {
  const newRecord = {
    currentValue: local.value.currentValue,
    previousValue: local.value.previousValue,
    endDate: props.record?.endDate
  }
  
  validation.value = meterManager.validateReadingEdit(props.record, newRecord)
}

// Record değiştiğinde input'lara yansıt
watchEffect(() => {
  if (props.record) {
    local.value.previousValue = props.record.previousValue ?? 0
    local.value.currentValue = props.record.currentValue ?? 0
    local.value.kdvHaric = props.record.kdvHaric ?? 0
    validateInputs()
  }
})

const totalWithVAT = computed(() => {
  const water = local.value.kdvHaric * 1.01
  const waste = local.value.wasteAmount * 1.10
  return +(water + waste).toFixed(2)
})

const formatCurrency = val =>
  isNaN(val) ? '-' : val.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })

const save = async () => {
  try {
    // Son validasyon
    validateInputs()
    if (!validation.value.isValid) {
      handleValidationError('Lütfen hataları düzeltin.', { 
        component: 'EditWaterModal', 
        action: 'save' 
      })
      return
    }

    const consumption = calculateConsumption(local.value.currentValue, local.value.previousValue)
    const toplamTutar = calculateTotalWithVAT(local.value.kdvHaric, 0.20)
    const refDoc = doc(db, 'readings', props.record.id)

    // Audit trail oluştur
    const auditTrail = meterManager.createAuditTrail(
      props.record, 
      { ...props.record, ...local.value, consumption, toplamTutar },
      authStore.user?.uid || 'unknown_user'
    )

    // Ana kaydı güncelle
    await updateDoc(refDoc, {
      previousValue: local.value.previousValue,
      currentValue: local.value.currentValue,
      consumption: consumption,
      kdvHaric: local.value.kdvHaric,
      toplamTutar: toplamTutar,
      kdvDahil: toplamTutar,
      // Ödeme durumu güncelleme
      remainingAmount: toplamTutar - (props.record.paidAmount || 0),
      isPaid: (toplamTutar - (props.record.paidAmount || 0)) <= 0,
      lastModified: new Date(),
      modifiedBy: authStore.user?.uid || 'unknown_user'
    })

    // Audit trail'i kaydet
    await addDoc(collection(db, 'auditTrail'), auditTrail)

    // Cache'i temizle
    meterManager.clearCacheForUnit(props.record.unit, 'water')

    // Başarı mesajı
    showSuccess('Su kaydı başarıyla güncellendi.', { 
      component: 'EditWaterModal', 
      action: 'save' 
    })
    
    emit('updated')
    emit('close')
  } catch (error) {
    handleNetworkError(error, { 
      component: 'EditWaterModal', 
      action: 'save' 
    })
  }
}
</script>
