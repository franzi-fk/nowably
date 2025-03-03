<template>
  <section class="task-list-container">
    <div class="task-list-header">
      <h2>My tasks</h2>
      <LinkButton type="text" text="View all" />
    </div>

    <div class="task-list-body">
      <div class="task-list-row" v-for="task in tasks" :key="task.id">
        <div class="task-desc" @click="toggleRow(task.id)">
          {{ task.description }}
          <AppIcon name="chevronDown" :class="{ rotated: expandedRow === task.id }" />
        </div>

        <!-- Actions section (visible only when expanded) -->
        <div class="task-actions" v-if="isMobile ? expandedRow === task.id : true">
          <SolidButton type="icon" icon="pencil" />
          <SolidButton type="icon" icon="trash2" />
          <router-link :to="{ name: 'countdown' }">
            <SolidButton
              type="icon-text"
              text="Start task"
              icon="play"
              background-color="var(--primary)"
              text-color="var(--base-white)"
              id="btn-start-task"
            />
          </router-link>
        </div>
      </div>
    </div>
    <div class="create-new-task-container">
      <!-- <SolidButton type="icon-text" text="Create new task" icon="plus" id="btn-create-new-task" /> -->
      <form class="form-create-new-task" @submit.prevent="saveNewTask">
        <InputText
          id="new-task"
          name="new-task"
          v-model="inpNewTask"
          placeholder="Enter your task"
        />
        <SolidButton type="icon-text" text="Save task" icon="save" />
      </form>
    </div>
  </section>
</template>

<script>
import InputText from './InputText.vue'
export default {
  name: 'TaskList',
  components: {
    InputText,
  },
  data() {
    return {
      inpNewTask: '', // reflects the input field 'create new task'
      tasks: [],
      expandedRow: null, // stores the ID of the currently expanded row
      isMobile: window.innerWidth < 576,
    }
  },
  methods: {
    generateUniqueId() {
      const now = new Date()
      const datePart = now.toISOString().replace(/[-:.]/g, '') // Format the date (e.g., "20250302T102040")
      const timePart = now.getMilliseconds() // add milliseconds for further uniqueness
      return `${datePart}${timePart}`
    },
    loadLocalStorage() {
      const storedTasks = localStorage.getItem('tasks')
      if (storedTasks) {
        this.tasks = JSON.parse(storedTasks)
      }
    },
    updateLocalStorage() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    },
    saveNewTask() {
      const newTaskDesc = this.inpNewTask.trim() // Removes spaces from input value

      // Check if user input is empty
      if (newTaskDesc === '') {
        this.inpNewTask = '' // clear input field
        return
      }

      // Check if user tries to add a duplicate (case-insensitive)
      if (this.tasks.some((task) => task.description.toLowerCase() === newTaskDesc.toLowerCase())) {
        this.inpNewTask = '' // clear input field
        return
      }

      // Add new todo to appState
      this.tasks.push({
        id: `${this.generateUniqueId()}`,
        description: `${newTaskDesc}`,
        doneState: false,
      })
      this.newTask = '' // clear input field
      this.updateLocalStorage()
    },
    toggleRow(id) {
      // if the clicked row is already expanded, collapse it; otherwise, expand the new one
      this.expandedRow = this.expandedRow === id ? null : id
    },
    updateWindowWidth() {
      this.isMobile = window.innerWidth < 576

      // Reset expandedRow if switching to desktop
      window.addEventListener('resize', this.updateWindowWidth) // Track window resize
      this.expandedRow = null
    },
  },
  mounted() {
    this.loadLocalStorage()
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
  padding-block: 2.5rem;
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
}

.task-actions {
  margin-bottom: 1.625rem;
  display: flex;
  gap: 1rem;
  justify-content: start;
  align-items: center;
  width: 100%;
}

.task-actions a {
  display: flex;
  flex-grow: 1;
  text-decoration: none;
}

.task-actions a button {
  width: 100%;
}

.create-new-task-container {
  width: 100%;
  padding-inline: 20px;
}

.create-new-task-container button {
  width: 100%;
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
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

/*_________________________________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .create-new-task-container {
    width: auto;
    padding-inline: 3rem;
  }

  .create-new-task-container button {
    width: auto;
  }

  .task-actions a {
    display: flex;
    flex-grow: 0;
    text-decoration: none;
  }

  .task-actions a button {
    width: fit-content;
    white-space: nowrap;
  }

  .task-actions {
    margin: 0;
    justify-content: end;
    width: auto;
    padding-left: 1rem;
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
}

/* Medium devices (tablets, 768px and up) */

/* Large devices (desktops, 992px and up) */
/* @media (min-width: 992px) { ... } */

/* X-Large devices (large desktops, 1200px and up) */
/* @media (min-width: 1200px) { ... } */

/* XX-Large devices (larger desktops, 1400px and up) */
/* @media (min-width: 1400px) { ... } */
</style>
