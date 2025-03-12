<template>
  <div class="header-container">
    <h1>
      <img src="@/assets/logo-nowably.svg" alt="Logo Nowably" id="logo" @click="goToHome()" />
    </h1>
    <LinkButton type="icon" icon="menu" iconSize="28" iconColor="#201A1A" />
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'AppHeader',
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
#logo {
  margin-top: 0.75rem;
  cursor: pointer;
}

.header-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 0.6rem 1rem 1.25rem;
  height: 4.5rem;
  position: relative;
  background-color: var(--base-sand);
  backdrop-filter: blur(20px);
  top: 0;
  left: 0;
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .btn-link {
    display: none;
  }
  .header-container {
    height: auto;
  }
}
</style>
