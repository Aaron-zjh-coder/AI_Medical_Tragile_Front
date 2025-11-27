<!-- src/components/chat/ChatMessageList.vue -->
<template>
  <div ref="containerRef" class="messages">
    <div
      v-for="(msg, index) in messages"
      :key="index"
      class="message"
      :class="{ 'message-user': msg.role === 'user', 'message-ai': msg.role === 'assistant' }"
    >
      <div class="message-bubble">{{ msg.content }}</div>
    </div>
    <div v-if="loading" class="message message-ai">
      <div class="message-bubble">
        <a-spin size="small" /> 正在思考...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ChatMessage } from '@/api/chat/types'

const props = defineProps<{
  messages: ChatMessage[]
  loading?: boolean
}>()

const containerRef = ref<HTMLDivElement | null>(null)

watch(
  () => props.messages,
  () => {
    scrollToBottom()
  },
  { deep: true }
)

const scrollToBottom = () => {
  if (containerRef.value) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight
  }
}
</script>

<style scoped>
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.message {
  display: flex;
  justify-content: flex-start;
}
.message-user {
  justify-content: flex-end;
}
.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}
.message-user .message-bubble {
  background-color: #165dff;
  color: white;
  border-bottom-right-radius: 4px;
}
.message-ai .message-bubble {
  background-color: white;
  color: #1d2129;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 4px;
}
</style>
