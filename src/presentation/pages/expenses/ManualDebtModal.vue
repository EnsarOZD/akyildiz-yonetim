<template>
  <BaseModal
    :model-value="true"
    :title="`MANUEL ${typeLabel} GİRİŞİ`"
    :icon="type === 0 ? '📊' : (type === 1 ? '⚡' : '💧')"
    size="lg"
    @close="handleClose"
  >
    <div class="space-y-6">
      <!-- Tabs (Sadece Yeni Kayıtta) -->
      <div v-if="!initialData?.id" class="flex p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl gap-1">
        <button 
          @click="activeTab = 'individual'" 
          :class="['flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all', 
                   activeTab === 'individual' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-[#626885] hover:text-[#f1f3f9] hover:bg-white/[0.05]']"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          Bireysel Giriş
        </button>
        <button
          @click="activeTab = 'bulk'"
          :class="['flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all', 
                   activeTab === 'bulk' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-[#626885] hover:text-[#f1f3f9] hover:bg-white/[0.05]']"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Toplu Giriş
        </button>
      </div>

      <!-- Bireysel Görünüm -->
      <form v-if="activeTab === 'individual'" @submit.prevent="handleSubmit" class="space-y-6">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Daire / Ünite *</span>
          </label>
          <select 
            v-model="form.flatId" 
            class="select select-bordered w-full"
            required
            :disabled="!!initialData?.id"
          >
            <option disabled value="">Daire seçiniz</option>
            <option v-for="f in flats" :key="f.id" :value="f.id">
              {{ f.code || f.unitNumber }} ({{ f.tenantCompanyName || 'Boş' }})
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-5">
          <div class="form-control">
            <label class="label"><span class="label-text">Yıl *</span></label>
            <input type="number" v-model.number="form.periodYear" class="input input-bordered w-full font-bold" required min="2020" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Ay *</span></label>
            <select v-model.number="form.periodMonth" class="select select-bordered w-full font-bold" required>
              <option v-for="m in 12" :key="m" :value="m">{{ m }}. Ay</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-5">
          <div class="form-control">
            <label class="label"><span class="label-text">Tutar *</span></label>
            <div class="relative">
              <input type="number" v-model.number="form.amount" step="0.01" class="input input-bordered w-full !text-lg font-black pr-12 text-green-400" required min="0.01" />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[#626885] font-black uppercase tracking-widest text-[10px]">TL</span>
            </div>
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Son Ödeme *</span></label>
            <input type="date" v-model="form.dueDate" class="input input-bordered w-full" required />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="form-control">
            <label class="label"><span class="label-text">Fatura / Makbuz No</span></label>
            <input v-model="form.invoiceNumber" type="text" class="input input-bordered w-full" placeholder="Belge no (opsiyonel)" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Açıklama</span></label>
            <input v-model="form.description" type="text" class="input input-bordered w-full" placeholder="Ek notlar (opsiyonel)" />
          </div>
        </div>
      </form>

      <!-- Toplu Görünüm -->
      <div v-else class="space-y-6">
        <div class="bg-white/[0.02] border border-white/[0.08] p-5 rounded-2xl grid grid-cols-2 gap-5">
          <div class="form-control">
            <label class="label"><span class="label-text">Dönem Seçimi</span></label>
            <input type="month" v-model="bulkPeriod" class="input input-bordered w-full" @change="updateBulkDates" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Son Ödeme Tarihi</span></label>
            <input type="date" v-model="bulkDueDate" class="input input-bordered w-full" />
          </div>
        </div>

        <div class="overflow-x-auto max-h-[40vh] border border-white/[0.08] rounded-2xl">
          <table class="table table-sm w-full border-collapse">
            <thead class="sticky top-0 bg-[#151a2e] z-10">
              <tr class="border-b border-white/[0.08]">
                <th class="py-4 px-5 text-[10px] font-black text-[#626885] uppercase tracking-widest">Daire / Kiracı</th>
                <th class="py-4 px-5 text-[10px] font-black text-[#626885] uppercase tracking-widest text-center">Tutar (₺)</th>
                <th class="py-4 px-5 text-[10px] font-black text-[#626885] uppercase tracking-widest">Açıklama</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/[0.02]">
              <tr v-for="f in bulkEntries" :key="f.id" class="group hover:bg-white/[0.02] transition-colors">
                <td class="px-5 py-3">
                  <div class="text-[13px] font-black text-[#f1f3f9] uppercase tracking-tight">{{ f.code }}</div>
                  <div class="text-[10px] font-bold text-[#626885] uppercase tracking-tighter">{{ f.tenantName || 'Boş Daire' }}</div>
                </td>
                <td class="px-5 py-3">
                  <input 
                    type="number" 
                    v-model.number="f.amount" 
                    min="0" 
                    step="0.01" 
                    class="input input-bordered input-sm w-full text-center font-black text-green-400 !bg-white/[0.02]" 
                    placeholder="0.00"
                  />
                </td>
                <td class="px-5 py-3">
                  <input 
                    v-model="f.description" 
                    class="input input-bordered input-sm w-full !bg-white/[0.02]" 
                    placeholder="Not..."
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Footer Butonları -->
    <template #footer>
      <button 
        type="button" 
        class="btn btn-ghost !bg-transparent border border-white/[0.08] text-[#9aa0b4] hover:bg-white/[0.05]" 
        @click="handleClose" 
        :disabled="loading"
      >
        Vazgeç
      </button>
      
      <button 
        v-if="activeTab === 'individual'" 
        @click="handleSubmit" 
        class="btn btn-primary px-10" 
        :disabled="loading"
      >
        <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
        <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
        </svg>
        {{ initialData?.id ? 'Değişiklikleri Kaydet' : 'Borcu Kaydet' }}
      </button>

      <button 
        v-else 
        @click="handleBulkSubmit" 
        class="btn btn-primary px-10" 
        :disabled="loading || !hasBulkData"
      >
        <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
        <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
        </svg>
        Toplu Girişi Tamamla
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
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
  amount: '',
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
