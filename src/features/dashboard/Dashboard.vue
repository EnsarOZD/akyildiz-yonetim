<template>
  <!-- Loading -->
  <div v-if="!authStore.isInitialized" class="flex items-center justify-center min-h-screen">
    <div class="flex flex-col items-center gap-3">
      <div class="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm text-slate-500 dark:text-slate-400">Yükleniyor...</p>
    </div>
  </div>

  <!-- Ana içerik -->
  <div v-else-if="canViewDashboard" class="p-4 sm:p-6 pb-24 md:pb-6 min-h-screen">
    <div class="max-w-7xl mx-auto">

      <!-- ─── Başlık ─────────────────────────────────── -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 class="page-title">Genel Bakış</h1>
          <p class="page-subtitle">Finansal özet ve son aktiviteler</p>
        </div>
        <div class="flex items-center gap-2">
          <select
            v-model="dateFilter"
            @change="loadDashboardData"
            class="select select-sm select-bordered bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg"
          >
            <option value="all">Tüm Zamanlar</option>
            <option value="this_month">Bu Ay</option>
            <option value="last_month">Geçen Ay</option>
            <option value="this_year">Bu Yıl</option>
          </select>
          <button
            @click="loadDashboardData"
            :disabled="loading"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
              bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
              text-slate-600 dark:text-slate-300
              hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <svg class="w-4 h-4" :class="loading ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Yenile
          </button>
        </div>
      </div>

      <!-- ─── Loading state ─────────────────────────── -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div v-for="i in 3" :key="i" class="app-card p-5 animate-pulse">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3 bg-slate-100 dark:bg-slate-700 rounded w-2/3"></div>
              <div class="h-6 bg-slate-100 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── Error state ────────────────────────────── -->
      <div v-else-if="error" class="app-card p-5 mb-6 border-red-200 dark:border-red-800/50 flex items-start gap-3">
        <div class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Veri yüklenemedi</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ error }}</p>
          <button @click="loadDashboardData" class="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">Tekrar dene</button>
        </div>
      </div>

      <!-- ─── İçerik ─────────────────────────────────── -->
      <div v-else class="animate-fade-in">

        <!-- Duyuru Banner -->
        <div v-if="notificationsStore.latestAnnouncement"
          class="app-card mb-6 flex flex-col sm:flex-row items-stretch overflow-hidden border-violet-200 dark:border-violet-800/40">
          <div class="bg-violet-600 px-4 py-4 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div class="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <span class="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                Son Duyuru
              </p>
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">{{ notificationsStore.latestAnnouncement.title }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{{ notificationsStore.latestAnnouncement.message }}</p>
            </div>
            <router-link to="/notifications"
              class="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline">
              Görüntüle
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
        </div>

        <!-- ─── Admin/Manager: Finansal Kartlar ──────── -->
        <section v-if="userRole === 'admin' || userRole === 'manager'" class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">

          <!-- Sol: 3 ana kart -->
          <div class="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- Kasa Bakiyesi -->
            <router-link to="/transactions" class="app-card p-5 flex flex-col justify-between hover:shadow-card-md transition-shadow group">
              <div class="flex items-start justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span class="badge-active text-[10px] font-bold px-2 py-0.5 rounded-full">Güncel</span>
              </div>
              <div>
                <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kasa Bakiyesi</p>
                <p class="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">{{ formatCurrency(balance) }}</p>
              </div>
            </router-link>

            <!-- Toplam Gelir -->
            <router-link to="/payments" class="app-card p-5 flex flex-col justify-between hover:shadow-card-md transition-shadow group">
              <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Toplam Gelir</p>
                <p class="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">{{ formatCurrency(totalIncome) }}</p>
                <p class="text-xs text-slate-400 mt-0.5">+{{ formatCurrency(thisMonthTenantPayments) }} bu ay</p>
              </div>
            </router-link>

            <!-- Toplam Gider -->
            <router-link to="/expenses" class="app-card p-5 flex flex-col justify-between hover:shadow-card-md transition-shadow group">
              <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Toplam Gider</p>
                <p class="text-xl font-bold text-red-600 dark:text-red-400 mt-0.5">{{ formatCurrency(totalExpense) }}</p>
                <p class="text-xs text-slate-400 mt-0.5">{{ expenses.length }} kalem</p>
              </div>
            </router-link>
          </div>

          <!-- Sağ: Geciken + Bekleyen alacaklar -->
          <div class="md:col-span-4 flex flex-col gap-4">
            <OverdueWidget
              v-if="overdueItems.length > 0"
              :count="overdueItems.length"
              :total-amount="overdueTotalAmount"
              :oldest-date="oldestOverdueDate"
            />

            <!-- Bekleyen Alacaklar -->
            <router-link to="/utilities" class="app-card p-5 hover:shadow-card-md transition-shadow flex-1">
              <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                <span class="w-1 h-5 bg-amber-500 rounded-full"></span>
                Bekleyen Alacaklar
              </h4>
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>Aidat
                  </span>
                  <span class="font-semibold text-slate-800 dark:text-slate-100">{{ formatCurrency(totalAidatDebt) }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span class="w-2 h-2 rounded-full bg-amber-500"></span>Elektrik
                  </span>
                  <span class="font-semibold text-slate-800 dark:text-slate-100">{{ formatCurrency(totalElectricityDebt) }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span class="w-2 h-2 rounded-full bg-blue-500"></span>Su
                  </span>
                  <span class="font-semibold text-slate-800 dark:text-slate-100">{{ formatCurrency(totalWaterDebt) }}</span>
                </div>
                <div class="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                <div class="flex items-center justify-between text-sm font-semibold">
                  <span class="text-slate-500 dark:text-slate-400">Toplam</span>
                  <span class="text-amber-600 dark:text-amber-400">{{ formatCurrency(totalUtilityDebts) }}</span>
                </div>
              </div>
            </router-link>
          </div>
        </section>

        <!-- ─── Observer: Özet Kartları ───────────────── -->
        <section v-else-if="userRole?.toLowerCase() === 'observer'" class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="app-card p-5 border-l-4 border-amber-400">
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Bekleyen Borç</p>
            <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ formatCurrency(totalUtilityDebts) }}</p>
            <div class="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
              <div class="flex justify-between"><span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Aidat</span><span>{{ formatCurrency(totalAidatDebt) }}</span></div>
              <div class="flex justify-between"><span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Elektrik</span><span>{{ formatCurrency(totalElectricityDebt) }}</span></div>
              <div class="flex justify-between"><span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Su</span><span>{{ formatCurrency(totalWaterDebt) }}</span></div>
            </div>
          </div>
          <div class="app-card p-5" :class="overdueItems.length > 0 ? 'border-l-4 border-red-400' : ''">
            <p class="text-xs font-semibold uppercase tracking-wider mb-1" :class="overdueItems.length > 0 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'">Geciken Borçlar</p>
            <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ formatCurrency(overdueTotalAmount) }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span :class="overdueItems.length > 0 ? 'text-red-500 font-bold' : ''">{{ overdueItems.length }}</span> adet kalem
            </p>
          </div>
          <div class="app-card p-5 border-l-4 border-emerald-400">
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Toplam Tahsilat</p>
            <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ formatCurrency(totalIncome) }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">+{{ formatCurrency(thisMonthTenantPayments) }} bu ay</p>
          </div>
        </section>

        <!-- ─── Hızlı İşlemler ─────────────────────── -->
        <section v-if="userRole === 'admin' || userRole === 'manager'" class="mb-6">
          <h2 class="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-0.5">Hızlı İşlemler</h2>
          <div class="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3">

            <!-- Borç Ekle -->
            <div class="dropdown dropdown-end sm:dropdown-bottom">
              <div tabindex="0" role="button"
                class="app-card p-4 flex flex-col items-center gap-2 hover:shadow-card-md cursor-pointer group transition-shadow h-full w-full">
                <div class="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 text-center">Borç Ekle</span>
              </div>
              <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-card-lg bg-white dark:bg-slate-800 rounded-xl w-48 mt-1 border border-slate-200 dark:border-slate-700 text-sm">
                <li><a @click="openManualDebtModal(0)" class="text-slate-700 dark:text-slate-200 rounded-lg flex items-center gap-2">
                  <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  Aidat Ekle
                </a></li>
                <li><a @click="openManualDebtModal(1)" class="text-slate-700 dark:text-slate-200 rounded-lg flex items-center gap-2">
                  <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Elektrik Ekle
                </a></li>
                <li><a @click="openManualDebtModal(2)" class="text-slate-700 dark:text-slate-200 rounded-lg flex items-center gap-2">
                  <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c-4.418 4.863-5 8-5 10a5 5 0 0010 0c0-2-0.582-5.137-5-10z"/></svg>
                  Su Ekle
                </a></li>
              </ul>
            </div>

            <!-- Tahsilat Al -->
            <router-link to="/payments" class="app-card p-4 flex flex-col items-center gap-2 hover:shadow-card-md group transition-shadow">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 text-center">Tahsilat Al</span>
            </router-link>

            <!-- Gider Ekle -->
            <router-link to="/expenses" class="app-card p-4 flex flex-col items-center gap-2 hover:shadow-card-md group transition-shadow">
              <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 text-center">Gider Ekle</span>
            </router-link>

            <!-- Kiracılar -->
            <router-link to="/tenants" class="app-card p-4 flex flex-col items-center gap-2 hover:shadow-card-md group transition-shadow">
              <div class="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 text-center">Kiracılar</span>
            </router-link>

            <!-- Raporlar -->
            <router-link to="/reports" class="app-card p-4 flex flex-col items-center gap-2 hover:shadow-card-md group transition-shadow">
              <div class="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 text-center">Raporlar</span>
            </router-link>

            <!-- Duyuru Yap -->
            <button @click="showAnnouncementModal = true"
              class="app-card p-4 flex flex-col items-center gap-2 hover:shadow-card-md group transition-shadow border-violet-200 dark:border-violet-800/40 cursor-pointer w-full">
              <div class="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <span class="text-xs font-semibold text-violet-700 dark:text-violet-300 text-center">Duyuru Yap</span>
            </button>

          </div>
        </section>

        <!-- ─── Geciken Ödemeler ───────────────────── -->
        <section class="app-card overflow-hidden mb-5">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 class="text-sm font-semibold text-slate-800 dark:text-slate-100">Geciken Ödemeler</h2>
            <span class="badge-overdue text-xs font-bold px-2.5 py-1 rounded-full">{{ overdueItems.length }} adet</span>
          </div>

          <div v-if="overdueItems.length > 0">
            <div v-for="item in overdueItems.slice(0, 5)" :key="item.id"
              class="flex items-center gap-3 px-5 py-3.5 border-b border-slate-50 dark:border-slate-800/50 last:border-0 table-row-hover">
              <div class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{{ item.company }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ item.floor }} · {{ item.typeLabel }}</p>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-sm font-semibold text-red-600 dark:text-red-400">{{ formatCurrency(item.amount) }}</p>
                <p class="text-[10px] text-slate-400">{{ formatDate(item.dueDate) }}</p>
              </div>
            </div>
          </div>

          <div v-else class="px-5 py-10 flex flex-col items-center gap-2">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-sm font-medium text-slate-700 dark:text-slate-200">Geciken ödeme yok</p>
          </div>

          <div v-if="overdueItems.length > 0"
            class="px-5 py-3 border-t border-slate-100 dark:border-slate-800">
            <router-link to="/overdue"
              class="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline">
              Tümünü gör
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
        </section>

        <!-- ─── Borç Özet Tablosu ──────────────────── -->
        <section v-if="userRole !== 'tenant'" class="mb-5">
          <DebtsTable :debts="debtsSummary" :loading="loading" />
        </section>

        <!-- ─── Aylık Gelir/Gider Grafiği ─────────── -->
        <section v-if="userRole === 'admin' || userRole === 'manager'" class="app-card overflow-hidden mb-5">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 class="text-sm font-semibold text-slate-800 dark:text-slate-100">Aylık Gelir / Gider</h2>
            <div class="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span>Gelir</span>
              <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-red-400"></span>Gider</span>
            </div>
          </div>
          <div class="p-5 overflow-x-auto">
            <div class="h-48 flex items-end gap-3 min-w-[420px]">
              <div v-for="(month, index) in monthlyData" :key="index" class="flex-1 flex flex-col items-center gap-1.5">
                <div class="w-full flex items-end justify-center gap-1" style="height: 160px">
                  <div class="w-4 rounded-t bg-emerald-400 hover:bg-emerald-500 transition-colors cursor-default"
                    :style="{ height: `${Math.max(4, (month.income / maxAmount) * 160)}px` }"
                    :title="`Gelir: ${formatCurrency(month.income)}`"></div>
                  <div class="w-4 rounded-t bg-red-400 hover:bg-red-500 transition-colors cursor-default"
                    :style="{ height: `${Math.max(4, (month.expense / maxAmount) * 160)}px` }"
                    :title="`Gider: ${formatCurrency(month.expense)}`"></div>
                </div>
                <span class="text-[10px] font-medium text-slate-400 whitespace-nowrap">{{ month.month }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- ─── Son İşlemler ──────────────────────── -->
        <section class="app-card overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 class="text-sm font-semibold text-slate-800 dark:text-slate-100">Son İşlemler</h2>
            <select v-model="dashboardType"
              class="select select-xs select-bordered bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs">
              <option value="">Tümü</option>
              <option value="income">Gelir</option>
              <option v-if="userRole !== 'observer'" value="expense">Gider</option>
              <option value="debt">Borç</option>
            </select>
          </div>

          <div v-if="recentActivities.length > 0">
            <div v-for="activity in recentActivities" :key="activity.id"
              class="flex items-center gap-3 px-5 py-3.5 border-b border-slate-50 dark:border-slate-800/50 last:border-0 table-row-hover">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                :class="{
                  'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400': activity.type === 'income',
                  'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400': activity.type === 'expense',
                  'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400': activity.type === 'debt'
                }">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    :d="activity.type === 'income'
                      ? 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z'
                      : activity.type === 'expense'
                      ? 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
                      : 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'"
                  />
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                  {{ activity.type === 'debt' ? (activity.company || 'Borç') : (activity.payer || activity.description || 'İşlem') }}
                  <span v-if="activity.type === 'debt'" class="text-xs font-normal text-slate-400 ml-1">({{ activity.typeLabel }})</span>
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ formatDate(activity.paymentDate || activity.expenseDate || activity.dueDate || activity.date) }}</p>
              </div>
              <p class="text-sm font-semibold flex-shrink-0"
                :class="{
                  'text-emerald-600 dark:text-emerald-400': activity.type === 'income',
                  'text-red-600 dark:text-red-400': activity.type === 'expense',
                  'text-amber-600 dark:text-amber-400': activity.type === 'debt'
                }">
                {{ activity.type === 'income' ? '+' : '-' }}{{ formatCurrency(activity.type === 'debt' ? activity.totalAmount : activity.amount) }}
              </p>
            </div>
          </div>
          <div v-else class="px-5 py-10 flex flex-col items-center gap-2">
            <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-300">Henüz işlem bulunmuyor</p>
          </div>

          <div class="px-5 py-3 border-t border-slate-100 dark:border-slate-800">
            <router-link to="/transactions"
              class="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Tüm işlemleri gör
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
        </section>

      </div><!-- /v-else -->

      <!-- Modaller -->
      <ManualDebtModal v-if="showManualDebtModal" :type="selectedDebtType" @close="showManualDebtModal = false" @refresh="loadDashboardData" />
      <TargetedNotificationModal :show="showAnnouncementModal" @close="showAnnouncementModal = false" @success="loadDashboardData" />

    </div>
  </div>

  <!-- Yetki hatası -->
  <div v-else class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <p class="text-sm font-medium text-slate-700 dark:text-slate-200">Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.</p>
      <p class="text-xs text-slate-400 mt-1">Mevcut rol: {{ userRole || 'Tanımlanmamış' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import paymentsService from '@/services/paymentsService'
import expensesService from '@/services/expensesService'
import tenantsService from '@/services/tenantsService'
import ownerDuesService from '@/services/ownerDuesService'
import ownersService from '@/services/ownersService'
import utilityDebtsService from '@/services/utilityDebtsService'
import dashboardService from '@/services/dashboardService'
import ManualDebtModal from '../expenses/ManualDebtModal.vue'
import OverdueWidget from './components/OverdueWidget.vue'
import { useNotificationsStore } from '@/stores/notificationsStore'
import TargetedNotificationModal from '../notifications/components/TargetedNotificationModal.vue'
import DebtsTable from './components/DebtsTable.vue'
import { formatCurrency } from '@/utils/currencyUtils'

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
const showAnnouncementModal = ref(false)
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
  return ['admin', 'manager', 'observer', 'dataentry'].includes(role)
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('tr-TR', options)
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
  if (!Array.isArray(payments.value)) return 0
  const tenantPayments = payments.value.reduce((sum, p) => sum + Number(p.amount || 0), 0)
  return tenantPayments
})

