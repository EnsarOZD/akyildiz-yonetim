import { ref } from 'vue'

// Global event bus
const eventBus = ref(new Map())

export function useEventBus() {
  
  // Event dinleyici ekle
  const on = (event, callback) => {
    if (!eventBus.value.has(event)) {
      eventBus.value.set(event, [])
    }
    eventBus.value.get(event).push(callback)
  }

  // Event dinleyici kaldır
  const off = (event, callback) => {
    if (eventBus.value.has(event)) {
      const callbacks = eventBus.value.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  // Event gönder
  const emit = (event, data) => {
    if (eventBus.value.has(event)) {
      eventBus.value.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('Event callback error:', error)
        }
      })
    }
  }

  // Event dinleyiciyi bir kez çalıştır
  const once = (event, callback) => {
    const onceCallback = (data) => {
      callback(data)
      off(event, onceCallback)
    }
    on(event, onceCallback)
  }

  return {
    on,
    off,
    emit,
    once
  }
} 