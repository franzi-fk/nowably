import { defineStore } from 'pinia'
import {
  getPublishedMebosExcludingUserFs,
  getUnpublishedMebosFs,
  getPublishedMebosFs,
  addMeboFs,
  deleteMeboFs,
  publishMeboFs,
} from '../firestoreService'
import { useUserStore } from './userStore' // Import the userStore

export const useMeboStore = defineStore('meboStore', {
  // mebo stands for Message in a Bottle
  state: () => ({
    mebosForUsers: [], // standard use case; excludes unpublished mebos and mebos written by current user
    allUnpublishedMebos: [], // for admin purposes
    allPublishedMebos: [], // for admin purposes
    userRole: null,
    userId: null,
  }),
  getters: {
    mebosToReceive() {
      if (this.userRole === 'admin') return [...this.allPublishedMebos]
      if (this.userRole === 'user') return [...this.mebosForUsers]
      return [] // Return an empty array if no valid role
    },
  },
  actions: {
    async addNewMebo(message) {
      try {
        await addMeboFs(message, this.userId)
      } catch (error) {
        console.error('Error adding mebo:', error)
      }
    },
    async deleteMebo(meboId) {
      try {
        const response = await deleteMeboFs(meboId)
        this.allUnpublishedMebos = response
      } catch (error) {
        console.error('Error deleting mebo:', error)
      }
    },
    async publishMebo(meboId) {
      try {
        const response = await publishMeboFs(meboId)
        this.allUnpublishedMebos = response
      } catch (error) {
        console.error('Error publishing mebo:', error)
      }
    },
    async initLoad() {
      const userStore = useUserStore()
      this.userRole = userStore.role // Get user role from userStore
      this.userId = userStore.userId

      // Load mebosToReceive and allPublishedMebos from Firestore
      try {
        this.mebosForUsers = await getPublishedMebosExcludingUserFs(this.userId)
        this.allPublishedMebos = await getPublishedMebosFs()
      } catch (error) {
        console.error('Error loading mebos from Firestore:', error)
      }

      // If admin is logged in, load all unpublished mebos
      try {
        if (this.userRole === 'admin') {
          this.allUnpublishedMebos = await getUnpublishedMebosFs()
        }
      } catch (error) {
        console.error('Error loading mebos from Firestore:', error)
      }
    },
  },
})
