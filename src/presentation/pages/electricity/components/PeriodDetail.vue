<template>
  <div class="space-y-5">
    <div v-if="loading" class="flex justify-center py-10">
      <span class="loading loading-spinner loading-md text-brand-500"></span>
    </div>

    <div v-else-if="loadError" class="alert alert-error text-sm">{{ loadError }}</div>

    <template v-else-if="detail">
      <!-- Başlık -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <button type="button" class="btn btn-ghost btn-sm" @click="emit('back')">&larr; Dönemler</button>
          <h3 class="text-base font-bold text-slate-800">Dönem {{ periodLabel(form) }}</h3>
          <span class="badge badge-sm" :class="readonly ? 'badge-success' : 'badge-warning'">
            {{ STATUS_LABELS[detail.status] || detail.status }}
          </span>
        </div>
        <div v-if="!readonly" class="text-xs" data-testid="save-state" :class="saveStateClass">{{ saveStateText }}</div>
      </div>

      <div v-if="pageError" class="alert alert-error text-sm whitespace-pre-line" data-testid="page-error">{{ pageError }}</div>
      <div v-if="detail.errors?.length" class="border border-red-200 bg-red-50 text-red-700 rounded-xl p-3 text-sm space-y-1" data-testid="calc-errors">
        <div v-for="(m, i) in detail.errors" :key="'e' + i">{{ m }}</div>
      </div>
      <div v-if="detail.warnings?.length" class="border border-yellow-200 bg-yellow-50 text-yellow-800 rounded-xl p-3 text-sm space-y-1" data-testid="calc-warnings">
        <div v-for="(m, i) in detail.warnings" :key="'w' + i">{{ m }}</div>
      </div>

      <!-- Fatura girdileri -->
      <fieldset :disabled="readonly" class="border border-slate-200 rounded-xl bg-white p-4">
        <legend class="px-1 text-sm font-semibold text-slate-700">Fatura</legend>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label class="form-control">
            <span class="label-text text-xs mb-1">Başlangıç</span>
            <input v-model="form.startDate" type="date" class="input input-bordered input-sm" />
          </label>
          <label class="form-control">
            <span class="label-text text-xs mb-1">Bitiş</span>
            <input v-model="form.endDate" type="date" class="input input-bordered input-sm" />
          </label>
          <div class="form-control">
            <span class="label-text text-xs mb-1">Borç Ayı / Yılı</span>
            <div class="flex gap-2">
              <select v-model.number="form.debtMonth" class="select select-bordered select-sm w-20">
                <option v-for="m in 12" :key="m" :value="m">{{ String(m).padStart(2, '0') }}</option>
              </select>
              <input v-model.number="form.debtYear" type="number" min="2000" max="2100" step="1" class="input input-bordered input-sm w-24" />
            </div>
          </div>
          <label class="form-control">
            <span class="label-text text-xs mb-1">Son Ödeme</span>
            <input v-model="form.dueDate" type="date" class="input input-bordered input-sm" />
          </label>

          <label class="form-control">
            <span class="label-text text-xs mb-1">Fatura kWh</span>
            <input v-model.number="form.billKwh" type="number" step="any" min="0" class="input input-bordered input-sm" data-testid="bill-kwh" />
          </label>
          <label class="form-control">
            <span class="label-text text-xs mb-1">Enerji Bedeli (₺)</span>
            <input v-model.number="form.energyAmount" type="number" step="any" min="0" class="input input-bordered input-sm" />
          </label>
          <label class="form-control">
            <span class="label-text text-xs mb-1">BTV (₺)</span>
            <input v-model.number="form.btvAmount" type="number" step="any" min="0" class="input input-bordered input-sm" />
          </label>
          <label class="form-control">
            <span class="label-text text-xs mb-1">Fatura Toplamı KDV Dahil (₺)</span>
            <input v-model.number="form.billTotalAmount" type="number" step="any" min="0" class="input input-bordered input-sm" />
          </label>

          <label class="form-control">
            <span class="label-text text-xs mb-1">Reaktif kWh</span>
            <input v-model.number="form.reactiveKwh" type="number" step="any" min="0" class="input input-bordered input-sm" />
          </label>
          <label class="form-control">
            <span class="label-text text-xs mb-1">Endüktif kWh</span>
            <input v-model.number="form.inductiveKwh" type="number" step="any" min="0" class="input input-bordered input-sm" />
          </label>
          <label class="form-control">
            <span class="label-text text-xs mb-1">Hesap kWh Düzeltmesi</span>
            <input v-model.number="form.adjustedBillKwh" type="number" step="any" min="0" placeholder="Fatura kWh" class="input input-bordered input-sm" />
          </label>
        </div>
      </fieldset>

      <!-- Okumalar -->
      <div class="overflow-x-auto border border-slate-200 rounded-xl bg-white">
        <table class="table table-sm" data-testid="readings-table">
          <thead>
            <tr>
              <th>Sayaç</th>
              <th>Borçlu</th>
              <th>Aralık</th>
              <th class="text-right">Gün</th>
              <th class="text-right">İlk Okuma</th>
              <th class="text-right">Son Okuma</th>
              <th class="text-right">Tüketim</th>
              <th class="text-right">Kendi Tutar</th>
              <th class="text-right">Havuz Payı</th>
              <th class="text-right">KDV Dahil</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!view.length">
              <td colspan="10" class="text-center text-slate-400 py-6">Bu dönemde okuma satırı yok.</td>
            </tr>
            <tr v-for="v in view" :key="v.row.key" :class="rowClass(v)" :data-testid="'reading-' + v.row.meterId + '-' + v.sequence">
              <td class="min-w-32">
                <div class="font-medium">
                  {{ v.row.meterName }}<span v-if="v.count > 1" class="text-slate-400 font-normal"> ({{ v.sequence }}/{{ v.count }})</span>
                </div>
                <div v-if="v.row.kind !== 'Unit'" class="text-xs text-slate-400">{{ KIND_LABELS[v.row.kind] || v.row.kind }}</div>
                <div v-if="v.hint" class="text-xs mt-0.5" :class="v.warning === 'error' || v.serverError ? 'text-red-600' : 'text-yellow-700'">{{ v.hint }}</div>
                <div v-if="!readonly && v.isLast" class="flex flex-wrap gap-x-2 mt-0.5">
                  <button type="button" class="link link-primary text-xs" @click="openSplit(v)">Ara okuma ekle</button>
                  <button v-if="v.count > 1" type="button" class="link text-xs text-red-600" @click="removeRow(v.row)">Kaldır</button>
                </div>
              </td>
              <td class="w-40 min-w-40">
                <select
                  v-if="v.row.kind === 'Unit'"
                  v-model="v.row.debtor"
                  :disabled="readonly"
                  class="select select-bordered select-xs w-full"
                >
                  <option value="">Ünitenin kiracısı/maliki</option>
                  <optgroup v-if="tenants.length" label="Kiracılar">
                    <option v-for="t in tenants" :key="'t' + t.id" :value="'t:' + t.id">{{ partyName(t) }}</option>
                  </optgroup>
                  <optgroup v-if="owners.length" label="Malikler">
                    <option v-for="o in owners" :key="'o' + o.id" :value="'o:' + o.id">{{ partyName(o) }}</option>
                  </optgroup>
                </select>
                <span v-else class="text-slate-400">-</span>
                <div v-if="v.debtorNames" class="text-xs text-slate-400 mt-0.5">{{ v.debtorNames }}</div>
              </td>
              <td class="whitespace-nowrap text-xs">
                <div>{{ formatDate(v.startDate) }}</div>
                <input
                  v-if="!v.isLast && !readonly"
                  v-model="v.row.endDate"
                  type="date"
                  class="input input-bordered input-xs mt-0.5"
                  title="Ara okuma tarihi"
                />
                <div v-else>{{ formatDate(v.endDate) }}</div>
              </td>
              <td class="text-right">{{ v.calc ? v.calc.days : daysBetween(v.startDate, v.endDate) }}</td>
              <td class="text-right">
                <input
                  v-if="v.isFirst && !readonly"
                  v-model.number="v.row.previousIndex"
                  type="number" step="any" min="0"
                  class="input input-bordered input-xs w-24 text-right"
                />
                <span v-else>{{ formatNumber(v.previousIndex) }}</span>
              </td>
              <td class="text-right">
                <input
                  v-if="!readonly"
                  v-model.number="v.row.currentIndex"
                  type="number" step="any" min="0"
                  class="input input-bordered input-xs w-24 text-right"
                  :class="{ 'input-error': v.warning === 'error' }"
                  data-testid="current-index"
                />
                <span v-else>{{ formatNumber(v.row.currentIndex) }}</span>
              </td>
              <td class="text-right" data-testid="consumption">{{ v.calc ? formatNumber(v.calc.consumption) : '…' }}</td>
              <td class="text-right" data-testid="own-amount">{{ v.calc ? formatMoney(v.calc.ownAmount) : '…' }}</td>
              <td class="text-right whitespace-nowrap">
                <template v-if="v.report.length">
                  <div>{{ formatMoney(v.poolShare) }}</div>
                  <div v-if="v.report.length > 1" class="text-xs text-slate-400">
                    <div v-for="r in v.report" :key="r.flatId">{{ r.flatCode }}: {{ formatMoney(r.poolShare) }}</div>
                  </div>
                </template>
                <span v-else class="text-slate-400">-</span>
              </td>
              <td class="text-right whitespace-nowrap font-medium" data-testid="total">
                <template v-if="v.report.length">
                  <div>{{ formatMoney(v.total) }}</div>
                  <div v-if="v.report.length > 1" class="text-xs text-slate-400 font-normal">
                    <div v-for="r in v.report" :key="r.flatId">{{ r.flatCode }}: {{ formatMoney(r.total) }}</div>
                  </div>
                </template>
                <span v-else class="text-slate-400 font-normal">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Özet -->
      <div class="border border-slate-200 rounded-xl bg-white p-4" data-testid="summary">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 text-sm">
          <div><div class="text-xs text-slate-500">Birim Fiyat (₺/kWh)</div><div class="font-medium">{{ formatRate(detail.unitPrice) }}</div></div>
          <div><div class="text-xs text-slate-500">BTV Oranı</div><div class="font-medium">%{{ formatRate(Number(detail.btvRate) * 100) }}</div></div>
          <div><div class="text-xs text-slate-500">Okunan kWh</div><div class="font-medium">{{ formatNumber(detail.readTotalKwh) }}</div></div>
          <div><div class="text-xs text-slate-500">Reaktif Tutar (₺)</div><div class="font-medium">{{ formatMoney(detail.reactiveAmount) }}</div></div>
          <div><div class="text-xs text-slate-500">Ortak Diğer kWh</div><div class="font-medium">{{ formatNumber(detail.otherCommonKwh) }}</div></div>
          <div><div class="text-xs text-slate-500">Ortak Diğer Tutar (₺)</div><div class="font-medium">{{ formatMoney(detail.otherCommonAmount) }}</div></div>
          <div><div class="text-xs text-slate-500">Havuz (₺)</div><div class="font-medium">{{ formatMoney(detail.poolAmount) }}</div></div>
          <div><div class="text-xs text-slate-500">Hesaplanan Toplam KDV Dahil (₺)</div><div class="font-bold" data-testid="calculated-total">{{ formatMoney(detail.calculatedTotal) }}</div></div>
        </div>
        <div class="mt-3 pt-3 border-t border-slate-100 text-sm flex flex-wrap gap-x-6 gap-y-1">
          <span>Fatura toplamı: <b>{{ form.billTotalAmount === '' || form.billTotalAmount === null ? '-' : formatMoney(form.billTotalAmount) }}</b></span>
          <span>Kontrol farkı:
            <b :class="controlClass">{{ detail.controlDifference === null || detail.controlDifference === undefined ? '-' : formatMoney(detail.controlDifference) }}</b>
          </span>
        </div>
      </div>
    </template>

    <!-- Ara okuma -->
    <div v-if="split" class="modal modal-open">
      <div class="modal-box max-w-md">
        <h3 class="font-bold text-lg mb-2">Ara Okuma Ekle</h3>
        <p class="text-sm text-slate-500 mb-4">
          {{ split.meterName }}: mevcut son satır seçilen tarihte kapanır, yeni satır bu tarihten dönem sonuna kadar sürer.
          Yeni satırın borçlusunu tabloda seçebilirsiniz.
        </p>
        <label class="form-control w-full">
          <span class="label-text text-sm mb-1">Ara okuma tarihi</span>
          <input v-model="split.date" type="date" class="input input-bordered input-sm w-full" :min="split.min" :max="split.max" />
        </label>
        <p v-if="split.error" class="text-sm text-red-600 mt-2">{{ split.error }}</p>
        <div class="modal-action">
          <button type="button" class="btn btn-sm btn-ghost" @click="split = null">Vazgeç</button>
          <button type="button" class="btn btn-sm btn-primary" @click="confirmSplit">Ekle</button>
        </div>
      </div>
      <div class="modal-backdrop" @click="split = null"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import electricityService from '@/infrastructure/services/electricityService'
