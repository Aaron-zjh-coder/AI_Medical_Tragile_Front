<template>
  <div class="chat-container">
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧边栏 -->
      <div class="sidebar">
        <a-button type="primary" class="new-chat-btn" @click="startNewChat">新对话</a-button>
        <div class="profile">
          <a-avatar src="/avatar.png" size="small" />
          <span class="profile-name">我的空间</span>
        </div>
      </div>

      <!-- 右侧聊天区 -->
      <div class="content-area">
        <!-- 消息列表 -->
        <div class="message-list">
          <!-- 欢迎语：仅当无消息时显示 -->
          <div v-if="messages.length === 0" class="welcome-message">
            你好，我是医疗导诊AI大模型
          </div>

          <!-- 渲染所有消息 -->
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="message"
            :class="{ 'role-user': msg.role === 'user', 'role-assistant': msg.role === 'assistant' }"
          >
            <div class="message-bubble">{{ msg.content }}</div>
          </div>
        </div>

        <!-- 输入区域：居中、不贴底、独立 -->
        <div class="input-wrapper">
          <div class="input-box-container">
            <a-textarea
              v-model="inputValue"
              placeholder="向我提问..."
              :auto-size="{ minRows: 1, maxRows: 4 }"
              class="input-box"
              @keydown.enter.exact.prevent="sendMessage"
            />
            <a-button type="primary" class="send-btn" @click="sendMessage">发送</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

const messages = ref<Message[]>([])
let nextId = 1
const inputValue = ref('')

const sendMessage = () => {
  const text = inputValue.value.trim()
  if (!text) return

  // 添加用户消息
  messages.value.push({ id: nextId++, role: 'user', content: text })
  inputValue.value = ''
  scrollToBottom()

  // 模拟 AI 回复（后续可替换为真实 API）
  setTimeout(() => {
    messages.value.push({
      id: nextId++,
      role: 'assistant',
      content: '感谢您的提问，我会尽快为您解答。'
    })
    scrollToBottom()
  }, 600)
}

const startNewChat = () => {
  messages.value = []
  inputValue.value = ''
}

const scrollToBottom = () => {
  nextTick(() => {
    const list = document.querySelector('.message-list')
    if (list) {
      list.scrollTop = list.scrollHeight
    }
  })
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9fafb;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 240px;
  background: white;
  border-right: 1px solid #e5e5e5;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.03);
}

.new-chat-btn {
  width: 100%;
  margin-bottom: 16px;
}

.profile {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
  position: relative;
}

.message-list {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* 欢迎语 - 居中大字 */
.welcome-message {
  font-size: 24px;
  font-weight: 600;
  color: #1d39c4;
  text-align: center;
  max-width: 80%;
  margin: 0 auto;
  padding: 24px;
  background: rgba(240, 245, 255, 0.7);
  border-radius: 12px;
  line-height: 1.5;
  opacity: 1;
}

/* 消息气泡 */
.message {
  display: flex;
  margin-bottom: 16px;
  max-width: 80%;
}

.role-user {
  justify-content: flex-end;
}

.role-assistant {
  justify-content: flex-start;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.role-user .message-bubble {
  background: #1890ff;
  color: white;
}

.role-assistant .message-bubble {
  background: #f9fafb;
  color: #333;
  border: 1px solid #e5e5e5;
}

/* 输入区域 */
.input-wrapper {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.input-box-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  max-width: 800px;
  width: 100%;
}

.input-box {
  flex: 1;
  min-height: 40px;
  padding: 10px 16px;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  resize: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-box:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.send-btn {
  height: 40px;
  padding: 0 20px;
  border-radius: 8px;
  font-weight: 500;
}
</style>
