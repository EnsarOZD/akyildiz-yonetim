import { computed } from 'vue'
import { isDemoMode as resolveDemoMode } from '@/core/utils/backendMode'

export function useBackendMode() {
    // Karar tek merkezden (core/utils/backendMode) — prod build'de asla demo modu yok
    const isDemoMode = computed(() => resolveDemoMode())

    const apiBaseUrl = computed(() => {
        return import.meta.env.VITE_API_BASE_URL || 'https://api.akyildizyonetim.com/api'
    })

    return {
        isDemoMode,
        apiBaseUrl
    }
}
