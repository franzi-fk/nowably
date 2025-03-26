<template>
  <div
    class="app-header header-container user-header"
    v-if="variant === 'user'"
  >
    <div class="user-container" v-if="!isMobile && this.userStore.user">
      <small v-if="this.userStore.role === 'admin'">logged in as Admin</small>
      <LinkButton
        type="icon-text"
        icon="logOut"
        text="Sign out"
        @click="userLogout"
      />
    </div>

    <!-- Mobile Navigation -->
    <div v-if="isMobile && this.userStore.user" class="mobile-nav">
      <NowablyLogo width="10" variant="full" @click="goToHome" />
      <LinkButton
        type="icon"
        icon="Menu"
        @click="openMobileMenu"
        aria-label="Open mobile menu"
        iconSize="32"
        iconColor="var(--base-black)"
      />

      <div
        v-if="isMobileMenuOpen"
        class="mobile-overlay"
        role="dialog"
        aria-modal="true"
      >
        <div class="mobile-header">
          <LinkButton
            type="icon"
            icon="x"
            iconSize="32"
            iconColor="var(--base-black)"
            class="close-icon"
            @click="closeMobileMenu"
            aria-label="Close mobile menu"
          />
        </div>

        <nav aria-label="Navigation">
          <ul role="menu">
            <router-link
              v-for="(item, index) in userMenu"
              :key="index"
              :to="item.link"
              role="menuitem"
              :aria-label="'Go to ' + item.name"
              active-class="active-link"
              class="menu-item"
            >
              <li
                role="none"
                :class="{ active: isActive(item.link) }"
                @click="closeMobileMenu"
              >
                <span>{{ item.name }}</span>
              </li>
            </router-link>
            <li>
              <LinkButton
                type="text"
                text="Sign out"
                @click="userLogout"
                id="btn-logout"
              />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/userStore";
import { useAppStore } from "@/stores/appStore";
import { useRouter } from "vue-router";
import NowablyLogo from "@/components/Visuals/NowablyLogo.vue";

export default {
  name: "AppHeader",
  components: {
    NowablyLogo,
  },
  props: {
    variant: {
      type: String,
      default: "user",
    },
  },
  data() {
    return {
      userStore: useUserStore(),
      appStore: useAppStore(),
      router: useRouter(),
      userMenu: [],
      adminMenu: [],
      isMobileMenuOpen: false,
      isMobile: window.innerWidth <= 768,
    };
  },
  computed: {
    activePath() {
      return this.$route.path;
    },
  },
  methods: {
    async userLogout() {
      try {
        await this.userStore.logout();
        this.router.push({ name: "login" });
      } catch (error) {
        console.error("Error logging out:", error);
      }
    },
    setRoleToAdmin() {
      this.userStore.setRoleToAdmin();
    },
    setRoleToUser() {
      this.userStore.setRoleToUser();
    },
    goToHome() {
      this.$router.push({ name: "home" });
    },
    isActive(link) {
      return this.activePath === link;
    },
    openMobileMenu() {
      this.isMobileMenuOpen = true;
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false;
    },
    updateMobileState() {
      this.isMobile = window.innerWidth <= 992;
      if (!this.isMobile) {
        this.isMobileMenuOpen = false;
      }
    },
  },
  mounted() {
    this.userMenu = this.appStore.userMenuNav;
    this.adminMenu = this.appStore.adminMenuNav;
    this.updateMobileState();
    window.addEventListener("resize", this.updateMobileState);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateMobileState);
  },
};
</script>

<style scoped>
.logo-container {
  cursor: pointer;
}

.header-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1.75rem 0.5rem 1rem 1.1rem;
  height: 4rem;
  position: relative;
  top: 0;
  left: 0;
}

.user-container {
  display: flex;
  gap: 2rem;
  margin-left: auto;
  margin-right: 1rem;
  align-items: center;
}

/* Mobile navigation */
.mobile-nav {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--secondary);
  color: var(--base-black);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 200;
  transition: transform 0.3s ease-in-out;
}

.mobile-header {
  position: absolute;
  top: 0.8rem;
  right: 1.5rem;
}

.mobile-overlay ul {
  list-style: none;
  padding: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.mobile-overlay li {
  padding: 0.75rem;
  font-size: 1.3rem;
  font-weight: 500;
  letter-spacing: 0.07rem;
}

.mobile-overlay .menu-item {
  color: var(--base-black);
  text-decoration: none;
}

.mobile-overlay .active-link {
  text-decoration: underline;
  text-underline-offset: 0.5rem;
}

/*_______________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .sidebar {
    display: flex; /* Show desktop sidebar on mobile */
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
}

/* X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
}

/* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {
}
</style>
