import { computed } from 'vue'

export function useBackendMode() {
    const isDemoMode = computed(() => {
        return import.meta.env.VITE_API_BASE_URL?.includes('localhost') ||
            import.meta.env.VITE_DEMO_MODE === 'true'
    })

    const apiBaseUrl = computed(() => {
        return import.meta.env.VITE_API_BASE_URL || 'https://api.akyildizyonetim.com/api'
    })

    return {
        isDemoMode,
        apiBaseUrl
    }
}
