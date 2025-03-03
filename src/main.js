import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import SolidButton from './components/SolidButton.vue'
import LinkButton from './components/LinkButton.vue'
import AppIcon from './components/AppIcon.vue'
import AppHeader from './components/AppHeader.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('SolidButton', SolidButton)
app.component('AppIcon', AppIcon)
app.component('AppHeader', AppHeader)
app.component('LinkButton', LinkButton)

app.mount('#app')
