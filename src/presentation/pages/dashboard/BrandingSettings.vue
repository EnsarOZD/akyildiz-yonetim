<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-base font-bold text-slate-800">Kurum Bilgileri</h3>
      <p class="text-sm text-slate-500 mt-1">
        Kiracı ve maliklere giden e-postalarda görünen kurum adı, ödeme (IBAN) ve iletişim bilgileri.
        Boş bıraktığınız alan e-postada gösterilmez. Değişiklikler kaydedildiği anda sonraki e-postalara yansır.
      </p>
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <span class="loading loading-spinner loading-md text-brand-500"></span>
    </div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Form -->
      <form class="space-y-5" @submit.prevent="save">
        <fieldset class="space-y-3" :disabled="!canEdit">
          <legend class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Kurum</legend>
          <label class="form-control">
            <span class="label-text text-sm mb-1">Kurum adı</span>
            <input v-model="form.appName" type="text" maxlength="100" class="input input-bordered input-sm" placeholder="Akyıldız Yönetim" />
          </label>

          <div class="form-control">
            <span class="label-text text-sm mb-1">Logo (e-posta başlığı)</span>
            <div class="flex items-center gap-3">
              <div class="w-14 h-14 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                <img v-if="info.hasLogo" :src="logoSrc" alt="Logo" class="max-w-full max-h-full" />
                <span v-else class="text-[10px] text-slate-400 text-center leading-tight">Logo<br>yok</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <label class="btn btn-sm btn-outline" :class="{ 'btn-disabled': logoBusy || !canEdit }">
                  <span v-if="logoBusy" class="loading loading-spinner loading-xs"></span>
                  {{ info.hasLogo ? 'Değiştir' : 'Logo yükle' }}
                  <input type="file" accept="image/png,image/jpeg" class="hidden" :disabled="logoBusy || !canEdit" @change="onLogoSelected" />
                </label>
                <button v-if="info.hasLogo" type="button" class="btn btn-sm btn-ghost text-red-600" :disabled="logoBusy || !canEdit" @click="removeLogo">Kaldır</button>
              </div>
            </div>
            <span class="text-xs text-slate-500 mt-1">PNG veya JPG, en fazla 256 KB, kare (ör. 88×88 px). E-posta programları SVG göstermez.</span>
            <span v-if="info.hasLogo && !info.logoUsableInEmail" class="text-xs text-amber-600 mt-1">
              Logo kaydedildi ancak sunucuda herkese açık API adresi (PUBLIC_API_URL) tanımlı olmadığı için e-postalarda henüz görünmez.
            </span>
          </div>
        </fieldset>

        <fieldset class="space-y-3" :disabled="!canEdit">
          <legend class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Ödeme bilgileri</legend>
          <label class="form-control">
            <span class="label-text text-sm mb-1">IBAN</span>
            <input v-model="form.iban" type="text" maxlength="40" class="input input-bordered input-sm font-mono" placeholder="TR00 0000 0000 0000 0000 0000 00" @blur="formatIban" />
            <span v-if="ibanHint" class="text-xs text-amber-600 mt-1">{{ ibanHint }}</span>
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="form-control">
              <span class="label-text text-sm mb-1">Hesap sahibi</span>
              <input v-model="form.ibanHolder" type="text" maxlength="150" class="input input-bordered input-sm" />
            </label>
            <label class="form-control">
              <span class="label-text text-sm mb-1">Banka</span>
              <input v-model="form.bankName" type="text" maxlength="100" class="input input-bordered input-sm" />
            </label>
          </div>
          <p class="text-xs text-slate-500">IBAN girildiğinde hatırlatma e-postalarında "Ödeme bilgileri" kutusu ve açıklamaya yazılacak ünite/firma bilgisi gösterilir.</p>
        </fieldset>

        <fieldset class="space-y-3" :disabled="!canEdit">
          <legend class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">İletişim (alt bilgi)</legend>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="form-control">
              <span class="label-text text-sm mb-1">Telefon</span>
              <input v-model="form.contactPhone" type="tel" maxlength="30" class="input input-bordered input-sm" />
            </label>
            <label class="form-control">
              <span class="label-text text-sm mb-1">E-posta</span>
              <input v-model="form.contactEmail" type="email" maxlength="150" class="input input-bordered input-sm" />
            </label>
          </div>
          <label class="form-control">
            <span class="label-text text-sm mb-1">Çalışma saatleri</span>
            <input v-model="form.officeHours" type="text" maxlength="150" class="input input-bordered input-sm" placeholder="Hafta içi 09:00–18:00" />
          </label>
        </fieldset>

        <p v-if="error" class="text-sm text-red-600 whitespace-pre-line">{{ error }}</p>

        <div v-if="canEdit" class="flex items-center gap-3">
          <button type="submit" class="btn btn-sm btn-primary" :disabled="!dirty || saving">
            <span v-if="saving" class="loading loading-spinner loading-xs"></span>
            Kaydet
          </button>
          <button v-if="dirty" type="button" class="btn btn-sm btn-ghost" :disabled="saving" @click="reset">Vazgeç</button>
          <span v-if="dirty" class="text-xs text-amber-600">Kaydedilmemiş değişiklik var.</span>
        </div>
        <p v-else class="text-xs text-slate-500">Bu bilgileri yalnızca yönetici ve sistem yöneticisi değiştirebilir.</p>
      </form>

      <!-- Önizleme -->
      <div class="space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-slate-500">E-posta önizlemesi</h4>
          <div class="flex items-center gap-2">
            <select v-model="previewKind" class="select select-bordered select-xs" @change="refreshPreview">
              <option value="NewDebtDigest">Yeni borç</option>
              <option value="DueSoon">Vade yaklaşıyor</option>
              <option value="Overdue">Gecikme</option>
              <option value="OverdueRepeat">Tekrar hatırlatma</option>
            </select>
            <button type="button" class="btn btn-xs btn-outline" :disabled="previewLoading" @click="refreshPreview">
              <span v-if="previewLoading" class="loading loading-spinner loading-xs"></span>Yenile
            </button>
          </div>
        </div>
        <p class="text-xs text-slate-500">Örnek verilerle; formdaki (kaydedilmemiş) değerler kullanılır.</p>
        <div class="border border-slate-200 rounded-xl overflow-hidden bg-white">
          <iframe
            v-if="previewHtml"
            :srcdoc="previewHtml"
            title="E-posta önizlemesi"
            sandbox=""
            class="w-full h-[720px] block"
          ></iframe>
          <div v-else class="h-40 flex items-center justify-center text-sm text-slate-400">
            {{ previewError || 'Önizleme yükleniyor…' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import settingsService from '@/infrastructure/services/settingsService'
import { useNotification } from '@/application/composables/useNotification'
import { useAuthStore } from '@/application/stores/auth'

defineProps({ hideHeader: Boolean })
defineEmits(['refresh-stats', 'stats'])

const { showSuccess, showError } = useNotification()
const authStore = useAuthStore()
const canEdit = computed(() => ['admin', 'manager'].includes((authStore.role || '').toLowerCase()))

const FIELDS = ['appName', 'iban', 'ibanHolder', 'bankName', 'contactPhone', 'contactEmail', 'officeHours']
const empty = () => Object.fromEntries(FIELDS.map(f => [f, '']))

const form = ref(empty())
const saved = ref(empty())
const info = ref({ hasLogo: false, logoVersion: null, logoUsableInEmail: false })
const loading = ref(true)
const saving = ref(false)
const logoBusy = ref(false)
const error = ref('')

const previewKind = ref('Overdue')
const previewHtml = ref('')
const previewError = ref('')
const previewLoading = ref(false)

const dirty = computed(() => FIELDS.some(f => (form.value[f] || '').trim() !== (saved.value[f] || '').trim()))
const logoSrc = computed(() => settingsService.logoUrl(info.value.logoVersion))

const errorText = (e, fallback) => {
  const data = e?.response?.data
  return typeof data === 'string' && data.trim() ? data : (e?.message || fallback)
}

// Yazarken kaba kontrol (kesin doğrulama sunucuda: TR + 24 hane + mod-97)
const ibanHint = computed(() => {
  const s = (form.value.iban || '').replace(/\s+/g, '').toUpperCase()
  if (!s) return ''
  if (!s.startsWith('TR')) return 'IBAN TR ile başlamalıdır.'
  if (s.length !== 26) return `IBAN 26 karakter olmalıdır (şu an ${s.length}).`
  if (!/^TR\d{24}$/.test(s)) return 'TR\'den sonra yalnızca rakam olmalıdır.'
  return ''
})

const formatIban = () => {
  const s = (form.value.iban || '').replace(/\s+/g, '').toUpperCase()
  form.value.iban = s ? s.match(/.{1,4}/g).join(' ') : ''
}

const applyDto = (dto) => {
  const values = Object.fromEntries(FIELDS.map(f => [f, dto?.[f] || '']))
  saved.value = values
  form.value = { ...values }
  info.value = {
    hasLogo: !!dto?.hasLogo,
    logoVersion: dto?.logoVersion || null,
    logoUsableInEmail: !!dto?.logoUsableInEmail
  }
}

const payload = () => Object.fromEntries(FIELDS.map(f => [f, (form.value[f] || '').trim() || null]))

const load = async () => {
  loading.value = true
  try {
    applyDto(await settingsService.getBranding())
  } catch (e) {
    showError(errorText(e, 'Kurum bilgileri yüklenemedi.'))
  } finally {
    loading.value = false
  }
  refreshPreview()
}

const refreshPreview = async () => {
  previewLoading.value = true
  previewError.value = ''
  try {
    const r = await settingsService.previewBranding(payload(), previewKind.value)
    previewHtml.value = r?.html || ''
  } catch (e) {
    previewHtml.value = ''
    previewError.value = errorText(e, 'Önizleme oluşturulamadı.')
  } finally {
    previewLoading.value = false
  }
}

// Form değiştikçe önizlemeyi kısa bir gecikmeyle yenile
let previewTimer = null
watch(form, () => {
  clearTimeout(previewTimer)
  previewTimer = setTimeout(() => { if (!ibanHint.value) refreshPreview() }, 600)
}, { deep: true })

const reset = () => {
  form.value = { ...saved.value }
  error.value = ''
}

const save = async () => {
  saving.value = true
  error.value = ''
  try {
    formatIban()
    applyDto(await settingsService.saveBranding(payload()))
    showSuccess('Kurum bilgileri kaydedildi.')
  } catch (e) {
    error.value = errorText(e, 'Kurum bilgileri kaydedilemedi.')
    showError(error.value)
  } finally {
    saving.value = false
  }
}

const onLogoSelected = async (ev) => {
  const file = ev.target.files?.[0]
  ev.target.value = ''
  if (!file) return
  if (file.size > 256 * 1024) {
    showError('Logo en fazla 256 KB olabilir.')
    return
  }
  logoBusy.value = true
  try {
    const dto = await settingsService.uploadLogo(file)
    info.value = { hasLogo: !!dto?.hasLogo, logoVersion: dto?.logoVersion || null, logoUsableInEmail: !!dto?.logoUsableInEmail }
    showSuccess('Logo yüklendi.')
    refreshPreview()
  } catch (e) {
    showError(errorText(e, 'Logo yüklenemedi.'))
  } finally {
    logoBusy.value = false
  }
}

const removeLogo = async () => {
  logoBusy.value = true
  try {
    const dto = await settingsService.deleteLogo()
    info.value = { hasLogo: !!dto?.hasLogo, logoVersion: dto?.logoVersion || null, logoUsableInEmail: !!dto?.logoUsableInEmail }
    showSuccess('Logo kaldırıldı.')
    refreshPreview()
  } catch (e) {
    showError(errorText(e, 'Logo kaldırılamadı.'))
  } finally {
    logoBusy.value = false
  }
}

onMounted(load)
</script>
