<template>
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
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'
import VerificationCodeInput from './VerificationCodeInput.vue'

import {
  sendEmailVerificationCode as apiSendEmail,
  sendPhoneVerificationCode as apiSendPhone,
  registerByEmail,
  registerByPhone,
} from '@/api/register'
useRouter()
const emit = defineEmits<{ (e: 'register-success'): void }>()

const form = reactive({
  contact: '',
  code: '',
  password: ''
})

const loading = ref(false)

const sendEmailVerificationCode = async (email: string): Promise<void> => {
  await apiSendEmail(email)
}

const sendPhoneVerificationCode = async (phone: string): Promise<void> => {
  await apiSendPhone(phone)
}

const isEmail = (str: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)
const isPhone = (str: string): boolean => /^1[3-9]\d{9}$/.test(str)

const canSendCode = computed(() => {
  const val = form.contact.trim()
  return isEmail(val) || isPhone(val)
})

const validateContact = (_rule: unknown, value: string): Promise<void> => {
  return isEmail(value) || isPhone(value)
    ? Promise.resolve()
    : Promise.reject(new Error('请输入有效的邮箱或手机号'))
}

const onCodeSent = () => {

}

const handleSubmit = async () => {
  const contact = form.contact.trim()
  const code = form.code.trim()
  const password = form.password.trim()

  if (!contact || !code || !password) {
    Message.warning('请填写完整信息')
    return
  }

  const isValidEmail = isEmail(contact)
  const isValidPhone = isPhone(contact)

  if (!isValidEmail && !isValidPhone) {
    Message.warning('请输入有效的邮箱或手机号')
    return
  }

  if (code.length !== 6) {
    Message.warning('验证码必须为6位')
    return
  }

  loading.value = true
  try {
    let success: boolean

    if (isValidEmail) {
      const username = contact.split('@')[0] ?? 'unknown_user'
      const res = await registerByEmail({ username, email: contact, password, verifyCode: code })
      success = res.data
    } else {
      const username = `user_${contact.slice(-4)}`
      const res = await registerByPhone({ username, phoneNumber: contact, password, verifyCode: code })
      success = res.data
    }

    if (success) {
      Message.success('注册成功！')
      emit('register-success')
    } else {
      Message.error('注册失败，请检查验证码或信息是否正确')
    }
  } catch (err: unknown) {
    console.error('注册异常:', err)
    Message.error('注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>
