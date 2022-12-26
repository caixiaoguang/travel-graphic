import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import VueCesium from 'vue-cesium'
import 'vue-cesium/dist/index.css'
import 'element-plus/theme-chalk/index.css'
import './styles/main.scss'
import './styles/element.scss'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

window.baseUrl = import.meta.env.BASE_URL || '/'

app.use(createPinia())
app.use(router)
app.use(VueCesium, {
  mars3dConfig: {
    include: 'mars3d',
    // libs: {
    //   mars3d: ['https://cdn.jsdelivr.net/npm/mars3d-cesium@1.96.8/Build/Cesium/index.min.js'],
    // },
  },
})

app.mount('#app')
