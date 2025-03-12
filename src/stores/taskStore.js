import { defineStore } from 'pinia'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [], // Full list of tasks
    currentTask: null, // Task currently being worked on
  }),
  getters: {
    openTasks() {
      return this.tasks.filter((task) => task.doneState === false)
    },
    doneTasks() {
      return this.tasks.filter((task) => task.doneState === true)
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
      localStorage.setItem('currentTask', JSON.stringify(task)) // Persist across refreshes
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
