<template>
  <div class="wrapper">
    <SidebarNavi :variant="this.userStore.role === 'admin' ? 'admin' : 'user'" />
    <AppHeader />
    <article class="main-view-container cards-view-container flex-grow view-layout-default">
      <section class="cards-view-header page-padding-inline">
        <h1>Completion Cards</h1>
      </section>
      <section class="cards-tile cards-container">
        <!-- Render cards for reached milestones -->
        <CompletionCard
          v-for="(milestone, index) in reachedMilestones"
          :key="`reached-${index}`"
          :milestone="milestone"
          :isFlipped="false"
        />

        <!-- Render card for next milestone -->
        <CompletionCard
          v-if="nextMilestone"
          :key="'next-milestone'"
          :milestone="nextMilestone"
          :isFlipped="true"
          :backText="`Complete ${nextMilestoneDistance} more tasks to unlock this card`"
        />

        <!-- Render cards for closed milestones -->
        <CompletionCard
          v-for="(milestone, index) in closedMilestones"
          :key="`closed-${index}`"
          :milestone="milestone"
          :isFlipped="true"
        />
      </section>
    </article>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import CompletionCard from '@/components/DataDisplay/CompletionCard.vue'
import { useUserStore } from '../stores/userStore'
import SidebarNavi from '../components/Navigation/SidebarNavi.vue'

export default {
  name: 'CompletionCardsView',
  components: {
    CompletionCard,
    SidebarNavi,
  },
  data() {
    return {
      router: useRouter(),
      userStore: useUserStore(),
      milestones: [
        5, 10, 20, 50, 75, 100, 150, 200, 250, 300, 350, 400, 500, 600, 700, 800, 900, 1000,
      ],
    }
  },
  computed: {
    reachedMilestones() {
      // includes all milestones the user has reached (milestones <= totalSuccessCount)
      return this.milestones.filter((milestone) => this.userStore.totalSuccessCount >= milestone)
    },
    nextMilestone() {
      // returns the next milestone the user hasn't reached yet (milestone > totalSuccessCount)
      return (
        this.milestones.find((milestone) => this.userStore.totalSuccessCount < milestone) || null
      )
    },
    closedMilestones() {
      // includes all milestones greater than totalSuccessCount, excluding the next milestone
      return this.milestones.filter(
        (milestone) =>
          this.userStore.totalSuccessCount < milestone && milestone !== this.nextMilestone,
      )
    },
    nextMilestoneDistance() {
      return this.nextMilestone ? this.nextMilestone - this.userStore.totalSuccessCount : 0
    },
  },
  mounted() {
    this.userStore.initLoad()
  },
}
</script>

<style scoped>
.cards-view-header {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 1rem;
  padding-block: 1.4rem 1rem;
}

.cards-tile {
  width: 100%;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.25rem;
  padding-inline: 1.25rem;
  margin-bottom: 5rem;
}

.completion-card-visual {
  max-width: 17rem;
  width: 100%;
}

/*_______________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .cards-tile {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: 1.25rem;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .cards-tile {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 1.25rem;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .cards-tile {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 0;
  }
}

/* X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
}

/* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {
  .cards-tile {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: 0;
  }
}
</style>
