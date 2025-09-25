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
            class="btn btn-sm btn-outline btn-primary"
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

      <!-- Özet Kartları -->
      <section v-if="userRole !== 'viewer'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <router-link to="/transactions" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Kasa Bakiyesi</p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ formatCurrency(balance) }}</p>
            </div>
            <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </router-link>

        <router-link to="/payments" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Toplam Gelir</p>
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ formatCurrency(totalIncome) }}</p>
              <div class="flex items-center gap-4 mt-1">
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ tenantPaymentsCount }} kiracı ödemesi</p>
                <p class="text-xs text-blue-600 dark:text-blue-400">Bu ay: {{ formatCurrency(thisMonthTenantPayments) }}</p>
              </div>
            </div>
            <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
        </router-link>

        <router-link to="/expenses" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Toplam Gider</p>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ formatCurrency(totalExpense) }}</p>
            </div>
            <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </router-link>

        <router-link to="/tenants" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Toplam Kiracı</p>
              <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ tenantsCount }}</p>
              <div class="flex items-center gap-4 mt-1">
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ activeTenantsCount }} aktif</p>
                <p class="text-xs text-indigo-600 dark:text-indigo-400">{{ inactiveTenantsCount }} pasif</p>
              </div>
            </div>
            <div class="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </router-link>
      </section>

      <!-- Mal Sahibi Özet Kartları -->
      <section v-if="userRole !== 'viewer' && userRole !== 'tenant'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <router-link to="/owner-dues-list" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Mal Sahibi Aidat Geliri</p>
              <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ formatCurrency(ownerDuesIncome) }}</p>
              <div class="flex items-center gap-4 mt-1">
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ ownerDuesCount }} aidat kaydı</p>
                <p class="text-xs text-purple-600 dark:text-purple-400">Bu ay: {{ formatCurrency(thisMonthOwnerDues) }}</p>
              </div>
            </div>
            <div class="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </router-link>

        <router-link to="/owner-payments" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Mal Sahibi Ödemeleri</p>
              <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ formatCurrency(ownerPaymentsTotal) }}</p>
              <div class="flex items-center gap-4 mt-1">
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ ownerPaymentsCount }} ödeme</p>
                <p class="text-xs text-orange-600 dark:text-orange-400">Bu ay: {{ formatCurrency(thisMonthOwnerPayments) }}</p>
              </div>
            </div>
            <div class="bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </router-link>

        <router-link to="/overdue-owner-payments" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Geciken Mal Sahibi Ödemeleri</p>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ overdueOwnerPaymentsCount }}</p>
              <div class="flex items-center gap-4 mt-1">
                <p class="text-xs text-gray-500 dark:text-gray-400">Toplam tutar</p>
                <p class="text-xs text-red-600 dark:text-red-400">{{ formatCurrency(overdueOwnerPaymentsTotal) }}</p>
              </div>
            </div>
            <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </router-link>

        <router-link to="/owners" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Toplam Mal Sahibi</p>
              <p class="text-2xl font-bold text-teal-600 dark:text-teal-400">{{ ownersCount }}</p>
              <div class="flex items-center gap-4 mt-1">
                <p class="text-xs text-gray-500 dark:text-gray-400">Aktif aidat</p>
                <p class="text-xs text-teal-600 dark:text-teal-400">{{ activeOwnerDuesCount }} kayıt</p>
              </div>
            </div>
            <div class="bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </router-link>

        <router-link to="/utilities" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Utility Borçları</p>
              <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ formatCurrency(totalUtilityDebts) }}</p>
              <div class="flex items-center gap-4 mt-1">
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ utilityDebtsCount }} borç</p>
                <p class="text-xs text-yellow-600 dark:text-yellow-400">{{ overdueUtilityDebtsCount }} geciken</p>
              </div>
            </div>
            <div class="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </router-link>

        <router-link to="/utilities" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Aylık Ortalama</p>
              <p class="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{{ formatCurrency(monthlyAverage) }}</p>
              <div class="flex items-center gap-4 mt-1">
                <p class="text-xs text-gray-500 dark:text-gray-400">Gelir ort.</p>
                <p class="text-xs text-cyan-600 dark:text-cyan-400">{{ formatCurrency(monthlyIncomeAverage) }}</p>
              </div>
            </div>
            <div class="bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </router-link>
      </section>

      <!-- Hızlı İşlemler -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Hızlı İşlemler</h2>
        
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <router-link to="/payments" class="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200">
            <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full p-3 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Yeni Ödeme</span>
          </router-link>
          
          <router-link to="/expenses" class="flex flex-col items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200">
            <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-3 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Yeni Gider</span>
          </router-link>
          
          <router-link to="/tenants" class="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200">
            <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full p-3 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Yeni Kiracı</span>
          </router-link>
          
          <router-link to="/owner-dues-list" class="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200">
            <div class="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full p-3 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Yeni Aidat</span>
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
            class="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
          >
            <div class="flex items-center gap-3">
              <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-800 dark:text-gray-100">{{ item.company }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.floor }} - {{ item.typeLabel }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-red-600 dark:text-red-400">{{ formatCurrency(item.amount) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(item.dueDate) }}</p>
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
        
        <div class="h-64 flex items-end justify-between gap-2">
          <div 
            v-for="(month, index) in monthlyData" 
            :key="index"
            class="flex-1 flex flex-col items-center gap-2"
          >
            <!-- Gelir çubuğu -->
            <div 
              class="w-full bg-green-500 rounded-t"
              :style="{ height: `${(month.income / maxAmount) * 200}px` }"
            ></div>
            <!-- Gider çubuğu -->
            <div 
              class="w-full bg-red-500 rounded-t"
              :style="{ height: `${(month.expense / maxAmount) * 200}px` }"
            ></div>
            <!-- Ay etiketi -->
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ month.month }}</span>
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
                  'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400': activity.type === 'expense'
                }"
                class="rounded-full p-2"
              >
                <svg v-if="activity.type === 'income'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-800 dark:text-gray-100">
                  {{ activity.payer || activity.description || 'İşlem' }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(activity.paymentDate || activity.expenseDate || activity.date) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p 
                :class="{
                  'text-green-600 dark:text-green-400': activity.type === 'income',
                  'text-red-600 dark:text-red-400': activity.type === 'expense'
                }"
                class="font-semibold"
              >
                {{ activity.type === 'income' ? '+' : '-' }}{{ formatCurrency(activity.amount) }}
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

// Reactive data
const payments = ref([])
const expenses = ref([])
const tenants = ref([])
const ownerAidats = ref([])
const ownerPayments = ref([])
const owners = ref([])
const debts = ref([])
const dashboardType = ref('')
const dateFilter = ref('all')
const loading = ref(true)
const error = ref(null)

// Store
const authStore = useAuthStore()
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
        company: tenant?.companyName || tenant?.company || 'Bilinmiyor',
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
    ...payments.value.map(p => ({ ...p, type: 'income' })),
    ...expenses.value.map(e => ({ ...e, type: 'expense' }))
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
      const itemDate = item.paymentDate || item.expenseDate || item.date
      return itemDate
    })
    .sort((a, b) => {
      const dateA = a.paymentDate || a.expenseDate || a.date
      const dateB = b.paymentDate || b.expenseDate || b.date
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
      ownerId: 'any' // Tüm mal sahibi ödemelerini getir
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
      loadUtilityDebts()
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
