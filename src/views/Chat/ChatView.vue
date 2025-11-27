<template>
  <div class="chat-layout">
    <div class="sidebar">
      <div class="logo-section">
        <div class="logo-icon">⚕️</div>
        <h1 class="logo-text">医疗导诊助手</h1>
      </div>

      <div class="new-chat-btn">
        <a-button type="primary" long @click="startNewChat" size="large">
          + 新对话
        </a-button>
      </div>

      <div class="logout-section">
        <a-button type="text" status="danger" @click="logout">登出</a-button>
      </div>
    </div>

    <div class="chat-main">
      <ChatMessageList
        :messages="chatStore.displayMessages"
        :loading="chatStore.loading"
      />

      <div class="input-float">
        <ChatInputBox
          @send="handleSend"
          :loading="chatStore.loading"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'
import { useChatStore } from '@/stores/chat'
import ChatMessageList from '@/components/chat/ChatMessageList.vue'
import ChatInputBox from '@/components/chat/ChatInputBox.vue'

const chatStore = useChatStore()
const router = useRouter()
const authStore = useAuthStore()
const { sendMessage, startNewChat } = chatStore

const handleSend = (text: string) => {
  if (!text.trim() || chatStore.loading) return
  sendMessage(text)
}

const logout = async () =>{
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.chat-layout {
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.03);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
  padding: 0 8px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #1d39c4;
  margin: 0;
}

.new-chat-btn {
  padding: 0 8px;
}

.new-chat-btn :deep(.arco-btn) {
  border-radius: 8px;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(29, 57, 196, 0.15);
  transition: all 0.2s;
}

.new-chat-btn :deep(.arco-btn):hover {
  background: #162a91;
  transform: translateY(-1px);
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  position: relative;
}

.input-float {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  padding: 0 16px;
}

.input-float :deep(.arco-input-group) {
  width: 100%;
  max-width: 600px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: white;
  border: none;
  padding: 4px;
}

.input-float :deep(.arco-input) {
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 20px;
  flex: 1;
  outline: none;
}

.input-float :deep(.arco-input-group-addon) {
  background: #1d39c4;
  color: white;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.input-float :deep(.arco-input-group-addon):hover {
  background: #162a91;
}

.logout-section {
  margin-top: auto; /* 推到 sidebar 底部 */
  padding: 0 8px;
  margin-top: 24px;
}

.logout-section :deep(.arco-btn) {
  color: #ff4d4f;
  font-weight: 500;
  justify-content: flex-start;
}
</style>
