<template>
  <dialog v-if="visible" class="modal" open>
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
        <!-- Ödeme Tipi Seçimi -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Ödeme Türü</span>
          </label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2">
              <input type="radio" value="tenant" v-model="paymentType" />
              <span>KİRACI</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" value="owner" v-model="paymentType" />
              <span>MAL SAHİBİ</span>
            </label>
          </div>
        </div>

        <!-- Kiracı veya Mal Sahibi Seçimi -->
        <div v-if="paymentType === 'tenant'" class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span class="text-xl">👤</span>
            Kiracı Seçimi
          </h4>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Kiracı</span>
            </label>
            <select v-model="form.tenantId" @change="fetchTenantDebts" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required>
              <option disabled value="">Kiracı seçin</option>
              <option v-for="tenant in tenantsSafe" :key="tenant.id" :value="tenant.id">
                {{ getTenantDisplayName(tenant) }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="paymentType === 'owner'" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span class="text-xl">🏠</span>
            Mal Sahibi Seçimi
          </h4>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Mal Sahibi</span>
            </label>
            <select v-model="form.ownerId" @change="fetchOwnerDebts" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required>
              <option disabled value="">Mal Sahibi seçin</option>
              <option v-for="owner in owners" :key="owner.id" :value="owner.id">
                {{ owner.company || owner.fullName || owner.name || owner.email || `#${owner.id}` }}
              </option>
            </select>
          </div>
        </div>

        <!-- Banka Hareketi Bilgileri -->
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span class="text-xl">🏦</span>
            Banka Hareketi Bilgileri
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Tarih -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Hareket Tarihi</span>
              </label>
              <input v-model="form.date" type="date" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required />
            </div>

            <!-- Tutar -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Gelen Tutar (₺)</span>
              </label>
              <input v-model.number="form.amount" type="number" step="0.01" placeholder="0.00" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required />
            </div>

            <!-- Ödeme Tipi -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Ödeme Tipi</span>
              </label>
              <select v-model="form.type" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required>
                <option disabled value="">Ödeme Tipi Seçin</option>
                <option value="0">Aidat</option>
                <option value="1">Elektrik</option>
                <option value="2">Su</option>
                <option value="3">Doğalgaz</option>
                <option value="4">Diğer</option>
              </select>
            </div>

            <!-- Banka -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Banka</span>
              </label>
              <select v-model="form.bank" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required>
                <option disabled value="">Banka Seçin</option>
                <option v-for="b in banksSafe" :key="b" :value="b">{{ b }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Borç Eşleştirme Seçenekleri -->
        <div v-if="form.tenantId && tenantDebts.length > 0" class="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <span class="text-xl">📋</span>
              Borç Eşleştirme
            </h4>
            <div class="flex gap-2">
              <button type="button" @click="setAutoAllocation(true)" class="btn btn-sm btn-primary bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 text-white">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Otomatik Eşleştir
              </button>
              <button type="button" @click="setAutoAllocation(false)" class="btn btn-sm btn-outline border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
                Manuel Seç
              </button>
              <button type="button" @click="clearAllSelections" class="btn btn-sm btn-outline border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Temizle
              </button>
            </div>
          </div>

          <!-- Eşleştirme Modu -->
          <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm text-blue-700 dark:text-blue-300">
                <strong>Akıllı Ödeme Sistemi:</strong> 
                <span v-if="autoAllocate">Otomatik mod - Backend borçları kapatacak ve fazla tutarı avans hesabına aktaracak.</span>
                <span v-else>Manuel mod - Hangi borçların ödeneceğini seçebilirsiniz.</span>
              </span>
            </div>
          </div>

          <!-- Manuel Borç Seçimi -->
          <div v-if="!autoAllocate" class="space-y-3 max-h-64 overflow-y-auto">
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
                    <p class="font-bold text-red-600 dark:text-red-400">{{ formatCurrency(debt.remainingAmount || debt.amount) }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ getDaysOverdue(debt.dueDate) }} gün gecikmiş</p>
                    <p v-if="debt.paidAmount > 0" class="text-xs text-yellow-600 dark:text-yellow-400">
                      {{ formatCurrency((debt.remainingAmount || debt.amount) - debt.paidAmount) }} kalan
                    </p>
                  </div>
                </div>
                <!-- Manuel tutar girişi -->
                <div v-if="selectedDebts.includes(debt.id)" class="mt-2">
                  <input 
                    v-model="debtAllocations[debt.id]" 
                    type="number" 
                    step="0.01"
                    :max="debt.remainingAmount || debt.amount"
                    class="input input-sm input-bordered w-32" 
                    placeholder="Tutar"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Ödeme Özeti -->
          <div v-if="selectedDebts.length > 0 || autoAllocate" class="mt-4 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h5 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">Ödeme Özeti</h5>
            
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">Toplam Tutar:</span>
                <span class="font-semibold text-gray-800 dark:text-gray-100">{{ formatCurrency(form.amount) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">Eşleştirilecek:</span>
                <span class="font-semibold text-gray-800 dark:text-gray-100">{{ formatCurrency(totalAllocated) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">Avans Hesabına:</span>
                <span class="font-semibold text-primary">{{ formatCurrency((form.amount || 0) - totalAllocated) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Borç Yoksa Avans Bilgisi -->
        <div v-if="form.tenantId && tenantDebts.length === 0" class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p class="text-green-700 dark:text-green-300 font-semibold">Borç Bulunamadı</p>
              <p class="text-green-600 dark:text-green-400 text-sm">
                Seçilen kiracının ödenmemiş borcu bulunmuyor. 
                <strong>{{ formatCurrency(form.amount || 0) }}</strong> tutarı avans hesabına aktarılacak.
              </p>
            </div>
          </div>
        </div>

        <!-- Hata Mesajı -->
        <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800 mb-2">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <span class="text-red-700 dark:text-red-300 font-semibold">{{ errorMessage }}</span>
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
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import paymentsService from '@/services/paymentsService'
import ownersService from '@/services/ownersService'
import utilityDebtsService from '@/services/utilityDebtsService'
import { useErrorHandler } from '@/composables/useErrorHandler'



const props = defineProps({
  visible: { type: Boolean, default: false },
  payment: {
    type: Object,
    default: () => ({
      tenantId: null,
      ownerId: null,
      amount: null,
      date: '',
      type: '',
      bank: '',
      description: ''
    })
  },
  tenants: { type: Array, default: () => [] },
  banks:   { type: Array, default: () => [] },
  editMode:{ type: Boolean, default: false }
})
const emit = defineEmits(['save','cancel','close'])

const { handleNetworkError } = useErrorHandler()



/* ---------------- Local Form State ---------------- */
const form = reactive({
  tenantId: null,
  ownerId: null,
  amount: null,
  date: '',
  type: '',
  bank: '',
  description: ''
})
watch(() => props.payment, (val) => {
  Object.assign(form, val || {})
}, { immediate: true, deep: true })

/* ---------------- Select lists & helpers ---------------- */
const owners = ref([])
const tenantsSafe = computed(() => props.tenants || [])
const banksSafe   = computed(() => props.banks || [])
const getTenantDisplayName = (t) =>
  t?.companyName ||
  t?.company ||
  t?.contactPersonName ||
  t?.fullName ||
  [t?.firstName, t?.lastName].filter(Boolean).join(' ') ||
  t?.email ||
  `#${t?.id}`

/* ---------------- Payment type ---------------- */
const paymentType = ref('tenant')
watch(() => props.payment, (val) => {
  // parent set ettiyse otomatik tip seç
  if (val?.ownerId) paymentType.value = 'owner'
  else if (val?.tenantId) paymentType.value = 'tenant'
}, { immediate: true })

/* ---------------- Debts & allocation ---------------- */
const tenantDebts = ref([])
const selectedDebts = ref([])
const autoAllocate = ref(true)
const debtAllocations = ref({})

const setAutoAllocation = (value) => {
  autoAllocate.value = value
  if (value) {
    selectedDebts.value = []
    debtAllocations.value = {}
  }
}

const totalAllocated = computed(() =>
  selectedDebts.value.reduce((total, id) => total + (Number(debtAllocations.value[id]) || 0), 0)
)

const clearAllSelections = () => {
  selectedDebts.value = []
  debtAllocations.value = {}
}

const updatePaymentAmounts = () => {
  // BE avans mantığını yönetecek, burada sadece state’i güncel tutuyoruz
}

/* ---------------- UI helpers ---------------- */
const isLoading = ref(false)
const errorMessage = ref('')

const formatCurrency = (value) => {
  const n = Number(value || 0)
  return n.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}
const getDaysOverdue = (dueDate) => {
  if (!dueDate) return 0
  const now = new Date()
  const due = new Date(dueDate)
  const diff = Math.ceil((now - due) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

/* ---------------- Validasyon ---------------- */
const isFormValid = computed(() =>
  !!form.date &&
  Number(form.amount) > 0 &&
  form.type !== '' &&
  !!form.bank &&
  ((paymentType.value === 'tenant' && !!form.tenantId) ||
   (paymentType.value === 'owner'  && !!form.ownerId))
)

/* ---------------- API: Debts fetch ---------------- */
const fetchTenantDebts = async () => {
  if (!form.tenantId) return
  try {
    const utilityDebts = await utilityDebtsService.getUtilityDebts({
      tenantId: form.tenantId,
      status: 'Unpaid'
    })
    tenantDebts.value = utilityDebts || []
  } catch (error) {
    handleNetworkError(error, { component: 'PaymentModal', action: 'fetchTenantDebts' })
    tenantDebts.value = []
  }
}

const fetchOwnerDebts = async () => {
  if (!form.ownerId) return
  try {
    const ownerDebts = await utilityDebtsService.getUtilityDebts({
      ownerId: form.ownerId,
      status: 'Unpaid'
    })
    tenantDebts.value = ownerDebts || []
  } catch (error) {
    handleNetworkError(error, { component: 'PaymentModal', action: 'fetchOwnerDebts' })
    tenantDebts.value = []
  }
}

/* ---------------- Save / Cancel ---------------- */
const handleSave = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Lütfen tüm zorunlu alanları doldurun ve geçerli bir tutar girin.'
    showErrorToast(errorMessage.value)
    return
  }
  isLoading.value = true
  errorMessage.value = ''
  try {
    const payload = {
      tenantId: paymentType.value === 'tenant' ? form.tenantId : null,
      ownerId:  paymentType.value === 'owner'  ? form.ownerId  : null,
      amount: Number(form.amount),
      paymentDate: form.date,
      type: parseInt(form.type) || 0,
      bank: form.bank,
      description: form.description || '',
      autoAllocate: autoAllocate.value,
      debtAllocations: autoAllocate.value ? [] : selectedDebts.value.map(id => ({
        debtId: id,
        amount: Number(debtAllocations.value[id] || 0)
      }))
    }

    const saved = await paymentsService.createPaymentWithAllocation(payload)

    
    emit('save', saved)
  } catch (error) {
    try {
      handleNetworkError(error, { component: 'PaymentModal', action: 'savePayment' })
    } catch {
      showErrorToast('Ödeme kaydedilirken bir hata oluştu.')
    }
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

function resetForm() {
  tenantDebts.value = []
  selectedDebts.value = []
  debtAllocations.value = {}
  isLoading.value = false
  errorMessage.value = ''
}

/* ---------------- Toast fallback ---------------- */
function showErrorToast(msg) {
  try {
    if (typeof window !== 'undefined' && window.$toast) window.$toast.error(msg)
    else alert(msg)
  } catch { alert(msg) }
}

/* ---------------- Lifecycle & watchers ---------------- */
const handleEscape = (e) => {
  if (props.visible && e.key === 'Escape') handleCancel()
}

onMounted(async () => {
  window.addEventListener('keydown', handleEscape)
  try {
    const data = await ownersService.getOwners()
    owners.value = data || []
  } catch { owners.value = [] }

  // görünür ve tenantId varsa ilk borçları çek
  if (paymentType.value === 'tenant') await fetchTenantDebts()
  else await fetchOwnerDebts()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
})

watch(paymentType, (val) => {
  if (val === 'tenant') fetchTenantDebts()
  else fetchOwnerDebts()
})

watch(() => form.tenantId, () => {
  if (paymentType.value === 'tenant') fetchTenantDebts()
})
watch(() => form.ownerId, () => {
  if (paymentType.value === 'owner') fetchOwnerDebts()
})
</script>
