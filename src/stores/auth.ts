import { defineStore } from 'pinia'
import type { User } from '@/api/login/types'

export interface AuthState {
  token: string | null
  userInfo: User | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    userInfo: null,
  }),

  getters: {
    isLogin: (state) => !!state.token,
  },

  actions: {
    login(token: string, user: User) {
      this.token = token
      this.userInfo = user
      localStorage.setItem('token', token)
    },
    logout() {
      this.token = null
      this.userInfo = null
      localStorage.removeItem('token')
    },
  },
})
