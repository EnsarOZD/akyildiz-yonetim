<template>
  <dialog id="createTenantModal" class="modal" :open="visible">
    <div class="modal-box max-w-4xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
      <!-- Başlık -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span class="text-2xl">🏢</span>
          Yeni İş Yeri Kiracısı Ekle
        </h3>
        <button @click="$emit('close')" class="btn btn-sm btn-ghost text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Scroll edilebilir form -->
      <div class="overflow-y-auto max-h-[70vh] pr-2">
        <form @submit.prevent="handleSave" id="tenantForm" class="space-y-6">
          <!-- İş Yeri Bilgileri -->
          <div class="card bg-base-200 p-4">
            <h4 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">🏢 İş Yeri Bilgileri</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Şirket Adı *</span>
                </label>
                <input v-model="tenant.companyName" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" placeholder="ABC Ticaret Ltd. Şti." required />
              </div>


              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold text-gray-700 dark:text-gray-300">İş Türü *</span>
                </label>
                <select v-model="tenant.businessType" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required>
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
                <label class="label">
                  <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Kimlik/Vergi Numarası *</span>
                </label>
                <input
                  v-model="tenant.identityNumber"
                  class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="TC veya Vergi No"
                  required
                  type="text"
                  inputmode="numeric"
                />
              </div>
            </div>
          </div>

          <!-- İletişim Kişisi Bilgileri -->
          <div class="card bg-base-200 p-4">
            <h4 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">👤 İletişim Kişisi Bilgileri</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">İletişim Kişisi *</span></label>
                <input v-model="tenant.contactPersonName" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" placeholder="Ahmet Yılmaz" required />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Telefon *</span></label>
                <input v-model="tenant.contactPersonPhone" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" placeholder="+90 (5XX) XXX XX XX" required />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">E-posta</span></label>
                <input type="email" v-model="tenant.contactPersonEmail" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" placeholder="ornek@email.com" />
              </div>
            </div>
          </div>

          <!-- Ünite Seçimi -->
          <div class="card bg-base-200 p-4">
            <h4 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">📍 Ünite Seçimi</h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <!-- Kat filtresi -->
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Kat Filtresi</span></label>
                <div class="flex gap-2">
                  <select
                    v-model="tenant.floorNumber"
                    @change="onFloorChange"
                    class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400">
                    <option :value="null">Tüm katlar</option>
                    <option v-for="floor in availableFloors" :key="floor" :value="floor">
                      {{ floor }}. Kat
                    </option>
                  </select>
                  <button type="button" class="btn btn-ghost btn-sm" @click="resetFloorFilter">
                    Temizle
                  </button>
                </div>
              </div>

              <!-- Ünite seçimi (ÇOKLU) -->
              <div class="form-control md:col-span-2">
                <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Ünite Seçin (çoklu)</span></label>
                <select
                  multiple
                  v-model="tenant.selectedFlatIds"
                  :size="multiSelectSize"
                  class="select select-bordered w-full h-56 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400">
                  <option
                    v-for="flat in availableFlatsForTenant"
                    :key="flat.id"
                    :value="flat.id">
                    {{ flatOptionLabel(flat) }}
                  </option>
                </select>

                <label class="label">
                  <span class="label-text-alt text-blue-600">
                    💡 Ünite seçmezseniz yalnızca kat seçimiyle o kattaki ilk uygun ünite atanır.
                  </span>
                </label>
              </div>
            </div>
          </div>

          <!-- Aidat -->
          <div class="card bg-base-200 p-4">
            <h4 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">💰 Aidat Bilgisi</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Aylık Aidat (₺) *</span></label>
                <input type="number" v-model.number="tenant.monthlyAidat" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" placeholder="500" min="0" step="0.01" required />
              </div>
            </div>
          </div>

          <!-- Aktiflik -->
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Aktif Kiracı</span>
              <input type="checkbox" v-model="tenant.isActive" class="toggle toggle-success" />
            </label>
          </div>

        </form>
      </div>

      <!-- Sabit Butonlar -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
        <button type="button" @click="handleClose" class="btn btn-outline border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          İptal
        </button>
        <button form="tenantForm" type="submit" class="btn btn-success bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 text-white shadow-lg">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Kaydet
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useNotify } from '@/composables/useNotify'
import tenantsService from '@/features/tenants/services/tenantsService.js'
import { COMPANY_TYPES } from '@/constants/units'
import { useEventBus } from '@/composables/useEventBus'
import { useDirtyGuard } from '@/composables/useDirtyGuard'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['save', 'close'])
const { on: onEvent } = useEventBus()
const { isDirty, resetDirty } = useDirtyGuard(() => tenant.value)

defineExpose({ isDirty, resetDirty })

