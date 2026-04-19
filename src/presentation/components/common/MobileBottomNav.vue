<template>
  <div>
    <!-- Overlay -->
    <transition
      enter-active-class="transition-opacity duration-250"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showMoreMenu"
        class="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
        @click="showMoreMenu = false" />
    </transition>

    <!-- More menu bottom sheet -->
    <transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div v-if="showMoreMenu"
        class="md:hidden fixed inset-x-0 bottom-0 z-[60] bg-white dark:bg-[#0f1322] rounded-t-3xl shadow-[0_-8px_32px_rgba(0,0,0,0.2)] border-t border-slate-200/60 dark:border-white/[0.06]">
        <div class="px-5 pt-4 pb-safe-offset">
          <!-- Handle -->
          <div class="w-10 h-1 bg-slate-200 dark:bg-[#1c2238] rounded-full mx-auto mb-5" @click="showMoreMenu = false" />

          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">Diğer</p>

          <div class="grid grid-cols-3 gap-3">
            <template v-for="item in moreItems" :key="item.path || item.name">
              <button
                v-if="item.action"
                @click="item.action"
                class="flex flex-col items-center gap-2 p-3 rounded-2xl transition-colors"
                :class="item.danger
                  ? 'hover:bg-red-50 dark:hover:bg-red-950/30'
                  : 'hover:bg-slate-50 dark:hover:bg-white/[0.04]'"
              >
                <div class="w-11 h-11 rounded-2xl flex items-center justify-center"
                  :class="item.danger
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    : 'bg-slate-100 dark:bg-[#151a2e] text-slate-600 dark:text-[#f1f3f9]'">
                  <component :is="item.icon" class="w-5 h-5" />
                </div>
                <span class="text-[11px] font-medium leading-tight text-center"
                  :class="item.danger ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-[#9aa0b4]'">
                  {{ item.name }}
                </span>
              </button>

              <router-link
                v-else
                :to="item.path"
                @click="showMoreMenu = false"
                class="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
              >
                <div class="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-[#151a2e] text-slate-600 dark:text-[#f1f3f9] flex items-center justify-center">
                  <component :is="item.icon" class="w-5 h-5" />
                </div>
                <span class="text-[11px] font-medium text-slate-600 dark:text-[#9aa0b4] leading-tight text-center">{{ item.name }}</span>
              </router-link>
            </template>
          </div>

          <button @click="showMoreMenu = false"
            class="w-full mt-4 py-3 rounded-xl bg-slate-100 dark:bg-[#151a2e] text-sm font-semibold text-slate-600 dark:text-[#9aa0b4] hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-colors">
            Kapat
          </button>
        </div>
      </div>
    </transition>

    <!-- Bottom nav bar -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-[50]
      bg-[#0f1322]/80 backdrop-blur-xl
      border-t border-white/[0.08]
      shadow-[0_-8px_32px_rgba(0,0,0,0.4)]
      pb-safe">
      <div class="flex items-center justify-around h-16 px-2">
        <template v-for="item in visibleNavItems" :key="item.name">

          <!-- Normal route link -->
          <router-link
            v-if="item.path"
            :to="item.path"
            class="flex flex-col items-center justify-center gap-1 flex-1 min-w-0 h-full relative"
            v-slot="{ isActive }"
          >
            <!-- Active indicator pill (Top) -->
            <transition enter-active-class="transition-all duration-300" enter-from-class="scale-x-0 opacity-0" enter-to-class="scale-x-100 opacity-100">
              <span v-if="isActive" class="absolute top-0 w-10 h-1 rounded-full bg-brand-500 shadow-[0_0_12px_rgba(107,138,255,0.6)]" />
            </transition>

            <div class="flex items-center justify-center w-6 h-6 transition-all duration-200"
              :class="isActive ? 'text-brand-500 scale-110' : 'text-[#626885]'">
              <component :is="item.icon" class="w-6 h-6" :stroke-width="isActive ? '2.25' : '1.75'" />
              
              <!-- Badge -->
              <span v-if="item.badge" class="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f1322]" />
            </div>
            
            <span class="text-[10px] font-black tracking-tight leading-none truncate max-w-full px-1 transition-colors duration-150 uppercase"
              :class="isActive ? 'text-brand-500' : 'text-[#626885]'">
              {{ item.name }}
            </span>
          </router-link>

          <!-- More button -->
          <button
            v-else
            @click="showMoreMenu = !showMoreMenu"
            class="flex flex-col items-center justify-center gap-1 flex-1 min-w-0 h-full relative"
          >
            <div class="flex items-center justify-center w-6 h-6 transition-all duration-200"
              :class="showMoreMenu ? 'text-white scale-110' : 'text-[#626885]'">
              <component :is="item.icon" class="w-6 h-6" />
            </div>
            <span class="text-[10px] font-black tracking-tight leading-none truncate max-w-full px-1 transition-colors duration-150 uppercase"
              :class="showMoreMenu ? 'text-white' : 'text-[#626885]'">
              {{ item.name }}
            </span>
          </button>

        </template>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useAuthStore } from '@/application/stores/auth'
