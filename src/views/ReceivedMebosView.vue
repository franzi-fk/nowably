<template>
  <AppHeader />
  <div class="all-mebos-container flex-grow view-layout-default">
    <section class="welcome-message page-padding-inline">
      <h1>Received Messages in a Bottle</h1>
    </section>
    <div class="tile-container">
      <section v-for="mebo in reversedMebos" :key="mebo.id" class="mebo-tile">
        <p class="mebo-text">
          {{ mebo.text }}
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import { useTaskStore } from '@/stores/taskStore'
import { useUserStore } from '@/stores/userStore'
import { useMeboStore } from '../stores/meboStore'
import { useRouter } from 'vue-router'

export default {
  components: {},
  data() {
    return {
      taskStore: useTaskStore(),
      userStore: useUserStore(),
      meboStore: useMeboStore(),
      router: useRouter(),
      allReceivedMebos: [],
    }
  },
  computed: {
    reversedMebos() {
      return [...this.allReceivedMebos].reverse() // Creates a new reversed array
    },
  },
  mounted() {
    this.taskStore.initLoad()
    this.userStore.initLoad()
    this.meboStore.initLoad()

    // Load allReceivedMebos from storage
    const receivedMebosIds = this.userStore.allReceivedMebos
    const allMebos = this.meboStore.mebos
    // Filter mebos that match the received IDs
    this.allReceivedMebos = allMebos.filter((mebo) => receivedMebosIds.includes(mebo.id))
  },
}
</script>

<style scoped>
.all-mebos-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 2rem;
  width: 100%;
  height: 100%;
}

.welcome-message {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 1rem;
  padding-block: 1.4rem 1rem;
}

.tile-container {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 5rem;
}

.mebo-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0.2rem;
  width: 100%;
  background-color: var(--white-33);
  border-radius: 1.5rem;
  padding: 2.8rem 1.25rem 3rem 1.25rem;
  text-align: left;
  position: relative; /* Allow for absolute positioning of the pseudo-element */
  z-index: 0;
}

.mebo-text {
  max-width: 70ch;
  z-index: 2;
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
  .all-mebos-container {
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
