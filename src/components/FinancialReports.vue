<template>
  <div class="financial-reports bg-base-100 p-6 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6 text-primary">Finansal Raporlar</h2>

    <!-- Filtreler -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold">Başlangıç Tarihi</span>
        </label>
        <input v-model="filters.startDate" type="date" class="input input-bordered" />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold">Bitiş Tarihi</span>
        </label>
        <input v-model="filters.endDate" type="date" class="input input-bordered" />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold">Kiracı</span>
        </label>
        <select v-model="filters.tenantId" class="select select-bordered">
          <option value="">Tüm Kiracılar</option>
          <option v-for="t in tenants" :key="t.id" :value="t.id">
            {{ getTenantLabel(t) }}
          </option>
        </select>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold">&nbsp;</span>
        </label>
        <button
          @click="loadReports"
          class="btn btn-primary"
          :disabled="loading || !datesValid"
          :title="!datesValid ? 'Başlangıç tarihi bitişten büyük olamaz' : ''"
        >
          <span v-if="loading" class="loading loading-spinner loading-sm"></span>
          {{ loading ? 'Yükleniyor...' : 'Rapor Yükle' }}
        </button>
      </div>
    </div>

    <!-- Tarih uyarısı -->
    <div v-if="!datesValid" class="alert alert-warning mb-4">
      Başlangıç tarihi, bitiş tarihinden büyük olamaz.
    </div>

    <!-- Yükleniyor -->
    <div v-if="loading" class="text-center py-8 text-gray-500">Yükleniyor…</div>

    <!-- Rapor sonuçları -->
    <div v-else-if="hasData" class="space-y-6">
      <!-- Özet kartları -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-title">Toplam Ödeme</div>
          <div class="stat-value text-primary">{{ formatCurrency(safeReport.totalPayments) }}</div>
          <div class="stat-desc">{{ safeReport.paymentCount }} ödeme</div>
        </div>

        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-title">Toplam Borç</div>
          <div class="stat-value text-error">{{ formatCurrency(safeReport.totalDebts) }}</div>
          <div class="stat-desc">{{ safeReport.debtCount }} borç</div>
        </div>

        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-title">Avans Bakiyesi</div>
          <div class="stat-value text-success">{{ formatCurrency(safeReport.advanceBalance) }}</div>
          <div class="stat-desc">{{ safeReport.advanceAccountCount }} hesap</div>
        </div>

        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-title">Net Durum</div>
          <div class="stat-value" :class="safeReport.netBalance >= 0 ? 'text-success' : 'text-error'">
            {{ formatCurrency(safeReport.netBalance) }}
          </div>
          <div class="stat-desc">Ödeme - Borç</div>
        </div>
      </div>

      <!-- Detaylı tablo -->
      <div class="overflow-x-auto">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Kiracı</th>
              <th>Ödeme</th>
              <th>Borç</th>
              <th>Kalan</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in safeReport.details" :key="item.id || item._idx">
              <td>{{ formatDate(item.date) }}</td>
              <td>{{ item.tenantName || getTenantNameById(item.tenantId) }}</td>
              <td class="text-success">{{ formatCurrency(item.paymentAmount || 0) }}</td>
              <td class="text-error">{{ formatCurrency(item.debtAmount || 0) }}</td>
              <td :class="(item.remainingAmount || 0) >= 0 ? 'text-success' : 'text-error'">
                {{ formatCurrency(item.remainingAmount || 0) }}
              </td>
              <td>
                <span
                  class="badge"
                  :class="(item.remainingAmount || 0) >= 0 ? 'badge-success' : 'badge-error'"
                >
                  {{ (item.remainingAmount || 0) >= 0 ? 'Pozitif' : 'Negatif' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Grafik alanı (placeholder) -->
      <div class="bg-base-200 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-3">Grafik Görünümü</h3>
        <div class="text-center py-8 text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          <p>Grafik görünümü yakında eklenecek</p>
        </div>
      </div>
    </div>

    <!-- Rapor yoksa mesaj -->
    <div v-else-if="!loading" class="text-center py-8">
      <div class="text-gray-500">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-lg font-medium">Rapor bulunamadı</p>
        <p class="text-sm">Filtreleri değiştirip tekrar deneyin.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import paymentsService from '@/services/paymentsService'
import tenantsService from '@/services/tenantsService'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useNotification } from '@/composables/useNotification'

const { handleNetworkError, handleValidationError } = useErrorHandler()
const { showError, showSuccess } = useNotification()

// Reactive data
const loading = ref(false)
const tenants = ref([])
const report = ref(null)

const today = new Date()
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

const filters = ref({
  startDate: format(startOfMonth, 'yyyy-MM-dd'),
  endDate: format(today, 'yyyy-MM-dd'),
  tenantId: '',
  ownerId: ''
})

/* ---------- Helpers ---------- */
const formatCurrency = (amount) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })
    .format(Number(amount || 0))

