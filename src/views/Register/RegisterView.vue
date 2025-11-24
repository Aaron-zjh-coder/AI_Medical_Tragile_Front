<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="title">注册账号</h2>
      <a-form :model="form" @submit="handleSubmit" layout="vertical">
        <a-form-item
          field="contact"
          label="邮箱 或 手机号"
          :rules="[{
            required: true,
            message: '请输入邮箱或手机号'
          }, {
            validator: validateContact,
            message: '请输入有效的邮箱或手机号'
          }]"
        >
          <a-input
            v-model="form.contact"
            placeholder="例如：user@example.com 或 13812345678"
            allow-clear
          />
        </a-form-item>

        <a-form-item
          field="code"
          label="验证码"
          :rules="[{
            required: true,
            message: '请输入验证码'
          }, {
            len: 6,
            message: '验证码为6位数字'
          }]"
        >
          <div style="display: flex; gap: 12px;">
            <a-input
              v-model="form.code"
              placeholder="6位数字"
              style="flex: 1;"
              maxlength="6"
            />
            <a-button
              type="secondary"
              :disabled="!canSendCode || countdown > 0"
              @click="handleSendCode"
              :loading="sending"
            >
              <span v-if="countdown > 0">{{ countdown }}s 后重发</span>
              <span v-else>获取验证码</span>
            </a-button>
          </div>
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
            placeholder="至少6位字符"
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
          注册
        </a-button>
      </a-form>

      <div class="footer-links">
        <a-link @click="goToLogin">已有账号？去登录</a-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { UserInfo } from '@/stores/auth'
import { Message } from '@arco-design/web-vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  contact: '',
  code: '',
  password: ''
})

const loading = ref(false)
const sending = ref(false)
const countdown = ref(0)

let timer: number | null = null

const startCountdown = () => {
  countdown.value = 60
  if (timer) clearInterval(timer)
  timer = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else if (timer) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

const canSendCode = computed(() => {
  const val = form.contact.trim()
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  const isPhone = /^1[3-9]\d{9}$/.test(val)
  return isEmail || isPhone
})

// ✅ 修复 ESLint: no-explicit-any + unused-vars
const validateContact = (_rule: unknown, value: string): Promise<void> => {
  if (!value) return Promise.resolve()
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const isPhone = /^1[3-9]\d{9}$/.test(value)
  return isEmail || isPhone
    ? Promise.resolve()
    : Promise.reject(new Error('请输入有效的邮箱或手机号'))
}

const handleSendCode = async () => {
  if (!canSendCode.value) return

  sending.value = true
  try {
    // 模拟发送验证码
    await new Promise(resolve => setTimeout(resolve, 800))
    Message.success('验证码已发送，请注意查收')
    startCountdown()
  } catch {
    // ✅ 修复 ESLint: no-unused-vars — 省略 error 变量
    Message.error('发送失败，请稍后重试')
  } finally {
    sending.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}

const handleSubmit = async () => {
  const contact = form.contact.trim()
  const code = form.code.trim()
  const password = form.password.trim()

  if (!contact || !code || !password) {
    Message.warning('请填写完整信息')
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) && !/^1[3-9]\d{9}$/.test(contact)) {
    Message.warning('请输入有效的邮箱或手机号')
    return
  }

  if (code.length !== 6) {
    Message.warning('验证码必须为6位')
    return
  }

  loading.value = true
  try {
    const displayName = contact.includes('@')
      ? contact.split('@')[0]
      : contact

    const mockUser: UserInfo = {
      id: 'user-' + Date.now().toString(36),
      name: (displayName?.trim() ?? '') || '患者'
    }

    authStore.login('mock-patient-token-' + Date.now(), mockUser)
    Message.success('注册成功！')
    router.push('/')
  } catch (err) {
    // ✅ 使用了 err，避免 "unused var" 警告
    console.error('注册失败:', err)
    Message.error('注册失败，请检查信息')
  } finally {
    loading.value = false
  }
}

// 组件卸载时清理定时器
onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.register-card {
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