import tenantsService from '@/infrastructure/services/tenantsService'
import ownersService from '@/infrastructure/services/ownersService'
import {
  readingWarning, STATUS_LABELS, dateOnly, formatDate, periodLabel, daysBetween, midpointDate,
  formatNumber, formatMoney, formatRate, errorText, partyName
} from '../electricityHelpers'

const props = defineProps({
  periodId: { type: String, required: true }
})
const emit = defineEmits(['back'])

const KIND_LABELS = { Unit: 'Daire', CommonArea: 'Ortak Alan', Mescit: 'Mescit' }
const AUTOSAVE_MS = 800

const loading = ref(true)
const loadError = ref('')
const pageError = ref('')
// Sunucunun son hesap sonucu (hesap alanları, okuma hesap kolonları, rapor satırları, hatalar/uyarılar)
const detail = ref(null)
// Kullanıcı girdileri; sunucu yanıtı bunları ezmez
const form = ref({})
const rows = ref([])
const tenants = ref([])
const owners = ref([])
const split = ref(null)

const saveState = ref('idle') // idle | pending | saving | saved | error
let timer = null
let inFlight = false
let queued = false
let lastSentKey = ''
let keySeq = 0

const readonly = computed(() => detail.value?.status === 'Finalized')

// ---------- Yükleme ----------

