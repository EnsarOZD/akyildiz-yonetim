<template>
  <div v-if="authStore.isInitialized && canViewDashboard" class="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      
      <!-- Başlık ve Kontroller -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
        
        <div class="flex items-center gap-3">
          <!-- Tarih Filtresi -->
          <select 
            v-model="dateFilter" 
            @change="loadDashboardData"
            class="select select-sm select-bordered bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
          >
            <option value="all">Tüm Zamanlar</option>
            <option value="this_month">Bu Ay</option>
            <option value="last_month">Geçen Ay</option>
            <option value="this_year">Bu Yıl</option>
          </select>
          
          <!-- Refresh Butonu -->
          <button 
            @click="loadDashboardData" 
            :disabled="loading"
            class="btn btn-sm btn-outline btn-primary active:scale-[0.98] active:opacity-90 transition-all"
          >
            <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            Yenile
          </button>
        </div>
      </div>

      <!-- Loading durumu -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400 text-lg">Dashboard verileri yükleniyor...</p>
        </div>
      </div>

      <!-- Error durumu -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
        <div class="flex items-center gap-3">
          <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-red-800 dark:text-red-200">Veri Yükleme Hatası</h3>
            <p class="text-red-600 dark:text-red-300">{{ error }}</p>
          </div>
        </div>
        <button 
          @click="loadDashboardData" 
          class="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Tekrar Dene
        </button>
      </div>

      <!-- Dashboard içeriği -->
      <div v-else>

      <div v-if="notificationsStore.latestAnnouncement" class="mb-8 overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-purple-100 dark:border-purple-900/30 flex flex-col sm:flex-row items-stretch">
        <div class="bg-purple-600 px-4 py-3 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
        <div class="flex-1 p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="min-w-0">
            <h3 class="text-sm font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-1 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              Son Önemli Duyuru
            </h3>
            <p class="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">{{ notificationsStore.latestAnnouncement.title }}</p>
            <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 md:line-clamp-1">{{ notificationsStore.latestAnnouncement.message }}</p>
          </div>
          <router-link 
            to="/notifications" 
            class="flex-shrink-0 px-6 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl text-sm font-bold hover:bg-purple-100 dark:hover:bg-purple-900/40 transition flex items-center justify-center gap-2"
          >
            Detayları Gör
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </div>

      <!-- Özet Kartları -->
      <!-- Finansal Durum & Özet -->
      <section v-if="userRole !== 'viewer'" class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        
        <!-- Sol Kolon: Finansal Özet (Bakiye, Gelir, Gider) -->
        <div class="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Kasa Bakiyesi -->
          <router-link to="/transactions" class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-green-200 dark:hover:border-green-800 transition-all cursor-pointer group">
            <div class="flex flex-col h-full justify-between">
              <div class="flex items-start justify-between mb-2">
                <div class="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span class="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full">Güncel</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Kasa Bakiyesi</p>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{{ formatCurrency(balance) }}</h3>
              </div>
            </div>
          </router-link>

          <!-- Toplam Gelir -->
          <router-link to="/payments" class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer group">
            <div class="flex flex-col h-full justify-between">
              <div class="flex items-start justify-between mb-2">
                <div class="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Toplam Gelir</p>
                <h3 class="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{{ formatCurrency(totalIncome) }}</h3>
                <p class="text-xs text-blue-500 mt-1">+{{ formatCurrency(thisMonthTenantPayments) }} bu ay</p>
              </div>
            </div>
          </router-link>

          <!-- Toplam Gider -->
          <router-link to="/expenses" class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-red-200 dark:hover:border-red-800 transition-all cursor-pointer group">
            <div class="flex flex-col h-full justify-between">
              <div class="flex items-start justify-between mb-2">
                <div class="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Toplam Gider</p>
                <h3 class="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{{ formatCurrency(totalExpense) }}</h3>
                <p class="text-xs text-gray-400 mt-1">{{ expenses.length }} kalem işlem</p>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Sağ Kolon: İstatistikler & Aidat Durumu -->
        <div class="md:col-span-4 grid grid-cols-1 gap-4">
          <!-- Borç/Alacak Özeti (Yeni Bileşen) -->
          <router-link to="/utilities" class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
            <div class="absolute top-0 right-0 p-3 opacity-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            
            <h4 class="text-base font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span class="w-2 h-6 bg-orange-500 rounded-full"></span>
              Bekleyen Alacaklar
            </h4>
            
            <div class="space-y-3">
              <!-- Aidat -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Aidat
                </span>
                <span class="font-bold text-gray-800 dark:text-gray-100">{{ formatCurrency(totalAidatDebt) }}</span>
              </div>
              <!-- Elektrik -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                   <span class="w-2 h-2 rounded-full bg-amber-500"></span> Elektrik
                </span>
                <span class="font-bold text-gray-800 dark:text-gray-100">{{ formatCurrency(totalElectricityDebt) }}</span>
              </div>
              <!-- Su -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                   <span class="w-2 h-2 rounded-full bg-blue-500"></span> Su
                </span>
                <span class="font-bold text-gray-800 dark:text-gray-100">{{ formatCurrency(totalWaterDebt) }}</span>
              </div>
              
              <div class="h-px bg-gray-100 dark:bg-gray-700 my-2"></div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-500">Toplam</span>
                <span class="text-lg font-bold text-orange-600">{{ formatCurrency(totalUtilityDebts) }}</span>
              </div>
            </div>
          </router-link>
        </div>
      </section>

      <!-- Hızlı İşlemler (Yeni Tasarım) -->
      <section class="mb-8">
        <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 px-1">Hızlı İşlemler</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          <!-- Borç Ekle (Dropdown) -->
          <div class="dropdown dropdown-end sm:dropdown-bottom">
            <div tabindex="0" role="button" class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group h-full w-full cursor-pointer">
              <div class="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">Borç Ekle</span>
              <span class="text-[10px] text-gray-400 mt-0.5">Seçenekler ▼</span>
            </div>
            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-2 dark:bg-gray-800 border dark:border-gray-700">
              <li><a @click="openManualDebtModal(0)" class="dark:text-gray-200"><span class="text-lg mr-2">📋</span> Aidat Ekle</a></li>
              <li><a @click="openManualDebtModal(1)" class="dark:text-gray-200"><span class="text-lg mr-2">⚡</span> Elektrik Ekle</a></li>
              <li><a @click="openManualDebtModal(2)" class="dark:text-gray-200"><span class="text-lg mr-2">💧</span> Su Ekle</a></li>
            </ul>
          </div>

          <!-- Tahsilat Al (Yeni) -->
          <router-link to="/payments" class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group">
            <div class="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mb-2 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">Tahsilat Al</span>
            <span class="text-[10px] text-gray-400 mt-0.5">Ödeme girişi</span>
          </router-link>

          <!-- Yeni Gider -->
          <router-link to="/expenses" class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group">
            <div class="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full mb-2 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">Gider Ekle</span>
            <span class="text-[10px] text-gray-400 mt-0.5">Fatura, fiş vb.</span>
          </router-link>

          <!-- Kiracı Listesi -->
          <router-link to="/tenants" class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group">
            <div class="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full mb-2 group-hover:scale-110 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">Kiracılar</span>
            <span class="text-[10px] text-gray-400 mt-0.5">{{ activeTenantsCount }} aktif kiracı</span>
          </router-link>

           <!-- Raporlar -->
           <router-link to="/reports" class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group">
            <div class="p-3 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-full mb-2 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">Raporlar</span>
            <span class="text-[10px] text-gray-400 mt-0.5">Detaylı analiz</span>
          </router-link>
        </div>
      </section>

      <!-- Geciken Ödemeler -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Geciken Ödemeler</h2>
          <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm font-medium">
            {{ overdueItems.length }} adet
          </div>
        </div>
        
        <div v-if="overdueItems.length > 0" class="space-y-3">
          <div 
            v-for="item in overdueItems.slice(0, 5)" 
            :key="item.id"
            class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 gap-3"
          >
            <div class="flex items-center gap-3">
              <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="font-medium text-gray-800 dark:text-gray-100 truncate">{{ item.company }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ item.floor }} - {{ item.typeLabel }}</p>
              </div>
            </div>
            <div class="text-left sm:text-right border-t sm:border-0 pt-2 sm:pt-0">
              <p class="font-semibold text-red-600 dark:text-red-400">{{ formatCurrency(item.amount) }}</p>
              <p class="text-[10px] text-gray-500 dark:text-gray-400">{{ formatDate(item.dueDate) }}</p>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8">
          <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full p-3 w-fit mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400">Geciken ödeme bulunmuyor.</p>
        </div>

        <!-- Tümünü Gör Butonu -->
        <div v-if="overdueItems.length > 0" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <router-link 
            to="/overdue" 
            class="inline-flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
          >
            Tümünü Gör
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </section>

      <!-- Borç Özet Tablosu (Yeni) -->
      <section v-if="userRole !== 'tenant'" class="mb-8">
        <DebtsTable :debts="debtsSummary" :loading="loading" />
      </section>

      <!-- Aylık Gelir/Gider Grafiği -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Aylık Gelir/Gider Grafiği</h2>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Gelir</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Gider</span>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto pb-4">
          <div class="h-64 flex items-end justify-between gap-4 min-w-[500px] px-2">
            <div 
              v-for="(month, index) in monthlyData" 
              :key="index"
              class="flex-1 flex flex-col items-center gap-2 group relative"
            >
              <!-- Gelir çubuğu -->
              <div 
                class="w-full max-w-[20px] bg-green-500 rounded-t hover:bg-green-600 transition-all cursor-help"
                :style="{ height: `${(month.income / maxAmount) * 200}px` }"
                :title="`Gelir: ${formatCurrency(month.income)}`"
              ></div>
              <!-- Gider çubuğu -->
              <div 
                class="w-full max-w-[20px] bg-red-500 rounded-t hover:bg-red-600 transition-all cursor-help"
                :style="{ height: `${(month.expense / maxAmount) * 200}px` }"
                :title="`Gider: ${formatCurrency(month.expense)}`"
              ></div>
              <!-- Ay etiketi -->
              <span class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{{ month.month }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Son İşlemler -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Son İşlemler</h2>
          <div class="flex items-center gap-2">
            <select 
              v-model="dashboardType" 
              class="select select-sm select-bordered bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            >
              <option value="">Tümü</option>
              <option value="income">Gelir</option>
              <option value="expense">Gider</option>
              <option value="debt">Borç</option>
            </select>
          </div>
        </div>

        <div v-if="recentActivities.length > 0" class="space-y-3">
          <div 
            v-for="activity in recentActivities" 
            :key="activity.id"
            class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
          >
            <div class="flex items-center gap-3">
              <div 
                :class="{
                  'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400': activity.type === 'income',
                  'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400': activity.type === 'expense',
                  'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400': activity.type === 'debt'
                }"
                class="rounded-full p-2"
              >
                <svg v-if="activity.type === 'income'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <svg v-else-if="activity.type === 'expense'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-800 dark:text-gray-100">
                  {{ activity.type === 'debt' ? (activity.company || 'Borç') : (activity.payer || activity.description || 'İşlem') }}
                  <span v-if="activity.type === 'debt'" class="text-xs font-normal text-gray-400 ml-1">
                    ({{ activity.typeLabel }})
                  </span>
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(activity.paymentDate || activity.expenseDate || activity.dueDate || activity.date) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p 
                :class="{
                  'text-green-600 dark:text-green-400': activity.type === 'income',
                  'text-red-600 dark:text-red-400': activity.type === 'expense',
                  'text-orange-600 dark:text-orange-400': activity.type === 'debt'
                }"
                class="font-semibold"
              >
                {{ activity.type === 'income' ? '+' : '-' }}{{ formatCurrency(activity.type === 'debt' ? activity.totalAmount : activity.amount) }}
              </p>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <div class="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full p-3 w-fit mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400">Henüz işlem bulunmuyor.</p>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <router-link 
            to="/transactions" 
            class="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Tümünü Gör
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </section>

      </div> <!-- Dashboard içeriği kapanışı -->

      <!-- Manuel Borç Modalı -->
      <ManualDebtModal
        v-if="showManualDebtModal"
        :type="selectedDebtType"
        @close="showManualDebtModal = false"
        @refresh="loadDashboardData"
      />

    </div>
  </div>

  <!-- Loading durumu -->
  <div v-else-if="!authStore.isInitialized" class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400 text-lg">Yükleniyor...</p>
    </div>
  </div>

  <!-- Yetki hatası -->
  <div v-else class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-4 w-fit mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <p class="text-gray-500 dark:text-gray-400 text-lg">Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.</p>
      <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">Mevcut rol: {{ userRole || 'Tanımlanmamış' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import paymentsService from '@/services/paymentsService'
