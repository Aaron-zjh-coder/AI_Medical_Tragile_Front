import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
  id: string
  name: string
  // 你可以根据后端返回补充字段，比如 email / phone 等
}

// 可选：如果你的 API 返回更多字段，可以扩展，例如：
// export interface UserInfo {
//   id: string
//   name: string
//   email?: string
//   phone?: string
//   avatar?: string
// }

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('patient_token'))

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

  // 如果你暂时不需要对接真实 API，下面三个方法可以先注释掉
  // 等有后端接口后再启用

  // ====== 以下为可选：对接后端 API 所需逻辑 ======
  /*
  import axios from 'axios'

  const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
  })

  api.interceptors.request.use(config => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
  })

  const performLogin = async (username: string, password: string) => {
    const res = await api.post<{ token: string; user: UserInfo }>('/auth/login', { username, password })
    login(res.data.token, res.data.user)
    return true
  }

  const performRegister = async (data: { email?: string; phone?: string; password: string; code: string }) => {
    const res = await api.post<{ token: string; user: UserInfo }>('/auth/register', data)
    login(res.data.token, res.data.user)
    return true
  }

  const sendVerificationCode = async (email?: string, phone?: string) => {
    await api.post('/auth/send-code', { email, phone })
    return true
  }

  return {
    token,
    userInfo,
    isLogin,
    login,
    logout,
    performLogin,
    performRegister,
    sendVerificationCode
  }
  */
  // ============================================

  // ⚠️ 如果你还没准备 API，先返回基础方法（无网络请求）
  return {
    token,
    userInfo,
    isLogin,
    login,
    logout
  }
})
