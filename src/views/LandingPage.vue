<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
    <!-- Navigation -->
    <nav class="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Akyıldız Yönetim
            </span>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <a href="#services" class="text-gray-300 hover:text-white transition-colors duration-200">Hizmetlerimiz</a>
            <a href="#about" class="text-gray-300 hover:text-white transition-colors duration-200">Hakkımızda</a>
            <a href="#contact" class="text-gray-300 hover:text-white transition-colors duration-200">İletişim</a>
            <router-link 
              :to="{ name: 'Login' }" 
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Sisteme Giriş
            </router-link>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button @click="toggleMobileMenu" class="text-gray-300 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-700">
          <div class="flex flex-col space-y-4">
            <a href="#services" class="text-gray-300 hover:text-white transition-colors duration-200">Hizmetlerimiz</a>
            <a href="#about" class="text-gray-300 hover:text-white transition-colors duration-200">Hakkımızda</a>
            <a href="#contact" class="text-gray-300 hover:text-white transition-colors duration-200">İletişim</a>
            <router-link 
              :to="{ name: 'Login' }" 
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 text-center"
            >
              Sisteme Giriş
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
            Akyıldız Yönetim
            <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Profesyonel Hizmet
            </span>
          </h1>
          <p class="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            İstanbul'un güvenilir apartman ve site yönetim firması. Modern teknoloji ve 
            profesyonel yaklaşımımızla mülk sahiplerine ve kiracılara kaliteli hizmet sunuyoruz.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link 
              :to="{ name: 'Login' }" 
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Sisteme Giriş
            </router-link>
            <a 
              href="#services" 
              class="border-2 border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
            >
              Hizmetlerimiz
            </a>
          </div>
        </div>
      </div>

      <!-- Floating elements -->
      <div class="absolute top-20 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute top-40 right-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-40 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Akyıldız Yönetim Hizmetleri
          </h2>
          <p class="text-xl text-gray-300 max-w-2xl mx-auto">
            Profesyonel ekibimizle sunduğumuz kapsamlı apartman ve site yönetim hizmetleri
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Service 1 -->
          <div class="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 hover:bg-gray-700/80">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Kiracı Yönetimi</h3>
            <p class="text-gray-300">
              Kiracı sözleşmeleri, aidat takibi, iletişim yönetimi ve kiracı memnuniyeti odaklı hizmet.
            </p>
          </div>

          <!-- Service 2 -->
          <div class="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 hover:bg-gray-700/80">
            <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Finansal Yönetim</h3>
            <p class="text-gray-300">
              Aidat toplama, gider kontrolü, bütçe yönetimi ve şeffaf finansal raporlama hizmetleri.
            </p>
          </div>

          <!-- Service 3 -->
          <div class="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 hover:bg-gray-700/80">
            <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Bakım & Onarım</h3>
            <p class="text-gray-300">
              Düzenli bakım, acil onarım, teknik servis koordinasyonu ve kalite kontrol hizmetleri.
            </p>
          </div>

          <!-- Service 4 -->
          <div class="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 hover:bg-gray-700/80">
            <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Güvenlik Hizmetleri</h3>
            <p class="text-gray-300">
              7/24 güvenlik personeli, kamera sistemleri, ziyaretçi kontrolü ve güvenlik protokolleri.
            </p>
          </div>

          <!-- Service 5 -->
          <div class="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 hover:bg-gray-700/80">
            <div class="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Hukuki Danışmanlık</h3>
            <p class="text-gray-300">
              Kat mülkiyeti hukuku, kiracı-sahip uyuşmazlıkları ve yasal süreç yönetimi desteği.
            </p>
          </div>

          <!-- Service 6 -->
          <div class="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 hover:bg-gray-700/80">
            <div class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Teknoloji Desteği</h3>
            <p class="text-gray-300">
              Dijital yönetim sistemi, online ödeme, mobil uygulama ve 7/24 teknik destek.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
              Akyıldız Yönetim Hakkında
            </h2>
            <p class="text-lg text-gray-300 mb-6">
              2024 yılında İstanbul'da kurulan Akyıldız Yönetim, apartman ve site yönetiminde 
              güvenilir ve kaliteli hizmet anlayışıyla yola çıktı.
            </p>
            <p class="text-lg text-gray-300 mb-8">
              Modern teknoloji ve yenilikçi yaklaşımımızla, müşteri memnuniyeti odaklı 
              hizmet anlayışımız ve profesyonel ekibimizle sektörde fark yaratmayı hedefliyoruz.
            </p>
            <div class="grid grid-cols-2 gap-6">
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-400 mb-2">100+</div>
                <div class="text-gray-300">Mutlu Müşteri</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                <div class="text-gray-300">Destek Hizmeti</div>
              </div>
            </div>
          </div>
          <div class="relative">
            <div class="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
              <h3 class="text-2xl font-bold mb-4 text-white">Misyonumuz</h3>
              <p class="text-gray-300 mb-6">
                Mülk sahiplerinin ve kiracıların yaşam kalitesini artırmak, güvenli ve 
                konforlu yaşam alanları oluşturmak için modern teknoloji destekli yönetim hizmeti sunmak.
              </p>
              <h3 class="text-2xl font-bold mb-4 text-white">Vizyonumuz</h3>
              <p class="text-gray-300">
                İstanbul'da güvenilir ve tercih edilen apartman yönetim firması olmak, 
                teknoloji ile geleneksel hizmet anlayışını birleştirerek sektöre değer katmak.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            İletişime Geçin
          </h2>
          <p class="text-xl text-gray-300 max-w-2xl mx-auto">
            Sorularınız için bizimle iletişime geçebilirsiniz
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">E-posta</h3>
            <p class="text-gray-300">info@akyildizyonetim.com</p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Telefon</h3>
            <p class="text-gray-300">+90 (212) 555 0123</p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Adres</h3>
            <p class="text-gray-300">İstanbul, Türkiye</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <span class="text-xl font-bold">Akyıldız Yönetim</span>
            </div>
            <p class="text-gray-400">
              İstanbul'un güvenilir apartman ve site yönetim firması.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4 text-white">Ürün</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#services" class="hover:text-white transition-colors duration-200">Hizmetlerimiz</a></li>
              <li><a href="#" class="hover:text-white transition-colors duration-200">Fiyatlandırma</a></li>
              <li><a href="#" class="hover:text-white transition-colors duration-200">Demo</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4 text-white">Şirket</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#about" class="hover:text-white transition-colors duration-200">Hakkımızda</a></li>
              <li><a href="#contact" class="hover:text-white transition-colors duration-200">İletişim</a></li>
              <li><a href="#" class="hover:text-white transition-colors duration-200">Kariyer</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4 text-white">Destek</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors duration-200">Yardım Merkezi</a></li>
              <li><a href="#" class="hover:text-white transition-colors duration-200">Dokümantasyon</a></li>
              <li><a href="#" class="hover:text-white transition-colors duration-200">İletişim</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Akyıldız Yönetim. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
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