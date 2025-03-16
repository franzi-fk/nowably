<template>
  <section class="task-progress-header">
    <h1 class="task-progress-headline" v-if="this.taskStore.currentTask">
      {{ this.taskStore.currentTask.description }}
    </h1>
    <!-- v-if in h1 ensures currentTask is loaded before vue is trying to access it-->
    <LinkButton
      type="icon"
      icon="x"
      iconSize="28"
      iconColor="var(--terra-04)"
      @click="cancelTaskProgression"
    />
  </section>
</template>

<script>
import { useTaskStore } from '@/stores/taskStore'
import { useRouter } from 'vue-router'

export default {
  data() {
    return {
      taskStore: useTaskStore(),
      router: useRouter(),
    }
  },
  methods: {
    cancelTaskProgression() {
      this.router.push({ name: 'home' })
    },
  },
  mounted() {
    this.taskStore.initLoad()
  },
}
</script>

<style scoped>
.task-progress-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  width: 100%;
  padding: 1rem 0.6rem 1rem 1.25rem;
  height: 4.5rem;
  top: 0;
  left: 0;
}

.task-progress-headline {
  color: var(--terra-04);
  padding-inline: 1.3rem;
  white-space: normal;
  font-size: 1.05rem;
  letter-spacing: 0.0125rem;
  font-weight: 500;
  text-align: left;
  padding: 0;
}

/*__________________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .task-progress-header {
    height: auto;
    padding: 1rem 1rem 1rem 1.8rem;
  }
}
</style>
