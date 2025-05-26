import App from '@/App.vue'
import router from '@/router/index'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import '@/styles/app.less'

async function main() {
  const pinia = createPinia()
  const app = createApp(App)

  app.use(pinia)
  app.use(router)

  app.mount('#app')
}

main()
