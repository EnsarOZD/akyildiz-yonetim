<template>
  <div class="space-y-4" data-testid="payroll-period-tab">
    <div class="app-card space-y-4">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex flex-wrap items-end gap-3">
          <div class="form-control">
            <label class="label py-1"><span class="label-text text-xs">Dönem</span></label>
            <input type="month" :value="period" class="input input-bordered input-sm" @change="onPeriodChange" />
          </div>
          <span v-if="data" class="badge" :class="statusMeta.cls">{{ statusMeta.label }}</span>
          <span v-if="data && data.payrollFileName" class="text-xs text-slate-500">Bordro: {{ data.payrollFileName }}</span>
        </div>

        <div v-if="data" class="flex flex-wrap items-center gap-2">
          <button type="button" class="btn btn-sm btn-primary" :disabled="!isDirty || saving || locked" @click="saveLines">
            <span v-if="saving" class="loading loading-spinner loading-xs"></span>Kaydet
          </button>
          <button type="button" class="btn btn-sm btn-outline" :disabled="pdfBusy" @click="downloadPdf">
            <span v-if="pdfBusy" class="loading loading-spinner loading-xs"></span>Muhasebe PDF
          </button>
          <button type="button" class="btn btn-sm btn-outline" @click="downloadExcel">Muhasebe Excel</button>
          <button type="button" class="btn btn-sm btn-outline" :disabled="locked" @click="requestUpload">Bordro yükle</button>
          <button v-if="!approved" type="button" class="btn btn-sm btn-success" :disabled="busy || status !== 'PayrollImported'" :title="status !== 'PayrollImported' ? 'Önce bordro yükleyin' : ''" @click="approve()">
            Onayla
          </button>
          <button v-else type="button" class="btn btn-sm btn-warning" :disabled="busy" @click="showUnapprove = true">Onayı geri al</button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-8"><span class="loading loading-spinner"></span></div>

      <div v-else-if="!data" class="text-center py-10 space-y-3">
        <p class="text-sm text-slate-500">{{ label }} için maaş dönemi henüz oluşturulmadı.</p>
        <button type="button" class="btn btn-primary btn-sm" :disabled="busy" @click="createPeriod">
          <span v-if="busy" class="loading loading-spinner loading-xs"></span>Dönem oluştur
        </button>
      </div>

      <template v-else>
        <div v-if="skipped.length" class="alert alert-warning text-xs">
          <div>
            <div class="font-bold">Ücret tanımı eksik olduğu için döneme eklenmeyen personel:</div>
            <ul class="list-disc pl-4"><li v-for="(s, i) in skipped" :key="i">{{ s }}</li></ul>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="rounded-xl border border-slate-200 px-3 py-2"><div class="text-xs text-slate-500">Hakediş</div><div class="font-bold">{{ formatMoney(data.totalEntitlement) }}</div></div>
          <div class="rounded-xl border border-slate-200 px-3 py-2"><div class="text-xs text-slate-500">Ödenen</div><div class="font-bold text-success">{{ formatMoney(data.totalPaid) }}</div></div>
          <div class="rounded-xl border border-slate-200 px-3 py-2"><div class="text-xs text-slate-500">Kalan</div><div class="font-bold" :class="data.totalRemaining > 0 ? 'text-amber-700' : ''">{{ formatMoney(data.totalRemaining) }}</div></div>
          <div class="rounded-xl border border-slate-200 px-3 py-2"><div class="text-xs text-slate-500">Firma maliyeti</div><div class="font-bold">{{ formatMoney(data.employerCost) }}</div></div>
        </div>

        <div v-if="!data.lines.length" class="text-center py-6 text-sm text-slate-500">Bu dönemde personel yok.</div>

        <div v-else class="overflow-x-auto">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th class="text-right">Gün</th>
                <th class="text-right">Mesai (sa)</th>
                <th class="text-right">Tatil (gün)</th>
                <th class="text-right">Prim</th>
                <th class="min-w-40">Not</th>
                <th class="text-right">Maaş</th>
                <th class="text-right">Yol</th>
                <th class="text-right">Mesai</th>
                <th class="text-right">Tatil</th>
                <th class="text-right">Yemek</th>
                <th class="text-right">Hakediş</th>
                <th class="text-right">Bordro net</th>
                <th class="text-right">Fark</th>
                <th class="text-right">Ödenen</th>
                <th class="text-right">Kalan</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="l in data.lines" :key="l.id">
                <td class="font-medium whitespace-nowrap">{{ l.fullName }}<div class="text-xs text-slate-500 font-normal">{{ l.position }}</div></td>
                <td class="text-right"><input v-model.number="edits[l.id].workDays" type="number" min="0" max="30" step="1" class="input input-bordered input-xs w-16 text-right" :disabled="locked" /></td>
                <td class="text-right"><input v-model.number="edits[l.id].overtimeHours" type="number" min="0" step="0.5" class="input input-bordered input-xs w-20 text-right" :disabled="locked" /></td>
                <td class="text-right"><input v-model.number="edits[l.id].holidayDays" type="number" min="0" step="0.5" class="input input-bordered input-xs w-20 text-right" :disabled="locked" /></td>
                <td class="text-right"><input v-model.number="edits[l.id].bonus" type="number" min="0" step="0.01" class="input input-bordered input-xs w-24 text-right" :disabled="locked" /></td>
                <td><input v-model="edits[l.id].note" type="text" maxlength="200" class="input input-bordered input-xs w-full" :disabled="locked" /></td>
                <td class="text-right whitespace-nowrap">{{ formatMoney(l.salaryAmount) }}</td>
                <td class="text-right whitespace-nowrap">{{ formatMoney(l.transportAmount) }}</td>
                <td class="text-right whitespace-nowrap">{{ formatMoney(l.overtimeAmount) }}</td>
                <td class="text-right whitespace-nowrap">{{ formatMoney(l.holidayAmount) }}</td>
                <td class="text-right whitespace-nowrap">{{ formatMoney(l.mealAmount) }}</td>
                <td class="text-right whitespace-nowrap font-medium">{{ formatMoney(l.netEntitlement) }}</td>
                <td class="text-right whitespace-nowrap">{{ formatMoney(l.payrollNet) }}</td>
                <td class="text-right whitespace-nowrap">
                  <span v-if="l.hasDifference" class="badge badge-error badge-sm cursor-help" :title="(l.differenceReasons || []).join('\n')">{{ formatMoney(l.difference) }}</span>
                  <span v-else-if="l.payrollNet !== null && l.payrollNet !== undefined" class="text-success text-xs">Eşleşti</span>
                  <span v-else>-</span>
                </td>
                <td class="text-right whitespace-nowrap">{{ formatMoney(l.paid) }}</td>
                <td class="text-right whitespace-nowrap" :class="l.remaining > 0 ? 'text-amber-700 font-medium' : ''">{{ formatMoney(l.remaining) }}</td>
                <td><button type="button" class="btn btn-ghost btn-xs whitespace-nowrap" @click="openPayments(l)">+ Ödeme</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="isDirty" class="text-xs text-slate-500">Değişiklikler kaydedilince tutarlar yeniden hesaplanır.</p>
      </template>
    </div>

    <PaymentModal v-model="showPayments" :period="period" :line="paymentLine" @changed="refreshTotals" />
    <PayrollUploadModal v-model="showUpload" :period="period" @saved="onPayrollSaved" />

    <!-- Onay: farklar / mevcut giderler -->
    <BaseModal v-model="showApprove" title="Onay öncesi uyarı" size="lg">
      <div class="space-y-4 text-sm">
        <div v-if="outcome.differences.length">
          <p class="font-bold mb-1">Hakediş ile bordro neti arasında fark olan satırlar:</p>
          <ul class="list-disc pl-5 space-y-1">
            <li v-for="d in outcome.differences" :key="d.id">
              {{ d.fullName }} — hakediş {{ formatMoney(d.netEntitlement) }}, bordro {{ formatMoney(d.payrollNet) }}, fark
              <span class="text-error font-bold">{{ formatMoney(d.difference) }}</span>
              <span v-if="d.differenceReasons?.length" class="text-xs text-slate-500"> ({{ d.differenceReasons.join('; ') }})</span>
            </li>
          </ul>
        </div>
        <div v-if="outcome.existingExpenses.length">
          <p class="font-bold mb-1">Bu ayda elle girilmiş benzer giderler var (onaylarsanız çift gider oluşabilir):</p>
          <ul class="list-disc pl-5 space-y-1">
            <li v-for="x in outcome.existingExpenses" :key="x.id">{{ x.title }} — {{ formatMoney(x.amount) }} ({{ formatDate(x.expenseDate) }})</li>
          </ul>
        </div>
      </div>
      <template #footer>
        <button type="button" class="btn btn-ghost btn-sm" @click="showApprove = false">Vazgeç</button>
        <button type="button" class="btn btn-success btn-sm" :disabled="busy" @click="confirmApprove">Yine de onayla</button>
      </template>
    </BaseModal>

    <ConfirmModal
      :isOpen="showUnapprove"
      title="Onayı geri al"
      message="Onay geri alınırsa dönemin oluşturduğu giderler silinir. Devam edilsin mi?"
      confirmLabel="Geri al"
      confirmClass="btn-warning"
      :loading="busy"
      @confirm="unapprove"
      @cancel="showUnapprove = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import ConfirmModal from '@/presentation/components/common/ConfirmModal.vue'
