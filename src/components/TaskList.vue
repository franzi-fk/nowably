<template>
  <section class="task-list-container">
    <div class="task-list-header">
      <h2>My tasks</h2>
      <LinkButton type="text" text="View all" />
    </div>

    <div class="task-list-body">
      <div class="empty-state" v-if="this.taskStore.openTasks.length === 0">
        <AppIllustration name="empty-state" width="16rem" opacity="0.9" />
        <p>No tasks yet. Create a new one.</p>
      </div>
      <div class="task-list-row" v-for="task in this.taskStore.openTasks" :key="task.id">
        <div class="task-desc" @click="toggleRow(task.id)">
          <div class="task-desc-text" v-if="editingTaskId !== task.id">
            {{ task.description }}
          </div>
          <InputText
            :ref="`taskInput-${task.id}`"
            v-else
            v-model="editableDescription"
            @keyup.enter="saveEditing()"
            @keyup.esc="abortEditing(task)"
            class="task-input"
            name="edit-task-input"
            id="edit-task-input"
            maxLength="80"
          />
          <AppIcon name="chevronDown" :class="{ rotated: expandedRow === task.id }" />
        </div>

        <!-- Actions section (visible only when expanded or on non-mobile devices) -->
        <div class="task-actions" v-if="isMobile ? expandedRow === task.id : true">
          <!-- Edit button is shown if the task is not being edited -->
          <SolidButton
            v-show="editingTaskId !== task.id"
            type="icon"
            icon="pencil"
            @click="startEditing(task.id, task.description, $event)"
            id="btn-edit-task"
          />
          <!-- Save and Cancel buttons appear when editing -->
          <SolidButton
            v-show="editingTaskId === task.id"
            type="icon-text"
            icon="save"
            text="Save"
            @click="saveEditing(task)"
            id="btn-save-edited-task"
          />
          <SolidButton
            v-show="editingTaskId === task.id"
            type="icon-text"
            text="Cancel"
            icon="x"
            @click="abortEditing(task)"
            id="btn-cancel-edit-task"
          />
          <SolidButton
            v-show="editingTaskId !== task.id"
            type="icon"
            icon="trash2"
            @click="confirmDeletion(task.id)"
          />
          <SolidButton
            v-show="editingTaskId !== task.id"
            type="icon-text"
            text="Start task"
            icon="play"
            background-color="var(--primary)"
            text-color="var(--base-white)"
            id="btn-start-task"
            @click="startTask(task)"
          />
        </div>
      </div>
    </div>
    <div class="create-new-task-container">
      <SolidButton
        v-show="!creatingTask"
        type="icon-text"
        text="Add task"
        icon="plus"
        id="btn-create-new-task"
        @click="startCreatingTask()"
      />
      <form class="form-create-new-task" @submit.prevent="saveNewTask" v-show="creatingTask">
        <InputText
          ref="newTaskInput"
          id="new-task"
          name="new-task"
          v-model="inpNewTask"
          placeholder="Enter your task"
          maxLength="80"
          @keydown.enter.prevent="saveNewTask"
          @keydown.esc.prevent="cancelCreatingTask"
          @blur="
            () => {
              if (inpNewTask.trim() === '') {
                cancelCreatingTask()
              }
            }
          "
        />
        <div class="form-actions">
          <SolidButton
            type="icon-text"
            icon="x"
            text="Cancel"
            backgroundColor="var(--secondary)"
            @click="cancelCreatingTask()"
          />
          <SolidButton type="icon-text" text="Add task" icon="plus" submit />
        </div>
      </form>
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
  </section>
</template>

<script>
import InputText from './InputText.vue'
import SnackbarOverlay from './SnackbarOverlay.vue'
import ModalOverlay from './ModalOverlay.vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { useUserStore } from '../stores/userStore'
import AppIllustration from './AppIllustration.vue'

