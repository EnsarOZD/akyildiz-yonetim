<template>
  <div class="max-w-2xl space-y-5">
    <div>
      <h3 class="text-base font-bold text-slate-800">Bankalar</h3>
      <p class="text-sm text-slate-500 mt-1">
        Ödeme girerken seçilebilen bankalar. Sıra, ödeme formundaki sıradır.
        Bir bankayı silmek veya adını değiştirmek geçmiş ödemeleri etkilemez.
      </p>
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <span class="loading loading-spinner loading-md text-brand-500"></span>
    </div>

    <template v-else>
      <ul class="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        <li v-if="!banks.length" class="px-4 py-6 text-sm text-center text-slate-400">Henüz banka yok.</li>
        <li
          v-for="(bank, i) in banks"
          :key="bank"
          class="flex items-center gap-3 px-4 py-2.5 bg-white"
        >
          <span class="flex-1 text-sm font-medium text-slate-700 truncate">{{ bank }}</span>
          <button type="button" class="btn btn-ghost btn-xs" :disabled="i === 0" title="Yukarı taşı" @click="move(i, -1)">↑</button>
          <button type="button" class="btn btn-ghost btn-xs" :disabled="i === banks.length - 1" title="Aşağı taşı" @click="move(i, 1)">↓</button>
          <button type="button" class="btn btn-ghost btn-xs text-red-600" title="Sil" @click="remove(i)">Sil</button>
        </li>
      </ul>

      <form class="flex gap-2" @submit.prevent="add">
        <input
          v-model="newBank"
          type="text"
          maxlength="100"
          placeholder="Banka adı (ör. Akbank)"
          class="input input-bordered input-sm flex-1"
        />
        <button type="submit" class="btn btn-sm btn-outline" :disabled="!newBank.trim()">Ekle</button>
      </form>
      <p v-if="addError" class="text-xs text-red-600 -mt-3">{{ addError }}</p>

      <div class="flex items-center gap-3 pt-2">
        <button type="button" class="btn btn-sm btn-primary" :disabled="!dirty || saving || !banks.length" @click="save">
          <span v-if="saving" class="loading loading-spinner loading-xs"></span>
          Kaydet
        </button>
        <button v-if="dirty" type="button" class="btn btn-sm btn-ghost" :disabled="saving" @click="reset">Vazgeç</button>
        <span v-if="dirty" class="text-xs text-amber-600">Kaydedilmemiş değişiklik var.</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import settingsService, { DEFAULT_BANKS } from '@/infrastructure/services/settingsService'
import { useNotification } from '@/application/composables/useNotification'

defineProps({ hideHeader: Boolean })
defineEmits(['refresh-stats', 'stats'])

const { showSuccess, showError } = useNotification()

const banks = ref([])
const saved = ref([])
const newBank = ref('')
const addError = ref('')
const loading = ref(true)
const saving = ref(false)

const dirty = computed(() => JSON.stringify(banks.value) !== JSON.stringify(saved.value))

const load = async () => {
  loading.value = true
  try {
    const list = await settingsService.getBanks()
    saved.value = Array.isArray(list) ? list : [...DEFAULT_BANKS]
  } catch (e) {
    saved.value = [...DEFAULT_BANKS]
    showError('Banka listesi yüklenemedi.')
  } finally {
    banks.value = [...saved.value]
    loading.value = false
  }
}

const add = () => {
  const name = newBank.value.trim()
  addError.value = ''
  if (!name) return
  if (banks.value.some(b => b.toLocaleLowerCase('tr-TR') === name.toLocaleLowerCase('tr-TR'))) {
    addError.value = 'Bu banka zaten listede.'
    return
  }
  banks.value.push(name)
  newBank.value = ''
}

const remove = (i) => banks.value.splice(i, 1)

const move = (i, dir) => {
  const j = i + dir
  if (j < 0 || j >= banks.value.length) return
  const list = [...banks.value]
  ;[list[i], list[j]] = [list[j], list[i]]
  banks.value = list
}

const reset = () => {
  banks.value = [...saved.value]
  addError.value = ''
}

const save = async () => {
  saving.value = true
  try {
    await settingsService.saveBanks(banks.value)
    showSuccess('Banka listesi kaydedildi.')
    await load()
  } catch (e) {
    // Backend doğrulama hatası (400) düz metin döner
    const data = e?.response?.data
    showError(typeof data === 'string' && data.trim() ? data : (e?.message || 'Banka listesi kaydedilemedi.'))
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>
