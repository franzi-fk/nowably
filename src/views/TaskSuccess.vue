<template>
  <div class="success-view">
    <h1>Great job, you have beaten procrastination.</h1>
    <router-link :to="{ name: 'home' }"
      ><SolidButton type="text" text="Back to Home"
    /></router-link>
  </div>
</template>

<style scoped>
.success-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3rem;
  align-items: center;
  white-space: nowrap;
  background-image: radial-gradient(circle at 50%, var(--terra-01), var(--base-sand));
}
</style>
