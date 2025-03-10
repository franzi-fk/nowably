import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    currentEmotion: null,
    currentStep: null,
  }),
  actions: {
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
    initLoad() {
      this.currentEmotion = JSON.parse(sessionStorage.getItem('currentEmotion')) || null
      this.currentStep = JSON.parse(sessionStorage.getItem('currentStep')) || null
    },
  },
})
