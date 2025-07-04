<template>
  <dialog class="modal" :open="visible">
    <div class="modal-box max-w-4xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
      <!-- Başlık -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span class="text-2xl">💳</span>
          Akıllı Ödeme Sistemi
        </h3>
        <button @click="$emit('cancel')" class="btn btn-sm btn-ghost text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form class="space-y-6">
        <!-- Banka Hareketi Bilgileri -->
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span class="text-xl">🏦</span>
            Banka Hareketi Bilgileri
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Tarih -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Hareket Tarihi</span>
              </label>
              <input v-model="payment.date" type="date" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required />
            </div>

            <!-- Tutar -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Gelen Tutar (₺)</span>
              </label>
              <input v-model.number="payment.amount" type="number" step="0.01" placeholder="0.00" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required />
            </div>

            <!-- Banka -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Banka</span>
              </label>
              <select v-model="payment.bank" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required>
                <option disabled value="">Banka Seçin</option>
                <option v-for="b in banks" :key="b" :value="b">{{ b }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Kiracı Seçimi -->
        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span class="text-xl">👤</span>
            Kiracı Seçimi
          </h4>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Kiracı</span>
            </label>
            <select v-model="payment.tenantId" @change="fetchTenantDebts" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required>
              <option disabled value="">Kiracı seçin</option>
              <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
                {{ tenant.company || `${tenant.firstName} ${tenant.lastName}` }}
              </option>
            </select>
          </div>
        </div>

        <!-- Borç Listesi ve Eşleştirme -->
        <div v-if="payment.tenantId && tenantDebts.length > 0" class="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <span class="text-xl">📋</span>
              Borç Eşleştirme
            </h4>
            <div class="flex gap-2">
              <button type="button" @click="autoMatch" class="btn btn-sm btn-primary bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 text-white">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Otomatik Eşleştir
              </button>
              <button type="button" @click="selectOldestDebt" class="btn btn-sm btn-secondary bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 border-0 text-white">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Sadece En Eski Borç
              </button>
              <button type="button" @click="clearAllSelections" class="btn btn-sm btn-outline border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Temizle
              </button>
            </div>
          </div>

          <!-- Borç Listesi -->
          <div class="space-y-3 max-h-64 overflow-y-auto">
            <div v-for="debt in tenantDebts" :key="debt.id" class="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <input 
                type="checkbox" 
                :value="debt.id" 
                v-model="selectedDebts" 
                @change="updatePaymentAmounts"
                class="checkbox checkbox-primary"
              />
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-semibold text-gray-800 dark:text-gray-100">{{ debt.typeLabel || debt.type }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ debt.period || debt.dueDateFormatted }}
                      <span v-if="debt.unit && debt.unit !== '-'" class="ml-2 text-blue-600 dark:text-blue-400">
                        ({{ debt.unit }})
                      </span>
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-red-600 dark:text-red-400">{{ formatCurrency(debt.amount) }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ getDaysOverdue(debt.dueDate) }} gün gecikmiş</p>
                    <p v-if="debt.paidAmount > 0" class="text-xs text-yellow-600 dark:text-yellow-400">
                      {{ formatCurrency(debt.amount - debt.paidAmount) }} kalan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ödeme Dağılımı -->
          <div v-if="selectedDebts.length > 0" class="mt-4 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h5 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">Ödeme Dağılımı</h5>
            
            <!-- Çoklu Borç Bilgisi -->
            <div v-if="selectedDebts.length > 1" class="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm text-blue-700 dark:text-blue-300">
                  <strong>{{ selectedDebts.length }} borç</strong> otomatik olarak seçildi. Her borç için ödeme tutarını manuel olarak ayarlayabilirsiniz.
                </span>
              </div>
            </div>
            
            <div class="space-y-2">
              <div v-for="debtId in selectedDebts" :key="debtId" class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ getDebtById(debtId)?.typeLabel || getDebtById(debtId)?.type }}
                  <span v-if="getDebtById(debtId)?.unit && getDebtById(debtId)?.unit !== '-'" class="text-blue-600 dark:text-blue-400">
                    ({{ getDebtById(debtId)?.unit }})
                  </span>
                </span>
                <input 
                  type="number" 
                  v-model="paymentAmounts[debtId]" 
                  step="0.01" 
                  class="input input-sm input-bordered w-24 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-800 dark:text-gray-200"
                  :max="getDebtById(debtId)?.amount - (getDebtById(debtId)?.paidAmount || 0)"
                  @input="validatePaymentAmount(debtId)"
                />
              </div>
            </div>
            <div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <span class="font-semibold text-gray-800 dark:text-gray-100">Toplam Seçilen:</span>
              <span class="font-bold text-green-600 dark:text-green-400">{{ formatCurrency(totalSelectedAmount) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-semibold text-gray-800 dark:text-gray-100">Gelen Tutar:</span>
              <span class="font-bold text-blue-600 dark:text-blue-400">{{ formatCurrency(payment.amount || 0) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-semibold text-gray-800 dark:text-gray-100">Kalan:</span>
              <span :class="remainingAmount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" class="font-bold">
                {{ formatCurrency(remainingAmount) }}
              </span>
            </div>
            
            <!-- Avans Hesabı Bilgisi -->
            <div v-if="remainingAmount > 0" class="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                <span class="text-sm text-amber-700 dark:text-amber-300">
                  <strong>{{ formatCurrency(remainingAmount) }}</strong> avans hesabına aktarılacak. Gelecekteki borçlardan otomatik düşülecek.
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Uyarı Mesajları -->
        <div v-if="payment.tenantId && tenantDebts.length === 0" class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-green-700 dark:text-green-300">Seçilen kiracının ödenmemiş borcu bulunmuyor.</p>
          </div>
        </div>

        <!-- Fazla Ödeme Uyarısı -->
        <div v-if="hasOverpayment" class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <div>
              <p class="text-red-700 dark:text-red-300 font-semibold">Fazla Ödeme Uyarısı</p>
              <p class="text-red-600 dark:text-red-400 text-sm">{{ getOverpaymentMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Butonlar -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            type="button" 
            class="btn btn-outline border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" 
            @click="handleCancel"
            :disabled="isLoading"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            {{ isLoading ? 'İşlem Devam Ediyor...' : 'İptal' }}
          </button>
          <button 
            type="button" 
            class="btn btn-success bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 text-white shadow-lg" 
            :disabled="!isFormValid || isLoading"
            @click="handleSave"
          >
            <svg v-if="!isLoading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <svg v-else class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            {{ isLoading ? 'Kaydediliyor...' : 'Ödemeyi Kaydet' }}
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import paymentsService from '@/services/paymentsService'
import tenantsService from '@/services/tenantsService'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useNotification } from '@/composables/useNotification'
import { useEventBus } from '@/composables/useEventBus'

const props = defineProps(['visible', 'payment', 'tenants', 'banks', 'editMode'])
const emit = defineEmits(['save', 'cancel', 'close'])

const { handleNetworkError, handleValidationError, showSuccess } = useErrorHandler()
const { showCreateSuccess, showUpdateSuccess, showDeleteSuccess } = useNotification()
const { emit: emitEvent } = useEventBus()

// Reactive data
const tenantDebts = ref([])
const selectedDebts = ref([])
const paymentAmounts = ref({})
const isLoading = ref(false)
const availableAdvances = ref([])
const selectedAdvances = ref([])
const advanceAmounts = ref({})

// Computed properties
const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '₺0.00'
  return Number(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

const totalSelectedAmount = computed(() => {
  // Toplam seçili borçlara dağıtılan ödeme, ödeme miktarını aşamaz
  const total = Object.values(paymentAmounts.value).reduce((sum, amount) => sum + Number(amount || 0), 0)
  return Math.min(total, Number(props.payment.amount || 0))
})

const remainingAmount = computed(() => {
  // Negatif kalan olmasın
  return Math.max(0, Number(props.payment.amount || 0) - totalSelectedAmount.value)
})

const isFormValid = computed(() => {
  return props.payment.date && 
         props.payment.amount > 0 && 
         props.payment.bank && 
         props.payment.tenantId
})

const hasOverpayment = computed(() => {
  return Object.keys(paymentAmounts.value).some(debtId => {
    const debt = getDebtById(debtId)
    if (!debt) return false
    const debtAmount = Number(debt.amount)
    const paymentAmount = Number(paymentAmounts.value[debtId] || 0)
    return paymentAmount > debtAmount
  })
})

const getOverpaymentMessage = computed(() => {
  const overpayments = []
  Object.keys(paymentAmounts.value).forEach(debtId => {
    const debt = getDebtById(debtId)
    if (debt) {
      const debtAmount = Number(debt.amount)
      const paymentAmount = Number(paymentAmounts.value[debtId] || 0)
      if (paymentAmount > debtAmount) {
        overpayments.push(`${debt.typeLabel}: ${formatCurrency(paymentAmount - debtAmount)} fazla`)
      }
    }
  })
  return overpayments.join(', ')
})

// Methods
const getDaysOverdue = (dueDate) => {
  if (!dueDate) return 0
  const now = new Date()
  const due = new Date(dueDate)
  const diffTime = now - due
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

const getDebtById = (debtId) => {
  return tenantDebts.value.find(debt => debt.id === debtId)
}

const fetchTenantDebts = async () => {
  if (!props.payment.tenantId) return

  try {
    console.log('🔄 Backend API ile borçlar getiriliyor...')
    const utilityDebts = await paymentsService.getUtilityDebts({ 
      tenantId: props.payment.tenantId,
      status: 'Unpaid' // Sadece ödenmemiş borçları al
    })
    
    tenantDebts.value = utilityDebts || []
    console.log(`✅ ${tenantDebts.value.length} adet ödenmemiş borç yüklendi`)
  } catch (error) {
    console.error('Borçlar yüklenirken hata:', error)
    handleNetworkError(error, { component: 'PaymentModal', action: 'fetchTenantDebts' })
    tenantDebts.value = []
  }
}

const fetchAvailableAdvances = async () => {
  if (!props.payment.tenantId) return
  
  try {
    console.log('🔄 Backend API ile avans hesapları getiriliyor...')
    const advances = await paymentsService.getAdvanceAccounts({ 
      tenantId: props.payment.tenantId,
      activeOnly: true
    })
    
    availableAdvances.value = advances
  } catch (error) {
    console.error('Avans hesapları alınırken hata:', error)
    availableAdvances.value = []
  }
}

const autoMatch = () => {
  if (!props.payment.amount || tenantDebts.value.length === 0) return

  let remainingAmount = Number(props.payment.amount)
  selectedDebts.value = []
  paymentAmounts.value = {}

  // FIFO algoritması - en eski borçtan başla
  for (const debt of tenantDebts.value) {
    if (remainingAmount <= 0) break

    const debtAmount = Number(debt.amount)
    const paymentAmount = Math.min(remainingAmount, debtAmount)
    
    selectedDebts.value.push(debt.id)
    paymentAmounts.value[debt.id] = paymentAmount
    remainingAmount -= paymentAmount
  }

  // Kullanıcıya bilgi ver
  if (selectedDebts.value.length > 1) {
    const totalDebts = selectedDebts.value.length
    const totalMatched = Object.values(paymentAmounts.value).reduce((sum, amount) => sum + Number(amount || 0), 0)
    const remaining = Number(props.payment.amount) - totalMatched
    
    console.log(`🔄 Otomatik eşleştirme: ${totalDebts} borç seçildi, ${formatCurrency(totalMatched)} eşleştirildi, ${formatCurrency(remaining)} kaldı`)
  }

  // Fazla ödeme varsa kullanıcıya bilgi ver
  if (remainingAmount > 0) {
    console.log(`💰 Fazla ödeme: ${formatCurrency(remainingAmount)} avans hesabına aktarılacak`)
  }
}

const selectOldestDebt = () => {
  if (tenantDebts.value.length > 0) {
    const oldestDebt = tenantDebts.value[0]
    selectedDebts.value = [oldestDebt.id]
    paymentAmounts.value = { [oldestDebt.id]: Number(oldestDebt.amount) }
    
    console.log(`📋 Sadece en eski borç seçildi: ${oldestDebt.typeLabel} (${oldestDebt.unit}) - ${formatCurrency(oldestDebt.amount)}`)
  }
}

const clearAllSelections = () => {
  selectedDebts.value = []
  paymentAmounts.value = {}
}

const updatePaymentAmounts = () => {
  // Seçili olmayan borçların ödeme tutarlarını temizle
  Object.keys(paymentAmounts.value).forEach(debtId => {
    if (!selectedDebts.value.includes(debtId)) {
      delete paymentAmounts.value[debtId]
    }
  })

  // Yeni seçilen borçlar için varsayılan tutar ata
  let remaining = Number(props.payment.amount || 0)
  selectedDebts.value.forEach(debtId => {
    if (!paymentAmounts.value[debtId]) {
      const debt = getDebtById(debtId)
      if (debt) {
        const debtAmount = Number(debt.amount)
        const currentPaidAmount = Number(debt.paidAmount || 0)
        const remainingDebt = debtAmount - currentPaidAmount
        // Sadece kalan ödeme kadar borca dağıt
        const pay = Math.min(remaining, remainingDebt)
        paymentAmounts.value[debtId] = pay
        remaining -= pay
      }
    }
  })
  // Eğer toplam dağıtılan ödeme, ödeme miktarını aşıyorsa, fazla olanı son borçtan düş
  let total = Object.values(paymentAmounts.value).reduce((sum, amount) => sum + Number(amount || 0), 0)
  if (total > Number(props.payment.amount || 0)) {
    // Son borçtan fazla olanı çıkar
    const lastDebtId = selectedDebts.value[selectedDebts.value.length - 1]
    if (lastDebtId) {
      paymentAmounts.value[lastDebtId] -= (total - Number(props.payment.amount || 0))
    }
  }
}

const validatePaymentAmount = (debtId) => {
  const debt = getDebtById(debtId)
  if (!debt) return
  const debtAmount = Number(debt.amount)
  const paymentAmount = Number(paymentAmounts.value[debtId] || 0)
  // Negatif değer engelle
  if (paymentAmount < 0) {
    paymentAmounts.value[debtId] = 0
  }
  // Borç tutarını aşan değer engelle
  if (paymentAmount > debtAmount) {
    paymentAmounts.value[debtId] = debtAmount
  }
  // Toplam ödeme miktarını aşan değer engelle
  const total = Object.values(paymentAmounts.value).reduce((sum, amount) => sum + Number(amount || 0), 0)
  if (total > Number(props.payment.amount || 0)) {
    paymentAmounts.value[debtId] -= (total - Number(props.payment.amount || 0))
  }
}

const createAdvanceUsageRecord = async (advanceAccountId, amount, paymentId, description) => {
  try {
    await addDoc(collection(db, 'advanceUsage'), {
      advanceAccountId: advanceAccountId,
      amount: amount,
      paymentId: paymentId,
      description: description,
      usageDate: new Date(),
      isActive: true,
      createdAt: new Date()
    })
    console.log(`💰 Avans kullanım kaydı oluşturuldu: ${advanceAccountId} - ${amount} TL`)
  } catch (error) {
    console.error('Avans kullanım kaydı oluşturulurken hata:', error)
    throw error
  }
}

const handleSave = async () => {
  if (!isFormValid.value || isLoading.value) {
    console.log('🚫 Form geçersiz veya işlem devam ediyor, kayıt engellendi')
    return
  }
  if (isLoading.value) {
    console.log('🚫 Zaten kayıt işlemi devam ediyor')
    return
  }
  isLoading.value = true
  
  try {
    console.log('🔄 Backend API ile ödeme kaydediliyor...')
    
    // Ödeme verilerini hazırla
    const paymentData = {
      tenantId: props.payment.tenantId,
      amount: Number(props.payment.amount),
      date: props.payment.date,
      type: props.payment.type,
      bank: props.payment.bank,
      description: props.payment.description || '',
      debtAllocations: Object.keys(paymentAmounts.value).map(debtId => ({
        debtId,
        amountPaid: Number(paymentAmounts.value[debtId] || 0)
      })).filter(allocation => allocation.amountPaid > 0),
      advanceAllocations: Object.keys(selectedAdvances.value).map(advanceId => ({
        advanceAccountId: advanceId,
        amount: Number(selectedAdvances.value[advanceId] || 0)
      })).filter(allocation => allocation.amount > 0)
    }

    // Backend'e gönder
    const savedPayment = await paymentsService.createPayment(paymentData)
    
    console.log('✅ Ödeme başarıyla kaydedildi:', savedPayment)
    
    // Başarı mesajı göster
    if (props.editMode) {
      showUpdateSuccess('Ödeme')
    } else {
      showCreateSuccess('Ödeme')
    }
    
    // Event gönder
    emitEvent('payment:created', {
      tenantId: props.payment.tenantId,
      amount: props.payment.amount,
      paymentId: savedPayment.id
    })
    
    // Modal'ı kapat
    emit('save', savedPayment)
    
  } catch (error) {
    console.error('Ödeme kaydedilirken hata:', error)
    handleNetworkError(error, { component: 'PaymentModal', action: 'savePayment' })
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  if (isLoading.value) return
  emit('cancel')
}

// Watchers
watch(() => props.payment.tenantId, (newVal) => {
  if (newVal) {
    fetchTenantDebts()
  }
})

watch(() => props.visible, (newVal) => {
  if (newVal) {
    fetchTenantDebts()
  }
})

onMounted(() => {
  // createInitialCollections()
})
</script>
