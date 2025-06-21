<template>
  <header class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo ve Başlık -->
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0 flex items-center gap-2">
            <svg class="h-8 w-auto text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6M9 15.75h6" />
            </svg>
            <span class="text-xl font-semibold font-cormorantSC hidden md:block">AKYILDIZ İŞ MERKEZİ</span>
          </router-link>
        </div>

        <!-- Navigasyon Linkleri (Orta Alan - Geniş Ekran) -->
        <nav class="hidden md:flex md:items-center md:space-x-2">
          <router-link
            v-for="tab in tabs"
            :key="tab.value"
            :to="tab.route"
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="[
              route.path === tab.route 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            ]"
          >
            {{ tab.label }}
          </router-link>
        </nav>

        <!-- Kullanıcı Menüsü ve Mobil Menü Butonu (Sağ Alan) -->
        <div class="flex items-center">
          <!-- Kullanıcı Dropdown -->
          <div v-if="userInfo" class="relative">
            <button @click="toggleUserDropdown" class="flex items-center gap-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span class="sr-only">Kullanıcı menüsünü aç</span>
              <span class="hidden sm:inline">{{ userInfo.firstName }}</span>
              <svg class="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.5 5.5 0 00-4.52 2.39a.75.75 0 001.33.82a3.5 3.5 0 016.38 0a.75.75 0 001.33-.82A5.5 5.5 0 0010 12z" clip-rule="evenodd" />
              </svg>
            </button>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div v-if="showUserDropdown" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="px-4 py-2 text-xs text-gray-500 border-b">
                  <p class="font-semibold text-gray-700">{{ userInfo.firstName }} {{ userInfo.lastName }}</p>
                  <p>{{ userInfo.role }}</p>
                </div>
                <a href="#" @click.prevent="changePassword" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>
                  Şifre Değiştir
                </a>
                <a href="#" @click.prevent="logout" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                  Çıkış Yap
                </a>
              </div>
            </transition>
          </div>

          <!-- Mobil Menü Butonu -->
          <div class="ml-2 -mr-2 flex md:hidden">
            <button @click="toggleMobileMenu" class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span class="sr-only">Ana menüyü aç</span>
              <svg v-if="!isMobileMenuOpen" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <svg v-else class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobil Menü (Açılır) -->
    <div v-if="isMobileMenuOpen" class="md:hidden" id="mobile-menu">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <router-link
          v-for="tab in tabs"
          :key="tab.value"
          :to="tab.route"
          @click="isMobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-base font-medium"
          :class="[
            route.path === tab.route 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          ]"
        >
          {{ tab.label }}
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAuth, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { ROLES } from '@/constants/roles'

const route = useRoute()
const router = useRouter()
const auth = getAuth()

const userInfo = ref(null)
const tabs = ref([])
const showUserDropdown = ref(false)
const isMobileMenuOpen = ref(false)

const clickOutsideHandler = (event) => {
  const userDropdown = document.querySelector('.relative button');
  if (userDropdown && !userDropdown.contains(event.target) && !event.target.closest('.origin-top-right')) {
    showUserDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', clickOutsideHandler)

  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
      if (userDoc.exists()) {
        const data = userDoc.data();
        userInfo.value = {
          ...data,
          role: data.role || 'Bilinmiyor'
        };

        // Set tabs based on role
        if (data.role === ROLES.ADMIN) {
          tabs.value = [
            { label: 'Özet', value: 'dashboard', route: '/dashboard' },
            { label: 'Kiracılar', value: 'tenants', route: '/tenants' },
            { label: 'Ödemeler', value: 'payments', route: '/payments' },
            { label: 'Giderler', value: 'expenses', route: '/expenses' },
            { label: 'Sayaçlar', value: 'utilities', route: '/utilities' },
            { label: 'Yönetim', value: 'admin', route: '/admin' }
          ]
        } else if (data.role === ROLES.MANAGER) {
           tabs.value = [
            { label: 'Özet', value: 'dashboard', route: '/dashboard' },
            { label: 'Kiracılar', value: 'tenants', route: '/tenants' },
            { label: 'Ödemeler', value: 'payments', route: '/payments' },
            { label: 'Giderler', value: 'expenses', route: '/expenses' },
            { label: 'Sayaçlar', value: 'utilities', route: '/utilities' }
          ]
        } else if (data.role === ROLES.TENANT) {
          tabs.value = [
            { label: 'Profilim', value: 'profile', route: '/profile' }
          ]
        } else {
            tabs.value = []
        }
      }
    } else {
      userInfo.value = null
      tabs.value = []
    }
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', clickOutsideHandler)
})

watch(route, () => {
  isMobileMenuOpen.value = false;
});

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const logout = async () => {
  showUserDropdown.value = false;
  await signOut(auth);
  router.push('/login');
}

const changePassword = async () => {
  const user = auth.currentUser
  if (user && user.email) {
    try {
      await sendPasswordResetEmail(auth, user.email)
      alert('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.')
    } catch (error) {
      console.error("Şifre sıfırlama e-postası gönderme hatası:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }
  showUserDropdown.value = false;
}
</script>

<style scoped>
.font-cormorantSC {
  font-family: 'Cormorant SC', serif;
}
</style>
