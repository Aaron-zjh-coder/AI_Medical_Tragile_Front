import { watch } from 'vue'

export function useTitle(newTitle: string) {
  watch(
    () => newTitle,
    () => {
      document.title = newTitle
    },
    { immediate: true }
  )
}
