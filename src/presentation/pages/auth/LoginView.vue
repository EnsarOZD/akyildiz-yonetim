<template>
  <div class="min-h-screen flex">

    <!-- ═══════════════════════════════════════════════════
         LEFT PANEL — Branding (desktop only)
    ═══════════════════════════════════════════════════ -->
    <div class="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-gradient-to-br from-[#080b14] via-[#0d1530] to-[#0f1322] flex-col justify-between p-12">
      <!-- Ambient blobs -->
      <div class="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl animate-blob"></div>
      <div class="pointer-events-none absolute bottom-0 right-0 w-80 h-80 bg-brand-400/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div class="pointer-events-none absolute top-1/2 left-1/3 w-64 h-64 bg-brand-600/8 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <!-- Grid dot overlay -->
      <div class="pointer-events-none absolute inset-0 opacity-[0.04]"
           style="background-image: radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0); background-size: 32px 32px;"></div>

      <!-- Logo -->
      <div class="relative z-10 flex items-center gap-3">
        <div class="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center ring-1 ring-white/20 overflow-hidden p-1.5">
          <img :src="logoUrl" class="w-full h-full object-contain brightness-0 invert" :alt="appName" />
        </div>
        <span class="text-white font-semibold text-lg tracking-wide font-cormorantSC uppercase">{{ appName }}</span>
      </div>

      <!-- Hero text -->
      <div class="relative z-10">
        <h1 class="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
          Profesyonel<br />
          <span class="bg-gradient-to-r from-brand-400 to-[#93c5fd] bg-clip-text text-transparent">Yönetim</span><br />
          Sistemi
        </h1>
        <p class="text-slate-400 text-base max-w-sm leading-relaxed">
          Apartman ve site yönetimini tek bir platformda kolaylaştırın. Kiracılar, ödemeler, giderler — hepsi bir arada.
        </p>

        <!-- Feature list -->
        <ul class="mt-8 space-y-3">
          <li v-for="f in features" :key="f" class="flex items-center gap-3 text-slate-300 text-sm">
            <span class="flex-shrink-0 w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center ring-1 ring-brand-500/40">
              <svg class="w-3 h-3 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            {{ f }}
          </li>
        </ul>
      </div>

      <!-- Bottom copyright -->
      <p class="relative z-10 text-slate-600 text-xs">© {{ new Date().getFullYear() }} {{ appName }}</p>
    </div>

    <!-- ═══════════════════════════════════════════════════
         RIGHT PANEL — Login form
    ═══════════════════════════════════════════════════ -->
    <div class="flex-1 flex flex-col items-center justify-center bg-white dark:bg-[#0f1322] px-6 py-12 sm:px-12">

      <!-- Mobile logo -->
      <div class="lg:hidden flex flex-col items-center mb-8">
        <div class="w-14 h-14 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-glow-blue overflow-hidden p-2 mb-3">
          <img :src="logoUrl" class="w-full h-full object-contain brightness-0 invert" :alt="appName" />
        </div>
        <span class="text-xl font-bold text-slate-800 dark:text-white font-cormorantSC uppercase tracking-wide">{{ appName }}</span>
      </div>

      <!-- Form container -->
      <div class="w-full max-w-sm">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Giriş Yap</h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-[#9aa0b4]">Hesabınıza erişmek için bilgilerinizi girin</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-[#f1f3f9] mb-1.5" for="email">
              E-posta
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                v-model="email"
                id="email"
                data-testid="email"
                type="email"
                placeholder="ornek@sirket.com"
                autocomplete="email"
                required
                class="block w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-colors duration-150
                  bg-white dark:bg-[#151a2e]/80
                  border-slate-200 dark:border-white/[0.07]
                  text-slate-800 dark:text-[#f1f3f9]
                  placeholder-slate-400 dark:placeholder-[#626885]
                  focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 dark:focus:border-brand-500"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-[#f1f3f9] mb-1.5" for="password">
              Şifre
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                data-testid="password"
                placeholder="••••••••"
                autocomplete="current-password"
                required
                class="block w-full pl-10 pr-12 py-2.5 rounded-lg border text-sm transition-colors duration-150
                  bg-white dark:bg-[#151a2e]/80
                  border-slate-200 dark:border-white/[0.07]
                  text-slate-800 dark:text-[#f1f3f9]
                  placeholder-slate-400 dark:placeholder-[#626885]
                  focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 dark:focus:border-brand-500"
              />
              <button
                type="button"
                data-testid="sidebar"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <svg v-if="showPassword" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember + Forgot -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer group select-none">
              <div
                class="w-4 h-4 rounded border-2 flex items-center justify-center transition-colors duration-150"
                :class="rememberMe
                  ? 'bg-brand-500 border-brand-500'
                  : 'border-slate-300 dark:border-white/[0.1] group-hover:border-brand-400'"
                @click="rememberMe = !rememberMe"
              >
                <svg v-if="rememberMe" class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <input type="checkbox" v-model="rememberMe" class="sr-only" />
              <span class="text-sm text-slate-600 dark:text-[#9aa0b4]">Beni hatırla</span>
            </label>
            <button
              type="button"
              @click="showResetModal = true"
              class="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium transition-colors"
            >
              Şifremi unuttum
            </button>
          </div>

          <!-- Error -->
          <transition enter-active-class="animate-slide-down" leave-active-class="transition-opacity duration-150" leave-to-class="opacity-0">
            <div v-if="errorMessage" class="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400">
              <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm leading-snug">{{ errorMessage }}</p>
            </div>
          </transition>

          <!-- Submit button -->
          <button
            type="submit"
            data-testid="login-btn"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold
              bg-brand-500 hover:bg-brand-600 active:bg-brand-700
              text-white shadow-sm
              transition-all duration-150
              disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            {{ loading ? 'Giriş yapılıyor…' : 'Giriş Yap' }}
          </button>

        </form>

        <!-- Footer -->
        <p class="mt-8 text-center text-xs text-slate-400 dark:text-[#626885]">
          © {{ new Date().getFullYear() }} {{ appName }}. Tüm hakları saklıdır.
        </p>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════
         Password Reset Modal
    ═══════════════════════════════════════════════════ -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showResetModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showResetModal = false">
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
        >
          <div v-if="showResetModal" class="bg-white dark:bg-[#0f1322] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-white/[0.08] animate-scale-in">
            <div class="flex items-center justify-between mb-1">
              <h3 class="text-base font-bold text-slate-800 dark:text-white">Şifre Sıfırlama</h3>
              <button @click="showResetModal = false" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-400 hover:text-slate-600 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p class="text-sm text-slate-500 dark:text-[#9aa0b4] mb-4">Kayıtlı e-posta adresinize şifre sıfırlama bağlantısı göndereceğiz.</p>

            <input
              v-model="resetEmail"
              type="email"
              placeholder="ornek@sirket.com"
              class="block w-full px-3.5 py-2.5 rounded-lg border text-sm
                bg-white dark:bg-[#0f1322]
                border-slate-200 dark:border-white/[0.07]
                text-slate-800 dark:text-[#f1f3f9]
                placeholder-slate-400
                focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            />

            <div v-if="resetMessage" class="mt-3 flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-sm">{{ resetMessage }}</span>
            </div>
            <div v-if="resetError" class="mt-3 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 rounded-lg border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm">{{ resetError }}</span>
            </div>

            <div class="flex gap-2 mt-5">
              <button
                @click="handlePasswordReset"
                :disabled="resetLoading"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg v-if="resetLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ resetLoading ? 'Gönderiliyor…' : 'Gönder' }}
              </button>
              <button
                @click="showResetModal = false"
                class="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#151a2e] dark:hover:bg-white/[0.06] text-slate-700 dark:text-[#f1f3f9] transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorHandler } from '@/application/composables/useErrorHandler'
import { getErrorMessage } from '@/core/utils/errorHandler'
import authService from '@/infrastructure/services/authService'
import { useBranding } from '@/application/composables/useBranding'

const { logoUrl, appName } = useBranding()
const { handleNetworkError, showSuccess } = useErrorHandler()
const router = useRouter()

const email        = ref('')
const password     = ref('')
const errorMessage = ref('')
const rememberMe   = ref(false)
const showPassword = ref(false)
const loading      = ref(false)

const showResetModal = ref(false)
const resetEmail     = ref('')
const resetMessage   = ref('')
const resetError     = ref('')
const resetLoading   = ref(false)

const features = [
  'Kiracı ve mal sahibi yönetimi',
  'Otomatik borç takibi ve bildirimler',
  'Ödeme geçmişi ve finansal raporlar',
  'Mobil uyumlu, her cihazdan erişim',
]

onMounted(() => {
  const savedEmail = localStorage.getItem('rememberedEmail')
  if (savedEmail) {
    email.value = savedEmail
    rememberMe.value = true
  }
})

const handleLogin = async () => {
  if (loading.value) return
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'E-posta ve şifre alanları zorunludur.'
    return
  }

  loading.value = true
  try {
    const response = await authService.login(email.value, password.value)

    if (response && response.token) {
      if (rememberMe.value) {
        localStorage.setItem('rememberedEmail', email.value)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      showSuccess('Başarıyla giriş yapıldı!')

      const authStore = (await import('@/application/stores/auth')).useAuthStore()
      await authStore.fetchUserProfile()

      const role = (authStore.role || response.role || '').toLowerCase()
      if      (role === 'admin')  router.push('/admin')
      else if (role === 'manager') router.push('/dashboard')
      else if (role === 'tenant') router.push('/tenant-dashboard')
      else if (role === 'owner')  router.push('/my-properties')
      else                         router.push('/dashboard')
    } else {
      errorMessage.value = 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.'
    }
  } catch (error) {
    handleNetworkError(error, { component: 'LoginView', action: 'login' })
    errorMessage.value = getErrorMessage(error)
  } finally {
    loading.value = false
  }
}

const handlePasswordReset = async () => {
  if (resetLoading.value) return
  resetMessage.value = ''
  resetError.value   = ''

  if (!resetEmail.value) {
    resetError.value = 'Lütfen e-posta adresinizi girin.'
    return
  }

  resetLoading.value = true
  try {
    await authService.resetPassword(resetEmail.value)
    resetMessage.value = 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'
    setTimeout(() => {
      showResetModal.value = false
      resetEmail.value     = ''
      resetMessage.value   = ''
    }, 1800)
  } catch (error) {
    handleNetworkError(error, { component: 'LoginView', action: 'passwordReset' })
    resetError.value = 'Şifre sıfırlama işlemi başarısız oldu.'
  } finally {
    resetLoading.value = false
  }
}
</script>