export default {
  name: 'TaskList',
  components: {
    InputText,
    SnackbarOverlay,
    ModalOverlay,
    AppIllustration,
  },
  data() {
    return {
      taskStore: useTaskStore(),
      userStore: useUserStore(),
      router: useRouter(),
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
      editingTaskId: null,
      editableDescription: '',
      creatingTask: false,
      inpNewTask: '',
      expandedRow: null, // stores the ID of the currently expanded row
      isMobile: window.innerWidth < 576,
      snackbar: {
        visible: true,
        text: '',
        variant: 'info',
        duration: 3000,
      },
    }
  },
  computed: {
    tasks() {
      return this.taskStore.tasks
    },
  },
  methods: {
    startTask(task) {
      this.taskStore.setCurrentTask(task)
      this.userStore.setCurrentStep('countdown')
      this.router.push({ name: 'countdown', params: { id: task.id } })
    },
    startEditing(taskId, description, event) {
      if (event) {
        event.stopPropagation() // Stop the event from propagating to the parent elements
      }
      this.editingTaskId = taskId
      this.editableDescription = description // store the description to be edited
      this.$nextTick(() => {
        // nextTick delays execution until the input field is in the DOM and rendered
        const inputElement = this.$refs[`taskInput-${taskId}`][0]
        if (inputElement) {
          inputElement.focusInput() // focus input
        }
      })
    },
    saveEditing() {
      const taskId = this.editingTaskId
      const task = this.taskStore.tasks.find((t) => t.id === taskId)
      if (!task) {
        this.stopEditing()
        return
      }
      const newTaskDesc = this.editableDescription.trim()

      // Check if the description hasn't changed
      if (task.description === newTaskDesc) {
        this.stopEditing()
        return
      }

      // Check if user tries to add a duplicate (case-insensitive)
      const isDuplicate = this.taskStore.tasks.some(
        (existingTask) =>
          existingTask.id !== this.editingTaskId &&
          existingTask.description.toLowerCase() === newTaskDesc.toLowerCase(),
      )

      if (isDuplicate) {
        this.showSnackbar('error', 'Task already exists.', '3000') // properties:  variant, text, duration in ms

        // Ensure the input field regains focus using nextTick
        this.$nextTick(() => {
          const inputElement = this.$refs[`taskInput-${this.editingTaskId}`]?.[0]
          inputElement?.focusInput()
        })

        return
      }

      // Check if the user input is empty
      if (newTaskDesc === '') {
        this.abortEditing()
        return
      }

      // Save the updated task description
      this.taskStore.updateTask(taskId, { description: newTaskDesc })
      this.taskStore.saveTasksToStorage()

      this.stopEditing() // Stop editing after save
    },
    abortEditing(task) {
      this.editableDescription = task.description // Reset editable description to original
      this.stopEditing() // Stop editing after abort
    },
    stopEditing() {
      this.editingTaskId = null // Exit editing mode
    },
    openModal() {
      this.isModalVisible = true
    },
    closeModal() {
      this.isModalVisible = false
    },
    confirmDeletion(taskId) {
      // Define the modal content dynamically
      this.modalHeadline = `Delete task`
      this.modalText = `Are you sure you want to delete this task? You can't bring it back.`

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
          text: 'Delete task',
          onClick: () => {
            this.deleteTask(taskId)
            this.closeModal()
          },
          backgroundColor: 'var(--primary)',
          textColor: 'white',
        },
      ]

      // Show the modal
      this.openModal()
    },
    deleteTask(taskId) {
      const taskToDelete = this.taskStore.tasks.find((t) => t.id === taskId)
      this.$nextTick(() => {
        if (!taskToDelete) {
          this.showSnackbar('error', 'Task not found.', '3000') // properties:  variant, text, duration in ms
          return
        } else {
          this.taskStore.deleteTask(taskId)
          this.taskStore.saveTasksToStorage()
          return
        }
      })
    },
    generateUniqueId() {
      const now = new Date()
      const datePart = now.toISOString().replace(/[-:.]/g, '') // Format the date (e.g., "20250302T102040")
      const timePart = now.getMilliseconds() // Add milliseconds for further uniqueness
      const randomPart = Math.floor(Math.random() * 1000) // Add a random number to ensure uniqueness
      return `${datePart}${timePart}${randomPart}`
    },
    focusInput(inputElement) {
      this.$nextTick(() => {
        inputElement?.focusInput()
      })
    },
    startCreatingTask() {
      this.creatingTask = true
      this.$nextTick(() => {
        if (this.creatingTask === true) {
          this.focusInput(this.$refs.newTaskInput)
        }
      })
    },
    cancelCreatingTask() {
      this.creatingTask = false
      this.inpNewTask = '' // Reset the task input field if needed
    },
    saveNewTask() {
      const newTaskDesc = this.inpNewTask.trim() // Removes spaces from input value

      // Check if user input is empty
      if (newTaskDesc === '') {
        this.inpNewTask = '' // clear input field
        return
      }

      // Check if user tries to add a duplicate (case-insensitive)
      if (
        this.taskStore.openTasks.some(
          (task) => task.description.toLowerCase() === newTaskDesc.toLowerCase(),
        )
      ) {
        this.showSnackbar('error', 'Task already exists.', '3000') // properties:  variant, text, duration in ms
        // Ensure the input field regains focus using nextTick
        this.focusInput(this.$refs.newTaskInput)
        return
      }

      const newTask = {
        id: this.generateUniqueId(),
        description: newTaskDesc,
        doneState: false,
      }
      this.taskStore.addTask(newTask)
      this.taskStore.saveTasksToStorage()

      this.inpNewTask = '' // clear input field
      this.focusInput(this.$refs.newTaskInput)
    },
    showSnackbar(variant, text, duration) {
      this.snackbar.text = text
      this.snackbar.variant = variant
      this.snackbar.duration = Number(duration)
      this.$refs.snackbar.show()
    },
    toggleRow(id) {
      // if the clicked row is already expanded, collapse it; otherwise, expand the new one
      this.expandedRow = this.expandedRow === id ? null : id
    },
    updateWindowWidth() {
      this.isMobile = window.innerWidth < 576
      if (!this.isMobile) {
        // Reset expandedRow when switching to a larger screen
        this.expandedRow = null
      }
    },
  },
  mounted() {
    this.userStore.initLoad()
    this.taskStore.initLoad()
    window.addEventListener('resize', this.updateWindowWidth) // Track window resize
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateWindowWidth) // Clean up listener
  },
}
</script>

