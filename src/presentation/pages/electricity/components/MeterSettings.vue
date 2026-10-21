<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 class="text-base font-bold text-slate-800">Sayaçlar</h3>
        <p class="text-sm text-slate-500 mt-1">
          Daire, ortak alan ve mescit sayaçları. Daire sayaçları bir veya birden fazla üniteye oranla bağlanır.
        </p>
      </div>
      <button v-if="canEdit" type="button" class="btn btn-sm btn-primary" @click="openCreate">Sayaç Ekle</button>
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <span class="loading loading-spinner loading-md text-brand-500"></span>
    </div>

    <div v-else class="overflow-x-auto border border-slate-200 rounded-xl bg-white">
      <table class="table table-sm">
        <thead>
          <tr>
            <th>Sıra</th>
            <th>Ad</th>
            <th>Tür</th>
            <th>Bağlı Üniteler</th>
            <th>Havuz Payı</th>
            <th>Durum</th>
            <th v-if="canEdit"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!meters.length">
            <td :colspan="canEdit ? 7 : 6" class="text-center text-slate-400 py-6">Henüz sayaç yok.</td>
          </tr>
          <tr v-for="m in sortedMeters" :key="m.id" :class="{ 'opacity-60': !m.isActive }">
            <td>{{ m.sortOrder }}</td>
            <td class="font-medium">{{ m.name }}</td>
            <td>{{ kindLabel(m.kind) }}</td>
            <td>{{ unitsText(m) }}</td>
            <td>{{ m.sharesCommonPool ? 'Evet' : 'Hayır' }}</td>
            <td>
              <span class="badge badge-sm" :class="m.isActive ? 'badge-success' : 'badge-ghost'">{{ m.isActive ? 'Aktif' : 'Pasif' }}</span>
            </td>
            <td v-if="canEdit" class="whitespace-nowrap text-right">
              <button type="button" class="btn btn-ghost btn-xs" @click="openEdit(m)">Düzenle</button>
              <button type="button" class="btn btn-ghost btn-xs text-red-600" @click="askDelete(m)">Sil</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Ekle / düzenle formu -->
    <div v-if="showForm" class="modal modal-open">
      <div class="modal-box max-w-xl">
        <h3 class="font-bold text-lg mb-4">{{ editingId ? 'Sayacı Düzenle' : 'Yeni Sayaç' }}</h3>
        <form class="space-y-4" @submit.prevent="save">
          <label class="form-control w-full">
            <span class="label-text text-sm mb-1">Ad</span>
            <input v-model="form.name" type="text" maxlength="100" class="input input-bordered input-sm w-full" required />
          </label>

          <div class="grid grid-cols-2 gap-3">
            <label class="form-control w-full">
              <span class="label-text text-sm mb-1">Tür</span>
              <select v-model="form.kind" class="select select-bordered select-sm w-full">
                <option v-for="k in KINDS" :key="k.value" :value="k.value">{{ k.label }}</option>
              </select>
            </label>
            <label class="form-control w-full">
              <span class="label-text text-sm mb-1">Sıra</span>
              <input v-model.number="form.sortOrder" type="number" step="1" class="input input-bordered input-sm w-full" />
            </label>
          </div>

          <div class="flex flex-wrap gap-6">
            <label class="label cursor-pointer gap-2 justify-start">
              <input v-model="form.sharesCommonPool" type="checkbox" class="checkbox checkbox-sm" />
              <span class="label-text">Ortak havuza pay verir</span>
            </label>
            <label class="label cursor-pointer gap-2 justify-start">
              <input v-model="form.isActive" type="checkbox" class="checkbox checkbox-sm" />
              <span class="label-text">Aktif</span>
            </label>
          </div>

          <div v-if="form.kind === 'Unit'" class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Bağlı üniteler</span>
              <button type="button" class="btn btn-xs btn-outline" @click="addUnitRow">Ünite Ekle</button>
            </div>
            <p v-if="!form.units.length" class="text-xs text-slate-400">Henüz ünite eklenmedi.</p>
            <div v-for="(row, i) in form.units" :key="i" class="flex items-center gap-2">
              <select v-model="row.flatId" class="select select-bordered select-sm flex-1">
                <option value="" disabled>Ünite seçin</option>
                <option v-for="f in flats" :key="f.id" :value="f.id">{{ f.code }}</option>
              </select>
              <div class="flex items-center gap-1">
                <input v-model.number="row.percent" type="number" min="0" max="100" step="any" class="input input-bordered input-sm w-20" />
                <span class="text-sm text-slate-500">%</span>
              </div>
              <button type="button" class="btn btn-ghost btn-xs text-red-600" @click="form.units.splice(i, 1)">Kaldır</button>
            </div>
            <p v-if="form.units.length" class="text-sm" :class="totalOk ? 'text-slate-600' : 'text-red-600'">Toplam: %{{ totalPercent }}</p>
          </div>

          <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

          <div class="modal-action">
            <button type="button" class="btn btn-sm btn-ghost" :disabled="saving" @click="closeForm">Vazgeç</button>
            <button type="submit" class="btn btn-sm btn-primary" :disabled="saving || !form.name.trim()">
              <span v-if="saving" class="loading loading-spinner loading-xs"></span>
              Kaydet
            </button>
          </div>
        </form>
      </div>
      <div class="modal-backdrop" @click="closeForm"></div>
    </div>

    <ConfirmModal
      :isOpen="!!toDelete"
      title="Sayaç Silinecek"
      :message="`'${toDelete?.name}' sayacını silmek istediğinizden emin misiniz?`"
      confirmLabel="Evet, Sil"
      confirmClass="btn-error"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import electricityService from '@/infrastructure/services/electricityService'
