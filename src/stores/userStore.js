import { defineStore } from 'pinia'
import { useTaskStore } from './taskStore'
import { updateUserFieldsFs, getUserFromFirestore } from '../firestoreService'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userId: 'external',
    role: 'user',
    currentEmotion: null,
    currentStep: null,
    totalSuccessCount: 0, // Success = task completion
    dailyMeboCreation: { currentDay: new Date().toISOString().split('T')[0], meboCount: 0 }, // meboCount can maximum be 3, unless role = admin > then infinite
    lastMeboReceived: null, // timestamp or null
    allReceivedMebos: [],
  }),
  getters: {
    canReceiveMebo() {
      if (!this.lastMeboReceived) {
        return true // if null / no record, return true
      }

      if (this.role === 'admin') {
        return true // admins can receive infinite
      }

      const lastReceivedDate = new Date(this.lastMeboReceived).toISOString().split('T')[0]
      const todayDate = new Date().toISOString().split('T')[0]

      return lastReceivedDate !== todayDate
    },
    availableMeboTokens() {
      // Tokens (per user) for mebo creation by the user; maximum is 3
      if (this.role === 'admin') {
        return Infinity // Admins have unlimited tokens
      }
      const taskStore = useTaskStore()

      // Get the number of completed tasks in the last 24h, cap at 3
      const earnedTokens = Math.min(taskStore.completedTasksCountLast24h, 3)

      // If the user has already used 3 tokens today, they cannot earn more
      if (this.dailyMeboCreation.meboCount >= 3) {
        return 0
      }

      // Return the remaining tokens the user can use
      return Math.max(0, earnedTokens - this.dailyMeboCreation.meboCount)
    },
  },
  actions: {
    async setRoleToAdmin() {
      try {
        this.role = 'admin'
        const updatedUser = await updateUserFieldsFs(this.userId, { role: this.role })
        // Update local state with the returned data
        this.role = updatedUser.role
      } catch (e) {
        console.error('Error setting role to admin:', e)
      }
    },
    async setRoleToUser() {
      try {
        this.role = 'user'
        const updatedUser = await updateUserFieldsFs(this.userId, { role: this.role })
        // Update local state with the returned data
        this.role = updatedUser.role
      } catch (e) {
        console.error('Error setting role to user:', e)
      }
    },
    setCurrentStep(step) {
      this.currentStep = step
      // Save to sessionStorage
      sessionStorage.setItem('currentStep', JSON.stringify(step))
    },
    setCurrentEmotion(emotion) {
      this.currentEmotion = emotion
      // Save to sessionStorage
      sessionStorage.setItem('currentEmotion', JSON.stringify(emotion))
    },
    async increaseTotalSuccessCount() {
      try {
        this.totalSuccessCount++
        const updatedUser = await updateUserFieldsFs(this.userId, {
          totalSuccessCount: this.totalSuccessCount,
        })
        // Update local state with the returned data
        this.totalSuccessCount = updatedUser.totalSuccessCount
      } catch (e) {
        console.error('Error increasing total success count:', e)
      }
    },
    async increaseDailyMeboCreationCount() {
      try {
        if (this.role === 'admin' || this.availableMeboTokens > 0) {
          this.dailyMeboCreation.meboCount++
          const updatedUser = await updateUserFieldsFs(this.userId, {
            dailyMeboCreation: this.dailyMeboCreation,
          })
          // Update local state with the returned data
          this.dailyMeboCreation = updatedUser.dailyMeboCreation
        }
      } catch (e) {
        console.error('Error increasing daily mebo creation count:', e)
      }
    },
    async resetDailyMeboCount() {
      try {
        const today = new Date().toISOString().split('T')[0]
        if (this.dailyMeboCreation.currentDay !== today) {
          this.dailyMeboCreation = { currentDay: today, meboCount: 0 }
          const updatedUser = await updateUserFieldsFs(this.userId, {
            dailyMeboCreation: this.dailyMeboCreation,
          })
          // Update local state with the returned data
          this.dailyMeboCreation = updatedUser.dailyMeboCreation
        }
      } catch (e) {
        console.error('Error resetting daily mebo count:', e)
      }
    },
    async updateLastMeboReceived() {
      try {
        this.lastMeboReceived = new Date().toISOString()
        const updatedUser = await updateUserFieldsFs(this.userId, {
          lastMeboReceived: this.lastMeboReceived,
        })
        // Update local state with the returned data
        this.lastMeboReceived = updatedUser.lastMeboReceived
      } catch (e) {
        console.error('Error updating last mebo received:', e)
      }
    },
    async updateAllReceivedMebos(meboId) {
      try {
        this.allReceivedMebos.push(meboId)
        const updatedUser = await updateUserFieldsFs(this.userId, {
          allReceivedMebos: this.allReceivedMebos,
        })
        // Update local state with the returned data
        this.allReceivedMebos = updatedUser.allReceivedMebos
      } catch (e) {
        console.error('Error updating all received mebos:', e)
      }
    },
    async initLoad() {
      try {
        // Retrieve user data from Firestore
        const userData = await getUserFromFirestore(this.userId)
        if (userData) {
          // Load data from Firestore into local state
          this.role = userData.role || 'user'
          this.totalSuccessCount = userData.totalSuccessCount || 0
          this.dailyMeboCreation = userData.dailyMeboCreation || {
            currentDay: new Date().toISOString().split('T')[0],
            meboCount: 0,
          }
          this.lastMeboReceived = userData.lastMeboReceived || null
          this.allReceivedMebos = userData.allReceivedMebos || []
        }

        // Load currentEmotion and currentStep from sessionStorage
        this.currentEmotion = JSON.parse(sessionStorage.getItem('currentEmotion')) || null
        this.currentStep = JSON.parse(sessionStorage.getItem('currentStep')) || null

        // Reset daily mebo count if necessary
        this.resetDailyMeboCount()
      } catch (e) {
        console.error('Error initializing user data:', e)
      }
    },
  },
})
