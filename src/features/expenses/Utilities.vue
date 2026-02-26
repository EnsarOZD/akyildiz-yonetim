<template>
  <!-- Ana Sayfa Konteyneri -->
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      <!-- Başlık -->
      <h1 class="text-3xl font-bold text-gray-800 my-6 dark:text-gray-100">Gider ve Aidat Yönetimi</h1>

      <!-- Data Status Indicator -->
      <div v-if="dataStatus.loading" class="my-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span class="text-blue-700 dark:text-blue-300">Veriler yükleniyor...</span>
        </div>
      </div>

      <div v-if="dataStatus.error" class="my-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-red-700 dark:text-red-300">{{ dataStatus.error }}</span>
        </div>
      </div>

      <div v-if="dataStatus.lastUpdated" class="my-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="text-green-700 dark:text-blue-300">
              Son güncelleme: {{ dataStatus.lastUpdated }}
            </span>
          </div>
          <div class="text-sm text-green-600 dark:text-green-400">
            {{ dues.length }} aidat kaydı
          </div>
        </div>
      </div>

      <!-- Özetsel Bilgi Kartları -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
          <div class="bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12h6m6 4h6m-7 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Toplam Kayıt</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ dues.length }}</p>
          </div>
        </div>
        
        <div v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" class="lg:col-span-3 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center justify-between border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div>
             <p class="text-sm text-gray-500 dark:text-gray-400">Aidat ve Gider Yönetimi</p>
             <p class="text-xs text-gray-400 italic">Dönemsel aidat oluşturabilir veya giderleri takip edebilirsiniz.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button @click="openManualDebt(0)" class="btn btn-success btn-md text-white">
              <span class="mr-1">📋</span> Aidat Ekle
            </button>
            <button @click="openManualDebt(1)" class="btn btn-warning btn-md text-white">
              <span class="mr-1">⚡</span> Elektrik Borcu Ekle
            </button>
            <button @click="openManualDebt(2)" class="btn btn-info btn-md text-white">
              <span class="mr-1">💧</span> Su Borcu Ekle
            </button>
            <div class="divider divider-horizontal mx-0"></div>
            <button @click="triggerExcelImport" class="btn btn-neutral btn-md text-white border-2 border-dashed border-gray-400">
              <span class="mr-1">📊</span> Excel'den Yükle
            </button>
            <input 
              type="file" 
              ref="fileInput" 
              hidden 
              accept=".xlsx,.xls" 
              @change="handleExcelImport"
            />
          </div>
        </div>
      </section>

      <!-- Filtre + Liste Kartı -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <FilterBar
          v-model:search="searchTerm"
          v-model:period="selectedPeriod"
          v-model:select-type="selectedType"
          :select-type-options="typeOptions"
          @clear-filters="handleClearFilters"
        />
      </div>

      <!-- Aidat Kayıtları -->
      <div class="bg-white dark:bg-gray-800 mt-6 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Borç Listesi</h2>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ filteredDues.length }} kayıt
          </div>
        </div>

        <div v-if="filteredDues.length === 0" class="text-center py-10 text-gray-500 dark:text-gray-400">
          Bu filtrelerle aidat kaydı bulunamadı.
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="d in duesPaged"
            :key="d.id || (d.flatId + '-' + d.periodYear + '-' + d.periodMonth)"
            class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b dark:border-gray-700/50"
          >
            <div class="md:col-span-3">
              <p class="font-bold text-gray-800 dark:text-gray-100">
                {{ d.tenantCompany || d.flatNumber || '-' }}
              </p>
              <p class="text-xs text-gray-400 dark:text-gray-500">
                Son ödeme: {{ formatDate(d.dueDate) }}
              </p>
              <div class="flex items-center gap-2 mt-1">
                <span :class="[
                  'badge badge-xs font-semibold',
                  d.type === 0 ? 'badge-neutral' : (d.type === 1 ? 'badge-warning' : 'badge-info')
                ]">
                  {{ typeLabel(d.type) }}
                </span>
              </div>
            </div>

            <div class="md:col-span-2 text-center">
              <span class="text-sm text-gray-500">Dönem</span>
              <p class="font-semibold">{{ d.periodYear }}/{{ String(d.periodMonth).padStart(2,'0') }}</p>
            </div>

            <div class="md:col-span-2 text-center">
              <span class="text-sm text-gray-500">Tutar</span>
              <p class="font-semibold text-lg">{{ formatNumber(d.amount) }} ₺</p>
            </div>

            <div class="md:col-span-3 text-center">
              <span class="text-sm text-gray-500">Durum</span>
              <p class="font-medium">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs',
                    d.status === 'paid'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : d.status === 'partial'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                  ]"
                >
                  {{ d.status === 'paid' ? 'Ödendi' : d.status === 'partial' ? 'Kısmi' : 'Bekliyor' }}
                </span>
              </p>
            </div>

            <div v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" class="md:col-span-2 text-right">
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-sm">İşlem</label>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-40 z-10">
                  <li><a @click="editDebt(d)">Düzenle</a></li>
                  <li v-if="authStore.role === ROLES.ADMIN"><a class="text-red-500" @click="openAidatDelete(d)">Sil</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Aidat: Pagination -->
        <div class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            Gösterilen
            {{ duesTotal ? ( (duesPage-1)*pageSize + 1 ) : 0 }}
            –
            {{ Math.min(duesPage*pageSize, duesTotal) }}
            / {{ duesTotal }}
          </div>
          <div class="flex items-center gap-2">
            <button class="btn btn-sm" :disabled="duesPage===1" @click="duesPage=1">« İlk</button>
            <button class="btn btn-sm" :disabled="duesPage===1" @click="duesPage--">‹ Geri</button>
            <span class="mx-2 text-sm">Sayfa {{ duesPage }} / {{ Math.max(1, Math.ceil(duesTotal / pageSize)) }}</span>
            <button class="btn btn-sm" :disabled="duesPage>=Math.ceil(duesTotal/pageSize)" @click="duesPage++">İleri ›</button>
            <button class="btn btn-sm" :disabled="duesPage>=Math.ceil(duesTotal/pageSize)" @click="duesPage=Math.ceil(duesTotal/pageSize)">Son »</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Bileşenleri -->
    <AidatEditModal
      v-if="showAidatEditModal && selectedDue"
      :record="selectedDue"
      @close="handleClose"
      @updated="refreshAll"
    />
    <AidatDeleteModal
      v-if="showAidatDeleteModal && selectedDue"
      :record="selectedDue"
      @close="handleClose"
      @deleted="refreshAll"
    />

    <!-- Manuel Borç Modalı -->
    <ManualDebtModal
      v-if="showManualModal"
      :type="manualType"
      :initial-data="selectedDue"
      @close="handleClose"
      @refresh="refreshAll"
    />

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ROLES } from '@/constants/roles'
import { useAuthStore } from '@/stores/auth'
import FilterBar from '@/components/common/FilterBar.vue'
import { useErrorHandler } from '@/composables/useErrorHandler'
import api from '@/services/api'
import utilityDebtsService from '@/services/utilityDebtsService'
import AidatEditModal from './EditAidatModal.vue'
import AidatDeleteModal from './AidatDeleteModal.vue'
import ManualDebtModal from './ManualDebtModal.vue'

