<template>
  <div class="space-y-4" data-testid="payroll-meal-tab">
    <div class="app-card space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 class="font-bold text-sm">Yemek faturaları</h3>
          <p class="text-xs text-slate-500">
            Yemek bordro dışıdır. Onaylı her dönemin yemek tutarı (gün × günlük yemek), yemek firmasının fatura numarası girilince gidere yazılır.
          </p>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <span>Bekleyen: <b class="text-amber-700">{{ pendingCount }}</b> dönem · {{ formatMoney(pendingTotal) }}</span>
          <label class="label cursor-pointer gap-2 py-0">
            <input v-model="onlyPending" type="checkbox" class="checkbox checkbox-xs" />
            <span class="label-text text-xs">Yalnız bekleyenler</span>
          </label>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-8"><span class="loading loading-spinner"></span></div>
      <div v-else-if="!visible.length" class="text-center py-6 text-sm text-slate-500">
        {{ onlyPending ? 'Fatura bekleyen dönem yok.' : 'Henüz onaylı ve yemek tutarı olan dönem yok.' }}
      </div>
      <div v-else class="overflow-x-auto">
        <table class="table table-sm">
          <thead>
            <tr>
              <th>Dönem</th>
              <th class="text-right">Yemek tutarı</th>
              <th>Durum</th>
              <th>Fatura no</th>
              <th>Fatura tarihi</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in visible" :key="r.periodId">
              <td class="font-medium whitespace-nowrap">{{ r.label }}</td>
              <td class="text-right whitespace-nowrap">{{ formatMoney(r.mealTotal) }}</td>
              <td><span class="badge badge-sm" :class="meta(r).cls">{{ meta(r).label }}</span></td>
              <td>{{ r.invoiceNumber || '-' }}</td>
              <td class="whitespace-nowrap">{{ r.invoiceDate ? formatDate(r.invoiceDate) : '-' }}</td>
              <td class="text-right whitespace-nowrap space-x-1">
                <template v-if="status(r) === 'Pending'">
                  <button type="button" class="btn btn-primary btn-xs" :disabled="busy" @click="openEdit(r)">Fatura no gir</button>
                  <button type="button" class="btn btn-ghost btn-xs" :disabled="busy" title="Bu ayın yemek gideri Giderler'e zaten elle girildiyse" @click="close(r)">Zaten giderlerde var</button>
                </template>
                <template v-else-if="status(r) === 'Expensed'">
                  <button type="button" class="btn btn-ghost btn-xs" :disabled="busy" @click="openEdit(r)">Düzenle</button>
                  <button type="button" class="btn btn-ghost btn-xs text-error" :disabled="busy" @click="askReopen(r)">Faturayı kaldır</button>
                </template>
                <button v-else type="button" class="btn btn-ghost btn-xs" :disabled="busy" @click="askReopen(r)">Geri al</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-model="showEdit" :title="`${editing?.label || ''} yemek faturası`">
      <div v-if="editing" class="space-y-3 text-sm">
        <p>Gidere yazılacak tutar: <b>{{ formatMoney(editing.mealTotal) }}</b> <span class="text-xs text-slate-500">(puantajdan hesaplanır; faturadaki toplam farklı olabilir)</span></p>
        <label class="form-control flex flex-col">
          <span class="label-text text-xs mb-1">Fatura no *</span>
          <input v-model="form.invoiceNumber" type="text" maxlength="100" class="input input-bordered input-sm" data-testid="meal-invoice-number" @keyup.enter="save" />
        </label>
        <label class="form-control flex flex-col">
          <span class="label-text text-xs mb-1">Fatura tarihi (boşsa ay sonu)</span>
          <input v-model="form.invoiceDate" type="date" class="input input-bordered input-sm" />
        </label>
      </div>
      <template #footer>
        <button type="button" class="btn btn-ghost btn-sm" @click="showEdit = false">Vazgeç</button>
        <button type="button" class="btn btn-primary btn-sm" :disabled="busy || !form.invoiceNumber.trim()" @click="save">
          <span v-if="busy" class="loading loading-spinner loading-xs"></span>Kaydet ve giderleştir
        </button>
      </template>
    </BaseModal>

    <ConfirmModal
      :isOpen="!!reopening"
      title="Geri al"
      :message="reopenMessage"
      confirmLabel="Geri al"
      confirmClass="btn-warning"
      :loading="busy"
      @confirm="reopen"
      @cancel="reopening = null"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import ConfirmModal from '@/presentation/components/common/ConfirmModal.vue'
