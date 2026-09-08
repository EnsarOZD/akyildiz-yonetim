<template>
  <BaseModal
    :model-value="visible"
    title="KİRACI BİLGİLERİNİ GÜNCELLE"
    icon="✏️"
    size="lg"
    @close="handleClose"
  >
    <div v-if="form" class="space-y-8">
      <!-- Form Bilgileri -->
      <form @submit.prevent="save" id="editTenantForm" class="space-y-10">
        
        <!-- 1. İş Yeri Bilgileri -->
        <div class="space-y-4">
          <div class="flex items-center gap-3 px-1">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h4 class="text-[11px] font-black uppercase tracking-widest text-[#16283a]">Resmi Kayıt Bilgileri</h4>
          </div>

          <div class="bg-[#f6fafd] border border-[#d9e7f2] rounded-2xl p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control md:col-span-2">
                <label class="label"><span class="label-text">Şirket Resmi Adı *</span></label>
                <input v-model="form.companyName" class="input input-bordered w-full font-bold !text-lg" required />
              </div>

              <div class="form-control">
                <label class="label"><span class="label-text">Sektör / İş Türü *</span></label>
                <select v-model="form.businessType" class="select select-bordered w-full font-bold" required>
                  <option value="">Seçiniz...</option>
                  <option value="Ticaret">Ticaret</option>
                  <option value="Hizmet">Hizmet</option>
                  <option value="Üretim">Üretim</option>
                  <option value="Ofis">Ofis</option>
                  <option value="Depo">Depo</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div class="form-control">
                <label class="label"><span class="label-text">V.K.N. / T.C. Kimlik No *</span></label>
                <input
                  v-model="form.identityNumber"
                  class="input input-bordered w-full font-bold tracking-widest"
                  placeholder="TC veya Vergi No"
                  inputmode="numeric"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 2. İletişim Kişisi -->
        <div class="space-y-4">
          <div class="flex items-center gap-3 px-1">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 class="text-[11px] font-black uppercase tracking-widest text-[#16283a]">Güncel İletişim Bilgileri</h4>
          </div>

          <div class="bg-[#f6fafd] border border-[#d9e7f2] rounded-2xl p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label"><span class="label-text">Yetkili Ad Soyad *</span></label>
                <input v-model="form.contactPersonName" class="input input-bordered w-full font-bold" required />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text">İletişim Telefonu *</span></label>
                <input v-model="form.contactPersonPhone" class="input input-bordered w-full font-bold" placeholder="+90 (5XX) XXX XX XX" required />
              </div>
              <div class="form-control md:col-span-2">
                <label class="label"><span class="label-text">E-posta Adresi</span></label>
                <input type="email" v-model="form.contactPersonEmail" class="input input-bordered w-full font-medium" placeholder="ornek@email.com" />
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Ünite ve Kat Ataması -->
        <div class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-600 font-bold text-xs">📍</div>
              <h4 class="text-[11px] font-black uppercase tracking-widest text-[#16283a]">Ünite ve Kat Ataması</h4>
            </div>
            <button type="button" class="text-[10px] font-black text-brand-600 uppercase tracking-widest hover:text-brand-600 transition-colors" @click="resetFloorFilter">Filtreleri Temizle</button>
          </div>

          <div class="bg-[#f6fafd] border border-[#d9e7f2] rounded-2xl p-6">
            <div class="grid grid-cols-1 gap-6">
              <div class="form-control">
                <label class="label"><span class="label-text">Kat Filtresi (Opsiyonel)</span></label>
                <select v-model="form.floorNumber" class="select select-bordered w-full font-bold">
                  <option :value="null">Tüm Katlar</option>
                  <option v-for="floor in availableFloors" :key="floor" :value="floor">{{ floor }}. Kat</option>
                </select>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Bağlı ve Seçilebilir Üniteler (Çoklu Seçilebilir)</span>
                  <span class="label-text-alt text-[10px] font-bold text-brand-600/80 uppercase tracking-tighter">Ctrl / Cmd + Tık</span>
                </label>
                <select
                  multiple
                  v-model="form.selectedFlatIds"
                  class="select select-bordered w-full h-48 !bg-white border-[#d9e7f2] font-bold scrollbar-thin scrollbar-thumb-[#c8dcea]"
                >
                  <option v-for="flat in selectableFlats" :key="flat.id" :value="flat.id" class="py-2.5 px-4 hover:bg-brand-500/10 border-b border-[#ecf3f9] transition-colors">
                    {{ flatOptionLabel(flat) }}
                  </option>
                </select>
                <p class="mt-3 text-[10px] text-[#8298ab] font-bold uppercase italic tracking-tight leading-relaxed">
                  💡 Seçimden çıkardığınız üniteler bu kiracıdan alınacak, seçtiğiniz yeni üniteler bu kiracıya atanacaktır.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Finansal Detaylar -->
        <div class="space-y-4">
          <div class="flex items-center gap-3 px-1">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-600 font-bold text-xs">💰</div>
            <h4 class="text-[11px] font-black uppercase tracking-widest text-[#16283a]">Finansal & Üyelik Durumu</h4>
          </div>

          <div class="bg-[#f6fafd] border border-[#d9e7f2] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-control">
              <label class="label"><span class="label-text">Aylık Aidat Bedeli</span></label>
              <div class="relative">
                <input type="number" v-model.number="form.monthlyAidat" class="input input-bordered w-full font-black text-lg pr-12" min="0" step="0.01" required />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[#8298ab] font-black text-[10px] uppercase tracking-widest">TL</span>
              </div>
            </div>

            <div class="form-control justify-center">
              <label class="label cursor-pointer flex justify-start gap-4 p-0">
                <input type="checkbox" v-model="form.isActive" class="toggle toggle-success" />
                <span class="label-text font-black uppercase tracking-widest text-[11px] text-[#5a7186]">Üyelik Aktif</span>
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
        class="btn btn-ghost !bg-transparent border border-[#d9e7f2] text-[#5a7186] hover:bg-[#ecf3f9] flex-1"
      >
        Vazgeç
      </button>
      <button 
        form="editTenantForm" 
        type="submit" 
        class="btn btn-primary flex-1 shadow-lg shadow-brand-500/20 uppercase tracking-widest font-black"
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
import { ref, watch, computed } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import { useDirtyGuard } from '@/application/composables/useDirtyGuard'
import tenantsService from '@/infrastructure/services/tenantsService'
import { unitTypeLabel } from '@/core/constants/units'

const props = defineProps({
  tenant: Object,
  visible: Boolean
})
const emit = defineEmits(['save', 'close'])

const form = ref(null)
const availableFlats = ref([])
const { isDirty, resetDirty } = useDirtyGuard(() => form.value)

const UNIT_TYPE = { 0: 'Kat', 1: 'Giriş', 2: 'Otopark' }
const typeLabel = (t) => UNIT_TYPE[t] ?? 'Bilinmiyor'

const fetchAvailableFlats = async () => {
  try {
    const list = await tenantsService.getAvailableFlats()
    availableFlats.value = Array.isArray(list) ? list : []
  } catch (err) {
    console.warn('Boş üniteler yüklenemedi:', err)
  }
}

const allFlatsList = computed(() => {
  const currentFlats = props.tenant?.flats || []
  const map = new Map()
  currentFlats.forEach(f => map.set(f.id, { ...f, isCurrent: true }))
  availableFlats.value.forEach(f => {
    if (!map.has(f.id)) map.set(f.id, { ...f, isCurrent: false })
  })
  return Array.from(map.values())
})

const availableFloors = computed(() => {
  const set = new Set(allFlatsList.value.map(f => f.floorNumber).filter(f => f !== null && f !== undefined))
  return Array.from(set).sort((a, b) => a - b)
})

const selectableFlats = computed(() => {
  const floor = form.value?.floorNumber
  if (floor === null || floor === undefined || floor === '') return allFlatsList.value
  return allFlatsList.value.filter(f => f.floorNumber === floor)
})

const flatOptionLabel = (f) => {
  const currentTag = f.isCurrent ? ' (Mevcut Kiralanan)' : ' (Boş)'
  const base = `${f.code} — ${Number(f.unitArea || 0)}m²`
  const info = (f.floorNumber !== null && f.floorNumber !== undefined) 
    ? `${base} (${f.floorNumber}. Kat)` 
    : `${base} (${typeLabel(f.type)})`
  return `${info}${currentTag}`
}

const resetFloorFilter = () => {
  if (form.value) form.value.floorNumber = null
}

watch(() => props.tenant, (t) => {
  if (!t) { form.value = null; return }
  const initialFlatIds = (t.flats || []).map(f => f.id)
  form.value = {
    id: t.id,
    companyName: t.companyName || '',
    businessType: t.businessType || '',
    identityNumber: t.identityNumber || '',
    contactPersonName: t.contactPersonName || '',
    contactPersonPhone: t.contactPersonPhone || '',
    contactPersonEmail: t.contactPersonEmail || '',
    floorNumber: null,
    selectedFlatIds: [...initialFlatIds],
    monthlyAidat: Number(t.monthlyAidat ?? 0),
    isActive: Boolean(t.isActive)
  }
}, { immediate: true })

watch(() => props.visible, (v) => {
  if (v) {
    fetchAvailableFlats()
    resetDirty()
  }
})

const handleClose = () => {
  if (isDirty.value) {
    if (!confirm('Kaydedilmemiş değişiklikleriniz var. Kapatmak istediğinizden emin misiniz?')) {
      return
    }
  }
  emit('close')
}

const save = () => {
  const f = form.value
  if (!f) return

  const payload = {
    ...f,
    companyName: f.companyName.trim(),
    identityNumber: f.identityNumber.trim(),
    contactPersonName: f.contactPersonName.trim(),
    contactPersonPhone: f.contactPersonPhone.trim(),
    contactPersonEmail: f.contactPersonEmail.trim(),
    flatIds: f.selectedFlatIds || []
  }

  resetDirty()
  emit('save', payload)
}
</script>
