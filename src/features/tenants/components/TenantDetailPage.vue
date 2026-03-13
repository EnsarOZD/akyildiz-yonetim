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
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="avatar placeholder">
              <div class="bg-primary text-primary-content rounded-full w-16">
                <span class="text-2xl">{{ getAvatarInitial(tenant.companyName) }}</span>
              </div>
            </div>
            <div>
              <h1 class="text-3xl font-bold">{{ tenant.companyName }}</h1>
              <p class="text-base-content/70">
                {{ tenant.businessType }}
                -
                {{ (tenant.flats?.map(f => f.code || f.unitNumber).join(', ')) || 'Ünite bilgisi yok' }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-right">
            <div class="text-sm text-base-content/70">Güncel Bakiye</div>
              <div class="text-2xl font-bold" :class="tenant.totalBalance > 0 ? 'text-error' : 'text-success'">
                {{ formatCurrency(tenant.totalBalance) }}
              </div>
              <div v-if="tenant.advanceBalance > 0" class="text-xs text-success font-semibold">
                (Avans: {{ formatCurrency(tenant.advanceBalance) }})
              </div>
            </div>
            <span :class="['badge badge-lg font-semibold', tenant.isActive ? 'badge-success' : 'badge-ghost']">
              {{ tenant.isActive ? 'Aktif' : 'Pasif' }}
            </span>
            <button 
              v-if="authStore.role === 'admin' || authStore.role === 'manager'"
              @click="showEditModal = true"
              class="btn btn-outline btn-sm sm:btn-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Bilgileri Düzenle
            </button>
          </div>
        </div>
      </div>
    </div>

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
        <!-- Timeline Görünümü -->
        <div v-if="activeTab === 'timeline'" class="space-y-4">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">Finansal İşlem Geçmişi</h3>
            <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
              <span class="inline-block w-3 h-3 bg-error rounded-full mr-1"></span> Borç
              <span class="inline-block w-3 h-3 bg-success rounded-full ml-3 mr-1"></span> Ödeme
            </div>
          </div>
          
          <ul class="timeline timeline-vertical timeline-compact">
            <li v-for="(item, idx) in timelineItems" :key="idx">
              <hr v-if="idx > 0" :class="item.isPayment ? 'bg-success/30' : 'bg-error/30'" />
              <div class="timeline-middle">
                <div :class="['w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-white', item.isPayment ? 'bg-success' : 'bg-error']">
                  <span v-if="item.isPayment">💸</span>
                  <span v-else>📄</span>
                </div>
              </div>
              <div class="timeline-start mb-10 md:text-end pr-4">
                <time class="font-mono italic text-sm text-gray-500">{{ formatDate(item.date) }}</time>
                <div class="text-xs uppercase text-gray-400 font-bold tracking-widest mt-1">{{ item.isPayment ? 'Tahsilat' : 'Tahakkuk' }}</div>
              </div>
              <div class="timeline-end timeline-box !bg-base-100 border-gray-200 shadow-sm p-4 w-full md:w-auto min-w-[300px]">
                <div class="flex flex-col gap-1">
                  <div class="flex justify-between items-center gap-4">
                    <span class="font-bold text-gray-800 dark:text-gray-200">{{ item.description }}</span>
                    <span :class="['font-bold text-lg', item.isPayment ? 'text-success' : 'text-error']">
                      {{ item.isPayment ? '+' : '-' }}{{ formatCurrency(item.amount) }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-500">{{ item.typeLabel }}</span>
                    <span v-if="!item.isPayment" class="badge badge-sm" :class="item.isPaid ? 'badge-success' : 'badge-error'">
                      {{ item.isPaid ? 'Ödendi' : 'Ödenmedi' }}
                    </span>
                  </div>
                </div>
              </div>
              <hr :class="item.isPayment ? 'bg-success/30' : 'bg-error/30'" />
            </li>
            <li v-if="timelineItems.length === 0" class="py-12 text-center text-gray-500 italic">
              Henüz finansal işlem kaydı bulunmuyor.
            </li>
          </ul>
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
                    <div class="flex justify-center gap-2">
                      <button @click="router.push(`/payments?tenantId=${tenant.id}&debtId=${item.id}`)" class="btn btn-xs btn-primary font-bold shadow-sm" title="Nakit/Kart Ödeme">Öde</button>
                      <button @click="openAdvanceModal(item)" class="btn btn-xs btn-outline btn-info font-bold" title="Avans Kullan">Avans</button>
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
import { useRoute, useRouter } from 'vue-router'
import AdvanceAccountManager from '@/components/AdvanceAccountManager.vue'
import TenantEditModal from './TenantEditModal.vue'
import tenantsService from '@/features/tenants/services/tenantsService.js'
import paymentsService from '@/services/paymentsService'
import utilityDebtsService from '@/services/utilityDebtsService'
import { useAuthStore } from '@/stores/auth'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useNotify } from '@/composables/useNotify'
import { getPaymentMethodLabel } from '@/constants/enums'

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
const { notifySuccess } = useNotify()

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


// Tip bazlı ödeme durumu hesaplama
const getPaymentStatusByType = (item, payments) => {
  // Sayaç okumaları için otomatik ödenmiş say
  if (item.type === 'Electricity' || item.type === 'Water') {
    if (item.isPaid === true || item.type === 'Electricity' || item.type === 'Water') {
      return { status: 'paid', badge: 'badge-success', label: 'Ödendi' }
    }
  }
  
  // Utility debts için tip bazlı kontrol
  if (item.type && payments && payments.length > 0) {
    // Bu tip için yapılan ödemeleri filtrele
    const typePayments = payments.filter(payment => {
      // Backend enum yapısına göre eşleştirme:
      // PAYMENT_TYPES: 0=Aidat, 1=Elektrik, 2=Su, 3=Doğalgaz, 4=Diğer
      if (item.type === 'Electricity' && payment.type === 1) return true
      if (item.type === 'Water' && payment.type === 2) return true
      if (item.type === 'Aidat' && payment.type === 0) return true
      return false
    })
    
    // Bu tip için toplam ödenen tutar
    const totalPaidForType = typePayments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
    
    // Bu item'ın tutarını kontrol et
    const itemAmount = item.amount || item.toplamTutar || 0
    
    if (totalPaidForType >= itemAmount) {
      return { status: 'paid', badge: 'badge-success', label: 'Ödendi' }
    }
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

    // unpaid - Tip bazlı ödeme durumu kontrolü ile
    unpaidItems.value = (utilityDebtsData || [])
      .filter(d => {
        // Status kontrolü
        if (d.status === 'Paid') return false
        
        // Tutar kontrolü
        const amount = Number(d.remainingAmount ?? d.amount ?? 0)
        if (amount <= 0) return false
        
        // Tip bazlı ödeme durumu kontrolü
        const mockItem = {
          type: d.type,
          amount: amount,
          toplamTutar: amount,
          dueDate: d.dueDate
        }
        const paymentStatus = getPaymentStatusByType(mockItem, paymentsData)
        
        // Sadece gerçekten ödenmemiş olanları al
        return paymentStatus.status !== 'paid'
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
