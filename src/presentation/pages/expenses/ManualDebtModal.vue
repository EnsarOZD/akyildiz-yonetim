<template>
  <dialog open class="modal" @keydown.esc.prevent="handleClose">
    <div class="modal-box max-w-2xl bg-white dark:bg-[#0f1322] border border-gray-200 dark:border-white/[0.07] shadow-2xl p-0">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/[0.07]">
        <div class="flex items-center gap-3">
          <div :class="[
            'w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md',
            type === 0 ? 'bg-emerald-600' : (type === 1 ? 'bg-amber-500' : 'bg-brand-500')
          ]">
            <svg v-if="type === 0" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <svg v-else-if="type === 1" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-[#f1f3f9]">
            Manuel {{ typeLabel }} Girişi
          </h3>
        </div>
        <button @click="handleClose" class="btn btn-ghost btn-sm" :disabled="loading">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Tabs -->
      <div v-if="!initialData?.id" class="tabs tabs-boxed bg-transparent px-6 pt-4 gap-2">
        <button 
          @click="activeTab = 'individual'" 
          :class="['tab flex-1 transition-all', activeTab === 'individual' ? 'tab-active bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-white/[0.06]']"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          Bireysel Giriş
        </button>
        <button
          @click="activeTab = 'bulk'"
          :class="['tab flex-1 transition-all', activeTab === 'bulk' ? 'tab-active bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-white/[0.06]']"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Toplu Giriş
        </button>
      </div>

      <div class="p-6">
        <!-- Individual View -->
        <form v-if="activeTab === 'individual'" @submit.prevent="handleSubmit" class="space-y-5">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Daire / Ünite *</span>
            </label>
            <select 
              v-model="form.flatId" 
              class="select select-bordered w-full bg-white dark:bg-[#1c2238] border-gray-300 dark:border-white/[0.1]"
              required
              :disabled="!!initialData?.id"
            >
              <option disabled value="">Daire seçiniz</option>
              <option v-for="f in flats" :key="f.id" :value="f.id">
                {{ f.code || f.unitNumber }} ({{ f.tenantCompanyName || 'Boş' }})
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Yıl *</span></label>
              <input type="number" v-model.number="form.periodYear" class="input input-bordered w-full" required min="2020" />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Ay *</span></label>
              <select v-model.number="form.periodMonth" class="select select-bordered w-full" required>
                <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Tutar (₺) *</span></label>
              <input type="number" v-model.number="form.amount" step="0.01" class="input input-bordered w-full text-lg font-bold text-success" required min="0" />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Son Ödeme *</span></label>
              <input type="date" v-model="form.dueDate" class="input input-bordered w-full" required />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Fatura Numarası</span></label>
              <input v-model="form.invoiceNumber" type="text" class="input input-bordered w-full" placeholder="Opsiyonel fatura no..." />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Açıklama</span></label>
              <input v-model="form.description" type="text" class="input input-bordered w-full" placeholder="Opsiyonel not..." />
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-white/[0.07]">
            <button type="button" class="btn btn-outline btn-sm" @click="handleClose" :disabled="loading">İptal</button>
            <button type="submit" class="btn btn-primary btn-sm px-8" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
              {{ initialData?.id ? 'Güncelle' : 'Kaydet' }}
            </button>
          </div>
        </form>

        <!-- Bulk View -->
        <div v-else class="space-y-6">
          <div class="grid grid-cols-2 gap-4 p-4 dark:bg-base-200 rounded-xl">
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Dönem</span></label>
              <input type="month" v-model="bulkPeriod" class="input input-bordered w-full input-sm" @change="updateBulkDates" />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Son Ödeme</span></label>
              <input type="date" v-model="bulkDueDate" class="input input-bordered w-full input-sm" />
            </div>
          </div>

          <div class="overflow-x-auto max-h-[40vh] border border-gray-200 dark:border-white/[0.07] rounded-lg">
            <table class="table table-zebra table-sm">
              <thead class="sticky top-0 bg-white dark:bg-[#0f1322] z-10 shadow-sm">
                <tr>
                  <th scope="col" class="w-1/3">Daire / Kiracı</th>
                  <th scope="col" class="w-1/3 text-center">Tutar (₺)</th>
                  <th scope="col" class="w-1/3">Açıklama</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="f in bulkEntries" :key="f.id">
                  <td class="whitespace-nowrap">
                    <div class="font-bold">{{ f.code }}</div>
                    <div class="text-[10px] opacity-60">{{ f.tenantName || 'Boş' }}</div>
                  </td>
                  <td>
                    <input 
                      :id="'bulk-amount-' + f.id"
                      :name="'bulk-amount-' + f.id"
                      type="number" 
                      v-model.number="f.amount" 
                      min="0" 
                      step="0.01" 
                      class="input input-bordered input-xs w-full text-center font-bold text-success" 
                      placeholder="0.00"
                      autocomplete="off"
                    />
                  </td>
                  <td>
                    <input 
                      :id="'bulk-desc-' + f.id"
                      :name="'bulk-desc-' + f.id"
                      v-model="f.description" 
                      class="input input-bordered input-xs w-full" 
                      placeholder="Not..."
                      autocomplete="off"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-white/[0.07]">
            <button type="button" class="btn btn-outline btn-sm" @click="handleClose" :disabled="loading">İptal</button>
            <button @click="handleBulkSubmit" class="btn btn-primary btn-sm px-8" :disabled="loading || !hasBulkData">
              <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
              Toplu Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/infrastructure/services/api'
import utilityDebtsService from '@/infrastructure/services/utilityDebtsService'
import { useErrorHandler } from '@/application/composables/useErrorHandler'

const props = defineProps({
  type: { type: Number, required: true }, // 0: Aidat, 1: Electricity, 2: Water
  initialData: { type: Object, default: null }
})

const emit = defineEmits(['close', 'refresh'])
const { showSuccess } = useErrorHandler()

const loading = ref(false)
const flats = ref([])
const activeTab = ref('individual')

// Bireysel Form
const form = ref({
  id: null,
  flatId: '',
  type: props.type,
  periodYear: new Date().getFullYear(),
  periodMonth: new Date().getMonth() + 1,
  amount: 0,
  dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toISOString().split('T')[0],
  description: '',
  invoiceNumber: ''
})

// Toplu Form State
const bulkPeriod = ref(new Date().toISOString().substring(0, 7))
const bulkDueDate = ref(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toISOString().split('T')[0])
const bulkEntries = ref([])

const typeLabel = computed(() => {
  if (props.type === 0) return 'Aidat'
  if (props.type === 1) return 'Elektrik'
  return 'Su'
})
const hasBulkData = computed(() => bulkEntries.value.some(e => e.amount > 0))

// Debug watch
watch(bulkEntries, (newVal) => {
  const active = newVal.filter(e => e.amount > 0)
  if (active.length > 0) {
    console.log('Bulk Entries Changed:', active.map(a => ({ code: a.code, amount: a.amount })))
  }
}, { deep: true })

const fetchFlats = async () => {
  try {
    const list = await api.get('/flats')
    const sorted = (list || []).sort((a, b) => (a.code || '').localeCompare(b.code || ''))
    flats.value = sorted
    
    // Toplu giriş listesini hazırla
    bulkEntries.value = sorted.map(f => ({
      id: f.id,
      code: f.code || f.unitNumber,
      tenantName: f.tenantCompanyName,
      tenantId: f.tenantId,
      ownerId: f.ownerId,
      amount: 0,
      description: ''
    }))
  } catch (e) {
    console.error('Daireler yüklenemedi:', e)
  }
}

const updateBulkDates = () => {
  const [y, m] = bulkPeriod.value.split('-').map(Number)
  const date = new Date(y, m, 15) // Takip eden ayın 15'i default
  bulkDueDate.value = date.toISOString().split('T')[0]
}

const handleClose = () => {
  if (!loading.value) emit('close')
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const payload = { ...form.value }
    if (props.initialData) {
      payload.tenantId = props.initialData.tenantId
      payload.ownerId = props.initialData.ownerId
    } else {
      const selectedFlat = flats.value.find(f => f.id === form.value.flatId)
      if (selectedFlat) {
        payload.tenantId = selectedFlat.tenantId || null
        payload.ownerId = selectedFlat.ownerId || null
      }
    }

    if (payload.id) {
      await utilityDebtsService.updateUtilityDebt(payload.id, payload)
      showSuccess(`${typeLabel.value} borcu güncellendi.`)
    } else {
      await utilityDebtsService.createUtilityDebt(payload)
      showSuccess(`Yeni ${typeLabel.value} borcu eklendi.`)
    }
    emit('refresh'); emit('close')
  } catch (error) {
    console.error('Hata:', error)
  } finally {
    loading.value = false
  }
}

