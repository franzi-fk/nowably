<template>
  <div class="success-view flex-grow page-padding-inline">
    <Illus_Success width="16" />
    <h1>Great job, you have beaten procrastination.</h1>
    <SolidButton
      type="text"
      text="Back to Home"
      variant="primary"
      @click="backToHome"
    />
  </div>
</template>

<script>
import Illus_Success from "../components/Visuals/Illus_Success.vue";
import { useTaskStore } from "../stores/taskStore";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";

export default {
  name: "TaskSuccessView",
  components: {
    Illus_Success,
  },
  data() {
    return {
      taskStore: useTaskStore(),
      userStore: useUserStore(),
      router: useRouter(),
    };
  },
  methods: {
    backToHome() {
      this.userStore.setCurrentStep(null);
      this.taskStore.setCurrentTask(null);
      this.router.push({ name: "home" });
    },
  },
  mounted() {
    this.userStore.initLoad();
    this.taskStore.initLoad();
  },
};
</script>

<style scoped>
.success-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3rem;
  align-items: center;
}
</style>
