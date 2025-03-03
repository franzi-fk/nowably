<template>
  <div class="need-help-view">
    <h1>How do you feel right now?</h1>
    <div class="button-container">
      <SolidButton type="text" text="I feel demotivated" />
      <SolidButton type="text" text="I feel overwhelmed" />
      <SolidButton type="text" text="I feel anxious" />
    </div>
  </div>
</template>

<style scoped>
.need-help-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  background-image: radial-gradient(circle at 50%, var(--terra-01), var(--base-sand));
}
.button-container {
  width: fit-content;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 3rem;
}
</style>
