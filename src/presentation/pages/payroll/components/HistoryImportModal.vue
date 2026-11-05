<template>
  <BaseModal :model-value="modelValue" title="Geçmiş bordroları yükle" size="xl" @update:model-value="onToggle">
    <div class="space-y-4" data-testid="history-import-modal">
      <p class="text-sm text-slate-600">Geçmiş aylara ait bordro dosyalarını (.xlsx, en çok 30 dosya, her biri en çok 2 MB) toplu olarak seçin. Dönemler dosyadan okunur, onaylı olarak içe aktarılır.</p>
      <input ref="inputEl" type="file" accept=".xlsx" multiple class="file-input file-input-bordered file-input-sm w-full max-w-md" :disabled="busy" @change="onFiles" />
      <div v-if="files.length" class="text-xs text-slate-500">{{ files.length }} dosya seçildi.</div>
      <div v-if="problems.length" class="alert alert-warning text-xs">
        <ul class="list-disc pl-4"><li v-for="(p, i) in problems" :key="i">{{ p }}</li></ul>
      </div>

      <div v-if="busy" class="space-y-2">
        <progress class="progress progress-primary w-full"></progress>
        <p class="text-xs text-slate-500 text-center">{{ files.length }} dosya işleniyor, lütfen bekleyin...</p>
      </div>

      <div v-if="results && !busy" class="overflow-x-auto">
        <table class="table table-sm">
          <thead><tr><th>Dosya</th><th>Ay</th><th class="text-right">Kişi</th><th class="text-right">Net</th><th class="text-right">Vergi</th><th class="text-right">SGK</th><th class="text-right">Karşılık</th><th>Durum</th></tr></thead>
          <tbody>
            <tr v-for="(r, i) in results" :key="i">
              <td class="text-xs break-all">{{ r.fileName }}</td>
              <td class="whitespace-nowrap">{{ r.year && r.month ? monthLabel(r.year, r.month) : '-' }}</td>
              <td class="text-right">{{ r.employeeCount }}</td>
              <td class="text-right whitespace-nowrap">{{ formatMoney(r.net) }}</td>
              <td class="text-right whitespace-nowrap">{{ formatMoney(r.tax) }}</td>
              <td class="text-right whitespace-nowrap">{{ formatMoney(r.sgk) }}</td>
              <td class="text-right whitespace-nowrap">{{ formatMoney(r.severance) }}</td>
              <td>
                <span class="badge badge-sm whitespace-normal h-auto py-0.5" :class="statusCls(r.status)">{{ r.status }}</span>
                <div v-if="r.message" class="text-xs text-slate-500 mt-1">{{ r.message }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <template #footer>
      <button type="button" class="btn btn-ghost btn-sm" :disabled="busy" @click="$emit('update:modelValue', false)">Kapat</button>
      <button type="button" class="btn btn-primary btn-sm" :disabled="!canUpload" @click="upload">
        <span v-if="busy" class="loading loading-spinner loading-xs"></span>Yükle
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import payrollService from '@/infrastructure/services/payrollService'
import { useNotification } from '@/application/composables/useNotification'
import { formatMoney, errorText, monthLabel } from './payrollHelpers'

const MAX_FILES = 30
const MAX_BYTES = 2 * 1024 * 1024

const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue', 'imported'])
const { showSuccess, showError } = useNotification()

const inputEl = ref(null)
const files = ref([])
const problems = ref([])
const results = ref(null)
const busy = ref(false)

const canUpload = computed(() => files.value.length > 0 && !problems.value.length && !busy.value)

watch(() => props.modelValue, (open) => {
  if (!open) return
  files.value = []
  problems.value = []
  results.value = null
  if (inputEl.value) inputEl.value.value = ''
})

const onToggle = (v) => { if (!busy.value) emit('update:modelValue', v) }

const onFiles = (ev) => {
  const list = Array.from(ev.target.files || [])
  const errs = []
  if (list.length > MAX_FILES) errs.push(`En fazla ${MAX_FILES} dosya yüklenebilir (${list.length} seçildi).`)
  for (const f of list) {
    if (!f.name.toLowerCase().endsWith('.xlsx')) errs.push(`${f.name}: yalnızca .xlsx dosyaları kabul edilir.`)
    else if (f.size > MAX_BYTES) errs.push(`${f.name}: dosya 2 MB sınırını aşıyor.`)
  }
  files.value = list
  problems.value = errs
  results.value = null
}

const statusCls = (s) => {
  if (s === 'Tamam') return 'badge-success'
  if (s === 'Dönem zaten var') return 'badge-info'
  if (s === 'Hata') return 'badge-error'
  return 'badge-warning' // "Elle girilmiş gider var — onaylanmadı" ve diğerleri
}

const upload = async () => {
  busy.value = true
  results.value = null
  try {
    const res = await payrollService.importHistory(files.value)
    results.value = Array.isArray(res) ? res : (res?.items || [])
    const ok = results.value.filter(r => r.status === 'Tamam').length
    if (ok) showSuccess(`${ok} dönem içe aktarıldı.`)
    emit('imported')
  } catch (e) {
    showError(errorText(e, 'Bordrolar yüklenemedi.'))
  } finally {
    busy.value = false
  }
}
</script>
