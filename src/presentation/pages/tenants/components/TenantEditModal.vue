<template>
  <dialog id="editTenantModal" class="modal" :open="visible">
    <div v-if="form" class="modal-box max-w-4xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-white/[0.07] shadow-2xl">
      <!-- Başlık -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/[0.07] mb-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-[#f1f3f9] flex items-center gap-2">
          <span class="text-2xl">✏️</span>
          İş Yeri Kiracısı Bilgilerini Güncelle
        </h3>
        <button @click="handleClose" class="btn btn-sm btn-ghost text-gray-500 hover:text-gray-700 dark:text-[#9aa0b4] dark:hover:text-gray-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Scroll edilebilir form -->
      <div class="overflow-y-auto max-h-[70vh] pr-2">
        <form @submit.prevent="save" class="space-y-6">
          <!-- İş Yeri Bilgileri -->
          <div class="card bg-base-200 p-4">
            <h4 class="text-lg font-semibold mb-4 text-gray-700 dark:text-[#f1f3f9]">🏢 İş Yeri Bilgileri</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold">Şirket Adı *</span></label>
                <input v-model.trim="form.companyName" class="input input-bordered w-full bg-white dark:bg-[#1c2238]" required />
              </div>


              <div class="form-control">
                <label class="label"><span class="label-text font-semibold">İş Türü *</span></label>
                <select v-model="form.businessType" class="select select-bordered w-full bg-white dark:bg-[#1c2238]" required>
                  <option value="">İş türü seçin</option>
                  <option value="Ticaret">Ticaret</option>
                  <option value="Hizmet">Hizmet</option>
                  <option value="Üretim">Üretim</option>
                  <option value="Ofis">Ofis</option>
                  <option value="Depo">Depo</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div class="form-control">
                <label class="label"><span class="label-text font-semibold">Kimlik/Vergi Numarası *</span></label>
                <input
                  v-model="form.identityNumber"
                  class="input input-bordered w-full bg-white dark:bg-[#1c2238]"
                  placeholder="TC veya Vergi No"
                  inputmode="numeric"
                  required
                />
              </div>
            </div>
          </div>

          <!-- İletişim Kişisi -->
          <div class="card bg-base-200 p-4">
            <h4 class="text-lg font-semibold mb-4 text-gray-700 dark:text-[#f1f3f9]">👤 İletişim Kişisi</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold">Ad Soyad *</span></label>
                <input v-model.trim="form.contactPersonName" class="input input-bordered w-full bg-white dark:bg-[#1c2238]" required />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold">Telefon *</span></label>
                <input v-model.trim="form.contactPersonPhone" class="input input-bordered w-full bg-white dark:bg-[#1c2238]" placeholder="+90 (5XX) XXX XX XX" required />
              </div>
              <div class="form-control md:col-span-2">
                <label class="label"><span class="label-text font-semibold">E-posta</span></label>
                <input type="email" v-model.trim="form.contactPersonEmail" class="input input-bordered w-full bg-white dark:bg-[#1c2238]" placeholder="ornek@email.com" />
              </div>
            </div>
          </div>

          <!-- Aidat & Durum -->
          <div class="card bg-base-200 p-4">
            <h4 class="text-lg font-semibold mb-4 text-gray-700 dark:text-[#f1f3f9]">💰 Aidat & Durum</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold">Aylık Aidat (₺) *</span></label>
                <input type="number" v-model.number="form.monthlyAidat" min="0" step="0.01" class="input input-bordered w-full bg-white dark:bg-[#1c2238]" required />
              </div>
              <div class="form-control md:col-span-2">
                <label class="label"><span class="label-text font-semibold">Aktif</span></label>
                <input type="checkbox" v-model="form.isActive" class="toggle toggle-success" />
              </div>
            </div>
          </div>

        </form>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/[0.07] mt-6">
        <button type="button" @click="$emit('close')" class="btn btn-outline">İptal</button>
        <button @click="save" class="btn btn-primary">Güncelle</button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useDirtyGuard } from '@/application/composables/useDirtyGuard'


const props = defineProps({
  tenant: Object,
  visible: Boolean
})
const emit = defineEmits(['save', 'close'])

const form = ref(null)
const { isDirty, resetDirty } = useDirtyGuard(() => form.value)

// helpers

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

// Save
const save = () => {
  const f = form.value
  if (!f) return


  // UpdateTenantCommand payload
  const payload = {
    id: f.id,
    companyName: f.companyName.trim(),
    businessType: f.businessType,
    identityNumber: f.identityNumber.trim(),
    contactPersonName: f.contactPersonName.trim(),
    contactPersonPhone: f.contactPersonPhone.trim(),
    contactPersonEmail: f.contactPersonEmail.trim(),
    monthlyAidat: Number(f.monthlyAidat ?? 0),
    isActive: Boolean(f.isActive)
  }

  resetDirty()
  emit('save', payload)
}
</script>