import payrollService from '@/infrastructure/services/payrollService'
import { useNotification } from '@/application/composables/useNotification'
import { useDirtyGuard } from '@/application/composables/useDirtyGuard'
import PaymentModal from './PaymentModal.vue'
import PayrollUploadModal from './PayrollUploadModal.vue'
import {
  currentPeriodKey, parsePeriodKey, monthLabel, formatMoney, formatDate, errorText,
  normalizeStatus, STATUS_META
} from './payrollHelpers'

const { showSuccess, showError } = useNotification()

const period = ref(currentPeriodKey())
const data = ref(null)
const loading = ref(false)
const busy = ref(false)
const saving = ref(false)
const pdfBusy = ref(false)
const skipped = ref([])

// lineId -> düzenlenebilir girdiler
const edits = reactive({})
const { isDirty, resetDirty } = useDirtyGuard(() => edits)

const showPayments = ref(false)
const paymentLineId = ref(null)
const paymentLine = computed(() => data.value?.lines.find(l => l.id === paymentLineId.value) || null)
const showUpload = ref(false)
const showApprove = ref(false)
const showUnapprove = ref(false)
const outcome = ref({ differences: [], existingExpenses: [] })

const label = computed(() => {
  const p = parsePeriodKey(period.value)
  return p ? monthLabel(p.year, p.month) : period.value
})
const status = computed(() => normalizeStatus(data.value?.status))
const statusMeta = computed(() => STATUS_META[status.value] || STATUS_META.Draft)
const approved = computed(() => status.value === 'Approved')
// Girdiler yalnız Taslak / Bordro yüklendi durumunda düzenlenir
const locked = computed(() => approved.value)

