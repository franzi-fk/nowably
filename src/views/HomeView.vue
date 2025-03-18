<template>
  <div class="wrapper">
    <SidebarNavi variant="user" />
    <AppHeader />
    <div class="home-container flex-grow view-layout-default">
      <section class="welcome-message page-padding-inline">
        <h1>Welcome</h1>
        <span>Let's defeat procrastination now.</span>
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
  mounted() {
    this.taskStore.setCurrentTask(null)
    this.taskStore.initLoad()
    this.userStore.initLoad()
  },
}
</script>

<style scoped>
.home-container {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 2rem;
  width: 100%;
  height: 100%;
  padding-inline: 2rem;
}

.welcome-message {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 1rem;
  padding-block: 1.4rem 1rem;
}

span {
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
  .home-container {
    width: 69vw;
    margin-inline: auto;
  }
}

/* X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
}

/* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {
}
</style>
