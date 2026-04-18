<template>
  <div class="space-y-5">
    <!-- Başlık -->
    <PageHeader v-if="!hideHeader" title="Sistem Ayarları" subtitle="Kullanıcıları yönetin ve yetkilendirin">
      <template #icon>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </template>
      <template #actions>
        <button @click="showAddUserModal = true" class="btn btn-sm btn-primary shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Yeni Kullanıcı
        </button>
      </template>
    </PageHeader>
    <div v-else class="flex justify-end mb-4">
      <button @click="showAddUserModal = true" class="btn btn-sm btn-primary shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        Yeni Kullanıcı
      </button>
    </div>

    <!-- Kullanıcı Listesi Kartı -->
    <div class="app-card !p-0">
      <!-- Arama -->
      <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <div class="relative">
          <input
            v-model="search"
            class="input input-sm input-bordered w-full pl-9"
            placeholder="Ad, soyad veya e-posta ile ara..."
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Boş Durum -->
      <div v-if="filteredUsers.length === 0" class="py-12 text-center">
        <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Kullanıcı bulunamadı</p>
      </div>

      <!-- Kullanıcı Listesi -->
      <div v-else class="divide-y divide-slate-100 dark:divide-slate-700/50">
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="flex items-center gap-3 px-4 py-3 table-row-hover"
          :class="user.isActive === false ? 'opacity-60' : ''"
        >
          <!-- Avatar -->
          <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0 uppercase">
            {{ user.firstName?.charAt(0) }}{{ user.lastName?.charAt(0) }}
          </div>

          <!-- İsim + Email -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
              {{ user.firstName }} {{ user.lastName }}
            </p>
            <p class="text-xs text-slate-400 truncate">{{ user.email }}</p>
          </div>

          <!-- Badges -->
          <div class="hidden sm:flex items-center gap-2 shrink-0">
            <span :class="getRoleClass(user.role)" class="badge badge-sm font-medium">
              {{ user.roleLabel || ROLE_LABELS[user.role] || user.role }}
            </span>
            <span v-if="user.isActive === false" class="badge-overdue text-xs px-2 py-0.5 rounded-full font-medium">Pasif</span>
            <span v-else class="badge-active text-xs px-2 py-0.5 rounded-full font-medium">Aktif</span>
          </div>

          <!-- Firma -->
          <div class="hidden md:block text-xs text-slate-400 shrink-0 max-w-[120px] truncate">
            {{ user.companyName || '—' }}
          </div>

          <!-- Menü -->
          <div class="dropdown dropdown-end shrink-0">
            <label tabindex="0" class="btn btn-ghost btn-xs btn-circle">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
              </svg>
            </label>
            <ul tabindex="0" class="dropdown-content menu menu-sm p-1.5 shadow-lg bg-base-100 border border-slate-200 dark:border-slate-700 rounded-xl w-40 z-30">
              <li><a @click="editUser(user)" class="text-sm">Düzenle</a></li>
              <li><a @click="triggerPasswordReset(user)" class="text-sm text-warning">Şifre Sıfırla</a></li>
              <li v-if="user.isActive !== false">
                <a @click="deactivateUser(user.id)" class="text-sm text-error">Pasif Yap</a>
              </li>
              <li v-else>
                <a @click="activateUser(user.id)" class="text-sm text-success">Aktif Yap</a>
              </li>
              <li><a @click="confirmDelete(user)" class="text-sm text-error">Sil</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Kullanıcı Ekleme / Düzenleme Modal -->
    <div v-if="showAddUserModal" class="modal modal-open">
      <div class="modal-box max-w-xl">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100">
            {{ isEditMode ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle' }}
          </h3>
          <button @click="closeModal" class="btn btn-ghost btn-sm btn-circle">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div v-if="notification.message" :class="notification.type" class="p-3 rounded-lg text-sm font-medium mb-4">
          {{ notification.message }}
        </div>

        <form @submit.prevent="createUser" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label py-1"><span class="label-text font-semibold text-xs uppercase tracking-wide">Ad</span></label>
              <input type="text" v-model="newUser.firstName" class="input input-sm input-bordered w-full" required />
            </div>
            <div class="form-control">
              <label class="label py-1"><span class="label-text font-semibold text-xs uppercase tracking-wide">Soyad</span></label>
              <input type="text" v-model="newUser.lastName" class="input input-sm input-bordered w-full" required />
            </div>
          </div>

          <div class="form-control">
            <label class="label py-1"><span class="label-text font-semibold text-xs uppercase tracking-wide">E-posta</span></label>
            <input type="email" v-model="newUser.email" class="input input-sm input-bordered w-full" required />
            <label class="label py-0.5">
              <span class="label-text-alt text-slate-400">Şifre sıfırlama bağlantısı bu adrese gönderilecek</span>
            </label>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label py-1"><span class="label-text font-semibold text-xs uppercase tracking-wide">Rol</span></label>
              <select v-model="newUser.role" class="select select-sm select-bordered w-full" required>
                <option disabled value="">Rol Seçiniz</option>
                <option v-for="role in availableRoles" :key="role.code" :value="role.code">{{ role.label }}</option>
              </select>
            </div>
            <div v-if="newUser.role === 'tenant'" class="form-control">
              <label class="label py-1"><span class="label-text font-semibold text-xs uppercase tracking-wide">İlişkili Firma</span></label>
              <select v-model="newUser.companyId" class="select select-sm select-bordered w-full" required>
                <option disabled value="">Firma Seçiniz</option>
                <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">{{ tenant.companyName }}</option>
              </select>
            </div>
            <div v-if="newUser.role === 'owner'" class="form-control">
              <label class="label py-1"><span class="label-text font-semibold text-xs uppercase tracking-wide">İlişkili Mal Sahibi</span></label>
              <select v-model="newUser.companyId" class="select select-sm select-bordered w-full" required>
                <option disabled value="">Mal Sahibi Seçiniz</option>
                <option v-for="owner in owners" :key="owner.id" :value="owner.id">{{ owner.firstName }} {{ owner.lastName }}</option>
              </select>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <svg class="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-xs text-blue-700 dark:text-blue-300">Kullanıcı oluşturulduktan sonra belirtilen e-posta adresine şifre belirleme bağlantısı gönderilecektir.</p>
          </div>

          <div class="flex gap-2 justify-end pt-2">
            <button type="button" @click="closeModal" class="btn btn-sm btn-ghost">İptal</button>
            <button type="submit" class="btn btn-sm btn-primary" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner loading-xs"></span>
              {{ loading ? 'Kaydediliyor...' : (isEditMode ? 'Değişiklikleri Kaydet' : 'Kullanıcıyı Oluştur') }}
            </button>
          </div>
        </form>
      </div>
      <div class="modal-backdrop" @click="closeModal"></div>
    </div>
  </div>

  <!-- Şifre Sıfırlama Onay Modalı -->
  <ConfirmModal
    :isOpen="!!confirmResetUser"
    :title="`${confirmResetUser?.firstName} ${confirmResetUser?.lastName} — Şifre Sıfırla`"
    message="Bu kullanıcının şifresini sıfırlamak ve yeni şifreyi e-posta ile göndermek istediğinize emin misiniz?"
    confirmLabel="Evet, Sıfırla"
    confirmClass="btn-warning"
    :loading="loading"
    @confirm="onConfirmPasswordReset"
    @cancel="confirmResetUser = null"
  />

  <!-- Silme Onay Modalı -->
  <ConfirmModal
    :isOpen="!!confirmDeleteUser"
    :title="`${confirmDeleteUser?.firstName} ${confirmDeleteUser?.lastName} — Sil`"
    message="Bu kullanıcıyı tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
    confirmLabel="Evet, Sil"
    confirmClass="btn-error"
    :loading="loading"
    @confirm="onConfirmDelete"
    @cancel="confirmDeleteUser = null"
  />
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import usersService from '@/infrastructure/services/usersService'
import tenantsService from '@/infrastructure/services/tenantsService'
import ownersService from '@/infrastructure/services/ownersService'
import { useErrorHandler } from '@/application/composables/useErrorHandler'
import { ROLE_LABELS, ROLES } from '@/core/constants/roles'
import ConfirmModal from '@/presentation/components/common/ConfirmModal.vue'

const props = defineProps({
  hideHeader: { type: Boolean, default: false }
})

const { handleNetworkError, handleValidationError, showSuccess } = useErrorHandler()

const users = ref([])
const tenants = ref([])
const owners = ref([])
const search = ref('')
const showAddUserModal = ref(false)
const isEditMode = ref(false)
const selectedUser = ref(null)
const loading = ref(false)
const availableRoles = ref([])

const newUser = reactive({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  companyId: null
})

const notification = reactive({
  message: '',
  type: ''
});

const fetchTenants = async () => {
  try {
    tenants.value = await tenantsService.getTenants()
  } catch (error) {
    handleNetworkError(error)
  }
}

const fetchOwners = async () => {
  try {
    owners.value = await ownersService.getOwners()
  } catch (error) {
    handleNetworkError(error)
  }
}

const fetchUsers = async () => {
  try {
    users.value = await usersService.getUsers()
  } catch (error) {
    handleNetworkError(error)
  }
}

const deactivateUser = async (userId) => {
  try {
    await usersService.updateUser(userId, { isActive: false })
    await fetchUsers()
    showSuccess('Kullanıcı başarıyla pasif yapıldı.')
  } catch (error) {
    handleValidationError(error)
  }
}

const activateUser = async (userId) => {
  try {
    await usersService.updateUser(userId, { isActive: true })
    await fetchUsers()
    showSuccess('Kullanıcı başarıyla aktif yapıldı.')
  } catch (error) {
    handleValidationError(error)
  }
}

const closeModal = () => {
  showAddUserModal.value = false
  isEditMode.value = false
  selectedUser.value = null
  resetForm()
}

const confirmResetUser = ref(null)

const triggerPasswordReset = (user) => {
  confirmResetUser.value = user
}

const onConfirmPasswordReset = async () => {
  const user = confirmResetUser.value
  confirmResetUser.value = null
  try {
    loading.value = true
    await usersService.resetPassword(user.id)
    showSuccess('Şifre sıfırlama e-postası gönderildi.')
  } catch (error) {
    handleValidationError(error)
  } finally {
    loading.value = false
  }
}

const editUser = (user) => {
  isEditMode.value = true
  selectedUser.value = user
  newUser.firstName = user.firstName
  newUser.lastName = user.lastName
  newUser.email = user.email
  newUser.role = user.role
  newUser.companyId = user.companyId || null
  showAddUserModal.value = true
}

const confirmDeleteUser = ref(null)
const confirmDelete = (user) => {
  confirmDeleteUser.value = user
}

const onConfirmDelete = async () => {
  const user = confirmDeleteUser.value
  confirmDeleteUser.value = null
  try {
    loading.value = true
    await usersService.deleteUser(user.id)
    await fetchUsers()
    showSuccess('Kullanıcı başarıyla silindi.')
  } catch (error) {
    handleValidationError(error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  newUser.firstName = ''
  newUser.lastName = ''
  newUser.email = ''
  newUser.role = ''
  newUser.companyId = null
  notification.message = ''
}

const showNotification = (message, type) => {
  notification.message = message;
  notification.type = type === 'success' ? 'alert alert-success' : 'alert alert-error';
  setTimeout(() => {
    notification.message = '';
  }, 6000);
}

const createUser = async () => {
  if (newUser.role === ROLES.TENANT && !newUser.companyId) {
    showNotification('Kiracı rolü için bir firma seçmelisiniz.', 'error');
    return;
  }
  if (newUser.role === ROLES.OWNER && !newUser.companyId) {
    showNotification('Mal sahibi rolü için bir mal sahibi seçmelisiniz.', 'error');
    return;
  }

  if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.role) {
    showNotification('Lütfen tüm zorunlu alanları doldurun.', 'error');
    return;
  }

  loading.value = true
  
  try {
    const needsCompanyId = newUser.role === ROLES.TENANT || newUser.role === ROLES.OWNER
    const payload = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
      companyId: needsCompanyId ? newUser.companyId : null,
    }

    if (isEditMode.value && selectedUser.value) {
      await usersService.updateUser(selectedUser.value.id, payload)
      showSuccess('Kullanıcı başarıyla güncellendi.')
    } else {
      await usersService.createUser(payload)
      showSuccess(`Kullanıcı başarıyla oluşturuldu! Şifre belirleme bağlantısı ${newUser.email} adresine gönderildi.`)
    }
    
    closeModal()
    await fetchUsers()

  } catch (error) {
    console.error('Kullanıcı oluşturma hatası:', error)
    if (error.response && error.response.data) {
      if (typeof error.response.data === 'string') {
        showNotification(error.response.data, 'error');
      } else {
        handleValidationError(error)
      }
    } else {
      handleValidationError(error)
    }
  } finally {
    loading.value = false
  }
}

const fetchRoles = async () => {
  try {
    availableRoles.value = await usersService.getRoles()
  } catch (error) {
    console.error('Roller yüklenirken hata oluştu:', error)
    // Fallback? availableRoles.value can be populated from constants if API fails
  }
}

const filteredUsers = computed(() => {
  if (!search.value) {
    return users.value;
  }
  const s = search.value.toLowerCase()
  return users.value.filter(u =>
    (u.firstName && u.firstName.toLowerCase().includes(s)) ||
    (u.lastName && u.lastName.toLowerCase().includes(s)) ||
    (u.email && u.email.toLowerCase().includes(s))
  )
})

const getRoleClass = (role) => {
  switch (role) {
    case 'admin': return 'badge-primary';
    case 'manager': return 'badge-secondary';
    case 'tenant': return 'badge-accent';
    case 'observer': return 'badge-warning';
    case 'dataentry': return 'badge-info';
    default: return 'badge-neutral';
  }
}

onMounted(async () => {
  await Promise.all([
    fetchTenants(),
    fetchOwners(),
    fetchUsers(),
    fetchRoles()
  ])
})
</script> 