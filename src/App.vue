<template>
  <div style="padding: 32px;">
    <h1>Welcome to Arco Design!</h1>
    <a-space direction="vertical" fill>
      <a-button type="primary">Primary Button</a-button>
      <a-input v-model="text" placeholder="Type something..." />
      <a-alert type="success" title="It works!" />
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('')
</script>
