<template>
  <div>
    <!-- Daha Fazla Menüsü (Bottom Sheet) -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div v-if="showMoreMenu" class="md:hidden fixed inset-x-0 bottom-0 z-[60] bg-white dark:bg-gray-800 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-safe-offset">
        <div class="px-6 py-4">
          <div class="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6" @click="showMoreMenu = false"></div>
          <div class="grid grid-cols-3 gap-y-6">
            <template v-for="item in moreItems" :key="item.path">
              <button 
                v-if="item.action"
                @click="item.action"
                class="flex flex-col items-center gap-2"
              >
                <div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-2xl text-gray-600 dark:text-gray-300">
                  <component :is="item.icon" class="w-6 h-6" />
                </div>
                <span class="text-[11px] font-medium text-gray-600 dark:text-gray-400">{{ item.name }}</span>
              </button>
              <router-link 
                v-else
                :to="item.path"
                class="flex flex-col items-center gap-2"
                @click="showMoreMenu = false"
              >
                <div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-2xl text-gray-600 dark:text-gray-300">
                  <component :is="item.icon" class="w-6 h-6" />
                </div>
                <span class="text-[11px] font-medium text-gray-600 dark:text-gray-400">{{ item.name }}</span>
              </router-link>
            </template>
          </div>
          <button @click="showMoreMenu = false" class="w-full mt-8 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-bold text-gray-600 dark:text-gray-300">Kapat</button>
        </div>
      </div>
    </transition>

    <!-- Overlay -->
    <transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showMoreMenu" class="md:hidden fixed inset-0 bg-black/40 z-[55] backdrop-blur-sm" @click="showMoreMenu = false"></div>
    </transition>

    <!-- Ana Alt Navigasyon -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50 z-50 px-4 pb-safe pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div class="flex justify-between items-center max-w-lg mx-auto">
        <template v-for="item in visibleNavItems" :key="item.name">
          <!-- Normal Link -->
          <router-link 
            v-if="item.path"
            :to="item.path"
            class="flex flex-col items-center gap-1 flex-1 group"
            v-slot="{ isActive }"
          >
            <div 
              class="p-2.5 rounded-2xl transition-all duration-300"
              :class="isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none -translate-y-1' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-500'"
            >
              <component :is="item.icon" class="w-6 h-6" />
            </div>
            <span 
              class="text-[10px] font-bold transition-all duration-300"
              :class="isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'"
            >
              {{ item.name }}
            </span>
          </router-link>

          <!-- More Button Trigger -->
          <button 
            v-else
            @click="showMoreMenu = !showMoreMenu"
            class="flex flex-col items-center gap-1 flex-1 group"
          >
            <div 
              class="p-2.5 rounded-2xl transition-all duration-300"
              :class="showMoreMenu ? 'bg-gray-800 text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-500'"
            >
              <component :is="item.icon" class="w-6 h-6" />
            </div>
            <span 
              class="text-[10px] font-bold transition-all duration-300"
              :class="showMoreMenu ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500'"
            >
              {{ item.name }}
            </span>
          </button>
        </template>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const showMoreMenu = ref(false)

const logout = () => {
  showMoreMenu.value = false
  // Header.vue'daki ile aynı logout mantığı
  router.push('/login')
}

const visibleNavItems = computed(() => {
  const role = (authStore.user?.role || '').toLowerCase()
  
  if (role === 'tenant') {
    return [
      { name: 'Özet', path: '/dashboard', icon: DashboardIcon },
      { name: 'Ödemelerim', path: '/my-payments', icon: WalletIcon },
      { name: 'Bildirimler', path: '/notifications', icon: BellIcon },
      { name: 'Profil', path: '/profile', icon: UserIcon },
      { name: 'Menü', icon: MenuIcon } // More for tenant
    ]
  }

  // Admin / Manager / DataEntry
  return [
    { name: 'Özet', path: '/dashboard', icon: DashboardIcon },
    { name: 'Kiracılar', path: '/tenants', icon: UsersIcon },
    { name: 'Finans', path: '/payments', icon: WalletIcon }, // Ana finans öğesi ödemelere gitsin
    { name: 'Raporlar', path: '/reports', icon: ChartIcon },
    { name: 'Menü', icon: MenuIcon }
  ]
})

const moreItems = computed(() => {
  const role = (authStore.user?.role || '').toLowerCase()
  
  if (role === 'tenant') {
    return [
      { name: 'Şifre Değiştir', path: '/change-password', icon: LockIcon },
      { name: 'Çıkış Yap', action: logout, icon: LogoutIcon }
    ]
  }

  // Admin / Manager
  const items = [
    { name: 'Giderler', path: '/expenses', icon: ExpenseIcon },
    { name: 'Borçlar', path: '/utilities', icon: BoltIcon },
    { name: 'Üniteler', path: '/flats', icon: HomeIcon },
    { name: 'Mal Sahipleri', path: '/owners', icon: BuildingIcon },
    { name: 'Bildirimler', path: '/notifications', icon: BellIcon },
    { name: 'Profil', path: '/profile', icon: UserIcon },
    { name: 'Çıkış Yap', action: logout, icon: LogoutIcon }
  ]

  if (role === 'admin') {
    items.unshift({ name: 'Yönetim', path: '/admin', icon: AdminIcon })
  }

  return items
})

// Icons
const DashboardIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" /></svg>` }
const UsersIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>` }
const WalletIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></svg>` }
const ChartIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>` }
const UserIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>` }
const MenuIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>` }
const BellIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>` }
const BoltIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>` }
const ExpenseIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75H21m0 0v-3.375c0-.621-.504-1.125-1.125-1.125H3.75m17.25 4.5v12.75c0 .621-.504 1.125-1.125 1.125H16.125" /></svg>` }
const HomeIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>` }
const BuildingIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>` }
const AdminIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z" /></svg>` }
const LogoutIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>` }
const LockIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>` }
</script>

<style scoped>
.pb-safe {
  padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
}
.pb-safe-offset {
  padding-bottom: calc(2rem + env(safe-area-inset-bottom));
}
</style>

