<template>
  <BaseModal
    :model-value="visible"
    :title="editMode ? 'Gider Düzenle' : 'Yeni Gider Ekle'"
    icon="💰"
    size="lg"
    @close="handleClose"
  >
    <!-- Error Mesajı -->
    <div v-if="localError || error" class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <span class="text-sm text-red-400 font-medium">{{ localError || error }}</span>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSave" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <!-- Gider Tipi -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Gider Tipi *</span>
          </label>
          <select 
            v-model="expense.type" 
            class="select select-bordered w-full" 
            :class="{ '!border-red-500/50': errors.type }"
            required
            ref="typeSelect"
          >
            <option disabled value="">Seçiniz</option>
            <option v-for="type in expenseTypeOptions" :key="type.value" :value="type.value">{{ type.label }}</option>
          </select>
          <p v-if="errors.type" class="text-red-400 text-[10px] font-bold uppercase tracking-wide mt-1.5 ml-1">{{ errors.type }}</p>
        </div>

        <!-- Tarih -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Tarih *</span>
          </label>
          <input 
            v-model="expense.expenseDate" 
            type="date" 
            class="input input-bordered w-full"
            :class="{ '!border-red-500/50': errors.expenseDate }"
            required 
          />
          <p v-if="errors.expenseDate" class="text-red-400 text-[10px] font-bold uppercase tracking-wide mt-1.5 ml-1">{{ errors.expenseDate }}</p>
        </div>

        <!-- Tutar -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Tutar *</span>
          </label>
          <div class="relative">
            <input 
              v-model="displayAmount" 
              @input="handleAmountInput"
              @blur="handleAmountBlur"
              type="text" 
              inputmode="decimal"
              class="input input-bordered w-full font-bold !text-lg pr-10"
              :class="{ '!border-red-500/50': errors.amount }"
              placeholder="0.00"
              required 
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[#626885] font-black uppercase tracking-widest text-[10px]">TL</span>
          </div>
          <p v-if="errors.amount" class="text-red-400 text-[10px] font-bold uppercase tracking-wide mt-1.5 ml-1">{{ errors.amount }}</p>
        </div>
      </div>

      <!-- Başlık -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">Gider Başlığı *</span>
        </label>
        <input 
          v-model="expense.title" 
          type="text" 
          class="input input-bordered w-full"
          :class="{ '!border-red-500/50': errors.title }"
          placeholder="Örn: Elektrik Faturası - Blok A" 
          required 
        />
        <p v-if="errors.title" class="text-red-400 text-[10px] font-bold uppercase tracking-wide mt-1.5 ml-1">{{ errors.title }}</p>
      </div>

      <!-- Açıklama ve Fatura No -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Açıklama</span>
          </label>
          <textarea
            v-model="expense.description"
            class="textarea textarea-bordered w-full min-h-[100px]"
            placeholder="Gider ile ilgili detaylı bilgi..."
          ></textarea>
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Fatura / Makbuz No</span>
          </label>
          <input
            v-model="expense.receiptNumber"
            type="text"
            class="input input-bordered w-full"
            placeholder="Opsiyonel doküman numarası"
          />
        </div>
      </div>

      <!-- Önizleme -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div v-if="showPreview" class="bg-brand-500/[0.05] p-5 rounded-2xl border border-brand-500/20 space-y-3">
          <h4 class="text-[11px] font-black uppercase tracking-widest text-brand-400 mb-1">Gider Özeti</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-[12.5px]">
            <div class="flex justify-between items-center py-1 border-b border-white/[0.05]">
              <span class="font-bold text-[#626885] uppercase tracking-wider text-[10px]">Tip</span>
              <span class="text-[#f1f3f9]">{{ getExpenseTypeName(expense.type) || 'Seçilmedi' }}</span>
            </div>
            <div class="flex justify-between items-center py-1 border-b border-white/[0.05]">
              <span class="font-bold text-[#626885] uppercase tracking-wider text-[10px]">Tarih</span>
              <span class="text-[#f1f3f9]">{{ formatDate(expense.expenseDate) || '–' }}</span>
            </div>
            <div class="flex justify-between items-center py-1 border-b border-white/[0.05]">
              <span class="font-bold text-[#626885] uppercase tracking-wider text-[10px]">Tutar</span>
              <span class="text-green-400 font-black">{{ formatCurrency(expense.amount) || '0.00' }}</span>
            </div>
            <div class="flex justify-between items-center py-1 border-b border-white/[0.05]">
              <span class="font-bold text-[#626885] uppercase tracking-wider text-[10px]">Fiş No</span>
              <span class="text-[#f1f3f9] truncate max-w-[120px]">{{ expense.receiptNumber || '–' }}</span>
            </div>
          </div>
        </div>
      </transition>
    </form>

    <template #footer>
      <button 
        type="button"
        @click="togglePreview"
        class="btn btn-ghost btn-sm mr-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        {{ showPreview ? 'Özeti Gizle' : 'Gideri Önizle' }}
      </button>
      
      <button 
        class="btn btn-outline border-white/[0.08] text-[#9aa0b4] hover:bg-white/[0.04]" 
        type="button" 
        @click="handleClose"
        :disabled="props.loading"
      >
        Vazgeç
      </button>
      <button 
        class="btn btn-primary" 
        @click="handleSave"
        :disabled="props.loading || !isFormValid"
      >
        <div v-if="props.loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
        <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
        </svg>
        {{ editMode ? 'Güncelle' : 'Gideri Kaydet' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch, nextTick, onMounted } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import { useDirtyGuard } from '@/application/composables/useDirtyGuard'
import { formatCurrency, parseCurrency, formatInputCurrency } from '@/core/utils/currencyUtils'

const props = defineProps(['visible', 'expense', 'types', 'editMode', 'loading', 'error'])
const emit = defineEmits(['close', 'save'])

const { isDirty, resetDirty } = useDirtyGuard(() => props.expense)
const typeSelect = ref(null)
const showPreview = ref(false)
const localError = ref(null)
const errors = ref({})
const displayAmount = ref('')

// Initialize display amount
watch(() => props.expense.amount, (newVal) => {
  if (parseCurrency(displayAmount.value) !== newVal) {
    displayAmount.value = formatInputCurrency(newVal)
  }
}, { immediate: true })

const handleAmountInput = (e) => {
  displayAmount.value = e.target.value
  props.expense.amount = parseCurrency(e.target.value)
}

const handleAmountBlur = () => {
  if (props.expense.amount > 0) {
    displayAmount.value = props.expense.amount.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }
  validateField('amount')
}

const validateField = (field) => {
  // Sadece ilgili alanı doğrula
  if (field === 'amount') {
    if (!props.expense.amount || isNaN(props.expense.amount) || props.expense.amount <= 0) {
      errors.value.amount = 'Geçerli bir tutar girilmelidir'
    } else {
      delete errors.value.amount
    }
  }
  
  if (field === 'type') {
    if (!props.expense.type) {
      errors.value.type = 'Gider tipi seçilmelidir'
    } else {
      delete errors.value.type
    }
  }
  
  if (field === 'title') {
    if (!props.expense.title || props.expense.title.trim() === '') {
      errors.value.title = 'Başlık girilmelidir'
    } else {
      delete errors.value.title
    }
  }
}

// Parent'tan gelen types prop'unu kullan
const expenseTypeOptions = computed(() => {
  if (props.types && props.types.length > 0) {
    return props.types
  }
  // Fallback olarak varsayılan değerler
  return [
    { value: 'Electricity', label: 'Elektrik (Genel)' },
    { value: 'Water', label: 'Su (Genel)' },
    { value: 'Gas', label: 'Gaz' },
    { value: 'Maintenance', label: 'Bakım' },
    { value: 'Cleaning', label: 'Temizlik' },
    { value: 'Security', label: 'Güvenlik' },
    { value: 'Other', label: 'Diğer' }
  ]
})

// Form validation
const validateForm = () => {
  errors.value = {}
  
  // Gider tipi validasyonu
  if (!props.expense.type) {
    errors.value.type = 'Gider tipi seçilmelidir'
  }
  
  // Tarih validasyonu
  if (!props.expense.expenseDate) {
    errors.value.expenseDate = 'Tarih seçilmelidir'
  } else {
    const selectedDate = new Date(props.expense.expenseDate)
    const today = new Date()
    if (selectedDate > today) {
      errors.value.expenseDate = 'Gelecek tarih seçilemez'
    }
  }
  
  // Tutar validasyonu
  if (!props.expense.amount) {
    errors.value.amount = 'Tutar girilmelidir'
  } else if (isNaN(props.expense.amount) || Number(props.expense.amount) <= 0) {
    errors.value.amount = 'Geçerli bir tutar girilmelidir'
  } else if (Number(props.expense.amount) > 1000000) {
    errors.value.amount = 'Tutar 1.000.000 TL\'den fazla olamaz'
  }
  
  // Başlık validasyonu
  if (!props.expense.title || props.expense.title.trim() === '') {
    errors.value.title = 'Başlık girilmelidir'
  } else if (props.expense.title.length < 3) {
    errors.value.title = 'Başlık en az 3 karakter olmalıdır'
  } else if (props.expense.title.length > 100) {
    errors.value.title = 'Başlık en fazla 100 karakter olabilir'
  }
  
  return Object.keys(errors.value).length === 0
}

// Form geçerliliği
const isFormValid = computed(() => {
  return validateForm()
})

// Auto-focus when modal opens
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    nextTick(() => {
      if (typeSelect.value) {
        typeSelect.value.focus()
      }
    })
    // Reset form state
    localError.value = null
    errors.value = {}
    showPreview.value = false
    resetDirty()
  }
})

