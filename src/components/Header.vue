<template>
  <header class="relative bg-gray-800 py-6 border-b border-gray-700 text-center shadow text-white">
    <!-- Başlık -->
    <div>
      <h1 class="text-4xl font-cormorant">AKYILDIZ İŞ MERKEZİ</h1>
      <p class="text-3xl font-cormorantSC">Yönetim Sistemi</p>
    </div>

    <!-- Kullanıcı bilgileri -->
    <div v-if="userInfo" class="absolute top-4 right-6 flex items-center gap-4">
      <span class="text-sm text-gray-200 font-medium">
        {{ userInfo.firstName }} {{ userInfo.lastName }}
      </span>
      <a href="#" @click.prevent="changePassword" class="text-sm text-cyan-400 hover:underline">Şifre Değiştir</a>
      <button
        @click="logout"
        class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
      >
        Çıkış Yap
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

const userInfo = ref(null)
const router = useRouter()
const auth = getAuth()

onMounted(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
      if (userDoc.exists()) {
        userInfo.value = userDoc.data()
      }
    }
  })
})

const logout = async () => {
  await signOut(auth)
  router.push('/login')
}

const changePassword = async () => {
  const user = auth.currentUser
  if (user) {
    await sendPasswordResetEmail(auth, user.email)
    alert('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.')
  }
}
</script>

<style scoped>
.font-cormorant {
  font-family: 'Cormorant Garamond', serif;
}
.font-cormorantSC {
  font-family: 'Cormorant SC', serif;
}
</style>
