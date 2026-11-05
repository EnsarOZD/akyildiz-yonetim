<template>
  <BaseModal :model-value="modelValue" :title="`Ödemeler — ${line?.fullName || ''}`" size="lg" @update:model-value="$emit('update:modelValue', $event)">
    <div class="space-y-4" data-testid="payment-modal">
      <div class="grid grid-cols-3 gap-3 text-sm">
        <div class="rounded-xl border border-slate-200 px-3 py-2"><div class="text-xs text-slate-500">Hakediş</div><div class="font-bold">{{ formatMoney(line?.netEntitlement) }}</div></div>
        <div class="rounded-xl border border-slate-200 px-3 py-2"><div class="text-xs text-slate-500">Ödenen</div><div class="font-bold">{{ formatMoney(line?.paid) }}</div></div>
        <div class="rounded-xl border border-slate-200 px-3 py-2"><div class="text-xs text-slate-500">Kalan</div><div class="font-bold">{{ formatMoney(line?.remaining) }}</div></div>
      </div>

      <div v-if="loading" class="flex justify-center py-4"><span class="loading loading-spinner"></span></div>
      <div v-else-if="!payments.length" class="text-center text-sm text-slate-500 py-3">Bu dönemde ödeme kaydı yok.</div>
      <div v-else class="overflow-x-auto">
        <table class="table table-sm">
          <thead><tr><th>Tarih</th><th>Tür</th><th>Yöntem</th><th class="text-right">Tutar</th><th>Not</th><th></th></tr></thead>
          <tbody>
            <tr v-for="p in payments" :key="p.id">
              <td class="whitespace-nowrap">{{ formatDate(p.paymentDate) }}</td>
              <td>{{ kindLabel(p.kind) }}</td>
              <td>{{ methodLabel(p.method) }}</td>
              <td class="text-right whitespace-nowrap">{{ formatMoney(p.amount) }}</td>
              <td class="text-xs">{{ p.note }}</td>
              <td><button type="button" class="btn btn-ghost btn-xs text-error" :disabled="busy" @click="remove(p)">Sil</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <form class="grid grid-cols-2 md:grid-cols-6 gap-2 items-end border-t border-slate-200 pt-4" @submit.prevent="add">
        <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Tarih</span></label>
          <input v-model="form.paymentDate" type="date" class="input input-bordered input-sm" required /></div>
        <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Tutar</span></label>
          <input v-model.number="form.amount" type="number" step="0.01" min="0.01" class="input input-bordered input-sm" required /></div>
        <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Tür</span></label>
          <select v-model="form.kind" class="select select-bordered select-sm">
            <option v-for="k in PAYMENT_KINDS" :key="k.value" :value="k.value">{{ k.label }}</option>
          </select></div>
        <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Yöntem</span></label>
          <select v-model="form.method" class="select select-bordered select-sm">
            <option v-for="k in PAYMENT_METHODS" :key="k.value" :value="k.value">{{ k.label }}</option>
          </select></div>
        <div class="form-control col-span-2 md:col-span-1"><label class="label py-1"><span class="label-text text-xs">Not</span></label>
          <input v-model="form.note" type="text" maxlength="200" class="input input-bordered input-sm" /></div>
        <button type="submit" class="btn btn-primary btn-sm" :disabled="busy">
          <span v-if="busy" class="loading loading-spinner loading-xs"></span>+ Ödeme ekle
        </button>
      </form>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import payrollService from '@/infrastructure/services/payrollService'
import { useNotification } from '@/application/composables/useNotification'
import { todayLocalIso } from '@/core/utils/dateUtils'
import { formatMoney, formatDate, errorText, kindLabel, methodLabel, PAYMENT_KINDS, PAYMENT_METHODS } from './payrollHelpers'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  period: { type: String, required: true },
  line: { type: Object, default: null }
})
const emit = defineEmits(['update:modelValue', 'changed'])
const { showSuccess, showError } = useNotification()

const payments = ref([])
const loading = ref(false)
const busy = ref(false)
const form = reactive({ paymentDate: todayLocalIso(), amount: null, kind: 'Salary', method: 'Bank', note: '' })

const load = async () => {
  if (!props.line) return
  loading.value = true
  try {
    const all = await payrollService.getPayments(props.period)
    payments.value = (all || []).filter(p => p.employeeId === props.line.employeeId)
  } catch (e) {
    showError(errorText(e, 'Ödemeler yüklenemedi.'))
  } finally {
    loading.value = false
  }
}

watch(() => props.modelValue, (open) => {
  if (!open) return
  form.paymentDate = todayLocalIso()
  form.amount = props.line?.remaining > 0 ? props.line.remaining : null
  form.note = ''
  load()
}, { immediate: true })

const add = async () => {
  busy.value = true
  try {
    await payrollService.addPayment(props.period, {
      employeeId: props.line.employeeId,
      paymentDate: form.paymentDate,
      amount: Number(form.amount),
      kind: form.kind,
      method: form.method,
      note: form.note || null
    })
    showSuccess('Ödeme eklendi.')
    form.amount = null
    form.note = ''
    await load()
    emit('changed')
  } catch (e) {
    showError(errorText(e, 'Ödeme eklenemedi.'))
  } finally {
    busy.value = false
  }
}

const remove = async (p) => {
  busy.value = true
  try {
    await payrollService.deletePayment(props.period, p.id)
    showSuccess('Ödeme silindi.')
    await load()
    emit('changed')
  } catch (e) {
    showError(errorText(e, 'Ödeme silinemedi.'))
  } finally {
    busy.value = false
  }
}
</script>
