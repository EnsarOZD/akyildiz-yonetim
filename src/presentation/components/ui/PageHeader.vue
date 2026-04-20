<template>
  <header class="page-header relative overflow-hidden mb-8 animate-in fade-in slide-in-from-top-4 duration-500
    bg-white dark:bg-[#0f1322] border border-slate-200/60 dark:border-white/[0.06] rounded-xl shadow-sm">
    <!-- Accent Line -->
    <div class="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 dark:bg-brand-400 rounded-r-full"></div>

    <div class="relative px-6 py-3 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <!-- Optional Icon Slot -->
        <div v-if="$slots.icon" class="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-brand-500/10 dark:bg-brand-500/[0.12] shadow-sm flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
          <slot name="icon"></slot>
        </div>

        <div>
          <h1 class="page-title text-base sm:text-[1.125rem]">{{ title }}</h1>
          <p v-if="subtitle" class="page-subtitle text-[11px] sm:text-[0.8125rem] mt-0.5 sm:mt-1 opacity-80">{{ subtitle }}</p>
        </div>
      </div>

      <!-- Actions Slot (Buttons, Filters, etc.) -->
      <div v-if="$slots.actions" class="flex items-center gap-2 sm:gap-3">
        <slot name="actions"></slot>
      </div>
    </div>
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
