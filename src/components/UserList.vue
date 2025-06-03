<template>
  <div class="p-6 max-w-5xl mx-auto bg-base-100 rounded-xl shadow">
    <h2 class="text-2xl font-bold mb-4">Kullanıcılar</h2>

    <!-- Arama Kutusu -->
    <input v-model="search" class="input input-bordered mb-4 w-full" placeholder="Ad, soyad veya e-posta ile ara" />

    <!-- Kullanıcı Tablosu -->
    <table class="table w-full">
      <thead>
        <tr>
          <th>Ad Soyad</th>
          <th>E-posta</th>
          <th>Rol</th>
          <th>Firma</th>
          <th>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.id">
          <td>{{ user.firstName }} {{ user.lastName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.companyName || '-' }}</td>
          <td>
            <button class="btn btn-error btn-sm" @click="deleteUser(user.id)">Sil</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'

const users = ref([])
const tenants = ref([])
const search = ref('')

// Tenant'ları Firestore'dan çek
const fetchTenants = async () => {
  const tenantSnap = await getDocs(collection(db, 'tenants'))
  tenants.value = tenantSnap.docs.map(doc => ({
    id: doc.id,
    company: doc.data().company
  }))
}

// Kullanıcıları çek ve firma adlarını eşleştir
const fetchUsers = async () => {
  const userSnap = await getDocs(collection(db, 'users'))
  const userData = userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

  // Firma eşlemesi yap
  users.value = userData.map(user => {
    const matchedTenant = tenants.value.find(t => t.id === user.companyId)
    return {
      ...user,
      companyName: matchedTenant ? matchedTenant.company : null
    }
  })
}

// Kullanıcı silme
const deleteUser = async (id) => {
  if (confirm('Bu kullanıcıyı silmek istiyor musunuz?')) {
    await deleteDoc(doc(db, 'users', id))
    await fetchUsers() // Silince listeyi yenile
  }
}

// Arama filtresi
const filteredUsers = computed(() => {
  const s = search.value.toLowerCase()
  return users.value.filter(u =>
    u.firstName?.toLowerCase().includes(s) ||
    u.lastName?.toLowerCase().includes(s) ||
    u.email?.toLowerCase().includes(s)
  )
})

// Sayfa açıldığında önce tenants sonra users çek
onMounted(async () => {
  await fetchTenants()
  await fetchUsers()
})
</script>
