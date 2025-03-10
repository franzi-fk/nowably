<template>
  <section class="after-help-view page-padding-inline flex-grow">
    <section class="after-help-view-body">
      <h1>Do you want to continue right now?</h1>
      <form class="ask-if-continue" @submit.prevent="submitUserInput">
        <fieldset>
          <InputRadio
            v-model="userInput"
            type="radio"
            name="task-continue"
            id="continue-with-task"
            value="continue"
            label="Yes, I will give it another try. I want to continue with:"
          />
          <InputSelect
            v-model="selectedValue"
            :items="taskStore.openTasks"
            labelKey="description"
            valueKey="id"
            :disabled="userInput === 'dont-continue'"
            name="select-task"
            id="select-task"
            placeholder="Select a task"
          />
        </fieldset>
        <fieldset>
          <InputRadio
            v-model="userInput"
            type="radio"
            name="task-continue"
            id="do-not-continue"
            value="dont-continue"
            label="No, I will take a break and try again another time."
          />
        </fieldset>
        <fieldset>
          <SolidButton
            type="text"
            text="Continue"
            background-color="var(--base-white)"
            id="btn-continue"
          />
        </fieldset>
      </form>
    </section>
    <section class="actions after-help-view-footer">
      <LinkButton type="text" text="Go back" @click="backToLastStep" />
    </section>
  </section>
  <!-- Snackbar -->
  <SnackbarOverlay
    ref="snackbar"
    :text="snackbar.text"
    :variant="snackbar.variant"
    :duration="snackbar.duration"
  />
</template>

<script>
import SolidButton from '../components/SolidButton.vue'
import SnackbarOverlay from '../components/SnackbarOverlay.vue'
import InputSelect from '../components/InputSelect.vue'
import { useTaskStore } from '../stores/taskStore'
import { useRouter } from 'vue-router'
import InputRadio from '../components/InputRadio.vue'
import { useUserStore } from '../stores/userStore'

export default {
  components: {
    SolidButton,
    InputSelect,
    SnackbarOverlay,
    InputRadio,
  },
  data() {
    return {
      taskStore: useTaskStore(),
      userStore: useUserStore(),
      router: useRouter(),
      userInput: 'continue',
      selectedValue: null, // Initially null until data is loaded
      snackbar: {
        text: '',
        variant: 'info',
        duration: 3000,
      },
    }
  },
  methods: {
    backToLastStep() {
      this.router.push({ name: 'need-help' })
    },
    showSnackbar(variant, text, duration) {
      this.snackbar.text = text
      this.snackbar.variant = variant
      this.snackbar.duration = Number(duration)
      this.$refs.snackbar.show()
    },
    submitUserInput() {
      if (this.userInput === 'continue' && this.selectedValue) {
        const taskExists = this.taskStore.openTasks.some((task) => task.id === this.selectedValue)
        if (taskExists) {
          // Set the current task using the store's action
          const selectedTask = this.taskStore.openTasks.find(
            (task) => task.id === this.selectedValue,
          )
          this.taskStore.setCurrentTask(selectedTask)
          this.userStore.setCurrentStep('countdown')
          this.userStore.setCurrentEmotion(null)
          this.router.push({ name: 'countdown', params: { id: selectedTask.id } })
          return
        } else {
          this.showSnackbar('error', 'Please select a task.', 3000)
          return
        }
      } else {
        this.userStore.setCurrentStep(null)
        this.userStore.setCurrentEmotion(null)
        this.router.push({ name: 'home' })
        return
      }
    },
  },
  mounted() {
    // **Wait for taskStore data to load before setting the selectedValue**
    Promise.all([
      this.taskStore.loadCurrentTask(),
      this.taskStore.loadTasksFromStorage(),
      this.userStore.initLoad(),
    ])
      .then(() => {
        // **Once the data is loaded, set selectedValue from currentTask**
        this.selectedValue = this.taskStore.currentTask?.id || 'Select a task'
      })
      .catch((err) => {
        console.error('Error loading tasks:', err)
      })
  },
}
</script>

<style scoped>
.after-help-view {
  width: 100%;
  min-height: 100vh;
  background-color: var(--base-sand);
  display: flex;
  flex-direction: column;
}

.after-help-view-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
}

.ask-if-continue {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

fieldset {
  border: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.input-label {
  min-height: 3.75rem;
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

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .input-label {
    min-height: 3rem;
  }
  .ask-if-continue {
    gap: 1.75rem;
  }
}
</style>