const toInput = (v) => (v === null || v === undefined ? '' : Number(v))

function hydrate(dto) {
  form.value = {
    startDate: dateOnly(dto.startDate),
    endDate: dateOnly(dto.endDate),
    debtYear: dto.debtYear,
    debtMonth: dto.debtMonth,
    dueDate: dateOnly(dto.dueDate),
    billKwh: toInput(dto.billKwh),
    energyAmount: toInput(dto.energyAmount),
    btvAmount: toInput(dto.btvAmount),
    reactiveKwh: toInput(dto.reactiveKwh),
    inductiveKwh: toInput(dto.inductiveKwh),
    adjustedBillKwh: toInput(dto.adjustedBillKwh),
    billTotalAmount: toInput(dto.billTotalAmount)
  }
  rows.value = (dto.readings || []).map(r => ({
    key: ++keySeq,
    id: r.id,
    meterId: r.meterId,
    meterName: r.meterName,
    kind: r.kind,
    sequence: r.sequence,
    endDate: dateOnly(r.endDate),
    previousIndex: Number(r.previousIndex),
    currentIndex: Number(r.currentIndex),
    debtor: r.tenantId ? `t:${r.tenantId}` : (r.ownerId ? `o:${r.ownerId}` : '')
  }))
  detail.value = dto
  lastSentKey = keyOf(buildBody().body)
}