const { handleNetworkError, showSuccess } = useErrorHandler()
const authStore = useAuthStore()

/* ---------- Helpers (period) ---------- */
function getYearMonth(o) {
  const safe = String(o?.period ?? '')
  const [py, pm] = safe && safe.includes('-') ? safe.split('-') : [null, null]
  const y = Number(o?.periodYear ?? py) || null
  const m = Number(o?.periodMonth ?? pm) || null
  return { y, m }
}
function periodKeyOf(o) {
  const { y, m } = getYearMonth(o)
  return y && m ? `${y}-${String(m).padStart(2, '0')}` : ''
}

/* ---------- State ---------- */
const dues = ref([])

const searchTerm = ref('')
const selectedPeriod = ref('')          // YYYY-MM
const selectedType = ref('all')
const selectedDue = ref(null)
const showAidatEditModal = ref(false)
const showAidatDeleteModal = ref(false)
const showManualModal = ref(false)
const manualType = ref(1)

const typeOptions = [
  { value: 'all', label: 'Tüm Borçlar' },
  { value: '0', label: 'Aidat', icon: '📋' },
  { value: '1', label: 'Elektrik', icon: '⚡' },
  { value: '2', label: 'Su', icon: '💧' }
]

// Pagination
const PAGE_SIZE_DEFAULT = 10
const duesPage = ref(1)
const pageSize = ref(PAGE_SIZE_DEFAULT)


/* ---------- Computed (filters) ---------- */

const duesTotal = computed(() => filteredDues.value.length)
const duesPaged = computed(() => {
  const start = (duesPage.value - 1) * pageSize.value
  return filteredDues.value.slice(start, start + pageSize.value)
})

const filteredDues = computed(() => {
  return dues.value
    .filter(d => {
      const search = searchTerm.value.toLowerCase()
      const matchesSearch =
        !search ||
        (d.flatNumber || '').toLowerCase().includes(search) ||
        (d.tenantCompany || '').toLowerCase().includes(search) ||
        (d.description || '').toLowerCase().includes(search)

      const matchesType = selectedType.value === 'all' || String(d.type) === selectedType.value

      const periodKey = periodKeyOf(d)
      const matchesPeriod = !selectedPeriod.value || periodKey === selectedPeriod.value

      return matchesSearch && matchesType && matchesPeriod
    })
    .sort((a,b) =>
      (b.periodYear ?? 0) - (a.periodYear ?? 0) ||
      (b.periodMonth ?? 0) - (a.periodMonth ?? 0)
    )
})

