import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    role: 'admin',
    currentEmotion: null,
    currentStep: null,
    totalSuccessCount: 0, // Success = task completion
    dailyMeboCreation: { currentDay: new Date().toISOString().split('T')[0], meboCount: 0 },
    lastMeboReceived: null, // timestamp or null
    allReceivedMebos: [],
  }),
  actions: {
    setRoleToAdmin() {
      this.role = 'admin'
      // Save to sessionStorage
      localStorage.setItem('role', JSON.stringify(this.role))
    },
    setRoleToUser() {
      this.role = 'user'
      // Save to sessionStorage
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
      this.dailyMeboCreation.meboCount++
      // Save the updated dailyMebo data to localStorage
      this.saveDailyMeboCreation()
      localStorage.setItem('dailyMeboCreation', JSON.stringify(this.dailyMeboCreation))
    },
    updateLastMeboReceived() {
      this.lastMeboReceived = new Date().toISOString()
      localStorage.setItem('lastMeboReceived', JSON.stringify(this.lastMeboReceived))
    },
    updateAllReceivedMebos(meboId) {
      this.allReceivedMebos.push(meboId)
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

      this.role = JSON.parse(sessionStorage.getItem('role')) || 'admin'
      this.currentEmotion = JSON.parse(sessionStorage.getItem('currentEmotion')) || null
      this.currentStep = JSON.parse(sessionStorage.getItem('currentStep')) || null
      this.totalSuccessCount = JSON.parse(localStorage.getItem('totalSuccessCount')) || 0
      this.lastMeboReceived = JSON.parse(localStorage.getItem('lastMeboReceived')) || null
      this.allReceivedMebos = JSON.parse(localStorage.getItem('allReceivedMebos')) || []
    },
  },
})
