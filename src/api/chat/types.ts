export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ChatResponseChunk {
  content: string
}

export interface ChatSessionListItem {
  chatSessionId: string
  summary: string
  createTime: string
  updateTime: string
}

export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

export interface ChatPromptDTO {
  prompt: string
  chatSessionId: string
}

export interface ChatSessionDetailDTO {
  chatSessionId: string
  summary: string
  createTime: string
  updateTime: string
  messages: ChatMessage[]
}
