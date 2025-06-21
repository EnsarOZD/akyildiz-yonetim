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
                <span class="text-2xl">{{ tenant.company ? tenant.company.charAt(0).toUpperCase() : 'K' }}</span>
              </div>
            </div>
            <div>
              <h1 class="text-3xl font-bold">{{ tenant.company }}</h1>
              <p class="text-base-content/70">{{ tenant.firstName }} {{ tenant.lastName }}</p>
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
      <a class="tab" :class="{'tab-active': activeTab === 'info'}" @click="activeTab = 'info'">Kiracı Bilgileri</a>
    </div>

    <!-- Sekme İçerikleri -->
    <div class="card bg-base-100 shadow-xl min-h-[300px]">
      <div class="card-body">
        <!-- Ödenmemiş Borçlar Sekmesi -->
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
                  <td class="text-right font-semibold">{{ formatCurrency(item.amount || item.toplamTutar) }}</td>
                </tr>
                <tr v-if="unpaidItems.length === 0">
                  <td colspan="3" class="text-center py-8 text-base-content/60">Ödenmemiş borç bulunmamaktadır.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Yapılan Ödemeler Sekmesi -->
        <div v-if="activeTab === 'payments'">
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

        <!-- Sayaç ve Aidat Kayıtları Sekmesi -->
        <div v-if="activeTab === 'history'">
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
                    <span class="badge" :class="item.type === 'water' ? 'badge-info' : item.type === 'electricity' ? 'badge-warning' : 'badge-neutral'">
                      {{ item.type === 'water' ? 'Su' : item.type === 'electricity' ? 'Elektrik' : 'Aidat' }}
                    </span>
                  </td>
                  <td>{{ item.description }}</td>
                  <td>{{ item.ilkEndeks || '-' }}</td>
                  <td>{{ item.sonEndeks || '-' }}</td>
                  <td>{{ item.tuketim || '-' }}</td>
                  <td class="text-right font-semibold">{{ formatCurrency(item.amount) }}</td>
                  <td>
                    <span class="badge" :class="item.isPaid ? 'badge-success' : 'badge-error'">
                      {{ item.isPaid ? 'Ödendi' : 'Ödenmedi' }}
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

        <!-- Kiracı Bilgileri Sekmesi -->
        <div v-if="activeTab === 'info'" class="space-y-4">
          <h3 class="text-xl font-bold">Detaylı Bilgiler</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4">
            <div><strong>Yetkili:</strong> {{ tenant.firstName }} {{ tenant.lastName }}</div>
            <div><strong>Daireler:</strong> {{ tenant.units.join(', ') }}</div>
            <div><strong>Telefon:</strong> <a :href="`tel:${tenant.phone}`" class="link link-primary">{{ tenant.phone }}</a></div>
            <div><strong>E-posta:</strong> <a :href="`mailto:${tenant.email}`" class="link link-primary">{{ tenant.email }}</a></div>
            <div><strong>Sözleşme Başlangıcı:</strong> {{ formatDate(tenant.contractStartDate) }}</div>
            <div v-if="tenant.contractEndDate"><strong>Sözleşme Bitişi:</strong> {{ formatDate(tenant.contractEndDate) }}</div>
            <div class="md:col-span-2"><strong>Notlar:</strong> {{ tenant.notes || '-' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const authStore = useAuthStore();

const tenantId = ref(null);
const tenant = ref(null);
const unpaidItems = ref([]);
const payments = ref([]);
const historyItems = ref([]);
const loading = ref(true);
const activeTab = ref('debts');

const safeToDate = (timestamp) => {
    if (!timestamp) return null;
    if (timestamp.toDate) return timestamp.toDate();
    const d = new Date(timestamp);
    return isNaN(d.getTime()) ? null : d;
};

const processDoc = (doc) => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        // Normalize all possible date fields upon creation
        date: safeToDate(data.date || data.createdAt),
        createdAt: safeToDate(data.createdAt),
        dueDate: safeToDate(data.dueDate),
        paymentDate: safeToDate(data.paymentDate)
    };
};

const fetchTenantDetails = async () => {
  if (!tenantId.value) {
    loading.value = false;
    console.log("Tenant ID not available yet. Skipping fetch.");
    return;
  }
  
  loading.value = true;
  console.log(`Fetching all records for tenant ID: ${tenantId.value}`);
  
  try {
    // 1. Fetch tenant document
    const tenantDoc = await getDoc(doc(db, 'tenants', tenantId.value));
    if (!tenantDoc.exists()) {
      console.error("Tenant document not found!");
      tenant.value = null;
      loading.value = false;
      return;
    }
    tenant.value = { id: tenantDoc.id, ...tenantDoc.data() };

    // 2. Fetch all related collections with simple queries
    const aidatQuery = query(collection(db, 'aidatRecords'), where('tenantId', '==', tenantId.value));
    const paymentsQuery = query(collection(db, 'payments'), where('tenantId', '==', tenantId.value));
    const readingsQuery = query(collection(db, 'readings'), where('tenantId', '==', tenantId.value));

    const [aidatSnap, paymentsSnap, readingsSnap] = await Promise.all([
      getDocs(aidatQuery),
      getDocs(paymentsQuery),
      getDocs(readingsQuery)
    ]);
    
    console.log(`Query results: aidat: ${aidatSnap.size}, payments: ${paymentsSnap.size}, readings: ${readingsSnap.size}`);

    // 3. Process data on the client side
    
    const allReadings = readingsSnap.docs.map(processDoc);
    const allAidat = aidatSnap.docs.map(processDoc);
    const allPayments = paymentsSnap.docs.map(processDoc);

    // --- History Items Processing ---
    const combinedHistory = [];
    allReadings.forEach(r => combinedHistory.push({
        ...r,
        type: r.type,
        description: `${r.type === 'water' ? 'Su' : 'Elektrik'} Faturası (${r.period || 'Dönem Belirtilmemiş'})`,
        amount: r.toplamTutar || 0
    }));
    allAidat.forEach(a => combinedHistory.push({
        ...a,
        type: 'aidat',
        description: `Aidat (${a.period || a.unit || 'Dönem Belirtilmemiş'})`,
        amount: a.toplamTutar || 0,
        ilkEndeks: null, sonEndeks: null, tuketim: null
    }));
    
    historyItems.value = combinedHistory.sort((a, b) => (b.date || 0) - (a.date || 0));

    // --- Unpaid Items Processing ---
    unpaidItems.value = combinedHistory
        .filter(item => item.isPaid === false)
        .sort((a, b) => (a.dueDate || 0) - (b.dueDate || 0));
    
    // --- Payments Processing ---
    payments.value = allPayments.sort((a, b) => (b.paymentDate || 0) - (a.paymentDate || 0));

  } catch (error) {
    console.error("Error fetching tenant details:", error);
  } finally {
    loading.value = false;
  }
};

const totalDebt = computed(() => {
  return unpaidItems.value.reduce((sum, item) => sum + Number(item.amount || 0), 0);
});

const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '₺0,00';
  return Number(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
};

const formatDate = (timestamp) => {
  if (!timestamp) return '-';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Watch for auth changes and route params to set tenantId
watch(
  () => [authStore.user, route.params.id],
  ([user, routeId]) => {
    if (route.name === 'Profile') {
      if (user?.role === 'tenant' && user.tenantId) {
        tenantId.value = user.tenantId;
      }
    } else {
      tenantId.value = routeId;
    }
  },
  { immediate: true, deep: true }
);

// Watch tenantId to trigger data fetching
watch(tenantId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchTenantDetails();
  }
}, { immediate: true });
</script>
