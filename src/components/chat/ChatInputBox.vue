<template>
  <div class="input-area">
    <a-input-group compact>
      <a-input
        v-model="inputText"
        placeholder="向我提问"
        :auto-focus="true"
        @keydown.enter.exact.prevent="handleSend"
      />
      <a-button
        type="primary"
        :disabled="!inputText.trim() || loading"
        @click="handleSend"
        style="border-radius: 0 8px 8px 0;"
      >
        <template #icon><a-icon type="send" /></template>
      </a-button>
    </a-input-group>

    <div class="function-buttons">
      <a-button type="text" size="small">深度思考</a-button>
      <a-button type="text" size="small">深度研究</a-button>
      <a-button type="text" size="small">代码</a-button>
      <a-button type="text" size="small">翻译</a-button>
      <a-button type="text" size="small">图像</a-button>
      <a-button type="text" size="small">...</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore()
const inputText = ref('')
const loading = ref(false)

const handleSend = () => {
  const text = inputText.value.trim()
  if (!text) return
  chatStore.sendMessage(text)
  inputText.value = ''
}
</script>

<style scoped>
.input-area {
  padding: 24px;
  background-color: white;
  border-top: 1px solid #e5e7eb;
}

.function-buttons {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: center;
}
</style>
