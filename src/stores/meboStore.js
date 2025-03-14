import { defineStore } from 'pinia'

export const useMeboStore = defineStore('meboStore', {
  // mebo stands for Message in a Bottle
  state: () => ({
    mebos: [],
  }),
  actions: {
    generateUniqueId() {
      const now = new Date()
      const datePart = now.toISOString().replace(/[-:.]/g, '') // Format the date (e.g., "20250302T102040")
      const timePart = now.getMilliseconds() // Add milliseconds for further uniqueness
      const randomPart = Math.floor(Math.random() * 1000) // Add a random number to ensure uniqueness
      return `${datePart}${timePart}${randomPart}`
    },
    addNewMebo(message) {
      // Check if user tries to add a duplicate (case-insensitive)
      // const isDuplicate = this.mebos.some(
      //   (existingMebo) => existingMebo.text.toLowerCase() === message.toLowerCase(),
      // )
      // if (isDuplicate) {
      //   return // prevent adding duplicate
      // } else {
      this.mebos.push({
        id: `mebo-${this.generateUniqueId()}`,
        author: 'test',
        text: message,
        published: true, // change to false as soon as moderation available
      })

      localStorage.setItem('mebos', JSON.stringify(this.mebos))
      // }
    },
    initLoad() {
      const storedMebos = localStorage.getItem('mebos')
      if (storedMebos) {
        this.mebos = JSON.parse(storedMebos) || null
        // [
        //   {
        //     id: 'mebo-20250311T152417382377',
        //     author: 'external', // usually userId; use 'external' for manually added mebos
        //     text: "When I have trouble starting to a task it's usually because I focus too much on the mountain of work ahead and worry about stuff I cannot influence at that moment. Finishing the biggest part of a task feels very good but is a horrible starting point. I would start with the easiest step of a task to get myself motivated and maybe even do another small step before then taking a break. Getting a task done as fast as possible feels good and relieving but it really tires you out very fast and it’s rather demotivating. Doing things one step at a time is the way to go for me. Try to not look too far ahead and focus on the here and now the rest will happen naturally.",
        //     published: true,
        //   },
        //   {
        //     id: 'mebo-20250312T174003923923919',
        //     author: 'external',
        //     text: "When I have a giant heap of work to do, I often find myself putting it off for days, if not weeks. It's important to embrace the satisfaction - the relief - one feels after finally finishing the task at hand. Truly the hardest thing about doing something is starting to do it. The second hardest thing after that, is picking a new task.",
        //     published: true,
        //   },
        // ]
      }
    },
  },
})
