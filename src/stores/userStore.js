import { defineStore } from 'pinia'
import { useTaskStore } from './taskStore'
import {
  updateUserFieldsFs,
  getUserFs,
  getAllReceivedMebosForUserFs,
  storeReceivedMeboForUserFs,
} from '../firestoreService'
import { signInWithGoogle, signOutUser } from '../firebaseService'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null,
    userId: null,
    role: 'user',
    currentEmotion: null,
    currentStep: null,
    totalSuccessCount: 0, // Success = task completion
    dailyMeboCreation: { currentDay: new Date().toISOString().split('T')[0], meboCount: 0 }, // Max 3 unless admin
    lastMeboReceived: null, // timestamp or null
    allReceivedMebos: [],
  }),
  getters: {
    canReceiveMebo() {
      if (!this.lastMeboReceived || this.role === 'admin') return true

      const lastReceivedDate = new Date(this.lastMeboReceived).toISOString().split('T')[0]
      const todayDate = new Date().toISOString().split('T')[0]

      return lastReceivedDate !== todayDate
    },
    availableMeboTokens() {
      if (this.role === 'admin') return Infinity

      const taskStore = useTaskStore()
      const earnedTokens = Math.min(taskStore.completedTasksCountLast24h, 3)

      return Math.max(0, earnedTokens - this.dailyMeboCreation.meboCount)
    },
  },
  actions: {
    // Login using Google
    async loginWithGoogle() {
      try {
        const user = await signInWithGoogle() // Use the firebaseService function
        this.user = user // Store user after successful login
        this.userId = user.uid
        await this.initLoad() // Load user data after login
      } catch (error) {
        console.error('Error logging in with Google:', error)
      }
    },
    async logout() {
      try {
        await signOutUser()
        this.user = null
        this.userId = null
      } catch (error) {
        console.error('Error logging out:', error)
      }
    },
    setUser(user) {
      this.user = user
      this.userId = user ? user.uid : null
    },
    setCurrentStep(step) {
      this.currentStep = step
      sessionStorage.setItem('currentStep', JSON.stringify(step))
    },
    setCurrentEmotion(emotion) {
      this.currentEmotion = emotion
      sessionStorage.setItem('currentEmotion', JSON.stringify(emotion))
    },
    async updateUserFields() {
      if (!this.userId) return

      try {
        const updatedUser = await updateUserFieldsFs(this.userId, {
          totalSuccessCount: this.totalSuccessCount,
          dailyMeboCreation: this.dailyMeboCreation,
          lastMeboReceived: this.lastMeboReceived,
        })

        Object.assign(this, updatedUser) // Update local state
      } catch (e) {
        console.error('Error updating user fields:', e)
      }
    },
    async increaseTotalSuccessCount() {
      this.totalSuccessCount++
      const updatedField = { totalSuccessCount: this.totalSuccessCount }
      await this.updateUserFields(this.userId, updatedField)
    },
    async increaseDailyMeboCreationCount() {
      if (this.role === 'admin' || this.availableMeboTokens > 0) {
        this.dailyMeboCreation.meboCount++
        const updatedField = { dailyMeboCreation: this.dailyMeboCreation }
        await this.updateUserFields(this.userId, updatedField)
      }
    },
    async resetDailyMeboCount() {
      const today = new Date().toISOString().split('T')[0]
      if (this.dailyMeboCreation.currentDay !== today) {
        this.dailyMeboCreation = { currentDay: today, meboCount: 0 }
        const updatedField = { dailyMeboCreation: this.dailyMeboCreation }
        await this.updateUserFields(this.userId, updatedField)
      }
    },
    async updateLastMeboReceived() {
      this.lastMeboReceived = new Date().toISOString()
      const updatedField = { lastMeboReceived: this.lastMeboReceived }
      await this.updateUserFields(this.userId, updatedField)
    },
    async storeAllReceivedMebos(meboId) {
      this.allReceivedMebos.push(meboId)
      await storeReceivedMeboForUserFs(this.userId, meboId)
    },
    async initLoad() {
      if (!this.userId) return

      try {
        const userData = await getUserFs(this.userId)

        if (userData) {
          Object.assign(this, {
            role: userData.role || 'user',
            totalSuccessCount: userData.totalSuccessCount || 0,
            dailyMeboCreation: userData.dailyMeboCreation || {
              currentDay: new Date().toISOString().split('T')[0],
              meboCount: 0,
            },
            lastMeboReceived: userData.lastMeboReceived || null,
          })
        }

        const receivedMebos = await getAllReceivedMebosForUserFs(this.userId)
        this.allReceivedMebos = Array.isArray(receivedMebos) ? receivedMebos : []

        this.currentEmotion = JSON.parse(sessionStorage.getItem('currentEmotion')) || null
        this.currentStep = JSON.parse(sessionStorage.getItem('currentStep')) || null

        this.resetDailyMeboCount()
      } catch (e) {
        console.error('Error initializing user data:', e)
      }
    },
  },
})
