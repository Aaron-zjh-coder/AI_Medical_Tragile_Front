// src/stores/chat.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getChatSessionList,
  createChatSession,
  getChatSessionDetail,
  sendChatMessage as apiSendChatMessage
} from '@/api/chat/sessionIndex'
import type {
  ChatMessage,
  ChatSessionListItem
} from '@/api/chat/types'

export const useChatStore = defineStore('chat', () => {
  const chatId = ref<string | null>(null)
  const messages = ref<ChatMessage[]>([])
  const currentAssistantMessage = ref('')
  const sessions = ref<ChatSessionListItem[]>([])
  const loading = ref(false)
  const initialized = ref(false) // ✅ 新增：是否初始化完成

  const displayMessages = computed<ChatMessage[]>(() => {
    const msgs = [...messages.value]
    if (currentAssistantMessage.value) {
      msgs.push({
        id: 'temp-assistant',
        role: 'assistant',
        content: currentAssistantMessage.value,
        timestamp: Date.now()
      })
    }
    return msgs
  })

  const loadSessions = async () => {
    loading.value = true
    try {
      const res = await getChatSessionList({ pageNum: 1, pageSize: 50 })
      const list = res?.list
      sessions.value = Array.isArray(list) ? list : []
      const firstSession = sessions.value[0]
      if (firstSession?.chatSessionId) {
        await selectSession(firstSession.chatSessionId)
      } else {
        await startNewChat()
      }
    } catch (error: unknown) {
      console.error('加载会话列表失败:', getErrorMessage(error))
      sessions.value = []
      await startNewChat()
    } finally {
      loading.value = false
      initialized.value = true // ✅ 标记初始化完成
    }
  }

  const startNewChat = async () => {
    try {
      const sessionId = await createChatSession()
      chatId.value = sessionId
      messages.value = []
      currentAssistantMessage.value = ''
      const newSession: ChatSessionListItem = {
        chatSessionId: sessionId,
        summary: '新对话',
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
      sessions.value.unshift(newSession)
    } catch (error: unknown) {
      console.error('创建新会话失败，使用临时会话:', getErrorMessage(error))
      // ✅ 关键：即使失败，也必须设置一个非 null 的 chatId！
      const tempId = `temp_${Date.now()}`
      chatId.value = tempId
      messages.value = []
      currentAssistantMessage.value = ''
      sessions.value.unshift({
        chatSessionId: tempId,
        summary: '临时对话（未保存）',
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      })
    }
  }

  const selectSession = async (sessionId: string) => {
    if (chatId.value === sessionId) return
    loading.value = true
    try {
      const detail = await getChatSessionDetail(sessionId)
      if (detail && Array.isArray(detail.messages)) {
        messages.value = detail.messages
      } else {
        messages.value = []
      }
      chatId.value = sessionId
      currentAssistantMessage.value = ''
    } catch (error: unknown) {
      console.error(`加载会话 ${sessionId} 失败:`, getErrorMessage(error))
      messages.value = []
    } finally {
      loading.value = false
    }
  }

  const sendChatMessage = async (userMessage: string) => {
    console.log('[STORE] sendChatMessage called with:', userMessage)
    console.log('[STORE] chatId:', chatId.value, 'loading:', loading.value, 'initialized:', initialized.value)

    // ✅ 如果尚未初始化完成，延迟重试（防止刚打开页面就发消息）
    if (!initialized.value) {
      console.warn('[STORE] 初始化未完成，300ms后重试...')
      setTimeout(() => sendChatMessage(userMessage), 300)
      return
    }

    if (!chatId.value) {
      console.error('[STORE] chatId 为空，无法发送消息')
      return
    }

    if (loading.value) {
      console.warn('[STORE] 正在加载，跳过重复发送')
      return
    }

    loading.value = true
    currentAssistantMessage.value = ''

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    }
    messages.value.push(userMsg)

    try {
      console.log('[STORE] 调用 API 发送消息...')
      const response = await apiSendChatMessage({
        prompt: userMessage,
        chatSessionId: chatId.value
      })

      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      }
      messages.value.push(assistantMsg)
    } catch (error: unknown) {
      console.error('发送消息失败:', getErrorMessage(error))
      messages.value.push({
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: '抱歉，我暂时无法回答，请稍后再试。',
        timestamp: Date.now()
      })
    } finally {
      loading.value = false
      currentAssistantMessage.value = ''
    }
  }

  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message
    if (typeof error === 'string') return error
    return '未知错误'
  }

  return {
    chatId,
    messages,
    currentAssistantMessage,
    sessions,
    loading,
    initialized, // ✅ 导出
    displayMessages,
    loadSessions,
    startNewChat,
    selectSession,
    sendChatMessage
  }
})
