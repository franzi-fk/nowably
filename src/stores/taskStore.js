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
  },
  actions: {
    addTask(task) {
      this.tasks.push(task)
    },
    updateTask(updatedTask) {
      const task = this.tasks.find((task) => task.id === updatedTask.id)
      if (task) {
        Object.assign(task, updatedTask)
      }
    },
    deleteTask(taskId) {
      this.tasks = this.tasks.filter((task) => task.id !== taskId)
    },
    loadTasksFromStorage() {
      const storedTasks = localStorage.getItem('tasks')
      if (storedTasks) {
        this.tasks = JSON.parse(storedTasks)
      }
    },
    saveTasksToStorage() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    },
    setCurrentTask(task) {
      this.currentTask = task
      localStorage.setItem('currentTask', JSON.stringify(task)) // Persist across refreshes
    },
    loadCurrentTask() {
      const storedCurrentTask = localStorage.getItem('currentTask')
      if (storedCurrentTask) {
        this.currentTask = JSON.parse(storedCurrentTask)
      }
    },
  },
})
