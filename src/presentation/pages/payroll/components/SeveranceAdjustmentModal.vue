<template>
  <BaseModal :model-value="modelValue" title="Karşılık düzeltmesi" size="md" @update:model-value="$emit('update:modelValue', $event)">
    <form class="space-y-3" data-testid="severance-adjustment-modal" @submit.prevent="submit">
      <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Personel</span></label>
        <select v-model="form.employeeId" class="select select-bordered select-sm" required>
          <option value="" disabled>Seçin</option>
          <option v-for="e in employees" :key="e.employeeId" :value="e.employeeId">{{ e.fullName }}</option>
        </select></div>
      <div class="grid grid-cols-2 gap-3">
        <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Tarih</span></label>
          <input v-model="form.date" type="date" class="input input-bordered input-sm" required /></div>
        <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Tutar (azaltmak için eksi)</span></label>
          <input v-model.number="form.amount" type="number" step="0.01" class="input input-bordered input-sm" required /></div>
      </div>
      <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Açıklama (zorunlu)</span></label>
        <input v-model="form.note" type="text" maxlength="200" class="input input-bordered input-sm" required /></div>
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
import { errorText } from './payrollHelpers'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  employees: { type: Array, default: () => [] },
  employeeId: { type: String, default: '' },
  fund: { type: String, default: 'Severance' }
})
const emit = defineEmits(['update:modelValue', 'saved'])
const { showSuccess, showError } = useNotification()

const busy = ref(false)
const form = reactive({ employeeId: '', date: todayLocalIso(), amount: null, note: '' })

watch(() => props.modelValue, (open) => {
  if (!open) return
  form.employeeId = props.employeeId || ''
  form.date = todayLocalIso()
  form.amount = null
  form.note = ''
}, { immediate: true })

const submit = async () => {
  busy.value = true
  try {
    await payrollService.addSeveranceAdjustment({
      employeeId: form.employeeId, date: form.date, amount: Number(form.amount), note: form.note
    }, props.fund)
    showSuccess('Düzeltme kaydedildi.')
    emit('saved')
    emit('update:modelValue', false)
  } catch (e) {
    showError(errorText(e, 'Düzeltme kaydedilemedi.'))
  } finally {
    busy.value = false
  }
}
</script>
