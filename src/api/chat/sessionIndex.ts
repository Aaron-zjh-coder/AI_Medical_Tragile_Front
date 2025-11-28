import request from '@/utils/request'
import type {
  PageResult,
  ChatSessionListItem,
  ChatPromptDTO,
  ChatSessionDetailDTO
} from './types'

export function createChatSession(): Promise<string> {
  return request.get('/ai/chat/create').then(res => {
    // 尝试判断是否是业务错误响应
    if (res.data && typeof res.data === 'object' && 'code' in res.data) {
      const { code, message } = res.data as { code: string; message?: string }
      if (code !== '200') {
        throw new Error(message || '创建会话失败')
      }
      // 成功时 data 是字符串（sessionId）
      return res.data.data ?? res.data // 兼容两种格式
    }
    // 否则直接返回字符串（假设后端直接返回 sessionId）
    return res.data
  })
}

export function getChatSessionList(params: { pageNum: number; pageSize: number }): Promise<PageResult<ChatSessionListItem>> {
  return request.post('/ai/chat/list', params).then(res => {
    const data = res.data

    // 如果返回的是 { code, message, data } 格式
    if (data && typeof data === 'object' && 'code' in data) {
      if (data.code !== '200') {
        throw new Error(data.message || '加载会话列表失败')
      }
      // 成功：data.data 才是真正的 PageResult
      return data.data
    }

    // 否则假设 data 本身就是 PageResult（兼容旧逻辑）
    return data
  })
}

export function getChatSessionDetail(sessionId: string): Promise<ChatSessionDetailDTO> {
  return request.get('/ai/chat/detail', {
    params: { sessionId }
  }).then(res => {
    const data = res.data

    if (data && typeof data === 'object' && 'code' in data) {
      if (data.code !== '200') {
        throw new Error(data.message || '加载会话详情失败')
      }
      return data.data
    }

    return data
  })
}

export function sendChatMessage(data: ChatPromptDTO): Promise<string> {
  return request.post<string>('/ai/chat', data, {
    responseType: 'text'
  }).then(res => {
    return res.data
  })
}

export function getChatSessionCount(): Promise<number> {
  return request.post('/ai/chat/count').then(res => {
    const data = res.data

    if (data && typeof data === 'object' && 'code' in data) {
      if (data.code !== '200') {
        throw new Error(data.message || '获取会话数量失败')
      }
      // 假设成功时：{ code: "200", data: { count: 10 } }
      return (data.data as { count: number })?.count ?? 0
    }

    // 兼容直接返回 { count: 10 }
    return (data as { count: number })?.count ?? 0
  })
}
