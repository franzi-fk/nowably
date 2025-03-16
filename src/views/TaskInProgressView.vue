<template>
  <article
    class="in-progress-view flex-grow page-padding-inline"
    v-if="userStore.currentStep === 'workingOnTask'"
  >
    <h1 class="sr-only">Work on the task</h1>
    <h2 class="task-progress-headline" v-if="this.taskStore.currentTask">
      {{ this.taskStore.currentTask.description }}
    </h2>
    <img src="@/assets/illus_taskprogress.gif" alt="You got this" id="you-got-this-gif" />
    <span id="you-got-this-text">Keep going!</span>
    <SolidButton
      type="text"
      text="Stop"
      @click="userStore.setCurrentStep('documentTaskStatus')"
      variant="tertiary"
    />
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
          <SolidButton id="btn-continue" type="text" text="Save and continue" variant="primary" />
        </fieldset>
      </form>
    </section>
    <section class="actions document-task-status-footer">
      <LinkButton type="text" text="Go back" @click="userStore.setCurrentStep('workingOnTask')" />
    </section>
  </article>
</template>

<script>
import InputRadio from '@/components/InputsAndControls/InputRadio.vue'
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
          // Save the timestamp of task completion to task.successAt
          this.taskStore.updateTask(updatedTask.id, { successAt: new Date().toISOString() })
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
  background-image: var(--linear-sand-01);
}

.document-task-status {
  width: 100%;
  min-height: 100vh;
  background-image: var(--linear-sand-01);
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

#you-got-this-gif {
  width: 16rem;
}

#you-got-this-text {
  font-size: 2rem;
  font-weight: 700;
}
</style>
