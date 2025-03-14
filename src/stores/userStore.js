import { defineStore } from 'pinia'
import { useTaskStore } from './taskStore'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    role: 'user',
    currentEmotion: null,
    currentStep: null,
    totalSuccessCount: 0, // Success = task completion
    dailyMeboCreation: { currentDay: new Date().toISOString().split('T')[0], meboCount: 0 }, // meboCount can maximum be 3, unless role = admin > then infinite
    lastMeboReceived: null, // timestamp or null
    allReceivedMebos: [],
  }),
  getters: {
    availableMeboTokens() {
      if (this.role === 'admin') {
        return Infinity // Admins have unlimited tokens
      }
      // maximum available tokens per user per day: 3
      const taskStore = useTaskStore()

      // Ensure the daily counter resets when a new day starts
      const today = new Date().toISOString().split('T')[0]
      if (this.dailyMeboCreation.currentDay !== today) {
        this.dailyMeboCreation = { currentDay: today, meboCount: 0 }
        localStorage.setItem('dailyMeboCreation', JSON.stringify(this.dailyMeboCreation))
      }

      // Get the number of completed tasks in the last 24h, cap at 3
      const earnedTokens = Math.min(taskStore.completedTasksCountLast24h, 3)

      // If the user has already used 3 tokens today, they cannot earn more
      if (this.dailyMeboCreation.meboCount >= 3) {
        return 0
      }

      // Return the remaining tokens the user can use (subtract spent tokens (meboCount) from earnedTokens)
      return Math.max(0, earnedTokens - this.dailyMeboCreation.meboCount)
    },
  },
  actions: {
    setRoleToAdmin() {
      this.role = 'admin'
      // Save to localStorage
      localStorage.setItem('role', JSON.stringify(this.role))
    },
    setRoleToUser() {
      this.role = 'user'
      // Save to localStorage
      localStorage.setItem('role', JSON.stringify(this.role))
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
    increaseTotalSuccessCount() {
      this.totalSuccessCount++
      // Save to sessionStorage
      localStorage.setItem('totalSuccessCount', JSON.stringify(this.totalSuccessCount))
    },
    increaseDailyMeboCreationCount() {
      if (this.role === 'admin' || this.availableMeboTokens > 0) {
        this.dailyMeboCreation.meboCount++
        localStorage.setItem('dailyMeboCreation', JSON.stringify(this.dailyMeboCreation))
      }
    },
    updateLastMeboReceived() {
      this.lastMeboReceived = new Date().toISOString()
      // Save to localStorage
      localStorage.setItem('lastMeboReceived', JSON.stringify(this.lastMeboReceived))
    },
    updateAllReceivedMebos(meboId) {
      this.allReceivedMebos.push(meboId)
      // Save to localStorage
      localStorage.setItem('allReceivedMebos', JSON.stringify(this.allReceivedMebos))
    },
    initLoad() {
      // Initialize dailyMeboCreation with today's date and load any saved data
      this.dailyMeboCreation.currentDay = new Date().toISOString().split('T')[0] // Ensure it updates on each load
      const savedDailyMebo = JSON.parse(localStorage.getItem('dailyMeboCreation')) || {
        currentDay: this.dailyMeboCreation.currentDay,
        meboCount: 0,
      }
      this.dailyMeboCreation.meboCount = savedDailyMebo.meboCount

      this.role = JSON.parse(localStorage.getItem('role')) || 'user'
      this.currentEmotion = JSON.parse(sessionStorage.getItem('currentEmotion')) || null
      this.currentStep = JSON.parse(sessionStorage.getItem('currentStep')) || null
      this.totalSuccessCount = JSON.parse(localStorage.getItem('totalSuccessCount')) || 0
      this.lastMeboReceived = JSON.parse(localStorage.getItem('lastMeboReceived')) || null
      this.allReceivedMebos = JSON.parse(localStorage.getItem('allReceivedMebos')) || []
    },
  },
})
