<template>
  <div class="border border-slate-200 rounded-xl bg-white p-4 space-y-3" data-testid="invoice-report">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <h4 class="text-sm font-semibold text-slate-700">Fatura Raporu</h4>
        <span v-if="!finalized" class="badge badge-sm badge-ghost" data-testid="preview-badge">Önizleme</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <button v-if="finalized" type="button" class="btn btn-xs btn-outline" :disabled="pdfBusy" data-testid="pdf-btn" @click="downloadPdf">
          <span v-if="pdfBusy" class="loading loading-spinner loading-xs"></span>PDF
        </button>
        <button type="button" class="btn btn-xs btn-outline" :disabled="!rows.length" data-testid="excel-btn" @click="downloadExcel">Excel</button>
        <button v-if="finalized && canWrite" type="button" class="btn btn-xs btn-outline btn-error" data-testid="revert-btn" @click="emit('revert')">Onayı geri al</button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="table table-sm" data-testid="report-table">
        <thead>
          <tr>
            <th>Kat</th>
            <th>Cari</th>
            <th>Aralık</th>
            <th class="text-right">Gün</th>
            <th class="text-right">İlk Okuma</th>
            <th class="text-right">Son Okuma</th>
            <th class="text-right">Tüketim</th>
            <th class="text-right">Kendi Tutar</th>
            <th class="text-right">Havuz Payı</th>
            <th class="text-right">KDV Hariç</th>
            <th class="text-right">KDV Dahil</th>
            <th v-if="finalized" class="min-w-44">Fatura No</th>
            <th class="min-w-64">Açıklamalar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!rows.length">
            <td :colspan="finalized ? 13 : 12" class="text-center text-slate-400 py-6">Rapor satırı yok.</td>
          </tr>
          <tr v-for="r in rows" :key="r.readingId + '-' + r.flatId" :data-testid="'report-row-' + r.flatCode">
            <td class="font-medium">{{ r.flatCode }}</td>
            <td>{{ r.debtorName || '-' }}<div class="text-xs text-slate-400">{{ r.meterName }}</div></td>
            <td class="whitespace-nowrap text-xs">{{ formatDate(r.startDate) }} - {{ formatDate(r.endDate) }}</td>
            <td class="text-right">{{ r.days }}</td>
            <td class="text-right">{{ formatNumber(r.previousIndex) }}</td>
            <td class="text-right">{{ formatNumber(r.currentIndex) }}</td>
            <td class="text-right">{{ formatNumber(r.consumption) }}</td>
            <td class="text-right whitespace-nowrap">{{ formatMoney(r.ownAmount) }}</td>
            <td class="text-right whitespace-nowrap">{{ formatMoney(r.poolShare) }}</td>
            <td class="text-right whitespace-nowrap">{{ formatMoney(r.exclVat) }}</td>
            <td class="text-right whitespace-nowrap font-medium">{{ formatMoney(r.total) }}</td>
            <td v-if="finalized">
              <template v-if="r.debtId">
                <input
                  v-model="invoiceInputs[r.debtId]"
                  type="text"
                  maxlength="50"
                  class="input input-bordered input-xs w-full"
                  :disabled="!canEnterInvoices"
                  placeholder="Fatura no"
                  :data-testid="'invoice-' + r.flatCode"
                />
                <span v-if="!(invoiceInputs[r.debtId] || '').trim()" class="badge badge-warning badge-xs mt-1">faturası kesilmedi</span>
              </template>
              <span v-else class="text-slate-400">-</span>
            </td>
            <td class="text-xs space-y-1">
              <div class="flex items-start gap-1">
                <span class="flex-1 break-words">{{ r.readingText }}</span>
                <button type="button" class="btn btn-ghost btn-xs" title="Kopyala" data-testid="copy-reading" @click="copy(r.readingText)">Kopyala</button>
              </div>
              <div class="flex items-start gap-1">
                <span class="flex-1 break-words">{{ r.expenseText }}</span>
                <button type="button" class="btn btn-ghost btn-xs" title="Kopyala" data-testid="copy-expense" @click="copy(r.expenseText)">Kopyala</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="finalized && canEnterInvoices" class="flex justify-end">
      <button type="button" class="btn btn-sm btn-primary" :disabled="!changed.length || saving" data-testid="save-invoices" @click="saveInvoices">
        <span v-if="saving" class="loading loading-spinner loading-xs"></span>
        Fatura numaralarını kaydet
      </button>
    </div>
    <p v-if="error" class="text-sm text-red-600 whitespace-pre-line" data-testid="report-error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import electricityService from '@/infrastructure/services/electricityService'
import { useNotification } from '@/application/composables/useNotification'
import { formatDate, formatNumber, formatMoney, errorText, exportReportExcel } from '../electricityHelpers'

const props = defineProps({
  detail: { type: Object, required: true },
  canWrite: { type: Boolean, default: false },
  canEnterInvoices: { type: Boolean, default: false },
  saving: { type: Boolean, default: false },
  error: { type: String, default: '' }
})
const emit = defineEmits(['save-invoices', 'revert'])

const { showSuccess, showError } = useNotification()

const finalized = computed(() => props.detail.status === 'Finalized')
const rows = computed(() => props.detail.reportRows || [])

// debtId -> girilen fatura no (sunucudaki değerden başlar; sunucu verisi değişince yenilenir)
const invoiceInputs = ref({})
const original = computed(() => {
  const m = {}
  for (const r of rows.value) if (r.debtId) m[r.debtId] = r.invoiceNumber || ''
  return m
})
watch(original, (o) => { invoiceInputs.value = { ...o } }, { immediate: true })

const changed = computed(() =>
  Object.keys(original.value)
    .filter(id => (invoiceInputs.value[id] ?? '').trim() !== (original.value[id] || '').trim())
    .map(id => ({ debtId: id, invoiceNumber: (invoiceInputs.value[id] ?? '').trim() }))
)

const saveInvoices = () => {
  if (!changed.value.length) return
  emit('save-invoices', changed.value)
}

async function copy(text) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Pano kullanılamıyor.')
    await navigator.clipboard.writeText(text || '')
    showSuccess('Kopyalandı.')
  } catch {
    showError('Kopyalanamadı: pano kullanılamıyor.')
  }
}

const pdfBusy = ref(false)
async function downloadPdf() {
  pdfBusy.value = true
  try {
    await electricityService.downloadReport(props.detail.id)
  } catch (e) {
    showError(errorText(e, 'PDF indirilemedi.'))
  } finally {
    pdfBusy.value = false
  }
}

async function downloadExcel() {
  try {
    await exportReportExcel(props.detail)
  } catch (e) {
    showError(errorText(e, 'Excel oluşturulamadı.'))
  }
}
</script>
