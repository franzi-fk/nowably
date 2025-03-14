<template>
  <AppHeader />
  <article class="tasks-view-container flex-grow view-layout-default">
    <section class="tasks-view-header page-padding-inline">
      <h1>Tasks</h1>
    </section>
    <div class="tile-container">
      <section class="open-tasks">
        <OpenTasksList :showViewAll="false" />
      </section>
      <section class="done-tasks"><DoneTasksList :showViewAll="false" /></section>
    </div>
  </article>
</template>

<script>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useTaskStore } from '../stores/taskStore'
import OpenTasksList from '@/components/DataDisplay/OpenTasksList.vue'
import DoneTasksList from '@/components/DataDisplay/DoneTasksList.vue'

export default {
  name: 'CompletionCardsView',
  components: {
    OpenTasksList,
    DoneTasksList,
  },
  data() {
    return {
      router: useRouter(),
      taskStore: useTaskStore(),
      userStore: useUserStore(),
    }
  },
  mounted() {
    this.userStore.initLoad()
    this.taskStore.initLoad()
  },
}
</script>

<style scoped>
.tasks-view-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 2rem;
  width: 100%;
  height: 100%;
  background-image: var(--linear-sand-01);
}

.tasks-view-header {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 1rem;
  padding-block: 1.4rem 1rem;
}

.open-tasks,
.done-tasks,
.task-list-container {
  width: 100%;
}

.tile-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-bottom: 5rem;
}

/*________________________________________________________________*/

@media (min-width: 992px) {
  .tasks-view-container {
    padding: 1.5rem min(16rem, 15%);
  }
}
</style>
