<template>
  <section class="task-list-container">
    <div class="task-list-header">
      <h2>{{ listHeadline }}</h2>
      <LinkButton
        v-if="deleteEnabled && taskStore.doneTasks.length > 0"
        type="text"
        text="Clear all"
        @click="confirmClearAllCompleteTasks"
      />
    </div>

    <!-- Show loader space (white space) when loading -->
    <div class="loader-space" v-if="loading"></div>
    <!-- Show task list content after loading -->
    <div class="task-list-body" v-else>
      <div class="empty-state" v-if="this.taskStore.doneTasks.length === 0">
        <Illus_EmptyState :width="15" />
        <p>No completed tasks.</p>
      </div>
      <div class="task-list-row" v-for="task in this.taskStore.doneTasks" :key="task.id">
        <div class="task-desc">
          <div class="task-desc-text">
            {{ task.description }}
          </div>
        </div>
        <div class="task-actions">
          <SolidButton
            v-show="editingTaskId !== task.id"
            type="icon"
            icon="trash2"
            @click="confirmSingleDeletion(task.id)"
          />
        </div>
      </div>
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
      :primaryActionText="modalPrimaryActionText"
      :primaryAction="modalPrimaryAction"
      @update:isVisible="isModalVisible = $event"
    />
  </section>
</template>

<script>
import SnackbarOverlay from '@/components/FeedbackAndStatus/SnackbarOverlay.vue'
import ModalOverlay from '@/components/ContainersAndLayouts/ModalOverlay.vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { useUserStore } from '@/stores/userStore'
import Illus_EmptyState from '@/components/Visuals/Illus_EmptyState.vue'

export default {
  name: 'DoneTasksList',
  components: {
    SnackbarOverlay,
    ModalOverlay,
    Illus_EmptyState,
  },
  props: {
    listHeadline: {
      type: String,
      default: 'Completed tasks',
    },
    deleteEnabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      taskStore: useTaskStore(),
      userStore: useUserStore(),
      router: useRouter(),
      loading: true,
      isModalVisible: false,
      modalText: '',
      modalHeadline: '',
      modalPrimaryActionText: '',
      modalPrimaryAction: null,
      editingTaskId: null,
      isMobile: window.innerWidth < 576,
      snackbar: {
        visible: true,
        text: '',
        variant: 'info',
        duration: 3000,
      },
    }
  },
  methods: {
    openModal() {
      this.isModalVisible = true
    },
    closeModal() {
      this.isModalVisible = false
    },
    confirmClearAllCompleteTasks() {
      // Define the modal content dynamically
      this.modalHeadline = `Delete all completed tasks`
      this.modalText = `Are you sure you want to delete all completed tasks? You can't bring them back.`

      // Set dynamic action
      this.modalPrimaryActionText = 'Delete tasks'
      this.modalPrimaryAction = () => {
        this.taskStore.deleteAllDoneTasks()
        this.closeModal()
      }

      // Show the modal
      this.openModal()
    },
    confirmSingleDeletion(taskId) {
      // Define the modal content dynamically
      this.modalHeadline = `Delete task`
      this.modalText = `Are you sure you want to delete this task? You can't bring it back.`

      // Set dynamic action
      this.modalPrimaryActionText = 'Delete task'
      ;(this.modalPrimaryAction = () => {
        this.deleteTask(taskId)
        this.closeModal()
      }),
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
          return
        }
      })
    },
    showSnackbar(variant, text, duration) {
      this.snackbar.text = text
      this.snackbar.variant = variant
      this.snackbar.duration = Number(duration)
      this.$refs.snackbar.show()
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
    this.loading = true

    Promise.all([this.userStore.initLoad(), this.taskStore.initLoad()]).then(() => {
      this.loading = false
    })

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
  padding-block: 2.5rem 2rem;
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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.task-list-row + .task-list-row {
  border-top: 2px solid var(--base-sand);
}

.task-desc {
  width: 100%;
  margin-block: 1.35rem;
  cursor: pointer;
  text-align: left;
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

.loader-space {
  width: 100%;
  height: 100%;
  min-height: 6rem;
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
