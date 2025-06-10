<template>
  <header class="relative bg-gray-800 py-6 border-b border-gray-700 text-center shadow text-white">
    <!-- Başlık -->
    <div>
      <h1 class="text-4xl font-cormorant">AKYILDIZ İŞ MERKEZİ</h1>
      <p class="text-3xl font-cormorantSC">Yönetim Sistemi</p>
    </div>

    <!-- Kullanıcı bilgileri -->
    <div v-if="userInfo" class="absolute top-4 right-6">
  <div class="relative" @click="toggleDropdown">
    <button class="text-sm font-medium text-gray-200 hover:text-white">
      {{ userInfo.firstName }} {{ userInfo.lastName }}
      <span class="ml-1">▼</span>
    </button>

    <!-- Dropdown -->
    <div
        v-if="showDropdown"
        class="absolute right-0 mt-2 w-40 bg-white text-gray-800 shadow-lg rounded z-10 transition duration-200 ease-out transform origin-top-right scale-95"
        >
      <button @click="changePassword" class="block w-full px-4 py-2 text-left hover:bg-gray-100">
        Şifre Değiştir
      </button>
      <button @click="logout" class="block w-full px-4 py-2 text-left hover:bg-gray-100">
        Çıkış Yap
      </button>
    </div>
  </div>
</div>
  </header>
</template>

<script setup>
import { ref, onMounted,onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

const userInfo = ref(null)
const router = useRouter()
const auth = getAuth()
const showDropdown = ref(false)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
      if (userDoc.exists()) {
        userInfo.value = userDoc.data()
      }
    }
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const logout = async () => {
  await signOut(auth)
  router.push('/login')
}

const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.relative')
  if (dropdown && !dropdown.contains(event.target)) {
    showDropdown.value = false
  }
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
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
