<template>
  <dialog class="modal" :open="open">
    <div class="modal-box max-w-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-full p-2">
            ⚡
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
            Elektrik — Toplu Düzenleme
          </h3>
        </div>
        <button @click="$emit('close')" class="btn btn-ghost btn-sm">Kapat</button>
      </div>

      <div v-if="loading" class="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        Veriler yükleniyor...
      </div>

      <div v-else class="space-y-6">
        <!-- Özet -->
        <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div class="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300">
            <span>Dönem: <b>{{ period || '-' }}</b></span>
            <span>Tip: <b>Elektrik</b></span>
            <span>Seçili kayıt: <b>{{ records.length }}</b></span>
          </div>
          <p v-if="records.length === 0" class="mt-2 text-red-600 dark:text-red-400">
            Bu dönem için Elektrik kaydı bulunamadı.
          </p>
        </div>

        <!-- Form -->
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Önceki Endeks (kWh)</span>
                <span class="label-text-alt text-red-500">*</span>
              </label>
              <input type="number" v-model.number="local.previousValue" class="input input-bordered w-full bg-white dark:bg-gray-700"
                     min="0" step="0.01" @input="validateInputs" />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Yeni Endeks (kWh)</span>
                <span class="label-text-alt text-red-500">*</span>
              </label>
              <input type="number" v-model.number="local.currentValue" class="input input-bordered w-full bg-white dark:bg-gray-700"
                     min="0" step="0.01" @input="validateInputs" />
            </div>
          </div>

          <div class="bg-white dark:bg-gray-700 rounded-lg p-4 border border-blue-200 dark:border-blue-800 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="text-center">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Tüketim</p>
              <p class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ consumption.toFixed(2) }} kWh</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Toplam (KDV Dahil)</p>
              <p class="text-lg font-bold text-green-600 dark:text-green-400">{{ formatCurrency(totalWithVat) }}</p>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">KDV Hariç Tutar (₺)</span>
              <span class="label-text-alt text-red-500">*</span>
            </label>
            <input type="number" v-model.number="local.kdvHaric" class="input input-bordered w-full bg-white dark:bg-gray-700"
                   step="0.01" min="0" />
            <label class="label"><span class="label-text-alt text-gray-500 dark:text-gray-400">%20 KDV varsayıldı</span></label>
          </div>
        </div>

        <!-- Validasyon -->
        <div v-if="validation.issues.length || validation.warnings.length" class="space-y-3">
          <div v-if="validation.issues.length" class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <p class="font-medium mb-1 text-red-600 dark:text-red-400">Hatalar</p>
            <ul class="list-disc list-inside space-y-1">
              <li v-for="issue in validation.issues" :key="issue" class="text-red-600 dark:text-red-400">{{ issue }}</li>
            </ul>
          </div>
          <div v-if="validation.warnings.length" class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
            <p class="font-medium mb-1">Uyarılar</p>
            <ul class="list-disc list-inside space-y-1">
              <li v-for="warning in validation.warnings" :key="warning">{{ warning }}</li>
            </ul>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button class="btn btn-outline btn-sm" @click="$emit('close')">İptal</button>
          <button class="btn btn-primary btn-sm" @click="save" :disabled="!validation.isValid || records.length === 0 || saving">
            <span v-if="saving" class="loading loading-spinner loading-xs mr-1"></span>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useErrorHandler } from '@/composables/useErrorHandler'
import meterSvc from '@/services/meterReadingsService'

const props = defineProps({
  period: { type: String, required: true }, // "YYYY-MM"
  open:   { type: Boolean, default: false }
})
const emit = defineEmits(['close', 'updated'])

const { handleNetworkError, handleValidationError, showSuccess } = useErrorHandler()

const loading = ref(false)
const saving  = ref(false)
const records = ref([]) // bu modal artık /meterreadings verisini kullanır

// Form
const local = ref({ previousValue: 0, currentValue: 0, kdvHaric: 0 })

// Dönemi sayılara çevir
const ym = computed(() => {
  const [y, m] = (props.period || '').split('-').map(n => parseInt(n, 10))
  return { year: y, month: m }
})

