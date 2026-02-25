import './assets/tailwind.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true });
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/700.css'
import { mask } from 'vue-the-mask'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.directive('mask', mask)
app.mount('#app')
