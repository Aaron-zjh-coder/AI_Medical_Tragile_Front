<template>
  <!-- 移除 :model 和 @submit，不再使用 Arco 表单校验 -->
  <a-form layout="vertical">
    <a-form-item label="邮箱 或 手机号">
      <a-input
        v-model="form.contact"
        placeholder="例如：user@example.com 或 13812345678"
        allow-clear
        ref="contactInputRef"
      />
    </a-form-item>

    <a-form-item label="验证码">
      <VerificationCodeInput
        :contact="form.contact"
        :code="form.code"
        :can-send="canSendCode"
        @update:code="form.code = $event"
        @send-success="onCodeSent"
        :on-send-email="sendEmailVerificationCode"
        :on-send-phone="sendPhoneVerificationCode"
      />
    </a-form-item>

    <a-form-item label="密码">
      <a-input-password
        v-model="form.password"
        placeholder="至少6位字符"
        autocomplete="new-password"
        allow-clear
      />
    </a-form-item>

    <!-- 改为 @click，手动触发 -->
    <a-button
      type="primary"
      long
      :loading="loading"
      size="large"
      @click="handleSubmit"
    >
      注册
    </a-button>
  </a-form>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { Message } from '@arco-design/web-vue'
import type { InputInstance } from '@arco-design/web-vue'
import VerificationCodeInput from './VerificationCodeInput.vue'
import {
  sendEmailVerificationCode as apiSendEmail,
  sendPhoneVerificationCode as apiSendPhone,
  registerByEmail,
  registerByPhone,
} from '@/api/register'

const emit = defineEmits<{ (e: 'register-success'): void }>()

const form = reactive({
  contact: '',
  code: '',
  password: ''
})

const loading = ref(false)
const contactInputRef = ref<InputInstance | null>(null)

const sendEmailVerificationCode = async (email: string): Promise<void> => {
  await apiSendEmail(email)
}
const sendPhoneVerificationCode = async (phone: string): Promise<void> => {
  await apiSendPhone(phone)
}

const canSendCode = computed(() => {
  const val = form.contact.trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^1[3-9]\d{9}$/.test(val)
})

const onCodeSent = () => {}

const handleSubmit = async () => {
  // 🔥 现在一定会执行！
  const realContact = contactInputRef.value?.inputRef?.value?.trim() || ''
  console.log('[DEBUG] 真实 contact 值:', realContact) // 👈 你现在应该能看到这行！

  const code = form.code.trim()
  const password = form.password.trim()

  if (!realContact) {
    Message.warning('请输入邮箱或手机号')
    return
  }

  if (!code || code.length !== 6) {
    Message.warning('请输入6位验证码')
    return
  }

  if (!password || password.length < 6) {
    Message.warning('密码至少6位')
    return
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(realContact)
  const isPhone = /^1[3-9]\d{9}$/.test(realContact)

  if (!isEmail && !isPhone) {
    Message.warning('请输入有效的邮箱或手机号')
    return
  }

  loading.value = true
  try {
    let success: boolean
    if (isEmail) {
      const username = realContact.split('@')[0] ?? 'unknown_user'
      const res = await registerByEmail({ username, email: realContact, password, verifyCode: code })
      success = res.data
    } else {
      const username = `user_${realContact.slice(-4)}`
      const res = await registerByPhone({ username, phoneNumber: realContact, password, verifyCode: code })
      success = res.data
    }

    if (success) {
      Message.success('注册成功！')
      emit('register-success')
    } else {
      Message.error('注册失败，请检查验证码或信息是否正确')
    }
  } catch (err) {
    console.error('注册异常:', err)
    Message.error('注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>
