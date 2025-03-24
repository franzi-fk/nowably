<template>
  <div class="wrapper">
    <SidebarNavi :variant="this.userStore.role === 'admin' ? 'admin' : 'user'" />
    <AppHeader />
    <div class="main-view-container home-container flex-grow view-layout-default">
      <section class="welcome-message page-padding-inline">
        <h1>
          Welcome
          <span
            v-if="this.userStore.user.displayName && this.userStore.user.displayName.length < 30"
            >{{ this.userStore.user.displayName }}</span
          >
        </h1>
        <span id="subheading">Let's defeat procrastination now.</span>
      </section>
      <div class="tile-container">
        <OpenTasksList listHeadline="Tasks" />
        <CreateMeboBanner
          v-if="
            this.userStore.role === 'admin' ||
            (this.userStore.role !== 'admin' && this.userStore.availableMeboTokens > 0)
          "
        />
        <CompletionCardsTile />
        <ReceivedMebosTile />
      </div>
    </div>
  </div>
</template>

<script>
import OpenTasksList from '@/components/DataDisplay/OpenTasksList.vue'
import { useTaskStore } from '@/stores/taskStore'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import CompletionCardsTile from '@/components/DataDisplay/CompletionCardsTile.vue'
import CreateMeboBanner from '@/components/DataDisplay/CreateMeboBanner.vue'
import ReceivedMebosTile from '../components/DataDisplay/ReceivedMebosTile.vue'
import SidebarNavi from '../components/Navigation/SidebarNavi.vue'

export default {
  components: {
    OpenTasksList,
    CompletionCardsTile,
    CreateMeboBanner,
    ReceivedMebosTile,
    SidebarNavi,
  },
  data() {
    return {
      taskStore: useTaskStore(),
      userStore: useUserStore(),
      router: useRouter(),
    }
  },
  async mounted() {
    await Promise.all([this.userStore.initLoad(), this.taskStore.initLoad()])
    this.taskStore.setCurrentTask(null)
    if (!this.userStore.user) {
      this.router.push({ name: 'login' })
    }
  },
}
</script>

<style scoped>
.welcome-message {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 1rem;
  padding-block: 1.4rem 1rem;
}

#subheading {
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.0313rem;
}

.tile-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-bottom: 5rem;
}

/*________________________________________________________________________________*/

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
