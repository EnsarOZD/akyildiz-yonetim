<template>
  <header class="page-header relative overflow-hidden mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
    <!-- Decorative Gradient Background -->
    <div class="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none"></div>
    
    <!-- Accent Line -->
    <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 dark:bg-blue-500 rounded-r-full"></div>

    <div class="relative px-5 py-4 sm:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <!-- Optional Icon Slot -->
        <div v-if="$slots.icon" class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
          <slot name="icon"></slot>
        </div>
        
        <div>
          <h1 class="page-title">{{ title }}</h1>
          <p v-if="subtitle" class="page-subtitle mt-1.5 opacity-80">{{ subtitle }}</p>
        </div>
      </div>

      <!-- Actions Slot (Buttons, Filters, etc.) -->
      <div v-if="$slots.actions" class="flex items-center gap-2 sm:gap-3">
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Bottom Border / Glass separator -->
    <div class="absolute bottom-0 left-0 right-0 h-px bg-slate-200/60 dark:bg-slate-700/40"></div>
  </header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.page-header {
  /* Subtle backdrop blur if background is translucent */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

@keyframes slide-in-from-top-4 {
  from {
    transform: translateY(-1rem);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-in {
  animation-duration: 0.5s;
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fade-in;
}

.slide-in-from-top-4 {
  animation-name: slide-in-from-top-4;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