// Görsel hesaplar
const consumption = computed(() => {
  const cur = Number(local.value.currentValue ?? 0)
  const prev = Number(local.value.previousValue ?? 0)
  const diff = cur - prev
  return Number.isFinite(diff) && diff >= 0 ? diff : 0
})
const VAT_RATE = 0.20
const totalWithVat = computed(() => {
  const base = Number(local.value.kdvHaric ?? 0)
  const total = base * (1 + VAT_RATE)
  return Number.isFinite(total) ? Number(total.toFixed(2)) : 0
})
const formatCurrency = (val) => {
  const n = Number(val)
  return Number.isFinite(n) ? n.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) : '-'
}

// Validasyon
const validation = ref({ isValid: true, issues: [], warnings: [] })
const validateInputs = () => {
  const issues = []
  const cur = Number(local.value.currentValue)
  const prev = Number(local.value.previousValue)
  const base = Number(local.value.kdvHaric)

  if (!Number.isFinite(prev) || prev < 0) issues.push('Önceki endeks negatif olamaz.')
  if (!Number.isFinite(cur)  || cur  < 0) issues.push('Yeni endeks negatif olamaz.')
  if (Number.isFinite(prev) && Number.isFinite(cur) && cur < prev) issues.push('Yeni endeks, önceki endeksten küçük olamaz.')
  if (!Number.isFinite(base) || base < 0) issues.push('KDV hariç tutar negatif olamaz.')

  validation.value = { isValid: issues.length === 0, issues, warnings: [] }
}

// Kayıtları çek
const fetchRecords = async () => {
  loading.value = true
  try {
    const { year, month } = ym.value
    if (!year || !month) {
      validation.value = { isValid: false, issues: ['Geçersiz dönem formatı (YYYY-MM).'], warnings: [] }
      records.value = []
      return
    }

    const list = await meterSvc.getMeterReadingsByPeriod(year, month, 'Electricity')
    records.value = Array.isArray(list) ? list : []

    const r = records.value[0]
    local.value.previousValue = r?.previousValue ?? 0
    local.value.currentValue  = r?.currentValue  ?? 0
    local.value.kdvHaric      = r?.kdvHaric      ?? 0

    validateInputs()
  } catch (err) {
    handleNetworkError(err, { component: 'EditElectricityModal', action: 'fetchRecords' })
    records.value = []
  } finally {
    loading.value = false
  }
}

watch(() => props.open,  v => { if (v) fetchRecords() })
watch(() => props.period, () => { if (props.open) fetchRecords() })
onMounted(() => { if (props.open) fetchRecords() })

// Kaydet (TOPLU UPSERT)
const save = async () => {
  validateInputs()
  if (!validation.value.isValid) {
    handleValidationError('Lütfen hataları düzeltin.', { component: 'EditElectricityModal', action: 'save' })
    return
  }
  if (records.value.length === 0) {
    handleValidationError('Bu dönem için güncellenecek kayıt bulunamadı.', { component: 'EditElectricityModal', action: 'save' })
    return
  }

  saving.value = true
  try {
    const { year, month } = ym.value
    const rows = records.value.map(r => ({
      id: r.id,                // varsa PUT
      flatId: r.flatId,        // backend alanı
      type: 'Electricity',
      periodYear: year,
      periodMonth: month,
      previousValue: Number(local.value.previousValue),
      currentValue:  Number(local.value.currentValue),
      kdvHaric:      Number(local.value.kdvHaric)
      // İstersen burada backend toplam tutar bekliyorsa ekle:
      // totalWithVat: totalWithVat.value
    }))

    await meterSvc.upsertMeterReadings(rows, { preferBatch: true })

    showSuccess(`${records.value.length} elektrik kaydı kaydedildi.`, { component: 'EditElectricityModal', action: 'save' })
    emit('updated')
    emit('close')
  } catch (error) {
    handleNetworkError(error, { component: 'EditElectricityModal', action: 'save' })
  } finally {
    saving.value = false
  }
}
</script>
