<template>
  <div class="code-input-wrapper">
    <a-input
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      placeholder="请输入6位验证码"
      :max-length="6"
      allow-clear
      style="width: 200px"
    />
    <a-button
      type="primary"
      :disabled="!canSend"
      @click="handleSend"
      style="margin-left: 12px"
    >
      {{ buttonText }}
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const props = defineProps<{
  modelValue: string
  phone: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'send'): void
}>()

const countdown = ref(0)
let timer: number | null = null

const canSend = computed(() => {
  return /^1[3-9]\d{9}$/.test(props.phone) && countdown.value === 0
})

const buttonText = computed(() => {
  return countdown.value > 0 ? `${countdown.value}秒后重试` : '获取验证码'
})

const handleSend = () => {
  if (!canSend.value) return
  emit('send')
  startCountdown()
}

const startCountdown = () => {
  countdown.value = 60
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      if (timer) clearInterval(timer)
      timer = null
    }
  }, 1000)
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.code-input-wrapper {
  display: flex;
  align-items: center;
}
</style>
