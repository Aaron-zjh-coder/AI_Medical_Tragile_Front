import { ref, watch } from 'vue'
import type { Ref } from 'vue'

const PREFIX = 'APP_'

export function useStorage<T>(key: string, defaultValue: T, expireMinutes?: number) {
  const storageKey = PREFIX + key
  const stored = localStorage.getItem(storageKey)
  let initialValue: T = defaultValue

  if (stored) {
    try {
      const data = JSON.parse(stored)
      if (!data.expire || data.expire > Date.now()) {
        initialValue = data.value as T
      } else {
        localStorage.removeItem(storageKey)
      }
    } catch {
      // ignore
    }
  }

  const state = ref<T>(initialValue) as Ref<T>

  watch(state, (val) => {
    const data = {
      value: val,
      expire: expireMinutes ? Date.now() + expireMinutes * 60 * 1000 : null
    }
    localStorage.setItem(storageKey, JSON.stringify(data))
  }, { deep: true })

  return state
}
