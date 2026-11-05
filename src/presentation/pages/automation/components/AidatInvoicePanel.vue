<template>
  <div class="app-card space-y-4" data-testid="aidat-invoice-panel">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h3 class="text-sm font-black uppercase tracking-widest text-slate-700">Aidat faturaları</h3>
        <p class="text-xs text-slate-500 mt-1">Dönemin aidat borçları: fatura dökümü, açıklama metinleri ve fatura numarası girişi.</p>
      </div>
      <div class="flex flex-wrap items-end gap-2">
        <div class="form-control">
          <label class="label py-1"><span class="label-text text-xs">Dönem</span></label>
          <input type="month" v-model="period" class="input input-bordered input-sm" @change="load" />
        </div>
        <button type="button" class="btn btn-sm btn-outline" :disabled="pdfBusy || !report?.rows?.length" @click="downloadPdf">
          <span v-if="pdfBusy" class="loading loading-spinner loading-xs"></span>PDF
        </button>
        <button type="button" class="btn btn-sm btn-outline" :disabled="!report?.rows?.length" @click="downloadExcel">Excel</button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-6"><span class="loading loading-spinner"></span></div>

    <template v-else-if="report">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="rounded-xl border border-slate-200 px-3 py-2">
          <div class="text-xs text-slate-500">KDV hariç</div>
          <div class="font-bold">{{ formatMoney(report.totalExclVat) }}</div>
        </div>
        <div class="rounded-xl border border-slate-200 px-3 py-2">
          <div class="text-xs text-slate-500">KDV (%20)</div>
          <div class="font-bold">{{ formatMoney(report.totalVat) }}</div>
        </div>
        <div class="rounded-xl border border-slate-200 px-3 py-2">
          <div class="text-xs text-slate-500">KDV dahil</div>
          <div class="font-bold text-success">{{ formatMoney(report.total) }}</div>
        </div>
        <div class="rounded-xl border px-3 py-2" :class="missingCount ? 'border-amber-300 bg-amber-50' : 'border-slate-200'">
          <div class="text-xs text-slate-500">Faturası kesilmemiş</div>
          <div class="font-bold" :class="missingCount ? 'text-amber-700' : ''">{{ missingCount }} / {{ report.rows.length }}</div>
        </div>
      </div>

      <div v-if="!report.rows.length" class="text-center py-8 text-sm text-slate-500">
        Bu dönem için aidat borcu yok. Önce yukarıdaki "Aidat tahakkuku" bölümünden dönemi oluşturun.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="table table-sm">
          <thead>
            <tr>
              <th>Kat</th>
              <th>Cari</th>
              <th>Son ödeme</th>
              <th class="text-right">KDV Hariç</th>
              <th class="text-right">KDV</th>
              <th class="text-right">KDV Dahil</th>
              <th class="min-w-44">Fatura No</th>
              <th class="min-w-72">Açıklama</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in report.rows" :key="r.debtId">
              <td class="font-medium">{{ r.flatCode }}</td>
              <td>
                {{ r.debtorName }}
                <span v-if="r.isOwner" class="badge badge-info badge-xs ml-1">Malik</span>
                <span v-if="r.status === 'Paid'" class="badge badge-success badge-xs ml-1">Ödendi</span>
              </td>
              <td class="whitespace-nowrap text-xs">{{ formatDate(r.dueDate) }}</td>
              <td class="text-right whitespace-nowrap">{{ formatMoney(r.exclVat) }}</td>
              <td class="text-right whitespace-nowrap">{{ formatMoney(r.vatAmount) }}</td>
              <td class="text-right whitespace-nowrap font-medium">{{ formatMoney(r.total) }}</td>
              <td>
                <input
                  v-model="inputs[r.debtId]"
                  type="text"
                  maxlength="50"
                  class="input input-bordered input-xs w-full"
                  :disabled="!canEdit"
                  placeholder="Fatura no"
                  @keydown.enter.prevent="focusNext($event)"
                />
                <span v-if="!(inputs[r.debtId] || '').trim()" class="badge badge-warning badge-xs mt-1">faturası kesilmedi</span>
              </td>
              <td class="text-xs">
                <div class="flex items-start gap-1">
                  <span class="flex-1 break-words">{{ r.expenseText }}</span>
                  <button type="button" class="btn btn-ghost btn-xs" title="Kopyala" @click="copy(r.expenseText)">Kopyala</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="report.rows.length && canEdit" class="flex flex-wrap items-center justify-end gap-3">
        <span v-if="changed.length" class="text-xs text-slate-500">{{ changed.length }} satırda değişiklik var</span>
        <button type="button" class="btn btn-ghost btn-sm" :disabled="!changed.length || saving" @click="reset">Vazgeç</button>
        <button type="button" class="btn btn-primary btn-sm" :disabled="!changed.length || saving" @click="save">
          <span v-if="saving" class="loading loading-spinner loading-xs"></span>
          Fatura numaralarını kaydet
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import automationService from '@/infrastructure/services/automationService'
import { useNotification } from '@/application/composables/useNotification'
import { useAuthStore } from '@/application/stores/auth'
import { invalidateFinanceCaches } from '@/application/stores/cacheInvalidation'
import { todayLocalIso } from '@/core/utils/dateUtils'