const totalExpense = computed(() => {
  if (!Array.isArray(expenses.value)) return 0
  return expenses.value.reduce((sum, e) => sum + Number(e.amount || 0), 0)
})

const balance = computed(() => totalIncome.value - totalExpense.value)

const tenantPaymentsCount = computed(() => {
  return Array.isArray(payments.value) ? payments.value.length : 0
})

const thisMonthTenantPayments = computed(() => {
  if (!Array.isArray(payments.value)) return 0
  const today = new Date()
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0')
  
  return payments.value
    .filter(p => {
      const paymentDate = p.paymentDate || p.date
      return paymentDate && paymentDate.startsWith(currentMonth)
    })
    .reduce((sum, p) => sum + Number(p.amount || 0), 0)
})

const tenantsCount = computed(() => Array.isArray(tenants.value) ? tenants.value.length : 0)

const activeTenantsCount = computed(() => 
  Array.isArray(tenants.value) ? tenants.value.filter(tenant => tenant.isActive !== false).length : 0
)

const inactiveTenantsCount = computed(() => 
  Array.isArray(tenants.value) ? tenants.value.filter(tenant => tenant.isActive === false).length : 0
)

const ownersCount = computed(() => Array.isArray(owners.value) ? owners.value.length : 0)

const activeOwnerDuesCount = computed(() => 
  Array.isArray(ownerAidats.value) ? ownerAidats.value.filter(aidat => aidat.isPaid !== true).length : 0
)

