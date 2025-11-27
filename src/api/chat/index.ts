export const chatWithAI = async (
  prompt: string,
  chatId: string,
  onChunk: (chunk: string) => void,
  onError: (error: Error) => void,
  signal?: AbortSignal
): Promise<void> => {
  try {
    // 🔑 1. 从 localStorage（或你的状态管理）获取 token
    const token = localStorage.getItem('token'); // 👈 根据你实际存的 key 调整
    if (!token) {
      throw new Error('用户未登录，请先登录');
    }

    const response = await fetch('/api/v1/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // 🔑 2. 添加这一行！
      },
      body: JSON.stringify({
        prompt,
        chatSessionId: chatId,
      }),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      onError(error as Error);
    }
  }
};
