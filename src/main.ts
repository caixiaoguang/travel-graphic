import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import VueCesium from 'vue-cesium'
import 'vue-cesium/dist/index.css'
import 'element-plus/theme-chalk/index.css'
import './styles/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueCesium)

app.mount('#app')
