<template>
  <header data-testid="sidebar"
    class="sticky top-0 z-50 bg-white/95 dark:bg-[#0f1322]/95 backdrop-blur-md border-b border-slate-200/50 dark:border-white/[0.06] shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-[60px]">

        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2.5 flex-shrink-0">
          <div class="w-2 h-2 rounded-full bg-brand-500 dark:bg-brand-400 flex-shrink-0"></div>
          <span class="text-[13.5px] font-bold tracking-[1.2px] uppercase text-slate-800 dark:text-[#f1f3f9] hidden md:block">
            {{ appName }}
          </span>
        </router-link>

        <!-- Desktop nav tabs -->
        <nav v-if="tabs.length" class="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          <router-link
            v-for="tab in tabs"
            :key="tab.value"
            :to="tab.route"
            class="px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150"
            :class="isActiveTab(tab.route)
              ? 'bg-brand-500 text-white dark:bg-brand-500 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-[#9aa0b4] hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-[#f1f3f9]'"
            :aria-current="isActiveTab(tab.route) ? 'page' : undefined"
          >
            {{ tab.label }}
          </router-link>
        </nav>

        <!-- Right side actions -->
        <div class="flex items-center gap-1">

          <!-- Notifications -->
          <div v-if="userInfo" class="relative" ref="notificationsRef">
            <button
              @click="toggleNotifications"
              class="relative p-2 rounded-lg text-slate-500 dark:text-[#9aa0b4] hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-[#f1f3f9] transition-all duration-150"
              aria-label="Bildirimleri göster"
              :aria-expanded="showNotificationsDropdown"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <!-- Badge -->
              <transition enter-active-class="animate-scale-in">
                <span v-if="notificationsStore.unreadCount > 0"
                  class="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center
                    bg-red-500 text-white text-[9px] font-bold rounded-full px-0.5 leading-none">
                  {{ notificationsStore.unreadCount > 9 ? '9+' : notificationsStore.unreadCount }}
                </span>
              </transition>
            </button>

            <!-- Notification dropdown -->
            <transition
              enter-active-class="transition ease-out duration-150"
              enter-from-class="opacity-0 translate-y-1 scale-95"
              enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100 translate-y-0 scale-100"
              leave-to-class="opacity-0 translate-y-1 scale-95"
            >
              <div v-if="showNotificationsDropdown"
                class="absolute right-0 mt-2 w-80 rounded-xl shadow-card-lg border border-slate-200 dark:border-white/[0.08]
                  bg-white dark:bg-[#0f1322] overflow-hidden origin-top-right">

                <!-- Header -->
                <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/[0.06]">
                  <span class="text-sm font-semibold text-slate-800 dark:text-[#f1f3f9]">Bildirimler</span>
                  <button @click="notificationsStore.markAllAsRead"
                    class="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium transition-colors">
                    Tümünü oku
                  </button>
                </div>

                <!-- Items -->
                <div class="max-h-80 overflow-y-auto">
                  <div v-if="notificationsStore.loading && notificationsStore.items.length === 0"
                    class="py-10 flex justify-center">
                    <span class="loading loading-spinner loading-sm text-brand-600"></span>
                  </div>
                  <div v-else-if="notificationsStore.items.length === 0"
                    class="py-10 text-center text-sm text-slate-500 dark:text-[#9aa0b4]">
                    Henüz bildirim yok
                  </div>
                  <div v-else>
                    <div
                      v-for="item in notificationsStore.items.slice(0, 6)"
                      :key="item.id"
                      @click="handleNotificationClick(item)"
                      class="relative flex gap-3 px-4 py-3 border-b border-slate-50 dark:border-white/[0.04]
                        hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer transition-colors"
                      :class="!item.isRead ? 'bg-brand-50/40 dark:bg-brand-500/[0.06]' : ''"
                    >
                      <!-- Unread dot -->
                      <span v-if="!item.isRead"
                        class="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                      <!-- Icon -->
                      <div class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                        :class="notifIconBg(item.type)">
                        <svg class="w-4 h-4" :class="notifIconColor(item.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="notifIconPath(item.type)" />
                        </svg>
                      </div>
                      <!-- Content -->
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium text-slate-800 dark:text-[#f1f3f9] line-clamp-1">{{ item.title }}</p>
                        <p class="text-xs text-slate-500 dark:text-[#9aa0b4] line-clamp-2 mt-0.5 leading-relaxed">{{ item.message }}</p>
                        <p class="text-[10px] text-slate-400 dark:text-[#626885] mt-1">{{ formatDate(item.createdAt) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <router-link to="/notifications" @click="showNotificationsDropdown = false"
                  class="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-brand-600 dark:text-brand-400
                    hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors border-t border-slate-100 dark:border-white/[0.06]">
                  Tüm bildirimleri gör
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </div>
            </transition>
          </div>

          <!-- Theme toggle -->
          <button
            @click="authStore.toggleTheme"
            class="p-2 rounded-lg text-slate-500 dark:text-[#9aa0b4] hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-[#f1f3f9] transition-all duration-150"
            :aria-label="authStore.theme === 'dark' ? 'Açık moda geç' : 'Karanlık moda geç'"
          >
            <svg v-if="authStore.theme === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
            </svg>
          </button>

          <!-- User menu -->
          <div v-if="userInfo" class="relative" ref="userMenuRef">
            <button
              @click="toggleUserDropdown"
              class="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all duration-150"
              :aria-expanded="showUserDropdown"
            >
              <!-- Avatar initials -->
              <div class="w-[28px] h-[28px] rounded-full bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                {{ userInitials }}
              </div>
              <span class="hidden sm:block text-[12.5px] font-semibold text-slate-700 dark:text-[#f1f3f9] max-w-[100px] truncate">
                {{ userInfo.firstName }}
              </span>
              <svg class="w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform duration-150"
                :class="showUserDropdown ? 'rotate-180' : ''"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <transition
              enter-active-class="transition ease-out duration-150"
              enter-from-class="opacity-0 translate-y-1 scale-95"
              enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100 translate-y-0 scale-100"
              leave-to-class="opacity-0 translate-y-1 scale-95"
            >
              <div v-if="showUserDropdown"
                class="absolute right-0 mt-2 w-52 rounded-xl shadow-card-lg border border-slate-200 dark:border-white/[0.08]
                  bg-white dark:bg-[#0f1322] py-1.5 origin-top-right overflow-hidden">

                <!-- User info -->
                <div class="px-3.5 py-2.5 border-b border-slate-100 dark:border-white/[0.06] mb-1">
                  <p class="text-sm font-semibold text-slate-800 dark:text-[#f1f3f9] truncate">
                    {{ userInfo.firstName }} {{ userInfo.lastName }}
                  </p>
                  <p class="text-xs text-slate-500 dark:text-[#9aa0b4] mt-0.5">{{ roleLabel }}</p>
                </div>

                <router-link
                  v-if="userInfo.role.toLowerCase() === ROLES.ADMIN"
                  to="/admin"
                  @click="showUserDropdown = false"
                  class="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 dark:text-[#f1f3f9] hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.094c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.894.15c.542.09.94.56.94 1.109v1.094c0 .55-.398 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738a1.125 1.125 0 01-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527a1.125 1.125 0 01-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15a1.125 1.125 0 01-.94-1.11v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.774-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Sistem Ayarları
                </router-link>

                <router-link
                  to="/profile"
                  @click="showUserDropdown = false"
                  class="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 dark:text-[#f1f3f9] hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <svg class="w-4 h-4 text-slate-400 dark:text-[#626885]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Profilim
                </router-link>

                <button
                  @click="changePassword"
                  class="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 dark:text-[#f1f3f9] hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                  Şifre Değiştir
                </button>

                <div class="border-t border-slate-100 dark:border-white/[0.06] mt-1 pt-1">
                  <button
                    @click="logout"
                    class="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 dark:text-[#fb7185] hover:bg-red-50 dark:hover:bg-[#fb7185]/[0.08] transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Çıkış Yap
                  </button>
                </div>
              </div>
            </transition>
          </div>

        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useAuthStore } from '@/application/stores/auth'
import { useNotificationsStore } from '@/application/stores/notificationsStore'
import { useBranding } from '@/application/composables/useBranding'
import { useRoute, useRouter } from 'vue-router'
import authService from '@/infrastructure/services/authService'
import { ROLES } from '@/core/constants/roles'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useClickOutside } from '@/application/composables/useClickOutside'
import { useNotify } from '@/application/composables/useNotify'
import { useBackendMode } from '@/application/composables/useBackendMode'

const authStore = useAuthStore()
const notificationsStore = useNotificationsStore()
const { logoUrl, appName } = useBranding()
const route  = useRoute()
const router = useRouter()

const userInfo = ref(null)
const tabs     = ref([])
const showUserDropdown          = ref(false)
const showNotificationsDropdown = ref(false)

const { isDemoMode } = useBackendMode()
const { notifySuccess, notifyError, notifyInfo } = useNotify()

const userMenuRef      = ref(null)
const notificationsRef = ref(null)

useClickOutside(userMenuRef,      () => { showUserDropdown.value = false })
useClickOutside(notificationsRef, () => { showNotificationsDropdown.value = false })

// Computed
const userInitials = computed(() => {
  if (!userInfo.value) return '?'
  const f = (userInfo.value.firstName || '')[0] || ''
  const l = (userInfo.value.lastName  || '')[0] || ''
  return (f + l).toUpperCase() || '?'
})

const roleLabels = {
  admin: 'Yönetici', manager: 'Müdür', dataentry: 'Veri Girişi',
  tenant: 'Kiracı', owner: 'Mal Sahibi', observer: 'Gözlemci', viewer: 'İzleyici',
}
const roleLabel = computed(() => roleLabels[(userInfo.value?.role || '').toLowerCase()] || userInfo.value?.role || '')

const isActiveTab = (tabRoute) => {
  if (tabRoute === '/dashboard' || tabRoute === '/tenant-dashboard') {
    return route.path === tabRoute
  }
  return route.path.startsWith(tabRoute)
}

// Notification icon helpers
const notifTypes = {
  Debt:            { bg: 'bg-red-100 dark:bg-red-900/30',    color: 'text-red-600 dark:text-red-400',    path: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z' },
  Payment:         { bg: 'bg-emerald-100 dark:bg-emerald-900/30', color: 'text-emerald-600 dark:text-emerald-400', path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  PaymentCreated:  { bg: 'bg-brand-100 dark:bg-brand-500/[0.12]',   color: 'text-brand-600 dark:text-brand-400',  path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
  Announcement:    { bg: 'bg-amber-100 dark:bg-amber-900/30', color: 'text-amber-600 dark:text-amber-400', path: 'M11 5.882V19.24a1.76 1.76 0 0 1 -3.417 .592l-2.147-6.15M18 13a3 3 0 1 0 0-6M5.436 13.683A4.001 4.001 0 0 1 7 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 0 1 -1.564 -.317z' },
}
const notifIconBg    = (type) => (notifTypes[type] || notifTypes.Announcement).bg
const notifIconColor = (type) => (notifTypes[type] || notifTypes.Announcement).color
const notifIconPath  = (type) => (notifTypes[type] || notifTypes.Announcement).path

const loadUserFromBackend = async () => {
  try {
    const user = await authService.checkAuthStatus()
    if (user) {
      userInfo.value = {
        firstName: user.firstName || user.name || 'Kullanıcı',
        lastName:  user.lastName  || '',
        role:      user.role      || 'Bilinmiyor',
      }
      setTabsBasedOnRole(user.role)
    } else {
      userInfo.value = null
      tabs.value = []
    }
  } catch {
    userInfo.value = null
    tabs.value = []
  }
}

const setTabsBasedOnRole = (role) => {
  const r = (role || '').toLowerCase()
  if ([ROLES.ADMIN, ROLES.MANAGER, ROLES.DATA_ENTRY].includes(r)) {
    tabs.value = [
      { label: 'Özet',        value: 'dashboard', route: '/dashboard'  },
      { label: 'Kiracılar',   value: 'tenants',   route: '/tenants'    },
      { label: 'Ödemeler',    value: 'payments',  route: '/payments'   },
      { label: 'Giderler',    value: 'expenses',  route: '/expenses'   },
      { label: 'Borçlar',     value: 'utilities', route: '/utilities'  },
      { label: 'Üniteler',    value: 'flats',     route: '/flats'      },
      { label: 'Talepler',    value: 'service-requests', route: '/service-requests' },
      { label: 'Raporlar',    value: 'reports',   route: '/reports'    },
    ]
  } else if (r === ROLES.TENANT) {
    tabs.value = [
      { label: 'Özet',    value: 'tenant-dashboard', route: '/tenant-dashboard' },
      { label: 'Talepler', value: 'service-requests', route: '/service-requests' },
      { label: 'Raporlar', value: 'my-payments',     route: '/my-payments'      },
      { label: 'Profilim', value: 'profile',         route: '/profile'          },
    ]
  } else if (r === ROLES.OWNER) {
    tabs.value = [
      { label: 'Mülklerim',   value: 'my-properties', route: '/my-properties' },
      { label: 'Kiracılarım', value: 'my-tenants',    route: '/my-tenants'    },
      { label: 'Talepler',    value: 'service-requests', route: '/service-requests' },
    ]
  } else if (r === ROLES.OBSERVER) {
    tabs.value = [
      { label: 'Özet',    value: 'dashboard', route: '/dashboard' },
      { label: 'Raporlar', value: 'reports',  route: '/reports'   },
    ]
  } else {
    tabs.value = []
  }
}

onMounted(() => {
  const isBackendActive = import.meta.env.VITE_API_BASE_URL &&
    import.meta.env.VITE_API_BASE_URL !== 'http://localhost:5000/api'

  if (isBackendActive) {
    loadUserFromBackend()
    if (authStore.user) notificationsStore.refresh()
  } else {
    const isDemo = !import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_BASE_URL === 'http://localhost:5000/api'
    if (isDemo) {
      setTimeout(() => {
        userInfo.value = { firstName: 'Demo', lastName: 'Kullanıcı', role: 'admin' }
        setTabsBasedOnRole('admin')
      }, 800)
    }
  }
})

watch(() => authStore.user, (newUser) => {
  if (newUser && import.meta.env.VITE_API_BASE_URL &&
      import.meta.env.VITE_API_BASE_URL !== 'http://localhost:5000/api') {
    notificationsStore.refresh()
  }
})

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
  if (showUserDropdown.value) showNotificationsDropdown.value = false
}
const toggleNotifications = () => {
  // On mobile, go straight to notifications page
  if (window.innerWidth < 768) {
    showNotificationsDropdown.value = false
    router.push('/notifications')
    return
  }
  showNotificationsDropdown.value = !showNotificationsDropdown.value
  if (showNotificationsDropdown.value) {
    showUserDropdown.value = false
    notificationsStore.refresh()
  }
}

const handleNotificationClick = async (notification) => {
  if (!notification.isRead) await notificationsStore.markAsRead(notification.id)
  showNotificationsDropdown.value = false
  if (notification.type === 'Debt') router.push('/dashboard')
}

const formatDate = (date) => {
  if (!date) return ''
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: tr })
}

const logout = async () => {
  showUserDropdown.value = false
  const isBackendActive = import.meta.env.VITE_API_BASE_URL &&
    import.meta.env.VITE_API_BASE_URL !== 'http://localhost:5000/api'
  try {
    if (isBackendActive) await authService.logout()
  } catch { /* ignore */ }
  userInfo.value = null
  tabs.value = []
  router.push('/login')
}

const changePassword = async () => {
  showUserDropdown.value = false
  if (isDemoMode.value) {
    notifyInfo('Demo modu: Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.')
    return
  }
  try {
    const user = await authService.checkAuthStatus()
    if (user?.email) {
      await authService.resetPassword(user.email)
      notifySuccess('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.')
    } else {
      notifyError('Kullanıcı bilgileri bulunamadı.')
    }
  } catch {
    notifyError('Bir hata oluştu. Lütfen tekrar deneyin.')
  }
}
</script>

<style scoped>
.font-cormorantSC {
  font-family: 'Cormorant SC', serif;
}
</style>
