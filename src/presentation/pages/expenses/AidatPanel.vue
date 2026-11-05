<template>
  <div class="space-y-6">
    <!-- Başlık -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-800">Yıllık Aidat Yönetimi</h2>
      <p class="text-gray-500 mt-2">Kiracılar ve boş üniteler için mal sahiplerine yazılacak yıllık aidat tutarlarını tanımlayın</p>
    </div>

    <!-- Aidat Tanımlama Formu -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h3 class="card-title">Yeni Aidat Tanımlama</h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="join" role="radiogroup" aria-label="Borçlu türü">
            <button type="button" class="btn btn-sm join-item" :class="debtorType === 'Tenant' ? 'btn-primary' : 'btn-ghost'"
                    :aria-pressed="debtorType === 'Tenant'" :disabled="!!selectedId" @click="debtorType = 'Tenant'">Kiracı</button>
            <button type="button" class="btn btn-sm join-item" :class="debtorType === 'Owner' ? 'btn-primary' : 'btn-ghost'"
                    :aria-pressed="debtorType === 'Owner'" :disabled="!!selectedId" @click="debtorType = 'Owner'">Mal sahibi (boş ünite)</button>
          </div>
          <p v-if="debtorType === 'Owner'" class="text-sm text-base-content/70">
            Malik tanımı yalnızca ünitede kiracı yokken kullanılır; ünite kiracılıysa aidat kiracıya yazılır.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text">Yıl</span></label>
              <input type="number" v-model.number="year" class="input input-bordered w-full" min="2020" />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">{{ debtorType === 'Owner' ? 'Mal Sahibi' : 'Şirket' }}</span></label>
              <select v-model="selectedDebtor" class="select select-bordered w-full">
                <option disabled value="">Seçiniz</option>
                <option v-for="p in debtorOptions" :key="p.id" :value="p.id">{{ p.company }}</option>
              </select>
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Ünite</span></label>
              <select v-model="selectedFlatId" class="select select-bordered w-full" :disabled="!selectedDebtor">
                <option disabled value="">Seçiniz</option>
                <option v-for="f in selectedDebtorUnits" :key="f.id" :value="f.id">{{ f.code }}</option>
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
            <label class="label"><span class="label-text">Borçlu Filtresi</span></label>
            <select v-model="companyFilter" class="select select-bordered w-full">
              <option value="">Tümü</option>
              <option v-for="name in availableCompanies" :key="name" :value="name">{{ name }}</option>
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
            <input v-model="searchTerm" class="input input-bordered w-full" placeholder="Şirket / malik adı ile ara..." />
          </div>
        </div>

        <!-- Tablo -->
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th scope="col">Yıl</th>
                <th scope="col">Borçlu</th>
                <th scope="col">Kat</th>
                <th scope="col">Aidat (KDV Hariç)</th>
                <th scope="col">KDV Dahil Tutar</th>
                <th scope="col" class="text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredDuesList" :key="item.id" class="hover">
                <td><span class="badge badge-ghost">{{ item.year }}</span></td>
                <td class="font-medium">
                  {{ item.company }}
                  <span v-if="item.debtorType === 'Owner'" class="badge badge-info badge-sm ml-1" title="Ünite boşken mal sahibine yazılır">Malik</span>
                </td>
                <td>
                  {{ item.unit }}
                  <span v-if="!item.flatId" class="badge badge-warning badge-sm ml-1">Ünite seçilmemiş</span>
                </td>
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
    <ConfirmModal
      :isOpen="showDeleteModal"
      title="Aidat Tanımı Silinecek"
      message="Bu aidat tanımını silmek istiyor musunuz? Bu işlem geri alınamaz."
      confirmLabel="Evet, Sil"
      confirmClass="btn-error"
      :loading="deleting"
      @confirm="handleConfirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useNotify } from '@/application/composables/useNotify'
import aidatService from '@/infrastructure/services/aidatService'
import tenantsService from '@/infrastructure/services/tenantsService'
import ownersService from '@/infrastructure/services/ownersService'
import ConfirmModal from '@/presentation/components/common/ConfirmModal.vue'

const { notifySuccess, notifyError } = useNotify()
const emit = defineEmits(['stats'])
const tenants = ref([])
const owners = ref([])
// 'Tenant': kiracı tanımı · 'Owner': ünite boşken mal sahibine yazılan tanım
const debtorType = ref('Tenant')
const selectedDebtor = ref('')
const selectedFlatId = ref('')
const year = ref(new Date().getFullYear())
const amount = ref('')
const duesList = ref([])
const selectedId = ref(null)

// Filtreleme için
const yearFilter = ref('')
const companyFilter = ref('')
const unitFilter = ref('')
const searchTerm = ref('')

const showDeleteModal = ref(false)
const duesToDeleteId = ref(null)
const deleting = ref(false)

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

const debtorOptions = computed(() => debtorType.value === 'Owner' ? owners.value : tenants.value)

const selectedDebtorUnits = computed(() => {
  const debtor = debtorOptions.value.find(p => p.id === selectedDebtor.value)
  return debtor ? debtor.flats || [] : []
})

