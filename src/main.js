import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import SolidButton from '@/components/InputsAndControls/SolidButton.vue'
import LinkButton from '@/components/InputsAndControls/LinkButton.vue'
import AppIcon from '@/components/Visuals/AppIcon.vue'
import AppHeader from '@/components/Navigation/AppHeader.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('SolidButton', SolidButton)
app.component('AppIcon', AppIcon)
app.component('AppHeader', AppHeader)
app.component('LinkButton', LinkButton)

app.mount('#app')
