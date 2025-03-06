import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    currentEmotion: null,
  }),
  actions: {
    setCurrentEmotion(emotion) {
      this.currentEmotion = emotion
      // Save to sessionStorage
      sessionStorage.setItem('currentEmotion', JSON.stringify(emotion))
    },
    initLoad() {
      this.currentEmotion = JSON.parse(sessionStorage.getItem('currentEmotion')) || null
    },
  },
})
