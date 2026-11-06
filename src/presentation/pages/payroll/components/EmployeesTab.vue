<template>
  <div class="space-y-4" data-testid="payroll-employees-tab">
    <div class="app-card space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <label class="label cursor-pointer gap-2 p-0">
          <input v-model="showInactive" type="checkbox" class="checkbox checkbox-sm" />
          <span class="label-text text-sm">Pasif personeli göster</span>
        </label>
        <button type="button" class="btn btn-primary btn-sm" @click="openNew">+ Personel ekle</button>
      </div>

      <div v-if="loading" class="flex justify-center py-8"><span class="loading loading-spinner"></span></div>
      <div v-else-if="!rows.length" class="text-center py-8 text-sm text-slate-500">Personel kaydı yok.</div>
      <div v-else class="overflow-x-auto">
        <table class="table table-sm">
          <thead><tr><th>Ad Soyad</th><th>TCKN</th><th>Görev</th><th>Başlangıç</th><th>Ayrılış</th><th class="text-right">{{ year }} maaşı</th><th>Durum</th><th></th></tr></thead>
          <tbody>
            <tr v-for="e in rows" :key="e.id" class="hover cursor-pointer" @click="openEdit(e)">
              <td class="font-medium">{{ e.fullName }}</td>
              <td class="text-xs">{{ e.nationalId }}</td>
              <td>{{ e.position || '-' }}</td>
              <td class="whitespace-nowrap">{{ formatDate(e.startDate) }}</td>
              <td class="whitespace-nowrap">{{ e.endDate ? formatDate(e.endDate) : '-' }}</td>
              <td class="text-right whitespace-nowrap">{{ formatMoney(currentWage(e)?.monthlySalary) }}</td>
              <td><span class="badge badge-xs" :class="e.isActive ? 'badge-success' : 'badge-ghost'">{{ e.isActive ? 'Aktif' : 'Pasif' }}</span></td>
              <td class="text-right"><button type="button" class="btn btn-ghost btn-xs text-error" @click.stop="askDelete(e)">Sil</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <EmployeeModal v-model="showModal" :employee="selected" @changed="load" @created="onCreated" />
    <ConfirmModal
      :isOpen="showDelete"
      title="Personeli sil"
      :message="`${toDelete?.fullName || ''} silinecek. Emin misiniz?`"
      confirmLabel="Sil"
      confirmClass="btn-error"
      @confirm="doDelete"
      @cancel="showDelete = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ConfirmModal from '@/presentation/components/common/ConfirmModal.vue'
import payrollService from '@/infrastructure/services/payrollService'
import { useNotification } from '@/application/composables/useNotification'
import EmployeeModal from './EmployeeModal.vue'
import { formatMoney, formatDate, errorText } from './payrollHelpers'

const { showSuccess, showError } = useNotification()
const employees = ref([])
const loading = ref(false)
const showInactive = ref(false)
const showModal = ref(false)
const selectedId = ref(null)
const showDelete = ref(false)
const toDelete = ref(null)
const year = new Date().getFullYear()

const rows = computed(() => employees.value.filter(e => showInactive.value || e.isActive))
const selected = computed(() => employees.value.find(e => e.id === selectedId.value) || null)
const currentWage = (e) => (e.wages || []).find(w => w.year === year)

const load = async () => {
  loading.value = true
  try {
    employees.value = (await payrollService.getEmployees()) || []
  } catch (e) {
    showError(errorText(e, 'Personel listesi yüklenemedi.'))
  } finally {
    loading.value = false
  }
}
onMounted(load)

const openNew = () => { selectedId.value = null; showModal.value = true }
const openEdit = (e) => { selectedId.value = e.id; showModal.value = true }
const onCreated = async (created) => {
  await load()
  selectedId.value = created?.id || null
}
const askDelete = (e) => { toDelete.value = e; showDelete.value = true }
const doDelete = async () => {
  showDelete.value = false
  try {
    await payrollService.deleteEmployee(toDelete.value.id)
    showSuccess('Personel silindi.')
    await load()
  } catch (e) {
    showError(errorText(e, 'Personel silinemedi.'))
  }
}
</script>
