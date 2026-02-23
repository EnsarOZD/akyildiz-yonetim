<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Şifre Belirleme
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Lütfen hesabınız için güvenli bir şifre belirleyin
        </p>
      </div>
      
      <div v-if="success" class="alert alert-success mt-4 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Şifreniz başarıyla oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz...</span>
      </div>

      <div v-else-if="error" class="alert alert-error mt-4 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ error }}</span>
      </div>

      <form v-if="!success" class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">E-posta</span>
            </label>
            <input 
              v-model="email" 
              type="email" 
              class="input input-bordered w-full bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed border-gray-300 dark:border-gray-600" 
              readonly 
            />
          </div>
          
          <div class="form-control w-full mt-4">
            <label class="label">
              <span class="label-text">Yeni Şifre</span>
            </label>
            <input 
              v-model="password" 
              type="password" 
              class="input input-bordered w-full" 
              required 
              placeholder="••••••••"
              minlength="6"
            />
          </div>

          <div class="form-control w-full mt-4">
            <label class="label">
              <span class="label-text">Şifre Tekrar</span>
            </label>
            <input 
              v-model="passwordConfirm" 
              type="password" 
              class="input input-bordered w-full" 
              required 
              placeholder="••••••••"
              minlength="6"
            />
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner"></span>
            Şifremi Belirle ve Giriş Yap
          </button>
        </div>
      </form>
      
      <div v-if="success" class="text-center mt-6">
        <router-link to="/login" class="text-indigo-600 hover:text-indigo-500 font-medium">
          Giriş Sayfasına Dön
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import authService from '@/services/authService'

const route = useRoute()
const router = useRouter()

const email = ref('')
const token = ref('')
const password = ref('')
const passwordConfirm = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

onMounted(() => {
  email.value = route.query.email || ''
  token.value = route.query.token || ''
  
  if (!token.value || !email.value) {
    error.value = 'Geçersiz şifre belirleme bağlantısı. Lütfen size iletilen orijinal bağlantıya tıklayın.'
  }
})

const handleSubmit = async () => {
  error.value = ''
  
  if (password.value !== passwordConfirm.value) {
    error.value = 'Şifreler eşleşmiyor!'
    return
  }
  
  if (password.value.length < 6) {
    error.value = 'Şifre en az 6 karakter olmalıdır.'
    return
  }

  loading.value = true
  try {
    await authService.setPassword(email.value, token.value, password.value)
    success.value = true
    
    // 3 saniye sonra login ekranına yönlendir
    setTimeout(() => {
      router.push('/login')
    }, 3000)
    
  } catch (err) {
    console.error('Set password error:', err)
    error.value = err.response?.data || 'Şifre güncellenirken bir hata oluştu. Bağlantı süresi dolmuş olabilir.'
  } finally {
    loading.value = false
  }
}
</script>
