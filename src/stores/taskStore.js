import { defineStore } from 'pinia'
import { useUserStore } from './userStore'
import {
  getTasksFromFirestore,
  addTaskFs,
  updateTaskFs,
  deleteTaskFs,
  deleteAllDoneTasksFs,
  storeDeletedCompletedTaskFs,
  clearDeletedCompletedTasksFs,
  getDeletedCompletedTasksFromFirestore,
} from '../firestoreService'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [], // Full list of tasks, stored in Firestore
    // Example task object:
    // {description: "Test",
    // doneState: false,
    // id: "20250313T120344669Z66923",
    // successAt: null}
    currentTask: null, // Task currently being worked on, stored in SessionStorage
    deletedCompletedTasksTemp: [], // Temporarily store deleted completed tasks, stored in Firestore
  }),
  getters: {
    openTasks() {
      return this.tasks.filter((task) => task.doneState === false)
    },
    doneTasks() {
      return this.tasks.filter((task) => task.doneState === true)
    },
    // Get count of completed tasks in the last 24 hours
    completedTasksCountLast24h() {
      const now = new Date()
      const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000) // 24 hours ago
      const allCompletedTasks = [
        ...this.tasks.filter((task) => task.successAt && new Date(task.successAt) >= oneDayAgo),
        ...this.deletedCompletedTasksTemp.filter((task) => new Date(task.successAt) >= oneDayAgo),
      ]
      return allCompletedTasks.length
    },
  },
  actions: {
    // generateUniqueId() {
    //   const now = new Date()
    //   const datePart = now.toISOString().replace(/[-:.]/g, '') // Format the date (e.g., "20250302T102040")
    //   const timePart = now.getMilliseconds() // Add milliseconds for further uniqueness
    //   const randomPart = Math.floor(Math.random() * 1000) // Add a random number to ensure uniqueness
    //   return `task-${datePart}${timePart}${randomPart}`
    // },
    async addTask(descriptionInput) {
      const newTask = {
        description: descriptionInput,
        doneState: false,
        successAt: null,
      }

      try {
        // Add task to Firestore and get the task with id
        const addedTask = await addTaskFs(newTask)

        // Add to local state
        this.tasks.push(addedTask)
      } catch (e) {
        console.error('Error adding task:', e)
      }
    },
    async updateTask(taskId, updatedProperties) {
      const task = this.tasks.find((task) => task.id === taskId)
      let userStore = useUserStore()

      if (task) {
        // If marking task as completed, update successAt and increase totalSuccessCount
        if (updatedProperties.doneState === true && !task.doneState) {
          updatedProperties.successAt = new Date().toISOString() // Store completion time
          userStore.increaseTotalSuccessCount() // Increase totalSuccessCount
        }

        try {
          // Update Firestore task
          const updatedTask = await updateTaskFs(task.id, updatedProperties)

          // Update the local state
          Object.assign(task, updatedTask)
        } catch (e) {
          console.error('Error updating task:', e)
        }
      }
    },
    async deleteTask(taskId) {
      const task = this.tasks.find((task) => task.id === taskId)

      if (task) {
        try {
          // If the task is done, temporarily store it in deletedCompletedTasksTemp and Firestore
          if (task.doneState) {
            const deletedTask = { ...task, deletedAt: new Date().toISOString() }
            const updatedDeletedTask = await storeDeletedCompletedTaskFs(deletedTask) // Store the task in Firestore

            // Keep local store in sync with Firestore data
            this.deletedCompletedTasksTemp.push(updatedDeletedTask)
          }

          // Delete the task from Firestore
          const updatedTasks = await deleteTaskFs(task.id)

          // Update the local state to reflect the deletion from Firestore
          this.tasks = updatedTasks
        } catch (e) {
          console.error('Error deleting task:', e)
        }
      }
    },
    async deleteAllDoneTasks() {
      try {
        const completedTasksToDelete = this.doneTasks // needed for deletedCompletedTasksTemp

        // Temporarily store deleted tasks and add to Firestore
        const deletedTasks = completedTasksToDelete.map((task) => ({
          ...task,
          deletedAt: new Date().toISOString(),
        }))
        // Add all deleted tasks to Firestore and update the local store
        const storedDeletedTasks = await Promise.all(
          deletedTasks.map((task) => storeDeletedCompletedTaskFs(task)),
        )

        // Update the local state with Firestore IDs
        this.deletedCompletedTasksTemp.push(...storedDeletedTasks)

        const updatedTasks = await deleteAllDoneTasksFs() // delete all done tasks from Firestore, returns updated tasks

        this.tasks = updatedTasks // Keep local state in sync
      } catch (e) {
        console.error('Error deleting tasks: ', e)
      }
    },
    async clearDeletedCompletedTasksTemp() {
      try {
        // Fetch deleted tasks from Firestore
        const updatedDeletedCompletedTasks = await clearDeletedCompletedTasksFs()

        // Update the local state with the tasks that are not older than 48 hours
        this.deletedCompletedTasksTemp = updatedDeletedCompletedTasks
      } catch (e) {
        console.error('Error clearing deleted tasks:', e)
      }
    },
    setCurrentTask(task) {
      this.currentTask = task
      sessionStorage.setItem('currentTask', JSON.stringify(this.currentTask))
    },
    async initLoad() {
      try {
        // Load current task from sessionStorage
        const storedCurrentTask = sessionStorage.getItem('currentTask')
        if (storedCurrentTask) {
          this.currentTask = JSON.parse(storedCurrentTask)
        }

        // Load tasks from Firestore
        this.tasks = await getTasksFromFirestore()

        // Load deleted tasks temp from Firestore
        this.deletedCompletedTasksTemp = await getDeletedCompletedTasksFromFirestore()
      } catch (error) {
        console.error('Error loading data:', error)
      }
      this.clearDeletedCompletedTasksTemp() // Clear old tasks after loading
    },
  },
})