import expensesService from '@/services/expensesService'
import tenantsService from '@/services/tenantsService'
import ownerDuesService from '@/services/ownerDuesService'
import ownersService from '@/services/ownersService'
import utilityDebtsService from '@/services/utilityDebtsService'
import dashboardService from '@/services/dashboardService'
import ManualDebtModal from '../expenses/ManualDebtModal.vue'
import DebtsTable from './components/DebtsTable.vue'
import { useNotificationsStore } from '@/stores/notificationsStore'

// Reactive data
const payments = ref([])
const expenses = ref([])
const tenants = ref([])
const ownerAidats = ref([])
const ownerPayments = ref([])
const owners = ref([])
const debts = ref([])
const debtsSummary = ref([])
const dashboardType = ref('')
const dateFilter = ref('all')
const loading = ref(true)
const error = ref(null)
const showManualDebtModal = ref(false)
const selectedDebtType = ref(0) // Default Aidat

const openManualDebtModal = (type = 0) => {
    selectedDebtType.value = type
    showManualDebtModal.value = true
}

// Store
const authStore = useAuthStore()
const notificationsStore = useNotificationsStore()
const userRole = computed(() => authStore.role)

// Computed properties
const canViewDashboard = computed(() => {
  if (!authStore.isInitialized) return false
  if (!userRole.value) return false
  const role = userRole.value.toLowerCase()
  return ['admin', 'manager', 'viewer', 'tenant'].includes(role)
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('tr-TR', options)
}

const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '₺0.00'
  return Number(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

// Tarih aralığı hesaplama yardımcı fonksiyonu
const getDateRange = (filter) => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  
  switch (filter) {
    case 'this_month':
      return {
        startDate: new Date(year, month, 1).toISOString().split('T')[0],
        endDate: new Date(year, month + 1, 0).toISOString().split('T')[0]
      }
    case 'last_month':
      return {
        startDate: new Date(year, month - 1, 1).toISOString().split('T')[0],
        endDate: new Date(year, month, 0).toISOString().split('T')[0]
      }
    case 'this_year':
      return {
        startDate: new Date(year, 0, 1).toISOString().split('T')[0],
        endDate: new Date(year, 11, 31).toISOString().split('T')[0]
      }
    default:
      return { startDate: null, endDate: null }
  }
}

const totalIncome = computed(() => {
  const tenantPayments = payments.value.reduce((sum, p) => sum + Number(p.amount || 0), 0)
  return tenantPayments
})

const totalExpense = computed(() => {
  return expenses.value.reduce((sum, e) => sum + Number(e.amount || 0), 0)
})

const balance = computed(() => totalIncome.value - totalExpense.value)

const tenantPaymentsCount = computed(() => {
  return payments.value.length
})

const thisMonthTenantPayments = computed(() => {
  const today = new Date()
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0')
  
  return payments.value
    .filter(p => {
      const paymentDate = p.paymentDate || p.date
      return paymentDate && paymentDate.startsWith(currentMonth)
    })
    .reduce((sum, p) => sum + Number(p.amount || 0), 0)
})

const tenantsCount = computed(() => tenants.value.length)

const activeTenantsCount = computed(() => 
  tenants.value.filter(tenant => tenant.isActive !== false).length
)

const inactiveTenantsCount = computed(() => 
  tenants.value.filter(tenant => tenant.isActive === false).length
)

const ownersCount = computed(() => owners.value.length)

const activeOwnerDuesCount = computed(() => 
  ownerAidats.value.filter(aidat => aidat.isPaid !== true).length
)

const totalUtilityDebts = computed(() => {
  return debts.value.reduce((sum, debt) => sum + Number(debt.remainingAmount || 0), 0)
})

const utilityDebtsCount = computed(() => debts.value.length)

const overdueUtilityDebtsCount = computed(() => {
  const now = new Date()
  return debts.value.filter(debt => {
    const isOverdue = debt.dueDate && new Date(debt.dueDate) < now
    const hasUnpaidAmount = debt.status !== 'paid' && Number(debt.remainingAmount || 0) > 0
    return isOverdue && hasUnpaidAmount
  }).length
})

const totalAidatDebt = computed(() => {
  return debts.value
    .filter(d => d.type === 0 || d.type === 'Aidat')
    .reduce((sum, d) => sum + Number(d.remainingAmount || 0), 0)
})

const totalElectricityDebt = computed(() => {
  return debts.value
    .filter(d => d.type === 1 || d.type === 'Electricity')
    .reduce((sum, d) => sum + Number(d.remainingAmount || 0), 0)
})

const totalWaterDebt = computed(() => {
  return debts.value
    .filter(d => d.type === 2 || d.type === 'Water')
    .reduce((sum, d) => sum + Number(d.remainingAmount || 0), 0)
})

const monthlyAverage = computed(() => {
  const totalIncome = payments.value.reduce((sum, p) => sum + Number(p.amount || 0), 0)
  const totalExpense = expenses.value.reduce((sum, e) => sum + Number(e.amount || 0), 0)
  const totalNet = totalIncome - totalExpense
  
  // Son 6 ayın ortalaması
  const months = 6
  return totalNet / months
})

const monthlyIncomeAverage = computed(() => {
  const totalIncome = payments.value.reduce((sum, p) => sum + Number(p.amount || 0), 0)
  const months = 6
  return totalIncome / months
})

const ownerDuesIncome = computed(() => {
  return ownerAidats.value.reduce((sum, aidat) => sum + Number(aidat.amount || 0), 0)
})

const ownerDuesCount = computed(() => {
  return ownerAidats.value.length
})

const thisMonthOwnerDues = computed(() => {
  const today = new Date()
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0')
  
  return ownerAidats.value
    .filter(aidat => {
      const aidatDate = aidat.dueDate || aidat.date || aidat.createdAt
      return aidatDate && aidatDate.startsWith(currentMonth)
    })
    .reduce((sum, aidat) => sum + Number(aidat.amount || 0), 0)
})

const ownerPaymentsTotal = computed(() => {
  return ownerPayments.value.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
})

const ownerPaymentsCount = computed(() => {
  return ownerPayments.value.length
})

const thisMonthOwnerPayments = computed(() => {
  const today = new Date()
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0')
  
  return ownerPayments.value
    .filter(payment => {
      const paymentDate = payment.paymentDate || payment.date
      return paymentDate && paymentDate.startsWith(currentMonth)
    })
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
})

const overdueOwnerPayments = computed(() => {
  const now = new Date()
  return ownerAidats.value.filter(aidat => {
    const isOverdue = aidat.dueDate && new Date(aidat.dueDate) < now
    const isPaid = aidat.isPaid === true
    const hasRemainingDebt = aidat.remainingAmount && Number(aidat.remainingAmount) > 0
    const hasUnpaidAmount = !isPaid || hasRemainingDebt
    return isOverdue && hasUnpaidAmount
  })
})

const overdueOwnerPaymentsCount = computed(() => {
  return overdueOwnerPayments.value.length
})

const overdueOwnerPaymentsTotal = computed(() => {
  return overdueOwnerPayments.value.reduce((sum, aidat) => {
    const totalAmount = Number(aidat.amount || 0)
    const paidAmount = Number(aidat.paidAmount || 0)
    const remainingAmount = Number(aidat.remainingAmount || 0)
    const unpaidAmount = remainingAmount > 0 ? remainingAmount : totalAmount - paidAmount
    return sum + unpaidAmount
  }, 0)
})

const overdueItems = computed(() => {
  const now = new Date()
  
  return debts.value
    .filter(debt => {
      const isOverdue = debt.dueDate && new Date(debt.dueDate) < now
      const hasValidTenant = !!debt.tenantId
      const hasUnpaidAmount = debt.status !== 'paid' && Number(debt.remainingAmount || 0) > 0
      
      const isOwnTenant = userRole.value === 'tenant'
        ? debt.tenantId === authStore.companyId
        : true
      
      return isOverdue && hasValidTenant && isOwnTenant && hasUnpaidAmount
    })
    .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
    .map(debt => {
      const tenant = tenants.value.find(t => t.id === debt.tenantId)
      
      return {
        ...debt,
        company: debt.tenantName || tenant?.companyName || tenant?.company || debt.description || 'Bilinmiyor',
        floor: debt.unit || '-',
        amount: Number(debt.remainingAmount || 0),
        totalAmount: Number(debt.amount || 0),
        paidAmount: Number(debt.amount || 0) - Number(debt.remainingAmount || 0),
        remainingAmount: Number(debt.remainingAmount || 0),
        typeLabel:
          debt.type === 'Aidat' || debt.type === 0
            ? 'Aidat'
            : debt.type === 'Water' || debt.type === 2
            ? 'Su'
            : debt.type === 'Electricity' || debt.type === 1
            ? 'Elektrik'
            : 'Borç',
      }
    })
})

const recentActivities = computed(() => {
  const items = [
    ...payments.value.map(p => ({ 
      ...p, 
      type: 'income',
      payer: p.tenantName || p.ownerName || p.description || 'Tahsilat'
    })),
    ...expenses.value.map(e => ({ 
      ...e, 
      type: 'expense',
      payer: e.description || 'Gider'
    })),
    ...debts.value.map(d => {
      const tenant = tenants.value.find(t => t.id === d.tenantId)
      return { 
        ...d, 
        type: 'debt',
        // Debts için company bilgisi overdueItems hesaplamasında ekleniyor ama raw debt verisinde yok.
        // Burada tenant listesinden bulup ekleyelim.
        company: d.tenantName || tenant?.companyName || tenant?.company || tenant?.fullName || d.description || 'Bilinmiyor',
        typeLabel: d.type === 0 || d.type === 'Aidat' ? 'Aidat' : (d.type === 1 || d.type === 'Electricity' ? 'Elektrik' : 'Su'),
        totalAmount: Number(d.amount || 0)
      }
    })
  ]

  const filteredByTenant = userRole.value === 'tenant'
    ? items.filter(item => item.tenantId === authStore.companyId)
    : items

  let filtered = filteredByTenant
  if (dashboardType.value) {
    filtered = filtered.filter(item => item.type === dashboardType.value)
  }

  return filtered
    .filter(item => {
      const itemDate = item.paymentDate || item.expenseDate || item.dueDate || item.date || item.createdAt
      return itemDate
    })
    .sort((a, b) => {
      const dateA = a.paymentDate || a.expenseDate || a.dueDate || a.date || a.createdAt
      const dateB = b.paymentDate || b.expenseDate || b.dueDate || b.date || b.createdAt
      return new Date(dateB) - new Date(dateA)
    })
    .slice(0, 5)
})

// Aylık veri hesaplama
const monthlyData = computed(() => {
  const months = []
  const now = new Date()
  
  // Son 6 ayı hesapla
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0')
    const monthName = date.toLocaleDateString('tr-TR', { month: 'short' })
    
    const monthIncome = payments.value
      .filter(p => {
        const paymentDate = p.paymentDate || p.date
        return paymentDate && paymentDate.startsWith(monthKey)
      })
      .reduce((sum, p) => sum + Number(p.amount || 0), 0)
    
    const monthExpense = expenses.value
      .filter(e => {
        const expenseDate = e.expenseDate || e.date
        return expenseDate && expenseDate.startsWith(monthKey)
      })
      .reduce((sum, e) => sum + Number(e.amount || 0), 0)
    
    months.push({
      month: monthName,
      income: monthIncome,
      expense: monthExpense
    })
  }
  
  return months
})

