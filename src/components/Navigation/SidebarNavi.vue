<template>
  <nav
    :class="['sidebar', { collapsed: isCollapsed }]"
    aria-label="Main navigation"
    v-if="variant === 'user'"
  >
    <div class="navi-header">
      <h1 aria-label="Logo Nowably" @click="goToHome">
        <NowablyLogo
          :width="isCollapsed ? '3' : '10'"
          :variant="isCollapsed ? 'reduced' : 'full'"
        />
      </h1>
    </div>
    <ul v-if="!isCollapsed" role="menu" aria-label="Main menu">
      <li
        v-for="(item, index) in menuUser"
        :key="index"
        role="none"
        :class="{ active: isActive(item.link) }"
      >
        <router-link
          :to="item.link"
          role="menuitem"
          :aria-label="'Go to ' + item.name"
          active-class="active-link"
          class="menu-item"
        >
          <AppIcon
            v-if="item.icon"
            :class="['icon', item.icon]"
            :name="item.icon"
            color="currentColor"
          />
          <span>{{ item.name }}</span>
        </router-link>
      </li>
    </ul>
    <ul v-else role="menu" aria-label="Collapsed menu">
      <li
        v-for="(item, index) in menuUser"
        :key="index"
        role="none"
        :class="{ active: isActive(item.link) }"
      >
        <router-link
          :to="item.link"
          role="menuitem"
          :aria-label="'Go to ' + item.name"
          active-class="active-link"
          class="menu-item"
        >
          <AppIcon
            v-if="item.icon"
            :class="['icon', item.icon]"
            :name="item.icon"
            color="currentColor"
          />
          <span class="sr-only">{{ item.name }}</span>
        </router-link>
      </li>
    </ul>
    <LinkButton
      @click="toggleCollapse"
      :aria-expanded="String(!isCollapsed)"
      :aria-label="isCollapsed ? 'Expand menu' : 'Collapse menu'"
      :icon="isCollapsed ? 'ArrowRightFromLine' : 'ArrowLeftToLine'"
      iconSize="24"
      type="icon"
      id="btn-menu-toggle"
    />
  </nav>
</template>

<script>
import NowablyLogo from '@/components/Visuals/NowablyLogo.vue'

export default {
  components: {
    NowablyLogo,
  },
  props: {
    variant: {
      type: String,
      default: 'user',
    },
  },
  data() {
    return {
      menuUser: [
        { name: 'Home', link: '/', icon: 'home' },
        { name: 'All tasks', link: '/all-tasks', icon: 'layoutList' },
        { name: 'Completion Cards', link: '/completion-cards', icon: 'galleryHorizontalEnd' },
        { name: 'Received Messages', link: '/received-messages', icon: 'messageCircleHeart' },
      ],
      isCollapsed: false,
    }
  },
  methods: {
    goToHome() {
      this.$router.push({ name: 'home' })
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
    },
    isActive(link) {
      return this.$route.path === link // Check if the current route matches the link
    },
  },
}
</script>

<style scoped>
#logo {
  width: 9rem;
  cursor: pointer;
}

#btn-menu-toggle {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}

.navi-header {
  width: 100%;
  cursor: pointer;
}

h1 {
  width: 100%;
}

.sidebar {
  width: fit-content;
  max-width: 14.5rem;
  background-color: var(--t-white-33);
  color: var(--base-black);
  padding: 1.5rem 1.5rem 2rem 1.5rem;
  transition: all 0.4s linear;
  overflow: hidden;
  border-top-right-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
}

.sidebar.collapsed {
  width: 5rem;
  padding: 1.5rem 0.75rem 2rem 0.75rem;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
}

.sidebar li {
  padding: 0.9rem 0.6rem;
  border-radius: 0.85rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.0187rem;
  width: 100%;
  min-width: 3.5rem;
  min-height: 3.5rem;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}

.sidebar li.active {
  background-color: var(--base-white);
}

.sidebar li:hover:not(.active) {
  background-color: var(--t-white-50);
}

.sidebar a {
  color: var(--base-black);
  text-decoration: none;
}

.sidebar .active-link {
  color: var(--base-black);
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
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
