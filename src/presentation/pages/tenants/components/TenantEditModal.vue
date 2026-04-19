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
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h4 class="text-[11px] font-black uppercase tracking-widest text-[#f1f3f9]">Resmi Kayıt Bilgileri</h4>
          </div>

          <div class="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
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
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 class="text-[11px] font-black uppercase tracking-widest text-[#f1f3f9]">Güncel İletişim Bilgileri</h4>
          </div>

          <div class="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
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

        <!-- 3. Finansal Detaylar -->
        <div class="space-y-4">
          <div class="flex items-center gap-3 px-1">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 font-bold text-xs">💰</div>
            <h4 class="text-[11px] font-black uppercase tracking-widest text-[#f1f3f9]">Finansal & Üyelik Durumu</h4>
          </div>

          <div class="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-control">
              <label class="label"><span class="label-text">Aylık Aidat Bedeli</span></label>
              <div class="relative">
                <input type="number" v-model.number="form.monthlyAidat" class="input input-bordered w-full font-black text-lg pr-12" min="0" step="0.01" required />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[#626885] font-black text-[10px] uppercase tracking-widest">TL</span>
              </div>
            </div>

            <div class="form-control justify-center">
              <label class="label cursor-pointer flex justify-start gap-4 p-0">
                <input type="checkbox" v-model="form.isActive" class="toggle toggle-success" />
                <span class="label-text font-black uppercase tracking-widest text-[11px] text-[#9aa0b4]">Üyelik Aktif</span>
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
import { ref, watch } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import { useDirtyGuard } from '@/application/composables/useDirtyGuard'

const props = defineProps({
  tenant: Object,
  visible: Boolean
})
const emit = defineEmits(['save', 'close'])

const form = ref(null)
const { isDirty, resetDirty } = useDirtyGuard(() => form.value)

watch(() => props.tenant, (t) => {
  if (!t) { form.value = null; return }
  form.value = {
    id: t.id,
    companyName: t.companyName || '',
    businessType: t.businessType || '',
    identityNumber: t.identityNumber || '',
    contactPersonName: t.contactPersonName || '',
    contactPersonPhone: t.contactPersonPhone || '',
    contactPersonEmail: t.contactPersonEmail || '',
    monthlyAidat: Number(t.monthlyAidat ?? 0),
    isActive: Boolean(t.isActive)
  }
}, { immediate: true })

watch(() => props.visible, (v) => {
  if (v) resetDirty()
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
  }

  resetDirty()
  emit('save', payload)
}
</script>
