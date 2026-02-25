<template>
  <div v-if="loading" class="flex justify-center items-center py-12">
    <LoadingSpinner />
  </div>

  <div v-else class="advance-account-manager bg-base-100 p-6 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6 text-primary">Avans Hesabı Yönetimi</h2>

    <!-- Kiracı seçimi -->
    <div class="form-control mb-6">
      <label class="label">
        <span class="label-text font-semibold">Kiracı Seçin</span>
      </label>
      <select
        v-model="selectedTenantId"
        class="select select-bordered"
        @change="loadAdvanceAccount"
      >
        <option value="">Kiracı seçiniz</option>
        <option v-for="t in tenants" :key="t.id || t._id" :value="t.id || t._id">
          {{ tenantLabel(t) }}
        </option>
      </select>
    </div>

    <!-- Avans hesabı bilgileri -->
    <div v-if="advanceAccount" class="mb-6">
      <div class="bg-base-200 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-3">Mevcut Bakiye</h3>
        <div class="text-3xl font-bold text-primary">
          {{ formatCurrency(advanceBalance) }}
        </div>
        <div class="text-sm text-gray-600 mt-2">
          Son güncelleme:
          {{ formatDate(advanceAccount.updatedAt || advanceAccount.createdAt) }}
        </div>
      </div>
    </div>

    <!-- Borç ödeme formu -->
    <div
      v-if="advanceAccount && unpaidDebts.length > 0"
      class="border-t pt-6"
    >
      <h3 class="text-lg font-semibold mb-4">Borç Öde</h3>

      <div class="space-y-3 mb-4 max-h-80 overflow-auto pr-1">
        <div
          v-for="debt in unpaidDebts"
          :key="debt.id || debt._id"
          class="border rounded-lg p-3"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <input
                v-model="selectedDebts"
                :value="debt.id || debt._id"
                type="checkbox"
                class="checkbox checkbox-sm checkbox-primary"
                :disabled="!canSelectDebt(debt)"
              />
              <div class="truncate">
                <div class="font-medium truncate">
                  {{ debt.description || `${getDebtTypeLabel(debt.type)} - ${debt.periodYear}/${String(debt.periodMonth).padStart(2,'0')}` }}
                </div>
                <div class="text-sm text-gray-600">
                  Kalan:
                  {{ formatCurrency(safeRemaining(debt)) }}
                  <span class="ml-2">| Vade: {{ formatDate(debt.dueDate) }}</span>
                </div>
              </div>
            </div>

            <div v-if="selectedDebts.includes(debt.id || debt._id)" class="w-36">
              <input
                v-model.number="paymentAmounts[debt.id || debt._id]"
                @input="onAmountInput(debt)"
                type="number"
                step="0.01"
                :min="0"
                :max="maxAllocatableForDebt(debt)"
                class="input input-sm input-bordered w-full"
                placeholder="Tutar"
              />
            </div>
          </div>

          <div
            v-if="!canSelectDebt(debt)"
            class="text-sm text-warning mt-2"
          >
            ⚠️ Yetersiz bakiye
          </div>
        </div>
      </div>

      <!-- Özet -->
      <div
        v-if="selectedDebts.length > 0"
        class="bg-base-200 p-4 rounded-lg mb-4"
      >
        <h4 class="font-semibold mb-2">Ödeme Özeti</h4>
        <div class="flex justify-between mb-2">
          <span>Toplam Ödenecek:</span>
          <span class="font-semibold">{{ formatCurrency(totalPaymentAmount) }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span>Mevcut Bakiye:</span>
          <span class="font-semibold">{{ formatCurrency(advanceBalance) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Kalan Bakiye:</span>
          <span
            class="font-semibold"
            :class="remainingBalance < 0 ? 'text-error' : 'text-success'"
          >
            {{ formatCurrency(remainingBalance) }}
          </span>
        </div>
        <div v-if="remainingBalance < 0" class="text-sm text-error mt-2">
          ⚠️ Yetersiz bakiye! Lütfen ödeme tutarlarını azaltın.
        </div>
      </div>

      <button
        @click="useAdvanceAccount"
        class="btn btn-primary"
        :disabled="loading || !canSubmit"
      >
        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
        {{ loading ? 'İşleniyor...' : 'Avans Kullan' }}
      </button>
    </div>

    <!-- Borç yoksa mesaj -->
    <div v-else-if="advanceAccount && unpaidDebts.length === 0" class="text-center py-8">
      <div class="text-gray-500">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-lg font-medium">Ödenecek borç bulunmuyor</p>
        <p class="text-sm">Bu kiracının ödenmemiş borcu bulunmamaktadır.</p>
      </div>
    </div>

    <!-- Avans hesabı yoksa mesaj -->
    <div v-else-if="selectedTenantId && !advanceAccount" class="text-center py-8">
      <div class="text-gray-500">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <p class="text-lg font-medium">Avans hesabı bulunamadı</p>
        <p class="text-sm">Bu kiracının avans hesabı bulunmamaktadır.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import paymentsService from '@/services/paymentsService'
import tenantsService from '@/services/tenantsService'
import utilityDebtsService from '@/services/utilityDebtsService'
import { getDebtTypeLabel } from '@/constants/enums'
import { useNotify } from '@/composables/useNotify'
// import { errorHandler } from '@/utils/errorHandler' // istersen merkezi error’la

const { notifyError } = useNotify()

const props = defineProps({
  tenantId: { type: String, default: '' }
})

const emit = defineEmits(['success'])

/* state */
const loading = ref(false)
const tenants = ref([])
const selectedTenantId = ref(props.tenantId || '')
const advanceAccount = ref(null)
const unpaidDebts = ref([])
const selectedDebts = ref([])
const paymentAmounts = ref({})

/* helpers */
const formatCurrency = (amount) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })
    .format(Number(amount || 0))

const formatDate = (date) => safeFormatDate(date, 'dd MMM yyyy')

const tenantLabel = (t) =>
  t?.companyName ||
  t?.company ||
  [t?.firstName, t?.lastName].filter(Boolean).join(' ') ||
  t?.fullName ||
  t?.email ||
  'Bilinmiyor'

/* derived */
const advanceBalance = computed(() => Number(advanceAccount?.value?.balance || 0))

const safeRemaining = (debt) => Number(debt?.remainingAmount ?? debt?.amount ?? 0)

const clampedAmountFor = (debtId) => {
  const debt = unpaidDebts.value.find(d => (d.id || d._id) === debtId)
  if (!debt) return 0
  const val = Number(paymentAmounts.value[debtId] || 0)
  const max = maxAllocatableForDebt(debt)
  if (!isFinite(val) || val <= 0) return 0
  return Math.min(val, max)
}

const totalPaymentAmount = computed(() =>
  selectedDebts.value.reduce((sum, id) => sum + clampedAmountFor(id), 0)
)

const remainingBalance = computed(() => advanceBalance.value - totalPaymentAmount.value)

const canSubmit = computed(() =>
  selectedDebts.value.length > 0 &&
  totalPaymentAmount.value > 0 &&
  remainingBalance.value >= 0
)

/* UI rules */
const canSelectDebt = (debt) =>
  advanceBalance.value > 0 && safeRemaining(debt) > 0 && advanceBalance.value >= 0.01

const maxAllocatableForDebt = (debt) => {
  const remaining = safeRemaining(debt)
  const currentId = debt.id || debt._id
  
  // diğer seçili borçlara ayrılmış toplam tutarı ham değerler üzerinden hesapla (sonsuz döngüyü kırmak için)
  const others = selectedDebts.value
    .filter(id => id !== currentId)
    .reduce((s, id) => {
      const val = Number(paymentAmounts.value[id] || 0)
      const d = unpaidDebts.value.find(x => (x.id || x._id) === id)
      const rem = d ? safeRemaining(d) : Infinity
      return s + Math.min(val, rem)
    }, 0)
    
  const balanceLeft = Math.max(0, advanceBalance.value - others)
  return Math.max(0, Math.min(remaining, balanceLeft))
}

/* data fetch */
const loadTenants = async () => {
  loading.value = true
  try {
    const res = await tenantsService.getTenants()
    tenants.value = Array.isArray(res) ? res : (res?.items || [])
  } catch (e) {
    console.error('Kiracılar yüklenemedi:', e)
    tenants.value = []
  } finally {
    loading.value = false
  }
}

const loadAdvanceAccount = async () => {
  // reset selections when tenant changes
  selectedDebts.value = []
  paymentAmounts.value = {}
  advanceAccount.value = null
  unpaidDebts.value = []

  if (!selectedTenantId.value) return
  loading.value = true
  try {
    // 1) Avans hesabı
    const adv = await paymentsService.getAdvanceAccounts({
      tenantId: selectedTenantId.value,
      activeOnly: true
    })
    advanceAccount.value = Array.isArray(adv) ? adv[0] : adv?.items?.[0] || null

    // 2) Ödenmemiş borçlar — diğer sayfalarla tutarlı
    const debts = await utilityDebtsService.getUtilityDebts({
      tenantId: selectedTenantId.value,
      status: 'Unpaid'
    })
    unpaidDebts.value = Array.isArray(debts) ? debts : (debts?.items || [])
  } catch (e) {
    console.error('Avans/borçlar yüklenemedi:', e)
    advanceAccount.value = null
    unpaidDebts.value = []
  } finally {
    loading.value = false
  }
}

/* actions */
const onAmountInput = (debt) => {
  const id = debt.id || debt._id
  const val = Number(paymentAmounts.value[id] || 0)
  if (!isFinite(val) || val <= 0) {
    paymentAmounts.value[id] = 0
    return
  }
  const max = maxAllocatableForDebt(debt)
  paymentAmounts.value[id] = Math.min(val, max)
}

const useAdvanceAccount = async () => {
  if (loading.value || !canSubmit.value) return
  loading.value = true
  try {
    const debtPayments = selectedDebts.value
      .map(id => ({ debtId: id, amount: clampedAmountFor(id) }))
      .filter(dp => dp.amount > 0)

    const payload = {
      tenantId: selectedTenantId.value,
      debtPayments,
      description: 'Avans hesabından borç ödemesi'
    }

    const res = await paymentsService.useAdvanceAccount(payload)
    emit('success', res)
    await loadAdvanceAccount() // yenile
  } catch (e) {
    console.error('Avans kullanılamadı:', e)
    // errorHandler.logError(e, { component: 'AdvanceAccountManager', action: 'useAdvance' })
    notifyError('Avans kullanılamadı. Lütfen tekrar deneyin.')
  } finally {
    loading.value = false
  }
}

/* watchers */
watch(selectedTenantId, () => {
  loadAdvanceAccount()
})

watch(selectedDebts, (now, prev) => {
  // Yeni eklenen borçlara otomatik başlangıç tutarı ata
  const added = now.filter(id => !prev?.includes(id))
  added.forEach((id) => {
    const debt = unpaidDebts.value.find(d => (d.id || d._id) === id)
    if (!debt) return
    const max = maxAllocatableForDebt(debt)
    // sadece boşsa ata
    if (!paymentAmounts.value[id]) {
      paymentAmounts.value[id] = max
    } else {
      paymentAmounts.value[id] = Math.min(Number(paymentAmounts.value[id] || 0), max)
    }
  })
  // Kaldırılan borçların amount’unu temizle
  const removed = (prev || []).filter(id => !now.includes(id))
  removed.forEach(id => { delete paymentAmounts.value[id] })
})

/* lifecycle */
onMounted(() => {
  loadTenants()
})
</script>
