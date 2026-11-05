<template>
  <div class="space-y-4" data-testid="payroll-severance-tab">
    <div v-if="loading" class="flex justify-center py-8"><span class="loading loading-spinner"></span></div>
    <template v-else-if="summary">
      <div v-for="(w, i) in summary.warnings || []" :key="i" class="alert alert-warning text-xs">{{ w }}</div>

      <div class="grid grid-cols-3 gap-3">
        <div class="rounded-xl border border-slate-200 bg-white px-3 py-2"><div class="text-xs text-slate-500">Toplam karşılık</div><div class="font-bold">{{ formatMoney(summary.totalAccrued) }}</div></div>
        <div class="rounded-xl border border-slate-200 bg-white px-3 py-2"><div class="text-xs text-slate-500">Ödenen</div><div class="font-bold text-success">{{ formatMoney(summary.totalPaid) }}</div></div>
        <div class="rounded-xl border border-slate-200 bg-white px-3 py-2"><div class="text-xs text-slate-500">Fon bakiyesi</div><div class="font-bold">{{ formatMoney(summary.balance) }}</div></div>
      </div>

      <div class="app-card space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="font-bold text-sm">Personel bazında fon</h3>
          <div class="flex gap-2">
            <button type="button" class="btn btn-outline btn-sm" @click="openAdjustment()">Düzeltme ekle</button>
            <button type="button" class="btn btn-primary btn-sm" @click="openPayment()">Tazminat ödemesi</button>
          </div>
        </div>
        <div v-if="!summary.employees.length" class="text-center py-6 text-sm text-slate-500">Kayıt yok.</div>
        <div v-else class="overflow-x-auto">
          <table class="table table-sm">
            <thead><tr><th>Ad Soyad</th><th>Durum</th><th class="text-right">Hizmet (gün)</th><th class="text-right">Karşılık</th><th class="text-right">Ödenen</th><th class="text-right">Bakiye</th><th class="text-right">Tahmini tazminat</th><th class="text-right">Fark</th></tr></thead>
            <tbody>
              <tr v-for="e in summary.employees" :key="e.employeeId" class="hover cursor-pointer" @click="toggle(e)">
                <td class="font-medium">{{ e.fullName }}</td>
                <td>
                  <span class="badge badge-xs" :class="e.isActive ? 'badge-success' : 'badge-ghost'">{{ e.isActive ? 'Aktif' : 'Ayrıldı' }}</span>
                  <span v-if="!e.eligible" class="badge badge-xs badge-ghost ml-1" title="Kıdem tazminatı için henüz hak kazanılmadı">Hak doğmadı</span>
                </td>
                <td class="text-right">{{ e.serviceDays }}</td>
                <td class="text-right whitespace-nowrap">{{ formatMoney(e.accrued) }}</td>
                <td class="text-right whitespace-nowrap">{{ formatMoney(e.paid) }}</td>
                <td class="text-right whitespace-nowrap font-bold">{{ formatMoney(e.balance) }}</td>
                <td class="text-right whitespace-nowrap">{{ formatMoney(e.estimated) }}</td>
                <td class="text-right whitespace-nowrap" :class="e.gap > 0 ? 'text-error font-bold' : ''">{{ formatMoney(e.gap) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="openId" class="app-card space-y-3">
        <h3 class="font-bold text-sm">Hareketler — {{ openName }}</h3>
        <div v-if="movLoading" class="flex justify-center py-4"><span class="loading loading-spinner"></span></div>
        <div v-else-if="!movements.length" class="text-sm text-slate-500">Hareket yok.</div>
        <div v-else class="overflow-x-auto">
          <table class="table table-sm">
            <thead><tr><th>Tarih</th><th>Tür</th><th>Dönem</th><th class="text-right">Tutar</th><th>Not</th><th></th></tr></thead>
            <tbody>
              <tr v-for="m in movements" :key="m.id">
                <td class="whitespace-nowrap">{{ formatDate(m.date) }}</td>
                <td><span class="badge badge-xs" :class="KIND_CLS[m.kind] || 'badge-ghost'">{{ m.kind }}</span></td>
                <td>{{ m.periodLabel || '-' }}</td>
                <td class="text-right whitespace-nowrap" :class="m.kind === 'Ödeme' ? 'text-error' : ''">{{ m.kind === 'Ödeme' ? '-' : '' }}{{ formatMoney(m.amount) }}</td>
                <td class="text-xs">{{ m.note }}</td>
                <td class="text-right">
                  <button v-if="m.kind !== 'Karşılık'" type="button" class="btn btn-ghost btn-xs text-error" :disabled="busy" @click="removeMovement(m)">Sil</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="app-card space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-sm">Kıdem tazminatı tavanları</h3>
          <div class="flex gap-2">
            <button type="button" class="btn btn-outline btn-xs" @click="addCeiling">+ Tavan ekle</button>
            <button type="button" class="btn btn-primary btn-xs" :disabled="busy" @click="saveCeilings">Kaydet</button>
          </div>
        </div>
        <div v-if="!ceilings.length" class="text-sm text-slate-500">Tavan tanımlı değil.</div>
        <table v-else class="table table-sm max-w-xl">
          <thead><tr><th>Geçerlilik başlangıcı</th><th>Tavan (TL)</th><th></th></tr></thead>
          <tbody>
            <tr v-for="(c, i) in ceilings" :key="i">
              <td><input v-model="c.from" type="date" class="input input-bordered input-xs" /></td>
              <td><input v-model.number="c.amount" type="number" step="0.01" min="0.01" class="input input-bordered input-xs" /></td>
              <td><button type="button" class="btn btn-ghost btn-xs text-error" @click="ceilings.splice(i, 1)">Sil</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <SeverancePaymentModal v-model="showPayment" :employees="summary?.employees || []" :employee-id="modalEmployeeId" @saved="reload" />
    <SeveranceAdjustmentModal v-model="showAdjustment" :employees="summary?.employees || []" :employee-id="modalEmployeeId" @saved="reload" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import payrollService from '@/infrastructure/services/payrollService'
import { useNotification } from '@/application/composables/useNotification'
import SeverancePaymentModal from './SeverancePaymentModal.vue'
import SeveranceAdjustmentModal from './SeveranceAdjustmentModal.vue'
import { formatMoney, formatDate, errorText } from './payrollHelpers'

const KIND_CLS = { 'Karşılık': 'badge-info', 'Düzeltme': 'badge-warning', 'Ödeme': 'badge-error' }

const { showSuccess, showError } = useNotification()
const summary = ref(null)
const loading = ref(false)
const busy = ref(false)
const openId = ref(null)
const movements = ref([])
const movLoading = ref(false)
const ceilings = ref([])
const showPayment = ref(false)
const showAdjustment = ref(false)
const modalEmployeeId = ref('')

const openName = computed(() => summary.value?.employees.find(e => e.employeeId === openId.value)?.fullName || '')

const loadMovements = async () => {
  if (!openId.value) return
  movLoading.value = true
  try {
    movements.value = (await payrollService.getSeveranceMovements(openId.value)) || []
  } catch (e) {
    showError(errorText(e, 'Hareketler yüklenemedi.'))
  } finally {
    movLoading.value = false
  }
}

const loadSummary = async () => {
  try {
    summary.value = await payrollService.getSeveranceSummary()
  } catch (e) {
    showError(errorText(e, 'Tazminat fonu yüklenemedi.'))
  }
}

const loadCeilings = async () => {
  try {
    const list = (await payrollService.getSeveranceCeilings()) || []
    ceilings.value = list.map(c => ({ from: String(c.from).slice(0, 10), amount: c.amount }))
  } catch (e) {
    showError(errorText(e, 'Tavanlar yüklenemedi.'))
  }
}

onMounted(async () => {
  loading.value = true
  await Promise.all([loadSummary(), loadCeilings()])
  loading.value = false
})

const reload = async () => {
  await Promise.all([loadSummary(), loadMovements()])
}

const toggle = async (e) => {
  openId.value = openId.value === e.employeeId ? null : e.employeeId
  movements.value = []
  await loadMovements()
}

const openPayment = () => { modalEmployeeId.value = openId.value || ''; showPayment.value = true }
const openAdjustment = () => { modalEmployeeId.value = openId.value || ''; showAdjustment.value = true }

const removeMovement = async (m) => {
  busy.value = true
  try {
    if (m.kind === 'Ödeme') await payrollService.deleteSeverancePayment(m.id)
    else await payrollService.deleteSeveranceAdjustment(m.id)
    showSuccess('Kayıt silindi.')
    await reload()
  } catch (e) {
    showError(errorText(e, 'Kayıt silinemedi.'))
  } finally {
    busy.value = false
  }
}

const addCeiling = () => ceilings.value.push({ from: '', amount: null })

const saveCeilings = async () => {
  busy.value = true
  try {
    const saved = await payrollService.saveSeveranceCeilings(
      ceilings.value.map(c => ({ from: c.from, amount: Number(c.amount) }))
    )
    ceilings.value = (saved || []).map(c => ({ from: String(c.from).slice(0, 10), amount: c.amount }))
    showSuccess('Tavanlar kaydedildi.')
    await loadSummary()
  } catch (e) {
    showError(errorText(e, 'Tavanlar kaydedilemedi.'))
  } finally {
    busy.value = false
  }
}
</script>
