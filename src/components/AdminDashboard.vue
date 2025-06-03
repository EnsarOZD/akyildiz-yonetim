<template>
  <section class="max-w-5xl mx-auto p-6 space-y-6">
    <!-- Sekme Butonları -->
    <div class="flex justify-center gap-4 mb-6 flex-wrap">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          'btn',
          'btn-md',
          activeTab === tab.key ? 'btn-primary' : 'btn-outline btn-info'
        ]"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <!-- İçerik Paneli -->
    <div>
      <AidatPanel v-if="activeTab === 'dues'" />
      <UserAddPanel v-if="activeTab === 'addUser'" />
      <UserListPanel v-if="activeTab === 'userList'" />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import AidatPanel from './AidatPanel.vue'
import UserAddPanel from './UserAddPanel.vue'
import UserListPanel from './UserListPanel.vue'

const activeTab = ref('dues')

const tabs = [
  { key: 'dues', label: 'Aidat Tanımlama', icon: '📆' },
  { key: 'addUser', label: 'Kullanıcı Ekle', icon: '➕' },
  { key: 'userList', label: 'Kullanıcı Listesi', icon: '👥' }
]
</script>
