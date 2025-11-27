export const chatWithAI = async (
  prompt: string,
  chatId: string,
  onChunk: (chunk: string) => void,
  onError: (error: Error) => void,
  signal?: AbortSignal
): Promise<void> => {
  try {
    // 构造带 query 参数的 URL
    const url = new URL('/api/v1/ai/chat', window.location.origin);
    url.searchParams.set('prompt', prompt);
    url.searchParams.set('chatId', chatId);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'text/html', // ✅ 关键修改：匹配后端 produces
      },
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
