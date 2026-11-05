<template>
  <BaseModal :model-value="modelValue" title="Bordro yükle" size="xl" @update:model-value="$emit('update:modelValue', $event)">
    <div class="space-y-4" data-testid="payroll-upload-modal">
      <p class="text-sm text-slate-600">{{ label }} dönemi için muhasebeden gelen bordro dosyasını (.xlsx, en çok 2 MB) seçin. Kaydetmeden önce önizleme gösterilir.</p>
      <input type="file" accept=".xlsx" class="file-input file-input-bordered file-input-sm w-full max-w-md" @change="onFile" />

      <div v-if="busy" class="flex justify-center py-4"><span class="loading loading-spinner"></span></div>

      <template v-if="preview && !busy">
        <div v-if="preview.warnings?.length" class="alert alert-warning text-xs">
          <ul class="list-disc pl-4"><li v-for="(w, i) in preview.warnings" :key="i">{{ w }}</li></ul>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div class="rounded-xl border border-slate-200 px-3 py-2"><div class="text-xs text-slate-500">Net toplam</div><div class="font-bold">{{ formatMoney(preview.totals.netTotal) }}</div></div>
          <div class="rounded-xl border border-slate-200 px-3 py-2"><div class="text-xs text-slate-500">Gelir + damga vergisi</div><div class="font-bold">{{ formatMoney(preview.totals.incomeTax + preview.totals.stampTax) }}</div></div>
          <div class="rounded-xl border border-slate-200 px-3 py-2"><div class="text-xs text-slate-500">SGK primi</div><div class="font-bold">{{ formatMoney(preview.totals.sgkPremium) }}</div></div>
          <div class="rounded-xl border border-slate-200 px-3 py-2"><div class="text-xs text-slate-500">İşsizlik sigortası</div><div class="font-bold">{{ formatMoney(preview.totals.unemploymentInsurance) }}</div></div>
          <div class="rounded-xl border border-slate-200 px-3 py-2"><div class="text-xs text-slate-500">Firma maliyeti</div><div class="font-bold">{{ formatMoney(preview.totals.employerCost) }}</div></div>
        </div>

        <div class="overflow-x-auto">
          <table class="table table-sm">
            <thead><tr><th>Ad Soyad</th><th>TCKN</th><th class="text-right">Bordro net</th><th class="text-right">Hakediş</th><th class="text-right">Fark</th><th>Durum</th></tr></thead>
            <tbody>
              <tr v-for="r in preview.matched" :key="r.nationalId">
                <td>{{ r.fullName }}</td><td class="text-xs">{{ r.nationalId }}</td>
                <td class="text-right">{{ formatMoney(r.net) }}</td>
                <td class="text-right">{{ formatMoney(r.netEntitlement) }}</td>
                <td class="text-right" :class="hasDiff(r) ? 'text-error font-bold' : ''" :title="(r.differenceReasons || []).join('\n')">{{ formatMoney(r.difference) }}</td>
                <td><span class="badge badge-xs" :class="hasDiff(r) ? 'badge-error' : 'badge-success'">{{ hasDiff(r) ? 'Fark var' : 'Eşleşti' }}</span></td>
              </tr>
              <tr v-for="r in preview.notInSystem" :key="'n' + r.nationalId">
                <td>{{ r.fullName }}</td><td class="text-xs">{{ r.nationalId }}</td>
                <td class="text-right">{{ formatMoney(r.net) }}</td><td class="text-right">-</td><td class="text-right">-</td>
                <td><span class="badge badge-warning badge-xs">Sistemde yok</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="preview.missingFromPayroll?.length" class="alert alert-warning text-xs">
          Bordroda bulunmayan personel: {{ preview.missingFromPayroll.join(', ') }}
        </div>
      </template>
    </div>
    <template #footer>
      <button type="button" class="btn btn-ghost btn-sm" @click="$emit('update:modelValue', false)">Vazgeç</button>
      <button type="button" class="btn btn-primary btn-sm" :disabled="!preview || busy || saving" @click="save">
        <span v-if="saving" class="loading loading-spinner loading-xs"></span>Kaydet
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import payrollService from '@/infrastructure/services/payrollService'
import { useNotification } from '@/application/composables/useNotification'
import { formatMoney, errorText, parsePeriodKey, monthLabel } from './payrollHelpers'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  period: { type: String, required: true }
})
const emit = defineEmits(['update:modelValue', 'saved'])
const { showSuccess, showError } = useNotification()

const file = ref(null)
const preview = ref(null)
const busy = ref(false)
const saving = ref(false)

const label = computed(() => {
  const p = parsePeriodKey(props.period)
  return p ? monthLabel(p.year, p.month) : props.period
})
const hasDiff = (r) => r.difference !== null && r.difference !== undefined && Math.abs(r.difference) > 1

watch(() => props.modelValue, (open) => {
  if (open) { file.value = null; preview.value = null }
})

const onFile = async (ev) => {
  const f = ev.target.files?.[0]
  file.value = f || null
  preview.value = null
  if (!f) return
  busy.value = true
  try {
    preview.value = await payrollService.previewPayroll(props.period, f)
  } catch (e) {
    showError(errorText(e, 'Bordro dosyası okunamadı.'))
  } finally {
    busy.value = false
  }
}

const save = async () => {
  saving.value = true
  try {
    const period = await payrollService.savePayroll(props.period, file.value)
    showSuccess('Bordro kaydedildi.')
    emit('saved', period)
    emit('update:modelValue', false)
  } catch (e) {
    showError(errorText(e, 'Bordro kaydedilemedi.'))
  } finally {
    saving.value = false
  }
}
</script>
