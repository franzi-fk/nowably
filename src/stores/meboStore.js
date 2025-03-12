import { defineStore } from 'pinia'

export const useMeboStore = defineStore('meboStore', {
  // mebo stands for Message in a Bottle
  state: () => ({
    messages: [
      {
        id: 'mebo-20250311T152417382377',
        author: 'external', // usually userId; use 'external' for manually added mebos
        text: "When I have trouble starting to a task it's usually because I focus too much on the mountain of work ahead and worry about stuff I cannot influence at that moment. Finishing the biggest part of a task feels very good but is a horrible starting point. I would start with the easiest step of a task to get myself motivated and maybe even do another small step before then taking a break. Getting a task done as fast as possible feels good and relieving but it really tires you out very fast and it’s rather demotivating. Doing things one step at a time is the way to go for me. Try to not look too far ahead and focus on the here and now the rest will happen naturally.",
      },
    ],
  }),
  actions: {
    generateUniqueId() {
      const now = new Date()
      const datePart = now.toISOString().replace(/[-:.]/g, '') // Format the date (e.g., "20250302T102040")
      const timePart = now.getMilliseconds() // Add milliseconds for further uniqueness
      const randomPart = Math.floor(Math.random() * 1000) // Add a random number to ensure uniqueness
      return `mebo-${datePart}${timePart}${randomPart}`
    },
    initLoad() {},
  },
})
