<template>
  <dialog id="createFlatModal" class="modal" :open="visible">
    <div class="modal-box max-w-4xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-white/[0.07] shadow-2xl">
      <!-- Başlık -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/[0.07] mb-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-[#f1f3f9] flex items-center gap-2">
          <span class="text-2xl">🏢</span>
          Yeni Ünite Ekle
        </h3>
        <button @click="$emit('close')" class="btn btn-sm btn-ghost text-gray-500 hover:text-gray-700 dark:text-[#9aa0b4] dark:hover:text-gray-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <div class="overflow-y-auto max-h-[70vh] pr-2">
        <form @submit.prevent="handleSave" id="flatForm" class="space-y-6">

          <!-- Temel Bilgiler -->
          <div class="card bg-base-200 p-4">
            <h4 class="text-lg font-semibold mb-4 text-gray-700 dark:text-[#f1f3f9]">📋 Temel Bilgiler</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Code -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Ünite Kodu (Code) *</span>
                </label>
                <input
                  v-model.trim="flat.code"
                  @input="onCodeInput"
                  class="input input-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-800 dark:text-[#f1f3f9] focus:border-brand-500 dark:focus:border-brand-400"
                  placeholder="Örn: A-201, 3A, GA, OTOPARK"
                  required
                />
                <label v-if="codeError" class="label">
                  <span class="label-text-alt text-error">{{ codeError }}</span>
                </label>
                <small class="text-xs text-gray-500">
                  İpucu: <code>A-201</code> yazarsanız kat otomatik <b>2</b> alınır. <code>GA</code> giriş-A bölümü anlamına gelir.
                </small>
              </div>

              <!-- Type (0:Floor, 1:Entry, 2:Parking) -->
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Tip *</span></label>
                <select v-model.number="flat.type" class="select select-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-800 dark:text-[#f1f3f9] focus:border-brand-500 dark:focus:border-brand-400" required>
                  <option :value="0">Kat</option>
                  <option :value="1">Giriş</option>
                  <option :value="2">Otopark</option>
                </select>
              </div>

              <!-- FloorNumber (Parking değilse) -->
              <div class="form-control" v-if="flat.type !== 2">
                <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Kat (FloorNumber) *</span></label>
                <input
                  type="number"
                  v-model.number="flat.floorNumber"
                  :disabled="flat.type === 1"
                  class="input input-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-800 dark:text-[#f1f3f9] focus:border-brand-500 dark:focus:border-brand-400"
                  placeholder="Örn: 3"
                  required
                />
                <small v-if="flat.type === 1" class="text-xs text-gray-500">Giriş için kat = 0 kabul edilir.</small>
              </div>

              <!-- Alan -->
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Alan (m²) *</span></label>
                <input type="number" v-model.number="flat.unitArea" min="1" step="0.01" class="input input-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-800 dark:text-[#f1f3f9] focus:border-brand-500 dark:focus:border-brand-400" required />
              </div>


              <!-- Mal Sahibi (Owner) -->
              <div class="md:col-span-2">
                <div class="form-control">
                  <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Mal Sahibi (opsiyonel)</span></label>

                  <select
                    v-model="flat.ownerId"
                    class="select select-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-800 dark:text-[#f1f3f9] focus:border-brand-500 dark:focus:border-brand-400">
                    <option :value="null">— Seçilmedi —</option>
                    <option v-for="o in owners" :key="o.id" :value="o.id">
                      {{ ownerLabel(o) }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Kira / Hisse -->
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Aylık Kira</span></label>
                <input type="number" v-model.number="flat.monthlyRent" min="0" step="0.01" class="input input-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-800 dark:text-[#f1f3f9]" />
              </div>

              <!-- Durum -->
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Aktif Ünite</span>
                  <input type="checkbox" v-model="flat.isActive" class="toggle toggle-success" />
                </label>
              </div>
            </div>
          </div>

          <!-- Açıklama -->
          <div class="form-control">
            <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Açıklama</span></label>
            <textarea v-model.trim="flat.description" rows="3" class="textarea textarea-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1] text-gray-800 dark:text-[#f1f3f9]" placeholder="Kısa bir açıklama girin (zorunlu)"></textarea>
          </div>
        </form>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/[0.07] mt-6">
        <button type="button" @click="$emit('close')" class="btn btn-outline border-gray-300 dark:border-white/[0.1] text-gray-700 dark:text-[#f1f3f9] hover:bg-gray-50 dark:hover:bg-white/[0.06]">
          İptal
        </button>
        <button form="flatForm" type="submit" :disabled="saving" class="btn btn-success bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 text-white shadow-lg">
          <span v-if="saving" class="loading loading-spinner mr-2"></span>
          Kaydet
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import flatsService from '@/infrastructure/services/flatsService'
import ownersService from '@/infrastructure/services/ownersService'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['save', 'close'])

const saving = ref(false)
const codeError = ref('')

const emptyFlat = () => ({
  code: '',
  type: 0,            // 0: Floor, 1: Entry, 2: Parking
  floorNumber: null,
  unitArea: 0,
  ownerId: null,
  monthlyRent: 0,
  isActive: true,
  description: ''
})
const flat = ref(emptyFlat())

// ---- Owner listesi
const owners = ref([])

const fetchOwners = async (q = '') => {
  try {
    const list = await ownersService.getOwners({ searchTerm: q, isActive: true })
    owners.value = Array.isArray(list) ? list : []
  } catch (e) {
    console.warn('Mal sahipleri yüklenemedi:', e)
    owners.value = []
  }
}
const ownerLabel = (o) => {
  const name = o.fullName || [o.firstName, o.lastName].filter(Boolean).join(' ') || 'Mal Sahibi'
  const info = o.phone || o.email || ''
  return info ? `${name} (${info})` : name
}
const debouncedOwnerQuery = () => {
  fetchOwners()
}

// ---- Görünürlük
watch(() => props.visible, v => {
  if (v) {
    flat.value = emptyFlat()
    codeError.value = ''
    fetchOwners()
  }
})


// ---- Type değişince bağlı alanları senkronla
watch(() => flat.value.type, (t) => {
  if (t === 2) {           // Parking
    flat.value.floorNumber = null
  } else if (t === 1) {    // Entry
    flat.value.floorNumber = 0
  }
})

// ---- Code içinden otomatik doldurma (akıllı tahmin)
function onCodeInput () {
  codeError.value = ''
  const raw = (flat.value.code || '').trim().toUpperCase()
  flat.value.code = raw
  if (!raw) return

  // 1) OTOPARK
  if (raw.startsWith('OTOPARK') || raw === 'P' || raw === 'PARK') {
    flat.value.type = 2
    flat.value.floorNumber = null
    return
  }

  // 2) Giriş (G + section)
  const mEntry = raw.match(/^G([A-Z])$/)
  if (mEntry) {
    flat.value.type = 1
    flat.value.floorNumber = 0
    return
  }

  // 3) "3A" gibi (kat + bölüm)
  const mFloorSect = raw.match(/^(\d{1,2})([A-Z])$/)
  if (mFloorSect) {
    flat.value.type = 0
    flat.value.floorNumber = parseInt(mFloorSect[1], 10)
    return
  }

  // 4) "A-201" gibi
  const mA201 = raw.match(/^([A-Z])[- ]?(\d{3,})$/)
  if (mA201) {
    const num = parseInt(mA201[2], 10)
    const floor = Math.floor(num / 100)
    flat.value.type = 0
    flat.value.floorNumber = isFinite(floor) ? floor : null
    return
  }

  // 5) "201" gibi
  const mDigits = raw.match(/^(\d{3,})$/)
  if (mDigits) {
    const num = parseInt(mDigits[1], 10)
    flat.value.type = 0
    flat.value.floorNumber = Math.floor(num / 100)
  }
}

function extractGroupInfo(code, type) {
  const raw = String(code || '').trim().toUpperCase()
  if (type === 1) { // Entry
    const m = raw.match(/^G([A-Z])$/)
    return {
      groupStrategy: 1, // SplitIfMultiple
      groupKey: 'G', 
      section: m ? m[1] : null
    }
  }
  if (type === 0) { // Floor
    const m = raw.match(/^(\d{1,2})([A-Z])$/)
    if (m) {
      return {
        groupStrategy: 1, // SplitIfMultiple
        groupKey: m[1],
        section: m[2]
      }
    }
  }
  return {
    groupStrategy: 0, // None
    groupKey: null,
    section: null
  }
}

// ---- Kaydet
async function handleSave () {
  // basit alan kontrolleri
  if (!flat.value.code || !flat.value.unitArea) return
  if (flat.value.type !== 2 && (flat.value.floorNumber === null || flat.value.floorNumber === undefined)) return

  saving.value = true
  codeError.value = ''

  try {
    // 1) benzersizlik kontrolü
    const exists = await flatsService.getFlats({ code: String(flat.value.code).trim().toUpperCase() })
    if (Array.isArray(exists) && exists.length > 0) {
      codeError.value = `Bu kod zaten kullanılıyor: ${flat.value.code}`
      saving.value = false
      return
    }

    const { groupStrategy, groupKey, section } = extractGroupInfo(flat.value.code, Number(flat.value.type))

    // 2) payload
    const payload = {
      code: String(flat.value.code || '').trim().toUpperCase(),
      type: Number(flat.value.type),                     // 0/1/2
      floorNumber: flat.value.type === 1 ? 0 : (flat.value.type === 2 ? null : flat.value.floorNumber),
      unitArea: Number(flat.value.unitArea || 0),
      ownerId: flat.value.ownerId || null,
      monthlyRent: flat.value.monthlyRent ? Number(flat.value.monthlyRent) : null,
      isActive: !!flat.value.isActive,
      description: (flat.value.description?.trim() || `Oluşturan: UI (${new Date().toLocaleString('tr-TR')})`),
      groupStrategy,
      groupKey,
      section
    }

    emit('save', payload)
    flat.value = emptyFlat()
  } finally {
    saving.value = false
  }
}
</script>
