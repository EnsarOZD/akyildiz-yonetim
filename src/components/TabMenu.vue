<template>
  <nav class="bg-gray-800 px-6 py-4 border-b border-gray-700 flex flex-col md:flex-row justify-center items-center gap-3 text-white">
    <!-- Sekmeler -->
    <div class="flex flex-wrap justify-center gap-4">
      <router-link
        v-for="tab in tabs"
        :key="tab.value"
        :to="tab.route"
        class="btn btn-md transition"
        :class="$route.path === tab.route ? 'btn-primary btn-outline' : 'btn-outline btn-info'"
      >
        {{ tab.label }}
      </router-link>
    </div>
  </nav>
  
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { signOut } from 'firebase/auth'

const tabs = ref([])
const userRole = ref('')
const auth = getAuth()
const userInfo = ref({})

onMounted(async () => {
  const user = auth.currentUser
  if (user) {
    const docSnap = await getDoc(doc(db, 'users', user.uid))
    if (docSnap.exists()) {
      const data = docSnap.data()
      userRole.value = data.role
      userInfo.value = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        role: data.role
      }

      // Rol bazlı tab listesi
      if (data.role === 'admin') {
        tabs.value = [
          { label: '📊 Özet', value: 'dashboard', route: '/dashboard' },
          { label: '🏢 Kiracılar', value: 'tenants', route: '/tenants' },
          { label: '💸 Ödemeler', value: 'payments', route: '/payments' },
          { label: '📉 Yönetim Giderleri', value: 'expenses', route: '/expenses' },
          { label: '⚙️ Sayaçlar', value: 'utilities', route: '/utilities' },
          { label: '🛠️ Yönetim', value: 'admin', route: '/admin' }
        ]
      } else if (data.role === 'manager') {
        tabs.value = [
          { label: '📊 Özet', value: 'dashboard', route: '/dashboard' },
          { label: '🏢 Kiracılar', value: 'tenants', route: '/tenants' },
          { label: '💸 Ödemeler', value: 'payments', route: '/payments' },
          { label: '📉 Yönetim Giderleri', value: 'expenses', route: '/expenses' },
          { label: '⚙️ Sayaçlar', value: 'utilities', route: '/utilities' }
        ]
      } else if (data.role === 'tenant') {
        tabs.value = [
          { label: '👤 Profilim', value: 'profile', route: '/profile' }
        ]
      }
    }
  }
})

const handleLogout = async () => {
  await signOut(auth)
  window.location.href = '/login'
}
</script>
