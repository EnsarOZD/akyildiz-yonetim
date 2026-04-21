<template>
  <div class="p-4 sm:p-6 min-h-screen pb-24 md:pb-6">

    <!-- Sayfa Başlığı -->
    <PageHeader title="Ödemeler" :subtitle="`${paymentsCount} ödeme kaydı`">
      <template #icon>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </template>
      <template #actions>
        <div v-if="authStore.role === ROLES.ADMIN || authStore.role === ROLES.MANAGER" class="flex flex-wrap gap-2 shrink-0">
          <button @click="showAdvanceManager = true" class="btn btn-sm btn-ghost">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Avans
          </button>
          <button @click="showFinancialReports = true" class="btn btn-sm btn-ghost">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            Raporlar
          </button>
          <button v-if="authStore.role === ROLES.ADMIN" @click="showAuditLogs = true" class="btn btn-sm btn-ghost">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Loglar
          </button>
          <button @click="showModal = true" class="btn btn-sm btn-primary">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Yeni Ödeme
          </button>
        </div>
      </template>
    </PageHeader>

    <!-- İstatistik Kartları -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="app-card group hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#626885]">Bu Ay</p>
            <p class="text-xl font-black text-slate-800 dark:text-white tabular-nums tracking-tight mt-0.5">{{ formatCurrency(thisMonthIncome) }}</p>
          </div>
        </div>
      </div>
      <div class="app-card group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#626885]">Toplam</p>
            <p class="text-xl font-black text-slate-800 dark:text-white tabular-nums tracking-tight mt-0.5">{{ formatCurrency(totalIncome) }}</p>
          </div>
        </div>
      </div>
      <div class="app-card group hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#626885]">Bu Ay İşlem</p>
            <p class="text-2xl font-black text-slate-800 dark:text-white tabular-nums tracking-tight mt-0.5">{{ thisMonthCount }}</p>
          </div>
        </div>
      </div>
      <div class="app-card group hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#626885]">Avans</p>
            <p class="text-xl font-black text-slate-800 dark:text-white tabular-nums tracking-tight mt-0.5">{{ formatCurrency(totalAdvance) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Aylık Grafik + Tip Dağılımı yan yana -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">

      <!-- Aylık Ödeme Grafiği -->
      <div class="app-card">
        <h2 class="text-xs font-bold text-slate-400 dark:text-[#626885] uppercase tracking-widest mb-6 px-1">Aylık Ödeme Girişi</h2>
        <div class="h-40 flex items-end gap-3 px-2">
          <div v-for="(month, index) in monthlyPaymentData" :key="index" class="flex-1 group/bar relative flex flex-col items-center gap-3">
            <div
              class="w-full bg-gradient-to-t from-brand-500/80 to-brand-500 rounded-t-lg transition-all duration-500 group-hover/bar:from-brand-600 group-hover/bar:to-brand-400"
              :style="{ height: `${Math.max((month.total / maxMonthlyPayment) * 130, month.total > 0 ? 4 : 2)}px` }"
            >
              <div class="opacity-0 group-hover/bar:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap transition-opacity pointer-events-none font-bold">
                {{ formatCurrency(month.total) }}
              </div>
            </div>
            <span class="text-[10px] text-slate-400 dark:text-[#626885] font-bold uppercase tracking-tighter">{{ month.month }}</span>
          </div>
        </div>
      </div>

      <!-- Ödeme Tipi Dağılımı -->
      <div class="app-card">
        <h2 class="text-xs font-bold text-slate-400 dark:text-[#626885] uppercase tracking-widest mb-6 px-1">Tip Dağılımı</h2>
        <div class="space-y-1">
          <div v-for="type in paymentTypeStats" :key="type.name" class="flex items-center justify-between p-2 rounded-xl transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04]">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p class="text-[13px] font-bold text-slate-700 dark:text-[#f1f3f9]">{{ type.label }}</p>
                <p class="text-[10px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-tighter">{{ type.count }} ödeme</p>
              </div>
            </div>
            <p class="text-[13px] font-black text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">{{ formatCurrency(type.total) }}</p>
          </div>
          <div v-if="paymentTypeStats.length === 0" class="text-xs text-slate-400 dark:text-[#626885] text-center py-4">Veri yok</div>
        </div>
      </div>
    </div>

    <!-- Avans Hesapları -->
    <div v-if="advanceAccounts.length > 0" class="app-card mb-5">
      <h3 class="text-sm font-semibold text-slate-700 dark:text-[#f1f3f9] mb-3 flex items-center gap-2">
        <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        Avans Hesapları
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="advance in advanceAccounts"
          :key="advance.id"
          class="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30"
        >
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-semibold text-slate-700 dark:text-[#f1f3f9] truncate">{{ getTenantCompany(advance.tenantId) }}</span>
            <span class="badge badge-xs badge-success">Aktif</span>
          </div>
          <p class="text-base font-bold text-purple-600 dark:text-purple-400 tabular-nums">{{ formatCurrency(Number(advance.balance ?? advance.amount ?? 0)) }}</p>
          <p class="text-[10px] text-slate-400 dark:text-[#626885] mt-0.5">{{ formatDate(advance.updatedAt || advance.lastMovementAt || advance.createdAt || advance.paymentDate) }}</p>
        </div>
      </div>
    </div>

    <!-- Filtreler ve Liste -->
    <div class="app-card !p-0">
      <!-- Filtreler -->
      <div class="px-4 py-3 border-b border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <CustomFilterBar
          class="flex-1"
          :search="filters.searchTerm"
          search-placeholder="Firma, tutar, tip veya banka ara..."
          :period="filters.period"
          :select-type="filters.type"
          :select-type-options="paymentTypeFilterOptions"
          @update:search="val => (filters.searchTerm = val)"
          @update:period="val => (filters.period = val)"
          @update:selectType="val => (filters.type = val)"
          @clearFilters="handleClearFilters"
        />
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="selectedIds.length > 0" class="flex items-center gap-2 shrink-0">
            <span class="text-xs font-semibold text-slate-600 dark:text-[#f1f3f9]">{{ selectedIds.length }} seçildi</span>
            <button @click="showBulkDeleteConfirm = true" class="btn btn-error btn-xs text-white gap-1">Sil</button>
          </div>
        </Transition>
      </div>

      <!-- Liste Başlığı -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
        <div class="flex items-center gap-3">
          <h3 class="text-[13.5px] font-black text-slate-800 dark:text-[#f1f3f9] uppercase tracking-tight">Ödeme Listesi</h3>
          <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ filteredPayments.length }} Kayıt</span>
        </div>
      </div>

      <!-- Tablo -->
      <div class="overflow-x-auto">
        <table class="table table-sm w-full border-collapse">
          <thead>
            <tr class="border-b border-white/[0.08]">
              <th class="w-10 px-4 py-4 text-center">
                <input
                  type="checkbox"
                  class="checkbox checkbox-xs checkbox-primary"
                  :checked="isAllSelected"
                  :indeterminate="isPartiallySelected"
                  @change="toggleSelectAll"
                />
              </th>
              <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest text-left px-4">Tarih</th>
              <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest text-left px-4">Kiracı / Ünite</th>
              <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest text-left px-4">Banka / Açıklama</th>
              <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest text-right px-4">Tutar (Alacak)</th>
              <th class="py-4 text-[10px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-widest text-center px-4">Aksiyon</th>
            </tr>
          </thead>
          <tbody class="divide-y-0">
            <tr v-if="loading">
              <td colspan="6" class="py-12 text-center text-slate-400">Yükleniyor...</td>
            </tr>
            <tr v-else-if="filteredPayments.length === 0">
              <td colspan="6" class="py-20 text-center">
                <p class="text-sm font-medium text-slate-500">Ödeme kaydı bulunamadı</p>
              </td>
            </tr>
            <tr 
              v-else
              v-for="p in paymentsView" 
              :key="p.id"
              class="group hover:bg-white/[0.02] transition-colors border-b border-white/[0.02]/50 last:border-0"
              :class="{'bg-brand-500/5': selectedIds.includes(p.id)}"
            >
              <td class="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  class="checkbox checkbox-xs checkbox-primary"
                  :value="p.id"
                  v-model="selectedIds"
                />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-[11px] font-black text-slate-400 dark:text-[#626885] uppercase tracking-tight">
                {{ formatDate(getPaymentDate(p)) }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-lg shrink-0" :class="getAvatarColor(p.company)">
                    {{ getAvatarInitial(p.company) }}
                  </div>
                  <p class="text-[13.5px] font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight truncate group-hover:text-brand-500 transition-colors">{{ p.company }}</p>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-widest bg-slate-50 dark:bg-white/[0.04] px-1.5 py-0.5 rounded">{{ p.bank || 'NAKİT' }}</span>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[150px]">{{ getPaymentDisplayLabel(p) }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <p class="text-[14px] font-black text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">
                  {{ formatCurrency(p.amount) }}
                </p>
                <p v-if="p.periodYear" class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{{ p.periodYear }}-{{ String(p.periodMonth).padStart(2, '0') }}</p>
              </td>
              <td class="px-4 py-3 text-center">
                <div class="dropdown dropdown-end">
                  <button tabindex="0" class="btn btn-ghost btn-xs btn-square text-slate-400 hover:text-brand-500">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/>
                    </svg>
                  </button>
                  <ul tabindex="0" class="dropdown-content menu p-1.5 shadow-card bg-base-100 border border-slate-200 dark:border-white/[0.07] rounded-xl w-32 z-10 text-xs">
                    <li><a @click="startEdit(p)" class="rounded-lg">Düzenle</a></li>
                    <li><a @click="deletePayment(p.id)" class="rounded-lg text-error">Sil</a></li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Sayfalama -->
      <div v-if="filteredPayments.length > 0" class="px-4 py-3 border-t border-slate-100 dark:border-slate-700/60">
        <PaginationBar
          v-model:currentPage="currentPage"
          v-model:pageSize="pageSize"
          :total-count="filteredPayments.length"
        />
      </div>
    </div>

    <!-- Payment Modal -->
    <PaymentModal
      :visible="showModal"
      :payment="newPayment"
      :tenants="tenants"
      :banks="banks"
      :editMode="editMode"
      :debtRefreshKey="debtRefreshKey"
      @save="handlePaymentSave"
      @cancel="handleModalClose"
      @dirty-changed="v => (isPaymentModalDirty = v)"
    />

    <!-- Değişiklik Kaybı Uyarı Modalı -->
    <BaseModal
      v-if="confirmModalVisible"
      :model-value="confirmModalVisible"
      title="DEĞİŞİKLİKLER KAYBOLACAK"
      icon="⚠️"
      size="sm"
      @close="cancelClose"
    >
      <div class="space-y-4 text-center">
        <p class="text-xs text-[#9aa0b4] font-medium leading-relaxed italic">
          Yaptığınız değişiklikler kaydedilmedi. Çıkmak istediğinizden emin misiniz?
        </p>
      </div>
      <template #footer>
        <button class="btn btn-ghost !bg-transparent border border-white/[0.08] text-[#9aa0b4] flex-1" @click="cancelClose">Vazgeç</button>
        <button class="btn btn-primary flex-1 font-black uppercase" @click="confirmClose">Devam Et</button>
      </template>
    </BaseModal>

    <!-- Toplu Silme Onay Modal -->
    <BaseModal
      v-if="showBulkDeleteConfirm"
      :model-value="showBulkDeleteConfirm"
      title="TOPLU SİLME ONAYI"
      icon="🗑️"
      size="sm"
      @close="showBulkDeleteConfirm = false"
    >
      <div class="space-y-6">
        <div class="flex flex-col items-center text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/5">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </div>
          <div class="space-y-2 px-2">
            <p class="text-sm font-black text-[#f1f3f9] uppercase tracking-tight">
              Kritik İşlem: <span class="text-red-400 font-bold">{{ selectedIds.length }}</span> Kayıt
            </p>
            <p class="text-[11px] text-[#626885] font-medium leading-relaxed italic px-4">
              Seçili tüm ödeme kayıtları kalıcı olarak silinecektir. Bu işlem geri alınamaz.
            </p>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-ghost !bg-transparent border border-white/[0.08] text-[#9aa0b4] flex-1" @click="showBulkDeleteConfirm = false" :disabled="isBulkDeleting">Vazgeç</button>
        <button class="btn btn-error flex-1 font-black uppercase" @click="confirmBulkDelete" :disabled="isBulkDeleting">
          <span v-if="isBulkDeleting" class="loading loading-spinner loading-xs mr-2"></span>
          Kaydı Sil
        </button>
      </template>
    </BaseModal>

    <!-- Avans Hesabı Yönetimi Modal -->
    <BaseModal
      v-if="showAdvanceManager"
      :model-value="showAdvanceManager"
      title="AVANS HESABI YÖNETİMİ"
      icon="💰"
      size="lg"
      @close="showAdvanceManager = false"
    >
      <AdvanceAccountManager @success="handleAdvanceSuccess" />
      <template #footer>
        <button class="btn btn-ghost !bg-transparent border border-white/[0.08] text-[#9aa0b4] w-full mt-4" @click="showAdvanceManager = false">Kapat</button>
      </template>
    </BaseModal>

    <!-- Finansal Raporlar Modal -->
    <BaseModal
      v-if="showFinancialReports"
      :model-value="showFinancialReports"
      title="FİNANSAL ANALİZ VE RAPORLAR"
      icon="📊"
      size="xl"
      @close="showFinancialReports = false"
    >
      <FinancialReports />
      <template #footer>
        <button class="btn btn-ghost !bg-transparent border border-white/[0.08] text-[#9aa0b4] w-full mt-4" @click="showFinancialReports = false">Raporu Kapat</button>
      </template>
    </BaseModal>

    <!-- Audit Logs Modal -->
    <BaseModal
      v-if="showAuditLogs"
      :model-value="showAuditLogs"
      title="SİSTEM DENETİM KAYITLARI"
      icon="📜"
      size="xl"
      @close="showAuditLogs = false"
    >
      <AuditLogs />
      <template #footer>
        <button class="btn btn-ghost !bg-transparent border border-white/[0.08] text-[#9aa0b4] w-full mt-4" @click="showAuditLogs = false">Panelden Çık</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ROLES } from '@/core/constants/roles'
import { useAuthStore } from '@/application/stores/auth'
import PaymentModal from './PaymentModal.vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import PaginationBar from '@/presentation/components/common/PaginationBar.vue'
import SkeletonRows from '@/presentation/components/common/SkeletonRows.vue'
import CustomFilterBar from '@/presentation/components/common/CustomFilterBar.vue'
import AdvanceAccountManager from '@/presentation/components/shared/AdvanceAccountManager.vue'
import FinancialReports from '@/presentation/components/shared/FinancialReports.vue'
import AuditLogs from '@/presentation/components/shared/AuditLogs.vue'
import { useErrorHandler } from '@/application/composables/useErrorHandler'
import { useNotify } from '@/application/composables/useNotify'
import { usePaymentsStore } from '@/application/stores/payments.js'
import { useTenantsStore } from '@/application/stores/tenants.js'
import { paymentTypes, getPaymentTypeLabel, paymentTypeToValue } from '@/core/constants/enums'
import { safeFormatDate } from '@/core/utils/dateUtils'
import { formatCurrency, getAvatarColor, getAvatarInitial } from '@/core/utils/uiHelpers'
import EmptyState from '@/presentation/components/ui/EmptyState.vue'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'

const { handleNetworkError } = useErrorHandler()
const { notifySuccess, notifyError } = useNotify()

const authStore = useAuthStore()

const paymentsStore = usePaymentsStore()
const tenantsStore = useTenantsStore()

const formatDate = (d) => safeFormatDate(d, 'dd MMM yyyy')

const payments = computed(() => paymentsStore.payments)
const tenants = computed(() => tenantsStore.tenants)
const advanceAccounts = computed(() => paymentsStore.advanceAccounts)
const banks = ref(['Ziraat', 'İş Bankası', 'Garanti', 'Yapı Kredi', 'Halkbank'])

const showModal = ref(false)
const showAdvanceManager = ref(false)
const debtRefreshKey = ref(0)
const showFinancialReports = ref(false)
const showAuditLogs = ref(false)
const loading = computed(() => paymentsStore.loading || tenantsStore.loading)

const isPaymentModalDirty = ref(false)
const confirmModalVisible = ref(false)
const pendingCloseAction = ref(null)

const filters = ref({
  searchTerm: '',
  period: '',
  type: ''
})

/* ---- Tip yardımcıları ---- */
const normalizePaymentType = (t) => {
  if (t === '' || t === null || t === undefined) return '';
  const v = paymentTypeToValue(t);
  return v !== null ? v : '';
}

const paymentTypeIconMap = {
  0: '🏢', // Aidat
  1: '⚡️', // Elektrik
  2: '💧', // Su
  3: '🔥', // Doğalgaz
  4: '💳'  // Diğer
}
const getPaymentTypeIcon = (t) => paymentTypeIconMap[normalizePaymentType(t)] ?? '💳'

const paymentTypeOptions = computed(() =>
  Object.entries(paymentTypes).map(([k, label]) => ({
    value: Number(k),
    label,
    icon: getPaymentTypeIcon(Number(k))
  }))
)
const getPaymentDisplayLabel = (p) => {
  const baseLabel = getPaymentTypeLabel(p.type)
  // Eski kayıtlarda debtTypes boş olabilir
  if (p.debtTypes && p.debtTypes.length > 0) {
    const types = p.debtTypes.map(t => getDebtTypeLabel(t)).join(', ')
    return `${baseLabel} (${types})`
  }
  return baseLabel
}

const getPaymentDisplayIcon = (p) => {
  if (p.debtTypes && p.debtTypes.length === 1) {
    return getDebtTypeIcon(p.debtTypes[0])
  }
  return getPaymentTypeIcon(p.type)
}

import { getDebtTypeLabel, getDebtTypeIcon } from '@/core/constants/enums'

const paymentTypeFilterOptions = computed(() => [
  { value: '', label: 'Tüm Tipler', icon: '📦' },
  ...paymentTypeOptions.value,
  { value: 'debt:1', label: 'Elektrik', icon: '⚡️' },
  { value: 'debt:2', label: 'Su', icon: '💧' }
])

const getPaymentDate = (p) => p?.date || p?.paymentDate || p?.createdAt || ''

/* ---- Özetler ---- */
const totalIncome = computed(() =>
  payments.value.reduce((sum, p) => sum + Number(p.amount || 0), 0)
)

const thisMonthIncome = computed(() => {
  const today = new Date()
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  return payments.value
    .filter(p => (getPaymentDate(p) || '').startsWith(currentMonth))
    .reduce((sum, p) => sum + Number(p.amount || 0), 0)
})

const thisMonthCount = computed(() => {
  const today = new Date()
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  return payments.value.filter(p => (getPaymentDate(p) || '').startsWith(currentMonth)).length
})

const paymentsCount = computed(() => payments.value.length)

const totalAdvance = computed(() =>
  advanceAccounts.value.reduce((sum, a) => sum + Number(a.balance ?? 0), 0)
)

/* ---- UI yardımcıları ---- */
const clearFilters = () => {
  filters.value = { searchTerm: '', period: '', type: '' }
}

/* ---- Kiracı adı ---- */
const getTenantCompany = (id) => {
  if (!id) return 'Mal Sahibi Ödemesi'
  const t = tenantsStore.getTenantById(id)
  return (
    t?.companyName ||
    t?.company ||
    t?.contactPersonName ||
    t?.fullName ||
    [t?.firstName, t?.lastName].filter(Boolean).join(' ') ||
    t?.email ||
    `#${id}`
  )
}

/* ---- Filtrelenmiş liste ---- */
const filteredPayments = computed(() => {
  let filtered = payments.value
  const searchTerm = (filters.value.searchTerm || '').toLowerCase()

  const filterType = filters.value.type
  if (filterType && String(filterType).startsWith('debt:')) {
    const debtTypeIdx = parseInt(filterType.split(':')[1])
    filtered = filtered.filter(p => p.debtTypes && p.debtTypes.includes(debtTypeIdx))
  } else {
    const fType = normalizePaymentType(filterType)
    if (fType !== '' && fType !== undefined) {
      filtered = filtered.filter(p => normalizePaymentType(p.type) === fType)
    }
  }

  if (filters.value.period) {
    filtered = filtered.filter(p => {
      const paymentDate = getPaymentDate(p)
      if (!paymentDate) return false
      const periodDate = new Date(filters.value.period)
      const payDate = new Date(paymentDate)
      return payDate.getFullYear() === periodDate.getFullYear() && 
             payDate.getMonth() === periodDate.getMonth()
    })
  }

  if (searchTerm) {
    filtered = filtered.filter(p =>
      getTenantCompany(p.tenantId).toLowerCase().includes(searchTerm) ||
      getPaymentTypeLabel(normalizePaymentType(p.type)).toLowerCase().includes(searchTerm) ||
      (p.bank && p.bank.toLowerCase().includes(searchTerm)) ||
      (p.amount && String(p.amount).includes(searchTerm))
    )
  }

  return filtered.sort((a, b) => new Date(getPaymentDate(b)) - new Date(getPaymentDate(a)))
})

/* ---- Bulk Seçim ---- */
const selectedIds = ref([])
const showBulkDeleteConfirm = ref(false)
const isBulkDeleting = ref(false)

const isAllSelected = computed(() => {
  const valid = paginatedPayments.value.filter(p => p.id)
  return valid.length > 0 && valid.every(p => selectedIds.value.includes(p.id))
})

const isPartiallySelected = computed(() => {
  const valid = paginatedPayments.value.filter(p => p.id)
  const selectedCount = valid.filter(p => selectedIds.value.includes(p.id)).length
  return selectedCount > 0 && selectedCount < valid.length
})

const toggleSelectAll = (e) => {
  const valid = paginatedPayments.value.filter(p => p.id)
  if (e.target.checked) {
    const toAdd = valid.map(p => p.id).filter(id => !selectedIds.value.includes(id))
    selectedIds.value.push(...toAdd)
  } else {
    selectedIds.value = selectedIds.value.filter(id => !valid.map(p => p.id).includes(id))
  }
}

/* ---- Pagination ---- */
const currentPage = ref(1)
const pageSize = ref(10)

const totalPages = computed(() => Math.ceil(filteredPayments.value.length / pageSize.value))

const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredPayments.value.slice(start, end)
})

const paymentsView = computed(() => paginatedPayments.value.map(p => ({
  ...p,
  company: getTenantCompany(p.tenantId)
})))


// Reset to first page when filters or pageSize change
watch([filters, pageSize], () => {
  currentPage.value = 1
}, { deep: true })

/* ---- Modal form ---- */
const newPayment = ref({
  id: null,
  date: new Date().toISOString().substring(0, 10),
  tenantId: '',
  ownerId: null,
  amount: null,
  type: '',
  bank: '',
  description: ''
})

const editMode = ref(false)
const selectedPaymentId = ref(null)

/* ---- Handlers ---- */
const reallyClosePaymentModal = () => {
  showModal.value = false
  isPaymentModalDirty.value = false
  confirmModalVisible.value = false
  pendingCloseAction.value = null
  newPayment.value = {
    id: null,
    date: new Date().toISOString().substring(0, 10),
    tenantId: '',
    ownerId: null,
    amount: null,
    type: '',
    bank: '',
    description: ''
  }
  editMode.value = false
  selectedPaymentId.value = null
}

const handleModalClose = () => {
  if (isPaymentModalDirty.value) {
    pendingCloseAction.value = 'closePaymentModal'
    confirmModalVisible.value = true
    return
  }
  reallyClosePaymentModal()
}

const confirmClose = () => {
  if (pendingCloseAction.value === 'closePaymentModal') reallyClosePaymentModal()
}

const cancelClose = () => {
  confirmModalVisible.value = false
  pendingCloseAction.value = null
}

const deletePayment = async (id) => {
  try {
    await paymentsStore.deletePayment(id)
    notifySuccess('Ödeme silindi.')
  } catch (error) {
    notifyError('Ödeme silinemedi.')
    handleNetworkError(error, { component: 'Payments', action: 'deletePayment' })
  }
}

const confirmBulkDelete = async () => {
  if (selectedIds.value.length === 0) return
  isBulkDeleting.value = true
  try {
    await paymentsStore.bulkDeletePayments(selectedIds.value)
    notifySuccess(`${selectedIds.value.length} ödeme başarıyla silindi.`)
    selectedIds.value = []
    showBulkDeleteConfirm.value = false
  } catch (err) {
    notifyError('Toplu silme sırasında hata oluştu.')
    handleNetworkError(err)
  } finally {
    isBulkDeleting.value = false
  }
}

const startEdit = (payment) => {
  newPayment.value = { 
    id: payment.id,
    date: (getPaymentDate(payment) || new Date().toISOString()).substring(0,10),
    tenantId: payment.tenantId || '',
    ownerId: payment.ownerId ?? null,
    amount: payment.amount ?? null,
    type: normalizePaymentType(payment.type),
    bank: payment.bank ?? '',
    description: payment.description ?? ''
  }
  selectedPaymentId.value = payment.id
  editMode.value = true
  showModal.value = true
}

const handleClearFilters = () => {
  clearFilters()
  paymentsStore.fetchIfNeeded({}, true)
}

const handlePaymentSave = async () => {
  showModal.value = false
  newPayment.value = {
    id: null,
    date: new Date().toISOString().substring(0, 10),
    tenantId: '',
    ownerId: null,
    amount: null,
    type: '',
    bank: '',
    description: ''
  }
  const wasEdit = editMode.value
  editMode.value = false
  selectedPaymentId.value = null

  await Promise.all([
    paymentsStore.fetchIfNeeded({}, true), 
    paymentsStore.fetchAdvanceAccounts()
  ])

  if (wasEdit) notifySuccess('Ödeme güncellendi.')
  else notifySuccess('Ödeme kaydedildi.')
}

const handleAdvanceSuccess = () => {
  showAdvanceManager.value = false
  debtRefreshKey.value++  // trigger PaymentModal to re-fetch debts
  paymentsStore.fetchAdvanceAccounts()
  paymentsStore.fetchIfNeeded({}, true)
  notifySuccess('Avans hesabı işlemi başarıyla tamamlandı.')
}

/* ---- Analitik ---- */
const monthlyPaymentData = computed(() => {
  const months = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = date.toLocaleDateString('tr-TR', { month: 'short' })
    const total = payments.value
      .filter(p => (getPaymentDate(p) || '').startsWith(key))
      .reduce((sum, p) => sum + Number(p.amount || 0), 0)
    months.push({ month: label, total })
  }
  return months
})

const maxMonthlyPayment = computed(() => Math.max(...monthlyPaymentData.value.map(m => m.total), 1))

const paymentTypeStats = computed(() => {
  const stats = {}
  payments.value.forEach(p => {
    const key = normalizePaymentType(p.type)
    if (key === '') return
    if (!stats[key]) {
      stats[key] = {
        name: key,
        label: getPaymentTypeLabel(key),
        icon: getPaymentTypeIcon(key),
        count: 0,
        total: 0
      }
    }
    stats[key].count++
    stats[key].total += Number(p.amount || 0)
  })
  return Object.values(stats).sort((a, b) => b.total - a.total)
})

onMounted(() => {
  tenantsStore.fetchIfNeeded()
  paymentsStore.fetchAdvanceAccounts()
  paymentsStore.fetchIfNeeded()
})
</script>