const handleBulkSubmit = async () => {
  const toSave = bulkEntries.value.filter(e => e.amount > 0)
  if (!toSave.length) return

  loading.value = true
  try {
    const [y, m] = bulkPeriod.value.split('-').map(Number)
    const payloadList = toSave.map(e => ({
      flatId: e.id,
      type: props.type,
      periodYear: y,
      periodMonth: m,
      amount: e.amount,
      dueDate: bulkDueDate.value,
      description: e.description || `Toplu ${typeLabel.value} girişi`,
      tenantId: e.tenantId,
      ownerId: e.ownerId
    }))

    await utilityDebtsService.createBulkUtilityDebts(payloadList)
    showSuccess(`${payloadList.length} adet ${typeLabel.value} borcu toplu olarak eklendi.`)
    emit('refresh'); emit('close')
  } catch (error) {
    console.error('Toplu kayıt hatası:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFlats()
  if (props.initialData) {
    form.value = {
      ...form.value,
      ...props.initialData,
      dueDate: props.initialData.dueDate ? new Date(props.initialData.dueDate).toISOString().split('T')[0] : form.value.dueDate,
      periodYear: props.initialData.periodYear || new Date().getFullYear(),
      periodMonth: props.initialData.periodMonth || new Date().getMonth() + 1
    }
  }
})
</script>
