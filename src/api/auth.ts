import axios from 'axios'
import type { UserInfo } from '@/stores/auth.ts'

const api = axios.create({
  baseURL: '/api', // 根据你的后端地址调整
  timeout: 10000,
})

// 请求拦截器（自动带 token）
api.interceptors.request.use(config => {
  const token = localStorage.getItem('patient_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authApi = {
  // 登录
  login(data: { username: string; password: string }) {
    return api.post<{ token: string; user: UserInfo }>('/auth/login', data)
  },

  // 注册
  register(data: { email?: string; phone?: string; password: string; code: string }) {
    return api.post<{ token: string; user: UserInfo }>('/auth/register', data)
  },

  // 发送验证码
  sendCode(data: { email?: string; phone?: string }) {
    return api.post('/auth/send-code', data)
  }
}
