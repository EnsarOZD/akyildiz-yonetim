import { ref, watch, onBeforeUnmount } from 'vue'

/**
 * SaaS Phase 1: Dirty form detection
 * Prevents accidental data loss when closing modals
 */
export function useDirtyGuard(formRef, initialData) {
    const isDirty = ref(false)

    // Take a snapshot
    const snapshot = JSON.stringify(initialData || formRef)

    watch(() => formRef, (current) => {
        isDirty.value = JSON.stringify(current) !== snapshot
    }, { deep: true })

    const resetDirty = (newData) => {
        isDirty.value = false
        // Optionally update snapshot if needed for next edit
    }

    return {
        isDirty,
        resetDirty
    }
}
