<template>
  <div class="countdown-view flex-grow">
    <h1 class="sr-only">Start working on the task</h1>
    <h2 class="task-progress-headline" v-if="this.taskStore.currentTask">
      {{ this.taskStore.currentTask.description }}
    </h2>
    <!-- v-if ensures currentTask is loaded before vue is trying to access it-->
    <TaskCountdown />
    <div class="button-container">
      <SolidButton
        type="text"
        text="I need help"
        @click="needHelp"
        backgroundColor="var(--cotton-01)"
      />
      <SolidButton
        type="text"
        text="I started"
        backgroundColor="var(--primary)"
        textColor="var(--base-white)"
        @click="taskInProgress"
      />
    </div>
  </div>
</template>

<script>
import TaskCountdown from '../components/TaskCountdown.vue'
import { useTaskStore } from '../stores/taskStore'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

export default {
  name: 'CountdownView',
  components: {
    TaskCountdown,
  },
  data() {
    return {
      taskStore: useTaskStore(),
      userStore: useUserStore(),
      router: useRouter(),
    }
  },
  methods: {
    needHelp() {
      this.userStore.setCurrentStep('help')
      this.router.push({ name: 'need-help' })
    },
    taskInProgress() {
      this.userStore.setCurrentStep('workingOnTask')
      this.router.push({ name: 'task-in-progress', params: { id: this.taskStore.currentTask.id } })
    },
  },
  mounted() {
    this.taskStore.initLoad()
    this.userStore.initLoad()
    this.userStore.setCurrentEmotion(null)
  },
}
</script>

<style scoped>
.countdown-view {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: var(--linear-sand-01);
}

.countdown-container {
  margin: 4rem;
}

.button-container {
  display: flex;
  gap: 2rem;
}
</style>
