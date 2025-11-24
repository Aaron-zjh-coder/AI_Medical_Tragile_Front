import { defineStore } from 'pinia'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as Message[],
    loading: false
  }),

  actions: {
    // 添加一条消息
    addMessage(role: 'user' | 'assistant', content: string) {
      this.messages.push({
        id: Date.now().toString(),
        role,
        content,
        timestamp: Date.now()
      })
    },

    // 清空所有消息
    clearMessages() {
      this.messages = []
    },

    // 发送消息（目前是 mock）
    async sendMessage(userMessage: string) {
      if (!userMessage.trim() || this.loading) return

      // 1. 添加用户消息
      this.addMessage('user', userMessage)

      // 2. 开始加载
      this.loading = true

      try {
        // 模拟网络延迟（800ms）
        await new Promise(resolve => setTimeout(resolve, 800))

        // 3. 生成 AI 回复（简单规则）
        let aiReply = '感谢您的提问！作为一个 AI 导诊助手，我建议您：保持规律作息，饮食清淡，如有持续不适请及时前往医院就诊。'

        if (userMessage.includes('头痛') || userMessage.includes('头疼')) {
          aiReply = '头痛可能由紧张性头痛、偏头痛、高血压或颈椎问题引起。建议您：\n1. 记录头痛发作时间与诱因\n2. 避免熬夜和过度用眼\n3. 若头痛持续超过3天或伴有呕吐、视力模糊，请立即就诊神经内科。'
        } else if (userMessage.includes('发烧') || userMessage.includes('发热')) {
          aiReply = '发烧是身体对抗感染的正常反应。建议您：\n1. 多喝水，充分休息\n2. 体温超过38.5℃可服用退烧药（如布洛芬）\n3. 若高烧不退超过48小时，或出现皮疹、意识模糊，请立即就医。'
        } else if (userMessage.includes('咳嗽')) {
          aiReply = '咳嗽可能是感冒、支气管炎或过敏引起。建议：\n1. 避免冷空气和烟雾刺激\n2. 多喝温水，保持室内湿度\n3. 若咳黄痰、发热或持续超过2周，请就诊呼吸科。'
        }

        // 4. 添加 AI 回复
        this.addMessage('assistant', aiReply)
      } finally {
        this.loading = false
      }
    }
  }
})
