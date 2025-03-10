<template>
  <div class="countdown-view flex-grow">
    <h1 class="sr-only">Start working on the task</h1>
    <h2 class="task-progress-headline" v-if="this.taskStore.currentTask">
      {{ this.taskStore.currentTask.description }}
    </h2>
    <!-- v-if ensures currentTask is loaded before vue is trying to access it-->
    <TaskCountdown />
    <div class="button-container">
      <SolidButton type="text" text="I need help" @click="needHelp" />
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
    this.taskStore.loadCurrentTask()
    this.userStore.initLoad()
    this.userStore.setCurrentEmotion(null)
  },
}
</script>

<style scoped>
.countdown-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: radial-gradient(circle at 50%, var(--terra-01), var(--base-sand));
}

.countdown-container {
  margin: 4rem;
}

.button-container {
  display: flex;
  gap: 2rem;
}
</style>
