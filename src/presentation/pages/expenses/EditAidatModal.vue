<template>
  <BaseModal
    :model-value="true"
    title="Aidat Kaydı Düzenle"
    icon="✏️"
    size="md"
    @close="$emit('close')"
  >
    <div class="space-y-6">
      <!-- Bilgi Alanları -->
      <div class="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        <h4 class="text-[11px] font-black uppercase tracking-widest text-[#626885] mb-2">Kayıt Bilgileri</h4>

        <div class="grid grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Kat/Daire</span>
            </label>
            <div class="px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-[#9aa0b4] font-medium">
              {{ record.unit || record.flatNumber || '-' }}
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Şirket/Kişi</span>
            </label>
            <div class="px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-[#9aa0b4] font-medium truncate">
               {{ record.tenantCompany || record.tenantName || record.ownerName || '-' }}
            </div>
          </div>
        </div>

        <!-- Dönem ve Tarih -->
        <div class="grid grid-cols-2 gap-4 mt-2">
          <div class="form-control">
            <label class="label"><span class="label-text">Yıl</span></label>
            <input type="number" v-model.number="local.periodYear" class="input input-bordered w-full" min="2020" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Ay</span></label>
            <select v-model.number="local.periodMonth" class="select select-bordered w-full">
              <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Düzenlenebilir Alanlar -->
      <div class="bg-brand-500/[0.05] border border-brand-500/20 rounded-2xl p-5 space-y-5">
        <h4 class="text-[11px] font-black uppercase tracking-widest text-brand-400 mb-2">Tutar ve Detaylar</h4>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Toplam Tutar *</span>
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="displayAmount"
                @input="handleAmountInput"
                @blur="handleAmountBlur"
                class="input input-bordered w-full font-bold !text-lg pr-10"
                :class="{ '!border-red-500/50': amountError }"
                placeholder="0,00"
                required
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[#626885] font-black uppercase tracking-widest text-[10px]">TL</span>
            </div>
            <p v-if="amountError" class="text-red-400 text-[10px] font-bold uppercase tracking-wide mt-1.5 ml-1">{{ amountError }}</p>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Son Ödeme Tarihi</span>
            </label>
            <input type="date" v-model="local.dueDate" class="input input-bordered w-full" />
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Fatura Numarası</span>
          </label>
          <input
            v-model="local.invoiceNumber"
            type="text"
            class="input input-bordered w-full"
            placeholder="E-Arşiv / Kağıt Fatura No..."
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Açıklama</span>
          </label>
          <textarea
            v-model="local.description"
            class="textarea textarea-bordered h-24 w-full"
            placeholder="Kayıt ile ilgili ek notlar..."
          ></textarea>
        </div>
      </div>

      <!-- Uyarı -->
      <div class="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div class="text-xs text-amber-500/90 font-medium leading-relaxed">
          <p class="font-bold uppercase tracking-widest text-[9px] mb-1">Önemli Hatırlatma</p>
          <p>Yaptığınız değişiklikler doğrudan veritabanına yansıtılır ve finansal raporları etkiler.</p>
        </div>
      </div>
    </div>

    <template #footer>
      <button class="btn btn-outline border-white/[0.08] text-[#9aa0b4] hover:bg-white/[0.04]" @click="$emit('close')">
        Vazgeç
      </button>
      <button class="btn btn-primary" @click="save" :disabled="local.toplamTutar <= 0">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
        </svg>
        Değişiklikleri Kaydet
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
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