import flatsService from '@/infrastructure/services/flatsService'
import { useAuthStore } from '@/application/stores/auth'
import { useNotification } from '@/application/composables/useNotification'
import ConfirmModal from '@/presentation/components/common/ConfirmModal.vue'

const KINDS = [
  { value: 'Unit', label: 'Daire' },
  { value: 'CommonArea', label: 'Ortak Alan' },
  { value: 'Mescit', label: 'Mescit' }
]

const authStore = useAuthStore()
const { showSuccess, showError } = useNotification()

// dataentry salt okur
const canEdit = computed(() => ['admin', 'manager'].includes((authStore.role || '').toLowerCase()))

const meters = ref([])
const flats = ref([])
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const showForm = ref(false)
const editingId = ref(null)
const formError = ref('')
const toDelete = ref(null)
const form = ref(emptyForm())

function emptyForm() {
  return { name: '', kind: 'Unit', sortOrder: 1, sharesCommonPool: true, isActive: true, units: [] }
}

const sortedMeters = computed(() =>
  [...meters.value].sort((a, b) => (a.sortOrder - b.sortOrder) || String(a.name).localeCompare(String(b.name), 'tr-TR'))
)

const totalPercent = computed(() =>
  Number(form.value.units.reduce((sum, u) => sum + (Number(u.percent) || 0), 0).toFixed(4))
)
const totalOk = computed(() => Math.abs(totalPercent.value - 100) <= 0.01)

const kindLabel = (k) => KINDS.find(x => x.value === k)?.label || k

const formatPercent = (ratio) => `%${Number((Number(ratio) * 100).toFixed(4))}`

const unitsText = (m) => {
  if (m.kind !== 'Unit' || !m.units?.length) return '-'
  return m.units.map(u => `${u.flatCode} ${formatPercent(u.ratio)}`).join(', ')
}

const errorText = (e, fallback) => {
  // Backend doğrulama hatası (400) düz metin döner
  const data = e?.response?.data
  return typeof data === 'string' && data.trim() ? data : (e?.message || fallback)
}

const load = async () => {
  loading.value = true
  try {
    const list = await electricityService.getMeters()
    meters.value = Array.isArray(list) ? list : []
  } catch (e) {
    meters.value = []
    showError(errorText(e, 'Sayaçlar yüklenemedi.'))
  } finally {
    loading.value = false
  }
}

const loadFlats = async () => {
  try {
    const list = await flatsService.getFlats({})
    flats.value = (Array.isArray(list) ? list : [])
      .slice()
      .sort((a, b) => String(a.code).localeCompare(String(b.code), 'tr-TR', { numeric: true }))
  } catch (e) {
    flats.value = []
    showError('Ünite listesi yüklenemedi.')
  }
}

const openCreate = () => {
  const max = meters.value.reduce((m, x) => Math.max(m, Number(x.sortOrder) || 0), 0)
  form.value = { ...emptyForm(), sortOrder: max + 1 }
  editingId.value = null
  formError.value = ''
  showForm.value = true
}

const openEdit = (m) => {
  form.value = {
    name: m.name,
    kind: m.kind,
    sortOrder: m.sortOrder,
    sharesCommonPool: !!m.sharesCommonPool,
    isActive: !!m.isActive,
    units: (m.units || []).map(u => ({ flatId: u.flatId, percent: Number((Number(u.ratio) * 100).toFixed(4)) }))
  }
  editingId.value = m.id
  formError.value = ''
  showForm.value = true
}

const closeForm = () => {
  if (saving.value) return
  showForm.value = false
}

const addUnitRow = () => {
  form.value.units.push({ flatId: '', percent: 100 })
}

const save = async () => {
  formError.value = ''
  const f = form.value
  if (f.kind === 'Unit') {
    if (f.units.some(u => !u.flatId)) { formError.value = 'Her satırda ünite seçilmelidir.'; return }
    if (f.units.some(u => u.percent === '' || u.percent === null || !Number.isFinite(Number(u.percent)))) {
      formError.value = 'Oran girilmelidir.'; return
    }
  }
  const body = {
    name: f.name.trim(),
    kind: f.kind,
    sortOrder: Number(f.sortOrder) || 0,
    sharesCommonPool: f.sharesCommonPool,
    isActive: f.isActive,
    // Oran arayüzde yüzde, sunucuya 0-1 aralığında gider
    units: f.kind === 'Unit'
      ? f.units.map(u => ({ flatId: u.flatId, ratio: Math.round(Number(u.percent) * 1e4) / 1e6 }))
      : []
  }
  saving.value = true
  try {
    if (editingId.value) await electricityService.updateMeter(editingId.value, body)
    else await electricityService.createMeter(body)
    showSuccess('Sayaç kaydedildi.')
    showForm.value = false
    await load()
  } catch (e) {
    formError.value = errorText(e, 'Sayaç kaydedilemedi.')
  } finally {
    saving.value = false
  }
}

const askDelete = (m) => { toDelete.value = m }

const confirmDelete = async () => {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await electricityService.deleteMeter(toDelete.value.id)
    showSuccess('Sayaç silindi.')
    toDelete.value = null
    await load()
  } catch (e) {
    showError(errorText(e, 'Sayaç silinemedi.'))
    toDelete.value = null
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  load()
  loadFlats()
})
</script>
