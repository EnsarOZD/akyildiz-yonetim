<template>
  <!-- Loading -->
  <div v-if="!authStore.isInitialized" class="flex items-center justify-center min-h-screen">
    <div class="flex flex-col items-center gap-3">
      <div class="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm text-slate-500 dark:text-[#9aa0b4]">Yükleniyor...</p>
    </div>
  </div>

  <!-- Ana içerik -->
  <div v-else-if="canViewDashboard" class="p-4 sm:p-6 pb-24 md:pb-6 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-5">

      <!-- ─── Başlık ─────────────────────────────────── -->
      <PageHeader
        :title="canViewDashboard ? 'Genel Bakış' : 'Hoş Geldiniz'"
        :subtitle="canViewDashboard ? 'Finansal özet ve son aktiviteler' : 'Akyıldız Yönetim paneline hoş geldiniz'"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>
        </template>
        <template #actions>
          <div class="flex items-center gap-2">
            <select
              v-model="dateFilter"
              @change="loadDashboardData"
              class="select select-sm bg-white dark:bg-[#151a2e] border-slate-200 dark:border-white/[0.08] text-xs font-bold text-slate-600 dark:text-white rounded-lg h-9 min-h-0"
            >
              <option value="all">Tüm Zamanlar</option>
              <option value="this_month">Bu Ay</option>
              <option value="last_month">Geçen Ay</option>
              <option value="this_year">Bu Yıl</option>
              <option v-for="y in availableYears" :key="y" :value="y.toString()">{{ y }}</option>
            </select>
            <button
              @click="loadDashboardData"
              :disabled="loading"
              class="btn btn-sm bg-white dark:bg-[#151a2e] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-[#1c2238] rounded-lg h-9 px-3 gap-2 normal-case font-bold text-xs shadow-sm disabled:opacity-50"
            >
              <svg class="w-4 h-4" :class="loading ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Yenile
            </button>
          </div>
        </template>
      </PageHeader>

      <!-- ─── Loading skeleton ──────────────────────── -->
      <template v-if="loading">
        <div class="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
          <div class="app-card p-5 animate-pulse">
            <div class="grid grid-cols-3 gap-5">
              <div v-for="i in 3" :key="i" class="space-y-3">
                <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#1c2238]"></div>
                <div class="h-3 bg-slate-100 dark:bg-[#1c2238] rounded w-3/4"></div>
                <div class="h-6 bg-slate-100 dark:bg-[#1c2238] rounded w-1/2"></div>
              </div>
            </div>
          </div>
          <div class="app-card p-5 animate-pulse border-l-4 border-l-red-200 dark:border-l-red-800/40">
            <div class="space-y-3">
              <div class="h-3 bg-slate-100 dark:bg-[#1c2238] rounded w-2/5"></div>
              <div class="h-8 bg-slate-100 dark:bg-[#1c2238] rounded w-3/5"></div>
            </div>
          </div>
        </div>
      </template>

      <!-- ─── Error state ────────────────────────────── -->
      <div v-else-if="error" class="app-card p-5 border-red-200 dark:border-red-800/50 flex items-start gap-3">
        <div class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-slate-800 dark:text-[#f1f3f9]">Veri yüklenemedi</p>
          <p class="text-xs text-slate-500 dark:text-[#9aa0b4] mt-0.5">{{ error }}</p>
          <button @click="loadDashboardData" class="mt-3 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">Tekrar dene</button>
        </div>
      </div>

      <!-- ─── İçerik ─────────────────────────────────── -->
      <template v-else>

        <!-- Duyuru Banner -->
        <div v-if="notificationsStore.latestAnnouncement"
          class="app-card flex flex-col sm:flex-row items-stretch overflow-hidden border-violet-200 dark:border-violet-800/40">
          <div class="bg-violet-600 px-4 py-4 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5.882V19.24a1.76 1.76 0 0 1 -3.417 .592l-2.147-6.15M18 13a3 3 0 1 0 0-6M5.436 13.683A4.001 4.001 0 0 1 7 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 0 1 -1.564 -.317z" />
            </svg>
          </div>
          <div class="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <span class="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                Son Duyuru
              </p>
              <p class="text-sm font-semibold text-slate-800 dark:text-[#f1f3f9] line-clamp-1">{{ notificationsStore.latestAnnouncement.title }}</p>
              <p class="text-xs text-slate-500 dark:text-[#9aa0b4] line-clamp-1 mt-0.5">{{ notificationsStore.latestAnnouncement.message }}</p>
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

        <!-- ════════════════════════════════════════════
             Admin / Manager layout
             ════════════════════════════════════════════ -->
        <template v-if="userRole === 'admin' || userRole === 'manager'">

          <!-- ─── Row 1: Stats card + Overdue card ─── -->
          <section class="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">

            <!-- Combined stats: Kasa / Gelir / Gider -->
            <div class="app-card p-6">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">

                <!-- Kasa Bakiyesi -->
                <router-link to="/transactions" class="flex flex-col items-start gap-3 group">
                  <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"/></svg>
                  </div>
                  <div>
                    <p class="text-[11px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest mb-1 shadow-sm">Kasa Bakiyesi</p>
                    <p class="text-xl sm:text-[28px] font-black text-slate-800 dark:text-emerald-500 leading-tight tabular-nums tracking-tighter">{{ formatCurrency(balance) }}</p>
                  </div>
                </router-link>

                <!-- Toplam Gelir -->
                <router-link to="/payments" class="flex flex-col items-start gap-3 group border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-white/[0.05] pt-6 sm:pt-0 sm:pl-6">
                  <div class="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M2.25 18L9 11.25l4.306 4.307a1.125 1.125 0 001.591 0L21.75 9m-9 11.25h9a2.25 2.25 0 002.25-2.25V9m-2.25 11.25l-2.25-2.25"/></svg>
                  </div>
                  <div>
                    <p class="text-[11px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest mb-1 shadow-sm">Toplam Gelir</p>
                    <p class="text-xl sm:text-[28px] font-black text-brand-500 leading-tight tabular-nums tracking-tighter">{{ formatCurrency(totalIncome) }}</p>
                    <p class="text-[11px] font-bold text-slate-500 dark:text-[#9aa0b4] mt-1">+{{ formatCurrency(thisMonthTenantPayments) }} <span class="font-medium opacity-80 uppercase tracking-tighter">bu ay</span></p>
                  </div>
                </router-link>

                <!-- Toplam Gider -->
                <router-link to="/expenses" class="flex flex-col items-start gap-3 group border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-white/[0.05] pt-6 sm:pt-0 sm:pl-6">
                  <div class="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"/></svg>
                  </div>
                  <div>
                    <p class="text-[11px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest mb-1 shadow-sm">Toplam Gider</p>
                    <p class="text-xl sm:text-[28px] font-black text-red-500 leading-tight tabular-nums tracking-tighter">{{ formatCurrency(totalExpense) }}</p>
                    <p class="text-[11px] font-bold text-slate-500 dark:text-[#9aa0b4] mt-1 uppercase tracking-tighter">{{ totalExpensesCount }} kalem</p>
                  </div>
                </router-link>

              </div>
            </div>

            <!-- Overdue card -->
            <router-link to="/overdue"
              class="app-card p-6 pl-10 border-l-[6px] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              :class="overdueCount === 0 ? 'border-l-emerald-500' : 'border-l-red-500'">
              
              <div class="flex items-start justify-between mb-2">
                <div class="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                </div>
                <span class="text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                  :class="overdueCount > 0 ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white text-xs'">
                  {{ overdueCount }} Ödeme
                </span>
              </div>

              <div>
                <p class="text-xs font-black text-slate-500 dark:text-[#9aa0b4] mb-1 uppercase tracking-widest">Geciken Toplam</p>
                <p class="text-[36px] font-black text-slate-800 dark:text-red-500 tabular-nums tracking-tighter leading-none mb-2">
                  {{ formatCurrency(overdueTotalAmount) }}
                </p>
                <div v-if="overdueCount > 0 && oldestOverdueDate" class="flex items-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-[#9aa0b4]">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  En eski: <span class="font-bold text-red-500">{{ formatDate(oldestOverdueDate) }}</span>
                </div>
              </div>

              <div class="mt-4 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between group">
                <span class="text-[11px] font-bold text-red-500 tracking-wider">DETAYLARI GÖR</span>
                <svg class="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </router-link>

          </section>

          <!-- ─── Row 2: Monthly chart + Bekleyen Alacaklar ─── -->
          <section class="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">

            <!-- Aylık Gelir/Gider Grafiği -->
            <div class="app-card overflow-hidden">
              <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/[0.05]">
                <h2 class="text-[14px] font-bold text-slate-800 dark:text-white flex items-center gap-2">
                   <span class="w-1 h-3.5 bg-brand-500 rounded-full"></span>
                   Aylık Gelir / Gider
                </h2>
                <div class="flex items-center gap-4 text-[11px] font-semibold text-slate-500 dark:text-[#9aa0b4]">
                  <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span>Gelir</span>
                  <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-red-400"></span>Gider</span>
                </div>
              </div>
              <div class="p-6 overflow-x-auto">
                <div class="h-40 flex items-end gap-3 min-w-[380px]">
                  <div v-for="(month, index) in monthlyData" :key="index" class="flex-1 flex flex-col items-center gap-2">
                    <div class="w-full flex items-end justify-center gap-1" style="height: 140px">
                      <div class="w-4 rounded-t-sm bg-gradient-to-t from-emerald-500/60 to-emerald-500 hover:scale-105 transition-transform cursor-default"
                        :style="{ height: `${Math.max(4, (month.income / maxAmount) * 140)}px` }"
                        :title="`Gelir: ${formatCurrency(month.income)}`"></div>
                      <div class="w-4 rounded-t-sm bg-gradient-to-t from-red-500/60 to-red-500 hover:scale-105 transition-transform cursor-default"
                        :style="{ height: `${Math.max(4, (month.expense / maxAmount) * 140)}px` }"
                        :title="`Gider: ${formatCurrency(month.expense)}`"></div>
                    </div>
                    <span class="text-[10px] font-black text-slate-400 dark:text-[#626885] whitespace-nowrap tracking-wider">{{ month.month }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bekleyen Alacaklar -->
            <router-link to="/utilities" class="app-card p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <h4 class="text-[14px] font-bold text-slate-700 dark:text-white mb-5 flex items-center gap-2">
                  <span class="w-1 h-3.5 bg-brand-500 rounded-full"></span>
                  Bekleyen Alacaklar
                </h4>
                <div class="space-y-4">
                  <div class="flex items-center justify-between pb-3 border-b border-slate-50 dark:border-white/[0.04]">
                    <span class="flex items-center gap-2.5 text-[13px] font-medium text-slate-600 dark:text-[#9aa0b4]">
                      <span class="w-2 h-2 rounded-full bg-emerald-500"></span>Aidat
                    </span>
                    <span class="text-[14px] font-bold text-slate-800 dark:text-white tabular-nums">{{ formatCurrency(totalAidatDebt) }}</span>
                  </div>
                  <div class="flex items-center justify-between pb-3 border-b border-slate-50 dark:border-white/[0.04]">
                    <span class="flex items-center gap-2.5 text-[13px] font-medium text-slate-600 dark:text-[#9aa0b4]">
                      <span class="w-2 h-2 rounded-full bg-amber-500"></span>Elektrik
                    </span>
                    <span class="text-[14px] font-bold text-slate-800 dark:text-white tabular-nums">{{ formatCurrency(totalElectricityDebt) }}</span>
                  </div>
                  <div class="flex items-center justify-between pb-3 border-b border-slate-50 dark:border-white/[0.04]">
                    <span class="flex items-center gap-2.5 text-[13px] font-medium text-slate-600 dark:text-[#9aa0b4]">
                      <span class="w-2 h-2 rounded-full bg-brand-500"></span>Su
                    </span>
                    <span class="text-[14px] font-bold text-slate-800 dark:text-white tabular-nums">{{ formatCurrency(totalWaterDebt) }}</span>
                  </div>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t border-slate-100 dark:border-white/[0.1] flex items-center justify-between">
                <span class="text-xs font-bold text-slate-500 dark:text-[#9aa0b4] uppercase tracking-widest">Toplam</span>
                <span class="text-xl font-black text-amber-500 tabular-nums">{{ formatCurrency(totalUtilityDebts) }}</span>
              </div>
            </router-link>

          </section>

          <!-- ─── Row 3: Hızlı İşlemler ─── -->
          <section>
            <h2 class="text-[11px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-[1.5px] mb-4 px-0.5">Hızlı İşlemler</h2>
            <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-4">

              <!-- Borç Ekle -->
              <div class="dropdown dropdown-end sm:dropdown-bottom group">
                <div tabindex="0" role="button"
                  class="app-card p-5 flex flex-col items-center gap-3 cursor-pointer transition-all hover:-translate-y-1 hover:bg-slate-50 dark:hover:bg-[#151a2e]">
                  <div class="w-11 h-11 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                  </div>
                  <span class="text-xs font-bold text-slate-700 dark:text-white text-center leading-tight">Borç Ekle</span>
                </div>
                <ul tabindex="0" class="dropdown-content z-[2] menu p-2 shadow-2xl bg-white dark:bg-[#1c2238] rounded-xl w-48 mt-2 border border-slate-200 dark:border-white/[0.08] text-sm">
                  <li><a @click="openManualDebtModal(0)" class="dark:text-white hover:bg-emerald-500/10">Aidat Ekle</a></li>
                  <li><a @click="openManualDebtModal(1)" class="dark:text-white hover:bg-amber-500/10">Elektrik Ekle</a></li>
                  <li><a @click="openManualDebtModal(2)" class="dark:text-white hover:bg-brand-500/10">Su Ekle</a></li>
                </ul>
              </div>

              <!-- Tahsilat Al -->
              <router-link to="/payments" class="app-card p-5 flex flex-col items-center gap-3 group transition-all hover:-translate-y-1 hover:bg-slate-50 dark:hover:bg-[#151a2e]">
                <div class="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                </div>
                <span class="text-xs font-bold text-slate-700 dark:text-white text-center leading-tight">Tahsilat Al</span>
              </router-link>

              <!-- Gider Ekle -->
              <router-link to="/expenses" class="app-card p-5 flex flex-col items-center gap-3 group transition-all hover:-translate-y-1 hover:bg-slate-50 dark:hover:bg-[#151a2e]">
                <div class="w-11 h-11 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </div>
                <span class="text-xs font-bold text-slate-700 dark:text-white text-center leading-tight">Gider Ekle</span>
              </router-link>

              <!-- Kiracılar -->
              <router-link to="/tenants" class="app-card p-5 flex flex-col items-center gap-3 group transition-all hover:-translate-y-1 hover:bg-slate-50 dark:hover:bg-[#151a2e]">
                <div class="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                </div>
                <span class="text-xs font-bold text-slate-700 dark:text-white text-center leading-tight">Kiracılar</span>
              </router-link>

              <!-- Raporlar -->
              <router-link to="/reports" class="app-card p-5 flex flex-col items-center gap-3 group transition-all hover:-translate-y-1 hover:bg-slate-50 dark:hover:bg-[#151a2e]">
                <div class="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <span class="text-xs font-bold text-slate-700 dark:text-white text-center leading-tight">Raporlar</span>
              </router-link>

              <!-- Talepler -->
              <router-link to="/service-requests" class="app-card p-5 flex flex-col items-center gap-3 group transition-all hover:-translate-y-1 hover:bg-slate-50 dark:hover:bg-[#151a2e]">
                <div class="w-11 h-11 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 4-8-4m8 11V17"/></svg>
                </div>
                <span class="text-xs font-bold text-slate-700 dark:text-white text-center leading-tight">Talepler</span>
              </router-link>

              <!-- Duyuru Yap -->
              <button @click="showAnnouncementModal = true"
                class="app-card p-5 flex flex-col items-center gap-3 group transition-all hover:-translate-y-1 hover:bg-slate-50 dark:hover:bg-[#151a2e] w-full">
                <div class="w-11 h-11 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
                </div>
                <span class="text-xs font-bold text-slate-700 dark:text-white text-center leading-tight">Duyuru Yap</span>
              </button>

            </div>
          </section>

        </template>

        <!-- ════════════════════════════════════════════
             Observer layout
             ════════════════════════════════════════════ -->
        <section v-else-if="userRole?.toLowerCase() === 'observer'" class="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div class="app-card p-5 border-l-4 border-amber-400">
            <p class="text-xs font-semibold text-slate-500 dark:text-[#9aa0b4] uppercase tracking-wider mb-1">Bekleyen Borç</p>
            <p class="text-2xl font-bold text-slate-800 dark:text-[#f1f3f9]">{{ formatCurrency(totalUtilityDebts) }}</p>
            <div class="mt-2 space-y-1 text-xs text-slate-500 dark:text-[#9aa0b4]">
              <div class="flex justify-between"><span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Aidat</span><span>{{ formatCurrency(totalAidatDebt) }}</span></div>
              <div class="flex justify-between"><span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Elektrik</span><span>{{ formatCurrency(totalElectricityDebt) }}</span></div>
              <div class="flex justify-between"><span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-brand-500"></span>Su</span><span>{{ formatCurrency(totalWaterDebt) }}</span></div>
            </div>
          </div>
          <div class="app-card p-5" :class="overdueCount > 0 ? 'border-l-4 border-red-400' : ''">
            <p class="text-xs font-semibold uppercase tracking-wider mb-1" :class="overdueCount > 0 ? 'text-red-500' : 'text-slate-500 dark:text-[#9aa0b4]'">Geciken Borçlar</p>
            <p class="text-2xl font-bold text-slate-800 dark:text-[#f1f3f9]">{{ formatCurrency(overdueTotalAmount) }}</p>
            <p class="text-xs text-slate-500 dark:text-[#9aa0b4] mt-1">
              <span :class="overdueCount > 0 ? 'text-red-500 font-bold' : ''">{{ overdueCount }}</span> adet kalem
            </p>
          </div>
          <div class="app-card p-5 border-l-4 border-emerald-400">
            <p class="text-xs font-semibold text-slate-500 dark:text-[#9aa0b4] uppercase tracking-wider mb-1">Toplam Tahsilat</p>
            <p class="text-2xl font-bold text-slate-800 dark:text-[#f1f3f9]">{{ formatCurrency(totalIncome) }}</p>
            <p class="text-xs text-slate-500 dark:text-[#9aa0b4] mt-1">+{{ formatCurrency(thisMonthTenantPayments) }} bu ay</p>
          </div>
        </section>

        <!-- ─── Row 4: Geciken Ödemeler list ──────────── -->
        <section class="app-card !p-0 overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/[0.05]">
            <h2 class="text-[14px] font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
              Geciken Ödemeler
            </h2>
            <span class="text-[11px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-wider">{{ overdueCount }} ADET</span>
          </div>

          <div v-if="overdueItems.length > 0">
            <div v-for="item in overdueItems" :key="item.id"
              class="flex items-center gap-4 px-6 py-4 border-b border-slate-50 dark:border-white/[0.03] last:border-0 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
              <div class="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[12.5px] font-bold text-slate-800 dark:text-white truncate uppercase tracking-wide">{{ item.company || item.displayName }}</p>
                <p class="text-[11px] text-slate-500 dark:text-[#9aa0b4] mt-0.5 opacity-80">— {{ item.typeLabel }}</p>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-[14px] font-extrabold text-red-500 tabular-nums">{{ formatCurrency(item.amount) }}</p>
                <p class="text-[10px] font-bold text-slate-400 dark:text-[#626885] mt-0.5">{{ formatDate(item.dueDate) }}</p>
              </div>
            </div>
          </div>

          <div v-else class="px-5 py-12 flex flex-col items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <p class="text-[13px] font-semibold text-slate-700 dark:text-[#f1f3f9]">Geciken ödeme bulunmuyor</p>
          </div>

          <div v-if="overdueCount > 0" class="px-6 py-3 border-t border-slate-100 dark:border-white/[0.05]">
            <router-link to="/overdue"
              class="inline-flex items-center gap-1.5 text-[12px] font-bold text-brand-500 hover:opacity-80 transition-opacity">
              Tümünü gör
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </router-link>
          </div>
        </section>

        <!-- ─── Borç Özet Tablosu (Lazy Load) ──────────── -->
        <section v-if="userRole !== 'tenant'" ref="debtsTableTrigger">
          <DebtsTable :debts="debtsSummary" :loading="debtsLoading" />
        </section>

        <!-- ─── Row 5: Son İşlemler ────────────────────── -->
        <section class="app-card !p-0 overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/[0.05]">
            <h2 class="text-[14px] font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <svg class="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              Son İşlemler
            </h2>
            <select v-model="dashboardType"
              class="select select-xs bg-slate-50 dark:bg-[#151a2e] border-slate-200 dark:border-white/[0.08] text-[11px] font-bold text-slate-500 dark:text-white rounded-lg h-7 min-h-0">
              <option value="">TÜMÜ</option>
              <option value="income">GELİR</option>
              <option v-if="userRole !== 'observer'" value="expense">GİDER</option>
              <option value="debt">BORÇ</option>
            </select>
          </div>

          <div v-if="recentActivities.length > 0">
            <div v-for="activity in recentActivities" :key="activity.id"
              class="flex items-center gap-4 px-6 py-4 border-b border-slate-50 dark:border-white/[0.03] last:border-0 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                :class="{
                  'bg-emerald-500/10 text-emerald-500': activity.type === 'income',
                  'bg-red-500/10 text-red-500': activity.type === 'expense',
                  'bg-amber-500/10 text-amber-500': activity.type === 'debt'
                }">
                <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="activity.type === 'income' " stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                  <path v-else-if="activity.type === 'expense'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[13px] font-bold text-slate-800 dark:text-white truncate">
                  {{ activity.type === 'debt' ? (activity.company || activity.displayName || 'Borç') : (activity.payer || activity.description || 'İşlem') }}
                </p>
                <p class="text-[11px] text-slate-500 dark:text-[#9aa0b4] mt-0.5 opacity-80 uppercase tracking-wide">
                  {{ activity.type === 'debt' ? activity.typeLabel : formatDate(activity.paymentDate || activity.expenseDate || activity.dueDate || activity.date) }}
                </p>
              </div>
              <p class="text-[14px] font-extrabold flex-shrink-0 tabular-nums"
                :class="{
                  'text-emerald-500': activity.type === 'income',
                  'text-red-500': activity.type === 'expense',
                  'text-amber-500': activity.type === 'debt'
                }">
                {{ activity.type === 'income' ? '+' : '-' }}{{ formatCurrency(activity.type === 'debt' ? activity.totalAmount : activity.amount) }}
              </p>
            </div>
          </div>
          <div v-else class="px-5 py-12 flex flex-col items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#151a2e] text-slate-400 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <p class="text-[13px] font-semibold text-slate-500 dark:text-[#9aa0b4]">Henüz işlem bulunmuyor</p>
          </div>

          <div class="px-6 py-3 border-t border-slate-100 dark:border-white/[0.05]">
            <router-link to="/transactions"
              class="inline-flex items-center gap-1.5 text-[12px] font-bold text-brand-500 hover:opacity-80 transition-opacity">
              Tüm işlemleri gör
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </router-link>
          </div>
        </section>

      </template><!-- /v-else -->

      <!-- Modaller -->
      <ManualDebtModal v-if="showManualDebtModal" :type="selectedDebtType" @close="showManualDebtModal = false" @refresh="loadDashboardData" />
      <TargetedNotificationModal v-if="showAnnouncementModal" :show="showAnnouncementModal" @close="showAnnouncementModal = false" @success="loadDashboardData" />

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
      <p class="text-sm font-medium text-slate-700 dark:text-[#f1f3f9]">Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.</p>
      <p class="text-xs text-slate-400 mt-1">Mevcut rol: {{ userRole || 'Tanımlanmamış' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useAuthStore } from '@/application/stores/auth'
import { useDashboardStore } from '@/application/stores/dashboard'
import ManualDebtModal from '../expenses/ManualDebtModal.vue'
import OverdueWidget from './components/OverdueWidget.vue'
import { useNotificationsStore } from '@/application/stores/notificationsStore'
import TargetedNotificationModal from '../notifications/components/TargetedNotificationModal.vue'
import DebtsTable from './components/DebtsTable.vue'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import { formatCurrency } from '@/core/utils/currencyUtils'

// Reactive data
const debtsSummary = ref([])
const dashboardType = ref('')
const dateFilter = ref('all')
const loading = ref(true)
const debtsLoading = ref(false)
const error = ref(null)
const showManualDebtModal = ref(false)
const showAnnouncementModal = ref(false)
const selectedDebtType = ref(0) // Default Aidat

// Summary aggregate data from backend
const summaryData = ref(null)

// Lazy load trigger
const debtsTableTrigger = ref(null)
let observer = null

const openManualDebtModal = (type = 0) => {
    selectedDebtType.value = type
    showManualDebtModal.value = true
}

// Store
const authStore = useAuthStore()
const dashboardStore = useDashboardStore()
const notificationsStore = useNotificationsStore()
const userRole = computed(() => authStore.role)

// Computed properties
const canViewDashboard = computed(() => {
  if (!authStore.isInitialized) return false
  if (!userRole.value) return false
  const role = userRole.value.toLowerCase()
  return ['admin', 'manager', 'observer', 'dataentry'].includes(role)
})

const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = 0; i < 5; i++) {
    years.push(currentYear - i)
  }
  return years
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('tr-TR', options)
}

// Aggregate Calculations from Backend
const totalIncome = computed(() => summaryData.value?.totalIncome || 0)
const totalExpense = computed(() => summaryData.value?.totalExpense || 0)
const balance = computed(() => totalIncome.value - totalExpense.value)
const totalExpensesCount = computed(() => summaryData.value?.totalExpensesCount || 0)
const thisMonthTenantPayments = computed(() => summaryData.value?.thisMonthIncome || 0)

const totalUtilityDebts = computed(() => {
  if (!summaryData.value) return 0
  return (summaryData.value.totalUnpaidAidat || 0) + 
         (summaryData.value.totalUnpaidElectricity || 0) + 
         (summaryData.value.totalUnpaidWater || 0) +
         (summaryData.value.totalUnpaidOther || 0)
})

const totalAidatDebt = computed(() => summaryData.value?.totalUnpaidAidat || 0)
const totalElectricityDebt = computed(() => summaryData.value?.totalUnpaidElectricity || 0)
const totalWaterDebt = computed(() => summaryData.value?.totalUnpaidWater || 0)

const overdueTotalAmount = computed(() => summaryData.value?.overdueTotal || 0)
const overdueCount = computed(() => summaryData.value?.overdueCount || 0)
const oldestOverdueDate = computed(() => summaryData.value?.oldestOverdueDate)

const overdueItems = computed(() => {
  if (!summaryData.value?.recentOverdueDebts) return []
  return summaryData.value.recentOverdueDebts.map(debt => ({
      ...debt,
      company: debt.displayName || 'Bilinmiyor',
      amount: Number(debt.remainingAmount || 0),
      typeLabel: debt.type === 0 || debt.type === 'Aidat' ? 'Aidat'
               : debt.type === 1 || debt.type === 'Electricity' ? 'Elektrik'
               : 'Su',
  }))
})

const recentActivities = computed(() => {
  if (!summaryData.value) return []
  
  const isObserver = userRole.value?.toLowerCase() === 'observer'
  const payments = summaryData.value.payments || []
  const expenses = summaryData.value.expenses || []
  const debts = summaryData.value.recentDebts || []

  const items = [
    ...payments.map(p => ({
      ...p,
      type: 'income',
      payer: p.tenantName || p.ownerName || p.description || 'Tahsilat'
    })),
    ...(isObserver ? [] : expenses.map(e => ({
      ...e,
      type: 'expense',
      payer: e.description || 'Gider'
    }))),
    ...debts.map(d => ({
      ...d,
      type: 'debt',
      company: d.displayName || d.description || 'Bilinmiyor',
      typeLabel: d.type === 0 || d.type === 'Aidat' ? 'Aidat'
               : d.type === 1 || d.type === 'Electricity' ? 'Elektrik' : 'Su',
      totalAmount: Number(d.amount || 0)
    }))
  ]

  let filtered = dashboardType.value
    ? items.filter(item => item.type === dashboardType.value)
    : items

  return filtered
    .sort((a, b) => {
      const dateA = a.paymentDate || a.expenseDate || a.dueDate || a.date || a.createdAt
      const dateB = b.paymentDate || b.expenseDate || b.dueDate || b.date || b.createdAt
      return new Date(dateB) - new Date(dateA)
    })
    .slice(0, 5)
})

// Monthly chart data from backend
const monthlyData = computed(() => summaryData.value?.monthlyData || [])

const maxAmount = computed(() => {
  const allAmounts = monthlyData.value.flatMap(month => [month.income, month.expense])
  return Math.max(...allAmounts, 1)
})

// Main Dashboard Data Fetch
const loadDashboardData = async () => {
  loading.value = true
  error.value = null

  try {
    const summary = await dashboardStore.fetchSummary(dateFilter.value)
    summaryData.value = summary
    
    // Invalidate debts list to ensure lazy load triggers fresh data if filter changes
    debtsSummary.value = []
    initDebtsObserver() 
  } catch (err) {
    console.error('Dashboard verileri yüklenirken hata:', err)
    error.value = 'Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.'
  } finally {
    loading.value = false
  }
}

// Lazy Load Debts Table
const loadDebtsSummary = async () => {
  if (debtsLoading.value || debtsSummary.value.length > 0) return
  if (userRole.value === 'tenant') return

  debtsLoading.value = true
  try {
    const now = new Date()
    let year = null
    if (!isNaN(dateFilter.value)) year = parseInt(dateFilter.value)
    else if (dateFilter.value !== 'all') year = now.getFullYear()

    const result = await dashboardStore.fetchDebtsSummary(year)
    debtsSummary.value = result || []
  } catch (err) {
    console.error('Borç özeti yüklenemedi:', err)
  } finally {
    debtsLoading.value = false
  }
}

const initDebtsObserver = () => {
  if (observer) observer.disconnect()
  
  // Wait for next tick to ensure ref is bound if loading state just changed
  setTimeout(() => {
    if (!debtsTableTrigger.value) return

    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadDebtsSummary()
        observer.disconnect()
      }
    }, { rootMargin: '200px' })

    observer.observe(debtsTableTrigger.value)
  }, 100)
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

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>
