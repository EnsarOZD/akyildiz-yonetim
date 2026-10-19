<template>
  <div class="p-4 sm:p-6 min-h-screen pb-24 md:pb-6 space-y-6">
    <PageHeader title="Otomasyon" subtitle="Aylık aidat tahakkuku ve ödeme hatırlatmalarını yönetin">
      <template #icon>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
        </svg>
      </template>
      <template #actions>
        <router-link to="/aidat-definitions" class="btn btn-sm btn-ghost">Aidat Tanımları</router-link>
        <button class="btn btn-sm btn-outline gap-2" :disabled="remindersRunning" @click="showRemindersConfirm = true">
          <span v-if="remindersRunning" class="loading loading-spinner loading-xs"></span>
          Hatırlatmaları şimdi gönder
        </button>
        <button class="btn btn-sm btn-outline gap-2" :disabled="statementsRunning" @click="showStatementsConfirm = true">
          <span v-if="statementsRunning" class="loading loading-spinner loading-xs"></span>
          Ekstreleri şimdi gönder (geçen ay)
        </button>
      </template>
    </PageHeader>

    <!-- Kapalı özellik uyarıları (kayıtlı ayarlara göre) -->
    <div v-if="savedSettings && (!savedSettings.accrualEnabled || !savedSettings.remindersEnabled || !savedSettings.statementsMonthlyEnabled)" class="space-y-2">
      <div v-if="!savedSettings.accrualEnabled" role="alert" class="alert alert-warning text-sm">
        <span>
          <strong>Otomatik tahakkuk kapalı.</strong>
          Aylık aidat borçları otomatik oluşturulmaz. Önizleme ile kontrol ettikten sonra aşağıdaki ayarlardan açın.
        </span>
      </div>
      <div v-if="!savedSettings.remindersEnabled" role="alert" class="alert alert-warning text-sm">
        <span>
          <strong>Hatırlatmalar kapalı.</strong>
          Kiracı ve maliklere otomatik ödeme hatırlatması gönderilmez.
        </span>
      </div>
      <div v-if="!savedSettings.statementsMonthlyEnabled" role="alert" class="alert alert-warning text-sm">
        <span>
          <strong>Aylık ekstre kapalı.</strong>
          Kiracı ve maliklere aylık hesap ekstresi otomatik e-postalanmaz.
        </span>
      </div>
    </div>

    <!-- Ayarlar -->
    <div class="app-card">
      <h3 class="text-sm font-black uppercase tracking-widest text-slate-700 mb-4">Ayarlar</h3>
      <div v-if="settingsLoading" class="flex justify-center py-6">
        <span class="loading loading-spinner"></span>
      </div>
      <form v-else @submit.prevent="saveSettings" class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h4 class="text-xs font-bold uppercase tracking-widest text-slate-500">Aylık aidat tahakkuku</h4>
            <label class="label cursor-pointer justify-start gap-3">
              <input type="checkbox" class="toggle toggle-primary" v-model="settings.accrualEnabled" />
              <span class="label-text">Otomatik tahakkuk açık</span>
            </label>
            <div class="grid grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label"><span class="label-text">Tahakkuk günü (1-28)</span></label>
                <input type="number" min="1" max="28" v-model.number="settings.accrualDayOfMonth" class="input input-bordered w-full" />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text">Son ödeme günü (1-28)</span></label>
                <input type="number" min="1" max="28" v-model.number="settings.accrualDueDayOfMonth" class="input input-bordered w-full" />
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <h4 class="text-xs font-bold uppercase tracking-widest text-slate-500">Günlük hatırlatma</h4>
            <label class="label cursor-pointer justify-start gap-3">
              <input type="checkbox" class="toggle toggle-primary" v-model="settings.remindersEnabled" />
              <span class="label-text">Otomatik hatırlatma açık</span>
            </label>
            <div class="grid grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label"><span class="label-text">Vadeden kaç gün önce (0-15)</span></label>
                <input type="number" min="0" max="15" v-model.number="settings.daysBeforeDue" class="input input-bordered w-full" />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text">Gecikmede tekrar (gün, 1-60)</span></label>
                <input type="number" min="1" max="60" v-model.number="settings.overdueRepeatDays" class="input input-bordered w-full" />
              </div>
            </div>
            <p v-if="savedSettings && savedSettings.remindersStartDate" class="text-xs text-slate-600">
              Hatırlatma başlangıcı: <strong>{{ formatDateOnly(savedSettings.remindersStartDate) }}</strong>
              — bu tarihten önce vadesi geçmiş borçlar için otomatik hatırlatma gönderilmez.
            </p>
          </div>
        </div>
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-slate-500">Aylık ekstre</h4>
          <label class="label cursor-pointer justify-start gap-3">
            <input type="checkbox" class="toggle toggle-primary" v-model="settings.statementsMonthlyEnabled" />
            <span class="label-text">Aylık ekstre açık</span>
          </label>
          <p class="text-xs text-slate-600">Açıldığında, bir önceki ayın ekstreleri ilk çalışmada (09:00 sonrası) gönderilir.</p>
        </div>
        <p class="text-xs text-slate-500">Otomatik işler her gün 09:00'dan sonra çalışır.</p>
        <p v-if="settingsError" class="text-sm text-red-600 font-medium">{{ settingsError }}</p>
        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary" :disabled="savingSettings">
            <span v-if="savingSettings" class="loading loading-spinner loading-xs mr-2"></span>
            Kaydet
          </button>
        </div>
      </form>
    </div>

    <!-- Dönem: önizleme ve oluşturma -->
    <div class="app-card">
      <h3 class="text-sm font-black uppercase tracking-widest text-slate-700 mb-4">Aidat tahakkuku</h3>
      <div class="flex flex-col sm:flex-row sm:items-end gap-4">
        <div class="form-control">
          <label class="label"><span class="label-text">Dönem</span></label>
          <input type="month" v-model="period" class="input input-bordered" @change="onPeriodChange" />
        </div>
        <button class="btn btn-outline" :disabled="!period || previewLoading" @click="loadPreview">
          <span v-if="previewLoading" class="loading loading-spinner loading-xs mr-2"></span>
          Önizle
        </button>
        <button class="btn btn-primary" :disabled="!period || accrualRunning" @click="showAccrualConfirm = true">
          <span v-if="accrualRunning" class="loading loading-spinner loading-xs mr-2"></span>
          Oluştur
        </button>
      </div>

      <div v-if="preview" class="mt-6 space-y-4">
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th scope="col">Oluşturulacak</th>
                <th scope="col">Zaten mevcut</th>
                <th scope="col">Toplam tutar</th>
                <th scope="col">Sorun</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="font-bold">{{ preview.created }}</td>
                <td>{{ preview.skippedExisting }}</td>
                <td class="font-bold text-success">{{ formatMoney(preview.totalAmount) }}</td>
                <td>{{ (preview.issues || []).length }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="(preview.issues || []).length" class="overflow-x-auto">
          <h4 class="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">Sorunlar</h4>
          <table class="table table-sm w-full">
            <thead>
              <tr>
                <th scope="col">Kiracı</th>
                <th scope="col">Ünite</th>
                <th scope="col">Neden</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(issue, i) in preview.issues" :key="issue.definitionId || i">
                <td>{{ issue.tenantName || '-' }}</td>
                <td>{{ issue.unit || '-' }}</td>
                <td>{{ issue.reason }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Eşleşmeyen tanımlar -->
    <div v-if="unmatched.length" class="app-card border border-amber-300 bg-amber-50/60">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 class="text-sm font-black uppercase tracking-widest text-amber-700">Ünitesi seçilmemiş aidat tanımları</h3>
          <p class="text-xs text-amber-700/80 mt-1">Bu tanımlar için otomatik tahakkuk yapılamaz. Tanımı düzenleyip ünite seçin.</p>
        </div>
        <router-link to="/aidat-definitions" class="btn btn-sm btn-outline btn-warning">Aidat Tanımları</router-link>
      </div>
      <ul class="mt-3 text-sm divide-y divide-amber-200">
        <li v-for="d in unmatched" :key="d.id" class="py-1.5 flex justify-between gap-3">
          <span class="font-medium">{{ d.tenantName || '-' }}</span>
          <span class="text-slate-600">{{ d.unit || '-' }} · {{ d.year }}</span>
        </li>
      </ul>
    </div>

    <!-- Son çalışmalar -->
    <div class="app-card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-black uppercase tracking-widest text-slate-700">Son çalışmalar</h3>
        <button class="btn btn-ghost btn-xs" :disabled="runsLoading" @click="loadRuns">Yenile</button>
      </div>
      <div v-if="runsLoading" class="flex justify-center py-6"><span class="loading loading-spinner"></span></div>
      <div v-else-if="!runs.length" class="text-center py-8 text-base-content/60 text-sm">Henüz çalışma kaydı yok.</div>
      <div v-else class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th scope="col">İş</th>
              <th scope="col">Dönem</th>
              <th scope="col">Durum</th>
              <th scope="col">Özet</th>
              <th scope="col">Tarih</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in runs" :key="`${r.jobName}-${r.runKey}-${r.startedAt}-${i}`" class="hover">
              <td class="font-medium">{{ jobLabel(r.jobName) }}</td>
              <td>{{ r.runKey || '-' }}</td>
              <td><span class="badge badge-sm font-bold" :class="statusClass(r.status)">{{ statusLabel(r.status) }}</span></td>
              <td class="text-sm text-slate-600">{{ r.summary || '-' }}</td>
              <td class="whitespace-nowrap text-sm">{{ formatDateTime(r.startedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ConfirmModal
      :isOpen="showAccrualConfirm"
      title="Aidat Oluşturulacak"
      :message="`${period} dönemi için aidat borçları oluşturulacak. Devam etmek istiyor musunuz?`"
      confirmLabel="Evet, Oluştur"
      confirmClass="btn-primary"
      :loading="accrualRunning"
      @confirm="runAccrual"
      @cancel="showAccrualConfirm = false"
    />
    <ConfirmModal
      :isOpen="showStatementsConfirm"
      title="Ekstreler Gönderilecek"
      :message="`${previousPeriod} dönemi için kiracı ve maliklere ekstreler e-postayla gönderilecek. Devam etmek istiyor musunuz?`"
      confirmLabel="Evet, Gönder"
      confirmClass="btn-primary"
      :loading="statementsRunning"
      @confirm="runStatements"
      @cancel="showStatementsConfirm = false"
    />
    <ConfirmModal
      :isOpen="showRemindersConfirm"
      title="Hatırlatmalar Gönderilecek"
      message="Vadesi yaklaşan ve geciken borçlar için hatırlatmalar şimdi gönderilecek. Devam etmek istiyor musunuz?"
      confirmLabel="Evet, Gönder"
      confirmClass="btn-primary"
      :loading="remindersRunning"
      @confirm="runReminders"
      @cancel="showRemindersConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import ConfirmModal from '@/presentation/components/common/ConfirmModal.vue'
import automationService from '@/infrastructure/services/automationService'
import { useNotification } from '@/application/composables/useNotification'
import { invalidateFinanceCaches } from '@/application/stores/cacheInvalidation'
import { todayLocalIso } from '@/core/utils/dateUtils'

const { showSuccess, showError, showWarning } = useNotification()

// Sunucu varsayılanlarıyla aynı: özellikler kapalı gelir
const defaultSettings = () => ({
  accrualEnabled: false,
  accrualDayOfMonth: 1,
  accrualDueDayOfMonth: 10,
  remindersEnabled: false,
  statementsMonthlyEnabled: false,
  daysBeforeDue: 3,
  overdueRepeatDays: 7
})

const settings = ref(defaultSettings())
// Sunucuda kayıtlı ayarlar (uyarı bantları ve salt okunur hatırlatma başlangıcı bunlara göre gösterilir)
const savedSettings = ref(null)
const settingsLoading = ref(true)
const savingSettings = ref(false)
const settingsError = ref('')

const period = ref(todayLocalIso().slice(0, 7))
const preview = ref(null)
const previewLoading = ref(false)
const accrualRunning = ref(false)
const showAccrualConfirm = ref(false)

const statementsRunning = ref(false)
const showStatementsConfirm = ref(false)
// Geçen ay (yerel saate göre) 'yyyy-MM'
const previousPeriod = (() => {
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
})()

const remindersRunning = ref(false)
const showRemindersConfirm = ref(false)

const runs = ref([])
const runsLoading = ref(false)
const unmatched = ref([])

const JOB_LABELS = { MonthlyAccrual: 'Aylık aidat', DailyReminders: 'Günlük hatırlatma', MonthlyStatements: 'Aylık ekstre' }
const STATUS_LABELS = { Running: 'Çalışıyor', Succeeded: 'Başarılı', Failed: 'Hata' }
const STATUS_CLASSES = { Running: 'badge-info', Succeeded: 'badge-success', Failed: 'badge-error' }

const jobLabel = (name) => JOB_LABELS[name] || name || '-'
const statusLabel = (s) => STATUS_LABELS[s] || s || '-'
const statusClass = (s) => STATUS_CLASSES[s] || 'badge-ghost'

const formatMoney = (v) => Number(v || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
const formatDateTime = (v) => {
  if (!v) return '-'
  const d = new Date(v)
  return isNaN(d.getTime()) ? '-' : d.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })
}

// api.js hata gövdesini error.response.data / error.message içinde taşır (409'da düz metin)
const errorText = (e, fallback) => {
  const data = e?.response?.data
  if (typeof data === 'string' && data.trim()) return data
  return e?.message || fallback
}

// 'yyyy-MM-ddT00:00:00' → 'dd.MM.yyyy' (saat dilimi kaydırması olmadan)
const formatDateOnly = (v) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v || ''))
  return m ? `${m[3]}.${m[2]}.${m[1]}` : '-'
}

const loadSettings = async () => {
  settingsLoading.value = true
  try {
    const s = await automationService.getSettings()
    settings.value = { ...defaultSettings(), ...(s || {}) }
    savedSettings.value = { ...settings.value }
  } catch (e) {
    showError(errorText(e, 'Ayarlar yüklenemedi.'))
  } finally {
    settingsLoading.value = false
  }
}

const saveSettings = async () => {
  savingSettings.value = true
  settingsError.value = ''
  try {
    // remindersStartDate sunucu tarafından yönetilir (salt okunur), gönderilmez
    const payload = { ...settings.value }
    delete payload.remindersStartDate
    await automationService.saveSettings(payload)
    showSuccess('Otomasyon ayarları kaydedildi.')
    // kayıtlı durumu ve sunucunun yazdığı hatırlatma başlangıcını yenile
    await loadSettings()
  } catch (e) {
    settingsError.value = errorText(e, 'Ayarlar kaydedilemedi.')
    showError(settingsError.value)
  } finally {
    savingSettings.value = false
  }
}

const loadPreview = async () => {
  previewLoading.value = true
  try {
    preview.value = await automationService.previewAccrual(period.value)
  } catch (e) {
    preview.value = null
    showError(errorText(e, 'Önizleme alınamadı.'))
  } finally {
    previewLoading.value = false
  }
}

const loadRuns = async () => {
  runsLoading.value = true
  try {
    const r = await automationService.getRuns(20)
    runs.value = Array.isArray(r) ? r : []
  } catch (e) {
    showError(errorText(e, 'Son çalışmalar yüklenemedi.'))
  } finally {
    runsLoading.value = false
  }
}

const loadUnmatched = async () => {
  try {
    const year = Number((period.value || '').slice(0, 4)) || undefined
    const r = await automationService.getUnmatchedDefinitions(year)
    unmatched.value = Array.isArray(r) ? r : []
  } catch (e) {
    unmatched.value = []
  }
}

const onPeriodChange = () => {
  preview.value = null
  loadUnmatched()
}

// 409 (iş zaten çalışıyor) uyarı olarak gösterilir; diğer hatalar hata olarak
const reportRunError = (e, fallback) => {
  if (e?.status === 409) showWarning(errorText(e, 'Bu iş şu anda çalışıyor, lütfen biraz sonra tekrar deneyin.'))
  else showError(errorText(e, fallback))
}

const reportRunResult = (res, okText) => {
  if (res?.status === 'Failed') showError(res.summary || 'İşlem başarısız oldu.')
  else showSuccess(res?.summary || okText)
}

const runAccrual = async () => {
  accrualRunning.value = true
  try {
    const res = await automationService.runAccrual(period.value)
    invalidateFinanceCaches()
    reportRunResult(res, 'Aidat tahakkuku tamamlandı.')
    preview.value = null
    showAccrualConfirm.value = false
    await Promise.all([loadRuns(), loadUnmatched()])
  } catch (e) {
    showAccrualConfirm.value = false
    reportRunError(e, 'Aidat oluşturulamadı.')
  } finally {
    accrualRunning.value = false
  }
}

const runStatements = async () => {
  statementsRunning.value = true
  try {
    const res = await automationService.runStatements(previousPeriod)
    reportRunResult(res, 'Ekstreler gönderildi.')
    showStatementsConfirm.value = false
    await loadRuns()
  } catch (e) {
    showStatementsConfirm.value = false
    reportRunError(e, 'Ekstreler gönderilemedi.')
  } finally {
    statementsRunning.value = false
  }
}

const runReminders = async () => {
  remindersRunning.value = true
  try {
    const res = await automationService.runReminders()
    reportRunResult(res, 'Hatırlatmalar gönderildi.')
    showRemindersConfirm.value = false
    await loadRuns()
  } catch (e) {
    showRemindersConfirm.value = false
    reportRunError(e, 'Hatırlatmalar gönderilemedi.')
  } finally {
    remindersRunning.value = false
  }
}

onMounted(() => {
  loadSettings()
  loadRuns()
  loadUnmatched()
})
</script>