const applyPeriod = (p) => {
  data.value = p
  for (const k of Object.keys(edits)) delete edits[k]
  for (const l of p?.lines || []) {
    edits[l.id] = {
      workDays: l.workDays, overtimeHours: l.overtimeHours, holidayDays: l.holidayDays,
      bonus: l.bonus, note: l.note || ''
    }
  }
  resetDirty()
}

const load = async () => {
  loading.value = true
  skipped.value = []
  try {
    applyPeriod(await payrollService.getPeriod(period.value))
  } catch (e) {
    applyPeriod(null)
    showError(errorText(e, 'Maaş dönemi yüklenemedi.'))
  } finally {
    loading.value = false
  }
}

// Ödeme değişince yalnız sunucu verisini (ödenen/kalan/toplamlar) tazeler; grid girdileri (edits) korunur.
const refreshTotals = async () => {
  try {
    const p = await payrollService.getPeriod(period.value)
    if (p) data.value = p
  } catch (e) {
    showError(errorText(e, 'Maaş dönemi yüklenemedi.'))
  }
}

const confirmLeave = () => !isDirty.value || window.confirm('Kaydedilmemiş değişiklikleriniz var. Yine de çıkmak istiyor musunuz?')

const onPeriodChange = (ev) => {
  const v = ev.target.value
  if (!v || !confirmLeave()) {
    ev.target.value = period.value
    return
  }
  period.value = v
  load()
}

onBeforeRouteLeave(() => confirmLeave())