const { showSuccess, showError } = useNotification()
const authStore = useAuthStore()
const canEdit = computed(() => ['admin', 'manager', 'dataentry'].includes((authStore.role || '').toLowerCase()))

const period = ref(todayLocalIso().slice(0, 7))
const report = ref(null)
const loading = ref(false)
const saving = ref(false)
const pdfBusy = ref(false)

// debtId -> girilen fatura no (sunucudaki değerden başlar)
const inputs = ref({})
const original = computed(() => {
  const m = {}
  for (const r of report.value?.rows || []) m[r.debtId] = r.invoiceNumber || ''
  return m
})

const changed = computed(() =>
  Object.keys(original.value)
    .filter(id => (inputs.value[id] ?? '').trim() !== (original.value[id] || '').trim())
    .map(id => ({ debtId: id, invoiceNumber: (inputs.value[id] ?? '').trim() }))
)
const missingCount = computed(() =>
  (report.value?.rows || []).filter(r => !(inputs.value[r.debtId] || '').trim()).length
)

const moneyFmt = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })
const formatMoney = (v) => moneyFmt.format(Number(v || 0))
const formatDate = (v) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v || ''))
  return m ? `${m[3]}.${m[2]}.${m[1]}` : '-'
}
const errorText = (e, fallback) => {
  const data = e?.response?.data
  return typeof data === 'string' && data.trim() ? data : (e?.message || fallback)
}

const applyReport = (r) => {
  report.value = r
  inputs.value = { ...original.value }
}

const load = async () => {
  if (!period.value) return
  loading.value = true
  try {
    applyReport(await automationService.getAidatInvoices(period.value))
  } catch (e) {
    report.value = null
    showError(errorText(e, 'Aidat faturaları yüklenemedi.'))
  } finally {
    loading.value = false
  }
}

const reset = () => { inputs.value = { ...original.value } }

const save = async () => {
  if (!changed.value.length) return
  saving.value = true
  try {
    const count = changed.value.length
    applyReport(await automationService.saveAidatInvoiceNumbers(period.value, changed.value))
    invalidateFinanceCaches()
    showSuccess(`${count} fatura numarası kaydedildi.`)
  } catch (e) {
    showError(errorText(e, 'Fatura numaraları kaydedilemedi.'))
  } finally {
    saving.value = false
  }
}

// Enter ile bir sonraki satırın fatura no alanına geç (art arda hızlı giriş)
const focusNext = (ev) => {
  const all = Array.from(ev.target.closest('tbody')?.querySelectorAll('input[type="text"]') || [])
  const next = all[all.indexOf(ev.target) + 1]
  if (next) next.focus()
}

async function copy(text) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error()
    await navigator.clipboard.writeText(text || '')
    showSuccess('Kopyalandı.')
  } catch {
    showError('Kopyalanamadı: pano kullanılamıyor.')
  }
}

async function downloadPdf() {
  pdfBusy.value = true
  try {
    await automationService.downloadAidatInvoicesPdf(period.value)
  } catch (e) {
    showError(errorText(e, 'PDF indirilemedi.'))
  } finally {
    pdfBusy.value = false
  }
}

async function downloadExcel() {
  try {
    const XLSX = await import('xlsx')
    const header = ['Kat', 'Cari', 'Malik', 'Son Ödeme', 'KDV Hariç', 'KDV', 'KDV Dahil', 'Fatura No', 'Açıklama']
    const aoa = [header]
    for (const r of report.value?.rows || []) {
      aoa.push([
        r.flatCode, r.debtorName, r.isOwner ? 'Evet' : '', formatDate(r.dueDate),
        Number(r.exclVat), Number(r.vatAmount), Number(r.total),
        (inputs.value[r.debtId] || '').trim(), r.expenseText
      ])
    }
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), 'Aidat Faturaları')
    XLSX.writeFile(wb, `Aidat_${period.value.replace('-', '_')}.xlsx`)
  } catch (e) {
    showError(errorText(e, 'Excel oluşturulamadı.'))
  }
}

defineExpose({ load })
onMounted(load)
</script>
