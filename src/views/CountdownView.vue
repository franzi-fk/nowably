<template>
  <div class="countdown-view">
    <CountdownAnimation />
    <div class="button-container">
      <router-link :to="{ name: 'need-help' }"
        ><SolidButton type="text" text="I need help"
      /></router-link>
      <router-link :to="{ name: 'task-in-progress' }"
        ><SolidButton
          type="text"
          text="I started"
          backgroundColor="var(--primary)"
          textColor="var(--base-white)"
      /></router-link>
    </div>
  </div>
</template>

<script>
import CountdownAnimation from '../components/CountdownAnimation.vue'

export default {
  name: 'CountdownView',
  components: {
    CountdownAnimation,
  },
}
</script>

<style scoped>
.countdown-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  background-image: radial-gradient(circle at 50%, var(--terra-01), var(--base-sand));
}

.countdown-container {
  margin: 4rem;
}

.button-container {
  display: flex;
  gap: 2rem;
}
</style>
