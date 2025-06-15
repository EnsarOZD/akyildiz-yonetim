<template>
  <section class="p-4 space-y-6 max-w-5xl mx-auto">

<!-- Gider Ekleme Kartı -->
<div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
  <h2 class="text-center text-lg font-semibold text-base-content mb-4">Gider Ekle</h2>
  <button class="btn btn-primary" @click="showModal = true">➕ Gider Ekle</button>
</div>


    <!-- Gider Listesi -->
    <div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
      <h3 class="text-center text-lg font-semibold text-base-content mb-4">Gider Listesi</h3>
     <div class="card bg-base-100 border border-base-300 p-4 rounded-xl mb-4">
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

    <!-- Gider Tipi -->
    <div>
      <label class="label font-semibold">Gider Tipi</label>
      <select v-model="filterType" class="select select-bordered w-full">
        <option value="">Tüm Tipler</option>
        <option v-for="type in expenseTypes" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>

    <!-- Başlangıç Tarihi -->
    <div>
      <label class="label font-semibold">Başlangıç Tarihi</label>
      <input type="date" v-model="filterStartDate" class="input input-bordered w-full" />
    </div>

    <!-- Bitiş Tarihi -->
    <div>
      <label class="label font-semibold">Bitiş Tarihi</label>
      <input type="date" v-model="filterEndDate" class="input input-bordered w-full" />
    </div>

    <!-- Açıklama Arama -->
    <div>
      <label class="label font-semibold">Açıklama</label>
      <input type="text" v-model="searchTerm" placeholder="Örn: elektrik, maaş" class="input input-bordered w-full" />
    </div>
  </div>
</div>
<div class="flex justify-end mt-2">
  <button class="btn btn-sm btn-outline" @click="clearFilters">Filtreleri Temizle</button>
</div>
      <div class="overflow-x-auto rounded-lg border border-base-300">
        <table class="table table-zebra w-full text-sm">
          <thead>
  <tr>
    <th class="text-center">Tarih</th>
    <th class="text-center">Açıklama</th>
    <th class="text-center">Tutar</th>
    <th class="text-center">Tip</th>
    <th class="text-center">İşlem</th>
  </tr>
</thead>
<tbody>
  <tr v-for="(e, index) in filteredExpenses" :key="index">
    <td class="text-center">{{ e.date }}</td>
    <td class="text-center">{{ e.description }}</td>
    <td class="text-center text-red-600 font-medium">{{ formatCurrency(e.amount) }}</td>
    <td class="text-center">{{ e.type }}</td>
    <td class="text-center">
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-xs btn-outline">İşlemler</label>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
          <li><a @click.prevent="startEdit(e)">Düzenle</a></li>
          <li><a @click.prevent="deleteExpense(e.id)">Sil</a></li>
        </ul>
      </div>
    </td>
  </tr>
</tbody>
        </table>
        <div class="mt-4 text-right font-semibold text-lg">
  Toplam Gider: <span class="text-red-600">{{ formatCurrency(totalAmount) }}</span>
</div>
      </div>
    </div>

    <ExpenseModal
  :visible="showModal"
  :expense="newExpense"
  :types="expenseTypes"
  @save="saveExpense"
  @close="showModal = false"
/>

  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '../firebase'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import ExpenseModal from './ExpenseModal.vue'

const filterType = ref('')
const filterStartDate = ref('')
const filterEndDate = ref('')
const searchTerm = ref('')

const filteredExpenses = computed(() => {
  return expenses.value.filter(e => {
    const matchesType = !filterType.value || e.type === filterType.value
    const matchesStart = !filterStartDate.value || e.date >= filterStartDate.value
    const matchesEnd = !filterEndDate.value || e.date <= filterEndDate.value
    const matchesSearch = !searchTerm.value || e.description.toLowerCase().includes(searchTerm.value.toLowerCase())
    return matchesType && matchesStart && matchesEnd && matchesSearch
  })
})



const expenseTypes = [
  'Elektrik (Genel)',
  'Su (Genel)',
  'Maaş',
  'Vergi',
  'Bakım',
  'Temizlik',
  'Yönetici Ücreti',
  'Diğer'
]
const today = new Date().toISOString().substr(0, 10)
const showModal = ref(false)

const newExpense = ref({
  date: today,
  description: '',
  amount: '',
  type: ''
})
const editMode = ref(false)
const selectedExpenseId = ref(null)
const expenses = ref([])

const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '-'
  return Number(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

const totalAmount = computed(() => {
  return filteredExpenses.value.reduce((sum, e) => sum + Number(e.amount || 0), 0)
})

function clearFilters() {
  filterType.value = ''
  filterStartDate.value = ''
  filterEndDate.value = ''
  searchTerm.value = ''
}

const startEdit = (expense) => {
  newExpense.value = {
    date: expense.date,
    description: expense.description,
    amount: expense.amount,    
    type: expense.type
  }
  selectedExpenseId.value = expense.id
  editMode.value = true
}

const cancelEdit = () => {
  newExpense.value = { date: today, description: '', amount: '', type: '' }
  editMode.value = false
  selectedExpenseId.value = null
}

const deleteExpense = async (id) => {
  const confirmDelete = confirm("Bu gideri silmek istediğinize emin misiniz?")
  if (!confirmDelete) return

  try {
    await deleteDoc(doc(db, 'expenses', id))
    expenses.value = expenses.value.filter(e => e.id !== id)
  } catch (error) {
    console.error('Silme işlemi başarısız:', error)
  }
}

const saveExpense = async () => {
  try {
    if (editMode.value && selectedExpenseId.value) {
      const ref = doc(db, 'expenses', selectedExpenseId.value)
      await updateDoc(ref, { ...newExpense.value })
    } else {
      await addDoc(collection(db, 'expenses'), { ...newExpense.value })
    }

    cancelEdit()
    await fetchExpenses()
    alert('Gider başarıyla kaydedildi.')
  } catch (error) {
    console.error('Kayıt hatası:', error)
  }
}

const fetchExpenses = async () => {
  expenses.value = []
  const querySnapshot = await getDocs(collection(db, 'expenses'))
  querySnapshot.forEach(docSnapshot => {
    expenses.value.push({ id: docSnapshot.id, ...docSnapshot.data() })
  })
}

onMounted(() => {
  fetchExpenses()  
})
</script>

<style scoped>
</style>
