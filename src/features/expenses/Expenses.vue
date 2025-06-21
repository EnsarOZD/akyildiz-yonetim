<template>
  <!-- Ana Sayfa Konteyneri -->
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      
      <!-- Başlık -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">Kiracı Giderleri</h1>
        <div class="flex items-center gap-4">
          <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm">
            Toplam: {{ formatCurrency(totalExpense) }}
          </div>
          <div class="bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-sm">
            Bu Ay: {{ formatCurrency(thisMonthExpense) }}
          </div>
          <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm">
            {{ expensesCount }} gider
          </div>
        </div>
      </div>

      <!-- Özet Bilgi Kartları -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
          <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 17h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Bu Ayki Gider</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ formatCurrency(thisMonthExpense) }}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
          <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full p-3">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 0v6m0-6L9 13" /></svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Toplam Gider</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ formatCurrency(totalExpense) }}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700">
          <div class="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">İşlem Sayısı (Bu Ay)</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ thisMonthCount }}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-400 transition-colors duration-300" @click="showModal = true">
           <button class="w-full h-full text-red-500 dark:text-red-400 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            <span class="font-semibold">Yeni Gider Ekle</span>
          </button>
        </div>
      </section>

      <!-- Filtreler ve Liste Alanı -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <FilterBar
            v-model:search="filters.searchTerm"
            search-placeholder="Açıklama, tip veya tutar ara..."
            v-model:period="filters.period"
            v-model:select-type="filters.type"
            :select-type-options="expenseTypeOptions"
            @clear-filters="handleClearFilters"
        />

        <!-- Gider Kart Listesi -->
        <div class="mt-6 space-y-2">
           <div v-if="filteredExpenses.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Aramanızla eşleşen gider bulunamadı.</p>
          </div>
          <div v-else>
            <div 
              v-for="e in filteredExpenses" 
              :key="e.id"
              class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b dark:border-gray-700/50"
            >
              <div class="md:col-span-5 flex items-center gap-4">
                <div class="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-2xl">
                  {{ getExpenseIcon(e.type) }}
                </div>
                <div>
                  <p class="font-bold text-gray-800 dark:text-gray-100">{{ e.description }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ e.date }}</p>
                </div>
              </div>
              <div class="md:col-span-3 text-left md:text-center text-xl font-semibold text-red-600 dark:text-red-400">
                {{ formatCurrency(e.amount) }}
              </div>
              <div class="md:col-span-2 text-left md:text-center">
                 <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                  {{ e.type }}
                </span>
              </div>
              <div class="md:col-span-2 text-right">
                <div class="dropdown dropdown-end">
                  <label tabindex="0" class="btn btn-ghost btn-sm">İşlemler</label>
                  <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-32 z-10">
                    <li><a @click="startEdit(e)">Düzenle</a></li>
                    <li><a @click="deleteExpense(e.id)" class="text-red-500">Sil</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <ExpenseModal
      :visible="showModal"
      :expense="newExpense"
      :types="expenseTypes"
      :editMode="editMode"
      @save="saveExpense"
      @close="cancelEdit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '../../firebase'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import ExpenseModal from './ExpenseModal.vue'
import FilterBar from '@/components/common/FilterBar.vue'

const expenses = ref([])
const showModal = ref(false)
const editMode = ref(false)
const selectedExpenseId = ref(null)

const filters = ref({
  searchTerm: '',
  period: '',
  type: ''
})

const expenseTypes = ['Elektrik (Genel)', 'Su (Genel)', 'Maaş', 'Vergi', 'Bakım', 'Temizlik', 'Yönetici Ücreti', 'Diğer']

const expenseTypeOptions = computed(() => {
  const options = expenseTypes.map(type => ({ value: type, label: type }))
  options.unshift({ value: '', label: 'Tüm Tipler' })
  return options
})

const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '₺0.00'
  return Number(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

const totalExpense = computed(() => filteredExpenses.value.reduce((sum, e) => sum + Number(e.amount || 0), 0))

const thisMonthExpense = computed(() => {
  const today = new Date();
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
  return expenses.value
    .filter(e => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + Number(e.amount || 0), 0)
})

const thisMonthCount = computed(() => {
    const today = new Date();
    const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
    return expenses.value.filter(p => p.date.startsWith(currentMonth)).length
})

const expensesCount = computed(() => {
  return expenses.value.length
})

const clearFilters = () => {
  filters.value = { searchTerm: '', period: '', type: '' }
}

const getExpenseIcon = (type) => {
  const iconMap = {
    'Elektrik (Genel)': '⚡️',
    'Su (Genel)': '💧',
    'Maaş': '💰',
    'Vergi': '🧾',
    'Bakım': '🛠️',
    'Temizlik': '🧹',
    'Yönetici Ücreti': '🧑‍💼',
    'Diğer': '📦'
  }
  return iconMap[type] || '❓'
}

const filteredExpenses = computed(() => {
  let filtered = expenses.value
  const searchTerm = filters.value.searchTerm.toLowerCase()

  if (filters.value.period) {
    filtered = filtered.filter(p => p.date.startsWith(filters.value.period))
  }
  
  if (filters.value.type) {
    filtered = filtered.filter(e => e.type === filters.value.type)
  }

  if (searchTerm) {
    filtered = filtered.filter(e =>
      e.description.toLowerCase().includes(searchTerm) ||
      e.type.toLowerCase().includes(searchTerm) ||
      e.amount.toString().includes(searchTerm)
    )
  }
  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
})

const today = new Date().toISOString().substr(0, 10)
const newExpense = ref({ date: today, description: '', amount: '', type: '' })

const fetchExpenses = async () => {
  expenses.value = []
  const querySnapshot = await getDocs(collection(db, 'expenses'))
  querySnapshot.forEach(docSnapshot => {
    expenses.value.push({ id: docSnapshot.id, ...docSnapshot.data() })
  })
}

const startEdit = (expense) => {
  newExpense.value = { ...expense }
  selectedExpenseId.value = expense.id
  editMode.value = true
  showModal.value = true
}

const cancelEdit = () => {
  newExpense.value = { date: today, description: '', amount: '', type: '' }
  editMode.value = false
  selectedExpenseId.value = null
  showModal.value = false
}

const deleteExpense = async (id) => {
  const confirmDelete = confirm("Bu gideri silmek istediğinize emin misiniz?")
  if (!confirmDelete) return

  try {
    await deleteDoc(doc(db, 'expenses', id))
    fetchExpenses()
  } catch (error) {
    console.error('Silme işlemi başarısız:', error)
  }
}

const saveExpense = async (expenseData) => {
  try {
    if (editMode.value && selectedExpenseId.value) {
      const ref = doc(db, 'expenses', selectedExpenseId.value)
      await updateDoc(ref, { ...expenseData })
    } else {
      await addDoc(collection(db, 'expenses'), { ...expenseData })
    }
    fetchExpenses()
    cancelEdit()
    // alert('Gider başarıyla kaydedildi.') // Kullanıcı deneyimi için alert yerine daha modern bir bildirim düşünülebilir.
  } catch (error) {
    console.error('Kayıt hatası:', error)
  }
}

const handleClearFilters = () => {
  clearFilters()
  fetchExpenses()
}

onMounted(fetchExpenses)
</script>

<style scoped>
</style>
