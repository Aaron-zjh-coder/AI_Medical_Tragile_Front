import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login/LoginView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register/RegisterView.vue'),
      meta: { guestOnly: true }
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

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLogin) {
    next('/login')
  } else if (to.meta.guestOnly && authStore.isLogin) {
    next('/chat')
  } else {
    next()
  }
})

export default router
