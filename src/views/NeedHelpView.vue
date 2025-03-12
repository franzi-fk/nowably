<template>
  <div class="need-help-view flex-grow page-padding-inline" v-if="taskStore.currentTask">
    <article id="help-demotivated" v-if="userStore.currentEmotion === 'demotivated'">
      <h1>demotivated?</h1>
      <section class="actions">
        <LinkButton type="text" text="Go back" @click="backToWhichHelp" />
        <LinkButton type="text" text="Skip exercise" @click="finishHelp" />
      </section>
    </article>
    <article
      id="help-overwhelmed"
      class="help-sub-view"
      v-else-if="userStore.currentEmotion === 'overwhelmed'"
    >
      <section class="intro">
        <h1>One step at a time</h1>
        <p>
          Maybe your task is just a little bit too big for now. Let’s break it down into smaller
          sub-tasks, that are easier to handle.
        </p>
      </section>
      <section class="split-task help-sub-view-body">
        <section class="split-task-form">
          <p id="current-task">{{ taskStore.currentTask.description }}</p>
          <p>Create at least 2 tasks that will replace the original task.</p>
          <form @submit.prevent="confirmSplitting">
            <fieldset>
              <InputText
                v-model="splitTask1"
                id="sub-task-1"
                name="sub-task-1"
                placeholder="Enter task description..."
                maxLength="80"
              />
              <InputText
                v-model="splitTask2"
                id="sub-task-2"
                name="sub-task-2"
                placeholder="Enter task description..."
                maxLength="80"
              />
              <InputText
                v-model="splitTask3"
                id="sub-task-3"
                name="sub-task-3"
                placeholder="Enter task description..."
                maxLength="80"
                v-show="splitTask1 && splitTask2"
              />
              <InputText
                v-model="splitTask4"
                id="sub-task-4"
                name="sub-task-4"
                placeholder="Enter task description..."
                maxLength="80"
                v-show="splitTask1 && splitTask2 && splitTask3"
              />
              <InputText
                v-model="splitTask5"
                id="sub-task-5"
                name="sub-task-5"
                placeholder="Enter task description..."
                maxLength="80"
                v-show="splitTask1 && splitTask2 && splitTask3 && splitTask4"
              />
              <SolidButton
                type="text"
                text="Save and continue"
                backgroundColor="var(--primary)"
                textColor="var(--base-white)"
              />
            </fieldset>
          </form>
        </section>
      </section>
      <section class="actions">
        <LinkButton type="text" text="Go back" @click="backToWhichHelp" />
        <LinkButton type="text" text="Skip splitting" @click="finishHelp" />
      </section>
    </article>
    <article
      id="help-anxious"
      class="help-sub-view"
      v-else-if="userStore.currentEmotion === 'anxious'"
    >
      <section class="intro">
        <h1>Calm your mind</h1>
        <p>
          Sometimes certain tasks trigger some really intense emotions. Let's try to calm down by
          doing a relaxation technique for just 2 minutes.
        </p>
      </section>
      <section class="relaxation-exercise help-sub-view-body">
        <section class="exercise-instructions" v-show="!relaxExerciseStarted">
          <h2>Humming</h2>
          <p>
            Sit comfortably and relax your body.<br />Inhale deeply through your nose.<br />Exhale
            with a hum, feeling the vibrations.<br />
            Relax and repeat.
          </p>
          <SolidButton
            v-if="!relaxExerciseStarted"
            type="text"
            text="Start"
            backgroundColor="var(--primary)"
            textColor="var(--base-white)"
            @click="startExercise"
          />
        </section>
        <section id="exercise-progress" v-show="relaxExerciseStarted">
          <HummingAnimation
            :disappearAfter="animationDuration * 1000"
            @fade-out-complete="completeHumming"
          />
          <GeneralCountdown
            :duration="animationDuration"
            feedbackMessage="Well done!"
            textColor="var(--primary)"
          />
          <SolidButton
            v-if="hummingAnimationCompleted"
            type="text"
            text="Continue"
            id="btn-continue"
            backgroundColor="var(--primary)"
            textColor="var(--base-white)"
            @click="finishHelp"
          />
        </section>
      </section>
      <section class="actions">
        <LinkButton type="text" text="Go back" @click="backToWhichHelp" />
        <LinkButton type="text" text="Skip exercise" @click="finishHelp" />
      </section>
    </article>
    <section id="whats-wrong" v-else>
      <h1>How do you feel right now?</h1>
      <div class="button-container">
        <SolidButton
          type="text"
          text="I feel demotivated"
          @click="userStore.setCurrentEmotion('demotivated')"
        />
        <SolidButton
          type="text"
          text="I feel overwhelmed"
          @click="userStore.setCurrentEmotion('overwhelmed')"
        />
        <SolidButton
          type="text"
          text="I feel anxious"
          @click="userStore.setCurrentEmotion('anxious')"
        />
        <LinkButton type="text" text="Go back" @click="backToCountdown" />
      </div>
    </section>
  </div>
  <!-- Snackbar -->
  <SnackbarOverlay
    ref="snackbar"
    :text="snackbar.text"
    :variant="snackbar.variant"
    :duration="snackbar.duration"
  />
  <!-- Modal -->
  <ModalOverlay
    :isVisible="isModalVisible"
    :text="modalText"
    :headline="modalHeadline"
    :actions="modalActions"
    @update:isVisible="isModalVisible = $event"
  />