const maxAmount = computed(() => {
  const allAmounts = monthlyData.value.flatMap(month => [month.income, month.expense])
  return Math.max(...allAmounts, 1) // En az 1 olsun ki sıfıra bölme hatası olmasın
})

// API'den veri yükleme fonksiyonları
const loadPayments = async () => {
  try {
    const filters = {}
    if (userRole.value === 'tenant') {
      filters.tenantId = authStore.companyId
    }
    
    // Tarih filtresi ekle
    if (dateFilter.value !== 'all') {
      const { startDate, endDate } = getDateRange(dateFilter.value)
      filters.startDate = startDate
      filters.endDate = endDate
    }
    
    // Payments için backend enum: "Rent"(0), "Dues"(1), "Utility"(2), "Other"(3)
    // Kiracı ödemeleri genellikle "Rent" tipinde olur
    const response = await paymentsService.getPayments(filters)
    payments.value = response || []
  } catch (err) {
    console.error('Ödemeler yüklenirken hata:', err)
    payments.value = []
  }
}

const loadExpenses = async () => {
  try {
    const filters = {}
    
    // Tarih filtresi ekle
    if (dateFilter.value !== 'all') {
      const { startDate, endDate } = getDateRange(dateFilter.value)
      filters.startDate = startDate
      filters.endDate = endDate
    }
    
    // Expenses için backend enum değerleri: "Electricity", "Water", "Gas", "Maintenance", "Cleaning", "Security", "Other"
    const response = await expensesService.getExpenses(filters)
    expenses.value = response || []
  } catch (err) {
    console.error('Giderler yüklenirken hata:', err)
    expenses.value = []
  }
}

