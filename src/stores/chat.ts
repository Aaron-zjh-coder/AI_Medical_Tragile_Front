import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { chatWithAI } from '@/api/chat'
import type { ChatMessage } from '@/api/chat/types'

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])
  const loading = ref(false)
  const chatId = ref<string>(generateUUID())
  const abortController = ref<AbortController | null>(null)
  const currentAssistantMessage = ref('')

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    messages.value.push({
      id: generateUUID(),
      role,
      content,
      timestamp: Date.now(),
    })
  }

  const sendMessage = async (prompt: string) => {
    if (loading.value) return

    addMessage('user', prompt)
    currentAssistantMessage.value = ''
    loading.value = true

    if (abortController.value) {
      abortController.value.abort()
    }
    abortController.value = new AbortController()

    await chatWithAI(
      prompt,
      chatId.value,
      (chunk) => {
        currentAssistantMessage.value += chunk
      },
      (error) => {
        console.error('AI 聊天错误:', error)
        currentAssistantMessage.value += `\n[系统错误: ${error.message}]`
      },
      abortController.value.signal
    )

    if (currentAssistantMessage.value) {
      addMessage('assistant', currentAssistantMessage.value)
    }

    currentAssistantMessage.value = ''
    loading.value = false
  }

  const startNewChat = () => {
    messages.value = []
    chatId.value = generateUUID()
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
    }
  }

  const displayMessages = computed(() => {
    return [...messages.value, ...(currentAssistantMessage.value ? [{
      id: 'streaming',
      role: 'assistant' as const,
      content: currentAssistantMessage.value,
      timestamp: Date.now(),
    }] : [])]
  })

  return {
    messages,
    loading,
    chatId,
    currentAssistantMessage,
    displayMessages,
    sendMessage,
    startNewChat,
  }
})
