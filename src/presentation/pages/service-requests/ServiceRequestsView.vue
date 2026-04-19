<template>
  <div class="p-4 sm:p-6 min-h-screen pb-24 md:pb-6">

    <PageHeader title="Talep Yönetimi" subtitle="Bakım, hizmet ve teknik talepleri buradan takip edin ve yönetin">
      <template #icon>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </template>
      <template #actions>
        <button v-if="canCreate" @click="showCreate = true"
          class="btn btn-sm btn-primary shrink-0 transition-all duration-300 hover:scale-105 px-4 h-10 shadow-lg shadow-blue-500/20">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Yeni Talep Oluştur
        </button>
      </template>
    </PageHeader>

    <!-- Filtreler -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div class="flex p-1.5 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/[0.04] shadow-sm">
        <button v-for="f in filters" :key="f.value"
          @click="activeFilter = f.value; loadRequests()"
          :class="[
            'px-5 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-300',
            activeFilter === f.value 
              ? 'bg-white dark:bg-brand-500 text-brand-600 dark:text-white shadow-xl shadow-brand-500/10' 
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          ]">
          {{ f.label }}
        </button>
      </div>
      
      <div class="flex items-center gap-2">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{{ requests.length }} talep gösteriliyor</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="i in 4" :key="i" class="app-card animate-pulse h-32"></div>
    </div>

    <!-- Boş Durum -->
    <div v-else-if="requests.length === 0" class="app-card p-16 text-center border-dashed border-2">
      <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-[#151a2e] text-slate-300 flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 class="text-base font-bold text-slate-800 dark:text-[#f1f3f9]">Henüz talep yok</h3>
      <p class="text-sm text-slate-500 mt-1 max-w-xs mx-auto">Herhangi bir arıza, temizlik veya güvenlik talebiniz olduğunda buradan kolayca iletebilirsiniz.</p>
      <button @click="showCreate = true" class="btn btn-sm btn-ghost text-brand-500 mt-4">Yeni Talep Oluştur</button>
    </div>

    <!-- Hizmet Talebi Listesi -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="req in requests" :key="req.id"
        class="app-card group hover:shadow-2xl hover:shadow-brand-500/5 transition-all duration-500 border-l-[6px] !p-6"
        :class="statusBorder(req.status)">
        
        <div class="flex items-start gap-5">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-current/10 transition-transform group-hover:scale-110"
            :class="categoryClass(req.category)">
            <component :is="categoryIcon(req.category)" class="w-7 h-7" />
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-3 mb-2">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-[#626885]">{{ categoryLabel(req.category) }}</span>
              <span :class="statusBadge(req.status)" class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                {{ statusLabel(req.status) }}
              </span>
            </div>
            
            <h3 class="text-[15px] font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight truncate mb-2 group-hover:text-brand-500 transition-colors">{{ req.title }}</h3>
            <p class="text-xs font-bold text-slate-500 dark:text-[#9aa0b4] line-clamp-2 mb-4 leading-relaxed uppercase">{{ req.description }}</p>
            
            <div class="flex flex-wrap items-center gap-y-3 gap-x-5 pt-4 border-t border-slate-100 dark:border-white/[0.04]">
              <div class="flex items-center gap-2 min-w-0">
                <div class="w-6 h-6 rounded-xl bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center text-[10px] font-black text-slate-500 overflow-hidden ring-2 ring-white dark:ring-[#1c2238] shadow-sm">
                  <span v-if="!(req.tenantName || req.ownerName || req.firstName)">?</span>
                  <img v-else-if="req.userPhoto" :src="req.userPhoto" class="w-full h-full object-cover">
                  <span v-else>{{ (req.tenantName || req.ownerName || req.firstName || '?').charAt(0) }}</span>
                </div>
                <span class="text-[11px] font-black text-slate-700 dark:text-[#f1f3f9] uppercase tracking-tight truncate">{{ req.tenantName || req.ownerName || 'Bilinmiyor' }}</span>
              </div>
              
              <div class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-[11px] font-bold text-slate-400 dark:text-[#626885] tabular-nums uppercase">{{ formatDate(req.createdAt) }}</span>
              </div>

              <!-- Atanan Personel -->
              <div v-if="req.assignedPersonnelName" class="flex items-center gap-2 px-2 py-0.5 bg-brand-50 dark:bg-brand-500/10 rounded-lg">
                <div class="w-4 h-4 rounded-lg bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
                  <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
                <span class="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-tighter">{{ req.assignedPersonnelName }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- İşlemler -->
        <div v-if="canManage" class="mt-5 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/[0.04]">
          <button v-if="!req.assignedPersonnelId && req.status !== 'Closed'" 
            @click="openAssign(req)" 
            class="btn btn-xs h-8 bg-brand-50 hover:bg-brand-100 text-brand-600 border-none rounded-xl px-4 text-[10px] font-black uppercase tracking-widest">
            <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
            Personel Ata
          </button>
          
          <div class="dropdown dropdown-end">
            <button tabindex="0" class="btn btn-xs btn-ghost hover:bg-slate-100 dark:hover:bg-white/[0.06] rounded-lg">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            <ul tabindex="0" class="dropdown-content z-[1] menu p-1.5 shadow-xl bg-white dark:bg-[#0f1322] rounded-xl w-44 border border-slate-200 dark:border-white/[0.07] text-xs">
              <li v-if="req.status === 'Open'"><a @click="updateStatus(req.id, 'InProgress')" class="rounded-lg py-2"><svg class="w-3.5 h-3.5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg> İşleme Al</a></li>
              <li v-if="req.status === 'InProgress'"><a @click="openResolve(req)" class="rounded-lg py-2"><svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Tamamlandı Olarak İşaretle</a></li>
              <li v-if="req.status !== 'Closed'"><div class="divider my-0"></div></li>
              <li v-if="req.status !== 'Closed'"><a @click="openClose(req)" class="rounded-lg py-2 text-error"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Talebi Kapat</a></li>
              <li v-if="isAdmin"><a @click="openDelete(req)" class="rounded-lg py-2 text-error font-bold bg-error/5"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> Talebi Kalıcı Olarak Sil</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Yeni Talep Modal -->
    <div v-if="showCreate" class="modal modal-open">
      <div class="modal-box max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/30">
        <h3 class="font-bold text-xl mb-1 text-slate-800 dark:text-white">Yeni Talep</h3>
        <p class="text-xs text-slate-500 mb-6">Arıza veya hizmet talebinizi aşağıdan iletebilirsiniz.</p>
        
        <div class="space-y-4">
          <div class="form-control">
            <label class="label py-1"><span class="label-text text-xs font-bold text-slate-500 uppercase">Talep Başlığı</span></label>
            <input v-model="form.title" type="text" placeholder="Kısa ve öz bir başlık..." class="input input-bordered bg-slate-50 dark:bg-slate-800/50 w-full focus:ring-2 focus:ring-brand-500/20" />
          </div>
          
          <div class="form-control">
            <label class="label py-1"><span class="label-text text-xs font-bold text-slate-500 uppercase">Kategori</span></label>
            <select v-model="form.category" class="select select-bordered bg-slate-50 dark:bg-slate-800/50 w-full">
              <option value="Maintenance">Bakım / Tamir</option>
              <option value="Cleaning">Temizlik</option>
              <option value="Noise">Gürültü / Şikayet</option>
              <option value="Security">Güvenlik</option>
              <option value="Other">Diğer</option>
            </select>
          </div>
          
          <div class="form-control">
            <label class="label py-1"><span class="label-text text-xs font-bold text-slate-500 uppercase">Açıklama</span></label>
            <textarea v-model="form.description" class="textarea textarea-bordered bg-slate-50 dark:bg-slate-800/50 w-full h-24" placeholder="Lütfen detayları belirtin..."></textarea>
          </div>
        </div>
        
        <div class="modal-action mt-8">
          <button @click="showCreate = false" class="btn btn-ghost">İptal</button>
          <button @click="submitCreate" :disabled="submitting || !form.title || !form.description" class="btn btn-primary px-8">
            <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
            Talebi Gönder
          </button>
        </div>
      </div>
      <div class="modal-backdrop bg-slate-900/40 backdrop-blur-sm" @click="showCreate = false"></div>
    </div>

    <!-- Personel Ata Modal -->
    <div v-if="assignTarget" class="modal modal-open">
      <div class="modal-box max-w-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
        <h3 class="font-bold text-lg mb-4 text-slate-800 dark:text-white">Personel Atama</h3>
        <p class="text-xs text-slate-500 mb-4 font-medium italic">"{{ assignTarget.title }}"</p>
        
        <div class="form-control mb-6">
          <label class="label py-1"><span class="label-text text-xs font-bold text-slate-500 uppercase">Görevlendirilecek Personel</span></label>
          <div v-if="personnelLoading" class="flex justify-center py-4">
            <span class="loading loading-spinner loading-sm text-brand-500"></span>
          </div>
          <select v-else v-model="selectedPersonnelId" class="select select-bordered w-full bg-slate-50 dark:bg-slate-800/50">
            <option value="">Lütfen seçim yapın...</option>
            <option v-for="p in personnel" :key="p.id" :value="p.id">{{ p.firstName }} {{ p.lastName }}</option>
          </select>
        </div>
        
        <div class="modal-action">
          <button @click="assignTarget = null" class="btn btn-ghost btn-sm">Vazgeç</button>
          <button @click="submitAssign" :disabled="!selectedPersonnelId || submitting" class="btn btn-primary btn-sm px-6">
            <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
            Atama Yap
          </button>
        </div>
      </div>
      <div class="modal-backdrop" @click="assignTarget = null"></div>
    </div>

    <!-- Tamamlandı Modal (Çözüm Notu) -->
    <div v-if="resolveTarget" class="modal modal-open">
      <div class="modal-box max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
        <h3 class="font-bold text-lg mb-2 text-emerald-600">Talep Tamamlandı</h3>
        <p class="text-xs text-slate-500 mb-6">Hizmetin nasıl tamamlandığına dair kısa bir not ekleyebilirsiniz.</p>
        
        <div class="form-control">
          <label class="label py-1"><span class="label-text text-xs font-bold text-slate-500 uppercase">Çözüm Notu</span></label>
          <textarea v-model="resolutionNote" class="textarea textarea-bordered bg-slate-50 dark:bg-slate-800/50 w-full h-24" placeholder="Yapılan işlemi açıklayın..."></textarea>
        </div>
        
        <div class="modal-action mt-6">
          <button @click="resolveTarget = null" class="btn btn-ghost btn-sm">İptal</button>
          <button @click="submitResolve" :disabled="submitting" class="btn btn-success btn-sm px-8 text-white">
            <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
            Tamamla
          </button>
        </div>
      </div>
      <div class="modal-backdrop" @click="resolveTarget = null"></div>
    </div>

    <!-- Kapat Modal -->
    <div v-if="closeTarget" class="modal modal-open">
      <div class="modal-box max-w-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
        <h3 class="font-bold text-base mb-1 text-red-500">Talebi Kapat</h3>
        <p class="text-xs text-slate-500 mb-4 italic">Talep kalıcı olarak arşive alınacaktır.</p>
        
        <div class="form-control">
          <label class="label py-1"><span class="label-text text-xs font-bold text-slate-500 uppercase">Kapatma Nedeni</span></label>
          <textarea v-model="closeNote" class="textarea textarea-bordered bg-slate-50 dark:bg-slate-800/50 w-full h-20" placeholder="İsteğe bağlı not..."></textarea>
        </div>
        
        <div class="modal-action mt-6">
          <button @click="closeTarget = null" class="btn btn-ghost btn-sm">Vazgeç</button>
          <button @click="submitClose" :disabled="submitting" class="btn btn-error btn-sm px-8 text-white">
            <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
            Kapat
          </button>
        </div>
      </div>
      <div class="modal-backdrop" @click="closeTarget = null"></div>
    </div>

    <!-- Silme Modal -->
    <div v-if="deleteTarget" class="modal modal-open">
      <div class="modal-box max-w-sm bg-white dark:bg-[#0f1322] border-2 border-error/20">
        <div class="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <h3 class="font-bold text-lg text-center text-slate-800 dark:text-white">Talebi Sil?</h3>
        <p class="text-xs text-center text-slate-500 mt-2 mb-6">Bu işlem geri alınamaz. Talebe ait tüm veriler ve fotoğraflar listeden kaldırılacaktır.</p>
        
        <div class="flex gap-2">
          <button @click="deleteTarget = null" class="btn btn-sm flex-1 btn-ghost">Vazgeç</button>
          <button @click="submitDelete" :disabled="submitting" class="btn btn-sm flex-1 btn-error text-white px-6">
            <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
            Evet, Sil
          </button>
        </div>
      </div>
      <div class="modal-backdrop bg-slate-900/60" @click="deleteTarget = null"></div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, markRaw, defineComponent, h } from 'vue'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import { useAuthStore } from '@/application/stores/auth'
import serviceRequestsService from '@/infrastructure/services/serviceRequestsService'
import usersService from '@/infrastructure/services/usersService'
import { useNotify } from '@/application/composables/useNotify'

const authStore = useAuthStore()
const { notifySuccess, notifyError } = useNotify()

const userRole = computed(() => authStore.role?.toLowerCase())
const isAdmin = computed(() => userRole.value === 'admin')
const canCreate = computed(() => ['tenant', 'owner', 'admin', 'manager'].includes(userRole.value))
const canManage = computed(() => ['admin', 'manager', 'dataentry'].includes(userRole.value))

const filters = [
  { label: 'Tümü', value: '' },
  { label: 'Açık', value: 'Open' },
  { label: 'İşlemde', value: 'InProgress' },
  { label: 'Çözüldü', value: 'Resolved' },
  { label: 'Kapalı', value: 'Closed' },
]

const activeFilter = ref('')
const requests = ref([])
const loading = ref(true)
const showCreate = ref(false)
const submitting = ref(false)

// Modals
const closeTarget = ref(null)
const closeNote = ref('')
const assignTarget = ref(null)
const selectedPersonnelId = ref('')
const resolveTarget = ref(null)
const resolutionNote = ref('')
const deleteTarget = ref(null)

// Form
const form = ref({ title: '', description: '', category: 'Other' })
const personnel = ref([])
const personnelLoading = ref(false)

/** Veri Yükleme */
const loadRequests = async () => {
  loading.value = true
  try {
    const result = await serviceRequestsService.getServiceRequests(activeFilter.value || null)
    requests.value = result || []
  } catch (err) {
    console.error('Talepler yüklenemedi:', err)
    notifyError('Talepler listesi alınırken bir hata oluştu.')
  } finally {
    loading.value = false
  }
}

const loadPersonnel = async () => {
  if (personnel.value.length > 0) return
  personnelLoading.value = true
  try {
    // Sadece personelleri getir (Admin/Manager role de personel sayılabilir)
    const allUsers = await usersService.getUsers()
    personnel.value = allUsers.filter(u => 
      ['admin', 'manager', 'staff', 'technician'].includes(u.role?.toLowerCase())
    )
  } finally {
    personnelLoading.value = false
  }
}


/** CRUD & İş Akışı */
const submitCreate = async () => {
  submitting.value = true
  try {
    await serviceRequestsService.createServiceRequest(form.value)
    notifySuccess('Talebiniz başarıyla oluşturuldu.')
    showCreate.value = false
    form.value = { title: '', description: '', category: 'Other' }
    await loadRequests()
  } catch (err) {
    notifyError('Talep gönderilemedi: ' + (err.message || 'Bilinmeyen hata'))
  } finally {
    submitting.value = false
  }
}

const openAssign = (req) => {
  assignTarget.value = req
  selectedPersonnelId.value = req.assignedPersonnelId || ''
  loadPersonnel()
}

const submitAssign = async () => {
  submitting.value = true
  try {
    await serviceRequestsService.assignPersonnel(assignTarget.value.id, selectedPersonnelId.value)
    notifySuccess('Personel ataması yapıldı.')
    assignTarget.value = null
    await loadRequests()
  } finally {
    submitting.value = false
  }
}

const openResolve = (req) => {
  resolveTarget.value = req
  resolutionNote.value = ''
}

const submitResolve = async () => {
  submitting.value = true
  try {
    await serviceRequestsService.resolveRequest(resolveTarget.value.id, resolutionNote.value)
    notifySuccess('Talep çözüldü olarak işaretlendi.')
    resolveTarget.value = null
    await loadRequests()
  } finally {
    submitting.value = false
  }
}

const updateStatus = async (id, status, adminNote = null) => {
  try {
    await serviceRequestsService.updateStatus(id, status, adminNote)
    notifySuccess('Talep durumu güncellendi.')
    await loadRequests()
  } catch (err) {
    notifyError('İşlem başarısız.')
  }
}

const openClose = (req) => { closeTarget.value = req; closeNote.value = '' }
const submitClose = async () => {
  submitting.value = true
  try {
    await serviceRequestsService.updateStatus(closeTarget.value.id, 'Closed', closeNote.value || null)
    notifySuccess('Talep kapatıldı.')
    closeTarget.value = null
    await loadRequests()
  } finally {
    submitting.value = false
  }
}

const openDelete = (req) => { deleteTarget.value = req }
const submitDelete = async () => {
  submitting.value = true
  try {
    await serviceRequestsService.deleteServiceRequest(deleteTarget.value.id)
    notifySuccess('Talep başarıyla silindi.')
    deleteTarget.value = null
    await loadRequests()
  } catch (err) {
    notifyError('Talep silinemedi. Sadece yöneticiler silebilir.')
  } finally {
    submitting.value = false
  }
}

/** Helpers */
const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const statusLabel = (s) => ({ Open: 'Yeni', InProgress: 'İşlemde', Resolved: 'Çözüldü', Closed: 'Kapalı' }[s] ?? s)
const statusBadge = (s) => ({
  Open: 'bg-brand-100 text-brand-600 dark:bg-brand-500/[0.12] dark:text-brand-400',
  InProgress: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  Resolved: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  Closed: 'bg-slate-100 text-slate-500 dark:bg-[#151a2e] dark:text-[#9aa0b4]',
}[s] ?? 'bg-slate-100 text-slate-400')

const statusBorder = (s) => ({
  Open: 'border-l-brand-500',
  InProgress: 'border-l-amber-500',
  Resolved: 'border-l-emerald-500',
  Closed: 'border-l-slate-300 dark:border-l-[#151a2e]',
}[s] ?? 'border-l-transparent')

const categoryLabel = (c) => ({
  Maintenance: 'Bakım & Onarım',
  Cleaning: 'Temizlik',
  Noise: 'Gürültü & Şikayet',
  Security: 'Güvenlik',
  Other: 'Diğer',
}[c] ?? 'Talep')

/** İkon Yönetimi */
const categoryIcon = (c) => {
  const icons = {
    Maintenance: markRaw(defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })]) })),
    Cleaning: markRaw(defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' })]) })),
    Noise: markRaw(defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z' })]) })),
    Security: markRaw(defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })]) })),
    Other: markRaw(defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' })]) })),
  }
  return icons[c] || icons.Other
}

const categoryClass = (c) => ({
  Maintenance: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
  Cleaning: 'bg-brand-100 text-brand-600 dark:bg-blue-900/40 dark:text-brand-400',
  Noise: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
  Security: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400',
  Other: 'bg-slate-100 text-slate-500 dark:bg-[#1c2238] dark:text-[#9aa0b4]',
}[c] ?? 'bg-slate-100 text-slate-500')

onMounted(loadRequests)
</script>