const loadDebtsSummary = async () => {
  try {
    if (userRole.value !== 'tenant') {
      const summaryResult = await dashboardService.getDebtsSummary()
      debtsSummary.value = summaryResult || []
    }
  } catch (err) {
    console.error('Borç özeti yüklenirken hata:', err)
    debtsSummary.value = []
  }
}

const loadTenants = async () => {
  try {
    const response = await tenantsService.getTenants()
    tenants.value = response || []
  } catch (err) {
    console.error('Kiracılar yüklenirken hata:', err)
    tenants.value = []
  }
}

const loadOwnerDues = async () => {
  try {
    const response = await ownerDuesService.getOwnerDues()
    ownerAidats.value = response || []
  } catch (err) {
    console.error('Mal sahibi aidatları yüklenirken hata:', err)
    ownerAidats.value = []
  }
}

const loadOwners = async () => {
  try {
    const response = await ownersService.getOwners()
    owners.value = response || []
  } catch (err) {
    console.error('Mal sahipleri yüklenirken hata:', err)
    owners.value = []
  }
}

const loadOwnerPayments = async () => {
  try {
    // Mal sahibi ödemeleri için backend'de ownerId filtresi kullan
    const filters = {
      ownerId: null // Tüm ödemeleri getir, aşağıda mal sahibi olanları filtreleyeceğiz
    }
    
    // Tarih filtresi ekle
    if (dateFilter.value !== 'all') {
      const { startDate, endDate } = getDateRange(dateFilter.value)
      filters.startDate = startDate
      filters.endDate = endDate
    }
    
    const response = await paymentsService.getPayments(filters)
    
    // Backend'den gelen ownerId'li ödemeleri al
    ownerPayments.value = (response || []).filter(payment => payment.ownerId)
  } catch (err) {
    console.error('Mal sahibi ödemeleri yüklenirken hata:', err)
    ownerPayments.value = []
  }
}