// --- Helpers
const UNIT_TYPE = {
  0: 'Kat',
  1: 'Giriş',
  2: 'Otopark'
}
const typeLabel = (t) => UNIT_TYPE[t] ?? 'Bilinmiyor'
const flatOptionLabel = (f) => {
  const base = `${f.code} — ${Number(f.unitArea || 0)}m²`
  if (f.floorNumber !== null && f.floorNumber !== undefined) {
    return `${base} (${f.floorNumber}. Kat)`
  }
  // Katı olmayanlar (ör. Otopark)
  return `${base} (${typeLabel(f.type)})`
}

// --- State
const availableFlats = ref([])
const tenant = ref(emptyTenant())

function emptyTenant () {
  return {
    companyName: '',
    businessType: '',
    identityNumber: '',
    contactPersonName: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
    flatId: '',              // geri uyumluluk (tek seçim)
    selectedFlatIds: [],     // çoklu seçim
    floorNumber: undefined,
    monthlyAidat: 0,
    isActive: true
  }
}


// --- Flats (list + filtre)
const availableFloors = computed(() => {
  const set = new Set((availableFlats.value || [])
    .map(f => f.floorNumber ?? f.floor)
    .filter(f => f !== null && f !== undefined))
  return Array.from(set).sort((a,b) => a - b)
})

const availableFlatsForTenant = computed(() => {
  const floor = tenant.value.floorNumber
  const list = availableFlats.value || []
  if (floor === undefined || floor === null) return list
  return list.filter(f => (f.floorNumber ?? f.floor) === floor)
})

const multiSelectSize = computed(() => {
  const len = availableFlatsForTenant.value?.length || 0
  return Math.min(8, len || 4)
})

async function fetchAvailableFlats (floorFilter) {
  try {
    const list = await tenantsService.getAvailableFlats(
      floorFilter != null ? { floor: floorFilter } : {}
    )

    // Normalize (tip bilgisi dahil)
    availableFlats.value = Array.isArray(list)
      ? list.map(f => ({
          id: f.id,
          code: f.code ?? f.unitNumber ?? '',
          unitArea: f.unitArea ?? 0,
          floorNumber: f.floorNumber ?? f.floor ?? null,
          type: f.type, // 0:Kat,1:Giriş,2:Otopark
          isOccupied: !!f.isOccupied,
        }))
      : []
  } catch (e) {
    console.error('Boş üniteler yüklenirken hata:', e)
    availableFlats.value = []
  }
}

function onFloorChange () {
  tenant.value.flatId = ''
  tenant.value.selectedFlatIds = [] // mevcut seçimi sıfırla (isteğe bağlı)

  if (tenant.value.floorNumber === null || tenant.value.floorNumber === undefined) {
    fetchAvailableFlats() // tüm katlar
  } else {
    fetchAvailableFlats(tenant.value.floorNumber) // kat bazlı
  }
}

function resetFloorFilter () {
  tenant.value.floorNumber = null
  onFloorChange()
}

// --- Lifecycle & watchers
watch(() => props.visible, (v) => {
  if (v) {
    tenant.value = emptyTenant()
    fetchAvailableFlats()
    setInitialState(tenant.value)
  }
})

onMounted(() => {
  if (props.visible) fetchAvailableFlats()
  onEvent('tenant:deleted', () => fetchAvailableFlats(tenant.value.floorNumber))
})

// --- Submit
function handleSave () {
  if (!tenant.value.companyName || !tenant.value.businessType || !tenant.value.identityNumber) return

  const ids = (tenant.value.selectedFlatIds || []).filter(Boolean)

  // Kullanıcı ne ünite ne de kat seçmişse, backend'e boş istek göndermeyelim:
  if (ids.length === 0 && (tenant.value.floorNumber === undefined || tenant.value.floorNumber === null)) {
    notifyError('Lütfen en az bir ünite seçin veya kat filtresi belirleyin.')
    return
  }

  const payload = {
    companyName: tenant.value.companyName.trim(),
    businessType: tenant.value.businessType,
    identityNumber: tenant.value.identityNumber.trim(),
    contactPersonName: tenant.value.contactPersonName.trim(),
    contactPersonPhone: tenant.value.contactPersonPhone.trim(),
    contactPersonEmail: tenant.value.contactPersonEmail?.trim() || null,

    // Çoklu/tek seçim
    flatIds: ids.length > 1 ? ids : undefined,
    flatId: ids.length === 1 ? ids[0] : (tenant.value.flatId || null),

    floorNumber: tenant.value.floorNumber ?? null,
    monthlyAidat: Number(tenant.value.monthlyAidat || 0),
    isActive: !!tenant.value.isActive
  }

  emit('save', payload)
  tenant.value = emptyTenant()
}
</script>
