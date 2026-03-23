<template>
  <BaseModal
    :model-value="visible"
    title="Akıllı Ödeme Sistemi"
    icon="💳"
    size="xl"
    :is-dirty="isDirty"
    @close="handleCancel"
  >
    <!-- Step İndikatörü -->
    <div class="flex items-center justify-between mb-6 select-none">
      <div
        v-for="(stepLabel, i) in stepLabels"
        :key="i"
        class="flex items-center gap-2"
        :class="i < stepLabels.length - 1 ? 'flex-1' : ''"
      >
        <div class="flex flex-col items-center gap-1">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200"
            :class="
              currentStep > i + 1
                ? 'bg-green-500 text-white'
                : currentStep === i + 1
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
            "
          >
            <svg v-if="currentStep > i + 1" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="text-[10px] sm:text-xs font-medium text-center leading-tight"
            :class="currentStep === i + 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'">
            {{ stepLabel }}
          </span>
        </div>
        <div v-if="i < stepLabels.length - 1"
          class="flex-1 h-0.5 mx-2 mb-4 transition-all duration-300"
          :class="currentStep > i + 1 ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'"
        />
      </div>
    </div>

    <!-- ADIM 1: Kim + Ne Kadar? -->
    <div v-if="currentStep === 1" class="space-y-5">
      <!-- Ödeme Türü -->
      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Ödeme Türü</span>
        </label>
        <div class="flex gap-3">
          <button
            type="button"
            @click="paymentType = 'tenant'"
            class="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-semibold transition-all active:scale-95"
            :class="paymentType === 'tenant'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'"
          >
            <span>👤</span> Kiracı
          </button>
          <button
            type="button"
            @click="paymentType = 'owner'"
            class="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-semibold transition-all active:scale-95"
            :class="paymentType === 'owner'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'"
          >
            <span>🏠</span> Mal Sahibi
          </button>
        </div>
      </div>

      <!-- Kişi Seçimi -->
      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold text-gray-700 dark:text-gray-300">
            {{ paymentType === 'tenant' ? 'Kiracı' : 'Mal Sahibi' }}
          </span>
        </label>
        <select
          v-if="paymentType === 'tenant'"
          v-model="form.tenantId"
          class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          :class="{ 'border-red-400': step1Touched && !form.tenantId }"
        >
          <option disabled value="">Kiracı seçin</option>
          <option v-for="t in tenantsSafe" :key="t.id" :value="t.id">{{ getTenantDisplayName(t) }}</option>
        </select>
        <select
          v-else
          v-model="form.ownerId"
          class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          :class="{ 'border-red-400': step1Touched && !form.ownerId }"
        >
          <option disabled value="">Mal sahibi seçin</option>
          <option v-for="o in owners" :key="o.id" :value="o.id">{{ o.company || o.fullName || o.name || o.email }}</option>
        </select>
        <p v-if="step1Touched && paymentType === 'tenant' && !form.tenantId" class="text-red-500 text-xs mt-1">Lütfen kiracı seçin.</p>
        <p v-if="step1Touched && paymentType === 'owner' && !form.ownerId" class="text-red-500 text-xs mt-1">Lütfen mal sahibi seçin.</p>
      </div>

      <!-- Banka Hareketi Bilgileri -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Hareket Tarihi *</span></label>
          <input
            v-model="form.date"
            type="date"
            class="input input-bordered w-full bg-white dark:bg-gray-700"
            :class="{ 'border-red-400': step1Touched && !form.date }"
          />
          <p v-if="step1Touched && !form.date" class="text-red-500 text-xs mt-1">Tarih zorunludur.</p>
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Gelen Tutar (₺) *</span></label>
          <input
            :value="displayAmount"
            @focus="isAmountFocused = true"
            @blur="isAmountFocused = false"
            @input="updateAmount($event.target.value)"
            type="text"
            inputmode="decimal"
            placeholder="0.00"
            class="input input-bordered w-full bg-white dark:bg-gray-700 font-bold"
            :class="{ 'border-red-400': step1Touched && !(Number(form.amount) > 0) }"
          />
          <p v-if="step1Touched && !(Number(form.amount) > 0)" class="text-red-500 text-xs mt-1">Geçerli bir tutar girin.</p>
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Ödeme Tipi *</span></label>
          <select
            v-model="form.type"
            class="select select-bordered w-full bg-white dark:bg-gray-700"
            :class="{ 'border-red-400': step1Touched && form.type === '' }"
          >
            <option disabled value="">Seçin</option>
            <option value="0">Aidat</option>
            <option value="1">Elektrik</option>
            <option value="2">Su</option>
            <option value="3">Doğalgaz</option>
            <option value="4">Diğer</option>
          </select>
          <p v-if="step1Touched && form.type === ''" class="text-red-500 text-xs mt-1">Ödeme tipi seçin.</p>
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Banka *</span></label>
          <select
            v-model="form.bank"
            class="select select-bordered w-full bg-white dark:bg-gray-700"
            :class="{ 'border-red-400': step1Touched && !form.bank }"
          >
            <option disabled value="">Seçin</option>
            <option v-for="b in banksSafe" :key="b" :value="b">{{ b }}</option>
          </select>
          <p v-if="step1Touched && !form.bank" class="text-red-500 text-xs mt-1">Banka seçin.</p>
        </div>
      </div>
    </div>

    <!-- ADIM 2: Borç Eşleştirme -->
    <div v-if="currentStep === 2" class="space-y-4">
      <!-- Yükleniyor -->
      <div v-if="loadingDebts" class="flex items-center justify-center py-10 gap-3 text-gray-500">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span>Borçlar yükleniyor...</span>
      </div>

      <!-- Borç yok -->
      <div v-else-if="tenantDebts.length === 0" class="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800 flex items-start gap-3">
        <svg class="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div>
          <p class="font-semibold text-green-700 dark:text-green-300">Ödenmemiş borç bulunamadı</p>
          <p class="text-sm text-green-600 dark:text-green-400 mt-1">
            <strong>{{ formatCurrency(form.amount) }}</strong> tutarın tamamı avans hesabına aktarılacak.
          </p>
        </div>
      </div>

      <!-- Borçlar var -->
      <template v-else>
        <!-- Mod seçimi -->
        <div class="flex gap-2">
          <button
            type="button"
            @click="setAutoAllocation(true)"
            class="flex-1 py-2 px-3 rounded-lg border-2 text-sm font-semibold transition-all active:scale-95"
            :class="autoAllocate ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
          >
            ⚡ Otomatik Eşleştir
          </button>
          <button
            type="button"
            @click="setAutoAllocation(false)"
            class="flex-1 py-2 px-3 rounded-lg border-2 text-sm font-semibold transition-all active:scale-95"
            :class="!autoAllocate ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
          >
            ✏️ Manuel Seç
          </button>
        </div>

        <div v-if="autoAllocate" class="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
          Backend borçları en eskiden başlayarak kapatacak, fazla tutar avans hesabına aktarılacak.
        </div>

        <!-- Manuel borç listesi -->
        <div v-else class="space-y-2 max-h-64 overflow-y-auto overscroll-contain">
          <div
            v-for="debt in tenantDebts"
            :key="debt.id"
            @click="toggleDebt(debt.id)"
            class="flex items-start gap-3 p-3 bg-white dark:bg-gray-700 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.99]"
            :class="selectedDebts.includes(debt.id)
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'"
          >
            <input
              type="checkbox"
              :checked="selectedDebts.includes(debt.id)"
              @click.stop
              @change="toggleDebt(debt.id)"
              class="checkbox checkbox-primary mt-1 flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="font-semibold text-gray-800 dark:text-gray-100 text-sm">{{ getDebtTypeLabel(debt.type) }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ debt.period || debt.dueDateFormatted }}
                    <span v-if="debt.unit && debt.unit !== '-'" class="text-blue-500 ml-1">({{ debt.unit }})</span>
                  </p>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="font-bold text-red-600 dark:text-red-400 text-sm">{{ formatCurrency(debt.remainingAmount || debt.amount) }}</p>
                  <p class="text-xs text-gray-400">{{ getDaysOverdue(debt.dueDate) }} gün</p>
                </div>
              </div>
              <div v-if="selectedDebts.includes(debt.id)" class="mt-2 flex items-center gap-2" @click.stop>
                <input
                  :value="getDisplayRowAmount(debt.id)"
                  @focus="isRowFocused[debt.id] = true"
                  @blur="isRowFocused[debt.id] = false"
                  @input="updateRowAmount(debt.id, $event.target.value)"
                  type="text"
                  inputmode="decimal"
                  class="input input-sm input-bordered w-full md:w-32 font-medium"
                  placeholder="Seçilen Tutar"
                />
                <button type="button" @click="debtAllocations[debt.id] = (debt.remainingAmount || debt.amount)" class="btn btn-xs btn-ghost text-blue-600">Tamamı</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Özet -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-2">
          <div class="flex justify-between text-sm"><span class="text-gray-500">Toplam Tutar</span><span class="font-semibold">{{ formatCurrency(form.amount) }}</span></div>
          <div class="flex justify-between text-sm"><span class="text-gray-500">Eşleştirilecek</span><span class="font-semibold">{{ formatCurrency(autoAllocate ? form.amount : totalAllocated) }}</span></div>
          <div class="flex justify-between text-sm border-t dark:border-gray-700 pt-2"><span class="text-gray-500">Avans Hesabına</span><span class="font-semibold text-blue-600">{{ formatCurrency(autoAllocate ? 0 : (form.amount - totalAllocated)) }}</span></div>
        </div>
      </template>
    </div>

    <!-- ADIM 3: Özet ve Onay -->
    <div v-if="currentStep === 3" class="space-y-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y dark:divide-gray-700">
        <div class="px-4 py-3 flex justify-between items-center">
          <span class="text-sm text-gray-500">Ödeme Türü</span>
          <span class="font-semibold text-gray-800 dark:text-gray-100">{{ paymentType === 'tenant' ? '👤 Kiracı' : '🏠 Mal Sahibi' }}</span>
        </div>
        <div class="px-4 py-3 flex justify-between items-center">
          <span class="text-sm text-gray-500">{{ paymentType === 'tenant' ? 'Kiracı' : 'Mal Sahibi' }}</span>
          <span class="font-semibold text-gray-800 dark:text-gray-100">{{ selectedPersonName }}</span>
        </div>
        <div class="px-4 py-3 flex justify-between items-center">
          <span class="text-sm text-gray-500">Tarih</span>
          <span class="font-semibold text-gray-800 dark:text-gray-100">{{ form.date }}</span>
        </div>
        <div class="px-4 py-3 flex justify-between items-center">
          <span class="text-sm text-gray-500">Tutar</span>
          <span class="text-xl font-bold text-green-600 dark:text-green-400">{{ formatCurrency(form.amount) }}</span>
        </div>
        <div class="px-4 py-3 flex justify-between items-center">
          <span class="text-sm text-gray-500">Banka</span>
          <span class="font-semibold text-gray-800 dark:text-gray-100">{{ form.bank }}</span>
        </div>
        <div class="px-4 py-3 flex justify-between items-center">
          <span class="text-sm text-gray-500">Borç Eşleştirme</span>
          <span class="font-semibold text-gray-800 dark:text-gray-100">{{ autoAllocate ? '⚡ Otomatik' : `✏️ Manuel (${selectedDebts.length} borç)` }}</span>
        </div>
      </div>

      <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800 flex items-center gap-3">
        <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <span class="text-red-700 dark:text-red-300 text-sm font-semibold">{{ errorMessage }}</span>
      </div>
    </div>

    <!-- Footer butonları (BaseModal footer slot'u) -->
    <template #footer>
      <button
        v-if="currentStep > 1"
        type="button"
        @click="prevStep"
        :disabled="isLoading"
        class="btn btn-outline border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 active:scale-95"
      >
        ← Geri
      </button>
      <button
        v-if="currentStep < 3"
        type="button"
        @click="nextStep"
        class="btn btn-primary active:scale-95"
      >
        İleri →
      </button>
      <button
        v-if="currentStep === 3"
        type="button"
        @click="handleSave"
        :disabled="isLoading"
        class="btn btn-success bg-gradient-to-r from-green-600 to-green-700 border-0 text-white active:scale-95"
      >
        <svg v-if="!isLoading" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <svg v-else class="w-4 h-4 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        {{ isLoading ? 'Kaydediliyor...' : 'Ödemeyi Kaydet' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import paymentsService from '@/infrastructure/services/paymentsService'
import ownersService from '@/infrastructure/services/ownersService'
import utilityDebtsService from '@/infrastructure/services/utilityDebtsService'
import { useErrorHandler } from '@/application/composables/useErrorHandler'
import { useNotify } from '@/application/composables/useNotify'
import { getPaymentTypeLabel, getDebtTypeLabel } from '@/core/constants/enums'
import { useDirtyGuard } from '@/application/composables/useDirtyGuard'

const props = defineProps({
  visible: { type: Boolean, default: false },
  payment: {
    type: Object,
    default: () => ({ tenantId: null, ownerId: null, amount: null, date: '', type: '', bank: '', description: '' })
  },
  tenants: { type: Array, default: () => [] },
  banks:   { type: Array, default: () => [] },
  editMode: { type: Boolean, default: false },
  debtRefreshKey: { type: Number, default: 0 }
})
const emit = defineEmits(['save', 'cancel', 'close'])

const { handleNetworkError } = useErrorHandler()
const { notifyError } = useNotify()

// ── Wizard state ──────────────────────────────────────────────
const currentStep = ref(1)
const stepLabels = ['Temel Bilgiler', 'Borç Eşleştirme', 'Özet & Onay']
const step1Touched = ref(false)

// ── Form state ────────────────────────────────────────────────
const form = reactive({ tenantId: null, ownerId: null, amount: null, date: '', type: '', bank: '', description: '' })
watch(() => props.payment, (val) => { Object.assign(form, val || {}) }, { immediate: true, deep: true })

// ── Input Formatters (Thousand Separator) ─────────────────────
const isAmountFocused = ref(false)
const displayAmount = computed(() => {
  if (isAmountFocused.value) return form.amount === null ? '' : form.amount.toString()
  if (form.amount === null || form.amount === undefined) return ''
  return form.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})

const updateAmount = (val) => {
  const clean = val.replace(/[^0-9,.-]/g, '').replace(/\./g, '').replace(',', '.')
  form.amount = isNaN(parseFloat(clean)) ? null : parseFloat(clean)
}

const isRowFocused = reactive({})
const getDisplayRowAmount = (id) => {
  if (isRowFocused[id]) return debtAllocations.value[id] === undefined ? '' : debtAllocations.value[id].toString()
  if (!debtAllocations.value[id]) return ''
  return Number(debtAllocations.value[id]).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const updateRowAmount = (id, val) => {
  const clean = val.replace(/[^0-9,.-]/g, '').replace(/\./g, '').replace(',', '.')
  debtAllocations.value[id] = isNaN(parseFloat(clean)) ? undefined : parseFloat(clean)
}

// ── Dirty guard ───────────────────────────────────────────────
const { isDirty, resetDirty } = useDirtyGuard(() => ({ ...form }))

// ── Listeler ──────────────────────────────────────────────────
const owners = ref([])
const tenantsSafe = computed(() => props.tenants || [])
const banksSafe   = computed(() => props.banks || [])

const getTenantDisplayName = (t) =>
  t?.companyName || t?.company || t?.contactPersonName ||
  t?.fullName || [t?.firstName, t?.lastName].filter(Boolean).join(' ') ||
  t?.email || `#${t?.id}`

// ── Ödeme türü ────────────────────────────────────────────────
const paymentType = ref('tenant')
watch(() => props.payment, (val) => {
  if (val?.ownerId) paymentType.value = 'owner'
  else paymentType.value = 'tenant'
}, { immediate: true })

// ── Borçlar ───────────────────────────────────────────────────
const tenantDebts    = ref([])
const loadingDebts   = ref(false)
const selectedDebts  = ref([])
const autoAllocate   = ref(true)
const debtAllocations = ref({})

// Re-fetch debts when advance account usage changes debt status
watch(() => props.debtRefreshKey, (newKey, oldKey) => {
  if (newKey !== oldKey && props.visible) fetchDebts()
})

const setAutoAllocation = (v) => {
  autoAllocate.value = v
  if (v) { selectedDebts.value = []; debtAllocations.value = {} }
}

const toggleDebt = (id) => {
  const idx = selectedDebts.value.indexOf(id)
  if (idx === -1) selectedDebts.value.push(id)
  else selectedDebts.value.splice(idx, 1)
}

const totalAllocated = computed(() =>
  selectedDebts.value.reduce((s, id) => s + (Number(debtAllocations.value[id]) || 0), 0)
)

const fetchDebts = async () => {
  loadingDebts.value = true
  tenantDebts.value = []
  try {
    const filterType = form.type !== '' ? parseInt(form.type) : undefined
    if (paymentType.value === 'tenant' && form.tenantId) {
      tenantDebts.value = await utilityDebtsService.getUtilityDebts({ tenantId: form.tenantId, excludePaid: true, type: filterType }) || []
    } else if (paymentType.value === 'owner' && form.ownerId) {
      tenantDebts.value = await utilityDebtsService.getUtilityDebts({ ownerId: form.ownerId, excludePaid: true, type: filterType }) || []
    }
  } catch (e) {
    handleNetworkError(e, { component: 'PaymentModal', action: 'fetchDebts' })
  } finally {
    loadingDebts.value = false
  }
}

// ── Özet için kişi adı ────────────────────────────────────────
const selectedPersonName = computed(() => {
  if (paymentType.value === 'tenant') {
    const t = tenantsSafe.value.find(t => t.id === form.tenantId)
    return t ? getTenantDisplayName(t) : '—'
  }
  const o = owners.value.find(o => o.id === form.ownerId)
  return o ? (o.company || o.fullName || o.name || '—') : '—'
})

// ── Adım 1 validasyonu ────────────────────────────────────────
const isStep1Valid = computed(() =>
  !!form.date &&
  Number(form.amount) > 0 &&
  form.type !== '' &&
  !!form.bank &&
  ((paymentType.value === 'tenant' && !!form.tenantId) ||
   (paymentType.value === 'owner'  && !!form.ownerId))
)

// ── Navigasyon ────────────────────────────────────────────────
const nextStep = async () => {
  if (currentStep.value === 1) {
    step1Touched.value = true
    if (!isStep1Valid.value) return
    await fetchDebts()
  }
  currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

// ── Yardımcılar ───────────────────────────────────────────────
const isLoading    = ref(false)
const errorMessage = ref('')

const formatCurrency = (v) =>
  Number(v || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })

const getDaysOverdue = (d) => {
  if (!d) return 0
  const diff = Math.ceil((Date.now() - new Date(d)) / 86400000)
  return diff > 0 ? diff : 0
}

// ── Kaydet ────────────────────────────────────────────────────
const handleSave = async () => {
  // Manuel modda borç seçilmemişse kaydetme
  if (!autoAllocate.value && selectedDebts.value.length === 0) {
    errorMessage.value = 'Manuel eşleştirme için en az 1 borç seçmelisiniz.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  try {
    const fType = parseInt(form.type)
    const payload = {
      tenantId: paymentType.value === 'tenant' ? form.tenantId : null,
      ownerId:  paymentType.value === 'owner'  ? form.ownerId  : null,
      amount: Number(form.amount),
      paymentDate: form.date,
      // 0->1(Dues), 1&2->2(Utility), o.w->3(Other)
      type: fType === 0 ? 1 : (fType === 1 || fType === 2 ? 2 : 3), 
      targetDebtType: fType < 3 ? fType : null,
      bank: form.bank,
      description: form.description || '',
      autoAllocate: autoAllocate.value,
      debtAllocations: autoAllocate.value ? [] : selectedDebts.value.map(id => ({
        debtId: id,
        amount: Number(debtAllocations.value[id] || 0)
      }))
    }
    const saved = await paymentsService.createPaymentWithAllocation(payload)
    resetDirty()
    emit('save', saved)
  } catch (e) {
    try {
      handleNetworkError(e, { component: 'PaymentModal', action: 'savePayment' })
    } catch {
      errorMessage.value = 'Ödeme kaydedilirken bir hata oluştu.'
      notifyError('Ödeme kaydedilirken bir hata oluştu.')
    }
  } finally {
    isLoading.value = false
  }
}

// ── İptal ─────────────────────────────────────────────────────
const handleCancel = () => {
  resetForm()
  emit('cancel')
}

const resetForm = () => {
  currentStep.value = 1
  step1Touched.value = false
  tenantDebts.value = []
  selectedDebts.value = []
  debtAllocations.value = {}
  isLoading.value = false
  errorMessage.value = ''
  resetDirty()
}

// ── Lifecycle ─────────────────────────────────────────────────
const handleEscape = (e) => { if (props.visible && e.key === 'Escape') handleCancel() }

onMounted(async () => {
  window.addEventListener('keydown', handleEscape)
  try { owners.value = await ownersService.getOwners() || [] }
  catch { owners.value = [] }
})

onBeforeUnmount(() => window.removeEventListener('keydown', handleEscape))

watch(() => props.visible, (v) => { if (!v) resetForm() })
</script>
