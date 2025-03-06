<template>
  <div class="after-help-view flex-grow">
    <section class="welcome-message page-padding-inline">
      <h1>Do you want to continue right now?</h1>
    </section>
  </div>
</template>

<script>
import { useTaskStore } from '../stores/taskStore'
import { useRouter } from 'vue-router'

export default {
  components: {},
  data() {
    return {
      taskStore: useTaskStore(),
      router: useRouter(),
    }
  },
  mounted() {},
}
</script>

<style scoped></style>
