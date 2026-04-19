<template>
  <dialog open class="modal" @keydown.esc.prevent="onEsc" @close.prevent>
    <div class="modal-box max-w-md bg-white dark:bg-[#0f1322] border border-gray-200 dark:border-white/[0.07]">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-white/[0.07]">
        <div class="flex items-center gap-3">
          <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-[#f1f3f9]">Aidat Oluştur</h3>
        </div>
        <button @click="handleClose" class="btn btn-ghost btn-sm" :disabled="loading">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Error Info -->
      <div v-if="errorMsg" class="mb-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-lg p-3 border border-red-200 dark:border-red-800">
        {{ errorMsg }}
      </div>

      <!-- Info -->
      <div class="mb-4 bg-brand-50 dark:bg-brand-500/[0.08] rounded-lg p-4 border border-brand-200 dark:border-brand-700">
        <div class="flex items-start gap-3">
          <div class="bg-brand-100 dark:bg-blue-900/50 text-brand-600 dark:text-brand-400 rounded-full p-1 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="text-sm text-gray-700 dark:text-[#f1f3f9]">
            <p class="font-medium mb-1">Bilgi</p>
            <p>Seçilen dönem için yıllık aidat tanımlarından otomatik aidat kayıtları oluşturulur.</p>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Dönem -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Dönem</span>
            <span class="label-text-alt text-red-500">*</span>
          </label>
          <input
            ref="periodInput"
            type="month"
            v-model="period"
            :max="maxPeriod"
            class="input input-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-700 dark:text-[#f1f3f9]"
            required
          />
          <label class="label">
            <span class="label-text-alt text-gray-500 dark:text-[#9aa0b4]">Aidatın geçerli olacağı ay/yıl</span>
          </label>
        </div>

        <!-- Son Ödeme Tarihi -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Son Ödeme Tarihi</span>
            <span class="label-text-alt text-red-500">*</span>
          </label>
          <input
            type="date"
            v-model="dueDate"
            :min="minDueDate"
            class="input input-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-700 dark:text-[#f1f3f9]"
            required
          />
          <label class="label">
            <span class="label-text-alt text-gray-500 dark:text-[#9aa0b4]">Öneri: Dönemi takip eden ayın 10'u</span>
          </label>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/[0.07]">
          <button type="button" class="btn btn-outline btn-sm" @click="handleClose" :disabled="loading">
            İptal
          </button>
          <button type="submit" class="btn btn-primary btn-sm" :disabled="isDisabled">
            <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
            Oluştur
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiService from '@/infrastructure/services/api'
import { useErrorHandler } from '@/application/composables/useErrorHandler'

const emit = defineEmits(['close', 'refresh', 'success'])
const { showSuccess } = useErrorHandler?.() ?? { showSuccess: () => {} }

const loading = ref(false)
const errorMsg = ref('')

// default değerler
const period = ref(getCurrentPeriod()) // YYYY-MM
const dueDate = ref(getSuggestedDueDate(period.value)) // YYYY-MM-DD

const periodInput = ref(null)

const maxPeriod = computed(() => getCurrentPeriod())
const minDueDate = computed(() => firstDayOfPeriod(period.value))
const isDisabled = computed(() => !period.value || !dueDate.value || loading.value)

function handleClose () {
  if (!loading.value) emit('close')
}

function onEsc () {
  handleClose()
}

function getCurrentPeriod () {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function firstDayOfPeriod (p) {
  // p: YYYY-MM
  try {
    const [y, m] = p.split('-').map(Number)
    return `${y}-${String(m).padStart(2, '0')}-01`
  } catch (e) {
    return ''
  }
}

function getSuggestedDueDate (p) {
  try {
    const [y, m] = p.split('-').map(Number)
    const next = new Date(y, m, 10) // takip eden ayın 10'u
    const yyyy = next.getFullYear()
    const mm = String(next.getMonth() + 1).padStart(2, '0')
    const dd = String(next.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  } catch (e) {
    return ''
  }
}

function validateInputs () {
  errorMsg.value = ''
  if (!period.value || !dueDate.value) {
    errorMsg.value = 'Lütfen dönem ve son ödeme tarihini giriniz.'
    return false
  }
  const min = new Date(minDueDate.value)
  const due = new Date(dueDate.value)
  if (due < min) {
    errorMsg.value = 'Son ödeme tarihi, seçilen dönemin ilk gününden önce olamaz.'
    return false
  }
  return true
}

async function handleSubmit () {
  if (!validateInputs()) return
  loading.value = true
  try {
       const [py, pm] = period.value.split('-').map(Number)
   const payload = {
    period: period.value,              // "2025-02"
     periodYear: py,                    // 2025
     periodMonth: pm,                   // 2
     year: py,                          // bazı backendlerde yıl ayrıca bekleniyor
     periodStartDate: `${py}-${String(pm).padStart(2,'0')}-01`, // bazen bunu da istiyorlar
     dueDate: dueDate.value
   }
   console.log('create-aidat payload =>', payload)
    const result = await apiService.post('/utilitydebts/create-aidat', payload)

    const createdTenant = Number(result?.tenantDuesCreated ?? 0)
    const createdOwner = Number(result?.ownerDuesCreated ?? 0)

    if (createdTenant === 0 && createdOwner === 0) {
      errorMsg.value = `Seçilen dönem (${period.value}) için zaten aidat kayıtları mevcut veya tanımlı aidat bulunmuyor.`
      return
    }

    showSuccess?.(`${createdTenant} kiracı ve ${createdOwner} mal sahibi için aidat oluşturuldu`)
    emit('refresh')
    emit('success', { period: period.value, dueDate: dueDate.value, createdTenant, createdOwner })
    emit('close')
  } catch (error) {
    console.error('Aidat kayıt hatası:', error)
    errorMsg.value = (error?.message) || 'Bir hata oluştu. Lütfen tekrar deneyin.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // focus UX
  if (periodInput.value?.focus) periodInput.value.focus()
})
</script>
