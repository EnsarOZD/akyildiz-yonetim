<template>
  <div class="space-y-6">
    <!-- Başlık ve Yeni Kullanıcı Butonu -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Kullanıcı Yönetimi</h2>
        <p class="text-gray-500 dark:text-gray-400">Sistem kullanıcılarını yönetin ve yeni kullanıcılar ekleyin</p>
      </div>
      <button 
        @click="showAddUserModal = true" 
        class="btn btn-primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Yeni Kullanıcı Ekle
      </button>
    </div>

    <!-- Kullanıcı Listesi -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h3 class="card-title">Kullanıcı Listesi</h3>
        
        <!-- Arama -->
        <div class="relative mb-4">
          <input 
            v-model="search" 
            class="input input-bordered w-full pl-10" 
            placeholder="Ad, soyad veya e-posta ile ara..." 
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
        </div>

        <!-- Kullanıcı Kartları -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="user in filteredUsers" 
            :key="user.id" 
            :class="[
              'bg-base-200 p-4 rounded-lg shadow transition hover:shadow-md',
              user.isActive === false ? 'opacity-60 border-l-4 border-error' : ''
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="avatar placeholder">
                  <div class="bg-neutral-focus text-neutral-content rounded-full w-12">
                    <span>{{ user.firstName?.charAt(0) }}{{ user.lastName?.charAt(0) }}</span>
                  </div>
                </div>
                <div>
                  <p class="font-bold">{{ user.firstName }} {{ user.lastName }}</p>
                  <p class="text-xs text-base-content/70">{{ user.email }}</p>
                </div>
              </div>
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-sm btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                </label>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-36">
                  <li><a>Düzenle</a></li>
                  <li v-if="user.isActive !== false">
                    <a @click="deactivateUser(user.id)" class="text-error">Pasif Yap</a>
                  </li>
                  <li v-else>
                    <a @click="activateUser(user.id)" class="text-success">Aktif Yap</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="divider my-2"></div>
            <div class="flex items-center justify-between text-xs">
              <div class="flex gap-2">
                <span :class="getRoleClass(user.role)" class="badge badge-sm font-semibold">
                  {{ ROLE_LABELS[user.role] || user.role }}
                </span>
                <span v-if="user.isActive === false" class="badge badge-error badge-sm">
                  Pasif
                </span>
                <span v-else class="badge badge-success badge-sm">
                  Aktif
                </span>
              </div>
              <span class="text-base-content/70">
                Firma: {{ user.companyName || 'Belirtilmemiş' }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="filteredUsers.length === 0" class="text-center py-10">
          <p class="text-base-content/60">Aramayla eşleşen kullanıcı bulunamadı.</p>
        </div>
      </div>
    </div>

    <!-- Yeni Kullanıcı Ekleme Modal -->
    <div v-if="showAddUserModal" class="modal modal-open">
      <div class="modal-box max-w-2xl">
        <h3 class="font-bold text-lg mb-4">Yeni Kullanıcı Ekle</h3>
        
        <div v-if="notification.message" :class="notification.type" class="p-4 rounded-md text-sm font-medium mb-4">
          {{ notification.message }}
        </div>

        <form @submit.prevent="createUser" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Ad</span>
              </label>
              <input type="text" v-model="newUser.firstName" class="input input-bordered w-full" required />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Soyad</span>
              </label>
              <input type="text" v-model="newUser.lastName" class="input input-bordered w-full" required />
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">E-posta</span>
            </label>
            <input type="email" v-model="newUser.email" class="input input-bordered w-full" required />
            <label class="label">
              <span class="label-text-alt">Şifre sıfırlama bağlantısı bu adrese gönderilecek</span>
            </label>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Rol</span>
              </label>
              <select v-model="newUser.role" class="select select-bordered w-full" required>
                <option disabled value="">Rol Seçiniz</option>
                <option v-for="(label, key) in ROLE_LABELS" :key="key" :value="key">
                  {{ label }}
                </option>
              </select>
            </div>
            
            <div v-if="newUser.role === 'tenant'" class="form-control">
              <label class="label">
                <span class="label-text font-semibold">İlişkili Firma</span>
              </label>
              <select v-model="newUser.companyId" class="select select-bordered w-full" required>
                <option disabled value="">Firma Seçiniz</option>
                <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
                  {{ tenant.company }}
                </option>
              </select>
            </div>
          </div>

          <div class="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="font-bold">Bilgilendirme</h3>
              <div class="text-xs">Kullanıcı oluşturulduktan sonra, belirtilen e-posta adresine şifre belirleme bağlantısı gönderilecektir.</div>
            </div>
          </div>

          <div class="modal-action">
            <button type="button" @click="closeModal" class="btn btn-ghost">İptal</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner"></span>
              {{ loading ? 'Kullanıcı Oluşturuluyor...' : 'Kullanıcıyı Oluştur' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { db } from '../../firebase'
import { ROLE_LABELS, ROLES } from '@/constants/roles'

const users = ref([])
const tenants = ref([])
const search = ref('')
const showAddUserModal = ref(false)
const loading = ref(false)

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
  const tenantSnap = await getDocs(collection(db, 'tenants'))
  tenants.value = tenantSnap.docs.map(doc => ({
    id: doc.id,
    company: doc.data().company
  }))
}

const fetchUsers = async () => {
  const userSnap = await getDocs(collection(db, 'users'))
  const userData = userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

  users.value = userData.map(user => {
    const matchedTenant = tenants.value.find(t => t.id === user.companyId)
    return {
      ...user,
      companyName: matchedTenant ? matchedTenant.company : null
    }
  }).sort((a,b) => a.firstName.localeCompare(b.firstName));
}

const deactivateUser = async (userId) => {
  const userToDeactivate = users.value.find(u => u.id === userId)
  
  if (!userToDeactivate) {
    alert("Kullanıcı bulunamadı.");
    return;
  }

  if (confirm(`"${userToDeactivate.firstName} ${userToDeactivate.lastName}" kullanıcısını pasif yapmak istediğinizden emin misiniz?`)) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isActive: false,
        deactivatedAt: new Date(),
        deactivatedBy: 'admin'
      })
      
      const userIndex = users.value.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        users.value[userIndex].isActive = false
        users.value[userIndex].deactivatedAt = new Date()
      }
      
      alert(`"${userToDeactivate.firstName} ${userToDeactivate.lastName}" kullanıcısı başarıyla pasif yapıldı.`)
      
    } catch (error) {
      console.error("Kullanıcı pasif yapma hatası:", error)
      alert("Kullanıcı pasif yapılırken bir hata oluştu.")
    }
  }
}

