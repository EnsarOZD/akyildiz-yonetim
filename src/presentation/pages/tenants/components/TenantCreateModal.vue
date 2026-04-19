<template>
  <BaseModal
    :model-value="visible"
    title="YENİ İŞ YERİ KİRACISI EKLE"
    icon="🏢"
    size="lg"
    @close="handleClose"
  >
    <div class="space-y-8">
      <!-- Form Bilgileri -->
      <form @submit.prevent="handleSave" id="tenantForm" class="space-y-10">
        
        <!-- 1. İş Yeri Bilgileri -->
        <div class="space-y-4">
          <div class="flex items-center gap-3 px-1">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h4 class="text-[11px] font-black uppercase tracking-widest text-[#f1f3f9]">İş Yeri Bilgileri</h4>
          </div>

          <div class="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control md:col-span-2">
                <label class="label">
                  <span class="label-text">Şirket Resmi Adı *</span>
                </label>
                <input
                  v-model="tenant.companyName"
                  class="input input-bordered w-full font-bold !text-lg"
                  :class="{'border-red-500/50 bg-red-500/5': formErrors.companyName}"
                  placeholder="Örn: ABC Ticaret Ltd. Şti."
                />
                <p v-if="formErrors.companyName" class="text-red-400 text-[10px] font-bold uppercase tracking-tight mt-2 italic">{{ formErrors.companyName }}</p>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Sektör / İş Türü *</span>
                </label>
                <select
                  v-model="tenant.businessType"
                  class="select select-bordered w-full font-bold"
                  :class="{'border-red-500/50': formErrors.businessType}"
                >
                  <option value="">Seçiniz...</option>
                  <option value="Ticaret">Ticaret</option>
                  <option value="Hizmet">Hizmet</option>
                  <option value="Üretim">Üretim</option>
                  <option value="Ofis">Ofis</option>
                  <option value="Depo">Depo</option>
                  <option value="Diğer">Diğer</option>
                </select>
                <p v-if="formErrors.businessType" class="text-red-400 text-[10px] font-bold uppercase tracking-tight mt-2 italic">{{ formErrors.businessType }}</p>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">V.K.N. / T.C. Kimlik No *</span>
                </label>
                <input
                  v-model="tenant.identityNumber"
                  class="input input-bordered w-full font-bold tracking-widest"
                  :class="{'border-red-500/50': formErrors.identityNumber}"
                  placeholder="10 veya 11 Haneli No"
                  type="text"
                  inputmode="numeric"
                />
                <p v-if="formErrors.identityNumber" class="text-red-400 text-[10px] font-bold uppercase tracking-tight mt-2 italic">{{ formErrors.identityNumber }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. İletişim Kişisi -->
        <div class="space-y-4">
          <div class="flex items-center gap-3 px-1">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 class="text-[11px] font-black uppercase tracking-widest text-[#f1f3f9]">Yetkili İletişim Bilgileri</h4>
          </div>

          <div class="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label"><span class="label-text">Yetkili Ad Soyad *</span></label>
                <input v-model="tenant.contactPersonName" class="input input-bordered w-full font-bold" placeholder="Ahmet Yılmaz" required />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text">İletişim Telefonu *</span></label>
                <input v-model="tenant.contactPersonPhone" class="input input-bordered w-full font-bold" placeholder="+90 (5XX) XXX XX XX" required />
              </div>
              <div class="form-control md:col-span-2">
                <label class="label"><span class="label-text">E-posta Adresi</span></label>
                <input type="email" v-model="tenant.contactPersonEmail" class="input input-bordered w-full font-medium" placeholder="ornek@email.com" />
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Ünite Atama -->
        <div class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 font-bold text-xs">📍</div>
              <h4 class="text-[11px] font-black uppercase tracking-widest text-[#f1f3f9]">Ünite ve Kat Ataması</h4>
            </div>
            <button type="button" class="text-[10px] font-black text-brand-400 uppercase tracking-widest hover:text-brand-300 transition-colors" @click="resetFloorFilter">Filtreleri Temizle</button>
          </div>

          <div class="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <div class="grid grid-cols-1 gap-6">
              <div class="form-control">
                <label class="label"><span class="label-text">Kat Filtresi (Opsiyonel)</span></label>
                <select v-model="tenant.floorNumber" @change="onFloorChange" class="select select-bordered w-full font-bold">
                  <option :value="null">Tüm Katlar</option>
                  <option v-for="floor in availableFloors" :key="floor" :value="floor">{{ floor }}. Kat</option>
                </select>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Ünite Seçimi (Çoklu Seçilebilir)</span>
                  <span class="label-text-alt text-[10px] font-bold text-brand-400/80 uppercase tracking-tighter">Ctrl / Cmd + Tık</span>
                </label>
                <select
                  multiple
                  v-model="tenant.selectedFlatIds"
                  class="select select-bordered w-full h-48 !bg-white/[0.01] border-white/[0.1] font-bold scrollbar-thin scrollbar-thumb-white/[0.1]"
                >
                  <option v-for="flat in availableFlatsForTenant" :key="flat.id" :value="flat.id" class="py-2.5 px-4 hover:bg-brand-500/10 border-b border-white/[0.03] transition-colors">
                    {{ flatOptionLabel(flat) }}
                  </option>
                </select>
                <p class="mt-3 text-[10px] text-[#626885] font-bold uppercase italic tracking-tight leading-relaxed">
                  💡 Ünite seçmezseniz, sistem seçilen kattaki ilk uygun üniteyi otomatik atayacaktır.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Finansal Detaylar -->
        <div class="space-y-4">
          <div class="flex items-center gap-3 px-1">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 font-bold text-xs">💰</div>
            <h4 class="text-[11px] font-black uppercase tracking-widest text-[#f1f3f9]">Finansal Bilgiler</h4>
          </div>

          <div class="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-control">
              <label class="label"><span class="label-text">Başlangıç Aylık Aidatı</span></label>
              <div class="relative">
                <input type="number" v-model.number="tenant.monthlyAidat" class="input input-bordered w-full font-black text-lg pr-12" placeholder="0" min="0" step="0.01" required />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[#626885] font-black text-[10px] uppercase tracking-widest">TL</span>
              </div>
            </div>

            <div class="form-control justify-center">
              <label class="label cursor-pointer flex justify-start gap-4 p-0">
                <input type="checkbox" v-model="tenant.isActive" class="toggle toggle-success" />
                <span class="label-text font-black uppercase tracking-widest text-[11px] text-[#9aa0b4]">Aktif Üyelik</span>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Footer -->
    <template #footer>
      <button 
        type="button" 
        @click="handleClose" 
        class="btn btn-ghost !bg-transparent border border-white/[0.08] text-[#9aa0b4] hover:bg-white/[0.05] flex-1"
      >
        Vazgeç
      </button>
      <button 
        form="tenantForm" 
        type="submit" 
        class="btn btn-primary flex-1 shadow-lg shadow-brand-500/20 uppercase tracking-widest font-black"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
        Kaydı Tamamla
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import { useNotify } from '@/application/composables/useNotify'
import tenantsService from '@/infrastructure/services/tenantsService.js'
import { useEventBus } from '@/application/composables/useEventBus'
import { useDirtyGuard } from '@/application/composables/useDirtyGuard'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['save', 'close'])
const { on: onEvent } = useEventBus()
const { notifyError } = useNotify()

function emptyTenant () {
  return {
    companyName: '',
    businessType: '',
    identityNumber: '',
    contactPersonName: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
    flatId: '',
    selectedFlatIds: [],
    floorNumber: null,
    monthlyAidat: 0,
    isActive: true
  }
}

const availableFlats = ref([])
const tenant = ref(emptyTenant())

const { isDirty, resetDirty } = useDirtyGuard(() => tenant.value)
defineExpose({ isDirty, resetDirty })

const UNIT_TYPE = { 0: 'Kat', 1: 'Giriş', 2: 'Otopark' }
const typeLabel = (t) => UNIT_TYPE[t] ?? 'Bilinmiyor'
const flatOptionLabel = (f) => {
  const base = `${f.code} — ${Number(f.unitArea || 0)}m²`
  return (f.floorNumber !== null && f.floorNumber !== undefined) 
    ? `${base} (${f.floorNumber}. Kat)` 
    : `${base} (${typeLabel(f.type)})`
}

const availableFloors = computed(() => {
  const set = new Set((availableFlats.value || []).map(f => f.floorNumber).filter(f => f !== null && f !== undefined))
  return Array.from(set).sort((a,b) => a - b)
})

const availableFlatsForTenant = computed(() => {
  const floor = tenant.value.floorNumber
  if (floor === null || floor === undefined) return availableFlats.value || []
  return (availableFlats.value || []).filter(f => f.floorNumber === floor)
})

async function fetchAvailableFlats (floorFilter) {
  try {
    const list = await tenantsService.getAvailableFlats(floorFilter != null ? { floor: floorFilter } : {})
    availableFlats.value = Array.isArray(list) ? list.map(f => ({
      id: f.id,
      code: f.code ?? f.unitNumber ?? '',
      unitArea: f.unitArea ?? 0,
      floorNumber: f.floorNumber ?? f.floor ?? null,
      type: f.type,
      isOccupied: !!f.isOccupied,
    })) : []
  } catch (e) {
    availableFlats.value = []
  }
}

function onFloorChange () {
  tenant.value.selectedFlatIds = []
  fetchAvailableFlats(tenant.value.floorNumber)
}

function resetFloorFilter () {
  tenant.value.floorNumber = null
  onFloorChange()
}

watch(() => props.visible, (v) => { if (v) { tenant.value = emptyTenant(); fetchAvailableFlats(); resetDirty(); } })

onMounted(() => {
  if (props.visible) fetchAvailableFlats()
  onEvent('tenant:deleted', () => fetchAvailableFlats(tenant.value.floorNumber))
})

const formErrors = ref({})
function validateForm () {
  const errs = {}
  if (!tenant.value.companyName?.trim()) errs.companyName = 'Şirket adı zorunludur.'
  if (!tenant.value.businessType) errs.businessType = 'İş türü seçilmelidir.'
  if (!tenant.value.identityNumber?.trim()) errs.identityNumber = 'Kimlik/Vergi numarası zorunludur.'
  formErrors.value = errs
  return Object.keys(errs).length === 0
}

function handleClose () {
  tenant.value = emptyTenant()
  resetDirty()
  emit('close')
}

function handleSave () {
  if (!validateForm()) return
  const ids = (tenant.value.selectedFlatIds || []).filter(Boolean)
  if (ids.length === 0 && tenant.value.floorNumber === null) {
    notifyError('Lütfen en az bir ünite seçin veya kat filtresi belirleyin.')
    return
  }
  const payload = {
    ...tenant.value,
    companyName: tenant.value.companyName.trim(),
    identityNumber: tenant.value.identityNumber.trim(),
    contactPersonName: tenant.value.contactPersonName.trim(),
    contactPersonPhone: tenant.value.contactPersonPhone.trim(),
    flatIds: ids.length > 1 ? ids : undefined,
    flatId: ids.length === 1 ? ids[0] : (tenant.value.flatId || null),
  }
  emit('save', payload)
}
</script>
