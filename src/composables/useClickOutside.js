import { onMounted, onBeforeUnmount, unref } from 'vue'

/**
 * SaaS Phase 1: Global click-outside listener
 * Used for dropdowns, modals, and menus
 */
export function useClickOutside(targetRef, handler) {
    const listener = (event) => {
        const el = unref(targetRef)
        if (!el || el.contains(event.target)) {
            return
        }
        handler(event)
    }

    onMounted(() => {
        // delay adding listener slightly to avoid triggering on the click that opens the menu
        setTimeout(() => {
            window.addEventListener('mousedown', listener)
            window.addEventListener('touchstart', listener)
        }, 0)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('mousedown', listener)
        window.removeEventListener('touchstart', listener)
    })
}
