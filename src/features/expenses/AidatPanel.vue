<template>
  <div class="space-y-6">
    <!-- Başlık -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Yıllık Aidat Yönetimi</h2>
      <p class="text-gray-500 dark:text-gray-400 mt-2">Kiracılar için yıllık aidat tutarlarını tanımlayın ve yönetin</p>
    </div>

    <!-- Aidat Tanımlama Formu -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h3 class="card-title">Yeni Aidat Tanımlama</h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text">Yıl</span></label>
              <input type="number" v-model.number="year" class="input input-bordered w-full" min="2020" />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Şirket</span></label>
              <select v-model="selectedTenant" class="select select-bordered w-full">
                <option disabled value="">Seçiniz</option>
                <option v-for="t in tenants" :key="t.id" :value="t.id">{{ t.company }}</option>
              </select>
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Kat</span></label>
              <select v-model="selectedUnit" class="select select-bordered w-full" :disabled="!selectedTenant">
                <option disabled value="">Seçiniz</option>
                <option v-for="unit in selectedTenantUnits" :key="unit" :value="unit">{{ unit }}</option>
              </select>
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Aidat (KDV Hariç)</span></label>
              <input :value="amount" @input="formatInput" class="input input-bordered w-full" inputmode="numeric" placeholder="Örn: 2500" />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">KDV Dahil</span></label>
              <input :value="vatIncludedAmount" class="input input-bordered w-full bg-base-200" disabled />
            </div>
          </div>
          <div class="card-actions justify-end">
            <button type="button" @click="resetForm" class="btn btn-ghost">Temizle</button>
            <button class="btn btn-primary" type="submit" :disabled="!isFormValid">
              {{ selectedId ? 'Güncelle' : 'Kaydet' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Filtreleme ve Arama -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h3 class="card-title">Kayıtlı Aidat Tanımları</h3>
        
        <!-- Filtreler -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div class="form-control">
            <label class="label"><span class="label-text">Yıl Filtresi</span></label>
            <select v-model="yearFilter" class="select select-bordered w-full">
              <option value="">Tüm Yıllar</option>
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Şirket Filtresi</span></label>
            <select v-model="companyFilter" class="select select-bordered w-full">
              <option value="">Tüm Şirketler</option>
              <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.company">{{ tenant.company }}</option>
            </select>
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Kat Filtresi</span></label>
            <select v-model="unitFilter" class="select select-bordered w-full">
              <option value="">Tüm Katlar</option>
              <option v-for="unit in availableUnits" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Arama</span></label>
            <input v-model="searchTerm" class="input input-bordered w-full" placeholder="Şirket adı ile ara..." />
          </div>
        </div>

        <!-- Tablo -->
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Yıl</th>
                <th>Şirket</th>
                <th>Kat</th>
                <th>Aidat (KDV Hariç)</th>
                <th>KDV Dahil Tutar</th>
                <th class="text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredDuesList" :key="item.id" class="hover">
                <td><span class="badge badge-ghost">{{ item.year }}</span></td>
                <td class="font-medium">{{ item.company }}</td>
                <td>{{ item.unit }}</td>
                <td>{{ formatCurrency(item.amount) }}</td>
                <td class="font-bold text-success">{{ formatCurrency(item.vatIncludedAmount || item.amount * 1.2) }}</td>
                <td class="text-right">
                  <button @click="editDues(item)" class="btn btn-ghost btn-sm">Düzenle</button>
                  <button @click="deleteDues(item.id)" class="btn btn-ghost btn-sm text-error">Sil</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Boş durum -->
        <div v-if="filteredDuesList.length === 0" class="text-center py-10 text-base-content/60">
          <p>{{ duesList.length === 0 ? 'Henüz aidat tanımlanmamış.' : 'Filtreleme kriterlerine uygun kayıt bulunamadı.' }}</p>
        </div>

        <!-- Özet bilgiler -->
        <div v-if="filteredDuesList.length > 0" class="stats stats-horizontal shadow mt-4">
          <div class="stat">
            <div class="stat-title">Toplam Kayıt</div>
            <div class="stat-value text-primary">{{ filteredDuesList.length }}</div>
          </div>
          <div class="stat">
            <div class="stat-title">Toplam Tutar</div>
            <div class="stat-value text-success">{{ formatCurrency(totalFilteredAmount) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useNotify } from '@/composables/useNotify'

const { notifySuccess, notifyError } = useNotify()
const emit = defineEmits(['stats'])
const tenants = ref([])
const selectedTenant = ref('')
const selectedUnit = ref('')
const year = ref(new Date().getFullYear())
const amount = ref('')
const duesList = ref([])
const selectedId = ref(null)

// Filtreleme için
const yearFilter = ref('')
const companyFilter = ref('')
const unitFilter = ref('')
const searchTerm = ref('')

const formatCurrency = (val) => {
  if (!val || isNaN(val)) return '₺0.00'
  return Number(val).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

const parseAmount = () => {
  const raw = amount.value.replace(/\./g, '').replace(',', '.')
  return parseFloat(raw) || 0
}

const vatIncludedAmount = computed(() => {
  const parsed = parseAmount();
  if (!parsed) return '0.00 ₺'
  return (parsed * 1.2).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺'
})

const formatInput = (e) => {
  let value = e.target.value;
  value = value.replace(/[^0-9,.]/g, '');
  const parts = value.split(/[.,]/);
  if (parts.length > 2) {
    value = parts[0] + "," + parts.slice(1).join('');
  }
  amount.value = value;
}

const selectedTenantUnits = computed(() => {
  const tenant = tenants.value.find(t => t.id === selectedTenant.value)
  return tenant ? tenant.units || [] : []
})

const isFormValid = computed(() => {
  return selectedTenant.value && selectedUnit.value && parseAmount() > 0 && year.value >= 2020
})

// Filtreleme için computed'lar
const availableYears = computed(() => {
  const years = [...new Set(duesList.value.map(item => item.year))]
  return years.sort((a, b) => b - a)
})

const availableUnits = computed(() => {
  const units = [...new Set(duesList.value.map(item => item.unit))]
  return units.sort()
})

const filteredDuesList = computed(() => {
  let filtered = duesList.value

  if (yearFilter.value) {
    filtered = filtered.filter(item => item.year === yearFilter.value)
  }

  if (companyFilter.value) {
    filtered = filtered.filter(item => item.company === companyFilter.value)
  }

  if (unitFilter.value) {
    filtered = filtered.filter(item => item.unit === unitFilter.value)
  }

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.company.toLowerCase().includes(search) ||
      item.unit.toLowerCase().includes(search)
    )
  }

  return filtered.sort((a, b) => b.year - a.year || a.company.localeCompare(b.company))
})

const totalFilteredAmount = computed(() => {
  return filteredDuesList.value.reduce((sum, item) => {
    return sum + (item.vatIncludedAmount || item.amount * 1.2)
  }, 0)
})

const fetchDues = async () => {
  try {
    const response = await aidatService.getAidatDefinitions() || []
    // Farklı backend alan adlarını tek tipe indir
    duesList.value = response.map(d => {
      const amount = Number(d.amount ?? d.kdvHaric ?? 0)
      const year   = Number(d.year ?? d.periodYear ?? new Date().getFullYear())
      const unit   = d.unit ?? d.flatCode ?? d.flat?.code ?? '-'
     const tenantId = d.tenantId ?? d.tenant?.id ?? null
      const company =
       d.company ??
        d.companyName ??
        d.tenantCompanyName ??
        (tenants.value.find(t => t.id === tenantId)?.company) ??
        '-'

      return {
        id: d.id,
        year,
        tenantId,
        company,
        unit,
        amount,
        vatIncludedAmount: Number(d.vatIncludedAmount ?? d.kdvDahil ?? (amount * 1.2))
      }
    })
    // üst karta istatistik gönder (AdminDashboard @stats yakalıyor)
    emit('stats', { dues: duesList.value.length })
  } catch (error) {
    console.error('Aidat tanımları çekilirken hata oluştu:', error)
    duesList.value = []
  }
}

const resetForm = () => {
  selectedTenant.value = ''
  selectedUnit.value = ''
  amount.value = ''
  year.value = new Date().getFullYear()
  selectedId.value = null
}

const deleteDues = async (id) => {
  if (confirm('Bu aidat tanımını silmek istiyor musunuz? Bu işlem geri alınamaz.')) {
    try {
      await aidatService.deleteAidatDefinition(id)
      await fetchDues()
    } catch (error) {
      console.error("Aidat silme hatası:", error)
      notifyError("Aidat silinirken bir hata oluştu.")
    }
  }
}

const editDues = (item) => {
  selectedTenant.value = item.tenantId
  selectedUnit.value = item.unit
  amount.value = item.amount.toString().replace('.', ',')
  year.value = item.year
  selectedId.value = item.id
}

const handleSubmit = async () => {
  const rawAmount = parseAmount()
  if (!isFormValid.value) {
    notifyError('Lütfen tüm alanları eksiksiz doldurun.')
    return
  }

  const vatAmount = parseFloat((rawAmount * 1.2).toFixed(2))

  const data = {
    tenantId: selectedTenant.value,
    unit: selectedUnit.value,
    year: year.value,
    amount: rawAmount,
    vatIncludedAmount: vatAmount
  }

  try {
    if (selectedId.value) {
      await aidatService.updateAidatDefinition(selectedId.value, data)
      notifySuccess('Aidat güncellendi.')
    } else {
      const exists = duesList.value.find(
        d => d.year === year.value && d.tenantId === selectedTenant.value && d.unit === selectedUnit.value
      )
      if (exists) {
        notifyError('Bu şirketin bu katı için bu yıl zaten aidat tanımlanmış.')
        return
      }

      await aidatService.createAidatDefinition(data)
      notifySuccess('Aidat kaydı eklendi.')
    }
  } catch (error) {
    console.error("Aidat kaydetme hatası:", error)
    notifyError("Bir hata oluştu.")
  }

  resetForm()
  await fetchDues()
}

watch(selectedTenant, () => { selectedUnit.value = '' })

onMounted(async () => {
  try {
    const response = await tenantsService.getTenants() || []
    // /tenants -> companyName + flats[].code
    tenants.value = response.map(t => ({
      id: t.id,
      company: t.companyName,                    // 👈 template bu ismi bekliyor
      units: (t.flats || []).map(f => f.code).filter(Boolean) // 👈 “Kat” listesini buradan doldur
    }))
    await fetchDues()
  } catch (error) {
    console.error('Kiracılar çekilirken hata oluştu:', error)
    tenants.value = []
  }
})
</script>
