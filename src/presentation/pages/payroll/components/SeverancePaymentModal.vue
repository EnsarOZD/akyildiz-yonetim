<template>
  <BaseModal :model-value="modelValue" title="Tazminat ödemesi" size="md" @update:model-value="$emit('update:modelValue', $event)">
    <form class="space-y-3" data-testid="severance-payment-modal" @submit.prevent="submit">
      <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Personel</span></label>
        <select v-model="form.employeeId" class="select select-bordered select-sm" required>
          <option value="" disabled>Seçin</option>
          <option v-for="e in employees" :key="e.employeeId" :value="e.employeeId">{{ e.fullName }} — bakiye {{ formatMoney(e.balance) }}</option>
        </select></div>
      <div class="grid grid-cols-2 gap-3">
        <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Tarih</span></label>
          <input v-model="form.paymentDate" type="date" class="input input-bordered input-sm" required /></div>
        <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Tutar</span></label>
          <input v-model.number="form.amount" type="number" step="0.01" min="0.01" class="input input-bordered input-sm" required /></div>
        <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Yöntem</span></label>
          <select v-model="form.method" class="select select-bordered select-sm">
            <option v-for="k in PAYMENT_METHODS" :key="k.value" :value="k.value">{{ k.label }}</option>
          </select></div>
        <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Not</span></label>
          <input v-model="form.note" type="text" maxlength="200" class="input input-bordered input-sm" /></div>
      </div>
      <p class="text-xs text-slate-500">Ödeme, o ayın "Tazminat" türünde gider olarak kaydedilir.</p>
      <div class="flex justify-end gap-2">
        <button type="button" class="btn btn-ghost btn-sm" @click="$emit('update:modelValue', false)">Vazgeç</button>
        <button type="submit" class="btn btn-primary btn-sm" :disabled="busy">
          <span v-if="busy" class="loading loading-spinner loading-xs"></span>Kaydet
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import payrollService from '@/infrastructure/services/payrollService'
import { useNotification } from '@/application/composables/useNotification'
import { todayLocalIso } from '@/core/utils/dateUtils'
import { formatMoney, errorText, PAYMENT_METHODS } from './payrollHelpers'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  employees: { type: Array, default: () => [] },
  employeeId: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'saved'])
const { showSuccess, showError, showWarning } = useNotification()

const busy = ref(false)
const form = reactive({ employeeId: '', paymentDate: todayLocalIso(), amount: null, method: 'Bank', note: '' })

watch(() => props.modelValue, (open) => {
  if (!open) return
  form.employeeId = props.employeeId || ''
  form.paymentDate = todayLocalIso()
  form.amount = null
  form.method = 'Bank'
  form.note = ''
}, { immediate: true })

const submit = async () => {
  busy.value = true
  try {
    const res = await payrollService.addSeverancePayment({
      employeeId: form.employeeId,
      paymentDate: form.paymentDate,
      amount: Number(form.amount),
      method: form.method,
      note: form.note || null
    })
    showSuccess('Tazminat ödemesi kaydedildi.')
    if (res?.warning) showWarning(res.warning)
    emit('saved')
    emit('update:modelValue', false)
  } catch (e) {
    showError(errorText(e, 'Ödeme kaydedilemedi.'))
  } finally {
    busy.value = false
  }
}
</script>
