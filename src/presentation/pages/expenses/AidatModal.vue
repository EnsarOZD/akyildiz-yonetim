<template>
  <BaseModal
    :model-value="true"
    title="AİDAT OLUŞTUR"
    icon="📊"
    size="md"
    @close="handleClose"
  >
    <div class="space-y-6">
      <!-- Error Info -->
      <div v-if="errorMsg" class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span class="text-sm text-red-400 font-medium">{{ errorMsg }}</span>
      </div>

      <!-- Bilgilendirme Kutusu -->
      <div class="bg-brand-500/[0.05] border border-brand-500/20 rounded-2xl p-5">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0 text-brand-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 class="text-[11px] font-black uppercase tracking-widest text-brand-400 mb-1">Toplu Aidat Oluşturma</h4>
            <p class="text-xs text-brand-200/70 leading-relaxed font-medium">
              Seçilen dönem için yıllık aidat tanımlarından otomatik aidat kayıtları oluşturulur.
            </p>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Dönem -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Dönem *</span>
          </label>
          <input
            ref="periodInput"
            type="month"
            v-model="period"
            :max="maxPeriod"
            class="input input-bordered w-full font-bold !text-lg"
            required
          />
          <p class="text-[10px] font-bold text-[#626885] uppercase tracking-widest mt-2 ml-1">Aidatın geçerli olacağı ay/yıl</p>
        </div>

        <!-- Son Ödeme Tarihi -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Son Ödeme Tarihi *</span>
          </label>
          <input
            type="date"
            v-model="dueDate"
            :min="minDueDate"
            class="input input-bordered w-full"
            required
          />
          <p class="text-[10px] font-bold text-[#626885] uppercase tracking-widest mt-2 ml-1 italic">Öneri: Dönemi takip eden ayın 10'u</p>
        </div>
      </form>
    </div>

    <!-- Footer Butonları -->
    <template #footer>
      <button 
        type="button"
        class="btn btn-ghost !bg-transparent border border-white/[0.08] text-[#9aa0b4] hover:bg-white/[0.05]" 
        @click="handleClose" 
        :disabled="loading"
      >
        İptal
      </button>
      <button 
        type="button"
        class="btn btn-primary px-10" 
        @click="handleSubmit"
        :disabled="isDisabled"
      >
        <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
        <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
        </svg>
        Aidatları Oluştur
      </button>
    </template>
  </BaseModal>
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