const isFormValid = computed(() => {
  return selectedDebtor.value && selectedFlatId.value && parseAmount() > 0 && year.value >= 2020
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

const availableCompanies = computed(() => {
  const names = [...new Set(duesList.value.map(item => item.company))]
  return names.sort((a, b) => a.localeCompare(b, 'tr'))
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
    const search = searchTerm.value.toLocaleLowerCase('tr')
    filtered = filtered.filter(item =>
      item.company.toLocaleLowerCase('tr').includes(search) ||
      item.unit.toLocaleLowerCase('tr').includes(search)
    )
  }

  return [...filtered].sort((a, b) => b.year - a.year || a.company.localeCompare(b.company, 'tr'))
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
      const ownerId = d.ownerId ?? null
      const isOwner = d.debtorType === 'Owner' || !!ownerId
      const tenantId = isOwner ? null : (d.tenantId ?? d.tenant?.id ?? null)
      const company = isOwner
        ? (d.ownerName || owners.value.find(o => o.id === ownerId)?.company || '-')
        : (d.company ??
           d.companyName ??
           d.tenantName ??
           (tenants.value.find(t => t.id === tenantId)?.company) ??
           '-')

      return {
        id: d.id,
        flatId: d.flatId ?? null,
        year,
        debtorType: isOwner ? 'Owner' : 'Tenant',
        debtorId: isOwner ? ownerId : tenantId,
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
  selectedDebtor.value = ''
  selectedFlatId.value = ''
  amount.value = ''
  year.value = new Date().getFullYear()
  selectedId.value = null
}

const deleteDues = (id) => {
  duesToDeleteId.value = id
  showDeleteModal.value = true
}

const handleConfirmDelete = async () => {
  if (!duesToDeleteId.value) return
  deleting.value = true
  try {
    await aidatService.deleteAidatDefinition(duesToDeleteId.value)
    notifySuccess('Aidat tanımı silindi.')
    await fetchDues()
    showDeleteModal.value = false
  } catch (error) {
    console.error("Aidat silme hatası:", error)
    notifyError("Aidat silinirken bir hata oluştu.")
  } finally {
    deleting.value = false
    duesToDeleteId.value = null
  }
}

const editDues = async (item) => {
  selectedId.value = item.id
  debtorType.value = item.debtorType
  await nextTick()
  selectedDebtor.value = item.debtorId
  // borçlu watcher'ı ünite seçimini temizler; önce onun çalışmasını bekle
  await nextTick()
  // Eski kayıtlarda flatId yoksa borçlunun ünitelerinden koda göre eşleştir
  selectedFlatId.value = item.flatId || (debtorOptions.value.find(p => p.id === item.debtorId)?.flats || []).find(f => f.code === item.unit)?.id || ''
  amount.value = item.amount.toString().replace('.', ',')
  year.value = item.year
}

const handleSubmit = async () => {
  const rawAmount = parseAmount()
  if (!isFormValid.value) {
    notifyError('Lütfen tüm alanları eksiksiz doldurun.')
    return
  }

  const vatAmount = parseFloat((rawAmount * 1.2).toFixed(2))
  const isOwner = debtorType.value === 'Owner'

  const flat = selectedDebtorUnits.value.find(f => f.id === selectedFlatId.value)
  const data = {
    tenantId: isOwner ? null : selectedDebtor.value,
    ownerId: isOwner ? selectedDebtor.value : null,
    flatId: selectedFlatId.value,
    unit: flat?.code || '',
    year: year.value,
    amount: rawAmount,
    vatIncludedAmount: vatAmount
  }

  try {
    if (selectedId.value) {
      await aidatService.updateAidatDefinition(selectedId.value, { ...data, isActive: true })
      notifySuccess('Aidat güncellendi.')
    } else {
      const exists = duesList.value.find(
        d => d.year === year.value && d.debtorType === debtorType.value && d.debtorId === selectedDebtor.value &&
          (d.flatId ? d.flatId === selectedFlatId.value : d.unit === flat?.code)
      )
      if (exists) {
        notifyError('Bu ünite için bu yıl zaten aidat tanımlanmış.')
        return
      }

      await aidatService.createAidatDefinition(data)
      notifySuccess('Aidat kaydı eklendi.')
    }
  } catch (error) {
    console.error("Aidat kaydetme hatası:", error)
    notifyError(error?.message || "Bir hata oluştu.")
    return
  }

  resetForm()
  await fetchDues()
}

watch(debtorType, () => { if (!selectedId.value) selectedDebtor.value = '' })
watch(selectedDebtor, () => { selectedFlatId.value = '' })

const toFlats = (flats) => (flats || []).filter(f => f.id && f.code).map(f => ({ id: f.id, code: f.code }))

onMounted(async () => {
  const [tenantRes, ownerRes] = await Promise.allSettled([
    tenantsService.getTenants(),
    ownersService.getOwners()
  ])
  if (tenantRes.status === 'fulfilled') {
    // /tenants -> companyName + flats[].code
    tenants.value = (tenantRes.value || []).map(t => ({
      id: t.id,
      company: t.companyName,
      flats: toFlats(t.flats)
    }))
  } else {
    console.error('Kiracılar çekilirken hata oluştu:', tenantRes.reason)
  }
  if (ownerRes.status === 'fulfilled') {
    owners.value = (ownerRes.value || [])
      .filter(o => o.isActive !== false)
      .map(o => ({
        id: o.id,
        company: `${o.firstName || ''} ${o.lastName || ''}`.trim(),
        flats: toFlats(o.flats)
      }))
  } else {
    console.error('Mal sahipleri çekilirken hata oluştu:', ownerRes.reason)
  }
  await fetchDues()
})
</script>
