<template>
  <div class="p-4 sm:p-6 min-h-screen pb-24 md:pb-6">

    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="page-title">Talepler</h1>
        <p class="page-subtitle">Bakım ve hizmet talepleri</p>
      </div>
      <button v-if="canCreate" @click="showCreate = true"
        class="btn btn-sm btn-primary shrink-0">
        + Yeni Talep
      </button>
    </div>

    <!-- Filtre -->
    <div class="flex gap-2 mb-4 flex-wrap">
      <button v-for="f in filters" :key="f.value"
        @click="activeFilter = f.value; loadRequests()"
        :class="['btn btn-sm', activeFilter === f.value ? 'btn-primary' : 'btn-ghost']">
        {{ f.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-md text-primary"></span>
    </div>

    <!-- Boş -->
    <div v-else-if="requests.length === 0" class="app-card p-12 text-center">
      <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <p class="text-sm font-medium text-slate-600 dark:text-slate-300">Talep bulunmamaktadır.</p>
    </div>

    <!-- Liste -->
    <div v-else class="space-y-3">
      <div v-for="req in requests" :key="req.id"
        class="app-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="flex items-start gap-3 min-w-0">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            :class="categoryClass(req.category)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ req.title }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{{ req.description }}</p>
            <div class="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-400">
              <span>{{ formatDate(req.createdAt) }}</span>
              <span v-if="req.tenantName || req.ownerName" class="text-slate-300 dark:text-slate-600">·</span>
              <span v-if="req.tenantName || req.ownerName">{{ req.tenantName || req.ownerName }}</span>
              <span v-if="req.adminNote" class="text-slate-300 dark:text-slate-600">·</span>
              <span v-if="req.adminNote" class="italic">{{ req.adminNote }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:flex-shrink-0">
          <span :class="statusBadge(req.status)" class="badge badge-sm">{{ statusLabel(req.status) }}</span>
          <!-- Yönetici durum değiştirme -->
          <div v-if="canManage && req.status !== 'Closed'" class="dropdown dropdown-end">
            <button tabindex="0" class="btn btn-xs btn-ghost">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            <ul tabindex="0" class="dropdown-content z-[1] menu p-1.5 shadow-card-lg bg-white dark:bg-slate-800 rounded-xl w-40 border border-slate-200 dark:border-slate-700 text-sm">
              <li v-if="req.status === 'Open'"><a @click="updateStatus(req.id, 'InProgress')" class="rounded-lg text-slate-700 dark:text-slate-200">İşleme Al</a></li>
              <li><a @click="openClose(req)" class="rounded-lg text-slate-700 dark:text-slate-200">Kapat</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Yeni Talep Modal -->
    <div v-if="showCreate" class="modal modal-open">
      <div class="modal-box max-w-md">
        <h3 class="font-bold text-lg mb-4">Yeni Talep Oluştur</h3>
        <div class="space-y-3">
          <div>
            <label class="label label-text text-xs font-semibold">Başlık</label>
            <input v-model="form.title" type="text" placeholder="Kısa başlık girin" class="input input-bordered input-sm w-full" maxlength="200" />
          </div>
          <div>
            <label class="label label-text text-xs font-semibold">Kategori</label>
            <select v-model="form.category" class="select select-bordered select-sm w-full">
              <option value="Maintenance">Bakım / Tamir</option>
              <option value="Cleaning">Temizlik</option>
              <option value="Noise">Gürültü</option>
              <option value="Security">Güvenlik</option>
              <option value="Other">Diğer</option>
            </select>
          </div>
          <div>
            <label class="label label-text text-xs font-semibold">Açıklama</label>
            <textarea v-model="form.description" class="textarea textarea-bordered textarea-sm w-full" rows="3" placeholder="Detayları açıklayın" maxlength="2000"></textarea>
          </div>
        </div>
        <div class="modal-action mt-4">
          <button @click="showCreate = false" class="btn btn-ghost btn-sm">İptal</button>
          <button @click="submitCreate" :disabled="submitting" class="btn btn-primary btn-sm">
            <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
            Gönder
          </button>
        </div>
      </div>
      <div class="modal-backdrop" @click="showCreate = false"></div>
    </div>

    <!-- Kapat Modal -->
    <div v-if="closeTarget" class="modal modal-open">
      <div class="modal-box max-w-sm">
        <h3 class="font-bold text-base mb-3">Talebi Kapat</h3>
        <div>
          <label class="label label-text text-xs font-semibold">Kapatma Notu (isteğe bağlı)</label>
          <textarea v-model="closeNote" class="textarea textarea-bordered textarea-sm w-full" rows="2" maxlength="1000"></textarea>
        </div>
        <div class="modal-action mt-3">
          <button @click="closeTarget = null; closeNote = ''" class="btn btn-ghost btn-sm">İptal</button>
          <button @click="submitClose" :disabled="submitting" class="btn btn-error btn-sm">
            <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
            Kapat
          </button>
        </div>
      </div>
      <div class="modal-backdrop" @click="closeTarget = null"></div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/application/stores/auth'
import serviceRequestsService from '@/infrastructure/services/serviceRequestsService'

const authStore = useAuthStore()
const userRole = computed(() => authStore.role?.toLowerCase())

const canCreate = computed(() => ['tenant', 'owner', 'admin', 'manager'].includes(userRole.value))
const canManage = computed(() => ['admin', 'manager', 'dataentry'].includes(userRole.value))

const filters = [
  { label: 'Tümü', value: '' },
  { label: 'Açık', value: 'Open' },
  { label: 'İşlemde', value: 'InProgress' },
  { label: 'Kapalı', value: 'Closed' },
]

const activeFilter = ref('')
const requests = ref([])
const loading = ref(true)
const showCreate = ref(false)
const submitting = ref(false)
const closeTarget = ref(null)
const closeNote = ref('')
const form = ref({ title: '', description: '', category: 'Other' })

const loadRequests = async () => {
  loading.value = true
  try {
    const result = await serviceRequestsService.getServiceRequests(activeFilter.value || null)
    requests.value = result || []
  } catch (err) {
    console.error('Talepler yüklenemedi:', err)
  } finally {
    loading.value = false
  }
}

const submitCreate = async () => {
  if (!form.value.title.trim() || !form.value.description.trim()) return
  submitting.value = true
  try {
    await serviceRequestsService.createServiceRequest(form.value)
    showCreate.value = false
    form.value = { title: '', description: '', category: 'Other' }
    await loadRequests()
  } catch (err) {
    console.error('Talep oluşturulamadı:', err)
  } finally {
    submitting.value = false
  }
}

const updateStatus = async (id, status, adminNote = null) => {
  try {
    await serviceRequestsService.updateStatus(id, status, adminNote)
    await loadRequests()
  } catch (err) {
    console.error('Durum güncellenemedi:', err)
  }
}

const openClose = (req) => { closeTarget.value = req; closeNote.value = '' }
const submitClose = async () => {
  submitting.value = true
  try {
    await serviceRequestsService.updateStatus(closeTarget.value.id, 'Closed', closeNote.value || null)
    closeTarget.value = null
    closeNote.value = ''
    await loadRequests()
  } finally {
    submitting.value = false
  }
}

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const statusLabel = (s) => ({ Open: 'Açık', InProgress: 'İşlemde', Closed: 'Kapalı' }[s] ?? s)
const statusBadge = (s) => ({
  Open: 'badge-info',
  InProgress: 'badge-warning',
  Closed: 'badge-ghost',
}[s] ?? 'badge-ghost')
const categoryClass = (c) => ({
  Maintenance: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  Cleaning: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  Noise: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  Security: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
  Other: 'bg-slate-100 dark:bg-slate-700 text-slate-500',
}[c] ?? 'bg-slate-100 dark:bg-slate-700 text-slate-500')

onMounted(loadRequests)
</script>
