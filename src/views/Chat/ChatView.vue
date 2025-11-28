<template>
  <div class="chat-layout">
    <div class="sidebar">
      <div class="logo-section">
        <div class="logo-left">
          <div class="logo-icon">⚕️</div>
          <h1 class="logo-text">医疗导诊助手</h1>
        </div>
        <a-button type="text" size="small" @click="logout" class="logout-btn">
          登出
        </a-button>
      </div>
      <ChatSideBar />
    </div>
    <div class="chat-main">
      <ChatMessageList
        :messages="chatStore.displayMessages"
        :loading="chatStore.loading"
      />
      <!-- 保留 .input-float 结构，但改为正常流 -->
      <div class="input-float">
        <ChatInputBox
          @send="handleSend"
          :loading="chatStore.loading || !chatStore.initialized"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'
import { useChatStore } from '@/stores/chat'
import ChatSideBar from '@/components/chat/ChatSideBar.vue'
import ChatMessageList from '@/components/chat/ChatMessageList.vue'
import ChatInputBox from '@/components/chat/ChatInputBox.vue'

const chatStore = useChatStore()
const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  chatStore.loadSessions()
})

const handleSend = (text: string) => {
  console.log('[ChatView] 接收到消息:', text)
  if (!text.trim()) return
  chatStore.sendChatMessage(text)
}

const logout = async () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.chat-layout {
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7ff 0%, #eef2ff 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #e9edf5;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(10px);
}

.logo-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 0 8px;
}

.logo-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-icon {
  font-size: 28px;
  background: linear-gradient(135deg, #1d39c4 0%, #2a52be 100%);
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #1a2b6d;
  margin: 0;
  letter-spacing: -0.3px;
}

.logout-btn {
  font-size: 12px;
  color: #e53e3e !important;
  padding: 4px 8px;
  border-radius: 6px;
}

.logout-btn:hover {
  background-color: #fff5f5;
}

/* ====== 仅新增以下 3 行，解决布局问题 ====== */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
/* ========================================= */

.input-float {
  /* 移除 position: absolute，改为正常流 */
  padding: 0 20px 32px;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
}

.input-float :deep(.arco-input-group) {
  width: 100%;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  background: white;
  border: 1px solid #e9edf5;
  transition: box-shadow 0.3s ease;
}

.input-float :deep(.arco-input-group):focus-within {
  box-shadow: 0 8px 24px rgba(29, 57, 196, 0.25);
  border-color: #cbd5ff;
}

.input-float :deep(.arco-input) {
  border: none;
  padding: 12px 20px;
  font-size: 15px;
  border-radius: 24px;
  flex: 1;
  outline: none;
  color: #2d3748;
  background: transparent;
}

.input-float :deep(.arco-input::placeholder) {
  color: #a0aec0;
}

.input-float :deep(.arco-input-group-addon) {
  background: linear-gradient(135deg, #1d39c4 0%, #2a52be 100%);
  color: white;
  border-radius: 24px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  font-size: 15px;
  margin: 0 4px;
}

.input-float :deep(.arco-input-group-addon):hover {
  background: linear-gradient(135deg, #162a91 0%, #1d39c4 100%);
  transform: scale(1.03);
}

.input-float :deep(.arco-input-group-addon):active {
  transform: scale(1);
}
</style>
