<template>
  <dialog open class="modal">
    <div class="modal-box max-w-md bg-white dark:bg-[#0f1322] border border-gray-200 dark:border-white/[0.07]">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-white/[0.07]">
        <div class="flex items-center gap-3">
          <div class="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-[#f1f3f9]">Aidat Kaydı Düzenle</h3>
        </div>
        <button @click="$emit('close')" class="btn btn-ghost btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-6">
        <!-- Bilgi Alanları -->
        <div class="bg-gray-50 dark:bg-base-200 rounded-lg p-4 space-y-4">
          <h4 class="text-lg font-semibold text-gray-800 dark:text-[#f1f3f9] mb-3">Kayıt Bilgileri</h4>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Kat/Daire</span>
            </label>
            <input
              type="text"
              class="input input-bordered w-full bg-gray-100 dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-500 dark:text-[#9aa0b4]"
              :value="record.unit || record.flatNumber || '-'"
              disabled
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Şirket/Kişi</span>
            </label>
            <input
              type="text"
              class="input input-bordered w-full bg-gray-100 dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-500 dark:text-[#9aa0b4]"
              :value="record.tenantCompany || record.tenantName || record.ownerName || '-'"
              disabled
            />
          </div>

          <!-- Dönem ve Tarih -->
          <div class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-white/[0.07]">
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Yıl</span></label>
              <input type="number" v-model.number="local.periodYear" class="input input-bordered w-full" min="2020" />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Ay</span></label>
              <select v-model.number="local.periodMonth" class="select select-bordered w-full">
                <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>
          </div>

          <div class="form-control mt-2">
            <label class="label"><span class="label-text font-semibold">Son Ödeme Tarihi</span></label>
            <input type="date" v-model="local.dueDate" class="input input-bordered w-full" />
          </div>
        </div>

        <!-- Düzenlenebilir Alanlar -->
        <div class="bg-brand-50 dark:bg-brand-500/[0.08] rounded-lg p-4 space-y-4">
          <h4 class="text-lg font-semibold text-gray-800 dark:text-[#f1f3f9] mb-3">Tutar ve Açıklama</h4>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Toplam Tutar *</span>
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="displayAmount"
                @input="handleAmountInput"
                @blur="handleAmountBlur"
                class="input input-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-700 dark:text-[#f1f3f9] pr-10"
                :class="{ 'border-red-500': amountError }"
                placeholder="0,00"
                required
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₺</span>
            </div>
            <p v-if="amountError" class="text-error text-xs mt-1">{{ amountError }}</p>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Fatura Numarası</span>
            </label>
            <input
              v-model="local.invoiceNumber"
              type="text"
              class="input input-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-700 dark:text-[#f1f3f9]"
              placeholder="Opsiyonel fatura no..."
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Açıklama</span>
            </label>
            <textarea
              v-model="local.description"
              class="textarea textarea-bordered h-20 w-full"
              placeholder="Aidat açıklaması..."
            ></textarea>
          </div>
        </div>

        <!-- Uyarı -->
        <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <div class="flex items-start gap-3">
            <div class="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 rounded-full p-1 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div class="text-sm text-gray-700 dark:text-[#f1f3f9]">
              <p class="font-medium mb-1">Dikkat</p>
              <p>Bu değişiklik aidat kaydını kalıcı olarak günceller.</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/[0.07]">
          <button class="btn btn-outline btn-sm" @click="$emit('close')">
            İptal
          </button>
          <button class="btn btn-primary btn-sm" @click="save" :disabled="local.kdvHaric < 0 || local.toplamTutar < 0">
            Kaydet
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import utilityDebtsService from '@/infrastructure/services/utilityDebtsService'
import { useErrorHandler } from '@/application/composables/useErrorHandler'
import { formatCurrency, parseCurrency, formatInputCurrency } from '@/core/utils/currencyUtils'

const props = defineProps({ record: { type: Object, required: true } })
const emit = defineEmits(['close', 'updated'])

const { handleValidationError, showSuccess } = useErrorHandler?.() ?? {}

const local = ref({ kdvHaric: 0, toplamTutar: 0, periodYear: 2025, periodMonth: 1, dueDate: '', description: '', invoiceNumber: '' })
const displayAmount = ref('')
const amountError = ref('')

const handleAmountInput = (e) => {
  displayAmount.value = e.target.value
  local.value.toplamTutar = parseCurrency(e.target.value)
}

const handleAmountBlur = () => {
  if (local.value.toplamTutar > 0) {
    displayAmount.value = local.value.toplamTutar.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }
  validateAmount()
}

const validateAmount = () => {
  if (local.value.toplamTutar <= 0) {
    amountError.value = 'Lütfen geçerli bir tutar girin'
  } else {
    amountError.value = ''
  }
}

watch(() => local.value.toplamTutar, (newVal) => {
  if (parseCurrency(displayAmount.value) !== newVal) {
    displayAmount.value = formatCurrency(newVal, false)
  }
}, { immediate: true })

onMounted(() => {
  if (props.record) {
    local.value.kdvHaric = Number(props.record.kdvHaric ?? props.record.amountExVat ?? 0)
    local.value.toplamTutar = Number(props.record.toplamTutar ?? props.record.amount ?? 0)
    local.value.periodYear = props.record.periodYear || new Date().getFullYear()
    local.value.periodMonth = props.record.periodMonth || (new Date().getMonth() + 1)
    local.value.dueDate = props.record.dueDate ? new Date(props.record.dueDate).toISOString().split('T')[0] : ''
    local.value.description = props.record.description || ''
    local.value.invoiceNumber = props.record.invoiceNumber || ''
  }
})

const save = async () => {
  try {
    const paid = Number(props.record.paidAmount || 0)
    const remaining = Number(local.value.toplamTutar) - paid

    await utilityDebtsService.updateUtilityDebt(props.record.id, {
      id: props.record.id,
      flatId: props.record.flatId,
      type: props.record.type ?? 0,
      amount: local.value.toplamTutar,
      remainingAmount: remaining,
      status: props.record.status,
      paidAmount: props.record.paidAmount ?? null,
      paidDate: props.record.paidDate ?? null,
      periodYear: local.value.periodYear,
      periodMonth: local.value.periodMonth,
      dueDate: local.value.dueDate,
      description: local.value.description,
      invoiceNumber: local.value.invoiceNumber || null,
      tenantId: props.record.tenantId,
      ownerId: props.record.ownerId
    })
    showSuccess?.('Aidat kaydı güncellendi.')
    emit('updated')
    emit('close')
  } catch (error) {
    handleValidationError?.(error)
  }
}
</script>
