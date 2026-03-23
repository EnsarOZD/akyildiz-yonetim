import { ref, watch } from 'vue'

export function useDirtyGuard(getData) {
    const isDirty = ref(false)
    const initialState = ref(null)

    // Initialize state
    const init = () => {
        const data = getData()
        initialState.value = JSON.stringify(data)
        isDirty.value = false
    }

    // Watch for changes
    watch(getData, (current) => {
        if (!initialState.value) {
            initialState.value = JSON.stringify(current)
            return
        }
        isDirty.value = JSON.stringify(current) !== initialState.value
    }, { deep: true })

    const resetDirty = () => {
        init()
    }

    // Initial init
    init()

    return {
        isDirty,
        resetDirty
    }
}