</template>

<script>
import GeneralCountdown from '../components/GeneralCountdown.vue'
import HummingAnimation from '../components/HummingAnimation.vue'
import InputText from '../components/InputText.vue'
import SnackbarOverlay from '../components/SnackbarOverlay.vue'
import SolidButton from '../components/SolidButton.vue'
import ModalOverlay from '../components/ModalOverlay.vue'
import { useTaskStore } from '../stores/taskStore'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

export default {
  name: 'NeedHelpView',
  components: {
    GeneralCountdown,
    HummingAnimation,
    InputText,
    SolidButton,
    SnackbarOverlay,
    ModalOverlay,
  },
  data() {
    return {
      taskStore: useTaskStore(),
      userStore: useUserStore(),
      router: useRouter(),
      snackbar: {
        visible: true,
        text: '',
        variant: 'info',
        duration: 3000,
      },
      isModalVisible: false,
      modalText: '',
      modalHeadline: '',
      modalActions: [
        {
          text: 'Confirm',
          onClick: () => {},
          backgroundColor: 'var(--primary)',
          textColor: 'var(--base-white)',
        },
      ],
      relaxExerciseStarted: false,
      animationDuration: 120, // in seconds
      hummingAnimationCompleted: false,
      splitTask1: '',
      splitTask2: '',
      splitTask3: '',
      splitTask4: '',
      splitTask5: '',
    }
  },
  methods: {
    openModal() {
      this.isModalVisible = true
    },
    closeModal() {
      this.isModalVisible = false
    },
    confirmSplitting() {
      // Define the modal content dynamically
      this.modalHeadline = `Replace task`
      this.modalText = `Are you sure you want to replace the current task with the new ones?`

      // Define the actions for the modal dynamically
      this.modalActions = [
        {
          text: 'Cancel',
          onClick: () => {
            this.closeModal()
          },
          backgroundColor: 'var(--base-sand)',
          textColor: 'var(--base-black)',
        },
        {
          text: 'Replace task',
          onClick: () => {
            this.handleSplitting()
            this.closeModal()
          },
          backgroundColor: 'var(--primary)',
          textColor: 'white',
        },
      ]
      // Show the modal
      this.openModal()
    },
    handleSplitting() {
      // Check if the split task descriptions are not empty
      const splitTasks = [
        this.splitTask1,
        this.splitTask2,
        this.splitTask3,
        this.splitTask4,
        this.splitTask5,
      ].filter((task) => task.trim()) // Filter out empty tasks

      if (splitTasks.length > 0) {
        this.deleteTask(this.taskStore.currentTask.id)
        // Add each split task to taskStore
        splitTasks.forEach((splitTask) => {
          if (splitTask.trim()) {
            this.addNewTask(splitTask)
          }
        })
        // Set the first task (splitTask1) as the new current task
        const newCurrentTask = this.taskStore.tasks.find((t) => t.description === splitTasks[0])
        this.taskStore.setCurrentTask(newCurrentTask)
        this.finishHelp()
      } else {
        this.finishHelp()
      }
    },
    deleteTask(taskId) {
      const taskToDelete = this.taskStore.tasks.find((t) => t.id === taskId)
      if (!taskToDelete) {
        this.showSnackbar('error', 'Task not found.', '3000') // properties:  variant, text, duration in ms
        return
      } else {
        this.taskStore.deleteTask(taskId)
        this.taskStore.saveTasksToStorage()
        return
      }
    },
    addNewTask(description) {
      const newTaskDesc = description.trim() // Removes spaces from input value

      // Check if user input is empty
      if (newTaskDesc === '') {
        return
      }

      // Check if user tries to add a duplicate (case-insensitive)
      if (
        this.taskStore.openTasks.some(
          (task) => task.description.toLowerCase() === newTaskDesc.toLowerCase(),
        )
      ) {
        this.showSnackbar('error', 'Task already exists.', '3000') // properties:  variant, text, duration in ms
        return
      }

      const newTask = {
        id: this.generateUniqueId(),
        description: newTaskDesc,
        doneState: false,
      }
      this.taskStore.addTask(newTask)
      this.taskStore.saveTasksToStorage()
    },
    completeHumming() {
      this.hummingAnimationCompleted = true
    },
    startExercise() {
      this.relaxExerciseStarted = true
    },
    backToWhichHelp() {
      this.userStore.setCurrentEmotion(null)
    },
    backToCountdown() {
      this.userStore.setCurrentEmotion(null)
      this.userStore.setCurrentStep('countdown')
      this.router.push({ name: 'countdown', params: { id: this.taskStore.currentTask.id } })
    },
    finishHelp() {
      this.router.push({ name: 'task-continue' })
    },
    showSnackbar(variant, text, duration) {
      this.snackbar.text = text
      this.snackbar.variant = variant
      this.snackbar.duration = Number(duration)
      this.$refs.snackbar.show()
    },
    generateUniqueId() {
      const now = new Date()
      const datePart = now.toISOString().replace(/[-:.]/g, '') // Format the date (e.g., "20250302T102040")
      const timePart = now.getMilliseconds() // Add milliseconds for further uniqueness
      const randomPart = Math.floor(Math.random() * 1000) // Add a random number to ensure uniqueness
      return `${datePart}${timePart}${randomPart}`
    },
  },
  mounted() {
    this.userStore.initLoad()
    this.taskStore.initLoad()

    // If there is no currentTask, redirect to the home view
    if (!this.taskStore.currentTask) {
      this.$router.push({ name: 'home' })
    }
  },
}
</script>

<style scoped>
.need-help-view,
#whats-wrong {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.need-help-view {
  background-image: radial-gradient(circle at 50%, var(--terra-01), var(--base-sand));
}

.help-sub-view {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  min-width: 100vw;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background-color: var(--base-sand);
  text-align: center;
}

.intro {
  padding-inline: 1.25rem;
  padding-block: 2rem;
}

h1,
h2 {
  margin-bottom: 1rem;
}

.actions {
  padding-inline: 1.25rem;
  padding-block: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

#btn-continue {
  margin-top: 2.4rem;
}

.help-sub-view-body {
  background-color: var(--base-white);
  border-radius: 1.5rem;
  padding-block: 2rem 2.2rem;
  padding-inline: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.relaxation-exercise p {
  line-height: 190%;
  margin-bottom: 2rem;
}

.animation-container {
  margin-block: 2.2rem 3rem;
}

.button-container {
  width: fit-content;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 3rem;
}

#current-task {
  background-color: var(--cloud-01);
  padding: 1rem;
  border-radius: 0.625rem;
  margin-bottom: 1rem;
}

.split-task-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
