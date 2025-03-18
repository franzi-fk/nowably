<template>
  <div class="app-header header-container">
    <div class="role-container">
      <LinkButton type="text" text="Make me User" @click="setRoleToUser" />
      <LinkButton type="text" text="Make me Admin" @click="setRoleToAdmin" />
    </div>
    <!-- <LinkButton type="icon" icon="menu" iconSize="28" iconColor="#201A1A" /> -->
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'AppHeader',
  data() {
    return {
      userStore: useUserStore(),
    }
  },
  methods: {
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
.header-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
  width: 100%;
  padding: 1rem 0.6rem 1rem 1.25rem;
  height: 4rem;
  position: relative;
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