const load = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const dto = await electricityService.getPeriod(props.periodId)
    hydrate(dto)
  } catch (e) {
    detail.value = null
    loadError.value = errorText(e, 'Dönem yüklenemedi.')
  } finally {
    loading.value = false
  }
}

const loadParties = async () => {
  const [t, o] = await Promise.allSettled([tenantsService.getTenants(), ownersService.getOwners()])
  const byName = (a, b) => partyName(a).localeCompare(partyName(b), 'tr-TR')
  tenants.value = t.status === 'fulfilled' && Array.isArray(t.value) ? [...t.value].sort(byName) : []
  owners.value = o.status === 'fulfilled' && Array.isArray(o.value) ? [...o.value].sort(byName) : []
}

// ---------- Satır zinciri (sunucu da aynı şekilde zincirler) ----------

const meterGroups = computed(() => {
  const groups = new Map()
  for (const r of rows.value) {
    if (!groups.has(r.meterId)) groups.set(r.meterId, [])
    groups.get(r.meterId).push(r)
  }
  for (const list of groups.values()) list.sort((a, b) => a.sequence - b.sequence)
  return groups
})

const chainOf = (row) => {
  const list = meterGroups.value.get(row.meterId) || [row]
  const idx = list.indexOf(row)
  const prev = idx > 0 ? list[idx - 1] : null
  const isFirst = idx === 0
  const isLast = idx === list.length - 1
  return {
    idx,
    count: list.length,
    isFirst,
    isLast,
    sequence: idx + 1,
    startDate: isFirst ? form.value.startDate : prev.endDate,
    endDate: isLast ? form.value.endDate : row.endDate,
    previousIndex: isFirst ? row.previousIndex : prev.currentIndex
  }
}

