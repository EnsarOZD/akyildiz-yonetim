<template>
  <BaseModal
    :model-value="visible"
    title="ÜNİTE BİLGİLERİNİ GÜNCELLE"
    icon="✏️"
    size="lg"
    @close="$emit('close')"
  >
    <div v-if="local" class="space-y-8">
      <!-- Form Kısmı -->
      <form @submit.prevent="save" id="editFlatForm" class="space-y-8">
        
        <!-- Temel Bilgiler Grubu -->
        <div class="space-y-4">
          <div class="flex items-center gap-3 px-1">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h4 class="text-[11px] font-black uppercase tracking-widest text-[#f1f3f9]">Kayıt Detayları</h4>
          </div>

          <div class="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Code -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Ünite Kodu (Code) *</span>
                </label>
                <input
                  v-model.trim="local.code"
                  class="input input-bordered w-full font-bold !text-lg"
                  required
                />
              </div>

              <!-- Type -->
              <div class="form-control">
                <label class="label"><span class="label-text">Ünite Tipi *</span></label>
                <select v-model.number="local.type" class="select select-bordered w-full font-bold" required>
                  <option :value="0">Normal Kat / Daire</option>
                  <option :value="1">Bina Girişi</option>
                  <option :value="2">Otopark Alanı</option>
                </select>
              </div>

              <!-- FloorNumber -->
              <div class="form-control" v-if="local.type !== 2">
                <label class="label"><span class="label-text">Kat (Floor) *</span></label>
                <input
                  type="number"
                  v-model.number="local.floorNumber"
                  :disabled="local.type === 1"
                  class="input input-bordered w-full font-bold"
                  required
                />
              </div>

              <!-- Alan -->
              <div class="form-control">
                <label class="label"><span class="label-text">Alan (m²) *</span></label>
                <div class="relative">
                  <input type="number" v-model.number="local.unitArea" min="1" step="0.01" class="input input-bordered w-full font-black !text-lg pr-12" required />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[#626885] font-black uppercase text-[10px] tracking-widest">m²</span>
                </div>
              </div>

              <!-- Aylık Kira -->
              <div class="form-control">
                <label class="label"><span class="label-text">Aylık Kira Bedeli</span></label>
                <div class="relative">
                  <input type="number" v-model.number="local.monthlyRent" min="0" step="0.01" class="input input-bordered w-full font-black pr-12" />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[#626885] font-black uppercase text-[10px] tracking-widest">TL</span>
                </div>
              </div>

              <!-- Mal Sahibi -->
              <div class="md:col-span-2">
                <div class="form-control">
                  <label class="label"><span class="label-text">Mal Sahibi</span></label>
                  <select
                    v-model="local.ownerId"
                    class="select select-bordered w-full font-bold">
                    <option :value="null">— Mal Sahibi Atanmadı —</option>
                    <option v-for="o in owners" :key="o.id" :value="o.id">
                      {{ ownerLabel(o) }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Durum -->
              <div class="form-control justify-center">
                <label class="label cursor-pointer flex justify-start gap-4 p-0">
                  <input type="checkbox" v-model="local.isActive" class="toggle toggle-success" />
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
              v-model.trim="local.description" 
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
        form="editFlatForm" 
        type="submit" 
        class="btn btn-primary flex-1 shadow-lg shadow-brand-500/20"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
        Güncellemeleri Kaydet
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import ownersService from '@/infrastructure/services/ownersService'

const props = defineProps({ flat: Object, visible: Boolean })
const emit = defineEmits(['save', 'close'])

const local = ref(null)
const owners = ref([])

const fetchOwners = async () => {
  try {
    const list = await ownersService.getOwners({ isActive: true })
    owners.value = Array.isArray(list) ? list : []
  } catch (e) {
    console.warn('Mal sahipleri yüklenemedi:', e)
  }
}

const ownerLabel = (o) => {
  const name = o.fullName || [o.firstName, o.lastName].filter(Boolean).join(' ') || 'Mal Sahibi'
  const info = o.phone || o.email || ''
  return info ? `${name} (${info})` : name
}

watch(() => props.flat, (f) => { if (f) local.value = { ...f } }, { immediate: true })
watch(() => props.visible, (v) => { if (v) fetchOwners() })

onMounted(fetchOwners)

watch(() => local.value?.type, (t) => {
  if (!local.value) return
  const n = Number(t)
  if (n === 2) {
    local.value.floorNumber = null
  } else if (n === 1) {
    local.value.floorNumber = 0
  }
})

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

const save = () => {
  if (!local.value) return
  const payload = { ...local.value }
  payload.code = String(payload.code || '').trim().toUpperCase()
  payload.type = Number(payload.type)
  
  const { groupStrategy, groupKey, section } = extractGroupInfo(payload.code, payload.type)
  payload.groupStrategy = groupStrategy
  payload.groupKey = groupKey
  payload.section = section

  emit('save', payload)
}
</script>