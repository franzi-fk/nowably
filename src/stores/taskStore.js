import { defineStore } from 'pinia'
import { useUserStore } from './userStore'

import {
  getTasksForUserFs,
  storeTaskForUserFs,
  updateTaskFs,
  deleteTaskFs,
  deleteAllDoneTasksFs,
  storeDeletedCompletedTaskFs,
  clearDeletedCompletedTasksFs,
  getDeletedCompletedTasksFs,
} from '../firestoreService'
import { watch } from 'vue'

export const useTaskStore = defineStore('taskStore', {
  id: 'taskStore',
  state: () => ({
    tasks: [], // Full list of tasks per user, stored in Firestore
    // Example task object:
    // {description: "Test",
    // doneState: false,
    // userId: user.uid,
    // id: "20250313T120344669Z66923",
    // successAt: null}
    currentTask: null, // Task currently being worked on, stored in SessionStorage
    deletedCompletedTasksTemp: [], // Temporarily store deleted completed tasks per user, stored in Firestore
    userId: null,
  }),
  getters: {
    openTasks() {
      // open tasks of the current user
      return this.tasks.filter((task) => task.doneState === false && task.userId === this.userId)
    },
    doneTasks() {
      // done tasks of the current user
      return this.tasks.filter((task) => task.doneState === true && task.userId === this.userId)
    },
    // Get count of completed tasks in the last 24 hours
    completedTasksCountLast24h() {
      const now = new Date()
      const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000) // 24 hours ago
      const allCompletedTasks = [
        ...this.tasks.filter(
          (task) =>
            task.successAt && new Date(task.successAt) >= oneDayAgo && task.userId === this.userId,
        ),
        ...this.deletedCompletedTasksTemp.filter(
          (task) => new Date(task.successAt) >= oneDayAgo && task.userId === this.userId,
        ),
      ]
      return allCompletedTasks.length
    },
  },
  actions: {
    async addTask(descriptionInput) {
      const newTask = {
        description: descriptionInput,
        doneState: false,
        successAt: null,
        userId: this.userId, // Ensure tasks are linked to the current user
      }

      try {
        // Add task to Firestore and get the task with id
        const addedTask = await storeTaskForUserFs(newTask)

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
          const updatedTask = await updateTaskFs(this.userId, task.id, updatedProperties)

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
            // Pass userId to storeDeletedCompletedTaskFs
            const updatedDeletedTask = await storeDeletedCompletedTaskFs(
              deletedTask,
              this.userId, // Use the user ID here
            )

            // Keep local store in sync with Firestore data
            this.deletedCompletedTasksTemp.push(updatedDeletedTask)
          }

          // Delete the task from Firestore
          const updatedTasks = await deleteTaskFs(this.userId, task.id)

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
          deletedTasks.map((task) => storeDeletedCompletedTaskFs(task, this.userId)), // Pass user ID
        )

        // Update the local state with Firestore IDs
        this.deletedCompletedTasksTemp.push(...storedDeletedTasks)

        const updatedTasks = await deleteAllDoneTasksFs(this.userId) // delete all done tasks from Firestore, returns updated tasks

        this.tasks = updatedTasks // Keep local state in sync
      } catch (e) {
        console.error('Error deleting tasks: ', e)
      }
    },
    async clearDeletedCompletedTasksTemp() {
      const userStore = useUserStore()
      const userId = userStore.userId
      if (!userId) {
        console.error('User ID is null. Cannot clear tasks.')
        return
      }
      try {
        // Fetch deleted tasks from Firestore
        const updatedDeletedCompletedTasks = await clearDeletedCompletedTasksFs(userId)

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
      const userStore = useUserStore()

      watch(
        () => userStore.userId,
        async (newUserId) => {
          if (newUserId) {
            this.userId = newUserId
            try {
              this.tasks = await getTasksForUserFs(this.userId)
              this.deletedCompletedTasksTemp = await getDeletedCompletedTasksFs(this.userId)
            } catch (error) {
              console.error('Error fetching tasks:', error)
            }
          }
        },
        { immediate: true },
      )
    },
  },
})
