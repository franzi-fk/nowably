<template>
  <div>
    <RouterView />

    <CookieBanner />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import CookieBanner from "./components/FeedbackAndStatus/CookieBanner.vue";
</script>

<style scoped></style>
