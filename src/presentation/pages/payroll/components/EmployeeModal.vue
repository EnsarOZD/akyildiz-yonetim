<template>
  <BaseModal :model-value="modelValue" :title="isNew ? 'Yeni personel' : `Personel — ${employee.fullName}`" size="lg" @update:model-value="$emit('update:modelValue', $event)">
    <div class="space-y-5" data-testid="employee-modal">
      <form class="grid grid-cols-1 md:grid-cols-2 gap-3" @submit.prevent="save">
        <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Ad Soyad</span></label>
          <input v-model="form.fullName" type="text" maxlength="150" class="input input-bordered input-sm" required /></div>
        <div class="form-control"><label class="label py-1"><span class="label-text text-xs">TCKN</span></label>
          <input v-model="form.nationalId" type="text" maxlength="11" inputmode="numeric" class="input input-bordered input-sm" required /></div>
        <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Görev</span></label>
          <input v-model="form.position" type="text" maxlength="100" class="input input-bordered input-sm" /></div>
        <div class="form-control"><label class="label py-1"><span class="label-text text-xs">İşe başlama</span></label>
          <input v-model="form.startDate" type="date" class="input input-bordered input-sm" required /></div>
        <div class="form-control"><label class="label py-1"><span class="label-text text-xs">İşten ayrılma</span></label>
          <input v-model="form.endDate" type="date" class="input input-bordered input-sm" /></div>
        <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Yıllık izin günü</span></label>
          <input v-model.number="form.annualLeaveDays" type="number" min="0" max="365" step="1" class="input input-bordered input-sm" required /></div>
        <div class="form-control justify-end"><label class="label cursor-pointer justify-start gap-2 py-1">
          <input v-model="form.isActive" type="checkbox" class="checkbox checkbox-sm" /><span class="label-text text-sm">Aktif</span></label></div>
        <div class="form-control md:col-span-2"><label class="label py-1"><span class="label-text text-xs">Not</span></label>
          <textarea v-model="form.notes" rows="2" maxlength="500" class="textarea textarea-bordered textarea-sm"></textarea></div>
        <div class="md:col-span-2 flex justify-end">
          <button type="submit" class="btn btn-primary btn-sm" :disabled="busy">
            <span v-if="busy" class="loading loading-spinner loading-xs"></span>{{ isNew ? 'Oluştur' : 'Kaydet' }}
          </button>
        </div>
      </form>

      <div v-if="!isNew" class="border-t border-slate-200 pt-4 space-y-3">
        <h3 class="font-bold text-sm">Yıllık ücretler</h3>
        <div v-if="!employee.wages?.length" class="text-sm text-slate-500">Henüz ücret tanımı yok.</div>
        <div v-else class="overflow-x-auto">
          <table class="table table-sm">
            <thead><tr><th>Yıl</th><th class="text-right">Aylık maaş</th><th class="text-right">Yol yardımı</th><th class="text-right">Günlük yemek</th><th></th></tr></thead>
            <tbody>
              <tr v-for="w in sortedWages" :key="w.id">
                <td>{{ w.year }}</td>
                <td class="text-right">{{ formatMoney(w.monthlySalary) }}</td>
                <td class="text-right">{{ formatMoney(w.transportAllowance) }}</td>
                <td class="text-right">{{ formatMoney(w.dailyMealAllowance) }}</td>
                <td class="text-right whitespace-nowrap">
                  <button type="button" class="btn btn-ghost btn-xs" :disabled="busy" @click="editWage(w)">Düzenle</button>
                  <button type="button" class="btn btn-ghost btn-xs text-error" :disabled="busy" @click="removeWage(w)">Sil</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <form class="grid grid-cols-2 md:grid-cols-5 gap-2 items-end" @submit.prevent="saveWage">
          <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Yıl</span></label>
            <input v-model.number="wage.year" type="number" min="2000" max="2100" class="input input-bordered input-sm" required :disabled="!!wageId" /></div>
          <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Aylık maaş</span></label>
            <input v-model.number="wage.monthlySalary" type="number" step="0.01" min="0" class="input input-bordered input-sm" required /></div>
          <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Yol yardımı</span></label>
            <input v-model.number="wage.transportAllowance" type="number" step="0.01" min="0" class="input input-bordered input-sm" required /></div>
          <div class="form-control"><label class="label py-1"><span class="label-text text-xs">Günlük yemek</span></label>
            <input v-model.number="wage.dailyMealAllowance" type="number" step="0.01" min="0" class="input input-bordered input-sm" required /></div>
          <div class="flex gap-1">
            <button type="submit" class="btn btn-primary btn-sm" :disabled="busy">{{ wageId ? 'Güncelle' : '+ Ücret ekle' }}</button>
            <button v-if="wageId" type="button" class="btn btn-ghost btn-sm" @click="resetWage">Vazgeç</button>
          </div>
        </form>
      </div>
      <p v-else class="text-xs text-slate-500">Yıllık ücretler, personel oluşturulduktan sonra eklenir.</p>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import payrollService from '@/infrastructure/services/payrollService'