/* ---------- Data Status ---------- */
const dataStatus = ref({ loading: false, error: null, lastUpdated: null })
const inFlight = ref(0)
const setLoading = (inc) => {
  inFlight.value += inc ? 1 : -1
  dataStatus.value.loading = inFlight.value > 0
}

/* ---------- API ---------- */
const fetchFlats = async () => {
  try {
    const response = await api.get('/Flats')
    return response || []
  } catch (error) {
    console.error('Flat bilgileri alınırken hata:', error)
    return []
  }
}

const openAidatDelete = (d) => {
  selectedDue.value = d
  showAidatDeleteModal.value = true
}

const openManualDebt = (type) => {
  manualType.value = type
  selectedDue.value = null
  showManualModal.value = true
}

const fileInput = ref(null)

const triggerExcelImport = () => {
  fileInput.value.click()
}

const handleExcelImport = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  setLoading(true)
  try {
    const response = await api.post('/UtilityDebts/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    showSuccess(`${response.count} adet borç kaydı başarıyla içeri aktarıldı.`)
    refreshAll()
  } catch (error) {
    handleNetworkError(error)
  } finally {
    setLoading(false)
    event.target.value = '' // Temizle
  }
}

const editDebt = (d) => {
  selectedDue.value = d
  if (d.type === 0) {
    showAidatEditModal.value = true
  } else {
    manualType.value = d.type
    showManualModal.value = true
  }
}


const fetchDues = async () => {
  try {
    const [duesRes, flatsRes, tenantsRes] = await Promise.all([
      utilityDebtsService.getUtilityDebts({ period: selectedPeriod.value || undefined }),
      api.get('/Flats'),
      api.get('/Tenants'),
    ])

    const flatById = new Map((flatsRes || []).map(f => [f.id, f]))
    const tenantById = new Map((tenantsRes || []).map(t => [t.id, t]))

    const normStatus = (s) => {
      if (typeof s === 'number') { // 0:Unpaid 1:Partial 2:Paid
        return s === 2 ? 'paid' : (s === 1 ? 'partial' : 'unpaid')
      }
      return String(s || '').toLowerCase()
    }

    dues.value = (duesRes || []).map(d => {
      const flat   = flatById.get(d.flatId)
      const tenant = tenantById.get(d.tenantId)
      const { y, m } = getYearMonth(d)

      return {
        id: d.id,
        flatId: d.flatId,
        type: d.type ?? 0,
        flatNumber: d.flatNumber ?? d.flat_code ?? d.FlatCode ?? flat?.code ?? '-',
        tenantCompany: d.tenantName ?? d.TenantCompanyName ?? tenant?.companyName ?? tenant?.company ?? tenant?.fullName ?? flat?.tenantCompanyName ?? null,
        periodYear: y,
        periodMonth: m,
        amount: Number(d.amount ?? d.value ?? d.total ?? 0),
        dueDate: (() => {
  const raw = d.dueDate ?? d.DueDate ?? d.due_date ?? null
  // 0001-01-01 / 1899-12-30 gibi anlamsız tarihleri boş say
  if (!raw) return null
  const t = new Date(raw)
  return (isNaN(t) || t.getFullYear() < 1900) ? null : raw
})(),
        status: normStatus(d.status),
        remainingAmount: Number(d.remainingAmount ?? d.RemainingAmount ?? 0),
        tenantId: d.tenantId ?? d.TenantId ?? null,
        ownerId: d.ownerId ?? d.OwnerId ?? null,
      }
    })
  } catch (e) {
    console.error('Aidatlar alınırken hata:', e)
    dues.value = []
  }
}

/* ---------- Helpers ---------- */

const handleClose = (shouldRefresh) => {
  showAidatEditModal.value = false
  showAidatDeleteModal.value = false
  showManualModal.value = false
  selectedDue.value = null
  if (shouldRefresh) {
    refreshAll()
  }
}

const refreshAll = () => fetchDues()


const handleClearFilters = () => {
  searchTerm.value = ''
  selectedPeriod.value = ''
  selectedType.value = 'all'
  duesPage.value = 1
  console.log('⚡️ Tüm filtreler temizlendi')
}

/* ---------- Formatters ---------- */
const formatNumber = (value) => (value === undefined || value === null || isNaN(value) ? '-' : Number(value).toLocaleString('tr-TR'))
const formatDate = (val) => {
  if (!val) return '-'
  const dt = new Date(val)
  if (isNaN(dt)) return '-'
  if (dt.getFullYear() < 1900) return '-'
  return dt.toLocaleDateString('tr-TR')
}

const typeLabel = (t) => {
  const map = { 0: 'Aidat', 1: 'Elektrik', 2: 'Su' }
  return map[t] ?? 'Diğer'
}


/* ---------- Watchers ---------- */
watch([searchTerm, selectedPeriod, selectedType], () => {
  duesPage.value = 1
})
watch(pageSize, () => { duesPage.value = 1 })
watch(selectedPeriod, () => { fetchDues() })

/* ---------- Mount ---------- */
onMounted(() => {
  refreshAll()
})
</script>
