import { defineStore } from 'pinia'
import { ref } from 'vue'
import authService from '@/infrastructure/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const role = ref(null)
  const companyId = ref(null)
  const companyName = ref(null)
  const fullName = ref(null)
  const email = ref(null)
  const isInitialized = ref(false) // 🔄 Backend tamamlandı mı?
  const theme = ref(
    localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )

  async function fetchUserProfile() {
    // Aynı anda birden fazla çağrı varsa tek isteğe indir
    if (_fetchPromise) return _fetchPromise

    const isBackendActive = import.meta.env.VITE_API_BASE_URL &&
      import.meta.env.VITE_API_BASE_URL !== 'http://localhost:5000/api'

    if (isBackendActive) {
      _fetchPromise = (async () => {
        try {
          const backendUser = await authService.checkAuthStatus()
          if (backendUser) {
            user.value = { id: backendUser.id, email: backendUser.email }
            role.value = backendUser.role ? backendUser.role.toLowerCase() : null
            companyId.value = backendUser.companyId
            companyName.value = backendUser.companyName || null
            fullName.value = backendUser.name || `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim()
            email.value = backendUser.email
          } else {
            clearUser()
          }
        } catch (error) {
          console.error('Backend kullanıcı profili hatası:', error)
          clearUser()
        } finally {
          isInitialized.value = true
          _fetchPromise = null
        }
      })()
      return _fetchPromise
    }

    // Demo modu
    const isDemoMode = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL === 'http://localhost:5000/api'
    if (isDemoMode) {
      user.value = { uid: 'demo-user-id', email: 'demo@akyildiz.com' }
      role.value = 'admin'
      companyId.value = 'demo-company'
      fullName.value = 'Demo Kullanıcı'
      email.value = 'demo@akyildiz.com'
      isInitialized.value = true
    }
  }

  // Listener'ın birden fazla kez kaydedilmesini önle
  let _listenerRegistered = false
  // Eş zamanlı fetchUserProfile çağrılarını tek isteğe indir
  let _fetchPromise = null

  // 👇 Bu fonksiyon App.vue'de çağrılmalı
  function initAuthListener() {
    // Backend API kontrolü
    const isBackendActive = import.meta.env.VITE_API_BASE_URL &&
      import.meta.env.VITE_API_BASE_URL !== 'http://localhost:5000/api'

    if (isBackendActive) {
      // Listener'ı yalnızca bir kez kaydet
      if (!_listenerRegistered) {
        _listenerRegistered = true

        // Backend auth state değişikliklerini dinle
        authService.onAuthStateChanged((user) => {
          if (user) {
            fetchUserProfile()
          } else {
            clearUser()
            isInitialized.value = true
          }
        })
      }

      // Her durumda profil yükle
      fetchUserProfile()
      return
    }

    // Demo modu kontrolü
    const isDemoMode = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL === 'http://localhost:5000/api'

    if (isDemoMode) {
      fetchUserProfile()
      return
    }
  }

  function clearUser() {
    user.value = null
    role.value = null
    companyId.value = null
    companyName.value = null
    fullName.value = null
    email.value = null
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', theme.value)
  }

  return {
    user,
    role,
    companyId,
    companyName,
    fullName,
    email,
    isInitialized,
    theme,
    fetchUserProfile,
    clearUser,
    initAuthListener,
    toggleTheme
  }
})
