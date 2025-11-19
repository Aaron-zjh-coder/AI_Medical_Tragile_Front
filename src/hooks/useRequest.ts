// src/hooks/useRequest.ts
import { ref, Ref } from 'vue'

interface UseRequestReturn<T, P extends unknown[]> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  run: (...args: P) => Promise<void>
}

export function useRequest<T, P extends unknown[]>(
  fn: (...args: P) => Promise<T>
): UseRequestReturn<T, P> {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref<boolean>(false) as Ref<boolean>
  const error = ref<Error | null>(null) as Ref<Error | null>

  const run = async (...args: P) => {
    loading.value = true
    error.value = null
    try {
      const res = await fn(...args)
      data.value = res
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error')
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, run }
}
