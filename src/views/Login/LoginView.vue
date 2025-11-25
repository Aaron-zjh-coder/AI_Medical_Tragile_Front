<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="title">医疗导诊系统</h2>

      <a-form :model="form" @submit="handleSubmit" layout="vertical">
        <a-form-item
          field="username"
          label="账号（邮箱或手机号）"
          :rules="[{
            required: true,
            message: '请输入邮箱或手机号'
          }, {
            validator: validateUsername,
            message: '请输入有效的邮箱或手机号'
          }]"
        >
          <a-input
            v-model="form.username"
            placeholder="例如：user@example.com 或 13812345678"
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
import { Message } from '@arco-design/web-vue'
import { useAuthStore } from '@/stores/auth'
import { loginApi } from '@/api/login'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

// 校验是否为有效邮箱或手机号
const isEmail = (str: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)
const isPhone = (str: string): boolean => /^1[3-9]\d{9}$/.test(str)

const validateUsername = (_rule: unknown, value: string): Promise<void> => {
  const trimmed = value.trim()
  return trimmed && (isEmail(trimmed) || isPhone(trimmed))
    ? Promise.resolve()
    : Promise.reject(new Error('请输入有效的邮箱或手机号'))
}

const goToRegister = () => {
  router.push('/register')
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()

  const username = form.username.trim()
  const password = form.password.trim()

  if (!username || !password) {
    Message.warning('请填写完整信息')
    return
  }

  loading.value = true
  try {
    const res = await loginApi({ username, password })
    authStore.login(res.token, res.user)
    Message.success('登录成功！')
    router.push('/')
  } catch (err) {
    console.error('登录异常:', err)

    let errorMsg = '登录失败，请检查账号或密码'

    if (err instanceof Error) {
      errorMsg = err.message
    }

    else if (
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      err.response &&
      typeof err.response === 'object'
    ) {
      const response = (err as { response: unknown }).response
      if (
        typeof response === 'object' &&
        response !== null &&
        'data' in response &&
        response.data
      ) {
        const data = (response as { data: unknown }).data
        if (
          typeof data === 'object' &&
          data !== null &&
          'message' in data &&
          typeof data.message === 'string'
        ) {
          errorMsg = data.message
        }
      }
    }

    else if (typeof err === 'string') {
      errorMsg = err
    }

    Message.error(errorMsg)
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
  background: url('/images/login-bg.png') no-repeat center center fixed;
  background-size:  cover;
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