<style scoped>
.task-list-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 0.2rem;
  width: 100%;
  background-color: var(--base-white);
  padding-block: 2.5rem 3rem;
  border-radius: 1.5rem;
}

.task-list-header {
  width: 100%;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0 1.25rem;
}

.task-list-body {
  width: 100%;
  color: var(--base-black);
  margin-bottom: 1rem;
}

.task-list-row {
  padding: 0.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.task-list-row + .task-list-row {
  border-top: 2px solid var(--base-sand);
}

.task-desc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block: 1.35rem;
  cursor: pointer;
  text-align: left;
}

.task-desc svg {
  min-width: fit-content;
  margin-left: 1.2rem;
}

.task-actions {
  margin-bottom: 1.625rem;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: start;
  align-items: center;
  width: 100%;
}

.task-actions > button {
  min-width: 3.125rem;
}

.task-actions a {
  display: flex;
  text-decoration: none;
  width: 100%;
}

#btn-start-task {
  width: 100%;
}

.create-new-task-container {
  width: 100%;
  padding-inline: 1.25rem;
  display: flex;
  flex-direction: row;
}

.rotated {
  transform: rotate(180deg);
  transition: transform 0.65s ease;
}

.AppIcon {
  display: inline-block;
  transition: transform 0.65s ease;
}

.form-create-new-task {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.2rem;
}

.input-container {
  width: 100%;
}

.form-actions {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.2rem;
  width: 100%;
}

#btn-create-new-task {
  width: 100%;
}

#edit-task-input {
  width: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  justify-content: center;
  align-items: center;
}

/*_________________________________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .task-actions a {
    display: flex;
    flex-grow: 0;
    text-decoration: none;
  }

  .task-actions button {
    width: fit-content;
    white-space: nowrap;
  }

  .task-actions {
    margin: 0;
    display: flex;
    justify-content: end;
    width: auto;
    padding-left: 1.2rem;
    gap: 1.2rem;
  }

  .task-desc svg {
    display: none;
  }

  .task-list-row {
    display: flex;
    flex-direction: row;
    padding-inline: 3rem;
  }

  .task-desc {
    flex-grow: 1;
    width: 100%;
    text-align: left;
    cursor: auto;
  }

  .task-list-container {
    width: 100%;
  }

  .task-list-header {
    padding-inline: 3rem;
  }

  .create-new-task-container {
    padding-inline: 3rem;
  }

  .form-create-new-task {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto;
  }

  #btn-create-new-task {
    width: auto;
  }
}

/* Medium devices (tablets, 768px and up) */

/* Large devices (desktops, 992px and up) */
/* @media (min-width: 992px) { ... } */

/* X-Large devices (large desktops, 1200px and up) */
/* @media (min-width: 1200px) { ... } */

/* XX-Large devices (larger desktops, 1400px and up) */
/* @media (min-width: 1400px) { ... } */
</style>
