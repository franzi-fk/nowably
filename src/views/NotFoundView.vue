<template>
  <div class="not-found page-padding-inline flex-grow">
    <h1 class="sr-only">404</h1>
    <Illus_404 width="18" />
    <h2>404 - Page not found</h2>
    <p>Oops... looks like the page you're looking for doesn't exist.</p>
    <SolidButton
      type="text"
      text="Go to Home"
      @click="goToHome"
      variant="primary"
      id="btn-go-home"
    />
  </div>
</template>

<script>
import Illus_404 from '../components/Visuals/Illus_404.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'NotFound',
  components: {
    Illus_404,
  },
  data() {
    return {
      router: useRouter(),
    }
  },
  methods: {
    goToHome() {
      this.router.push({ name: 'home' })
    },
  },
}
</script>

<style scoped>
.not-found {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 2rem;
  gap: 1.25rem;
}

#btn-go-home {
  margin-top: 1.75rem;
}

h2 {
  margin-top: 0.5rem;
}
</style>