const num = (v) => (v === '' || v === null || v === undefined || isNaN(Number(v)) ? 0 : Number(v))
const numOrNull = (v) => (v === '' || v === null || v === undefined || isNaN(Number(v)) ? null : Number(v))

function buildBody() {
  const f = form.value
  const sentSeq = new Map() // row.key → gönderilen sequence (id eşleme için)
  const readings = rows.value.map(r => {
    const c = chainOf(r)
    sentSeq.set(r.key, c.sequence)
    const debtor = r.kind === 'Unit' ? r.debtor : ''
    return {
      id: r.id || null,
      meterId: r.meterId,
      sequence: c.sequence,
      startDate: c.startDate,
      endDate: c.endDate,
      previousIndex: num(c.previousIndex),
      currentIndex: num(r.currentIndex),
      tenantId: debtor.startsWith('t:') ? debtor.slice(2) : null,
      ownerId: debtor.startsWith('o:') ? debtor.slice(2) : null
    }
  })
  return {
    sentSeq,
    body: {
      startDate: f.startDate,
      endDate: f.endDate,
      debtYear: num(f.debtYear),
      debtMonth: num(f.debtMonth),
      dueDate: f.dueDate,
      billKwh: num(f.billKwh),
      energyAmount: num(f.energyAmount),
      btvAmount: num(f.btvAmount),
      reactiveKwh: num(f.reactiveKwh),
      inductiveKwh: num(f.inductiveKwh),
      adjustedBillKwh: numOrNull(f.adjustedBillKwh),
      billTotalAmount: numOrNull(f.billTotalAmount),
      readings
    }
  }
}

// Kirli kontrolü: sunucunun verdiği id'ler içerik sayılmaz (id alınca yeniden kayıt tetiklenmez)
const keyOf = (body) => JSON.stringify({ ...body, readings: body.readings.map(({ id, ...rest }) => rest) })

const currentKey = computed(() => keyOf(buildBody().body))

// ---------- Otomatik kayıt ----------

watch(currentKey, (key) => {
  if (readonly.value || !detail.value) return
  if (key === lastSentKey && !inFlight) {
    clearTimeout(timer)
    timer = null
    if (saveState.value === 'pending') saveState.value = 'saved'
    return
  }
  saveState.value = 'pending'
  clearTimeout(timer)
  timer = setTimeout(save, AUTOSAVE_MS)
})

async function save() {
  timer = null
  if (readonly.value) return
  if (inFlight) { queued = true; return }
  const { body, sentSeq } = buildBody()
  const key = keyOf(body)
  if (key === lastSentKey) { if (saveState.value === 'pending') saveState.value = 'saved'; return }

  inFlight = true
  saveState.value = 'saving'
  lastSentKey = key
  try {
    const res = await electricityService.updatePeriod(props.periodId, body)
    applyResponse(res, sentSeq)
    pageError.value = ''
    saveState.value = 'saved'
  } catch (e) {
    // Kullanıcı girdisi korunur; aynı girdi tekrar gönderilmez, yeni değişiklik yeniden dener
    pageError.value = errorText(e, 'Dönem kaydedilemedi.')
    saveState.value = 'error'
  } finally {
    inFlight = false
    const dirty = currentKey.value !== lastSentKey
    if (queued || (dirty && !timer)) {
      queued = false
      if (dirty) save()
    } else if (dirty) {
      saveState.value = 'pending'
    }
  }
}

// Yanıt yalnız hesap alanlarını / rapor satırlarını günceller; giriş alanlarına dokunmaz.
function applyResponse(res, sentSeq) {
  if (!res) return
  detail.value = res
  // Yeni eklenen ara okuma satırlarına sunucunun verdiği id'yi al (meterId + sequence ile eşle)
  for (const r of rows.value) {
    if (r.id || !sentSeq.has(r.key)) continue
    const seq = sentSeq.get(r.key)
    const match = (res.readings || []).find(x => x.meterId === r.meterId && x.sequence === seq)
    if (match && !rows.value.some(o => o.id === match.id)) r.id = match.id
  }
}

