<template>
  <a-input
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    placeholder="请输入11位手机号"
    :max-length="11"
    allow-clear
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