import payrollService from '@/infrastructure/services/payrollService'
import { useNotification } from '@/application/composables/useNotification'
import { periodKey, formatMoney, formatDate, errorText } from './payrollHelpers'

const { showSuccess, showError } = useNotification()

const STATUS_BY_NUMBER = ['Pending', 'Expensed', 'Closed']
const META = {
  Pending: { label: 'Fatura bekliyor', cls: 'badge-warning' },
  Expensed: { label: 'Giderleşti', cls: 'badge-success' },
  Closed: { label: 'Kapatıldı', cls: 'badge-ghost' }
}
const status = (r) => (typeof r.status === 'number' ? STATUS_BY_NUMBER[r.status] : r.status)
const meta = (r) => META[status(r)] || META.Pending

const rows = ref([])
const loading = ref(false)
const busy = ref(false)
const onlyPending = ref(false)

const pending = computed(() => rows.value.filter(r => status(r) === 'Pending'))
const pendingCount = computed(() => pending.value.length)
const pendingTotal = computed(() => pending.value.reduce((s, r) => s + Number(r.mealTotal || 0), 0))
const visible = computed(() => (onlyPending.value ? pending.value : rows.value))

const load = async () => {
  loading.value = true
  try {
    rows.value = await payrollService.getMealInvoices()
  } catch (e) {
    showError(errorText(e, 'Yemek faturaları yüklenemedi.'))
  } finally {
    loading.value = false
  }
}

const replaceRow = (updated) => {
  const i = rows.value.findIndex(r => r.periodId === updated.periodId)
  if (i >= 0) rows.value.splice(i, 1, updated)
}

const keyOf = (r) => periodKey(r.year, r.month)

// ───── fatura no gir / düzenle ─────
const showEdit = ref(false)
const editing = ref(null)
const form = reactive({ invoiceNumber: '', invoiceDate: '' })

const openEdit = (r) => {
  editing.value = r
  form.invoiceNumber = r.invoiceNumber || ''
  form.invoiceDate = r.invoiceDate ? String(r.invoiceDate).slice(0, 10) : ''
  showEdit.value = true
}

const save = async () => {
  if (!editing.value || !form.invoiceNumber.trim() || busy.value) return
  busy.value = true
  try {
    replaceRow(await payrollService.saveMealInvoice(keyOf(editing.value), {
      invoiceNumber: form.invoiceNumber.trim(),
      invoiceDate: form.invoiceDate || null
    }))
    showEdit.value = false
    showSuccess('Yemek faturası kaydedildi; gider oluşturuldu.')
  } catch (e) {
    showError(errorText(e, 'Yemek faturası kaydedilemedi.'))
  } finally {
    busy.value = false
  }
}

// ───── kapat / geri al ─────
const close = async (r) => {
  busy.value = true
  try {
    replaceRow(await payrollService.closeMealInvoice(keyOf(r)))
    showSuccess(`${r.label} yemek gideri kapatıldı.`)
  } catch (e) {
    showError(errorText(e, 'Kapatılamadı.'))
  } finally {
    busy.value = false
  }
}

const reopening = ref(null)
const reopenMessage = computed(() => {
  const r = reopening.value
  if (!r) return ''
  return status(r) === 'Expensed'
    ? `${r.label} yemek faturası (${r.invoiceNumber}) kaldırılacak ve oluşan yemek gideri silinecek. Dönem yeniden "fatura bekliyor" olur.`
    : `${r.label} yeniden "fatura bekliyor" durumuna alınacak.`
})
const askReopen = (r) => { reopening.value = r }

const reopen = async () => {
  const r = reopening.value
  if (!r) return
  busy.value = true
  try {
    replaceRow(await payrollService.reopenMealInvoice(keyOf(r)))
    reopening.value = null
    showSuccess('Geri alındı.')
  } catch (e) {
    showError(errorText(e, 'Geri alınamadı.'))
  } finally {
    busy.value = false
  }
}

onMounted(load)
</script>
