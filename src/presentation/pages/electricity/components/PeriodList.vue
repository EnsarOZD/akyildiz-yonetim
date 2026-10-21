<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 class="text-base font-bold text-slate-800">Dönemler</h3>
        <p class="text-sm text-slate-500 mt-1">Fatura dönemleri. Bir dönemi açarak okumaları girin.</p>
      </div>
      <button type="button" class="btn btn-sm btn-primary" @click="openCreate">Yeni Dönem</button>
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <span class="loading loading-spinner loading-md text-brand-500"></span>
    </div>

    <div v-else class="overflow-x-auto border border-slate-200 rounded-xl bg-white">
      <table class="table table-sm">
        <thead>
          <tr>
            <th>Dönem</th>
            <th>Başlangıç</th>
            <th>Bitiş</th>
            <th class="text-right">Gün</th>
            <th>Durum</th>
            <th class="text-right">Hesaplanan Toplam</th>
            <th class="text-right">Kontrol Farkı</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!periods.length">
            <td colspan="8" class="text-center text-slate-400 py-6">Henüz dönem yok.</td>
          </tr>
          <tr v-for="p in periods" :key="p.id" class="hover cursor-pointer" @click="emit('open', p.id)">
            <td class="font-medium">{{ periodLabel(p) }}</td>
            <td>{{ formatDate(p.startDate) }}</td>
            <td>{{ formatDate(p.endDate) }}</td>
            <td class="text-right">{{ p.days }}</td>
            <td>
              <span class="badge badge-sm" :class="p.status === 'Finalized' ? 'badge-success' : 'badge-warning'">
                {{ STATUS_LABELS[p.status] || p.status }}
              </span>
            </td>
            <td class="text-right">{{ formatMoney(p.calculatedTotal) }}</td>
            <td class="text-right" :class="diffClass(p.controlDifference)">
              {{ p.controlDifference === null || p.controlDifference === undefined ? '-' : formatMoney(p.controlDifference) }}
            </td>
            <td class="text-right">
              <button type="button" class="btn btn-ghost btn-xs" @click.stop="emit('open', p.id)">Aç</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Yeni dönem -->
    <div v-if="showForm" class="modal modal-open">
      <div class="modal-box max-w-lg">
        <h3 class="font-bold text-lg mb-4">Yeni Dönem</h3>
        <form class="space-y-4" @submit.prevent="create">
          <div class="grid grid-cols-2 gap-3">
            <label class="form-control w-full">
              <span class="label-text text-sm mb-1">Başlangıç</span>
              <input v-model="form.startDate" type="date" class="input input-bordered input-sm w-full" :required="!periods.length" />
            </label>
            <label class="form-control w-full">
              <span class="label-text text-sm mb-1">Bitiş</span>
              <input v-model="form.endDate" type="date" class="input input-bordered input-sm w-full" required />
            </label>
          </div>
          <p v-if="!periods.length" class="text-xs text-slate-500">İlk dönem için başlangıç tarihi gereklidir.</p>
          <div class="grid grid-cols-3 gap-3">
            <label class="form-control w-full">
              <span class="label-text text-sm mb-1">Borç Ayı</span>
              <select v-model.number="form.debtMonth" class="select select-bordered select-sm w-full">
                <option v-for="m in 12" :key="m" :value="m">{{ String(m).padStart(2, '0') }}</option>
              </select>
            </label>
            <label class="form-control w-full">
              <span class="label-text text-sm mb-1">Borç Yılı</span>
              <input v-model.number="form.debtYear" type="number" min="2000" max="2100" step="1" class="input input-bordered input-sm w-full" required />
            </label>
            <label class="form-control w-full">
              <span class="label-text text-sm mb-1">Son Ödeme</span>
              <input v-model="form.dueDate" type="date" class="input input-bordered input-sm w-full" required />
            </label>
          </div>

          <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

          <div class="modal-action">
            <button type="button" class="btn btn-sm btn-ghost" :disabled="saving" @click="closeForm">Vazgeç</button>
            <button type="submit" class="btn btn-sm btn-primary" :disabled="saving">
              <span v-if="saving" class="loading loading-spinner loading-xs"></span>
              Oluştur
            </button>
          </div>
        </form>
      </div>
      <div class="modal-backdrop" @click="closeForm"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import electricityService from '@/infrastructure/services/electricityService'
import { useNotification } from '@/application/composables/useNotification'
import { STATUS_LABELS, dateOnly, formatDate, formatMoney, periodLabel, errorText } from '../electricityHelpers'

const emit = defineEmits(['open'])
const { showSuccess, showError } = useNotification()

const periods = ref([])
const loading = ref(true)
const showForm = ref(false)
const saving = ref(false)
const formError = ref('')
const form = ref(emptyForm())

function emptyForm() {
  const now = new Date()
  return { startDate: '', endDate: '', debtMonth: now.getMonth() + 1, debtYear: now.getFullYear(), dueDate: '' }
}

const diffClass = (v) => {
  if (v === null || v === undefined) return 'text-slate-400'
  return Math.abs(Number(v)) > 1 ? 'text-red-600 font-medium' : 'text-emerald-600'
}

const load = async () => {
  loading.value = true
  try {
    const list = await electricityService.getPeriods()
    periods.value = Array.isArray(list) ? list : []
  } catch (e) {
    periods.value = []
    showError(errorText(e, 'Dönemler yüklenemedi.'))
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  // Liste en yeni başta: başlangıç = önceki dönemin bitişi (düzenlenebilir)
  const latest = periods.value.reduce((acc, p) => (!acc || dateOnly(p.endDate) > dateOnly(acc.endDate) ? p : acc), null)
  form.value = { ...emptyForm(), startDate: latest ? dateOnly(latest.endDate) : '' }
  formError.value = ''
  showForm.value = true
}

const closeForm = () => {
  if (saving.value) return
  showForm.value = false
}

const create = async () => {
  formError.value = ''
  const f = form.value
  if (f.startDate && f.endDate && f.endDate <= f.startDate) {
    formError.value = 'Dönem bitiş tarihi başlangıçtan sonra olmalıdır.'
    return
  }
  saving.value = true
  try {
    const created = await electricityService.createPeriod({
      startDate: f.startDate || null,
      endDate: f.endDate,
      debtYear: Number(f.debtYear),
      debtMonth: Number(f.debtMonth),
      dueDate: f.dueDate
    })
    showSuccess('Dönem oluşturuldu.')
    showForm.value = false
    await load()
    if (created?.id) emit('open', created.id)
  } catch (e) {
    formError.value = errorText(e, 'Dönem oluşturulamadı.')
  } finally {
    saving.value = false
  }
}

onMounted(load)

defineExpose({ reload: load })
</script>
