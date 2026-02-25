import { ref, watch, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

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

    // Route protection
    onBeforeRouteLeave((to, from, next) => {
        if (isDirty.value) {
            const answer = window.confirm(
                'Kaydedilmemiş değişiklikleriniz var. Ayrılmak istediğinizden emin misiniz?'
            )
            if (answer) {
                next()
            } else {
                next(false)
            }
        } else {
            next()
        }
    })

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
