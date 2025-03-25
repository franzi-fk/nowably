<template>
  <div class="wrapper">
    <SidebarNavi :variant="this.userStore.role === 'admin' ? 'admin' : 'user'" />
    <AppHeader />
    <div class="main-view-container all-mebos-container flex-grow view-layout-default">
      <article class="received-mebos">
        <section class="received-mebos-header page-padding-inline">
          <h1>Received Messages in a Bottle</h1>
        </section>
        <!-- Show loader space (white space) when loading -->
        <div class="loader-space" v-if="loading"></div>
        <div class="tile-container" v-else-if="this.userStore.allReceivedMebos.length > 0">
          <section v-for="mebo in reversedMebos" :key="mebo.id" class="mebo-tile">
            <p class="mebo-text">
              {{ mebo.text }}
            </p>
            <div class="decoration">
              <div class="line"></div>
              <AppIcon name="flower" size="22" color="var(--terra-07)" />
              <div class="line"></div>
            </div>
          </section>
        </div>
        <section class="tile-container-empty-state" v-else>
          <Illus_EmptyState width="15" />
          <p>No received Messages in a Bottle.</p>
        </section>
      </article>
    </div>
  </div>
</template>

<script>
import { useTaskStore } from '@/stores/taskStore'
import { useUserStore } from '@/stores/userStore'
import { useMeboStore } from '../stores/meboStore'
import { useRouter } from 'vue-router'
import SidebarNavi from '@/components/Navigation/SidebarNavi.vue'
import Illus_EmptyState from '../components/Visuals/Illus_EmptyState.vue'

export default {
  components: {
    SidebarNavi,
    Illus_EmptyState,
  },
  data() {
    return {
      taskStore: useTaskStore(),
      userStore: useUserStore(),
      meboStore: useMeboStore(),
      router: useRouter(),
      loading: true,
      allReceivedMebos: [],
    }
  },
  computed: {
    reversedMebos() {
      return [...this.allReceivedMebos].reverse() // Creates a new reversed array
    },
  },
  mounted() {
    this.loading = true

    Promise.all([this.userStore.initLoad(), this.meboStore.initLoad(), this.taskStore.initLoad()])
      .then(() => {
        this.loading = false

        // Use $nextTick to ensure the DOM is updated after loading
        this.$nextTick(() => {
          const receivedMeboIdsSet = new Set(
            this.userStore.allReceivedMebos.map((item) => item.meboId),
          )
          const allMebos = this.meboStore.allPublishedMebos || []

          // Filter mebos that match the received meboId values
          this.allReceivedMebos = allMebos.filter((mebo) => receivedMeboIdsSet.has(mebo.id))
        })
      })
      .catch((error) => {
        this.loading = false
        console.error('Error during data initialization:', error)
      })
  },
}
</script>

<style scoped>
.received-mebos {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
}

.received-mebos-header {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 1.3rem;
  padding-block: 1.4rem 1rem;
}

.tile-container {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 5rem;
}

.tile-container-empty-state {
  width: 100%;
  padding: 3rem 1.25rem 3.2rem 1.25rem;
  background-color: var(--base-white);
  border-radius: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  min-height: 55vh;
  text-align: center;
}

.mebo-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 0.2rem;
  width: 100%;
  background-color: var(--t-white-33);
  border-radius: 1.5rem;
  padding: 2.8rem 1.25rem 2.3rem 1.25rem;
  text-align: left;
  z-index: 0;
  position: relative;
}

.mebo-text {
  max-width: 70ch;
  z-index: 2;
}

.decoration {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
  gap: 1rem;
  margin-top: 1.25rem;
}

.line {
  height: 3px;
  background-color: var(--terra-07);
  border-radius: 25%;
  opacity: 0.5;
}

/*________________________________________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .mebo-tile {
    padding-inline: 3rem;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
}

/* X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
  .tile-container {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

/* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {
}
</style>
