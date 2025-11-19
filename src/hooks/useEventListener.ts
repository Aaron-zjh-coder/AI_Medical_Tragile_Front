import { onMounted, onUnmounted } from 'vue'

export function useEventListener(
  target: EventTarget,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
) {
  onMounted(() => {
    target.addEventListener(event, handler, options)
  })
  onUnmounted(() => {
    target.removeEventListener(event, handler, options)
  })
}
