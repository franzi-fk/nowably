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
    <section class="document-task-status-body">
      <h1>Document your progress on this task</h1>

      <form id="task-status-form" @submit.prevent="submitUserInput">
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
        <fieldset>
          <SolidButton
            id="btn-continue"
            type="text"
            text="Save and continue"
            backgroundColor="var(--primary)"
            textColor="var(--base-white)"
          />
        </fieldset>
      </form>
    </section>
    <section class="actions document-task-status-footer">
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
    submitUserInput() {
      const updatedTask = this.taskStore.tasks.find((t) => t.id === this.taskStore.currentTask.id)

      if (updatedTask) {
        // Update the task's doneState in the tasks array
        this.taskStore.updateTask(updatedTask.id, { doneState: this.taskComplete })

        // If user marks task as completed, increase successCount in userStore
        if (this.taskComplete) {
          this.userStore.increaseTotalSuccessCount()
        }

        // Update currentTask
        this.taskStore.setCurrentTask(updatedTask)
        this.taskStore.saveTasksToStorage()
        this.userStore.setCurrentStep('success')
        this.router.push({ name: 'task-success' })
      }
    },
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
    this.taskStore.initLoad()
    this.userStore.initLoad()
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
  align-items: center;
  gap: 3rem;
}

.in-progress-view {
  background-image: radial-gradient(circle at 50%, var(--terra-01), var(--base-sand));
}

.document-task-status {
  width: 100%;
  min-height: 100vh;
  background-color: var(--base-sand);
  display: flex;
  flex-direction: column;
}

.document-task-status-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
}

.document-task-status form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.ask-if-continue-form fieldset:not(:last-child) {
  align-self: flex-start;
}

.document-task-status form .input-label {
  min-height: 2.25rem;
}

.actions {
  padding-inline: 1.25rem;
  padding-block: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

#btn-continue {
  margin-top: 2rem;
}
</style>
