<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="title">医疗导诊系统</h2>

      <a-form :model="form" @submit="handleSubmit" layout="vertical">
        <a-form-item
          field="username"
      label="账号（邮箱/手机号/用户名）"
          :rules="[{
            required: true,
            message: '请输入账号'
          }, {
            validator: validateUsername,
            message: '请输入有效的邮箱、手机号或用户名（4-32位）'
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

// 校验邮箱/手机号/用户名
const isEmail = (str: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)
const isPhone = (str: string): boolean => /^(\+?86)?1[3-9]\d{9}$/.test(str)
const isUsername = (str: string): boolean => /^[a-zA-Z0-9_.-]{4,32}$/.test(str)
const detectLoginType = (value: string): 'PHONE_NUMBER' | 'EMAIL' | 'THIRD_PARTY' => {
  if (isPhone(value)) return 'PHONE_NUMBER'
  if (isEmail(value)) return 'EMAIL'
  return 'THIRD_PARTY'
}

const normalizeInput = (input: unknown): string => {
  if (input === undefined || input === null) {
    return ''
  }

  if (typeof input === 'string') {
    return input
  }

  if (typeof input === 'number' && Number.isFinite(input)) {
    return String(input)
  }

  if (typeof input === 'object') {
    const record = input as Record<string, unknown>

    if ('target' in record && record.target && typeof (record.target as { value?: unknown }).value === 'string') {
      return (record.target as { value: string }).value
    }

    if ('value' in record) {
      return normalizeInput(record.value)
    }
  }

  return ''
}

const validateUsername = (_rule: unknown, value: unknown): Promise<void> => {
  // 直接从 form 中取值，避免组件传递的中间对象导致类型不一致
  const raw = normalizeInput(value ?? form.username)
  const normalized = raw.normalize('NFKC')

  // 如果为空，则跳过验证（让 required 规则处理）
  const trimmed = normalized.trim()
  if (!trimmed) {
    return Promise.resolve()
  }

  // 移除零宽字符、不可见空白
  const sanitized = trimmed.replace(/[\u200B-\u200D\uFEFF]/g, '')
  if (!sanitized) {
    return Promise.resolve()
  }

  // 验证邮箱、手机号或普通用户名格式
  return isEmail(sanitized) || isPhone(sanitized) || isUsername(sanitized)
    ? Promise.resolve()
    : Promise.reject(new Error('请输入有效的邮箱、手机号或用户名（4-32位）'))
}

const goToRegister = () => {
  router.push('/register')
}

const getFieldValue = (
  source: unknown,
  key: 'username' | 'password'
): string => {
  if (
    source &&
    typeof source === 'object' &&
    source !== null &&
    key in (source as Record<string, unknown>)
  ) {
    const raw = (source as Record<string, unknown>)[key]
    return raw === undefined || raw === null ? '' : String(raw)
  }
  return form[key]
}

const handleSubmit = async (
  values?: unknown,
  e?: { preventDefault?: () => void }
) => {
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault()
  }

  const username = getFieldValue(values, 'username').trim()
  const password = getFieldValue(values, 'password').trim()

  // 同步回表单，保持 UI 显示为去除空格后的内容
  form.username = username
  form.password = password

  if (!username || !password) {
    Message.warning('请填写完整信息')
    return
  }

  loading.value = true
  try {
    const loginType = detectLoginType(username)
    const res = await loginApi({
      loginId: username,
      credential: password,
      loginType,
    })
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
