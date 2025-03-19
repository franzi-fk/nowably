import { defineStore } from 'pinia'
import { useUserStore } from './userStore'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [], // Full list of tasks
    // Example task object:
    // {description: "Test",
    // doneState: false,
    // id: "20250313T120344669Z66923",
    // meboId: null,
    // successAt: null}
    currentTask: null, // Task currently being worked on
    deletedTasksTemp: [], // Temporarily store deleted completed tasks
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
        ...this.deletedTasksTemp.filter((task) => new Date(task.successAt) >= oneDayAgo),
      ]
      return allCompletedTasks.length
    },
  },
  actions: {
    generateUniqueId() {
      const now = new Date()
      const datePart = now.toISOString().replace(/[-:.]/g, '') // Format the date (e.g., "20250302T102040")
      const timePart = now.getMilliseconds() // Add milliseconds for further uniqueness
      const randomPart = Math.floor(Math.random() * 1000) // Add a random number to ensure uniqueness
      return `task-${datePart}${timePart}${randomPart}`
    },
    addTask(descriptionInput) {
      const newTask = {
        id: this.generateUniqueId(),
        description: descriptionInput,
        doneState: false,
        successAt: null,
      }
      this.tasks.push(newTask)
      this.saveTasksToStorage()
    },
    updateTask(taskId, updatedProperties) {
      const task = this.tasks.find((task) => task.id === taskId)
      let userStore = useUserStore()
      if (task) {
        // If marking task as completed, update successAt and increase totalSuccessCount
        if (updatedProperties.doneState === true && !task.doneState) {
          updatedProperties.successAt = new Date().toISOString() // Store completion time
          userStore.increaseTotalSuccessCount() // Increase totalSuccessCount
        }

        // apply the updates to the task
        Object.assign(task, updatedProperties)
        this.saveTasksToStorage()
      }
    },
    deleteTask(taskId) {
      const task = this.tasks.find((task) => task.id === taskId)
      if (task && task.doneState) {
        // Temporarily store the task in the completedTasksTemp
        this.deletedTasksTemp.push({ ...task, deletedAt: new Date().toISOString() })
      }
      // Delete the task
      this.tasks = this.tasks.filter((task) => task.id !== taskId)
      this.saveTasksToStorage()
    },
    deleteAllDoneTasks() {
      const completedTasksToDelete = this.tasks.filter((task) => task.doneState === true)
      // Temporarily store deleted tasks
      this.deletedTasksTemp.push(
        ...completedTasksToDelete.map((task) => ({
          ...task,
          deletedAt: new Date().toISOString(),
        })),
      )
      // Delete all done tasks
      this.tasks = this.tasks.filter((task) => task.doneState === false)
      this.saveTasksToStorage()
    },
    clearDeletedTasksTemp() {
      const twoDaysAgo = new Date(new Date() - 48 * 60 * 60 * 1000) // 48 hours ago
      // Remove tasks older than 48 hours from deletedTasksTemp
      this.deletedTasksTemp = this.deletedTasksTemp.filter(
        (task) => new Date(task.deletedAt) >= twoDaysAgo,
      )
      this.saveTasksToStorage()
    },
    setCurrentTask(task) {
      this.currentTask = task
      this.saveTasksToStorage()
    },
    saveTasksToStorage() {
      localStorage.setItem('currentTask', JSON.stringify(this.currentTask))
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
      localStorage.setItem('deletedTasksTemp', JSON.stringify(this.deletedTasksTemp))
    },
    initLoad() {
      try {
        const storedCurrentTask = localStorage.getItem('currentTask')
        if (storedCurrentTask) {
          this.currentTask = JSON.parse(storedCurrentTask)
        }
        const storedTasks = localStorage.getItem('tasks')
        if (storedTasks) {
          this.tasks = JSON.parse(storedTasks)
        }
        const storedCompletedTasksTemp = localStorage.getItem('deletedTasksTemp')
        if (storedCompletedTasksTemp) {
          this.deletedTasksTemp = JSON.parse(storedCompletedTasksTemp)
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error)
      }
      this.clearDeletedTasksTemp() // Clear old tasks after loading
    },
  },
})