const totalUtilityDebts = computed(() => {
  if (!Array.isArray(debts.value)) return 0
  return debts.value.reduce((sum, debt) => sum + Number(debt.remainingAmount || 0), 0)
})

const utilityDebtsCount = computed(() => Array.isArray(debts.value) ? debts.value.length : 0)

const overdueUtilityDebtsCount = computed(() => {
  if (!Array.isArray(debts.value)) return 0
  const now = new Date()
  return debts.value.filter(debt => {
    const isOverdue = !debt.dueDate || new Date(debt.dueDate) < now
    const hasUnpaidAmount = debt.status !== 'Paid' && Number(debt.remainingAmount || 0) > 0
    return isOverdue && hasUnpaidAmount
  }).length
})

const totalAidatDebt = computed(() => {
  if (!Array.isArray(debts.value)) return 0
  return debts.value
    .filter(d => d.type === 0 || d.type === 'Aidat')
    .reduce((sum, d) => sum + Number(d.remainingAmount || 0), 0)
})

const totalElectricityDebt = computed(() => {
  if (!Array.isArray(debts.value)) return 0
  return debts.value
    .filter(d => d.type === 1 || d.type === 'Electricity')
    .reduce((sum, d) => sum + Number(d.remainingAmount || 0), 0)
})

const totalWaterDebt = computed(() => {
  if (!Array.isArray(debts.value)) return 0
  return debts.value
    .filter(d => d.type === 2 || d.type === 'Water')
    .reduce((sum, d) => sum + Number(d.remainingAmount || 0), 0)
})

