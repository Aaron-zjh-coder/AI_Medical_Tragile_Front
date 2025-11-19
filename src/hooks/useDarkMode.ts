import { useStorage } from './useStorage'

export function useDarkMode() {
  const isDark = useStorage('dark-mode', false)

  const toggleDark = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
      document.documentElement.classList.add('arco-dark')
    } else {
      document.documentElement.classList.remove('arco-dark')
    }
  }

  // 初始化
  if (isDark.value) {
    document.documentElement.classList.add('arco-dark')
  }

  return { isDark, toggleDark }
}
