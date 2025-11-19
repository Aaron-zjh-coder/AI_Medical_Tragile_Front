import { debounce as _debounce, throttle as _throttle } from '@/utils/debounce-throttle'

export function useDebounceFn<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 300
) {
  return _debounce(fn, delay)
}

export function useThrottleFn<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 300
) {
  return _throttle(fn, delay)
}
