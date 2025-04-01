<template>
  <div v-if="showBanner" class="cookie-banner">
    <p>
      This app only uses essential cookies, with Google Sign-In for secure login
      and Firestore for data storage.

      <InlineLinkButton
        @click="goToPrivacyPolicy"
        type="text"
        text="Learn more"
        id="btn-learn-more"
        fontSize="0.9375rem"
      />
    </p>
    <SolidButton
      @click="closeBanner"
      type="text"
      text="Okay"
      variant="primary"
      btnSize="small"
      id="btn-ok"
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
  background: var(--cotton-01);
  color: var(--base-black);
  padding: 1.5rem 1.25rem 1.6rem 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 0.9375rem;
  gap: 1.25rem;
  border-top: 2px solid var(--sand-02);
  box-shadow: 0 0.625rem 2rem 0 var(--cloud-02);
}

#btn-learn-more {
  display: inline-flex;
}

/*________________________________________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .cookie-banner {
    padding: 0.85rem 1.25rem 0.85rem 1.25rem;
    flex-direction: row;
    gap: 2.25rem;
  }
}

/* X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
}

/* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {
}
</style>
