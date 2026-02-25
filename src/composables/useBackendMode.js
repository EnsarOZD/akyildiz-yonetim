import { computed } from 'vue'

/**
 * SaaS Phase 1: Backend mode and configuration management
 * Consolidates API URL checks and Demo Mode logic
 */
export function useBackendMode() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

    const isDemoMode = computed(() => {
        return !apiBaseUrl || apiBaseUrl === 'http://localhost:5000/api'
    })

    const isProduction = computed(() => {
        return apiBaseUrl && apiBaseUrl.includes('akyildizyonetim.com')
    })

    return {
        apiBaseUrl,
        isDemoMode,
        isProduction
    }
}
