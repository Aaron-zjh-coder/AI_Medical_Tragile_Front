<template>
  <div class="chat-header">
    <div class="model-select">
      <a-select v-model:value="model" style="width: 160px">
        <a-option value="qwen3-max">医疗AI大模型</a-option>
      </a-select>
    </div>
    <div class="header-actions">
      <a-button type="text">下载电脑版</a-button>
      <a-button type="text">API 服务</a-button>
      <a-button type="text"><a-icon type="user" /></a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const model = ref('qwen3-max')
</script>

<style scoped>
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.model-select {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
