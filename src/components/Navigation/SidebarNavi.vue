<!-- Desktop Navi (mobile Navi is in AppHeader) -->
<template>
  <nav
    :class="['sidebar', { collapsed: isCollapsed }]"
    aria-label="Main navigation"
    v-if="variant === 'user'"
  >
    <div class="navi-header">
      <h1 aria-label="Logo Nowably" @click="goToHome">
        <NowablyLogo :width="isCollapsed ? '3' : '10'" :variant="isCollapsed ? 'image' : 'full'" />
      </h1>
    </div>
    <ul v-if="!isCollapsed" role="menu" aria-label="Main menu">
      <router-link
        v-for="(item, index) in userMenu"
        :key="index"
        :to="item.link"
        role="menuitem"
        :aria-label="'Go to ' + item.name"
        active-class="active-link"
        class="menu-item"
      >
        <li role="none" :class="{ active: isActive(item.link) }">
          <AppIcon
            v-if="item.icon"
            :class="['icon', item.icon]"
            :name="item.icon"
            color="currentColor"
          />
          <span>{{ item.name }}</span>
        </li>
      </router-link>
    </ul>
    <ul v-else role="menu" aria-label="Collapsed menu">
      <router-link
        v-for="(item, index) in userMenu"
        :key="index"
        :to="item.link"
        role="menuitem"
        :aria-label="'Go to ' + item.name"
        active-class="active-link"
        class="menu-item"
      >
        <TooltipOverlay :text="item.name" position="right">
          <li role="none" :class="{ active: isActive(item.link) }">
            <AppIcon
              v-if="item.icon"
              :class="['icon', item.icon]"
              :name="item.icon"
              color="currentColor"
            />
            <span class="sr-only">{{ item.name }}</span>
          </li>
        </TooltipOverlay>
      </router-link>
    </ul>
    <div class="navi-footer">
      <TooltipOverlay text="Toggle Menu" position="right">
        <button
          @click="toggleCollapse"
          :aria-expanded="String(!isCollapsed)"
          :aria-label="isCollapsed ? 'Expand menu' : 'Collapse menu'"
          id="btn-menu-toggle"
        >
          <AppIcon
            :name="isCollapsed ? 'ArrowRightFromLine' : 'ArrowLeftToLine'"
            size="24"
          /></button
      ></TooltipOverlay>
    </div>
  </nav>
  <nav
    :class="['sidebar', { collapsed: isCollapsed }]"
    aria-label="Main navigation"
    v-if="variant === 'admin'"
  >
    <div class="navi-header">
      <h1 aria-label="Logo Nowably" @click="goToHome">
        <NowablyLogo :width="isCollapsed ? '3' : '10'" :variant="isCollapsed ? 'image' : 'full'" />
      </h1>
    </div>
    <ul v-if="!isCollapsed" role="menu" aria-label="Main menu">
      <router-link
        v-for="(item, index) in adminMenu"
        :key="index"
        :to="item.link"
        role="menuitem"
        :aria-label="'Go to ' + item.name"
        active-class="active-link"
        class="menu-item"
      >
        <li role="none" :class="{ active: isActive(item.link) }">
          <AppIcon
            v-if="item.icon"
            :class="['icon', item.icon]"
            :name="item.icon"
            color="currentColor"
          />
          <span>{{ item.name }}</span>
        </li>
      </router-link>
    </ul>
    <ul v-else role="menu" aria-label="Collapsed menu">
      <router-link
        v-for="(item, index) in adminMenu"
        :key="index"
        :to="item.link"
        role="menuitem"
        :aria-label="'Go to ' + item.name"
        active-class="active-link"
        class="menu-item"
      >
        <TooltipOverlay :text="item.name" position="right">
          <li role="none" :class="{ active: isActive(item.link) }">
            <AppIcon
              v-if="item.icon"
              :class="['icon', item.icon]"
              :name="item.icon"
              color="currentColor"
            />
            <span class="sr-only">{{ item.name }}</span>
          </li>
        </TooltipOverlay>
      </router-link>
    </ul>
    <div class="navi-footer">
      <TooltipOverlay text="Toggle Menu" position="right">
        <button
          @click="toggleCollapse"
          :aria-expanded="String(!isCollapsed)"
          :aria-label="isCollapsed ? 'Expand menu' : 'Collapse menu'"
          id="btn-menu-toggle"
        >
          <AppIcon
            :name="isCollapsed ? 'ArrowRightFromLine' : 'ArrowLeftToLine'"
            size="24"
          /></button
      ></TooltipOverlay>
    </div>
  </nav>
</template>

<script>
import NowablyLogo from '@/components/Visuals/NowablyLogo.vue'
import { useAppStore } from '@/stores/appStore'
import TooltipOverlay from '../FeedbackAndStatus/TooltipOverlay.vue'

export default {
  components: {
    NowablyLogo,
    TooltipOverlay,
  },
  props: {
    variant: {
      type: String,
      default: 'user',
    },
  },
  data() {
    return {
      appStore: useAppStore(),
      userMenu: [],
      adminMenu: [],
      isCollapsed: false,
    }
  },
  computed: {
    activePath() {
      return this.$route.path
    },
  },
  methods: {
    goToHome() {
      this.$router.push({ name: 'home' })
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
      sessionStorage.setItem('sidebarCollapsed', JSON.stringify(this.isCollapsed))
    },
    isActive(link) {
      return this.activePath === link
    },
  },
  mounted() {
    this.userMenu = this.appStore.userMenuNav
    this.adminMenu = this.appStore.adminMenuNav

    const savedState = sessionStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
      this.isCollapsed = JSON.parse(savedState)
    }
  },
}
</script>

<style scoped>
#logo {
  width: 9rem;
  cursor: pointer;
}

#btn-menu-toggle {
  margin-top: auto;
  width: 3.5rem;
  height: 2.75rem;
  background-color: transparent;
  padding: 0.9rem 0.6rem;
  border-radius: 0.85rem;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

#btn-menu-toggle:hover {
  background-color: var(--t-white-66);
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
  max-width: 13.5rem;
  background-color: var(--t-white-50);
  color: var(--base-black);
  padding: 1.5rem 1rem 0 1rem;
  border-top-right-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  display: none;
}

.sidebar:hover {
  box-shadow: 0 0.5rem 2.5rem 0 rgba(69, 57, 44, 0.07);
}

.sidebar.collapsed {
  width: 5rem;
  padding: 1.5rem 0.75rem 0 0.75rem;
}

.sidebar ul {
  list-style: none;
  padding: 0 0 1rem 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-color: white;
}

.sidebar li {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: center;
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
  background-color: var(--t-white-66);
}

.sidebar a {
  color: var(--base-black);
  text-decoration: none;
}

.sidebar .active-link {
  color: var(--base-black);
}

.navi-footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
  padding-block: 0 0.9rem;
  position: sticky;
  bottom: 0;
}

/*_______________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .sidebar {
    display: flex;
  }
}

/* X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
}

/* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {
}
</style>
