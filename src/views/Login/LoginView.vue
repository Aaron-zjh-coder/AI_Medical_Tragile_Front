<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="title">医疗导诊系统</h2>
      <a-form :model="form" @submit="handleSubmit" layout="vertical">
        <a-form-item
          field="username"
          label="账号（邮箱/手机号）"
          :rules="[{
            required: true,
            message: '请输入邮箱或手机号'
          }]"
        >
          <a-input
            v-model="form.username"
            placeholder="请输入邮箱或手机号"
            allow-clear
          />
        </a-form-item>

        <a-form-item
          field="password"
          label="密码"
          :rules="[{
            required: true,
            message: '请输入密码'
          }, {
            minLength: 6,
            message: '密码至少6位'
          }]"
        >
          <a-input-password
            v-model="form.password"
            placeholder="请输入密码"
            allow-clear
          />
        </a-form-item>

        <a-button
          type="primary"
          html-type="submit"
          long
          :loading="loading"
          size="large"
        >
          登录
        </a-button>
      </a-form>

      <div class="footer-links">
        <a-link @click="goToRegister">没有账号？去注册</a-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { UserInfo } from '@/stores/auth' // ✅ type-only import
import { Message } from '@arco-design/web-vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const goToRegister = () => {
  router.push('/register')
}

const handleSubmit = async () => {
  const username = form.username.trim()
  const password = form.password.trim()

  if (!username || !password) {
    Message.warning('请填写完整信息')
    return
  }

  loading.value = true
  try {
    // 安全提取 name，确保结果为 string
    const rawName = username.includes('@')
      ? username.split('@')[0]
      : username

    // 处理可能的 undefined / 空字符串
    const displayName = (rawName?.trim() ?? '') || '患者'

    const mockUser: UserInfo = {
      id: 'user-' + Date.now().toString(36),
      name: displayName // ✅ 现在是 string，不是 string | undefined
    }

    authStore.login('mock-patient-token-' + Date.now(), mockUser)
    Message.success('登录成功！')
    router.push('/')
  } catch (error) {
    Message.error('登录失败，请检查账号密码')
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #1d39c4;
  margin-bottom: 28px;
}

.footer-links {
  text-align: center;
  margin-top: 20px;
}

:deep(.arco-form-item-label) {
  font-weight: 500;
  color: #333;
}
</style>
