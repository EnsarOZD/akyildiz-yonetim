<template>
  <BaseModal
    :model-value="visible"
    title="YENİ ÜNİTE EKLE"
    icon="🏢"
    size="lg"
    @close="$emit('close')"
  >
    <div class="space-y-8">
      <!-- Form Kısmı -->
      <form @submit.prevent="handleSave" id="flatForm" class="space-y-8">
        
        <!-- Temel Bilgiler Grubu -->
        <div class="space-y-4">
          <div class="flex items-center gap-3 px-1">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 class="text-[11px] font-black uppercase tracking-widest text-[#f1f3f9]">Temel Ünite Bilgileri</h4>
          </div>

          <div class="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Code -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Ünite Kodu (Code) *</span>
                </label>
                <input
                  v-model.trim="flat.code"
                  @input="onCodeInput"
                  class="input input-bordered w-full font-bold !text-lg"
                  placeholder="Örn: A-201, GA, OTOPARK"
                  required
                />
                <div v-if="codeError" class="mt-2 flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-tight">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="3"/></svg>
                  {{ codeError }}
                </div>
                <div v-else class="mt-2 text-[10px] text-[#626885] font-medium leading-relaxed italic">
                  İpucu: <code class="text-brand-400 font-black">A-201</code> yazarsanız kat otomatik 2 alınır.
                </div>
              </div>

              <!-- Type -->
              <div class="form-control">
                <label class="label"><span class="label-text">Ünite Tipi *</span></label>
                <select v-model.number="flat.type" class="select select-bordered w-full font-bold" required>
                  <option :value="0">Normal Kat / Daire</option>
                  <option :value="1">Bina Girişi</option>
                  <option :value="2">Otopark Alanı</option>
                </select>
              </div>

              <!-- FloorNumber -->
              <div class="form-control" v-if="flat.type !== 2">
                <label class="label"><span class="label-text">Kat (Floor) *</span></label>
                <input
                  type="number"
                  v-model.number="flat.floorNumber"
                  :disabled="flat.type === 1"
                  class="input input-bordered w-full font-bold"
                  placeholder="0"
                  required
                />
                <p v-if="flat.type === 1" class="mt-2 text-[10px] text-[#626885] font-bold uppercase italic tracking-tighter">İpucu: Giriş için kat varsayılan 0'dır.</p>
              </div>

              <!-- Alan -->
              <div class="form-control">
                <label class="label"><span class="label-text">Alan (m²) *</span></label>
                <div class="relative">
                  <input type="number" v-model.number="flat.unitArea" min="1" step="0.01" class="input input-bordered w-full font-black !text-lg pr-12" required />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[#626885] font-black uppercase text-[10px] tracking-widest">m²</span>
                </div>
              </div>

              <!-- Mal Sahibi -->
              <div class="md:col-span-2">
                <div class="form-control">
                  <label class="label"><span class="label-text">Mal Sahibi Tanımı</span></label>
                  <select
                    v-model="flat.ownerId"
                    class="select select-bordered w-full font-bold">
                    <option :value="null">— Mal Sahibi Atanmadı —</option>
                    <option v-for="o in owners" :key="o.id" :value="o.id">
                      {{ ownerLabel(o) }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Kira -->
              <div class="form-control">
                <label class="label"><span class="label-text">Aylık Kira Bedeli</span></label>
                <div class="relative">
                  <input type="number" v-model.number="flat.monthlyRent" min="0" step="0.01" class="input input-bordered w-full font-black pr-12" />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[#626885] font-black uppercase text-[10px] tracking-widest">TL</span>
                </div>
              </div>

              <!-- Durum -->
              <div class="form-control justify-center">
                <label class="label cursor-pointer flex justify-start gap-4 p-0">
                  <input type="checkbox" v-model="flat.isActive" class="toggle toggle-success" />
                  <span class="label-text font-black uppercase tracking-widest text-[11px] text-[#9aa0b4]">Aktif Ünite</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Açıklama -->
        <div class="space-y-4">
           <div class="flex items-center gap-3 px-1 text-[#f1f3f9]">
            <h4 class="text-[11px] font-black uppercase tracking-widest">Açıklama ve Notlar</h4>
          </div>
          <div class="form-control">
            <textarea 
              v-model.trim="flat.description" 
              rows="3" 
              class="textarea textarea-bordered w-full !bg-white/[0.02] border-white/[0.08]" 
              placeholder="Ünite hakkında ek notlar girin..."></textarea>
          </div>
        </div>
      </form>
    </div>

    <!-- Footer -->
    <template #footer>
      <button 
        type="button" 
        @click="$emit('close')" 
        class="btn btn-ghost !bg-transparent border border-white/[0.08] text-[#9aa0b4] hover:bg-white/[0.05] flex-1"
      >
        Vazgeç
      </button>
      <button 
        form="flatForm" 
        type="submit" 
        :disabled="saving" 
        class="btn btn-primary flex-1 shadow-lg shadow-brand-500/20"
      >
        <span v-if="saving" class="loading loading-spinner loading-xs mr-2"></span>
        <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
        Üniteyi Kaydet
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
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
  if (!flat.value.code || !flat.value.unitArea) return
  if (flat.value.type !== 2 && (flat.value.floorNumber === null || flat.value.floorNumber === undefined)) return

  saving.value = true
  codeError.value = ''

  try {
    const exists = await flatsService.getFlats({ code: String(flat.value.code).trim().toUpperCase() })
    if (Array.isArray(exists) && exists.length > 0) {
      codeError.value = `Bu kod zaten kullanılıyor: ${flat.value.code}`
      saving.value = false
      return
    }

    const { groupStrategy, groupKey, section } = extractGroupInfo(flat.value.code, Number(flat.value.type))

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
