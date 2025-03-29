<template>
  <div v-if="showBanner" class="cookie-banner">
    <div class="text-container">
      <p>
        This app only uses essential cookies, with Google Sign-In for secure
        login and Firestore for data storage.
      </p>
      <LinkButton
        @click="goToPrivacyPolicy"
        type="text"
        text="Learn more"
        variant="secondary"
        btnSize="small"
      />
    </div>
    <SolidButton
      @click="closeBanner"
      type="text"
      text="Okay"
      variant="primary"
      btnSize="small"
    />
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "CookieBanner",
  data() {
    return {
      router: useRouter(),
      showBanner: true,
    };
  },
  mounted() {
    if (localStorage.getItem("cookieAccepted")) {
      this.showBanner = false;
    } else {
      this.showBanner = true;
    }
  },
  methods: {
    closeBanner() {
      localStorage.setItem("cookieAccepted", "true");
      this.showBanner = false;
    },
    goToPrivacyPolicy() {
      this.router.push({ name: "privacy-policy" });
    },
  },
};
</script>

<style scoped>
.cookie-banner {
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  background: var(--base-white);
  color: var(--base-black);
  padding: 0.75rem 2rem 0.75rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  gap: 2rem;
}

.text-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  gap: 0.5rem;
  text-align: left;
}
</style>
