import { defineStore } from 'pinia'
import { ref } from 'vue'
import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const role = ref(null)
  const companyId = ref(null)
  const fullName = ref(null)
  const email = ref(null)
  const isInitialized = ref(false) // 🔄 Backend tamamlandı mı?
  const theme = ref(
    localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )

  async function fetchUserProfile() {
    // Backend API kontrolü
    const isBackendActive = import.meta.env.VITE_API_BASE_URL &&
      import.meta.env.VITE_API_BASE_URL !== 'http://localhost:5000/api'

    if (isBackendActive) {
      // Backend API ile kullanıcı profili
      try {
        const backendUser = await authService.checkAuthStatus()
        if (backendUser) {
          user.value = { id: backendUser.id, email: backendUser.email }
          role.value = backendUser.role ? backendUser.role.toLowerCase() : null
          companyId.value = backendUser.companyId
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
        console.log('🔐 Auth Store initialized (Backend mode)')
      }
      return
    }

    // Demo modu kontrolü
    const isDemoMode = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL === 'http://localhost:5000/api'

    if (isDemoMode) {
      // Demo kullanıcı profili
      user.value = { uid: 'demo-user-id', email: 'demo@akyildiz.com' }
      role.value = 'admin'
      companyId.value = 'demo-company'
      fullName.value = 'Demo Kullanıcı'
      email.value = 'demo@akyildiz.com'
      isInitialized.value = true
      console.log('Demo mode: Admin user created', { role: role.value, isInitialized: isInitialized.value })
      return
    }
  }

  // Listener'ın birden fazla kez kaydedilmesini önle
  let _listenerRegistered = false

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
      // Demo modu için mock auth listener
      console.log('Demo mode: Initializing auth listener')
      setTimeout(() => {
        const demoUser = { uid: 'demo-user-id', email: 'demo@akyildiz.com' }
        fetchUserProfile()
        console.log('Demo mode: Auth listener completed')
      }, 1000)
      return
    }
  }

  function clearUser() {
    user.value = null
    role.value = null
    companyId.value = null
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
