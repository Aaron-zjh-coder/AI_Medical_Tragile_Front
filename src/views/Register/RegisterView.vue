<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="title">注册账号</h2>
      <RegisterForm @register-success="handleRegisterSuccess" />
      <div class="footer-links">
        <a-link @click="goToLogin">已有账号？去登录</a-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import RegisterForm from '@/components/register/RegisterForm.vue'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const handleRegisterSuccess = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('/images/login.jpg') no-repeat center center fixed;
  background-size: cover;
}

.register-card {
  width: 100%;
  max-width: 400px;
  padding: 32px;
  /* 毛玻璃效果 */
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
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

/* 确保表单标签在半透明背景上清晰可见 */
:deep(.arco-form-item-label) {
  font-weight: 500;
  color: #333;
}
</style>
