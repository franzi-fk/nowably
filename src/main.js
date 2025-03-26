import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import SolidButton from '@/components/InputsAndControls/SolidButton.vue'
import LinkButton from '@/components/InputsAndControls/LinkButton.vue'
import AppIcon from '@/components/Visuals/AppIcon.vue'
import AppHeader from '@/components/Navigation/AppHeader.vue'
import { auth } from './firebaseConfig' // Import your Firebase Auth instance
import { useUserStore } from './stores/userStore'
import { createUserIfNotExists } from './firebaseService.js'

const app = createApp(App)
const pinia = createPinia()

app.component('SolidButton', SolidButton)
app.component('AppIcon', AppIcon)
app.component('AppHeader', AppHeader)
app.component('LinkButton', LinkButton)

// Register Pinia and Router before using the store
app.use(pinia)
app.use(router)

// Flag to ensure the app is mounted only once
let isAppMounted = false

// Wait for Firebase Auth to resolve before mounting
auth.onAuthStateChanged(async (user) => {
  const userStore = useUserStore()

  if (user) {
    // Set user in the user store
    userStore.setUser(user)

    // Ensure user document exists in Firestore
    await createUserIfNotExists(user)
  } else {
    // Log user out
    userStore.logout()
  }

  // Mount the app only if it hasn't been mounted yet
  if (!isAppMounted) {
    app.mount('#app')
    isAppMounted = true
  }
})
