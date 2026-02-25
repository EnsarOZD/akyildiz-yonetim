import { computed } from 'vue'

export function useBranding() {
    // For now, these are static defaults. 
    // In the future, these can be fetched from a building-specific configuration endpoint.
    const logoUrl = computed(() => '/logo-default.svg')
    const appName = computed(() => 'Akyıldız İş Merkezi')

    return {
        logoUrl,
        appName
    }
}
