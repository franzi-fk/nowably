import { createRouter, createWebHistory } from "vue-router";
import CountdownView from "../views/CountdownView.vue";
import HomeView from "../views/HomeView.vue";
import NeedHelpView from "../views/NeedHelpView.vue";
import TaskInProgressView from "../views/TaskInProgressView.vue";
import TaskSuccessView from "../views/TaskSuccessView.vue";
import AfterHelpView from "../views/AfterHelpView.vue";
import CompletionCardsView from "../views/CompletionCardsView.vue";
import AllTasksView from "../views/AllTasksView.vue";
import CreateMeboView from "../views/CreateMeboView.vue";
import ReceivedMebosView from "../views/ReceivedMebosView.vue";
import AdminModerateMebosView from "../views/AdminModerateMebosView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import LoginView from "../views/LoginView.vue";
import PrivacyPolicyView from "../views/PrivacyPolicyView.vue";
import LegalNoticeView from "../views/LegalNoticeView.vue";
import TermsOfUseView from "../views/TermsOfUseView.vue";
import AccountView from "../views/AccountView.vue";
import { auth } from "../firebaseConfig";
import { useUserStore } from "../stores/userStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/:catchAll(.*)", component: NotFoundView },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:id/countdown",
      name: "countdown",
      component: CountdownView,
      meta: { requiresAuth: true },
    },
    {
      path: "/need-help",
      name: "need-help",
      component: NeedHelpView,
      meta: { requiresAuth: true },
    },
    {
      path: "/task-continue",
      name: "task-continue",
      component: AfterHelpView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:id/working-on-task",
      name: "task-in-progress",
      component: TaskInProgressView,
      meta: { requiresAuth: true },
    },
    {
      path: "/task-success",
      name: "task-success",
      component: TaskSuccessView,
      meta: { requiresAuth: true },
    },
    {
      path: "/completion-cards",
      name: "completion-cards",
      component: CompletionCardsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/all-tasks",
      name: "all-tasks",
      component: AllTasksView,
      meta: { requiresAuth: true },
    },
    {
      path: "/send-message-in-bottle",
      name: "send-message-in-bottle",
      component: CreateMeboView,
      meta: { requiresAuth: true },
    },
    {
      path: "/received-messages",
      name: "received-messages",
      component: ReceivedMebosView,
      meta: { requiresAuth: true },
    },
    {
      path: "/moderate-mebos",
      name: "moderate-mebos",
      component: AdminModerateMebosView,
      meta: { requiresAuth: true },
    },
    {
      path: "/account",
      name: "account",
      component: AccountView,
      meta: { requiresAuth: true },
    },
    {
      path: "/terms-of-use",
      name: "terms-of-use",
      component: TermsOfUseView,
    },
    {
      path: "/privacy",
      name: "privacy-policy",
      component: PrivacyPolicyView,
    },
    {
      path: "/legal-notice",
      name: "legal-notice",
      component: LegalNoticeView,
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  document.body.style.overflow = ""; // Restore scroll on route change

  const user = auth.currentUser;
  const requiresAuth = to.meta.requiresAuth;

  // If Firebase user is logged in, allow navigation
  if (user) {
    next();
    return;
  }

  // If no Firebase user, check if userStore has a demo session
  const userStore = useUserStore();

  if (requiresAuth && !user && !userStore.isDemo) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
