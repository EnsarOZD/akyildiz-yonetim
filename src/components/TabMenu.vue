<template>
  <nav class="bg-base-100 px-6 py-4 border-b border-base-300 flex flex-col md:flex-row justify-center items-center gap-3">
    <!-- Sekmeler -->
    <div class="flex flex-wrap justify-center gap-4">
      <router-link
        v-for="tab in tabs"
        :key="tab.value"
        :to="tab.route"
        class="btn btn-md transition"
        :class="[
          theme === 'dark'
            ? ($route.path === tab.route ? 'btn-primary btn-outline' : 'btn-outline btn-info')
            : ($route.path === tab.route ? 'btn-primary btn-soft' : 'btn-neutral btn-soft')
        ]"
      >
        {{ tab.label }}
      </router-link>
    </div>

    <!-- Tema Butonu -->
    <button class="btn btn-outline btn-md ml-auto md:absolute right-6 top-4" @click="toggleTheme">
      {{ theme === 'light' ? '🌙 Koyu' : '☀️ Açık' }}
    </button>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const theme = ref('dark')

const tabs = [
  { label: 'Özet', value: 'dashboard', route: '/dashboard' },
  { label: 'Kiracılar', value: 'tenants', route: '/tenants' },
  { label: 'Ödemeler', value: 'payments', route: '/payments' },
  { label: 'Giderler', value: 'expenses', route: '/expenses' },
  { label: 'Sayaçlar', value: 'utilities', route: '/utilities' },
]

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('theme', theme.value)
}

onMounted(() => {
  theme.value = localStorage.getItem('theme') || 'dark'
  document.documentElement.setAttribute('data-theme', theme.value)
})
</script>