const monthlyAverage = computed(() => {
  if (!Array.isArray(payments.value) || !Array.isArray(expenses.value)) return 0
  const totalIncome = payments.value.reduce((sum, p) => sum + Number(p.amount || 0), 0)
  const totalExpense = expenses.value.reduce((sum, e) => sum + Number(e.amount || 0), 0)
  const totalNet = totalIncome - totalExpense
  
  // Son 6 ayın ortalaması
  const months = 6
  return totalNet / months
})

const monthlyIncomeAverage = computed(() => {
  if (!Array.isArray(payments.value)) return 0
  const totalIncome = payments.value.reduce((sum, p) => sum + Number(p.amount || 0), 0)
  const months = 6
  return totalIncome / months
})

const ownerDuesIncome = computed(() => {
  if (!Array.isArray(ownerAidats.value)) return 0
  return ownerAidats.value.reduce((sum, aidat) => sum + Number(aidat.amount || 0), 0)
})

const ownerDuesCount = computed(() => Array.isArray(ownerAidats.value) ? ownerAidats.value.length : 0)

const thisMonthOwnerDues = computed(() => {
  if (!Array.isArray(ownerAidats.value)) return 0
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
  if (!Array.isArray(ownerPayments.value)) return 0
  return ownerPayments.value.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
})

