<template>
  <div class="input-area">
    <a-input-group compact>
      <a-input
        v-model="inputText"
        placeholder="向我提问"
        :auto-focus="true"
        :disabled="loading"
        @keydown.enter.exact.prevent="handleSend"
        style="flex: 1; border-radius: 20px;"
      />

      <a-button
        type="primary"
        :disabled="!inputText.trim() || loading"
        @click="handleSend"
        style="border-radius: 20px; min-width: 60px;"
      >
        发送
      </a-button>
    </a-input-group>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

const { loading } = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'send', text: string): void
}>()

const inputText = ref('')

const handleSend = () => {
  const text = inputText.value.trim()
  if (!text) return
  emit('send', text)
  inputText.value = ''
}
</script>

<style scoped>
.input-area {
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.input-area :deep(.arco-input) {
  border-radius: 20px;
  border: 1px solid #d9d9d9;
  padding: 8px 12px;
  font-size: 14px;
}

.input-area :deep(.arco-input-group-addon) {
  background: #1d39c4;
  color: white;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.input-area :deep(.arco-input-group-addon):hover {
  background: #162a91;
}
</style>
