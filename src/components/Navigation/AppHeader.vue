<template>
  <div
    class="app-header header-container user-header"
    v-if="variant === 'user'"
  >
    <div class="user-container" v-if="!isMobile && this.userStore.user">
      <small v-if="this.userStore.role === 'admin'">logged in as Admin</small>

      <!-- User Menu -->
      <div class="user-menu" ref="menuContainer" v-if="!userStore.isDemo">
        <!-- Profile Picture -->
        <img
          src="/static-profile-pic.png"
          alt="Profile Picture"
          class="profile-pic"
          @click="toggleMenu"
          @keydown.enter="toggleMenu"
          @keydown.space="toggleMenu"
          role="button"
          tabindex="0"
          :aria-expanded="isMenuOpen.toString()"
          aria-haspopup="true"
          aria-label="User menu"
        />
        <!-- Dropdown Menu -->
        <div
          v-if="isMenuOpen"
          class="menu"
          role="menu"
          aria-label="User menu options"
        >
          <div class="menu-header">
            <img
              src="/static-profile-pic.png"
              alt="Profile Picture"
              class="profile-pic-small"
            />
            <div class="user-info">
              <p>{{ userStore.user.displayName }}</p>
              <p>{{ userStore.user.email }}</p>
            </div>
          </div>
          <!-- <hr /> -->
          <ul class="menu-items-list">
            <li role="menuitem" @click="goToAccount" tabindex="0">
              <AppIcon name="circleUserRound" size="20" />My Account
            </li>

            <li role="menuitem" @click="userLogout" tabindex="0">
              <AppIcon name="logOut" size="20" />Sign Out
            </li>
          </ul>
          <!-- <hr /> -->
          <ul class="legal-items-list">
            <li role="menuitem" @click="goToTermsOfUse" tabindex="0">
              Terms of Use
            </li>
            <li role="menuitem" @click="goToPrivacyPolicy" tabindex="0">
              Privacy Policy
            </li>
            <li role="menuitem" @click="goToLegalNotice" tabindex="0">
              Legal Notice
            </li>
          </ul>
        </div>
      </div>
      <LinkButton
        v-if="this.userStore.isDemo"
        type="icon-text"
        icon="logOut"
        text="Leave Demo"
        @click="leaveDemoMode"
        id="btn-leave-demo"
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
          <ul role="menu" class="menu-mobile">
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
          </ul>
          <hr />
          <ul role="menu" class="user-menu-mobile">
            <li
              role="menuitem"
              aria-label="My Account"
              class="menu-item"
              @click="goToAccount"
              v-if="!userStore.isDemo"
            >
              My Account
            </li>
            <li
              role="menuitem"
              aria-label="Sign out"
              class="menu-item"
              @click="userLogout"
              v-if="!userStore.isDemo"
            >
              Sign Out
            </li>
            <li
              role="menuitem"
              aria-label="Leave demo"
              class="menu-item"
              @click="leaveDemoMode"
              v-if="userStore.isDemo"
            >
              Leave Demo
            </li>
          </ul>
          <hr />
          <ul role="menu" class="legal-menu-mobile">
            <li
              role="menuitem"
              aria-label="Terms of Use"
              class="menu-item"
              @click="goToTermsOfUse"
            >
              Terms of Use
            </li>
            <li
              role="menuitem"
              aria-label="Privacy Policy"
              class="menu-item"
              @click="goToPrivacyPolicy"
            >
              Privacy Policy
            </li>
            <li
              role="menuitem"
              aria-label="Legal Notice"
              class="menu-item"
              @click="goToLegalNotice"
            >
              Legal Notice
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
      isMenuOpen: false,
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
    async leaveDemoMode() {
      try {
        await this.userStore.leaveDemo();
        this.router.push({ name: "login" });
      } catch (error) {
        console.error("Error leaving Demo Mode:", error);
      }
    },
    goToHome() {
      this.$router.push({ name: "home" });
    },
    goToAccount() {
      this.$router.push({ name: "account" });
    },
    goToPrivacyPolicy() {
      this.$router.push({ name: "privacy-policy" });
    },
    goToLegalNotice() {
      this.$router.push({ name: "legal-notice" });
    },
    goToTermsOfUse() {
      this.$router.push({ name: "terms-of-use" });
    },
    isActive(link) {
      return this.activePath === link;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu(event) {
      // Close the menu if the click is outside of the menu container
      if (
        this.$refs.menuContainer &&
        !this.$refs.menuContainer.contains(event.target)
      ) {
        this.isMenuOpen = false;
      }
    },
    openMobileMenu() {
      this.isMobileMenuOpen = true;
      document.body.style.overflow = "hidden"; // Prevent scrolling on body
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = ""; // Restore scrolling on body
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
    document.addEventListener("mousedown", this.closeMenu);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateMobileState);
    document.removeEventListener("mousedown", this.closeMenu);
  },
};
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
}

