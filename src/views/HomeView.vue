<template>
  <AppHeader />
  <div class="home-container flex-grow">
    <section class="welcome-message page-padding-inline">
      <h1>Welcome</h1>
      <span>Let's defeat procrastination now.</span>
    </section>
    <TaskList />
  </div>
</template>

<script>
import TaskList from '../components/TaskList.vue'
import { useTaskStore } from '../stores/taskStore'
import { useRouter } from 'vue-router'

export default {
  components: {
    TaskList,
  },
  data() {
    return {
      taskStore: useTaskStore(),
      router: useRouter(),
    }
  },
  mounted() {
    this.taskStore.setCurrentTask(null)
  },
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 2rem;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    0deg,
    color-mix(in srgb, var(--terra-01) 50%, transparent),
    var(--base-sand)
  );
}

.welcome-message {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 1rem;
  padding-block: 1.4rem 1rem;
}

span {
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.0313rem;
}

@media (min-width: 992px) {
  .home-container {
    padding: 1.5rem min(16rem, 15%);
  }
}
</style>
