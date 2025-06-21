<template>
  <div
    class="bg-gray-100 min-h-screen flex items-center justify-center relative"
    :style="{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
  >
    <!-- Arka planı karart -->
    <div class="absolute inset-0 bg-black opacity-50 z-0"></div>

    <!-- Login Form -->
    <div class="relative z-10 bg-white p-8 rounded-md shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Akyıldız Yönetim Giriş</h1>
      <form @submit.prevent="handleLogin" class="space-y-4 text-gray-800">
        <!-- Email -->
        <div>
          <label class="block font-semibold mb-1" for="email">Email</label>
          <input
            v-model="email"
            id="email"
            type="email"
            placeholder="ornek@firma.com"
            class="bg-white text-gray-800 placeholder-gray-400 appearance-none border rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required />
        </div>

        <!-- Şifre -->
        <div>
          <label class="block font-semibold mb-1" for="password">Şifre</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              placeholder="••••••••"
              class="bg-white text-gray-800 placeholder-gray-400 appearance-none border rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required />
            <button type="button" class="absolute inset-y-0 right-2 px-2 text-sm text-cyan-600" @click="togglePassword">
              {{ showPassword ? 'Gizle' : 'Göster' }}
            </button>
          </div>
        </div>

        <!-- Beni Hatırla ve Şifremi Unuttum -->
        <div class="flex items-center justify-between text-sm mt-2">
          <label class="flex items-center gap-2 text-gray-800">
    <input
      type="checkbox"
      v-model="rememberMe"
      class="w-5 h-5 accent-cyan-600 border-gray-400 rounded focus:ring-2 focus:ring-cyan-400 transition duration-200"
    />
    <span>Beni Hatırla</span>
  </label>
          <a href="#" @click.prevent="showResetModal = true" class="text-cyan-600 hover:text-cyan-800 hover:underline transition">
  Şifremi unuttum?
</a>
        </div>

        <!-- Hata Mesajı -->
        <div v-if="errorMessage" class="text-red-500 text-sm text-center">
          {{ errorMessage }}
        </div>

        <!-- Giriş Butonu -->
        <button
          type="submit"
          class="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300 w-full mt-2">
          Giriş Yap
        </button>
      </form>
      <dialog v-if="showResetModal" class="modal" open>
  <div class="modal-box max-w-sm">
    <h3 class="text-lg font-bold mb-2">Şifre Sıfırlama</h3>
    <p class="text-sm text-gray-600 mb-3">Kayıtlı e-posta adresinizi girin:</p>

    <input
      v-model="resetEmail"
      type="email"
      placeholder="ornek@firma.com"
      class="input input-bordered w-full mb-3"
    />

    <div v-if="resetMessage" class="text-green-600 text-sm text-center mb-2">
      {{ resetMessage }}
    </div>
    <div v-if="resetError" class="text-red-500 text-sm text-center mb-2">
      {{ resetError }}
    </div>

    <div class="modal-action">
      <button class="btn btn-primary" @click="sendReset">Gönder</button>
      <button class="btn" @click="showResetModal = false">Kapat</button>
    </div>
  </div>
</dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import backgroundImage from '../assets/background.png'
import { sendPasswordResetEmail } from 'firebase/auth'

// Kullanıcı bilgileri
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const showResetModal = ref(false)
const resetEmail = ref('')
const resetMessage = ref('')
const resetError = ref('')

const router = useRouter()

onMounted(async () => {
  const user = getAuth().currentUser
  if (user) {
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    const role = userDoc.exists() ? userDoc.data().role : null

    if (role === 'admin') router.push('/admin')
    else if (role === 'manager') router.push('/dashboard')
    else if (role === 'viewer') router.push('/overdue')
    else if (role === 'tenant') router.push('/profile')
  }
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handlePasswordReset = async () => {
  if (!email.value) {
    errorMessage.value = 'Lütfen önce geçerli bir e-posta adresi girin.'
    return
  }

  try {
    await sendPasswordResetEmail(auth, email.value)
    errorMessage.value = 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'
  } catch (err) {
    errorMessage.value = 'Şifre sıfırlama başarısız: ' + (err.message || 'Hata oluştu.')
  }
}

const sendReset = async () => {
  resetMessage.value = ''
  resetError.value = ''

  if (!resetEmail.value) {
    resetError.value = 'Lütfen e-posta adresinizi girin.'
    return
  }

  try {
    await sendPasswordResetEmail(auth, resetEmail.value)
    resetMessage.value = 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'
    
    // 1.5 saniye sonra modalı kapat
    setTimeout(() => {
      showResetModal.value = false
      resetEmail.value = ''
      resetMessage.value = ''
    }, 1500)
    
  } catch (err) {
    resetError.value = 'Gönderim başarısız: ' + (err.message || 'Hata oluştu.')
  }
}

const handleLogin = async () => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email.value, password.value)
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (!userDoc.exists()) throw new Error('Kullanıcı bilgileri eksik.')

    const role = userDoc.data().role
    if (role === 'admin') router.push('/admin')
    else if (role === 'manager') router.push('/dashboard')
    else router.push('/profile')
  } catch (err) {
    errorMessage.value = 'Giriş başarısız: ' + (err.message || 'Bilinmeyen hata.')
  }
}
</script>
