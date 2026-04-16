<template>
  <dialog class="modal" :open="visible">
    <div class="modal-box max-w-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
      <!-- Başlık -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span class="text-2xl">💰</span>
          {{ editMode ? 'Gider Düzenle' : 'Yeni Gider Ekle' }}
        </h3>
        <button @click="handleClose" class="btn btn-sm btn-ghost text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Error Mesajı -->
      <div v-if="error" class="alert alert-error mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSave" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Gider Tipi -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Gider Tipi *</span>
            </label>
            <select 
              v-model="expense.type" 
              class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" 
              :class="{ 'border-red-500': errors.type }"
              required
              ref="typeSelect"
            >
              <option disabled value="">Seçiniz</option>
              <option v-for="type in expenseTypeOptions" :key="type.value" :value="type.value">{{ type.label }}</option>
            </select>
            <label v-if="errors.type" class="label">
              <span class="label-text-alt text-red-500">{{ errors.type }}</span>
            </label>
          </div>

          <!-- Tarih -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Tarih *</span>
            </label>
            <input 
              v-model="expense.expenseDate" 
              type="date" 
              class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400"
              :class="{ 'border-red-500': errors.expenseDate }"
              required 
            />
            <label v-if="errors.expenseDate" class="label">
              <span class="label-text-alt text-red-500">{{ errors.expenseDate }}</span>
            </label>
          </div>

          <!-- Tutar -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Tutar *</span>
            </label>
            <div class="relative">
              <input 
                v-model="displayAmount" 
                @input="handleAmountInput"
                @blur="handleAmountBlur"
                type="text" 
                inputmode="decimal"
                class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400 pr-10"
                :class="{ 'border-red-500': errors.amount }"
                placeholder="0,00"
                required 
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₺</span>
            </div>
            <label v-if="errors.amount" class="label">
              <span class="label-text-alt text-red-500">{{ errors.amount }}</span>
            </label>
          </div>
        </div>

        <!-- Başlık -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Başlık *</span>
          </label>
          <input 
            v-model="expense.title" 
            type="text" 
            class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400"
            :class="{ 'border-red-500': errors.title }"
            placeholder="Gider başlığı giriniz" 
            required 
          />
          <label v-if="errors.title" class="label">
            <span class="label-text-alt text-red-500">{{ errors.title }}</span>
          </label>
        </div>

        <!-- Açıklama ve Fatura No -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Açıklama</span>
            </label>
            <textarea
              v-model="expense.description"
              class="textarea textarea-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400"
              placeholder="Gider açıklaması giriniz"
              rows="3"
            ></textarea>
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Fatura / Makbuz No</span>
            </label>
            <input
              v-model="expense.receiptNumber"
              type="text"
              class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400"
              placeholder="Opsiyonel fatura numarası"
            />
          </div>
        </div>

        <!-- Önizleme -->
        <div v-if="showPreview" class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">Önizleme:</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium text-gray-700 dark:text-gray-300">Tip:</span>
              <span class="ml-2 text-gray-600 dark:text-gray-400">{{ getExpenseTypeName(expense.type) || 'Seçilmedi' }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700 dark:text-gray-300">Tarih:</span>
              <span class="ml-2 text-gray-600 dark:text-gray-400">{{ formatDate(expense.expenseDate) || 'Seçilmedi' }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700 dark:text-gray-300">Tutar:</span>
              <span class="ml-2 text-gray-600 dark:text-gray-400">{{ formatCurrency(expense.amount) || '0.00' }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700 dark:text-gray-300">Başlık:</span>
              <span class="ml-2 text-gray-600 dark:text-gray-400">{{ expense.title || 'Girilmedi' }}</span>
            </div>
          </div>
        </div>

        <!-- Butonlar -->
        <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            type="button"
            @click="togglePreview"
            class="btn btn-ghost btn-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ showPreview ? 'Önizlemeyi Gizle' : 'Önizle' }}
          </button>
          
          <div class="flex gap-3">
            <button 
              class="btn btn-outline border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" 
              type="button" 
              @click="handleClose"
              :disabled="props.loading"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              İptal
            </button>
            <button 
              class="btn btn-primary bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 text-white shadow-lg" 
              type="submit"
              :disabled="props.loading || !isFormValid"
            >
              <div v-if="props.loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {{ editMode ? 'Güncelle' : 'Kaydet' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup>
import { computed, ref, watch, nextTick, onMounted } from 'vue'
import { useDirtyGuard } from '@/application/composables/useDirtyGuard'
import { formatCurrency, parseCurrency, formatInputCurrency } from '@/core/utils/currencyUtils'

const props = defineProps(['visible', 'expense', 'types', 'editMode', 'loading'])
const emit = defineEmits(['close', 'save'])

const { isDirty, resetDirty } = useDirtyGuard(() => props.expense)
const typeSelect = ref(null)
const showPreview = ref(false)
const error = ref(null)
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
    error.value = null
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
    error.value = 'Lütfen form hatalarını düzeltin'
    return
  }
  
  error.value = null
  
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
    error.value = err.message || 'Gider kaydedilirken bir hata oluştu'
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
  error.value = null
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
