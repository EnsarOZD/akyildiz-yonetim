<template>
  <div v-if="loading" class="flex justify-center items-center h-96">
    <span class="loading loading-spinner loading-lg"></span>
  </div>

  <div v-else-if="!tenant" class="text-center p-12">
    <h2 class="text-2xl font-bold text-error">Kiracı Bulunamadı</h2>
    <p class="text-base-content/70 mt-2">Bu ID'ye sahip bir kiracı bulunamadı veya veritabanından silinmiş olabilir.</p>
    <router-link to="/tenants" class="btn btn-primary mt-6">Kiracı Listesine Geri Dön</router-link>
  </div>

  <div v-else class="p-4 sm:p-6 space-y-6">
    <!-- Başlık ve Durum Kartı -->
    <PageHeader 
      :title="tenant.companyName" 
      :subtitle="`${tenant.businessType} — ${(tenant.flats?.map(f => f.code || f.unitNumber).join(', ')) || 'Ünite bilgisi yok'}`"
    >
      <template #icon>
        <div class="avatar placeholder">
          <div class="bg-primary text-primary-content rounded-xl w-12 h-12 flex items-center justify-center">
            <span class="text-xl font-bold">{{ getAvatarInitial(tenant.companyName) }}</span>
          </div>
        </div>
      </template>
      <template #actions>
        <div class="flex items-center gap-4">
          <div class="text-right hidden sm:block">
            <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bakiye</div>
            <div class="text-lg font-black" :class="tenant.totalBalance > 0 ? 'text-red-500' : 'text-emerald-500'">
              {{ formatCurrency(tenant.totalBalance) }}
            </div>
          </div>
          <div class="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
          <div class="flex items-center gap-2">
            <span :class="['badge badge-sm font-bold px-3 py-2', tenant.isActive ? 'badge-success' : 'badge-ghost']">
              {{ tenant.isActive ? 'Aktif' : 'Pasif' }}
            </span>
            <button 
              v-if="authStore.role === 'admin' || authStore.role === 'manager'"
              @click="showEditModal = true"
              class="btn btn-sm btn-outline border-slate-300 dark:border-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Bilgileri Düzenle
            </button>
          </div>
        </div>
      </template>
    </PageHeader>

    <!-- Sekmeler -->
    <div class="tabs tabs-boxed bg-base-200 p-1 mb-6">
      <a class="tab transition-all" :class="{'tab-active !bg-primary !text-white !rounded-lg shadow-md': activeTab === 'timeline'}" @click="activeTab = 'timeline'">Finansal Akış (Timeline)</a>
      <a class="tab transition-all" :class="{'tab-active !bg-primary !text-white !rounded-lg shadow-md': activeTab === 'debts'}" @click="activeTab = 'debts'">Ödenmemiş Borçlar</a>
      <a class="tab transition-all" :class="{'tab-active !bg-primary !text-white !rounded-lg shadow-md': activeTab === 'payments'}" @click="activeTab = 'payments'">Yapılan Ödemeler</a>
      <a class="tab transition-all" :class="{'tab-active !bg-primary !text-white !rounded-lg shadow-md': activeTab === 'info'}" @click="activeTab = 'info'">İş Yeri Bilgileri</a>
    </div>

    <!-- Sekme İçerikleri -->
    <div class="card bg-base-100 shadow-xl min-h-[400px]">
      <div class="card-body">
        <!-- Finansal İşlem Geçmişi -->
        <div v-if="activeTab === 'timeline'" class="space-y-6">
          <!-- Özet Kartlar -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl p-4">
              <p class="text-xs font-bold uppercase tracking-widest text-red-400 mb-1">Toplam Tahakkuk</p>
              <p class="text-xl font-black text-red-600 dark:text-red-400">{{ formatCurrency(timelineSummary.totalDebt) }}</p>
              <p class="text-xs text-red-400 mt-1">{{ timelineSummary.debtCount }} kalem</p>
            </div>
            <div class="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-2xl p-4">
              <p class="text-xs font-bold uppercase tracking-widest text-green-400 mb-1">Toplam Tahsilat</p>
              <p class="text-xl font-black text-green-600 dark:text-green-400">{{ formatCurrency(timelineSummary.totalPayment) }}</p>
              <p class="text-xs text-green-400 mt-1">{{ timelineSummary.paymentCount }} işlem</p>
            </div>
            <div class="rounded-2xl p-4 border"
              :class="timelineSummary.balance > 0
                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30'
                : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30'">
              <p class="text-xs font-bold uppercase tracking-widest mb-1"
                :class="timelineSummary.balance > 0 ? 'text-orange-400' : 'text-emerald-400'">Güncel Bakiye</p>
              <p class="text-xl font-black"
                :class="timelineSummary.balance > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400'">
                {{ formatCurrency(Math.abs(timelineSummary.balance)) }}
              </p>
              <p class="text-xs mt-1"
                :class="timelineSummary.balance > 0 ? 'text-orange-400' : 'text-emerald-400'">
                {{ timelineSummary.balance > 0 ? 'Kalan borç' : 'Fazla ödeme' }}
              </p>
            </div>
          </div>

          <!-- Filtre -->
          <div class="flex items-center gap-2 flex-wrap">
            <button
              v-for="f in [{val:'all',label:'Tümü'},{val:'debt',label:'Tahakkuklar'},{val:'payment',label:'Tahsilatlar'}]"
              :key="f.val"
              @click="timelineFilter = f.val"
              class="px-4 py-1.5 rounded-full text-sm font-semibold border transition-all"
              :class="timelineFilter === f.val
                ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-900 border-transparent'
                : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-400'">
              {{ f.label }}
            </button>
          </div>

          <!-- Tablo -->
          <div class="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-700">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 dark:bg-gray-800/60 text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  <th class="px-4 py-3 text-left font-bold rounded-tl-2xl">Tarih</th>
                  <th class="px-4 py-3 text-left font-bold">Tür</th>
                  <th class="px-4 py-3 text-left font-bold">Açıklama</th>
                  <th class="px-4 py-3 text-right font-bold">Tutar</th>
                  <th class="px-4 py-3 text-center font-bold rounded-tr-2xl">Durum</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in filteredTimelineItems" :key="idx"
                  class="border-t border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ formatDate(item.date) }}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                      :class="item.isPayment
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'">
                      <span>{{ item.isPayment ? '↑' : '↓' }}</span>
                      {{ item.isPayment ? 'Tahsilat' : 'Tahakkuk' }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="font-semibold text-gray-800 dark:text-gray-200">{{ item.description }}</div>
                    <div class="text-xs text-gray-400 mt-0.5">{{ item.typeLabel }}</div>
                  </td>
                  <td class="px-4 py-3 text-right font-bold whitespace-nowrap"
                    :class="item.isPayment ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                    {{ item.isPayment ? '+' : '-' }}{{ formatCurrency(item.amount) }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span v-if="item.isPayment" class="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                      Alındı
                    </span>
                    <span v-else class="inline-block px-2 py-0.5 rounded-full text-xs font-bold"
                      :class="item.isPaid
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'">
                      {{ item.isPaid ? 'Ödendi' : 'Bekliyor' }}
                    </span>
                  </td>
                </tr>
                <tr v-if="filteredTimelineItems.length === 0">
                  <td colspan="5" class="px-4 py-12 text-center text-gray-400 italic">
                    Henüz finansal işlem kaydı bulunmuyor.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Ödenmemiş Borçlar -->
        <div v-if="activeTab === 'debts'">
          <h3 class="text-xl font-bold mb-4">Ödenmemiş Faturalar ve Aidatlar</h3>
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th scope="col">Açıklama</th>
                  <th scope="col">Son Ödeme Tarihi</th>
                  <th scope="col" class="text-right">Tutar</th>
                  <th scope="col" class="text-center">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in unpaidItems" :key="item.id" class="hover group">
                  <td>{{ item.description || `Aidat (${item.period || item.unit})` }}</td>
                  <td>{{ formatDate(item.dueDate) }}</td>
                  <td class="text-right font-semibold text-error">{{ formatCurrency(item.amount ?? item.toplamTutar) }}</td>
                  <td class="text-center">
                    <div class="flex justify-center flex-wrap gap-2">
                      <button @click="router.push(`/payments?tenantId=${tenant.id}&debtId=${item.id}`)" class="btn btn-xs btn-primary font-bold shadow-sm" title="Nakit/Kart Ödeme">Öde</button>
                      <button @click="openAdvanceModal(item)" class="btn btn-xs btn-outline btn-info font-bold" title="Avans Kullan">Avans</button>
                      <button v-if="authStore.role === 'admin' || authStore.role === 'manager'" @click="handleDeleteDebt(item.id)" class="btn btn-xs btn-outline btn-error font-bold" title="Aidat/Borç Sil">Sil</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="unpaidItems.length === 0">
                  <td colspan="3" class="text-center py-8 text-base-content/60">Ödenmemiş borç bulunmamaktadır.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Yapılan Ödemeler -->
        <div v-else-if="activeTab === 'payments'">
          <h3 class="text-xl font-bold mb-4">Ödeme Geçmişi</h3>
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th scope="col">Ödeme Tarihi</th>
                  <th scope="col">Açıklama</th>
                  <th scope="col">Ödeme Şekli</th>
                  <th scope="col">Banka</th>
                  <th scope="col" class="text-right">Tutar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="payment in filteredPayments" :key="payment.id" class="hover">
                  <td>{{ formatDate(payment.paymentDate) }}</td>
                  <td>{{ payment.description }}</td>
                  <td>
                    <span class="badge badge-outline badge-sm">{{ getPaymentMethodLabel(payment.method) }}</span>
                  </td>
                  <td>{{ payment.bankName || '-' }}</td>
                  <td class="text-right font-semibold text-success">{{ formatCurrency(payment.amount) }}</td>
                </tr>
                <tr v-if="payments.length === 0">
                  <td colspan="3" class="text-center py-8 text-base-content/60">Kayıtlı ödeme bulunmamaktadır.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Aidat ve Gider Kayıtları -->
        <div v-else-if="activeTab === 'history'">
          <h3 class="text-xl font-bold mb-4">Geçmiş Kayıtlar</h3>
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th scope="col">Tarih</th>
                  <th scope="col">Tür</th>
                  <th scope="col">Açıklama</th>
                  <th scope="col" class="text-right">Tutar</th>
                  <th scope="col">Durum</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in historyItems" :key="item.id" class="hover">
                  <td>{{ formatDate(item.date) }}</td>
                  <td>
                    <span class="badge"
                      :class="item.type === 'Water' ? 'badge-info' : item.type === 'Electricity' ? 'badge-warning' : 'badge-neutral'">
                      {{ item.type === 'Water' ? 'Su' : item.type === 'Electricity' ? 'Elektrik' : 'Aidat' }}
                    </span>
                  </td>
                  <td>{{ item.description }}</td>
                  <td class="text-right font-semibold">{{ formatCurrency(item.amount) }}</td>
                  <td>
                    <span class="badge" :class="getPaymentStatusBadge(item)">
                      {{ getPaymentStatusLabel(item) }}
                    </span>
                  </td>
                </tr>
                <tr v-if="historyItems.length === 0">
                  <td colspan="5" class="text-center py-8 text-base-content/60">Kayıtlı borç bulunmamaktadır.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- İş Yeri Bilgileri -->
        <div v-else-if="activeTab === 'info'" class="space-y-4">
          <h3 class="text-xl font-bold">Detaylı Bilgiler</h3>

          <!-- İş Yeri Bilgileri -->
          <div class="card bg-base-200 p-4">
            <h4 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">🏢 İş Yeri Bilgileri</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div><strong>Şirket Adı:</strong> {{ tenant.companyName }}</div>
              <div><strong>İş Türü:</strong> {{ tenant.businessType }}</div>
              <div><strong>Kimlik/Vergi No:</strong> {{ tenant.identityNumber || 'Belirtilmemiş' }}</div>
            </div>
          </div>

          <!-- İletişim -->
          <div class="card bg-base-200 p-4">
            <h4 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">👤 İletişim Kişisi</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div><strong>İletişim Kişisi:</strong> {{ tenant.contactPersonName }}</div>
              <div><strong>Telefon:</strong> <a :href="`tel:${tenant.contactPersonPhone}`" class="link link-primary">{{ tenant.contactPersonPhone }}</a></div>
              <div v-if="tenant.contactPersonEmail"><strong>E-posta:</strong> <a :href="`mailto:${tenant.contactPersonEmail}`" class="link link-primary">{{ tenant.contactPersonEmail }}</a></div>
            </div>
          </div>

          <!-- Ünite Bilgileri -->
          <div class="card bg-base-200 p-4">
            <h4 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">📍 Ünite Bilgileri</h4>
            <div v-if="tenant.flats && tenant.flats.length > 0">
              <div
                v-for="flat in tenant.flats"
                :key="flat.id"
                class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 mb-4 p-3 bg-base-100 rounded-lg"
              >
                <div><strong>Ünite:</strong> {{ flat.code || flat.unitNumber }}</div>
                <div><strong>Kat:</strong> {{ flat.floorNumber ?? flat.floor }}<span v-if="flat.floorNumber ?? flat.floor">. Kat</span></div>
                <div><strong>Alan:</strong> {{ flat.unitArea }} m²</div>
              </div>
            </div>
            <div v-else class="text-base-content/60">Ünite bilgisi bulunmamaktadır.</div>
          </div>

          <!-- Aidat -->
          <div class="card bg-base-200 p-4">
            <h4 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">💰 Aidat Bilgileri</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div><strong>Aylık Aidat:</strong> {{ formatCurrency(tenant.monthlyAidat) }}</div>
            </div>
          </div>

          <div class="card bg-base-200 p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div><strong>Durum:</strong> <span :class="['badge', tenant.isActive ? 'badge-success' : 'badge-ghost']">{{ tenant.isActive ? 'Aktif' : 'Pasif' }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Avans Modal -->
    <div class="modal" :class="{'modal-open': showAdvanceModal}">
      <div class="modal-box max-w-2xl bg-base-100 p-0 overflow-hidden border border-base-300">
        <div class="p-6 border-b border-base-200 flex justify-between items-center bg-base-200/50">
          <h3 class="font-bold text-lg">Avans Hesabı Kullan</h3>
          <button @click="showAdvanceModal = false" class="btn btn-ghost btn-sm btn-circle">✕</button>
        </div>
        <div class="p-6 max-h-[70vh] overflow-y-auto">
          <AdvanceAccountManager 
            v-if="showAdvanceModal"
            :tenant-id="tenantId"
            @success="handleAdvanceSuccess"
          />
        </div>
        <div class="p-4 border-t border-base-200 flex justify-end">
          <button @click="showAdvanceModal = false" class="btn btn-ghost">Kapat</button>
        </div>
      </div>
      <div class="modal-backdrop" @click="showAdvanceModal = false"></div>
    </div>

    <!-- Düzenleme Modalı -->
    <TenantEditModal
      v-if="tenant"
      :visible="showEditModal"
      :tenant="tenant"
      @save="handleUpdateTenant"
      @close="showEditModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import { useRoute, useRouter } from 'vue-router'
import AdvanceAccountManager from '@/presentation/components/shared/AdvanceAccountManager.vue'
import TenantEditModal from './TenantEditModal.vue'
import tenantsService from '@/infrastructure/services/tenantsService.js'
import paymentsService from '@/infrastructure/services/paymentsService'
import utilityDebtsService from '@/infrastructure/services/utilityDebtsService'
import { useAuthStore } from '@/application/stores/auth'
import { useErrorHandler } from '@/application/composables/useErrorHandler'
import { useNotify } from '@/application/composables/useNotify'
import { getPaymentMethodLabel } from '@/core/constants/enums'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { handleNetworkError } = useErrorHandler()

const tenantId = ref(null)
const tenant = ref(null)
const unpaidItems = ref([])
const payments = ref([])
const historyItems = ref([])
const loading = ref(true)
const activeTab = ref('timeline')
const totalDebt = ref(0)
const showAdvanceModal = ref(false)
const showEditModal = ref(false)
const timelineFilter = ref('all')
const { notifySuccess, notifyError } = useNotify()

const filteredPayments = computed(() => {
  return payments.value.filter(p => !p.receiptNumber?.startsWith('AVANS-'))
})

const openAdvanceModal = (item) => {
  showAdvanceModal.value = true
}

const handleUpdateTenant = async (data) => {
  try {
    await tenantsService.updateTenant(tenantId.value, data)
    notifySuccess('Kiracı bilgileri güncellendi')
    showEditModal.value = false
    await fetchTenantDetails()
  } catch (err) {
    console.error('Kiracı güncellenirken hata:', err)
    handleNetworkError(err, { component: 'TenantDetailPage', action: 'handleUpdateTenant' })
  }
}

const handleAdvanceSuccess = () => {
  showAdvanceModal.value = false
  fetchTenantDetails()
}

const handleDeleteDebt = async (debtId) => {
  if (!confirm('Bu borç kaydını kalıcı olarak silmek istediğinize emin misiniz?')) return
  try {
    await utilityDebtsService.deleteUtilityDebt(debtId)
    notifySuccess('Borç kaydı başarıyla silindi.')
    await fetchTenantDetails()
  } catch (err) {
    console.error('Borç silinirken hata:', err)
    notifyError('Borç silinemedi.')
  }
}

const filteredTimelineItems = computed(() => {
  if (timelineFilter.value === 'debt') return timelineItems.value.filter(i => !i.isPayment)
  if (timelineFilter.value === 'payment') return timelineItems.value.filter(i => i.isPayment)
  return timelineItems.value
})

const timelineSummary = computed(() => {
  const debts = timelineItems.value.filter(i => !i.isPayment)
  const pmts = timelineItems.value.filter(i => i.isPayment)
  const totalDebt = debts.reduce((s, i) => s + i.amount, 0)
  const totalPayment = pmts.reduce((s, i) => s + i.amount, 0)
  return {
    totalDebt,
    totalPayment,
    balance: totalDebt - totalPayment,
    debtCount: debts.length,
    paymentCount: pmts.length
  }
})

const timelineItems = computed(() => {
  const items = []
  
  // Borçları ekle
  historyItems.value.forEach(h => {
    items.push({
      date: h.date,
      description: h.description,
      amount: h.amount,
      isPayment: false,
      isPaid: h.isPaid,
      typeLabel: h.type === 'Water' ? 'Su' : h.type === 'Electricity' ? 'Elektrik' : 'Aidat'
    })
  })
  
  // Ödemeleri ekle
  payments.value.forEach(p => {
    items.push({
      date: p.paymentDate,
      description: p.description || 'Tahsilat',
      amount: p.amount,
      isPayment: true,
      typeLabel: 'Ödeme'
    })
  })
  
  // Tarihe göre sırala (Yeni en üstte)
  return items.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const formatCurrency = (value) =>
  Number(value ?? 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })

const toDate = (ts) => {
  if (!ts) return null
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return isNaN(d.getTime()) ? null : d
}

const formatDate = (ts) => {
  const d = toDate(ts)
  return d ? d.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'
}


// Tip bazlı ödeme durumu hesaplama — backend status alanına güvenilir
const getPaymentStatusByType = (item, payments) => {
  // Backend'den gelen isPaid (debt.status === 'Paid') en güvenilir kaynak
  if (item.isPaid === true) {
    return { status: 'paid', badge: 'badge-success', label: 'Ödendi' }
  }

  // Varsayılan durum - ödenmemiş
  if (item.dueDate && new Date(item.dueDate) < new Date()) {
    return { status: 'overdue', badge: 'badge-error', label: 'Vadesi Geçmiş' }
  }

  return { status: 'unpaid', badge: 'badge-warning', label: 'Ödenmemiş' }
}

const getPaymentStatusBadge = (item) => {
  const status = getPaymentStatusByType(item, payments.value)
  return status.badge
}

const getPaymentStatusLabel = (item) => {
  const status = getPaymentStatusByType(item, payments.value)
  return status.label
}

const getAvatarInitial = (name) => (name ? name.charAt(0).toUpperCase() : '?')

// Veri çekimi
const fetchTenantDetails = async () => {
  if (!tenantId.value) { loading.value = false; return }
  loading.value = true

  try {
    const tenantData = await tenantsService.getTenantById(tenantId.value)
    tenant.value = tenantData || null
    if (!tenant.value) { loading.value = false; return }

    // Tenant'ın flat ID'lerini al
    const tenantFlatIds = tenant.value.flats?.map(flat => flat.id) || []
    
    const [paymentsData, utilityDebtsData] = await Promise.all([
      paymentsService.getPayments({ tenantId: tenantId.value }),
      utilityDebtsService.getUtilityDebts({ tenantId: tenantId.value })
    ])

    // history - Utility debts
    const combinedHistory = []
    
    // Utility debts ekle
    ;(utilityDebtsData || []).forEach(debt => {
      combinedHistory.push({
        ...debt,
        type: debt.type, // 'Electricity' | 'Water' | 'Aidat'
        date: debt.date ?? debt.createdAt ?? debt.dueDate ?? null,
        description: `${debt.type === 'Electricity' ? 'Elektrik' : debt.type === 'Water' ? 'Su' : 'Aidat'} (${debt.period || (debt.dueDate ? formatDate(debt.dueDate) : 'Dönem Belirtilmemiş')})`,
        amount: Number(debt.amount ?? 0),
        toplamTutar: Number(debt.amount ?? 0),
        remainingAmount: Number(debt.remainingAmount ?? debt.amount ?? 0),
        isPaid: debt.status === 'Paid'
      })
    })
    
    historyItems.value = combinedHistory.sort((a, b) => (toDate(b.date)?.getTime() ?? 0) - (toDate(a.date)?.getTime() ?? 0))

    // unpaid - Backend status ve remainingAmount'a güven
    unpaidItems.value = (utilityDebtsData || [])
      .filter(d => {
        if (d.status === 'Paid') return false
        const amount = Number(d.remainingAmount ?? d.amount ?? 0)
        return amount > 0
      })
      .map(d => ({
        ...d,
        amount: Number(d.remainingAmount ?? d.amount ?? 0),
        typeLabel: d.type === 'Electricity' ? 'Elektrik' : d.type === 'Water' ? 'Su' : 'Aidat',
        company: tenant.value?.companyName || 'Bilinmeyen',
        floor: d.unit ?? '-' // BE tarafında istersen floorNumber/Code ile genişletilebilir
      }))
      .sort((a, b) => (toDate(a.dueDate)?.getTime() ?? 0) - (toDate(b.dueDate)?.getTime() ?? 0))

    // payments
    payments.value = (paymentsData || []).sort((a, b) => (toDate(b.paymentDate)?.getTime() ?? 0) - (toDate(a.paymentDate)?.getTime() ?? 0))

    // total
    totalDebt.value = tenant.value.totalBalance
  } catch (err) {
    console.error('Error fetching tenant details:', err)
    handleNetworkError(err, { component: 'TenantDetailPage', action: 'fetchTenantDetails' })
  } finally {
    loading.value = false
  }
}

// auth + route watcher
watch(
  () => [authStore.user, route.params.id, route.name],
  ([user, rid, rname]) => {
    if (rname === 'Profile' && user?.role === 'tenant' && user.tenantId) {
      tenantId.value = user.tenantId
    } else {
      tenantId.value = rid
    }
  },
  { immediate: true }
)

watch(tenantId, (n, o) => { if (n && n !== o) fetchTenantDetails() }, { immediate: true })
</script>
