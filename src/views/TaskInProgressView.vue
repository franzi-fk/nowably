<template>
  <article
    class="in-progress-view flex-grow page-padding-inline"
    v-if="userStore.currentStep === 'workingOnTask'"
  >
    <h1 class="sr-only">Start working on the task</h1>
    <h2 class="task-progress-headline" v-if="this.taskStore.currentTask">
      {{ this.taskStore.currentTask.description }}
    </h2>
    <span class="task-progress-body-text">Keep going!</span>
    <SolidButton type="text" text="Stop" @click="userStore.setCurrentStep('documentTaskStatus')" />
  </article>
  <article
    class="document-task-status flex-grow page-padding-inline"
    v-if="userStore.currentStep === 'documentTaskStatus'"
  >
    <h1 class="sr-only">Update the task status</h1>
    <h2>Document your progress on this task</h2>
    <section class="actions after-help-view-footer">
      <form id="task-status-form">
        <fieldset>
          <InputRadio
            label="Task is completed"
            id="task-complete"
            name="task-status"
            :value="true"
            v-model="taskComplete"
          />
          <InputRadio
            label="Task is not completed yet"
            id="task-not-complete"
            name="task-status"
            :value="false"
            v-model="taskComplete"
          />
        </fieldset>
        <SolidButton
          id="btn-continue"
          type="text"
          text="Save and continue"
          backgroundColor="var(--primary)"
          textColor="var(--base-white)"
        />
      </form>
      <LinkButton type="text" text="Go back" @click="userStore.setCurrentStep('workingOnTask')" />
    </section>
  </article>
</template>

<script>
import InputRadio from '../components/InputRadio.vue'
import { useTaskStore } from '../stores/taskStore'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

export default {
  name: 'TaskInProgressView',
  components: {
    InputRadio,
  },
  data() {
    return {
      taskStore: useTaskStore(),
      userStore: useUserStore(),
      router: useRouter(),
      taskComplete: true,
    }
  },
  methods: {
    stopWorking() {
      this.workingOnTask = false
    },
    backToWork() {
      this.workingOnTask = true
    },
    taskInProgress() {
      this.router.push({ name: 'task-in-progress', params: { id: this.taskStore.currentTask.id } })
    },
  },
  mounted() {
    this.taskStore.loadCurrentTask()
    this.userStore.initLoad()
  },
}
</script>

<style scoped>
.in-progress-view,
.document-task-status {
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at 50%, var(--terra-01), var(--base-sand));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
}

#btn-continue {
  margin-top: 3rem;
}
</style>
