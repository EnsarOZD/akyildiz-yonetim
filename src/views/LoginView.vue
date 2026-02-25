<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
    <!-- Modern Gradient Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
    
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Floating circles -->
      <div class="absolute top-20 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute top-40 right-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-40 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <!-- Grid pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0); background-size: 40px 40px;"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 w-full max-w-md mx-4">
      <!-- Logo/Brand Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg overflow-hidden p-2">
          <img src="/logo.svg" class="w-full h-full object-contain brightness-0 invert" alt="Logo" />
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Akyıldız Yönetim
        </h1>
        <p class="text-gray-300 mt-2">Yönetim Sistemi Giriş</p>
      </div>

      <!-- Login Card -->
      <div class="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Field -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-200" for="email">
              E-posta Adresi
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
              </div>
              <input
                v-model="email"
                id="email"
                data-testid="email"
                type="email"
                placeholder="ornek@email.com"
                class="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700 text-white placeholder-gray-400"
                required
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-200" for="password">
              Şifre
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                data-testid="password"
                placeholder="••••••••"
                class="block w-full pl-10 pr-12 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700 text-white placeholder-gray-400"
                required
              />
              <button 
                type="button" 
                data-testid="sidebar"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200"
                @click="togglePasswordVisibility"
              >
                <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center space-x-2 cursor-pointer group">
              <div class="relative">
                <input
                  type="checkbox"
                  v-model="rememberMe"
                  class="sr-only"
                />
                <div class="w-5 h-5 border-2 border-gray-500 rounded-md flex items-center justify-center transition-all duration-200 group-hover:border-blue-500"
                     :class="{ 'bg-blue-500 border-blue-500': rememberMe }">
                  <svg v-if="rememberMe" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
              <span class="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">Beni Hatırla</span>
            </label>
            <button 
              type="button"
              @click="showResetModal = true" 
              class="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-all duration-200 font-medium"
            >
              Şifremi Unuttum?
            </button>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center space-x-3 text-red-500">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-sm whitespace-pre-line">{{ errorMessage }}</p>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            data-testid="login-btn"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              <span>Giriş Yap</span>
            </span>
          </button>
        </form>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8">
        <p class="text-sm text-gray-400">
          © 2024 Akyıldız Yönetim. Tüm hakları saklıdır.
        </p>
      </div>
    </div>

    <!-- Password Reset Modal -->
    <div v-if="showResetModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Şifre Sıfırlama</h3>
          <button 
            @click="showResetModal = false"
            class="text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <p class="text-sm text-gray-300 mb-4">
          Kayıtlı e-posta adresinizi girin. Şifre sıfırlama bağlantısı gönderilecektir.
        </p>

        <input
          v-model="resetEmail"
          type="email"
          placeholder="ornek@email.com"
          class="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700 text-white placeholder-gray-400"
        />

        <div v-if="resetMessage" class="mt-3 p-3 bg-green-900/50 border border-green-700 rounded-lg">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-sm text-green-300">{{ resetMessage }}</span>
          </div>
        </div>
        
        <div v-if="resetError" class="mt-3 p-3 bg-red-900/50 border border-red-700 rounded-lg">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm text-red-300">{{ resetError }}</span>
          </div>
        </div>

        <div class="flex space-x-3 mt-6">
          <button 
            @click="handlePasswordReset"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Gönder
          </button>
          <button 
            @click="showResetModal = false"
            class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { getErrorMessage } from '@/utils/errorHandler'
import authService from '@/services/authService'

// Error handler
const { handleNetworkError, showSuccess } = useErrorHandler()

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

onMounted(() => {
  const savedEmail = localStorage.getItem('rememberedEmail')
  if (savedEmail) {
    email.value = savedEmail
    rememberMe.value = true
  }
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  errorMessage.value = ''
  
  if (!email.value || !password.value) {
    errorMessage.value = 'E-posta ve şifre alanları zorunludur.'
    return
  }

  try {
    const response = await authService.login(email.value, password.value)
    console.log('Backend login response:', response)
    
    if (response && response.token) {
      // "Beni Hatırla" seçimi yapılmışsa e-postayı kaydet
      if (rememberMe.value) {
        localStorage.setItem('rememberedEmail', email.value)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      showSuccess('Başarıyla giriş yapıldı!')
      
      // Role göre yönlendirme
      if (response.role === 'admin') {
        router.push('/admin')
      } else if (response.role === 'manager') {
        router.push('/dashboard')
      } else if (response.role === 'viewer') {
        router.push('/overdue')
      } else if (response.role === 'tenant') {
        router.push('/profile')
      } else {
        router.push('/dashboard')
      }
    } else {
      errorMessage.value = 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.'
    }
  } catch (error) {
    console.error('Login error:', error)
    handleNetworkError(error, { component: 'LoginView', action: 'login' })
    errorMessage.value = getErrorMessage(error)
  }
}

const handlePasswordReset = async () => {
  resetMessage.value = ''
  resetError.value = ''
  
  if (!resetEmail.value) {
    resetError.value = 'Lütfen e-posta adresinizi girin.'
    return
  }

  try {
    await authService.resetPassword(resetEmail.value)
    resetMessage.value = 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'
    setTimeout(() => {
      showResetModal.value = false
      resetEmail.value = ''
      resetMessage.value = ''
    }, 1500)
  } catch (error) {
    console.error('Password reset error:', error)
    handleNetworkError(error, { component: 'LoginView', action: 'passwordReset' })
    resetError.value = 'Şifre sıfırlama işlemi başarısız oldu.'
  }
}

const handleDemoLogin = async () => {
  email.value = 'demo@akyildiz.com'
  password.value = 'demo123'
  await handleLogin()
}
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
