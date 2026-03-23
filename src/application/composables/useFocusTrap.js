import { onMounted, onUnmounted, watch } from 'vue'

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

/**
 * Traps keyboard focus within a container element while active.
 * Restores focus to the previously focused element when deactivated.
 *
 * @param {Ref<HTMLElement|null>} containerRef - ref to the trapping container
 * @param {Ref<boolean>} isActive - ref that controls when the trap is active
 */
export function useFocusTrap(containerRef, isActive) {
  let previouslyFocused = null

  const getFocusable = () => {
    if (!containerRef.value) return []
    return Array.from(containerRef.value.querySelectorAll(FOCUSABLE_SELECTORS))
  }

  const onKeydown = (e) => {
    if (!isActive.value || e.key !== 'Tab') return
    const focusable = getFocusable()
    if (focusable.length === 0) { e.preventDefault(); return }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  const activate = () => {
    previouslyFocused = document.activeElement
    // Defer so the DOM is ready
    requestAnimationFrame(() => {
      const focusable = getFocusable()
      if (focusable.length) focusable[0].focus()
    })
    document.addEventListener('keydown', onKeydown)
  }

  const deactivate = () => {
    document.removeEventListener('keydown', onKeydown)
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus()
    }
  }

  watch(isActive, (active) => {
    active ? activate() : deactivate()
  })

  onMounted(() => {
    if (isActive.value) activate()
  })

  onUnmounted(() => {
    deactivate()
  })
}
