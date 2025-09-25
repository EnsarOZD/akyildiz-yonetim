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
              <div class="text-2xl font-bold" :class="totalDebt > 0 ? 'text-error' : 'text-success'">
                {{ formatCurrency(totalDebt) }}
              </div>
            </div>
            <span :class="['badge badge-lg font-semibold', tenant.isActive ? 'badge-success' : 'badge-ghost']">
              {{ tenant.isActive ? 'Aktif' : 'Pasif' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sekmeler -->
    <div class="tabs tabs-boxed">
      <a class="tab" :class="{'tab-active': activeTab === 'debts'}" @click="activeTab = 'debts'">Ödenmemiş Borçlar</a>
      <a class="tab" :class="{'tab-active': activeTab === 'payments'}" @click="activeTab = 'payments'">Yapılan Ödemeler</a>
      <a class="tab" :class="{'tab-active': activeTab === 'history'}" @click="activeTab = 'history'">Sayaç ve Aidat Kayıtları</a>
      <a class="tab" :class="{'tab-active': activeTab === 'info'}" @click="activeTab = 'info'">İş Yeri Bilgileri</a>
    </div>

    <!-- Sekme İçerikleri -->
    <div class="card bg-base-100 shadow-xl min-h-[300px]">
      <div class="card-body">
        <!-- Ödenmemiş Borçlar -->
        <div v-if="activeTab === 'debts'">
          <h3 class="text-xl font-bold mb-4">Ödenmemiş Faturalar ve Aidatlar</h3>
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>Açıklama</th>
                  <th>Son Ödeme Tarihi</th>
                  <th class="text-right">Tutar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in unpaidItems" :key="item.id" class="hover">
                  <td>{{ item.description || `Aidat (${item.period || item.unit})` }}</td>
                  <td>{{ formatDate(item.dueDate) }}</td>
                  <td class="text-right font-semibold">{{ formatCurrency(item.amount ?? item.toplamTutar) }}</td>
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
                  <th>Ödeme Tarihi</th>
                  <th>Açıklama</th>
                  <th class="text-right">Tutar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="payment in payments" :key="payment.id" class="hover">
                  <td>{{ formatDate(payment.paymentDate) }}</td>
                  <td>{{ payment.description }}</td>
                  <td class="text-right font-semibold text-success">{{ formatCurrency(payment.amount) }}</td>
                </tr>
                <tr v-if="payments.length === 0">
                  <td colspan="3" class="text-center py-8 text-base-content/60">Kayıtlı ödeme bulunmamaktadır.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sayaç ve Aidat Kayıtları -->
        <div v-else-if="activeTab === 'history'">
          <h3 class="text-xl font-bold mb-4">Geçmiş Kayıtlar</h3>
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Tür</th>
                  <th>Açıklama</th>
                  <th>İlk Endeks</th>
                  <th>Son Endeks</th>
                  <th>Tüketim</th>
                  <th class="text-right">Tutar</th>
                  <th>Durum</th>
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
                  <td>{{ item.ilkEndeks ?? '-' }}</td>
                  <td>{{ item.sonEndeks ?? '-' }}</td>
                  <td>{{ item.tuketim ?? '-' }}</td>
                  <td class="text-right font-semibold">{{ formatCurrency(item.amount) }}</td>
                  <td>
                    <span class="badge" :class="getPaymentStatusBadge(item)">
                      {{ getPaymentStatusLabel(item) }}
                    </span>
                  </td>
                </tr>
                <tr v-if="historyItems.length === 0">
                  <td colspan="8" class="text-center py-8 text-base-content/60">Kayıtlı sayaç veya aidat bulunmamaktadır.</td>
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
              <div><strong>Firma Türü:</strong> {{ getCompanyTypeLabel(tenant) }}</div>
              <div><strong>İş Türü:</strong> {{ tenant.businessType }}</div>
              <div><strong>{{ getIdentityLabel(tenant) }}:</strong> {{ getIdentityNumber(tenant) }}</div>
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

          <!-- Sözleşme -->
          <div class="card bg-base-200 p-4">
            <h4 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">📋 Sözleşme Bilgileri</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div v-if="tenant.contractStartDate"><strong>Sözleşme Başlangıcı:</strong> {{ formatDate(tenant.contractStartDate) }}</div>
              <div v-if="tenant.contractEndDate"><strong>Sözleşme Bitişi:</strong> {{ formatDate(tenant.contractEndDate) }}</div>
              <div><strong>Durum:</strong> <span :class="['badge', tenant.isActive ? 'badge-success' : 'badge-ghost']">{{ tenant.isActive ? 'Aktif' : 'Pasif' }}</span></div>
              <div><strong>Kayıt Tarihi:</strong> {{ formatDate(tenant.createdAt) }}</div>
              <div v-if="tenant.updatedAt"><strong>Son Güncelleme:</strong> {{ formatDate(tenant.updatedAt) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import tenantsService from '@/features/tenants/services/tenantsService.js'
import paymentsService from '@/services/paymentsService'
import utilityDebtsService from '@/services/utilityDebtsService'
import meterReadingsService from '@/services/meterReadingsService'
import { useAuthStore } from '@/stores/auth'
import { useErrorHandler } from '@/composables/useErrorHandler'

const route = useRoute()
const authStore = useAuthStore()
const { handleNetworkError } = useErrorHandler()

const tenantId = ref(null)
const tenant = ref(null)
const unpaidItems = ref([])
const payments = ref([])
const historyItems = ref([])
const loading = ref(true)
const activeTab = ref('debts')
const totalDebt = ref(0)

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

// Consumption amount calculation (same as Utilities.vue)
const calculateConsumptionAmount = (consumption, type) => {
  if (!consumption || consumption <= 0) return 0;
  
  // Tarife fiyatları (TL biriminde)
  const rates = {
    0: { // Electricity
      unitPrice: 2.5, // kWh başına TL
      kdvRate: 20 // %20 KDV
    },
    1: { // Water
      unitPrice: 15, // m³ başına TL
      kdvRate: 20 // %20 KDV
    }
  };
  
  const rate = rates[type] || rates[0]; // Default to electricity if type not found
  
  const baseAmount = consumption * rate.unitPrice;
  const kdvAmount = baseAmount * (rate.kdvRate / 100);
  const totalAmount = baseAmount + kdvAmount;
  
  return totalAmount;
};

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

// Backend uyumluluğu
const getCompanyTypeLabel = (t) =>
  t.companyType === 'Individual' ? 'Şahıs Firması' :
  t.companyType === 'Corporate' ? 'Tüzel Kişi' : 'Belirtilmemiş'

const getIdentityLabel = (t) =>
  t.companyType === 'Individual' ? 'TC Kimlik Numarası' :
  t.companyType === 'Corporate' ? 'Vergi Numarası' : 'Kimlik/Vergi Numarası'

const getIdentityNumber = (t) => t.identityNumber || t.taxNumber || 'Belirtilmemiş'

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
    
    const [paymentsData, utilityDebtsData, meterReadingsData] = await Promise.all([
      paymentsService.getPayments({ tenantId: tenantId.value }),
      utilityDebtsService.getUtilityDebts({ tenantId: tenantId.value }),
      // Tenant'ın flat'larına ait sayaç okumalarını çek
      tenantFlatIds.length > 0 ? 
        Promise.all(tenantFlatIds.map(flatId => meterReadingsService.getMeterReadings({ flatId })))
          .then(results => results.flat()) : 
        Promise.resolve([])
    ])

    // history - Utility debts ve meter readings'i birleştir
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
        isPaid: debt.status === 'Paid',
        ilkEndeks: '-', // Utility debts'te endeks bilgisi yok
        sonEndeks: '-',
        tuketim: '-'
      })
    })
    
    // Meter readings ekle
    ;(meterReadingsData || []).forEach(reading => {
      // Önceki okumayı bul (basit hesaplama)
      const previousReading = reading.readingValue - (reading.consumption || 0)
      
      combinedHistory.push({
        ...reading,
        type: reading.type === 0 ? 'Electricity' : reading.type === 1 ? 'Water' : 'Unknown',
        date: reading.readingDate,
        description: `${reading.type === 0 ? 'Elektrik' : reading.type === 1 ? 'Su' : 'Sayaç'} Okuması (${reading.periodYear}/${reading.periodMonth.toString().padStart(2, '0')})`,
        amount: calculateConsumptionAmount(reading.consumption, reading.type),
        toplamTutar: calculateConsumptionAmount(reading.consumption, reading.type),
        remainingAmount: 0, // Sayaç okuması borç değil
        isPaid: true, // Sayaç okuması otomatik ödenmiş sayılır
        ilkEndeks: previousReading,
        sonEndeks: reading.readingValue,
        tuketim: reading.consumption
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
    totalDebt.value = unpaidItems.value.reduce((sum, i) => sum + Number(i.amount ?? 0), 0)
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
