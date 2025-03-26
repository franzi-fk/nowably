import { createRouter, createWebHistory } from 'vue-router'
import CountdownView from '../views/CountdownView.vue'
import HomeView from '../views/HomeView.vue'
import NeedHelpView from '../views/NeedHelpView.vue'
import TaskInProgressView from '../views/TaskInProgressView.vue'
import TaskSuccessView from '../views/TaskSuccessView.vue'
import AfterHelpView from '../views/AfterHelpView.vue'
import CompletionCardsView from '../views/CompletionCardsView.vue'
import AllTasksView from '../views/AllTasksView.vue'
import CreateMeboView from '../views/CreateMeboView.vue'
import ReceivedMebosView from '../views/ReceivedMebosView.vue'
import AdminModerateMebosView from '../views/AdminModerateMebosView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/:catchAll(.*)', component: NotFoundView },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
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
      component: TaskSuccessView,
    },
    {
      path: '/completion-cards',
      name: 'completion-cards',
      component: CompletionCardsView,
    },
    {
      path: '/all-tasks',
      name: 'all-tasks',
      component: AllTasksView,
    },
    {
      path: '/send-message-in-bottle',
      name: 'send-message-in-bottle',
      component: CreateMeboView,
    },
    {
      path: '/received-messages',
      name: 'received-messages',
      component: ReceivedMebosView,
    },
    {
      path: '/moderate-mebos',
      name: 'moderate-mebos',
      component: AdminModerateMebosView,
    },
  ],
  scrollBehavior() {
    return { top: 0 } // Always scroll to top
  },
})

export default router
