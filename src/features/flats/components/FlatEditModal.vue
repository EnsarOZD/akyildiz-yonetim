<template>
    <dialog id="editFlatModal" class="modal" :open="visible">
      <div v-if="flat" class="modal-box max-w-4xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
        <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span class="text-2xl">✏️</span>
            Ünite Bilgilerini Güncelle
          </h3>
          <button @click="$emit('close')" class="btn btn-sm btn-ghost text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
  
        <div class="overflow-y-auto max-h-[70vh] pr-2">
          <form @submit.prevent="save" class="space-y-6">
            <!-- Temel Bilgiler -->
            <div class="card bg-base-200 p-4">
              <h4 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">📋 Temel Bilgiler</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Ünite Kodu (Code) *</span></label>
                  <input v-model.trim="local.code" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required />
                </div>
                <div class="form-control">
                  <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Tip *</span></label>
                  <select v-model="local.type" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required>
                    <option value="Floor">Kat</option>
                    <option value="Entry">Giriş</option>
                    <option value="Parking">Otopark</option>
                  </select>
                </div>
  
                <div class="form-control" v-if="local.type !== 'Parking'">
                  <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Kat (FloorNumber) *</span></label>
                  <input type="number" v-model.number="local.floorNumber" :disabled="local.type === 'Entry'" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required />
                  <small v-if="local.type === 'Entry'" class="text-xs text-gray-500">Giriş için kat = 0 kabul edilir.</small>
                </div>
  
                <div class="form-control" v-if="local.type !== 'Parking'">
                  <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Grup Stratejisi</span></label>
                  <select v-model="local.groupStrategy" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400">
                    <option value="None">Normal</option>
                    <option value="SplitIfMultiple">Bölünmüş (A/B)</option>
                  </select>
                </div>
  
                <div class="form-control" v-if="showGroupFields">
                  <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Grup Anahtarı (GroupKey)</span></label>
                  <input v-model.trim="local.groupKey" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" />
                </div>
                <div class="form-control" v-if="showGroupFields">
                  <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Bölüm (Section)</span></label>
                  <select v-model="local.section" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400">
                    <option :value="null">Seçin</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </div>
  
                <div class="form-control">
                  <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Alan (m²) *</span></label>
                  <input type="number" v-model.number="local.unitArea" min="1" step="0.01" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required />
                </div>
  
                <div class="form-control">
                  <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Aylık Kira</span></label>
                  <input type="number" v-model.number="local.monthlyRent" min="0" step="0.01" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" />
                </div>
  
                <div class="form-control">
                  <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Hisse (ShareCount)</span></label>
                  <input type="number" v-model.number="local.shareCount" min="0" step="0.01" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" />
                </div>
  
                <div class="form-control">
                  <label class="label cursor-pointer"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Aktif Ünite</span>
                    <input type="checkbox" v-model="local.isActive" class="toggle toggle-success" />
                  </label>
                </div>
  
                <div class="form-control">
                  <label class="label"><span class="label-text font-semibold text-gray-700 dark:text-gray-300">Açıklama</span></label>
                  <textarea v-model="local.description" rows="3" class="textarea textarea-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400"></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>
  
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
          <button type="button" @click="$emit('close')" class="btn btn-outline border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">İptal</button>
          <button @click="save" class="btn btn-primary bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 text-white shadow-lg">Güncelle</button>
        </div>
      </div>
    </dialog>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue'
  
  const props = defineProps({ flat: Object, visible: Boolean })
  const emit = defineEmits(['save', 'close'])
  
  const local = ref(null)
  
  watch(() => props.flat, (f) => { if (f) local.value = { ...f } }, { immediate: true })
  
  const showGroupFields = computed(() => local.value && (local.value.type === 'Entry' || local.value.groupStrategy === 'SplitIfMultiple'))
  
  watch(() => local.value?.type, (t) => {
    if (!local.value) return
    if (t === 'Parking') {
      local.value.floorNumber = null
      local.value.groupStrategy = 'None'
      local.value.section = null
      local.value.groupKey = null
    } else if (t === 'Entry') {
      local.value.floorNumber = 0
      local.value.groupStrategy = 'SplitIfMultiple'
      local.value.section = local.value.section ?? 'A'
      local.value.groupKey = local.value.groupKey ?? 'G'
    }
  })
  
  const save = () => {
    if (!local.value) return
    const payload = { ...local.value }
    payload.code = String(payload.code || '').trim().toUpperCase()
    emit('save', payload)
  }
  </script>