import { useNotification } from '@/application/composables/useNotification'
import { formatMoney, errorText } from './payrollHelpers'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  employee: { type: Object, default: null } // null = yeni
})
const emit = defineEmits(['update:modelValue', 'changed', 'created'])
const { showSuccess, showError } = useNotification()

const isNew = computed(() => !props.employee)
const busy = ref(false)
const day = (v) => (v ? String(v).slice(0, 10) : '')
const form = reactive({ fullName: '', nationalId: '', position: '', startDate: '', endDate: '', isActive: true, notes: '', annualLeaveDays: 14 })
const wageId = ref(null)
const wage = reactive({ year: new Date().getFullYear(), monthlySalary: null, transportAllowance: 0, dailyMealAllowance: 0 })
const sortedWages = computed(() => [...(props.employee?.wages || [])].sort((a, b) => b.year - a.year))

const resetWage = () => {
  wageId.value = null
  wage.year = new Date().getFullYear()
  wage.monthlySalary = null
  wage.transportAllowance = 0
  wage.dailyMealAllowance = 0
}

watch(() => [props.modelValue, props.employee?.id], ([open]) => {
  if (!open) return
  const e = props.employee
  form.fullName = e?.fullName || ''
  form.nationalId = e?.nationalId || ''
  form.position = e?.position || ''
  form.startDate = day(e?.startDate)
  form.endDate = day(e?.endDate)
  form.isActive = e ? !!e.isActive : true
  form.notes = e?.notes || ''
  form.annualLeaveDays = e?.annualLeaveDays ?? 14
  resetWage()
}, { immediate: true })

const save = async () => {
  busy.value = true
  const payload = {
    fullName: form.fullName.trim(), nationalId: form.nationalId.trim(), position: form.position || null,
    startDate: form.startDate, endDate: form.endDate || null, isActive: form.isActive, notes: form.notes || null,
    annualLeaveDays: Number(form.annualLeaveDays ?? 14)
  }
  try {
    if (isNew.value) {
      const created = await payrollService.createEmployee(payload)
      showSuccess('Personel oluşturuldu.')
      emit('created', created)
    } else {
      await payrollService.updateEmployee(props.employee.id, payload)
      showSuccess('Personel güncellendi.')
      emit('changed')
    }
  } catch (e) {
    showError(errorText(e, 'Personel kaydedilemedi.'))
  } finally {
    busy.value = false
  }
}

const editWage = (w) => {
  wageId.value = w.id
  wage.year = w.year
  wage.monthlySalary = w.monthlySalary
  wage.transportAllowance = w.transportAllowance
  wage.dailyMealAllowance = w.dailyMealAllowance || 0
}

const saveWage = async () => {
  busy.value = true
  const payload = { year: Number(wage.year), monthlySalary: Number(wage.monthlySalary), transportAllowance: Number(wage.transportAllowance || 0), dailyMealAllowance: Number(wage.dailyMealAllowance || 0) }
  try {
    if (wageId.value) await payrollService.updateWage(props.employee.id, wageId.value, payload)
    else await payrollService.addWage(props.employee.id, payload)
    showSuccess('Ücret kaydedildi.')
    resetWage()
    emit('changed')
  } catch (e) {
    showError(errorText(e, 'Ücret kaydedilemedi.'))
  } finally {
    busy.value = false
  }
}

const removeWage = async (w) => {
  busy.value = true
  try {
    await payrollService.deleteWage(props.employee.id, w.id)
    showSuccess('Ücret silindi.')
    if (wageId.value === w.id) resetWage()
    emit('changed')
  } catch (e) {
    showError(errorText(e, 'Ücret silinemedi.'))
  } finally {
    busy.value = false
  }
}
</script>
