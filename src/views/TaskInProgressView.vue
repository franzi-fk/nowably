<template>
  <div class="in-progress-view flex-grow page-padding-inline">
    <h1 class="sr-only">Start working on the task</h1>
    <h2 class="task-progress-headline" v-if="this.taskStore.currentTask">
      {{ this.taskStore.currentTask.description }}
    </h2>
    <span class="task-progress-body-text">Keep going!</span>
    <router-link :to="{ name: 'task-success' }"
      ><SolidButton type="text" text="Stop"
    /></router-link>
  </div>
</template>

<script>
import { useTaskStore } from '../stores/taskStore'
import { useRouter } from 'vue-router'

export default {
  name: 'TaskInProgressView',
  data() {
    return {
      taskStore: useTaskStore(),
      router: useRouter(),
    }
  },
  methods: {
    taskInProgress() {
      this.router.push({ name: 'task-in-progress', params: { id: this.taskStore.currentTask.id } })
    },
  },
  mounted() {
    this.taskStore.loadCurrentTask()
  },
}
</script>

<style scoped>
.in-progress-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3rem;
  align-items: center;
  background-image: radial-gradient(circle at 50%, var(--terra-01), var(--base-sand));
}
</style>