import { useNotificationsStore } from '@/application/stores/notificationsStore'
import { useRouter } from 'vue-router'

const authStore            = useAuthStore()
const notificationsStore   = useNotificationsStore()
const router               = useRouter()
const showMoreMenu          = ref(false)

const logout = () => {
  showMoreMenu.value = false
  router.push('/login')
}

const visibleNavItems = computed(() => {
  const role = (authStore.role || '').toLowerCase()

  if (role === 'tenant') return [
    { name: 'Ana Sayfa', path: '/tenant-dashboard', icon: DashboardIcon },
    { name: 'Borçlarım', path: '/my-payments',      icon: WalletIcon    },
    { name: 'Talepler',  path: '/service-requests', icon: ChatIcon      },
    { name: 'Profil',    path: '/profile',          icon: UserIcon      },
  ]

  if (role === 'owner') return [
    { name: 'Ana Sayfa', path: '/owner-dashboard',  icon: DashboardIcon },
    { name: 'Mülklerim', path: '/my-properties',     icon: BuildingIcon  },
    { name: 'Talepler',  path: '/service-requests',  icon: ChatIcon      },
    { name: 'Profil',    path: '/profile',           icon: UserIcon      },
  ]

  if (role === 'observer') return [
    { name: 'Ana Sayfa', path: '/dashboard',     icon: DashboardIcon },
    { name: 'Raporlar',  path: '/reports',       icon: ChartIcon     },
    { name: 'Bildirim',  path: '/notifications', icon: BellIcon, badge: notificationsStore.unreadCount > 0 },
    { name: 'Profil',    path: '/profile',        icon: UserIcon      },
  ]

  // Admin / Manager / DataEntry
  return [
    { name: 'Özet',     path: '/dashboard', icon: DashboardIcon },
    { name: 'Kiracılar', path: '/tenants',   icon: UsersIcon     },
    { name: 'Finans',   path: '/payments',  icon: WalletIcon    },
    { name: 'Raporlar', path: '/reports',   icon: ChartIcon     },
    { name: 'Menü',                         icon: MenuIcon      },
  ]
})

const moreItems = computed(() => {
  const role = (authStore.role || '').toLowerCase()

  if (role === 'tenant' || role === 'owner') return [
    { name: 'Çıkış Yap', action: logout, icon: LogoutIcon, danger: true },
  ]

  if (role === 'observer') return [
    { name: 'Profil',    path: '/profile', icon: UserIcon   },
    { name: 'Çıkış Yap', action: logout,  icon: LogoutIcon, danger: true },
  ]

  // Admin / Manager / DataEntry
  const items = [
    { name: 'Talepler',     path: '/service-requests', icon: ChatIcon     },
    { name: 'Giderler',     path: '/expenses',      icon: ExpenseIcon  },
    { name: 'Borçlar',      path: '/utilities',     icon: BoltIcon     },
    { name: 'Üniteler',     path: '/flats',         icon: HomeIcon     },
    { name: 'Mal Sahipleri', path: '/owners',       icon: BuildingIcon },
    { name: 'Bildirimler',  path: '/notifications', icon: BellIcon     },
    { name: 'Profil',       path: '/profile',        icon: UserIcon     },
    { name: 'Çıkış Yap',   action: logout,          icon: LogoutIcon, danger: true },
  ]

  if (role === 'admin') {
    items.unshift({ name: 'Yönetim', path: '/admin', icon: AdminIcon })
  }

  return items
})

// Icon factory
const makeIcon = (d) => (_, { attrs }) =>
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.75', stroke: 'currentColor', ...attrs },
    [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d })])

const DashboardIcon = makeIcon('M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z')
const UsersIcon     = makeIcon('M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z')
const WalletIcon    = makeIcon('M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3')
const ChartIcon     = makeIcon('M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z')
const UserIcon      = makeIcon('M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z')
const MenuIcon      = makeIcon('M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5')
const BellIcon      = makeIcon('M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0')
const BoltIcon      = makeIcon('M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z')
const ExpenseIcon   = makeIcon('M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75H21m0 0v-3.375c0-.621-.504-1.125-1.125-1.125H3.75')
const HomeIcon      = makeIcon('M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25')
const BuildingIcon  = makeIcon('M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z')
const AdminIcon     = makeIcon('M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z')
const ChatIcon      = makeIcon('M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z')
const LogoutIcon    = makeIcon('M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9')
</script>

<style scoped>
.pb-safe {
  padding-bottom: max(0.375rem, env(safe-area-inset-bottom));
}
.pb-safe-offset {
  padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
}
</style>
