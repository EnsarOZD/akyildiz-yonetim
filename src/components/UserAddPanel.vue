<template>
  <div class="bg-base-200 p-6 rounded-xl">
    <h2 class="text-xl font-bold mb-4">Yeni Kullanıcı Ekle</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="firstName" class="input input-bordered w-full" placeholder="Ad" required />
        <input v-model="lastName" class="input input-bordered w-full" placeholder="Soyad" required />
      </div>

      <input v-model="email" class="input input-bordered w-full" type="email" placeholder="E-posta" required />

      <div>
        <label class="label">Rol</label>
        <select v-model="role" class="select select-bordered w-full" required>
          <option disabled value="">Rol Seçin</option>
          <option value="admin">Admin</option>
          <option value="manager">Yönetici</option>
          <option value="tenant">Kiracı</option>
        </select>
      </div>

      <div v-if="role === 'tenant'">
        <label class="label">Firma</label>
        <select v-model="companyId" class="select select-bordered w-full" required>
          <option disabled value="">Firma Seçin</option>
          <option v-for="company in companies" :key="company.id" :value="company.id">
            {{ company.name }}
          </option>
        </select>
      </div>

      <button class="btn btn-primary w-full">Kaydet</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { doc, setDoc, collection, getDocs } from 'firebase/firestore'

const email = ref('')
const firstName = ref('')
const lastName = ref('')
const role = ref('')
const companyId = ref('')
const companies = ref([])

onMounted(async () => {
const snapshot = await getDocs(collection(db, 'tenants'))
companies.value = snapshot.docs.map(doc => ({
  id: doc.id,
  name: doc.data().company
}))
})

const handleSubmit = async () => {
  try {
    const tempPassword = Math.random().toString(36).slice(-8)
    const { user } = await createUserWithEmailAndPassword(auth, email.value, tempPassword)

    await setDoc(doc(db, 'users', user.uid), {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      role: role.value,
      companyId: role.value === 'tenant' ? companyId.value : null
    })

    await sendPasswordResetEmail(auth, email.value)

    alert('Kullanıcı eklendi. Şifre oluşturma bağlantısı e-posta ile gönderildi.')

    email.value = ''
    firstName.value = ''
    lastName.value = ''
    role.value = ''
    companyId.value = ''
  } catch (error) {
    alert('Hata: ' + error.message)
  }
}
</script>
