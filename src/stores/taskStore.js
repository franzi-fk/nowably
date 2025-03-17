import { defineStore } from 'pinia'
import { useUserStore } from './userStore'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    userStore: useUserStore(),
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
    addTask(task) {
      this.tasks.push(task)
    },
    updateTask(taskId, updatedProperties) {
      const task = this.tasks.find((task) => task.id === taskId)
      if (task) {
        // If marking task as completed, update successAt and increase totalSuccessCount
        if (updatedProperties.doneState === true && !task.doneState) {
          updatedProperties.successAt = new Date().toISOString() // Store completion time
          this.userStore.increaseTotalSuccessCount() // Increase totalSuccessCount
        }

        // apply the updates to the task
        Object.assign(task, updatedProperties)
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
    },
    clearDeletedTasksTemp() {
      const twoDaysAgo = new Date(new Date() - 48 * 60 * 60 * 1000) // 48 hours ago
      // Remove tasks older than 48 hours from deletedTasksTemp
      this.deletedTasksTemp = this.deletedTasksTemp.filter(
        (task) => new Date(task.deletedAt) >= twoDaysAgo,
      )
    },
    saveTasksToStorage() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
      localStorage.setItem('deletedTasksTemp', JSON.stringify(this.deletedTasksTemp))
    },
    setCurrentTask(task) {
      this.currentTask = task
      localStorage.setItem('currentTask', JSON.stringify(task))
    },
    initLoad() {
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
      this.clearDeletedTasksTemp() // Clear old tasks after loading
    },
  },
})
