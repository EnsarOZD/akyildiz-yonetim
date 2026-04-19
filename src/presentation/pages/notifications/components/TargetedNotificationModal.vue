<template>
  <BaseModal
    :model-value="show"
    title="HEDEFLİ BİLDİRİM SİSTEMİ"
    icon="📢"
    size="lg"
    @close="$emit('close')"
  >
    <div class="space-y-8">
      <!-- 1. Bildirim Türü Seçimi -->
      <div class="space-y-4">
        <div class="flex items-center gap-3 px-1 text-[#f1f3f9]">
          <h4 class="text-[11px] font-black uppercase tracking-widest">1. Bildirim Türünü Seçin</h4>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div 
            v-for="type in notificationTypes" :key="type.id"
            @click="form.type = type.id"
            class="relative cursor-pointer p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 group overflow-hidden"
            :class="[
              form.type === type.id 
                ? 'border-brand-500 bg-brand-500/[0.08] shadow-lg shadow-brand-500/10' 
                : 'border-white/[0.08] bg-white/[0.01] hover:border-white/[0.2] hover:bg-white/[0.03]'
            ]"
          >
            <!-- Background Glow -->
            <div v-if="form.type === type.id" class="absolute -right-4 -top-4 w-12 h-12 bg-brand-500/20 blur-2xl rounded-full"></div>
            
            <span class="text-3xl transition-transform group-hover:scale-110 duration-500">{{ type.icon }}</span>
            <span class="text-xs font-black uppercase tracking-widest text-center" :class="form.type === type.id ? 'text-brand-400' : 'text-[#626885]'">
              {{ type.label }}
            </span>
          </div>
        </div>
      </div>

      <!-- 2. Hedef Kitle ve Kapsam -->
      <div class="space-y-4">
        <div class="flex items-center gap-3 px-1 text-[#f1f3f9]">
          <h4 class="text-[11px] font-black uppercase tracking-widest">2. Hedef Kitle ve Gönderim Kapsamı</h4>
        </div>
        <div class="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Kime Gönderilecek -->
            <div class="form-control">
              <label class="label"><span class="label-text">Kime Gönderilecek?</span></label>
              <select v-model="form.targetType" class="select select-bordered w-full font-bold">
                <option value="all">Tüm Aktif Kiracılar</option>
                <option value="floor">Belirli Bir Kat Bazlı</option>
                <option value="tenant">Tekil Kiracı Seçimi</option>
              </select>
            </div>

            <!-- Dinamik Seçim Alanı -->
            <div v-if="form.targetType === 'floor'" class="form-control animate-fade-in">
              <label class="label"><span class="label-text">Kat Seçiniz</span></label>
              <select v-model="form.targetId" class="select select-bordered w-full font-bold">
                <option v-for="floor in floors" :key="floor" :value="floor">{{ floor }}. Kat</option>
              </select>
            </div>

            <div v-if="form.targetType === 'tenant'" class="form-control animate-fade-in">
              <label class="label"><span class="label-text">Kiracı Seçiniz</span></label>
              <select v-model="form.targetId" class="select select-bordered w-full font-bold">
                <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">{{ tenant.companyName || tenant.fullName }}</option>
              </select>
            </div>
          </div>

          <!-- Opsiyonel Filtreler -->
          <div class="mt-6 flex flex-col gap-4">
            <!-- Gecikme Filtresi -->
            <div v-if="form.type === 'debt'" class="p-4 bg-amber-500/[0.05] border border-amber-500/20 rounded-xl animate-shake">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-lg">⏳</span>
                <span class="text-xs font-black text-amber-300 uppercase tracking-widest">Gecikme Filtresi Aktif</span>
              </div>
              <div class="flex items-center gap-3 text-xs text-amber-200/70 font-medium px-1">
                <span>Ödemesi en az</span>
                <input v-model="form.delayDays" type="number" class="w-16 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-center font-black text-amber-400" min="1" />
                <span>gün gecikenlere gönderilsin.</span>
              </div>
            </div>

            <!-- E-posta Seçeneği -->
            <label class="flex items-center gap-3 cursor-pointer group p-2">
              <input type="checkbox" v-model="form.sendEmail" class="checkbox checkbox-primary checkbox-sm" />
              <span class="text-xs font-bold text-[#9aa0b4] group-hover:text-brand-400 transition-colors uppercase tracking-widest">📧 Ayrıca e-posta bildirimi gönder</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 3. Bildirim İçeriği -->
      <div class="space-y-4">
        <div class="flex items-center gap-3 px-1 text-[#f1f3f9]">
          <h4 class="text-[11px] font-black uppercase tracking-widest">3. Bildirim İçeriğini Oluşturun</h4>
        </div>
        <div class="space-y-4 bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
          <div class="form-control">
            <label class="label"><span class="label-text">Bildirim Başlığı *</span></label>
            <input 
              v-model="form.title"
              type="text" 
              placeholder="Örn: Aidat Ödemeleri Hakkında Bilgilendirme"
              class="input input-bordered w-full font-bold !text-lg"
              required
            />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Mesaj İçeriği *</span></label>
            <textarea 
              v-model="form.message"
              rows="4"
              placeholder="Mesajınızı buraya detaylıca yazın..."
              class="textarea textarea-bordered w-full !bg-white/[0.01] border-white/[0.08] leading-relaxed"
              required
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 4. Gönderim Özeti -->
      <div class="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 flex items-center justify-between shadow-inner">
        <div>
          <h5 class="text-[10px] font-black text-[#626885] uppercase tracking-widest mb-1">Tahmini Alıcı Kapsamı</h5>
          <p class="text-lg font-black text-[#f1f3f9] underline decoration-brand-500/50 underline-offset-4 decoration-2">
            {{ estimatedRecipients }} Kullanıcı
          </p>
        </div>
        <div class="text-right">
          <h5 class="text-[10px] font-black text-[#626885] uppercase tracking-widest mb-1">Gönderim Modu</h5>
          <span class="text-xs px-4 py-1.5 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-full font-black uppercase tracking-widest">
            {{ form.targetType === 'all' ? 'Kitlesel' : 'Hedefli' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <button 
        type="button" 
        @click="$emit('close')" 
        class="btn btn-ghost !bg-transparent border border-white/[0.08] text-[#9aa0b4] hover:bg-white/[0.05] flex-1"
        :disabled="loading"
      >
        Vazgeç
      </button>
      <button 
        type="button"
        @click="handleSubmit"
        :disabled="loading || !isFormValid"
        class="btn btn-primary flex-1 shadow-lg shadow-brand-500/20 uppercase tracking-widest font-black"
      >
        <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
        <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        {{ loading ? 'Gönderiliyor' : 'Şimdi Yayınla' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import { notificationsService } from '@/infrastructure/services/notificationsService'
import tenantsService from '@/infrastructure/services/tenantsService'
import { useNotify } from '@/application/composables/useNotify'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['close', 'success'])
const { notifySuccess, notifyError } = useNotify()

const loading = ref(false)
const tenants = ref([])
const floors = ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

const notificationTypes = [
  { id: 'announcement', label: 'Duyuru', icon: '📢' },
  { id: 'debt', label: 'Borç Hatırlatma', icon: '💰' },
  { id: 'private', label: 'Özel Mesaj', icon: '✉️' }
]

const form = reactive({
  type: 'announcement',
  targetType: 'all',
  targetId: null,
  delayDays: 5,
  title: '',
  message: '',
  sendEmail: false
})

const isFormValid = computed(() => {
  const basicValid = form.title.trim().length >= 3 && form.message.trim().length >= 5
  const targetValid = form.targetType === 'all' || form.targetId
  return basicValid && targetValid
})

const estimatedRecipients = computed(() => {
  if (form.targetType === 'all') return tenants.value.length || 'Tüm'
  if (form.targetType === 'floor') return 'Kattakiler'
  return 1
})

const loadTenants = async () => {
  try {
    const data = await tenantsService.getTenants()
    tenants.value = data || []
  } catch (error) {
    console.error('Kiracı yükleme hatası:', error)
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  loading.value = true
  try {
    await notificationsService.sendTargeted({
      title: form.title,
      message: form.message,
      type: form.type,
      targetType: form.targetType,
      targetId: form.targetId ? String(form.targetId) : null,
      delayDays: form.type === 'debt' ? form.delayDays : null,
      sendEmail: form.sendEmail
    })
    
    notifySuccess('Bildirim başarıyla yayınlandı')
    emit('success')
    emit('close')
    // Reset form
    Object.assign(form, {
      type: 'announcement', targetType: 'all', targetId: null,
      delayDays: 5, title: '', message: '', sendEmail: false
    })
  } catch (error) {
    notifyError('Bildirim gönderilirken bir hata oluştu')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTenants()
})
</script>
