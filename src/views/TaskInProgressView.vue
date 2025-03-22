<template>
  <TaskProgressHeader />
  <article
    class="in-progress-view flex-grow task-view-layout"
    v-if="userStore.currentStep === 'workingOnTask'"
  >
    <div class="in-progress-view-body">
      <h2 class="sr-only">Work on the task</h2>
      <img src="@/assets/illus_taskprogress.gif" alt="You got this" id="you-got-this-gif" />
      <span id="you-got-this-text">Keep going!</span>
      <SolidButton
        type="text"
        text="Stop"
        @click="userStore.setCurrentStep('documentTaskStatus')"
        variant="tertiary"
      />
    </div>
  </article>
  <article
    class="document-task-status flex-grow task-view-layout"
    v-if="userStore.currentStep === 'documentTaskStatus'"
  >
    <div class="document-task-status-body flex-grow">
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
    </div>
    <div class="actions document-task-status-footer">
      <LinkButton type="text" text="Go back" @click="userStore.setCurrentStep('workingOnTask')" />
    </div>
  </article>
</template>

<script>
import InputRadio from '@/components/InputsAndControls/InputRadio.vue'
import { useTaskStore } from '../stores/taskStore'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import TaskProgressHeader from '../components/Navigation/TaskProgressHeader.vue'

export default {
  name: 'TaskInProgressView',
  components: {
    InputRadio,
    TaskProgressHeader,
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

        // Update state
        this.taskStore.setCurrentTask(updatedTask) // Update currentTask
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
.in-progress-view-body {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  margin-bottom: 2rem;
}

.document-task-status-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  min-height: 55vh;
  padding-inline: 1.25rem;
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
  padding-block: 2rem 0.75rem;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
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

/*_______________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .actions {
    padding-inline: 1.8rem;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .document-task-status-body {
    width: 69vw;
  }
}

/* X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
}

/* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {
}
</style>