const formatDate = (date) => {
  if (!date) return '-'
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  if (isNaN(d)) return '-'
  return format(d, 'dd MMM yyyy', { locale: tr })
}

const datesValid = computed(() => {
  if (!filters.value.startDate || !filters.value.endDate) return true
  return new Date(filters.value.startDate) <= new Date(filters.value.endDate)
})

const emptyReport = Object.freeze({
  totalPayments: 0,
  paymentCount: 0,
  totalDebts: 0,
  debtCount: 0,
  advanceBalance: 0,
  advanceAccountCount: 0,
  netBalance: 0,
  details: []
})

const safeReport = computed(() => {
  const r = report.value || {}
  return {
    totalPayments: Number(r.totalPayments || 0),
    paymentCount: Number(r.paymentCount || 0),
    totalDebts: Number(r.totalDebts || 0),
    debtCount: Number(r.debtCount || 0),
    advanceBalance: Number(r.advanceBalance || 0),
    advanceAccountCount: Number(r.advanceAccountCount || 0),
    netBalance: Number(r.netBalance || (r.totalPayments || 0) - (r.totalDebts || 0)),
    details: Array.isArray(r.details)
      ? r.details.map((it, idx) => ({ _idx: idx, ...it }))
      : []
  }
})

const hasData = computed(() => {
  const r = safeReport.value
  return (
    r.paymentCount > 0 ||
    r.debtCount > 0 ||
    r.advanceAccountCount > 0 ||
    (r.details && r.details.length > 0)
  )
})

function getTenantLabel(t) {
  return (
    t.companyName ||
    t.company ||
    t.fullName ||
    [t.firstName, t.lastName].filter(Boolean).join(' ') ||
    t.email ||
    'Kiracı'
  )
}

function getTenantNameById(id) {
  const t = tenants.value.find(x => x.id === id)
  return t ? getTenantLabel(t) : 'Bilinmiyor'
}

/* ---------- Data loading ---------- */
async function loadTenants() {
  try {
    const response = await tenantsService.getTenants()
    tenants.value = Array.isArray(response) ? response : []
  } catch (error) {
    handleNetworkError(error, { component: 'FinancialReports', action: 'loadTenants' })
    tenants.value = []
  }
}

async function loadReports() {
  if (!datesValid.value) {
    handleValidationError(new Error('Tarih aralığı geçersiz'), {
      component: 'FinancialReports',
      action: 'loadReports'
    })
    return
  }

  loading.value = true
  try {
    const response = await paymentsService.getFinancialReports({
      startDate: filters.value.startDate,
      endDate: filters.value.endDate,
      tenantId: filters.value.tenantId || undefined,
      ownerId: filters.value.ownerId || undefined
    })

    // API farklı gövde dönerse güvenli fallback uygula
    report.value = response && typeof response === 'object' ? response : emptyReport
    showSuccess('Rapor güncellendi')
  } catch (error) {
    report.value = emptyReport
    handleNetworkError(error, { component: 'FinancialReports', action: 'loadReports' })
    showError('Rapor yüklenemedi')
  } finally {
    loading.value = false
  }
}

/* ---------- Lifecycle ---------- */
onMounted(() => {
  loadTenants()
  loadReports()
})
</script>
