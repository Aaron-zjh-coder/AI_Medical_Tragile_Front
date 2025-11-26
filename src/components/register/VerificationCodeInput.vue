<template>
  <div class="code-input-wrapper">
    <!-- ✅ 修复：使用 :value + @input 显式绑定 -->
    <a-input
      :value="props.code"
      @input="(value: string) => emit('update:code', value)"
      placeholder="6位数字"
      style="flex: 1;"
      maxlength="6"
    />
    <a-button
      type="secondary"
      :disabled="!canSend || countdown > 0"
      @click="handleSend"
      :loading="sending"
    >
      <span v-if="countdown > 0">{{ countdown }}s 后重发</span>
      <span v-else>获取验证码</span>
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { Message } from '@arco-design/web-vue'

const props = defineProps<{
  contact: string
  code: string
  canSend: boolean
  onSendEmail: (email: string) => Promise<void>
  onSendPhone: (phone: string) => Promise<void>
}>()

const emit = defineEmits<{
  (e: 'update:code', value: string): void
  (e: 'send-success'): void
}>()

// ✅ 移除了 localCode，完全受控
const sending = ref(false)
const countdown = ref(0)
let timer: number | null = null

const startCountdown = () => {
  countdown.value = 60
  if (timer) clearInterval(timer)
  timer = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else if (timer) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

const isEmail = (str: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)

const handleSend = async () => {
  if (!props.canSend) return

  const contact = props.contact.trim()
  sending.value = true
  try {
    if (isEmail(contact)) {
      await props.onSendEmail(contact)
    } else {
      await props.onSendPhone(contact)
    }
    Message.success('验证码已发送，请注意查收')
    emit('send-success')
    startCountdown()
  } catch {
    Message.error('发送失败，请稍后重试')
  } finally {
    sending.value = false
  }
}

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped>
.code-input-wrapper {
  display: flex;
  gap: 12px;
}
</style>
