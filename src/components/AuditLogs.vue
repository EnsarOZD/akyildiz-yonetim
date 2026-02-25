<template>
  <div class="audit-logs bg-base-100 p-6 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6 text-primary">Sistem Logları</h2>
    
    <!-- Filtreler -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold">Başlangıç Tarihi</span>
        </label>
        <input 
          v-model="filters.startDate" 
          type="date" 
          class="input input-bordered"
        />
      </div>
      
      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold">Bitiş Tarihi</span>
        </label>
        <input 
          v-model="filters.endDate" 
          type="date" 
          class="input input-bordered"
        />
      </div>
      
      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold">İşlem Türü</span>
        </label>
        <select v-model="filters.action" class="select select-bordered">
          <option value="">Tüm İşlemler</option>
          <option v-for="(label, value) in auditActions" :key="value" :value="value">
            {{ label }}
          </option>
        </select>
      </div>
      
      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold">Varlık Türü</span>
        </label>
        <select v-model="filters.entityType" class="select select-bordered">
          <option value="">Tüm Varlıklar</option>
          <option v-for="(label, value) in entityTypes" :key="value" :value="value">
            {{ label }}
          </option>
        </select>
      </div>
      
      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold">&nbsp;</span>
        </label>
        <button 
          @click="loadLogs" 
          class="btn btn-primary"
          :disabled="loading"
        >
          <span v-if="loading" class="loading loading-spinner loading-sm"></span>
          {{ loading ? 'Yükleniyor...' : 'Log Yükle' }}
        </button>
      </div>
    </div>
    
    <!-- Log tablosu -->
    <div v-if="logs.length > 0" class="overflow-x-auto">
      <table class="table table-zebra w-full">
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Kullanıcı</th>
            <th>İşlem</th>
            <th>Varlık</th>
            <th>IP Adresi</th>
            <th>Detaylar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td>{{ formatDateTime(log.createdAt) }}</td>
            <td>
              <div class="flex items-center space-x-2">
                <div class="avatar placeholder">
                  <div class="bg-neutral text-neutral-content rounded-full w-8">
                    <span class="text-xs">{{ log.userName?.charAt(0) || 'U' }}</span>
                  </div>
                </div>
                <div>
                  <div class="font-medium">{{ log.userName || 'Sistem' }}</div>
                  <div class="text-sm text-gray-500">{{ log.userEmail || '-' }}</div>
                </div>
              </div>
            </td>
            <td>
              <span 
                class="badge" 
                :class="getActionBadgeClass(log.action)"
              >
                {{ getAuditActionLabel(log.action) }}
              </span>
            </td>
            <td>
              <div>
                <div class="font-medium">{{ getEntityTypeLabel(log.entityType) }}</div>
                <div class="text-sm text-gray-500">ID: {{ log.entityId }}</div>
              </div>
            </td>
            <td class="text-sm text-gray-500">{{ log.ipAddress || '-' }}</td>
            <td>
              <button 
                @click="showDetails(log)" 
                class="btn btn-sm btn-outline"
              >
                Detaylar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Log yoksa mesaj -->
    <div v-else-if="!loading" class="text-center py-8">
      <div class="text-gray-500">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p class="text-lg font-medium">Log bulunamadı</p>
        <p class="text-sm">Filtreleri değiştirip tekrar deneyin.</p>
      </div>
    </div>
    
    <!-- Detay modal -->
    <dialog id="log_details_modal" class="modal">
      <div class="modal-box w-11/12 max-w-4xl">
        <h3 class="font-bold text-lg mb-4">Log Detayları</h3>
        
        <div v-if="selectedLog" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">
                <span class="label-text font-semibold">Tarih</span>
              </label>
              <div class="text-sm">{{ formatDateTime(selectedLog.createdAt) }}</div>
            </div>
            
            <div>
              <label class="label">
                <span class="label-text font-semibold">Kullanıcı</span>
              </label>
              <div class="text-sm">{{ selectedLog.userName || 'Sistem' }}</div>
            </div>
            
            <div>
              <label class="label">
                <span class="label-text font-semibold">İşlem</span>
              </label>
              <div class="text-sm">{{ getAuditActionLabel(selectedLog.action) }}</div>
            </div>
            
            <div>
              <label class="label">
                <span class="label-text font-semibold">Varlık</span>
              </label>
              <div class="text-sm">{{ getEntityTypeLabel(selectedLog.entityType) }} (ID: {{ selectedLog.entityId }})</div>
            </div>
            
            <div>
              <label class="label">
                <span class="label-text font-semibold">IP Adresi</span>
              </label>
              <div class="text-sm">{{ selectedLog.ipAddress || '-' }}</div>
            </div>
            
            <div>
              <label class="label">
                <span class="label-text font-semibold">User Agent</span>
              </label>
              <div class="text-sm text-xs">{{ selectedLog.userAgent || '-' }}</div>
            </div>
          </div>
          
          <div v-if="selectedLog.oldValues || selectedLog.newValues">
            <label class="label">
              <span class="label-text font-semibold">Değişiklikler</span>
            </label>
            <div class="bg-base-200 p-4 rounded-lg">
              <div v-if="selectedLog.oldValues" class="mb-3">
                <div class="font-semibold text-error mb-2">Eski Değerler:</div>
                <pre class="text-xs bg-error text-error-content p-2 rounded">{{ JSON.stringify(selectedLog.oldValues, null, 2) }}</pre>
              </div>
              <div v-if="selectedLog.newValues">
                <div class="font-semibold text-success mb-2">Yeni Değerler:</div>
                <pre class="text-xs bg-success text-success-content p-2 rounded">{{ JSON.stringify(selectedLog.newValues, null, 2) }}</pre>
              </div>
            </div>
          </div>
          
          <div v-if="selectedLog.additionalData">
            <label class="label">
              <span class="label-text font-semibold">Ek Bilgiler</span>
            </label>
            <div class="bg-base-200 p-4 rounded-lg">
              <pre class="text-xs">{{ JSON.stringify(selectedLog.additionalData, null, 2) }}</pre>
            </div>
          </div>
        </div>
        
        <div class="modal-action">
          <form method="dialog">
            <button class="btn">Kapat</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useNotify } from '@/composables/useNotify'
import paymentsService from '@/services/paymentsService'
import { auditActions, entityTypes, getAuditActionLabel, getEntityTypeLabel } from '@/constants/enums'

// Reactive data
const { notifyError } = useNotify()
const loading = ref(false)
const logs = ref([])
const selectedLog = ref(null)

const filters = ref({
  startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
  endDate: format(new Date(), 'yyyy-MM-dd'),
  action: '',
  entityType: '',
  userId: ''
})

// Methods
const formatDateTime = (date) => {
  return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: tr })
}

const getActionBadgeClass = (action) => {
  const classes = {
    'Create': 'badge-success',
    'Update': 'badge-warning',
    'Delete': 'badge-error',
    'Payment': 'badge-primary',
    'DebtAllocation': 'badge-info',
    'AdvanceUsage': 'badge-secondary'
  }
  return classes[action] || 'badge-neutral'
}

const loadLogs = async () => {
  loading.value = true
  
  try {
    const response = await paymentsService.getAuditLogs(filters.value)
    logs.value = response || []
  } catch (error) {
    console.error('Loglar yüklenemedi:', error)
    notifyError('Loglar yüklenemedi: ' + error.message)
  } finally {
    loading.value = false
  }
}

const showDetails = (log) => {
  selectedLog.value = log
  document.getElementById('log_details_modal').showModal()
}

// Lifecycle
onMounted(() => {
  loadLogs()
})
</script> 