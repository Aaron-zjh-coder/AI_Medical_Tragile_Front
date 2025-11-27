<template>
  <div class="sidebar-inner">
    <!-- 新对话按钮 -->
    <div class="sidebar-header">
      <a-button
        type="primary"
        size="large"
        block
        @click="handleNewChat"
        class="new-chat-btn"
      >
        <template #icon><a-icon type="plus" /></template>
        新对话
      </a-button>
    </div>

    <!-- 最近对话 -->
    <div class="sidebar-section">
      <div class="section-title">最近对话</div>
      <div class="conversation-list">
        <div
          v-for="session in chatStore.sessions"
          :key="session.chatSessionId"
          class="conversation-item"
          :class="{ active: session.chatSessionId === chatStore.chatId }"
          @click="handleSelectConversation(session.chatSessionId)"
        >
          {{ session.summary || '无标题对话' }}
          <a-icon
            type="delete"
            class="delete-icon"
            @click.stop="handleDelete(session.chatSessionId)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore()

const handleNewChat = () => {
  chatStore.startNewChat()
}

const handleSelectConversation = (chatSessionId: string) => {
  chatStore.selectSession(chatSessionId)
}

const handleDelete = (chatSessionId: string) => {
  // TODO: 实现删除 API
  console.warn('删除会话功能尚未实现:', chatSessionId)
}
</script>

<style scoped>
.sidebar-inner {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 0 16px;
  box-sizing: border-box;
  overflow-y: auto;
}
.sidebar-header {
  padding: 0 16px 16px;
}
.sidebar-section {
  margin-bottom: 16px;
  padding: 0 16px;
}
.section-title {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}
.conversation-list {
  max-height: 400px;
  overflow-y: auto;
}
.conversation-item {
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #1d2129;
}
.conversation-item:hover {
  background-color: #f9fafb;
}
.conversation-item.active {
  background-color: #eef2ff;
  font-weight: bold;
}
.delete-icon {
  opacity: 0.5;
  cursor: pointer;
}
.delete-icon:hover {
  opacity: 1;
  color: #ff4d4f;
}

/* >>> 仅新增：放大「新对话」按钮 <<< */
.new-chat-btn {
  width: 100% !important;
  font-size: 16px !important;
  height: 44px !important;
  padding: 0 20px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
}
</style>
