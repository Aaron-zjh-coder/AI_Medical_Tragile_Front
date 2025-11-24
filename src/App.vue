<template>
  <router-view />
</template>

<script setup lang="ts">
// App.vue 不包含任何业务逻辑，只作为路由出口
</script>

<style>
/* 可选：全局重置或基础样式 */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f7fa;
}
#app {
  min-height: 100vh;
}
</style>