const createPeriod = async () => {
  busy.value = true
  try {
    const r = await payrollService.createPeriod(period.value)
    applyPeriod(r.period)
    skipped.value = r.skippedEmployees || []
    showSuccess('Maaş dönemi oluşturuldu.')
  } catch (e) {
    showError(errorText(e, 'Dönem oluşturulamadı.'))
  } finally {
    busy.value = false
  }
}

const changedInputs = () => (data.value?.lines || [])
  .filter(l => {
    const e = edits[l.id]
    return e && (e.workDays !== l.workDays || e.overtimeHours !== l.overtimeHours ||
      e.holidayDays !== l.holidayDays || e.bonus !== l.bonus || (e.note || '') !== (l.note || ''))
  })
  .map(l => {
    const e = edits[l.id]
    return {
      lineId: l.id,
      workDays: Number(e.workDays) || 0,
      overtimeHours: Number(e.overtimeHours) || 0,
      holidayDays: Number(e.holidayDays) || 0,
      bonus: Number(e.bonus) || 0,
      note: (e.note || '').trim() || null
    }
  })

const saveLines = async () => {
  const inputs = changedInputs()
  if (!inputs.length) { resetDirty(); return }
  saving.value = true
  try {
    applyPeriod(await payrollService.saveLines(period.value, inputs))
    showSuccess(`${inputs.length} satır kaydedildi.`)
  } catch (e) {
    showError(errorText(e, 'Değişiklikler kaydedilemedi.'))
  } finally {
    saving.value = false
  }
}

const openPayments = (line) => {
  paymentLineId.value = line.id
  showPayments.value = true
}

const requestUpload = () => {
  if (!confirmLeave()) return
  showUpload.value = true
}

const onPayrollSaved = (p) => {
  applyPeriod(p)
}

// ───── onay ─────
const approve = async (flags = {}) => {
  if (isDirty.value) {
    showError('Önce yaptığınız değişiklikleri kaydedin.')
    return
  }
  busy.value = true
  try {
    applyPeriod(await payrollService.approve(period.value, flags))
    showApprove.value = false
    showSuccess('Dönem onaylandı; giderler oluşturuldu.')
  } catch (e) {
    const body = e?.status === 409 ? e?.response?.data : null
    const diffs = body?.differences || []
    const existing = body?.existingExpenses || []
    if (body && typeof body === 'object' && (diffs.length || existing.length)) {
      outcome.value = { differences: diffs, existingExpenses: existing }
      showApprove.value = true
    } else {
      showError(errorText(e, 'Dönem onaylanamadı.'))
    }
  } finally {
    busy.value = false
  }
}

const confirmApprove = () => approve({
  confirmDifferences: outcome.value.differences.length > 0,
  confirmExistingExpenses: outcome.value.existingExpenses.length > 0
})

const unapprove = async () => {
  busy.value = true
  try {
    applyPeriod(await payrollService.unapprove(period.value))
    showUnapprove.value = false
    showSuccess('Onay geri alındı.')
  } catch (e) {
    showError(errorText(e, 'Onay geri alınamadı.'))
  } finally {
    busy.value = false
  }
}

// ───── çıktılar ─────
const downloadPdf = async () => {
  pdfBusy.value = true
  try {
    await payrollService.downloadAccountingPdf(period.value)
  } catch (e) {
    showError(errorText(e, 'PDF indirilemedi.'))
  } finally {
    pdfBusy.value = false
  }
}

const downloadExcel = async () => {
  try {
    const XLSX = await import('xlsx')
    const aoa = [['Ad Soyad', 'TCKN', 'Görev', 'Gün', 'Mesai', 'Tatil', 'Prim', 'Hakediş (yemek hariç)']]
    for (const l of data.value?.lines || []) {
      aoa.push([l.fullName, l.nationalId, l.position || '', l.workDays, l.overtimeHours, l.holidayDays, Number(l.bonus), Math.round((Number(l.netEntitlement) - Number(l.mealAmount || 0)) * 100) / 100])
    }
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), 'Muhasebe Listesi')
    XLSX.writeFile(wb, `Maas_${period.value.replace('-', '_')}.xlsx`)
  } catch (e) {
    showError(errorText(e, 'Excel oluşturulamadı.'))
  }
}

onMounted(load)
</script>
