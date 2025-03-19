<template>
  <div class="wrapper">
    <SidebarNavi :variant="this.userStore.role === 'admin' ? 'admin' : 'user'" />
    <AppHeader />
    <article class="main-view-container moderate-mebos-container flex-grow view-layout-default">
      <div class="moderate-mebos-header page-padding-inline">
        <h1>Moderate Messages in a Bottle</h1>
      </div>
      <article class="moderate-mebos-body">
        <div v-for="mebo in this.meboStore.unpublishedMebos" :key="mebo.id" class="mebo-tile">
          <p>{{ mebo.text }}</p>
          <div class="mebo-metadata">
            <small>Mebo ID: {{ mebo.id }}</small>
            <small>Author ID: {{ mebo.author }}</small>
            <small>published: {{ mebo.published }}</small>
          </div>
          <div class="mebo-actions">
            <SolidButton type="icon-text" text="Publish" icon="check" id="btn-publish" />
            <SolidButton type="icon-text" text="Delete" icon="x" id="btn-delete" />
          </div>
        </div>
      </article>
    </article>
  </div>
</template>

<script>
import SidebarNavi from '../components/Navigation/SidebarNavi.vue'
import { useUserStore } from '../stores/userStore'
import { useMeboStore } from '../stores/meboStore'
import { useRouter } from 'vue-router'

export default {
  components: {
    SidebarNavi,
  },
  data() {
    return {
      userStore: useUserStore(),
      meboStore: useMeboStore(),
      router: useRouter(),
      // mebosToModerate: [],
    }
  },
  watch: {
    'userStore.role': function (newValue, oldValue) {
      if (oldValue === 'admin' && newValue !== 'admin') {
        this.router.push({ name: 'home' })
      }
    },
  },
  mounted() {
    this.userStore.initLoad()
    this.meboStore.initLoad()
  },
}
</script>

<style scoped>
.moderate-mebos-container {
  padding-bottom: 4rem;
}

.moderate-mebos-body {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.mebo-tile {
  background-color: var(--base-white);
  border-radius: 1.5rem;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 1rem;
  text-align: left;
  max-width: 75ch;
  height: fit-content;
}

.mebo-metadata {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: var(--cloud-04);
}

.mebo-actions {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
}

#btn-publish {
  background-color: var(--success) !important;
}
#btn-delete {
  background-color: var(--error) !important;
}

#btn-delete,
#btn-publish {
  color: var(--base-white) !important;
  height: 3.5rem;
  flex-grow: 1;
}
</style>
