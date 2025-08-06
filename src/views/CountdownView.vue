<template>
  <TaskProgressHeader />
  <article class="countdown-view flex-grow task-view-layout">
    <div class="countdown-view-body page-padding-inline">
      <h2 class="sr-only">Start working on the task</h2>
      <p class="max-ch-40">
        Start with the task before the timer hits zero. You can do this! Don't
        overthink, just start.
      </p>
      <TaskCountdown />
    </div>
    <div class="countdown-view-footer">
      <SolidButton
        type="text"
        text="I need help"
        @click="needHelp"
        variant="tertiary"
      />
      <SolidButton
        type="text"
        text="I started"
        variant="primary"
        @click="taskInProgress"
        data-cy="btn-task-started"
      />
    </div>
  </article>
</template>

<script>
import TaskCountdown from "@/components/Animations/TaskCountdown.vue";
import { useTaskStore } from "../stores/taskStore";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";
import TaskProgressHeader from "../components/Navigation/TaskProgressHeader.vue";

export default {
  name: "CountdownView",
  components: {
    TaskCountdown,
    TaskProgressHeader,
  },
  data() {
    return {
      taskStore: useTaskStore(),
      userStore: useUserStore(),
      router: useRouter(),
    };
  },
  methods: {
    needHelp() {
      this.userStore.setCurrentStep("help");
      this.router.push({ name: "need-help" });
    },
    taskInProgress() {
      this.userStore.setCurrentStep("workingOnTask");
      this.router.push({
        name: "task-in-progress",
        params: { id: this.taskStore.currentTask.id },
      });
    },
  },
  mounted() {
    this.taskStore.initLoad();
    this.userStore.initLoad();
    this.userStore.setCurrentEmotion(null);
  },
};
</script>

<style scoped>
.countdown-container {
  margin: 4rem;
}

.countdown-view-body {
  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.countdown-view-footer {
  display: flex;
  gap: 2rem;
  margin-block: 1.5rem 4rem;
}
</style>
