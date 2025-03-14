import { defineStore } from 'pinia'

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
      return this.tasks.filter((task) => {
        return task.successAt && new Date(task.successAt) >= oneDayAgo
      }).length
    },
  },
  actions: {
    addTask(task) {
      this.tasks.push(task)
    },
    updateTask(taskId, updatedProperties) {
      const task = this.tasks.find((task) => task.id === taskId)
      if (task) {
        Object.assign(task, updatedProperties)
      }
    },
    deleteTask(taskId) {
      this.tasks = this.tasks.filter((task) => task.id !== taskId)
    },
    deleteAllDoneTasks() {
      this.tasks = this.tasks.filter((task) => task.doneState === false)
    },
    saveTasksToStorage() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
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
    },
  },
})
