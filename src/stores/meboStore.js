import { defineStore } from 'pinia'
import { getMebosFromFirestore, addMeboFs, deleteMeboFs, publishMeboFs } from '../firestoreService'
import { useUserStore } from './userStore' // Import the userStore

export const useMeboStore = defineStore('meboStore', {
  // mebo stands for Message in a Bottle
  state: () => ({
    mebos: [],
  }),
  getters: {
    unpublishedMebos() {
      return this.mebos.filter((mebo) => mebo.published === false)
    },
    publishedMebos() {
      return this.mebos.filter((mebo) => mebo.published === true)
    },
  },
  actions: {
    async addNewMebo(message) {
      const userStore = useUserStore()
      const userId = userStore.userId // Get user ID from userStore

      // Check if user tries to add a duplicate (case-insensitive)
      const isDuplicate = this.mebos.some(
        (existingMebo) => existingMebo.text.toLowerCase() === message.toLowerCase(),
      )
      if (isDuplicate) return // prevent adding duplicate

      try {
        this.mebos = await addMeboFs({
          author: userId,
          text: message,
          published: false,
        })
      } catch (error) {
        console.error('Error adding mebo:', error)
      }
    },
    async deleteMebo(meboId) {
      try {
        this.mebos = await deleteMeboFs(meboId)
      } catch (error) {
        console.error('Error deleting mebo:', error)
      }
    },
    async publishMebo(meboId) {
      try {
        this.mebos = await publishMeboFs(meboId)
      } catch (error) {
        console.error('Error publishing mebo:', error)
      }
    },
    async initLoad() {
      try {
        // Load all mebos from Firestore
        const mebos = await getMebosFromFirestore()

        // Get the current user data from the user store
        const userStore = useUserStore()
        const userId = userStore.user ? userStore.user.uid : null

        // Filter mebos:
        // - Published
        // - Not created by the current user
        this.mebos = mebos.filter((mebo) => mebo.published === true && mebo.author !== userId) || [] // Fallback to an empty array if no mebos match
      } catch (error) {
        console.error('Error loading mebos from Firestore:', error)
      }
    },
  },
})

/*_______________________________*/

// Mebos to start with:

// Hey, I know that task you are trying to get it done feels like impossible to beat. I've been there myself and I still am very regularly. I wanna finish a to-do or be done with a project but I seem to never start in the first place. The funny thing is after I started, it always feels much easier than what I was imagining. That first step is always the hardest to take and afterwards it only gets better when you finally started doing something about it. How I end up beating my procrastination was just doing it on a random moment, without any thinking just doing what needs to be done. Activate your mind and body without it even realizing, believe me it will work better than you expect! I believe you can do it and you should believe in yourself too.

// When I have a giant heap of work to do, I often find myself putting it off for days, if not weeks. It's important to embrace the satisfaction - the relief - one feels after finally finishing the task at hand. Truly the hardest thing about doing something is starting to do it. The second hardest thing after that, is picking a new task.

// When I have trouble starting to a task it’s usually because I focus too much on the mountain of work ahead and worry about stuff I cannot influence at that moment. Finishing the biggest part of a task feels very good but is a horrible starting point. I would start with the easiest step of a task to get myself motivated and maybe even do another small step before then taking a break. Getting a task done as fast as possible feels good and relieving but it really tires you out very fast and it’s rather demotivating. Doing things one step at a time is the way to go for me. Try to not look too far ahead and focus on the here and now the rest will happen naturally.
