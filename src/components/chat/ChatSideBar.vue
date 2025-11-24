<template>
  <div class="sidebar">

    <div class="sidebar-header">
      <a-button type="primary" size="small" block @click="handleNewChat">
        <template #icon><a-icon type="plus" /></template>
        新对话
      </a-button>
    </div>

    <div class="sidebar-section">
      <div class="section-title">对话分组</div>
      <a-button type="text" size="small" @click="handleAddGroup">
        <template #icon><a-icon type="plus" /></template>
      </a-button>
    </div>

    <div class="sidebar-section">
      <div class="section-title">最近对话</div>
      <div class="conversation-list">
        <div
          v-for="(conv, index) in conversations"
          :key="index"
          class="conversation-item"
          @click="handleSelectConversation(index)"
        >
          {{ conv.title }}
          <a-icon type="delete" class="delete-icon" />
        </div>
      </div>
    </div>

    <div class="sidebar-footer">
      <a-avatar size="small" src="/avatar.png" />
      <div class="space-text">我的空间</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const conversations = ref([
  { title: '三九解释一下' },
  { title: '前端项目创建与配置' },
  { title: '11月21-22日，由开放原子开源...' },
  { title: '粤语中"67"和"踢波"的含义解释' },
  { title: '苹果公司2024财年财务与...' }
])

const handleNewChat = () => {
  console.log('新建对话')
}

const handleAddGroup = () => {
  console.log('添加分组')
}

const handleSelectConversation = (index: number) => {
  console.log('选择对话', index)
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  padding: 16px 0;
  box-sizing: border-box;
  overflow-y: auto;
}

.sidebar-header {
  padding: 0 16px 16px;
}

.sidebar-section {
  margin-bottom: 16px;
  padding: 0 16px;
}

.section-title {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

.conversation-list {
  max-height: 400px;
  overflow-y: auto;
}

.conversation-item {
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #1d2129;
}

.conversation-item:hover {
  background-color: #f9fafb;
}

.delete-icon {
  opacity: 0.5;
  cursor: pointer;
}

.sidebar-footer {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.space-text {
  font-size: 12px;
  color: #6b7280;
}
</style>