const saveStateText = computed(() => ({
  idle: '',
  pending: 'Değişiklikler kaydedilecek…',
  saving: 'Kaydediliyor…',
  saved: 'Kaydedildi',
  error: 'Kaydedilemedi'
}[saveState.value]))

const saveStateClass = computed(() => ({
  'text-slate-400': saveState.value === 'pending' || saveState.value === 'saving',
  'text-emerald-600': saveState.value === 'saved',
  'text-red-600': saveState.value === 'error'
}))

// ---------- Görünüm ----------

const calcFor = (row) => {
  const list = detail.value?.readings || []
  if (row.id) return list.find(x => x.id === row.id) || null
  return null // henüz kaydedilmemiş satır
}

const hintFor = (warning, pc) => {
  if (warning === 'error') return 'Son okuma ilk okumadan küçük.'
  if (warning === 'high') return `Tüketim önceki dönemin 3 katından fazla (önceki: ${formatNumber(pc)} kWh).`
  if (warning === 'low') return `Tüketim önceki dönemin %30'undan az (önceki: ${formatNumber(pc)} kWh).`
  return ''
}

const view = computed(() => {
  const reportRows = detail.value?.reportRows || []
  return rows.value.map(row => {
    const c = chainOf(row)
    const calc = calcFor(row)
    const prevIdx = num(c.previousIndex)
    const curIdx = num(row.currentIndex)
    const warning = readingWarning({
      previousIndex: prevIdx,
      currentIndex: curIdx,
      consumption: curIdx - prevIdx,
      previousConsumption: calc?.previousConsumption
    })
    const report = row.id ? reportRows.filter(x => x.readingId === row.id) : []
    const names = [...new Set(report.map(x => x.debtorName).filter(Boolean))]
    return {
      row,
      ...c,
      calc,
      warning,
      hint: hintFor(warning, calc?.previousConsumption) || calc?.error || '',
      serverError: !!calc?.error,
      report,
      poolShare: report.reduce((s, x) => s + Number(x.poolShare || 0), 0),
      total: report.reduce((s, x) => s + Number(x.total || 0), 0),
      debtorNames: !row.debtor && names.length ? names.join(', ') : ''
    }
  })
})

const rowClass = (v) => {
  if (v.warning === 'error' || v.serverError) return 'bg-red-50'
  if (v.warning === 'high' || v.warning === 'low') return 'bg-yellow-50'
  return ''
}

const controlClass = computed(() => {
  const d = detail.value?.controlDifference
  if (d === null || d === undefined) return 'text-slate-400'
  return Math.abs(Number(d)) > 1 ? 'text-red-600' : 'text-emerald-600'
})

// ---------- Ara okuma ----------

function openSplit(v) {
  const start = v.startDate
  const end = form.value.endDate
  split.value = {
    row: v.row,
    meterName: v.row.meterName,
    date: midpointDate(start, end),
    min: start,
    max: end,
    error: ''
  }
}

function confirmSplit() {
  const s = split.value
  if (!s) return
  if (!s.date || s.date <= s.min || s.date >= s.max) {
    s.error = `Tarih ${formatDate(s.min)} ile ${formatDate(s.max)} arasında olmalıdır.`
    return
  }
  const last = s.row
  const list = meterGroups.value.get(last.meterId) || [last]
  const maxSeq = list.reduce((m, r) => Math.max(m, r.sequence), 0)
  last.endDate = s.date
  const newRow = {
    key: ++keySeq,
    id: null,
    meterId: last.meterId,
    meterName: last.meterName,
    kind: last.kind,
    sequence: maxSeq + 1,
    endDate: form.value.endDate,
    previousIndex: num(last.currentIndex),
    currentIndex: num(last.currentIndex),
    debtor: ''
  }
  const pos = rows.value.lastIndexOf(list[list.length - 1])
  rows.value.splice(pos + 1, 0, newRow)
  split.value = null
}

function removeRow(row) {
  const i = rows.value.indexOf(row)
  if (i >= 0) rows.value.splice(i, 1)
}

// Dönem değişince yeniden yükle
watch(() => props.periodId, () => {
  clearTimeout(timer)
  timer = null
  queued = false
  saveState.value = 'idle'
  pageError.value = ''
  load()
})

onMounted(() => {
  load()
  loadParties()
})

onBeforeUnmount(() => {
  // Bekleyen değişikliği kaybetme
  if (timer) {
    clearTimeout(timer)
    timer = null
    save()
  }
})
</script>
