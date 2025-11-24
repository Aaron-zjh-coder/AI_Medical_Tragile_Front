<template>
  <div class="login-container">
    <a-card class="login-card" title="患者登录" :bordered="false">
      <a-form
        :model="form"
        :rules="rules"
        @submit="handleSubmit"
        layout="vertical"
      >
        <!-- 手机号输入 -->
        <a-form-item field="phone" label="手机号">
          <PhoneInput v-model="form.phone" />
        </a-form-item>

        <!-- 验证码输入 -->
        <a-form-item field="code" label="验证码">
          <CodeInput
            v-model="form.code"
            :phone="form.phone"
            @send="handleSendCode"
          />
        </a-form-item>

        <!-- 登录按钮 -->
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            long
            :loading="loading"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PhoneInput from '@/components/PhoneInput.vue'
import CodeInput from '@/components/CodeInput.vue'

// 表单数据
const form = reactive({
  phone: '',
  code: ''
})

// 表单验证规则
const rules = {
  phone: [
    { required: true, message: '请输入手机号' },
    { match: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
  ],
  code: [
    { required: true, message: '请输入验证码' },
    { match: /^\d{6}$/, message: '验证码为6位数字' }
  ]
}

// 加载状态
const loading = ref(false)

// 路由和状态管理
const router = useRouter()
const authStore = useAuthStore()

// 发送验证码（mock）
const handleSendCode = () => {
  console.log('发送验证码到:', form.phone)
  // 开发环境提示真实验证码
  alert(`验证码已发送到 ${form.phone}（开发环境 mock）\n真实验证码：123456`)
}

// 提交登录
const handleSubmit = async () => {
  loading.value = true
  try {
    // 模拟 API 登录成功
    const mockToken = 'patient_mock_token_123'
    const mockUser = { id: '1', name: '患者用户' }
    authStore.login(mockToken, mockUser)
    await router.push('/chat')
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

/* 全屏背景 */
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('/images/login-bg.png');
  background-size: cover;       /* 覆盖整个容器 */
  background-position: center;  /* 居中显示 */
  background-repeat: no-repeat; /* 不重复 */
  background-attachment: fixed; /* 固定背景，滚动时不动 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 400px;
  background-color: rgba(255, 255, 255, 0.85); /* 半透明白色背景 */
  backdrop-filter: blur(6px);   /* 毛玻璃效果（可选） */
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
</style>
