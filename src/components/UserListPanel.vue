<template>
  <div class="bg-base-200 p-6 rounded-xl">
    <h2 class="text-xl font-bold mb-4">Kullanıcılar</h2>

    <input v-model="search" class="input input-bordered mb-4 w-full" placeholder="Ad, soyad veya e-posta ile ara" />

    <table class="table w-full">
      <thead>
        <tr>
          <th>Ad Soyad</th>
          <th>E-posta</th>
          <th>Rol</th>
          <th>Firma</th>
          <th>İşlem</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.id">
          <td>{{ user.firstName }} {{ user.lastName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>{{ getCompanyName(user.companyId) }}</td>
          <td>
            <button @click="deleteUser(user.id)" class="btn btn-sm btn-error">Sil</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'

const companies = ref([])
const users = ref([])
const search = ref('')

onMounted(async () => {
  await fetchCompanies()
  await fetchUsers()
})

const fetchCompanies = async () => {
  const snapshot = await getDocs(collection(db, 'companies'))
  companies.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

const fetchUsers = async () => {
  const snapshot = await getDocs(collection(db, 'users'))
  users.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

const deleteUser = async (id) => {
  if (confirm('Kullanıcıyı silmek istediğinize emin misiniz?')) {
    await deleteDoc(doc(db, 'users', id))
    await fetchUsers()
  }
}

const getCompanyName = (id) => {
  const match = companies.value.find(c => c.id === id)
  return match ? match.name : '-'
}

const filteredUsers = computed(() => {
  const q = search.value.toLowerCase()
  return users.value.filter(user =>
    (user.firstName || '').toLowerCase().includes(q) ||
    (user.lastName || '').toLowerCase().includes(q) ||
    (user.email || '').toLowerCase().includes(q)
  )
})
</script>