const loadUtilityDebts = async () => {
  try {
    const filters = {}
    if (userRole.value === 'tenant') {
      filters.tenantId = authStore.companyId
    }
    
    // Utility debts için backend enum değerleri kontrol edilmeli
    // Muhtemelen: "Electricity", "Water", "Gas" gibi
    const response = await utilityDebtsService.getUtilityDebts(filters)
    debts.value = response || []
  } catch (err) {
    console.error('Utility borçları yüklenirken hata:', err)
    debts.value = []
  }
}

// Tüm verileri yükle
const loadDashboardData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Paralel olarak tüm verileri yükle
    await Promise.all([
      loadPayments(),
      loadExpenses(),
      loadTenants(),
      loadOwnerDues(),
      loadOwners(),
      loadOwnerPayments(),
      loadUtilityDebts(),
      loadDebtsSummary(),
      notificationsStore.refresh()
    ])
    
    console.log('Dashboard verileri başarıyla yüklendi:', {
      payments: payments.value.length,
      expenses: expenses.value.length,
      tenants: tenants.value.length,
      ownerAidats: ownerAidats.value.length,
      owners: owners.value.length,
      ownerPayments: ownerPayments.value.length,
      debts: debts.value.length,
      totalIncome: totalIncome.value,
      totalExpense: totalExpense.value,
      balance: balance.value
    })
    
    // Debug: İlk birkaç veriyi kontrol et
    if (payments.value.length > 0) {
      console.log('📊 İlk ödeme örneği:', payments.value[0])
    }
    if (expenses.value.length > 0) {
      console.log('📊 İlk gider örneği:', expenses.value[0])
    }
    if (debts.value.length > 0) {
      console.log('📊 İlk borç örneği:', debts.value[0])
    }
  } catch (err) {
    console.error('Dashboard verileri yüklenirken hata:', err)
    error.value = 'Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Auth store'un başlatılmasını bekle
  const checkAuth = () => {
    if (authStore.isInitialized) {
      loadDashboardData()
      
      // Debug için auth durumunu kontrol et
      console.log('Dashboard mounted - Auth state:', {
        isInitialized: authStore.isInitialized,
        userRole: userRole.value,
        canViewDashboard: canViewDashboard.value,
        user: authStore.user
      })
    } else {
      // Auth store henüz başlatılmamışsa 100ms sonra tekrar dene
      setTimeout(checkAuth, 100)
    }
  }
  
  checkAuth()
})
</script>
