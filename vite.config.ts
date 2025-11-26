import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [ArcoResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 👇 添加 server 配置（关键！）
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // ← 替换为你的后端实际地址
        changeOrigin: true,
        secure: false
      }
    }
  }
})
