<template>
  <article class="completion-cards-container">
    <div class="completion-cards-header">
      <h2>Completion Cards</h2>
      <LinkButton type="text" text="View all" @click="goToCompletionCardsView()" />
    </div>
    <div class="completion-cards-body">
      <p v-if="this.userStore.totalSuccessCount > 0">
        Congrats, you have completed
        <span>{{ this.userStore.totalSuccessCount }} tasks</span> in total.
      </p>
      <p v-else>Complete tasks to unlock Completion Cards.</p>
      <div class="card-visuals-container">
        <!-- Display last 3 completed milestones -->
        <CompletionCard
          v-for="(milestone, index) in recentMilestones"
          :key="index"
          :milestone="milestone"
        />

        <!-- Display flipped card for the next milestone -->
        <CompletionCard
          v-if="nextMilestone"
          :isFlipped="true"
          :backText="`Complete ${nextMilestoneDistance} more tasks to unlock this card`"
        />
      </div>
    </div>
  </article>
</template>

<script>
import { useUserStore } from '../stores/userStore'
import CompletionCard from './CompletionCard.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'CompletionCardsTile',
  components: {
    CompletionCard,
  },
  data() {
    return {
      userStore: useUserStore(),
      router: useRouter(),
      milestones: [
        5, 10, 20, 50, 75, 100, 150, 200, 250, 300, 350, 400, 500, 600, 700, 800, 900, 1000,
      ],
    }
  },
  computed: {
    currentMilestone() {
      return (
        this.milestones
          .filter((milestone) => this.userStore.totalSuccessCount >= milestone)
          .pop() || 0
      )
    },
    nextMilestone() {
      return (
        this.milestones.find((milestone) => this.userStore.totalSuccessCount < milestone) || null
      )
    },
    nextMilestoneDistance() {
      return this.nextMilestone ? this.nextMilestone - this.userStore.totalSuccessCount : 0
    },
    recentMilestones() {
      // Get the last 3 completed milestones (if any)
      return this.milestones
        .filter((milestone) => this.userStore.totalSuccessCount >= milestone)
        .slice(-3) // Last 3 milestones
    },
  },
  methods: {
    goToCompletionCardsView() {
      this.router.push({ name: 'completion-cards' })
    },
  },
  mounted() {
    this.userStore.initLoad()
  },
}
</script>

<style scoped>
.completion-cards-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 1.1rem;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.637);
  border-radius: 1.5rem;
  padding: 2.5rem 1.25rem 3rem 1.25rem;
}

.completion-cards-header {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  min-height: 3.125rem;
}

.completion-cards-body {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
  min-height: 4.6875rem;
  gap: 2rem;
}

.completion-cards-container span {
  font-weight: 700;
}

.card-visuals-container {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.completion-card-visual {
  max-width: 17rem;
  width: 100%;
}

/*_________________________________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .completion-cards-container {
    padding-inline: 3rem;
  }

  .card-visuals-container {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }

  .completion-card-visual {
    max-width: 15rem;
    width: 100%;
  }
}
</style>
