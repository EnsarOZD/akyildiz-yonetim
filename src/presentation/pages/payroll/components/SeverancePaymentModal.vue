<template>
  <BaseModal :model-value="modelValue" :title="isLeave ? 'Yıllık izin ödemesi' : 'Tazminat ödemesi'" size="md" @update:model-value="$emit('update:modelValue', $event)">
    <form class="space-y-3" data-testid="severance-payment-modal" @submit.prevent="submit">
      <div class="form-control"><label class="label py-1"><span class="label-text text-xs">{{ isLeave ? 'İzin kullanan personel' : 'Personel' }}</span></label>
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
      <template v-if="isLeave">
        <div class="form-control">
          <label class="label py-1"><span class="label-text text-xs">Ödenen kişi</span></label>
          <div class="flex gap-4">
            <label class="label cursor-pointer justify-start gap-2 py-1"><input v-model="form.payeeKind" type="radio" value="employee" class="radio radio-sm" /><span class="label-text text-sm">Personel</span></label>
            <label class="label cursor-pointer justify-start gap-2 py-1"><input v-model="form.payeeKind" type="radio" value="other" class="radio radio-sm" /><span class="label-text text-sm">Diğer kişi</span></label>
          </div>
          <select v-if="form.payeeKind === 'employee'" v-model="form.payeeEmployeeId" class="select select-bordered select-sm" required data-testid="leave-payee-employee">
            <option value="" disabled>Seçin</option>
            <option v-for="e in activeEmployees" :key="e.employeeId" :value="e.employeeId">{{ e.fullName }}</option>
          </select>
          <input v-else v-model="form.payeeName" type="text" maxlength="150" class="input input-bordered input-sm" placeholder="Ad Soyad" required data-testid="leave-payee-name" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="form-control"><label class="label py-1"><span class="label-text text-xs">İzin başlangıcı</span></label>
            <input v-model="form.leaveStart" type="date" class="input input-bordered input-sm" /></div>
          <div class="form-control"><label class="label py-1"><span class="label-text text-xs">İzin bitişi</span></label>
            <input v-model="form.leaveEnd" type="date" :min="form.leaveStart || undefined" class="input input-bordered input-sm" /></div>
        </div>
        <p class="text-xs text-slate-500">Ödeme, o ayın "Yıllık izin" türünde gider olarak kaydedilir.</p>
      </template>
      <p v-else class="text-xs text-slate-500">Ödeme, o ayın "Tazminat" türünde gider olarak kaydedilir.</p>
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
import { ref, reactive, computed, watch } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import payrollService from '@/infrastructure/services/payrollService'
import { useNotification } from '@/application/composables/useNotification'
import { todayLocalIso } from '@/core/utils/dateUtils'
import { formatMoney, errorText, PAYMENT_METHODS } from './payrollHelpers'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  employees: { type: Array, default: () => [] },
  employeeId: { type: String, default: '' },
  fund: { type: String, default: 'Severance' }
})
const emit = defineEmits(['update:modelValue', 'saved'])
const { showSuccess, showError, showWarning } = useNotification()

const busy = ref(false)
const isLeave = computed(() => props.fund === 'AnnualLeave')
const activeEmployees = computed(() => props.employees.filter(e => e.isActive))
const form = reactive({
  employeeId: '', paymentDate: todayLocalIso(), amount: null, method: 'Bank', note: '',
  payeeKind: 'employee', payeeEmployeeId: '', payeeName: '', leaveStart: '', leaveEnd: ''
})

// Ödenen kişi varsayılanı: izin kullanan personel (aktifse)
watch(() => form.employeeId, (id) => {
  if (form.payeeKind === 'employee' && isLeave.value) {
    form.payeeEmployeeId = activeEmployees.value.some(e => e.employeeId === id) ? id : ''
  }
})

watch(() => props.modelValue, (open) => {
  if (!open) return
  form.employeeId = props.employeeId || ''
  form.paymentDate = todayLocalIso()
  form.amount = null
  form.method = 'Bank'
  form.note = ''
  form.payeeKind = 'employee'
  form.payeeEmployeeId = activeEmployees.value.some(e => e.employeeId === form.employeeId) ? form.employeeId : ''
  form.payeeName = ''
  form.leaveStart = ''
  form.leaveEnd = ''
}, { immediate: true })

const submit = async () => {
  const payload = {
    employeeId: form.employeeId,
    paymentDate: form.paymentDate,
    amount: Number(form.amount),
    method: form.method,
    note: form.note || null
  }
  if (isLeave.value) {
    if (form.leaveStart && form.leaveEnd && form.leaveEnd < form.leaveStart) {
      showError('İzin bitişi, başlangıçtan önce olamaz.')
      return
    }
    if (form.payeeKind === 'employee') {
      if (!form.payeeEmployeeId) { showError('Ödenen personeli seçin.'); return }
      payload.payeeEmployeeId = form.payeeEmployeeId
    } else {
      const name = form.payeeName.trim()
      if (!name) { showError('Ödenen kişinin adını girin.'); return }
      payload.payeeName = name
    }
    payload.leaveStart = form.leaveStart || null
    payload.leaveEnd = form.leaveEnd || null
  }
  busy.value = true
  try {
    const res = await payrollService.addSeverancePayment(payload, props.fund)
    showSuccess(isLeave.value ? 'Yıllık izin ödemesi kaydedildi.' : 'Tazminat ödemesi kaydedildi.')
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
