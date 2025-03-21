<template>
  <div class="wrapper">
    <SidebarNavi :variant="this.userStore.role === 'admin' ? 'admin' : 'user'" />
    <AppHeader />
    <article class="main-view-container tasks-view-container flex-grow view-layout-default">
      <section class="tasks-view-header page-padding-inline">
        <h1>All Tasks</h1>
      </section>
      <div class="tile-container">
        <section class="open-tasks">
          <OpenTasksList :showViewAll="false" />
        </section>
        <section class="done-tasks"><DoneTasksList :showViewAll="false" /></section>
      </div>
    </article>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useTaskStore } from '../stores/taskStore'
import OpenTasksList from '@/components/DataDisplay/OpenTasksList.vue'
import DoneTasksList from '@/components/DataDisplay/DoneTasksList.vue'
import SidebarNavi from '../components/Navigation/SidebarNavi.vue'

export default {
  name: 'CompletionCardsView',
  components: {
    OpenTasksList,
    DoneTasksList,
    SidebarNavi,
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

/*_______________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
}

/* X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
}

/* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {
}
</style>
