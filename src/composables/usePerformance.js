import { ref, onMounted, onUnmounted } from 'vue'

export function usePerformance() {
  const loadingStates = ref(new Map())
  const performanceMetrics = ref({
    pageLoadTime: 0,
    componentRenderTime: 0,
    apiResponseTime: 0
  })

  // Loading state yönetimi
  const setLoading = (key, isLoading = true) => {
    loadingStates.value.set(key, isLoading)
  }

  const getLoading = (key) => {
    return loadingStates.value.get(key) || false
  }

  const clearLoading = (key) => {
    loadingStates.value.delete(key)
  }

  // Debounce fonksiyonu
  const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Throttle fonksiyonu
  const throttle = (func, limit) => {
    let inThrottle
    return function() {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  // Virtual scrolling için
  const useVirtualScroll = (items, itemHeight, containerHeight) => {
    const scrollTop = ref(0)
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const startIndex = Math.floor(scrollTop.value / itemHeight)
    const endIndex = Math.min(startIndex + visibleCount, items.length)
    
    const visibleItems = computed(() => 
      items.slice(startIndex, endIndex).map((item, index) => ({
        ...item,
        index: startIndex + index,
        style: {
          position: 'absolute',
          top: `${(startIndex + index) * itemHeight}px`,
          height: `${itemHeight}px`
        }
      }))
    )

    const containerStyle = {
      height: `${items.length * itemHeight}px`,
      position: 'relative'
    }

    const onScroll = (event) => {
      scrollTop.value = event.target.scrollTop
    }

    return {
      visibleItems,
      containerStyle,
      onScroll
    }
  }

  // Image lazy loading
  const useLazyImage = (src, placeholder = null) => {
    const imageSrc = ref(placeholder)
    const isLoaded = ref(false)
    const isError = ref(false)

    const loadImage = () => {
      const img = new Image()
      img.onload = () => {
        imageSrc.value = src
        isLoaded.value = true
      }
      img.onerror = () => {
        isError.value = true
      }
      img.src = src
    }

    onMounted(() => {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              loadImage()
              observer.unobserve(entry.target)
            }
          })
        })
        
        // Bu fonksiyon template'de kullanılacak
        return (el) => {
          if (el) observer.observe(el)
        }
      } else {
        // Fallback for older browsers
        loadImage()
      }
    })

    return {
      imageSrc,
      isLoaded,
      isError
    }
  }

  // Memory management
  const cleanup = () => {
    loadingStates.value.clear()
  }

  // Performance monitoring
  const measurePerformance = (name, fn) => {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    
    console.log(`${name} took ${end - start}ms`)
    return result
  }

  // Async performance measurement
  const measureAsyncPerformance = async (name, fn) => {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()
    
    console.log(`${name} took ${end - start}ms`)
    return result
  }

  // Component render optimization
  const useMemo = (fn, deps) => {
    const cache = ref(new Map())
    const depsKey = JSON.stringify(deps)
    
    if (!cache.value.has(depsKey)) {
      cache.value.set(depsKey, fn())
    }
    
    return cache.value.get(depsKey)
  }

  // Batch updates
  const batchUpdate = (updates) => {
    // Vue 3'te nextTick kullanarak batch update
    nextTick(() => {
      updates.forEach(update => update())
    })
  }

  // Resource preloading
  const preloadResource = (url, type = 'image') => {
    if (type === 'image') {
      const img = new Image()
      img.src = url
    } else if (type === 'script') {
      const script = document.createElement('script')
      script.src = url
      document.head.appendChild(script)
    }
  }

  // Cache management
  const cache = ref(new Map())
  
  const setCache = (key, value, ttl = 5 * 60 * 1000) => {
    cache.value.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    })
  }

  const getCache = (key) => {
    const item = cache.value.get(key)
    if (!item) return null
    
    if (Date.now() - item.timestamp > item.ttl) {
      cache.value.delete(key)
      return null
    }
    
    return item.value
  }

  const clearCache = () => {
    cache.value.clear()
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    // Loading states
    setLoading,
    getLoading,
    clearLoading,
    
    // Performance utilities
    debounce,
    throttle,
    useVirtualScroll,
    useLazyImage,
    
    // Performance monitoring
    measurePerformance,
    measureAsyncPerformance,
    
    // Optimization
    useMemo,
    batchUpdate,
    preloadResource,
    
    // Cache
    setCache,
    getCache,
    clearCache,
    
    // Metrics
    performanceMetrics
  }
} 