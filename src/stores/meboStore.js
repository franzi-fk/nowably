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
    userRole: 'admin',
    userId: 1244,
  }),
  getters: {
    mebosToReceive() {
      if (this.userRole === 'admin') return this.allPublishedMebos
      if (this.userRole === 'user') return this.mebosForUsers
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
    // only for admin purposes (moderation)
    async fetchUnpublishedMebos() {
      try {
        const fetchedUnpublishedMebos = await getUnpublishedMebosFs()
        this.allUnpublishedMebos = fetchedUnpublishedMebos
      } catch (error) {
        console.error('Error loading mebos from Firestore:', error)
      }
    },
    // only for admin purposes (testing)
    async fetchPublishedMebos() {
      try {
        const fetchedPublishedMebos = await getPublishedMebosFs()
        this.allPublishedMebos = fetchedPublishedMebos
      } catch (error) {
        console.error('Error loading mebos from Firestore:', error)
      }
    },
    async initLoad() {
      const userStore = useUserStore()
      this.userRole = userStore.role // Get user role from userStore
      this.userId = userStore.userId

      // Load mebosToReceive from Firestore
      try {
        const fetchedMebosToReceive = await getPublishedMebosExcludingUserFs(this.userId)
        this.mebosForUsers = fetchedMebosToReceive
      } catch (error) {
        console.error('Error loading mebos from Firestore:', error)
      }

      // If admin is logged in, load all published and unpublished mebos
      if (this.userRole === 'admin') {
        this.allPublishedMebos = this.fetchPublishedMebos()
        this.allUnpublishedMebos = this.fetchUnpublishedMebos()
      }
    },
  },
})

/*_______________________________*/

// Mebos to start with:

// Hey, I know that task you are trying to get it done feels like impossible to beat. I've been there myself and I still am very regularly. I wanna finish a to-do or be done with a project but I seem to never start in the first place. The funny thing is after I started, it always feels much easier than what I was imagining. That first step is always the hardest to take and afterwards it only gets better when you finally started doing something about it. How I end up beating my procrastination was just doing it on a random moment, without any thinking just doing what needs to be done. Activate your mind and body without it even realizing, believe me it will work better than you expect! I believe you can do it and you should believe in yourself too.

// When I have a giant heap of work to do, I often find myself putting it off for days, if not weeks. It's important to embrace the satisfaction - the relief - one feels after finally finishing the task at hand. Truly the hardest thing about doing something is starting to do it. The second hardest thing after that, is picking a new task.

// When I have trouble starting to a task it’s usually because I focus too much on the mountain of work ahead and worry about stuff I cannot influence at that moment. Finishing the biggest part of a task feels very good but is a horrible starting point. I would start with the easiest step of a task to get myself motivated and maybe even do another small step before then taking a break. Getting a task done as fast as possible feels good and relieving but it really tires you out very fast and it’s rather demotivating. Doing things one step at a time is the way to go for me. Try to not look too far ahead and focus on the here and now the rest will happen naturally.