const ownerPaymentsCount = computed(() => Array.isArray(ownerPayments.value) ? ownerPayments.value.length : 0)

const thisMonthOwnerPayments = computed(() => {
  if (!Array.isArray(ownerPayments.value)) return 0
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
  if (!Array.isArray(ownerAidats.value)) return []
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

const overdueTotalAmount = computed(() => {
  if (!Array.isArray(overdueItems.value)) return 0
  return overdueItems.value.reduce((sum, item) => sum + Number(item.amount || 0), 0)
})

const oldestOverdueDate = computed(() => {
  if (!Array.isArray(overdueItems.value) || overdueItems.value.length === 0) return null
  // En eski tarihi bul
  return Array.from(overdueItems.value).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0].dueDate
})

const overdueOwnerPaymentsTotal = computed(() => {
  if (!Array.isArray(overdueOwnerPayments.value)) return 0
  return overdueOwnerPayments.value.reduce((sum, aidat) => {
    const totalAmount = Number(aidat.amount || 0)
    const paidAmount = Number(aidat.paidAmount || 0)
    const remainingAmount = Number(aidat.remainingAmount || 0)
    const unpaidAmount = remainingAmount > 0 ? remainingAmount : totalAmount - paidAmount
    return sum + unpaidAmount
  }, 0)
})

const overdueItems = computed(() => {
  if (!Array.isArray(debts.value)) return []
  const now = new Date()
  
  return debts.value
    .filter(debt => {
      // dueDate yoksa (null/undefined) gecikmiş sayıyoruz — tarihi girilmemiş eski borçlar
      const isOverdue = !debt.dueDate || new Date(debt.dueDate) < now
      const hasValidEntity = !!debt.tenantId || !!debt.ownerId
      const hasUnpaidAmount = debt.status !== 'Paid' && Number(debt.remainingAmount || 0) > 0

      const isOwnTenant = userRole.value === 'tenant'
        ? debt.tenantId === authStore.companyId
        : true

      return isOverdue && hasValidEntity && isOwnTenant && hasUnpaidAmount
    })
    .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
    .map(debt => {
      const tenant = Array.isArray(tenants.value) ? tenants.value.find(t => t.id === debt.tenantId) : null
      const owner = debt.ownerId && Array.isArray(owners.value) ? owners.value.find(o => o.id === debt.ownerId) : null
      
      return {
        ...debt,
        company: debt.tenantName || tenant?.companyName || tenant?.company || (owner ? `${owner.firstName} ${owner.lastName} (M)` : null) || debt.description || 'Bilinmiyor',
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
  const isObserver = userRole.value?.toLowerCase() === 'observer'
  const items = [
    ...payments.value.map(p => ({
      ...p,
      type: 'income',
      payer: p.tenantName || p.ownerName || p.description || 'Tahsilat'
    })),
    // Observer gider görmez
    ...(isObserver ? [] : expenses.value.map(e => ({
      ...e,
      type: 'expense',
      payer: e.description || 'Gider'
    }))),
    ...debts.value.map(d => {
      const tenant = tenants.value.find(t => t.id === d.tenantId)
      const owner = d.ownerId ? owners.value.find(o => o.id === d.ownerId) : null
      return { 
        ...d, 
        type: 'debt',
        company: d.tenantName || tenant?.companyName || tenant?.company || tenant?.fullName || (owner ? `${owner.firstName} ${owner.lastName} (M)` : null) || d.description || 'Bilinmiyor',
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
      const now = new Date()
      const year = dateFilter.value === 'all' 
        ? null 
        : (dateFilter.value === 'last_month' && now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear())
      const summaryResult = await dashboardService.getDebtsSummary(year)
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
    const filters = { excludePaid: true }
    if (userRole.value === 'tenant') {
      filters.tenantId = authStore.companyId
    }

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
    
  } catch (err) {
    console.error('Dashboard verileri yüklenirken hata:', err)
    error.value = 'Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (authStore.isInitialized) {
    loadDashboardData()
  } else {
    const stop = watch(() => authStore.isInitialized, (val) => {
      if (val) {
        stop()
        loadDashboardData()
      }
    })
  }
})
</script>
