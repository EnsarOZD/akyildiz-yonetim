<template>
  <dialog id="editTenantModal" class="modal" :open="visible">
    <div v-if="form" class="modal-box max-w-4xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
      <!-- Başlık -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span class="text-2xl">✏️</span>
          İş Yeri Kiracısı Bilgilerini Güncelle
        </h3>
        <button @click="$emit('close')" class="btn btn-sm btn-ghost text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
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
            <h4 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">🏢 İş Yeri Bilgileri</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold">Şirket Adı *</span></label>
                <input v-model.trim="form.companyName" class="input input-bordered w-full bg-white dark:bg-gray-700" required />
              </div>

              <div class="form-control">
                <label class="label"><span class="label-text font-semibold">Firma Türü *</span></label>
                <select v-model="form.companyType" class="select select-bordered w-full bg-white dark:bg-gray-700" required>
                  <option value="">Firma türü seçin</option>
                  <option value="Individual">Bireysel</option>
                  <option value="Corporate">Kurumsal</option>
                </select>
              </div>

              <div class="form-control">
                <label class="label"><span class="label-text font-semibold">İş Türü *</span></label>
                <select v-model="form.businessType" class="select select-bordered w-full bg-white dark:bg-gray-700" required>
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
                <label class="label"><span class="label-text font-semibold">{{ companyTypeLabel }} *</span></label>
                <input
                  v-model="form.identityNumber"
                  :class="['input input-bordered w-full bg-white dark:bg-gray-700', identityNumberError ? 'input-error' : '']"
                  :placeholder="companyTypePlaceholder"
                  :maxlength="form.companyType === 'Individual' ? 11 : 10"
                  :pattern="form.companyType === 'Individual' ? '[0-9]{11}' : '[0-9]{10}'"
                  inputmode="numeric"
                  required
                />
                <label v-if="identityNumberError" class="label">
                  <span class="label-text-alt text-error">{{ identityNumberError }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- İletişim Kişisi -->
          <div class="card bg-base-200 p-4">
            <h4 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">👤 İletişim Kişisi</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold">Ad Soyad *</span></label>
                <input v-model.trim="form.contactPersonName" class="input input-bordered w-full bg-white dark:bg-gray-700" required />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold">Telefon *</span></label>
                <input v-model.trim="form.contactPersonPhone" class="input input-bordered w-full bg-white dark:bg-gray-700" placeholder="+90 (5XX) XXX XX XX" required />
              </div>
              <div class="form-control md:col-span-2">
                <label class="label"><span class="label-text font-semibold">E-posta</span></label>
                <input type="email" v-model.trim="form.contactPersonEmail" class="input input-bordered w-full bg-white dark:bg-gray-700" placeholder="ornek@email.com" />
              </div>
            </div>
          </div>

          <!-- Aidat & Durum -->
          <div class="card bg-base-200 p-4">
            <h4 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">💰 Aidat & Durum</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold">Aylık Aidat (₺) *</span></label>
                <input type="number" v-model.number="form.monthlyAidat" min="0" step="0.01" class="input input-bordered w-full bg-white dark:bg-gray-700" required />
              </div>
              <div class="form-control md:col-span-2">
                <label class="label"><span class="label-text font-semibold">Aktif</span></label>
                <input type="checkbox" v-model="form.isActive" class="toggle toggle-success" />
              </div>
            </div>
          </div>

          <!-- Sözleşme -->
          <div class="card bg-base-200 p-4">
            <h4 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">📅 Sözleşme</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold">Başlangıç *</span></label>
                <input type="date" v-model="form.contractStartDate" class="input input-bordered w-full bg-white dark:bg-gray-700" required />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold">Bitiş</span></label>
                <input type="date" v-model="form.contractEndDate" class="input input-bordered w-full bg-white dark:bg-gray-700" />
              </div>
            </div>
            <p v-if="dateError" class="mt-2 text-sm text-error">{{ dateError }}</p>
          </div>
        </form>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
        <button type="button" @click="$emit('close')" class="btn btn-outline">İptal</button>
        <button @click="save" class="btn btn-primary">Güncelle</button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'


const props = defineProps({
  tenant: Object,
  visible: Boolean
})
const emit = defineEmits(['save', 'close'])

const form = ref(null)

// helpers
const toInputDate = (d) => {
  if (!d) return ''
  const dt = new Date(d)
  if (Number.isNaN(dt.getTime())) return ''
  return dt.toISOString().slice(0, 10)
}

watch(() => props.tenant, (t) => {
  if (!t) { form.value = null; return }
  // Backend (UpdateTenantCommand) ile bire bir eşleşen form modeli
  form.value = {
    id: t.id,
    companyName: t.companyName || '',
    businessType: t.businessType || '',
    companyType: t.companyType || 'Corporate', // default
    identityNumber: t.identityNumber || '',
    contactPersonName: t.contactPersonName || '',
    contactPersonPhone: t.contactPersonPhone || '',
    contactPersonEmail: t.contactPersonEmail || '',
    monthlyAidat: Number(t.monthlyAidat ?? 0),
    contractStartDate: toInputDate(t.contractStartDate) || '',
    contractEndDate: toInputDate(t.contractEndDate) || '',
    isActive: Boolean(t.isActive)
  }
}, { immediate: true })

// Computeds
const companyTypeLabel = computed(() =>
  form.value?.companyType === 'Individual' ? 'TC Kimlik Numarası' :
  form.value?.companyType === 'Corporate' ? 'Vergi Numarası' : 'Kimlik/Vergi Numarası'
)
const companyTypePlaceholder = computed(() =>
  form.value?.companyType === 'Individual' ? '12345678901' :
  form.value?.companyType === 'Corporate' ? '1234567890' : 'Numara girin'
)

const identityNumberError = computed(() => {
  const f = form.value
  if (!f) return ''
  if (!f.companyType || !f.identityNumber) return ''
  if (f.companyType === 'Individual') {
    if (!/^\d{11}$/.test(f.identityNumber)) return 'TC Kimlik Numarası 11 hane ve sadece rakam olmalıdır'
  } else if (f.companyType === 'Corporate') {
    if (!/^\d{10}$/.test(f.identityNumber)) return 'Vergi Numarası 10 hane ve sadece rakam olmalıdır'
  }
  return ''
})

const dateError = computed(() => {
  const f = form.value
  if (!f?.contractStartDate || !f.contractEndDate) return ''
  const s = new Date(f.contractStartDate).getTime()
  const e = new Date(f.contractEndDate).getTime()
  return e < s ? 'Sözleşme bitiş tarihi, başlangıç tarihinden önce olamaz.' : ''
})

// Save
const save = () => {
  const f = form.value
  if (!f) return

  if (identityNumberError.value) {
    alert(identityNumberError.value)
    return
  }
  if (dateError.value) {
    alert(dateError.value)
    return
  }

  // UpdateTenantCommand payload
  const payload = {
    id: f.id,
    companyName: f.companyName.trim(),
    businessType: f.businessType,
    companyType: f.companyType,
    identityNumber: f.identityNumber.trim(),
    contactPersonName: f.contactPersonName.trim(),
    contactPersonPhone: f.contactPersonPhone.trim(),
    contactPersonEmail: f.contactPersonEmail.trim(),
    monthlyAidat: Number(f.monthlyAidat ?? 0),
    contractStartDate: f.contractStartDate ? new Date(f.contractStartDate) : null,
    contractEndDate: f.contractEndDate ? new Date(f.contractEndDate) : null,
    isActive: Boolean(f.isActive)
  }

  emit('save', payload)
}
</script>
