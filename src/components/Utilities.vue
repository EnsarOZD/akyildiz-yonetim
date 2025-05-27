<template>
  <section class="p-4 space-y-6 max-w-5xl mx-auto">

    <!-- Sayaç Ekle/Güncelle -->
    <div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
      <h2 class="text-center text-lg font-semibold mb-4">Sayaç {{ editMode ? 'Güncelle' : 'Ekle' }}</h2>
      <form @submit.prevent="saveUtility" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input v-model="newUtility.date" type="date" class="input input-bordered w-full" required />
        <input v-model="newUtility.type" placeholder="Tür (Elektrik, Su, Doğalgaz)" class="input input-bordered w-full" required />
        <input v-model="newUtility.value" type="number" placeholder="Tüketim Miktarı" class="input input-bordered w-full" required />
        <div class="md:col-span-3 flex justify-end gap-2">
          <button type="submit" class="btn btn-success">{{ editMode ? 'Kaydet' : 'Ekle' }}</button>
          <button v-if="editMode" type="button" @click="cancelEdit" class="btn btn-outline btn-warning">Vazgeç</button>
        </div>
      </form>
    </div>

    <!-- Sayaç Listesi -->
    <div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
      <h3 class="text-center text-lg font-semibold mb-4">Sayaç Kayıtları</h3>
      <div class="overflow-x-auto">
        <table class="table table-zebra w-full text-sm">
          <thead>
            <tr>
              <th class="text-center">Tarih</th>
              <th class="text-center">Tür</th>
              <th class="text-center">Tüketim</th>
              <th class="text-center">İşlem</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(u, index) in utilities" :key="index">
              <td class="text-center">{{ u.date }}</td>
              <td class="text-center">{{ u.type }}</td>
              <td class="text-center">{{ u.value }}</td>
              <td class="text-center">
                <div class="flex justify-center gap-2">
                  <button @click="startEdit(u)" class="btn btn-xs btn-info">Düzenle</button>
                  <button @click="deleteUtility(u.id)" class="btn btn-xs btn-error">Sil</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'

const utilities = ref([])
const newUtility = ref({ date: '', type: '', value: '' })
const editMode = ref(false)
const selectedUtilityId = ref(null)

const fetchUtilities = async () => {
  utilities.value = []
  const querySnapshot = await getDocs(collection(db, 'utilities'))
  querySnapshot.forEach(docSnapshot => {
    utilities.value.push({
      id: docSnapshot.id,
      ...docSnapshot.data()
    })
  })
}

const saveUtility = async () => {
  if (editMode.value && selectedUtilityId.value) {
    const utilityRef = doc(db, 'utilities', selectedUtilityId.value)
    await updateDoc(utilityRef, {
      date: newUtility.value.date,
      type: newUtility.value.type,
      value: newUtility.value.value
    })
  } else {
    await addDoc(collection(db, 'utilities'), {
      date: newUtility.value.date,
      type: newUtility.value.type,
      value: newUtility.value.value
    })
  }

  newUtility.value = { date: '', type: '', value: '' }
  editMode.value = false
  selectedUtilityId.value = null
  await fetchUtilities()
}

const deleteUtility = async (id) => {
  await deleteDoc(doc(db, 'utilities', id))
  utilities.value = utilities.value.filter(u => u.id !== id)
}

const startEdit = (utility) => {
  newUtility.value = {
    date: utility.date,
    type: utility.type,
    value: utility.value
  }
  selectedUtilityId.value = utility.id
  editMode.value = true
}

const cancelEdit = () => {
  newUtility.value = { date: '', type: '', value: '' }
  editMode.value = false
  selectedUtilityId.value = null
}

onMounted(fetchUtilities)
</script>
