<template>
  <article class="received-mebos-container" v-if="this.userStore.allReceivedMebos.length > 0">
    <div class="received-mebos-header">
      <h2>Received Messages in a Bottle</h2>
      <LinkButton type="text" text="View all" @click="goToReceivedMessages()" />
    </div>
    <div class="received-mebos-body">
      <p v-if="this.userStore.allReceivedMebos.length === 1">
        Need a little boost to keep going? You have
        <span>{{ this.userStore.allReceivedMebos.length }} motivational message</span> waiting for
        you. Check it out to stay inspired and keep moving forward. You've got this!
      </p>
      <p v-if="this.userStore.allReceivedMebos.length > 1">
        Need a little boost to keep going? You have
        <span>{{ this.userStore.allReceivedMebos.length }} motivational messages</span> waiting for
        you. Check them out to stay inspired and keep moving forward. You've got this!
      </p>
    </div>
  </article>
</template>

<script>
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

export default {
  name: 'CompletionCardsTile',
  data() {
    return {
      userStore: useUserStore(),
      router: useRouter(),
    }
  },
  methods: {
    goToReceivedMessages() {
      this.router.push({ name: 'received-messages' })
    },
  },
  mounted() {
    this.userStore.initLoad()
  },
}
</script>

<style scoped>
.received-mebos-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 1.1rem;
  width: 100%;
  background-color: var(--t-white-66);
  border-radius: 1.5rem;
  padding: 2.5rem 1.25rem 3rem 1.25rem;
}

.received-mebos-header {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  min-height: 3.125rem;
}

.received-mebos-body {
  width: 100%;
  text-align: left;
  gap: 2rem;
}

.received-mebos-container span {
  font-weight: 700;
}

.card-visuals-container {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 1.5rem;
}

.completion-card-visual {
  max-width: 15rem;
  width: 100%;
}

/*_______________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .received-mebos-container {
    padding-inline: 3rem;
  }

  .completion-card-visual {
    max-width: 13.9rem;
    width: 100%;
  }

  .card-visuals-container {
    justify-content: flex-start;
  }
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
