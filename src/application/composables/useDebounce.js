import { ref, watch } from 'vue'

/**
 * Bir ref değerini debounce eder.
 * Arama inputları için — her tuş vuruşunda API çağrısını önler.
 *
 * @param {Ref} value   - İzlenecek ref
 * @param {number} delay - Gecikme (ms). Varsayılan: 400ms
 * @returns {Ref} debouncedValue
 */
export function useDebounce(value, delay = 400) {
  const debouncedValue = ref(value.value)
  let timer = null

  watch(value, (newVal) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedValue.value = newVal
    }, delay)
  })

  return debouncedValue
}

/**
 * Bir fonksiyonu debounce eder.
 *
 * @param {Function} fn    - Geciktirilecek fonksiyon
 * @param {number}   delay - Gecikme (ms). Varsayılan: 400ms
 * @returns {Function} debouncedFn
 */
export function useDebounceFn(fn, delay = 400) {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
