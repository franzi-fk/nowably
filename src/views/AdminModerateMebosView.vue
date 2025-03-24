<template>
  <div class="wrapper">
    <SidebarNavi :variant="this.userStore.role === 'admin' ? 'admin' : 'user'" />
    <AppHeader />
    <article class="main-view-container moderate-mebos-container flex-grow view-layout-default">
      <div class="moderate-mebos-header page-padding-inline">
        <h1>Moderate Messages in a Bottle</h1>
      </div>
      <article
        class="moderate-mebos-body page-padding-inline moderate-mebo-empty-state"
        v-if="this.meboStore.allUnpublishedMebos.length <= 0"
      >
        <p>There are no unpublished Messages in a Bottle.</p>
      </article>
      <article class="moderate-mebos-body" v-else>
        <div v-for="mebo in this.meboStore.allUnpublishedMebos" :key="mebo.id" class="mebo-tile">
          <p>{{ mebo.text }}</p>
          <div class="mebo-metadata">
            <small>Mebo ID: {{ mebo.id }}</small>
            <small>Author ID: {{ mebo.author }}</small>
            <small>published: {{ mebo.published }}</small>
          </div>
          <div class="mebo-actions">
            <SolidButton
              type="icon-text"
              text="Publish"
              icon="check"
              id="btn-publish"
              @click="publishMebo(mebo.id)"
            />
            <SolidButton
              type="icon-text"
              text="Delete"
              icon="x"
              id="btn-delete"
              @click="deleteMebo(mebo.id)"
            />
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
    }
  },
  methods: {
    publishMebo(meboId) {
      this.meboStore.publishMebo(meboId)
    },
    deleteMebo(meboId) {
      this.meboStore.deleteMebo(meboId)
    },
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

.moderate-mebos-header {
  padding-block: 1.4rem 1rem;
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
  background-color: var(--success-light);
  color: var(--success-dark);
  border-bottom: 0.375rem solid var(--success);
}
#btn-delete {
  background-color: var(--error-light);
  color: var(--error-dark);
  border-bottom: 0.375rem solid var(--error);
}

#btn-delete,
#btn-publish {
  height: 3.5rem;
  flex-grow: 1;
}
</style>