const activateUser = async (userId) => {
  const userToActivate = users.value.find(u => u.id === userId)
  
  if (!userToActivate) {
    alert("Kullanıcı bulunamadı.");
    return;
  }

  if (confirm(`"${userToActivate.firstName} ${userToActivate.lastName}" kullanıcısını aktif yapmak istediğinizden emin misiniz?`)) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isActive: true,
        deactivatedAt: null,
        deactivatedBy: null
      })
      
      const userIndex = users.value.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        users.value[userIndex].isActive = true
        users.value[userIndex].deactivatedAt = null
      }
      
      alert(`"${userToActivate.firstName} ${userToActivate.lastName}" kullanıcısı başarıyla aktif yapıldı.`)
      
    } catch (error) {
      console.error("Kullanıcı aktif yapma hatası:", error)
      alert("Kullanıcı aktif yapılırken bir hata oluştu.")
    }
  }
}

const closeModal = () => {
  showAddUserModal.value = false
  resetForm()
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

  if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.role) {
    showNotification('Lütfen tüm zorunlu alanları doldurun.', 'error');
    return;
  }

  loading.value = true
  const auth = getAuth()
  
  try {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let tempPassword = '';
    for (let i = 0; i < 12; i++) {
      tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, tempPassword)
    const user = userCredential.user

    await updateDoc(doc(db, 'users', user.uid), {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
      companyId: newUser.role === ROLES.TENANT ? newUser.companyId : null,
      createdAt: new Date(),
      isActive: true,
      requiresPasswordReset: true
    })
    
    await sendPasswordResetEmail(auth, newUser.email)
    
    showNotification(
      `Kullanıcı başarıyla oluşturuldu! Şifre belirleme bağlantısı ${newUser.email} adresine gönderildi.`, 
      'success'
    );
    
    closeModal()
    await fetchUsers()

  } catch (error) {
    console.error("Kullanıcı oluşturma hatası:", error)
    
    let errorMessage = "Kullanıcı oluşturulurken bir hata oluştu.";
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "Bu e-posta adresi zaten kullanımda. Lütfen farklı bir e-posta adresi deneyin.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Geçersiz e-posta adresi. Lütfen doğru bir e-posta adresi girin.";
    }
    
    showNotification(errorMessage, 'error');
  } finally {
    loading.value = false
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
    default: return 'badge-ghost';
  }
}

onMounted(async () => {
  await Promise.all([
    fetchTenants(),
    fetchUsers()
  ])
})
</script> 