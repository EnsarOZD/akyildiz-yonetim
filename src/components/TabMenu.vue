<template>
  <nav class="bg-gray-800 px-6 py-4 border-b border-gray-700 flex flex-col md:flex-row justify-center items-center gap-3 text-white">
    <!-- Sekmeler -->
    <div class="flex flex-wrap justify-center gap-4">
      <router-link
        v-for="tab in tabs"
        :key="tab.value"
        :to="tab.route"
        class="btn btn-md transition"
        :class="$route.path === tab.route ? 'btn-primary btn-outline' : 'btn-outline btn-info'"
      >
        {{ tab.label }}
      </router-link>
    </div>
  </nav>
</template>

<script setup>
const tabs = [
  { label: '📊 Özet', value: 'dashboard', route: '/dashboard' },
  { label: '🏢 Kiracılar', value: 'tenants', route: '/tenants' },
  { label: '💸 Ödemeler', value: 'payments', route: '/payments' },
  { label: '📉 Yönetim Giderleri', value: 'expenses', route: '/expenses' },
  { label: '⚙️ Sayaçlar', value: 'utilities', route: '/utilities' },
  { label: '🛠️ Yönetim', value: 'admin', route: '/admin' }  // Admin sekmesini ekledik
]
</script>