.logo-container {
  cursor: pointer;
}

.header-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
  width: 100%;
  padding: 1rem;
  height: 4rem;
  position: relative;
  top: 0;
  left: 0;
}

/* Mobile navigation */
.mobile-nav {
  width: 100%;
  height: 100vh;
  overflow: hidden;
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
  overflow-y: auto;
}

.mobile-overlay nav {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  padding: 10vh 1.25rem 7vh 1.25rem;
}

.mobile-header {
  position: absolute;
  top: 0.8rem;
  right: 1.5rem;
}

.user-menu-mobile,
.menu-mobile {
  list-style: none;
  padding: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 0;
}

.legal-menu-mobile {
  list-style: none;
  padding: 1rem 0 2rem 0;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.legal-menu-mobile li {
  font-size: 0.9rem;
  opacity: 0.8;
  letter-spacing: 0.1px;
}

.user-menu-mobile li,
.menu-mobile li {
  padding: 0.75rem;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.07rem;
  cursor: pointer;
}

.mobile-overlay .menu-item {
  color: var(--base-black);
  text-decoration: none;
}

.mobile-overlay .active-link {
  text-decoration: underline;
  text-underline-offset: 0.5rem;
}

.user-menu {
  position: relative;
  text-align: left;
}

.profile-pic {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  margin: 2rem 0.75rem 0 0;
}

#btn-leave-demo {
  margin: 0.75rem 1rem 0 0;
}

.profile-pic:hover {
  outline: 3px solid var(--base-white);
}

hr {
  margin-inline: 35vw;
  border: none;
  border-top: 3px solid var(--sand-01);
}

.menu {
  position: absolute;
  top: 5.25rem;
  right: 0.65rem;
  background-color: var(--t-white-33);
  backdrop-filter: blur(7rem);
  border-radius: 0.85rem;
  box-shadow:
    0 0 2.2rem 0.75rem rgba(95, 70, 43, 0.095),
    0 0.125rem 0.3125rem 0.0625rem rgba(95, 70, 43, 0.08);
  width: 18rem;
  z-index: 100;
  overflow: hidden;
  padding: 1.25rem 0.55rem 0.75rem 0.55rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  font-size: 1rem;
  font-weight: 500;
}

.profile-pic-small {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  outline: none;
}

.menu-header {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  justify-content: start;
  align-items: center;
  font-size: 14px;
  padding: 0 0.9rem 0 0.9rem;
  letter-spacing: 0.0063rem;
}

.user-info p {
  line-height: 1.1rem;
}

.user-info p:last-of-type {
  font-weight: 400;
}

.menu-item {
  cursor: pointer;
}

.menu-items-list {
  list-style-type: none;
  padding: 0 0.5rem;
  margin: 0 0 0.25rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.legal-items-list {
  list-style-type: none;
  padding: 0.35rem 0.5rem;
  margin: 0;
  display: flex;
  flex-direction: row;
  gap: 0.4rem;
  justify-content: space-around;
  font-size: 12.5px;
}

.legal-items-list li {
  cursor: pointer;
  opacity: 0.75;
  letter-spacing: 0.0063rem;
  font-weight: 400;
}

.legal-items-list li:hover {
  cursor: pointer;
  opacity: 1;
}

.menu-items-list li {
  padding: 0.5rem;
  min-height: 2.5rem;
  cursor: pointer;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  justify-content: start;
}

.menu-items-list li:hover,
.menu-items-list li:focus {
  background-color: var(--t-white-66);
  outline: none;
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
