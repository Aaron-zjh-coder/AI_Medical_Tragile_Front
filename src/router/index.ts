import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login/LoginView.vue'),
      meta: { guestOnly: true } // 未登录才能访问
    },
    {
      path: '/chat',
      name: 'Chat',
      component: () => import('@/views/Chat/ChatView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      redirect: '/login'
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLogin) {
    // 需要登录但未登录 → 跳转登录
    next('/login')
  } else if (to.meta.guestOnly && authStore.isLogin) {
    // 已登录用户访问登录页 → 跳转聊天页
    next('/chat')
  } else {
    next()
  }
})

export default router
