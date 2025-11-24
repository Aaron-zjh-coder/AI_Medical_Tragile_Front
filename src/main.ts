import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@arco-design/web-vue/dist/arco.css'

// 👇 关键：确保 body 样式被强制重置（运行时注入）
const resetStyle = document.createElement('style')
resetStyle.textContent = `
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    height: 100% !important;
    width: 100% !important;
    overflow: hidden !important;
    display: block !important;
    align-items: unset !important;
    justify-content: unset !important;
    position: static !important;
    box-sizing: border-box !important;
  }
  #app {
    height: 100% !important;
    width: 100% !important;
    overflow: hidden !important;
    position: relative !important;
  }
`
document.head.appendChild(resetStyle)

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
