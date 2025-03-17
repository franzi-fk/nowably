<template>
  <div class="header-container">
    <h1>
      <img src="@/assets/logo-nowably.svg" alt="Logo Nowably" id="logo" @click="goToHome()" />
    </h1>
    <div class="role-container">
      <LinkButton type="text" text="Make me User" @click="setRoleToUser" />
      <LinkButton type="text" text="Make me Admin" @click="setRoleToAdmin" />
    </div>
    <!-- <LinkButton type="icon" icon="menu" iconSize="28" iconColor="#201A1A" /> -->
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import LinkButton from '@/components/InputsAndControls/LinkButton.vue'
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'AppHeader',
  components: {
    LinkButton,
  },
  data() {
    return {
      router: useRouter(),
      userStore: useUserStore(),
    }
  },
  methods: {
    goToHome() {
      this.router.push({ name: 'home' })
    },
    setRoleToAdmin() {
      this.userStore.setRoleToAdmin()
    },
    setRoleToUser() {
      this.userStore.setRoleToUser()
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
  backdrop-filter: blur(20px);
  top: 0;
  left: 0;
}

.role-container {
  display: flex;
  gap: 2rem;
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  /* .btn-link {
    display: none;
  } */
  .header-container {
    height: auto;
    padding: 1rem 1.8rem 1rem 1.8rem;
  }
}
</style>
