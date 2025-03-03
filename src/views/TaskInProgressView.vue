<template>
  <div class="in-progress-view">
    <h1>Well done. Keep going.</h1>
    <router-link :to="{ name: 'task-success' }"
      ><SolidButton type="text" text="Stop"
    /></router-link>
  </div>
</template>

<style scoped>
.in-progress-view {
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
