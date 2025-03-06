import { createRouter, createWebHistory } from 'vue-router'
import CountdownView from '../views/CountdownView.vue'
import HomeView from '../views/HomeView.vue'
import NeedHelpView from '../views/NeedHelpView.vue'
import TaskInProgressView from '../views/TaskInProgressView.vue'
import TaskSuccess from '../views/TaskSuccess.vue'
import AfterHelpView from '../views/AfterHelpView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/:id/countdown',
      name: 'countdown',
      component: CountdownView,
    },
    {
      path: '/need-help',
      name: 'need-help',
      component: NeedHelpView,
    },
    {
      path: '/task-continue',
      name: 'task-continue',
      component: AfterHelpView,
    },
    {
      path: '/:id/working-on-task',
      name: 'task-in-progress',
      component: TaskInProgressView,
    },
    {
      path: '/task-success',
      name: 'task-success',
      component: TaskSuccess,
    },
  ],
})

export default router
