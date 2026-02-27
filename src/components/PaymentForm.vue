<template>
  <div class="payment-form bg-base-100 p-6 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6 text-primary">Yeni Ödeme</h2>
    
    <form @submit.prevent="submitPayment" class="space-y-6">
      <!-- Temel ödeme bilgileri -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Tutar *</span>
          </label>
          <div class="relative">
            <input 
              v-model="displayAmount"
              @input="handleAmountInput"
              @blur="validateAmount"
              type="text" 
              inputmode="decimal"
              class="input input-bordered w-full pr-12" 
              :class="{ 'input-error': amountError }"
              required
              placeholder="0,00"
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₺</span>
          </div>
          <p v-if="amountError" class="text-error text-xs mt-1">{{ amountError }}</p>
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Ödeme Türü *</span>
          </label>
          <select v-model="payment.type" class="select select-bordered" required>
            <option value="">Seçiniz</option>
            <option v-for="(label, value) in paymentTypeOptions" :key="value" :value="parseInt(value)">
              {{ label }}
            </option>
          </select>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Ödeme Şekli *</span>
          </label>
          <select v-model="payment.method" class="select select-bordered" required>
            <option v-for="method in PAYMENT_METHODS" :key="method.value" :value="method.value">
              {{ method.label }}
            </option>
          </select>
        </div>

        <div v-if="payment.method === 1" class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Banka Adı *</span>
          </label>
          <input 
            v-model.trim="payment.bankName" 
            type="text" 
            class="input input-bordered" 
            placeholder="Örn: Ziraat Bankası"
            :required="payment.method === 1"
          />
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Ödeme Tarihi *</span>
          </label>
          <input 
            v-model="payment.paymentDate" 
            type="date" 
            class="input input-bordered" 
            required
          />
        </div>
      </div>
      
      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold">Açıklama</span>
        </label>
        <textarea 
          v-model="payment.description" 
          class="textarea textarea-bordered" 
          placeholder="Ödeme açıklaması..."
        ></textarea>
      </div>
      
      <!-- Borç eşleştirme seçenekleri -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-semibold mb-4">Borç Eşleştirme</h3>
        
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text font-semibold">Otomatik Borç Eşleştirme</span>
            <input 
              v-model="payment.autoAllocate" 
              type="checkbox" 
              class="checkbox checkbox-primary"
            />
          </label>
        </div>
        
        <!-- Manuel borç seçimi -->
        <div v-if="!payment.autoAllocate && payment.tenantId != null" class="mt-4">
          <h4 class="font-semibold mb-3">Manuel Borç Seçimi</h4>
          <div class="space-y-3">
            <div v-for="debt in availableDebts" :key="debt.id" class="border rounded-lg p-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <input 
                    v-model="selectedDebts" 
                    :value="debt.id" 
                    type="checkbox" 
                    class="checkbox checkbox-sm checkbox-primary"
                  />
                  <div>
                    <div class="font-medium">{{ debt.description || `${getDebtTypeLabel(debt.type)} - ${debt.periodYear}/${debt.periodMonth}` }}</div>
                    <div class="text-sm text-gray-600">
                      Kalan: {{ formatCurrency(debt.remainingAmount) }} | Vade: {{ formatDate(debt.dueDate) }}
                    </div>
                  </div>
                </div>
                <div v-if="selectedDebtIdSet.has(Number(debt.id))" class="w-32">
                  <input 
                    v-model="debtAllocations[debt.id]" 
                    type="number" 
                    step="0.01"
                    :max="debt.remainingAmount"
                    class="input input-sm input-bordered" 
                    placeholder="Tutar"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Özet -->
      <div v-if="payment.amount > 0" class="border-t pt-6">
        <h3 class="text-lg font-semibold mb-4">Ödeme Özeti</h3>
        <div class="bg-base-200 p-4 rounded-lg">
          <div class="flex justify-between mb-2">
            <span>Toplam Tutar:</span>
            <span class="font-semibold">{{ formatCurrency(payment.amount) }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span>Eşleştirilecek:</span>
            <span class="font-semibold">{{ formatCurrency(totalAllocated) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Avans Hesabına:</span>
            <span class="font-semibold text-primary">{{ formatCurrency(payment.amount - totalAllocated) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Butonlar -->
      <div class="flex justify-end space-x-3">
        <button 
          type="button" 
          @click="$emit('cancel')" 
          class="btn btn-outline active:scale-95 active:opacity-80 transition-transform duration-75"
          :disabled="loading"
        >
          İptal
        </button>
        <button 
          type="submit" 
          class="btn btn-primary active:scale-95 active:opacity-80 transition-transform duration-75" 
          :disabled="loading"
        >
          <span v-if="loading" class="loading loading-spinner loading-sm"></span>
          {{ loading ? 'İşleniyor...' : 'Ödeme Yap' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import paymentsService from '@/services/paymentsService'
import tenantsService from '@/services/tenantsService'
import { formatCurrency, parseCurrency, formatInputCurrency } from '@/utils/currencyUtils'

const emit = defineEmits(['success', 'cancel'])
const { notifySuccess, notifyError } = useNotify()

// Reactive data
const loading = ref(false)
const tenants = ref([])
const availableDebts = ref([])
const selectedDebts = ref([])
const debtAllocations = ref({})
const displayAmount = ref('')
const amountError = ref('')

const payment = ref({
  amount: 0,
  type: '',
  method: 0, // Nakit (default)
  bankName: '',
  paymentDate: format(new Date(), 'yyyy-MM-dd'),
  description: '',
  tenantId: null,
  autoAllocate: true,
  debtAllocations: []
})

// Computed
const totalAllocated = computed(() => {
  return selectedDebts.value.reduce((total, debtId) => {
    const val = Number(debtAllocations.value[Number(debtId)] || 0)
    return total + (isNaN(val) ? 0 : val)
  }, 0)
})
const selectedDebtIdSet = computed(() => new Set(selectedDebts.value.map(Number)))

// Methods
const handleAmountInput = (e) => {
  const formatted = formatInputCurrency(e.target.value)
  displayAmount.value = formatted
  payment.value.amount = parseCurrency(formatted)
}

const validateAmount = () => {
  if (payment.value.amount <= 0) {
    amountError.value = 'Lütfen geçerli bir tutar girin'
  } else {
    amountError.value = ''
  }
}

// Watch existing amount changes (e.g. from props or initial state)
watch(() => payment.value.amount, (newVal) => {
  if (parseCurrency(displayAmount.value) !== newVal) {
    displayAmount.value = formatCurrency(newVal, false)
  }
}, { immediate: true })

const formatDate = (date) => {
  return format(new Date(date), 'dd MMM yyyy', { locale: tr })
}

const toUserMessage = (err) => {
  const msg = err?.response?.data?.message || err?.response?.data?.title
  if (msg) return `Ödeme kaydedilemedi. ${msg}`
  return "Ödeme kaydedilemedi. Lütfen tekrar deneyin."
}

const loadTenants = async () => {
  try {
    const response = await tenantsService.getTenants()
    tenants.value = response || []
  } catch (error) {
    console.error('Kiracılar yüklenemedi:', error)
  }
}

const loadDebts = async () => {
  if (payment.value.tenantId == null) {
    availableDebts.value = []
    return
  }
  
  try {
    const response = await utilityDebtsService.getUtilityDebts({
      tenantId: payment.value.tenantId,
      status: 0 // Ödenmemiş borçlar
    })
    availableDebts.value = response || []
  } catch (error) {
    console.error('Borçlar yüklenemedi:', error)
  }
}

const submitPayment = async () => {
  if (loading.value) return
  if (!payment.value.autoAllocate && selectedDebts.value.length === 0) {
  notifyError('Manuel eşleştirme için en az 1 borç seçmelisiniz.')
  return
}
  
  // Manuel eşleştirme validasyonu
  if (!payment.value.autoAllocate && selectedDebts.value.length > 0) {
    for (const debtId of selectedDebts.value) {
      const amount = Number(debtAllocations.value[Number(debtId)] || 0)
      const debt = availableDebts.value.find(d => Number(d.id) === Number(debtId))
      
      if (amount <= 0) {
        notifyError('Lütfen seçili borçlar için geçerli bir tutar girin.')
        return
      }
      
      if (debt && amount > debt.remainingAmount) {
        notifyError(`Eşleştirilen tutar borç kalanını (${formatCurrency(debt.remainingAmount)}) aşamaz.`)
        return
      }
    }
  }

  loading.value = true
  
  try {
    const payload = {
      ...payment.value,
      type: Number(payment.value.type)
    }

    // Manuel borç eşleştirmelerini hazırla
    if (!payment.value.autoAllocate && selectedDebts.value.length > 0) {
      payload.debtAllocations = selectedDebts.value.map(debtId => ({
        debtId: Number(debtId),
        amount: Number(debtAllocations.value[Number(debtId)] || 0)
      }))
    }
    
    const response = await paymentsService.createPaymentWithAllocation(payload)
    
    notifySuccess('Ödeme kaydedildi.')
    emit('success', response)
    
    // Formu temizle
    payment.value = {
      amount: 0,
      type: '',
      method: 0,
      bankName: '',
      paymentDate: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      tenantId: null,
      autoAllocate: true,
      debtAllocations: []
    }
    selectedDebts.value = []
    debtAllocations.value = {}
    
  } catch (error) {
    console.error('Ödeme oluşturulamadı:', error)
    notifyError(toUserMessage(error))
  } finally {
    loading.value = false
  }
}

// Watchers
watch(() => payment.value.tenantId, () => {
  selectedDebts.value = []
  debtAllocations.value = {}
  loadDebts()
})

// Lifecycle
onMounted(() => {
  loadTenants()
})
</script>

 