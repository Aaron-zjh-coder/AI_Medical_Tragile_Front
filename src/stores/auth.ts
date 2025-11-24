import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
  id: string
  name: string
  // 可根据后端实际字段扩展
}

export const useAuthStore = defineStore('auth', () => {
  // 修复点 1: token 初始化
  const token = ref<string | null>(localStorage.getItem('patient_token'))

  // 修复点 2: userInfo 初始化（关键！）
  const savedUserInfo = localStorage.getItem('patient_user_info')
  const initialUserInfo: UserInfo | null = savedUserInfo
    ? (JSON.parse(savedUserInfo) as UserInfo)
    : null
  const userInfo = ref<UserInfo | null>(initialUserInfo)

  const isLogin = computed(() => !!token.value)

  const login = (newToken: string, user: UserInfo) => {
    token.value = newToken
    userInfo.value = user
    localStorage.setItem('patient_token', newToken)
    localStorage.setItem('patient_user_info', JSON.stringify(user))
  }

  const logout = () => {
    token.value = null
    userInfo.value = null
    localStorage.removeItem('patient_token')
    localStorage.removeItem('patient_user_info')
  }

  return {
    token,
    userInfo,
    isLogin,
    login,
    logout
  }
})
