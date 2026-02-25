import { computed } from 'vue'

export function useBranding() {
    // For now, these are static defaults. 
    // In the future, these can be fetched from a building-specific configuration endpoint.
    const appName = computed(() => 'Akyıldız İş Merkezi')
    const shortName = computed(() => 'Akyıldız')
    const logoUrl = computed(() => '/logo-default.svg')
    const themeColor = computed(() => '#0b1220')

    return {
        logoUrl,
        appName,
        shortName,
        themeColor
    }
}