// Keyboard shortcuts
const handleKeydown = (event) => {
  if (!props.visible) return
  
  // Escape key - close modal
  if (event.key === 'Escape') {
    handleClose()
  }
  
  // Enter key - save form (if not in textarea)
  if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
    event.preventDefault()
    handleSave()
  }
  
  // Ctrl/Cmd + Enter - save form
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault()
    handleSave()
  }
}

// Add keyboard event listener
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

// Cleanup
const cleanup = () => {
  document.removeEventListener('keydown', handleKeydown)
}

// Watch for component unmount
watch(() => props.visible, (newVisible) => {
  if (!newVisible) {
    cleanup()
  }
})

async function handleSave() {
  if (!validateForm()) {
    localError.value = 'Lütfen form hatalarını düzeltin'
    return
  }
  
  localError.value = null
  
  try {
    // Validate amount format
    const amount = Number(props.expense.amount)
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Geçersiz tutar')
    }
    
    // Prepare data for save
    const expenseData = {
      ...props.expense,
      amount: amount
    }
    
    emit('save', expenseData)
  } catch (err) {
    localError.value = err.message || 'Gider kaydedilirken bir hata oluştu'
  }
}

function handleClose() {
  if (props.loading) return // Prevent closing while loading
  
  if (isDirty.value) {
    if (!confirm('Kaydedilmemiş değişiklikleriniz var. Kapatmak istediğinizden emin misiniz?')) {
      return
    }
  }

  // Reset form state
  localError.value = null
  errors.value = {}
  showPreview.value = false
  
  emit('close')
}

function togglePreview() {
  showPreview.value = !showPreview.value
}

function getExpenseTypeName(type) {
  const option = expenseTypeOptions.value.find(o => o.value === type)
  return option ? option.label : null
}

function formatDate(date) {
  if (!date) return null
  try {
    const formattedDate = new Date(date).toLocaleDateString('tr-TR')
    return formattedDate
  } catch (err) {
    return 'Geçersiz tarih'
  }
}
</script>
