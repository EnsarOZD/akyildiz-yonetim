<template>
  <div class="space-y-8">
    <!-- Başlık -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100">Mal Sahibi Aidat Yönetimi</h2>
      <p class="text-gray-500 dark:text-gray-400 mt-2">Boşta olan katlar için yıllık aidat tutarlarını tanımlayın ve yönetin.</p>
    </div>

    <!-- İstatistik Kartları -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Toplam Kat -->
      <div class="stat bg-base-200 rounded-lg">
        <div class="stat-figure text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
        </div>
        <div class="stat-title">Toplam Kat</div>
        <div class="stat-value text-primary">{{ totalUnits }}</div>
      </div>
      <!-- Dolu Kat -->
      <div class="stat bg-base-200 rounded-lg">
        <div class="stat-figure text-success">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <div class="stat-title">Dolu Kat</div>
        <div class="stat-value text-success">{{ occupiedUnits }}</div>
      </div>
      <!-- Boş Kat -->
      <div class="stat bg-base-200 rounded-lg">
        <div class="stat-figure text-warning">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        </div>
        <div class="stat-title">Boş Kat</div>
        <div class="stat-value text-warning">{{ vacantUnits }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Aidat Tanımlama Formu -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Tekil Aidat Tanımlama</h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="form-control">
              <label class="label"><span class="label-text">Yıl</span></label>
              <input type="number" v-model.number="year" class="input input-bordered w-full" min="2020" />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Boş Kat Seçimi</span></label>
              <select v-model="selectedUnit" class="select select-bordered w-full">
                <option disabled value="">Seçiniz</option>
                <option v-for="unit in vacantUnitOptions" :key="unit" :value="unit">{{ unit }}</option>
              </select>
            </div>
             <div class="form-control">
              <label class="label"><span class="label-text">Aidat Tutarı (KDV Hariç)</span></label>
               <input :value="amount" @input="formatInput" class="input input-bordered w-full" inputmode="numeric" placeholder="Örn: 2500" />
            </div>
             <div class="form-control">
              <label class="label"><span class="label-text">KDV Dahil Tutar</span></label>
              <input :value="vatIncludedAmount" class="input input-bordered w-full bg-base-200" disabled />
            </div>
            <div class="card-actions justify-end">
              <button type="button" @click="resetForm" class="btn btn-ghost">Temizle</button>
              <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
                {{ selectedId ? 'Güncelle' : 'Kaydet' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Toplu Aidat Oluşturma -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Toplu Aidat Oluşturma</h2>
          <p class="text-sm text-base-content/70 mb-4">Tüm boş katlar için tek seferde aidat tanımlayın.</p>
          <form @submit.prevent="createBulkDues" class="space-y-4">
            <div class="form-control">
              <label class="label"><span class="label-text">Yıl</span></label>
              <input type="number" v-model.number="bulkYear" class="input input-bordered w-full" min="2020" />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Temel Aidat Tutarı (KDV Hariç)</span></label>
              <input :value="bulkAmount" @input="formatBulkInput" class="input input-bordered w-full" inputmode="numeric" placeholder="Örn: 2500" />
            </div>
            <div class="card-actions justify-end">
              <button type="submit" class="btn btn-success" :disabled="!bulkYear || !bulkAmount || vacantUnitOptions.length === 0">
                Tüm Boş Katlara Uygula
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Kayıtlı Aidatlar Tablosu -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-4">Kayıtlı Aidat Tanımları</h2>
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Yıl</th>
                <th>Kat</th>
                <th>Aidat (KDV Hariç)</th>
                <th>KDV Dahil Tutar</th>
                <th>Durum</th>
                <th class="text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in ownerDuesList" :key="item.id" class="hover">
                <td><span class="badge badge-ghost">{{ item.year }}</span></td>
                <td class="font-medium">{{ item.unit }}</td>
                <td>{{ formatCurrency(item.amount) }}</td>
                <td class="font-bold text-success">{{ formatCurrency(item.vatIncludedAmount) }}</td>
                <td>
                  <span class="badge" :class="item.isActive ? 'badge-success' : 'badge-error'">
                    {{ item.isActive ? 'Aktif' : 'Pasif' }}
                  </span>
                </td>
                <td class="text-right">
                  <button @click="editDues(item)" class="btn btn-ghost btn-sm">Düzenle</button>
                  <button @click="deleteDues(item.id)" class="btn btn-ghost btn-sm text-error">Sil</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="ownerDuesList.length === 0" class="text-center py-10 text-base-content/60">
          <p>Henüz mal sahibi aidatı tanımlanmamış.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ownerDuesService from '@/services/ownerDuesService'
import tenantsService from '@/services/tenantsService'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { UNIT_OPTIONS } from '../../constants/units'

const { handleNetworkError, handleValidationError, showSuccess } = useErrorHandler()

const year = ref(new Date().getFullYear())
const selectedUnit = ref('')
const amount = ref('')
const ownerDuesList = ref([])
const selectedId = ref(null)

// Toplu oluşturma için
const bulkYear = ref(new Date().getFullYear())
const bulkAmount = ref('')

// Kiracılar ve katlar
const tenants = ref([])
const occupiedUnitsSet = ref(new Set())

const formatCurrency = (val) => {
  if (!val || isNaN(val)) return '₺0,00'
  return Number(val).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

const parseAmount = () => {
  const raw = amount.value.replace(/\./g, '').replace(',', '.')
  return parseFloat(raw) || 0
}

const parseBulkAmount = () => {
  const raw = bulkAmount.value.replace(/\./g, '').replace(',', '.')
  return parseFloat(raw) || 0
}

const vatIncludedAmount = computed(() => {
  const parsed = parseAmount();
  if (!parsed) return '0,00 ₺'
  return (parsed * 1.2).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺'
})

const formatInput = (e) => {
  let value = e.target.value;
  // Sadece rakam ve bir virgül/nokta kalmasını sağla
  value = value.replace(/[^0-9,.]/g, '');
  const parts = value.split(/[.,]/);
  if (parts.length > 2) {
    value = parts[0] + "," + parts.slice(1).join('');
  }
  amount.value = value;
}

const formatBulkInput = (e) => {
  let value = e.target.value;
  value = value.replace(/[^0-9,.]/g, '');
  const parts = value.split(/[.,]/);
  if (parts.length > 2) {
    value = parts[0] + "," + parts.slice(1).join('');
  }
  bulkAmount.value = value;
}

const isFormValid = computed(() => {
  return year.value >= 2020 && selectedUnit.value && parseAmount() > 0
})

// İstatistikler
const totalUnits = computed(() => UNIT_OPTIONS.length)
const occupiedUnits = computed(() => occupiedUnitsSet.value.size)
const vacantUnits = computed(() => totalUnits.value - occupiedUnits.value)

const vacantUnitOptions = computed(() => {
  const unitsWithDuesForYear = new Set(
    ownerDuesList.value
      .filter(due => due.year === year.value && due.id !== selectedId.value)
      .map(due => due.unit)
  );

  return UNIT_OPTIONS
    .filter(unit => !occupiedUnitsSet.value.has(unit) || unit === selectedUnit.value)
    .filter(unit => !unitsWithDuesForYear.has(unit));
});

const fetchTenants = async () => {
  try {
    tenants.value = await tenantsService.getTenants()
    
    occupiedUnitsSet.value.clear()
    tenants.value.forEach(tenant => {
      if (tenant.isActive && tenant.flats) {
        tenant.flats.forEach(flat => {
          const code = typeof flat === 'object' ? flat.code : flat;
          occupiedUnitsSet.value.add(code)
        })
      }
    })
  } catch (error) {
    handleNetworkError(error)
  }
}

const fetchOwnerDues = async () => {
  try {
    const data = await ownerDuesService.getOwnerDues()
    ownerDuesList.value = data.sort((a,b) => b.year - a.year || a.unit.localeCompare(b.unit));
  } catch (error) {
    handleNetworkError(error)
  }
}

const deleteDues = async (id) => {
  if (confirm('Bu aidat tanımını silmek istiyor musunuz? Bu işlem, gelecekte bu tanıma göre aidat oluşturulmasını engeller.')) {
    try {
      await ownerDuesService.deleteOwnerDue(id)
      showSuccess('Aidat tanımı silindi.')
      await fetchOwnerDues()
    } catch (error) {
      handleValidationError(error)
    }
  }
}

const editDues = (item) => {
  selectedUnit.value = item.unit
  amount.value = item.amount.toString().replace('.', ',');
  year.value = item.year
  selectedId.value = item.id
}

const resetForm = () => {
  selectedUnit.value = ''
  amount.value = ''
  year.value = new Date().getFullYear();
  selectedId.value = null
}

const handleSubmit = async () => {
  const rawAmount = parseAmount()
  if (!isFormValid.value) {
    alert('Lütfen tüm alanları eksiksiz doldurun.')
    return
  }

  const vatAmount = parseFloat((rawAmount * 1.2).toFixed(2))

  const data = {
    unit: selectedUnit.value,
    year: year.value,
    amount: rawAmount,
    vatIncludedAmount: vatAmount,
    ownerId: 'MAL_SAHIBI',
    isActive: true,
  }

  try {
    if (selectedId.value) {
      await ownerDuesService.updateOwnerDue(selectedId.value, data)
      showSuccess('Aidat güncellendi.')
    } else {
      await ownerDuesService.createOwnerDue(data)
      showSuccess('Aidat kaydı eklendi.')
    }
    resetForm()
    await fetchOwnerDues()
  } catch(error) {
    handleValidationError(error)
  }
}

const createBulkDues = async () => {
  const rawAmount = parseBulkAmount()
  if (!bulkYear.value || rawAmount <= 0) {
    alert('Lütfen yıl ve tutar bilgilerini eksiksiz doldurun.')
    return
  }
  
  const unitsWithDuesForBulkYear = new Set(
    ownerDuesList.value
      .filter(due => due.year === bulkYear.value)
      .map(due => due.unit)
  );

  const targetUnits = UNIT_OPTIONS
    .filter(unit => !occupiedUnitsSet.value.has(unit))
    .filter(unit => !unitsWithDuesForBulkYear.has(unit));

  if (targetUnits.length === 0) {
    alert('Aidat tanımlanacak uygun (boş ve bu yıl için aidatı olmayan) kat bulunmamaktadır.');
    return;
  }

  if (confirm(`${bulkYear.value} yılı için ${targetUnits.length} boş kata ${formatCurrency(rawAmount)} (KDV hariç) aidat oluşturmak istiyor musunuz?`)) {
    const vatAmount = parseFloat((rawAmount * 1.2).toFixed(2))
    
    try {
      // Backend toplu işlem desteklemediği için (fallback modunda zaten) döngü ile asenkron yapıyoruz
      // Not: Fallback modunda console log yazacak
      for (const unit of targetUnits) {
        await ownerDuesService.createOwnerDue({
          unit: unit,
          year: bulkYear.value,
          amount: rawAmount,
          vatIncludedAmount: vatAmount,
          ownerId: 'MAL_SAHIBI',
          isActive: true
        });
      }
      
      showSuccess(`${targetUnits.length} adet yeni boş kat aidat kaydı oluşturuldu.`)
      await fetchOwnerDues()
      bulkAmount.value = ''
    } catch(error) {
      handleValidationError(error)
    }
  }
}

onMounted(async () => {
  await Promise.all([
    fetchTenants(),
    fetchOwnerDues()
  ])
})
</script> 