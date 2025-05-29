import './assets/tailwind.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' 
import '@fontsource/cormorant-garamond/400.css'  // normal
import '@fontsource/cormorant-garamond/700.css'  // bold
import { mask } from 'vue-the-mask'


const app = createApp(App)
app.use(router)  // ⬅️ Yeni satır
app.directive('mask', mask)
app.mount('#app')
