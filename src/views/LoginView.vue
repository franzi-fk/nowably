<template>
  <div class="login-view flex-grow view-layout-default">
    <div class="login-container">
      <div class="login-container-body">
        <section class="intro">
          <h1>
            <NowablyLogo variant="image" width="4" /><NowablyLogo
              variant="text"
              width="9"
            /><span class="sr-only">Nowably</span>
          </h1>
          <span>Beat procrastination now.</span>
        </section>
        <div v-if="!user" class="sign-in-action">
          <button @click="loginWithGoogle" id="btn-login">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              data-testid="google-icon"
              aria-hidden="true"
            >
              <path
                d="M1.24182 6.67897C1.98432 5.13169 3.03341 3.82393 4.35554 2.73652C6.14713 1.2563 8.20219 0.365299 10.5063 0.0922493C13.2129 -0.228704 15.7566 0.283863 18.1086 1.69222C18.693 2.04192 19.2391 2.43952 19.7613 2.87065C19.8906 2.97604 19.8763 3.03831 19.7661 3.1437C18.6978 4.20715 17.6296 5.27061 16.5709 6.34365C16.4464 6.4682 16.3793 6.45862 16.2452 6.35802C13.141 3.96764 8.61416 4.61433 6.30042 7.77596C5.89324 8.33164 5.56271 8.93043 5.33277 9.58192C5.31361 9.6394 5.27529 9.6921 5.24655 9.74958C4.62859 9.28013 4.00585 8.81067 3.39269 8.33643C2.67413 7.78554 1.95558 7.23465 1.24182 6.67897Z"
                fill="#E94335"
              ></path>
              <path
                d="M5.24646 14.2429C5.45244 14.698 5.62489 15.1722 5.88357 15.5986C6.97098 17.3806 8.52305 18.5255 10.5685 18.9327C12.4128 19.3015 14.1852 19.0524 15.8379 18.1279C15.8954 18.0991 15.9529 18.0704 16.0056 18.0417C16.0343 18.0704 16.0583 18.1039 16.087 18.1279C17.3229 19.086 18.5636 20.044 19.7995 21.0021C19.2055 21.5913 18.5301 22.0656 17.8115 22.4775C15.7277 23.6655 13.4715 24.1446 11.0955 23.9625C8.13503 23.7326 5.58178 22.5637 3.47403 20.456C2.54949 19.5315 1.78783 18.4872 1.23694 17.2944C1.74951 16.9016 2.26207 16.5135 2.77464 16.1207C3.59858 15.4932 4.42252 14.8705 5.24646 14.2429Z"
                fill="#34A853"
              ></path>
              <path
                d="M19.8044 21.0021C18.5685 20.044 17.3278 19.086 16.0919 18.1279C16.0632 18.1039 16.0344 18.0704 16.0105 18.0417C16.4368 17.7111 16.8727 17.3902 17.2224 16.9686C17.8069 16.2692 18.1949 15.4788 18.3961 14.5926C18.42 14.4824 18.4009 14.4441 18.2907 14.4489C18.2332 14.4537 18.1805 14.4489 18.123 14.4489C16.1686 14.4489 14.2093 14.4441 12.2548 14.4537C12.0393 14.4537 11.9914 14.3962 11.9962 14.1902C12.0057 12.801 12.0057 11.4118 11.9962 10.0226C11.9962 9.84539 12.0441 9.79749 12.2213 9.79749C15.8045 9.80228 19.3877 9.80228 22.9756 9.79749C23.1289 9.79749 23.1912 9.83581 23.2295 9.99868C23.5217 11.316 23.5026 12.6382 23.3253 13.9699C23.1816 15.0333 22.9229 16.0633 22.5253 17.0596C21.9361 18.5303 21.0691 19.8141 19.929 20.9159C19.8859 20.9494 19.8427 20.9734 19.8044 21.0021Z"
                fill="#4285F3"
              ></path>
              <path
                d="M5.24651 14.2429C4.42257 14.8705 3.59863 15.4932 2.77469 16.1208C2.26213 16.5088 1.74956 16.9016 1.23699 17.2944C0.839395 16.5567 0.580717 15.7758 0.369942 14.9711C-0.0324468 13.4142 -0.0947213 11.8334 0.125634 10.2478C0.298087 9.0023 0.657362 7.80472 1.23699 6.68378C1.95555 7.23467 2.66931 7.79035 3.38786 8.34124C4.00581 8.81548 4.62377 9.28493 5.24172 9.75439C5.13633 10.267 4.98783 10.7699 4.93993 11.2969C4.8537 12.2549 4.94472 13.1891 5.21777 14.1088C5.23693 14.1471 5.24172 14.195 5.24651 14.2429Z"
                fill="#FABB06"
              ></path>
            </svg>
            <span>Sign in with Google</span>
          </button>

          <small class="signin-legal-note"
            >By signing in, you agree to our
            <RouterLink :to="{ name: 'terms-of-use' }" class="inline-link"
              >Terms of Use</RouterLink
            >
            and
            <RouterLink :to="{ name: 'privacy-policy' }" class="inline-link"
              >Privacy Policy</RouterLink
            >.</small
          >
        </div>
        <button @click="enterDemoMode" id="btn-demo">View Demo</button>
      </div>
      <footer>
        <div id="legal-links" class="login-container-footer">
          <RouterLink :to="{ name: 'terms-of-use' }">Terms of Use</RouterLink>
          <RouterLink :to="{ name: 'privacy-policy' }"
            >Privacy Policy</RouterLink
          >
          <RouterLink :to="{ name: 'legal-notice' }">Legal Notice</RouterLink>
        </div>
        <div id="copyright">&copy; 2025 Franziska Kiel</div>
      </footer>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import NowablyLogo from "../components/Visuals/NowablyLogo.vue";

export default {
  name: "LoginView",
  components: {
    NowablyLogo,
  },
  data() {
    return {
      userStore: useUserStore(),
      router: useRouter(),
      user: null, // user will hold the current authenticated user
    };
  },
  methods: {
    // Method to handle Google login
    async loginWithGoogle() {
      try {
        await this.userStore.loginWithGoogle();

        // After successful login, redirect to the home page using this.$router
        this.router.push({ name: "home" });
      } catch (error) {
        console.error("Error logging in with Google:", error);
      }
    },
    async enterDemoMode() {
      try {
        await this.userStore.loginForDemo();
        // After successful login, redirect to the home page using this.$router
        this.router.push({ name: "home" });
      } catch (error) {
        console.error("Error logging in with Demo Account:", error);
      }
    },
  },
  created() {
    // Watch for changes in user authentication status
    this.userStore.$subscribe(() => {
      this.user = this.userStore.user;
    });
  },
  mounted() {
    if (this.user) {
      this.router.push({ name: "home" });
    }
  },
};
</script>

<style scoped>
.login-view {
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-items: center;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--base-white);
  padding-block: 2rem 1rem;
  min-height: 100vh;
  width: 100%;
  gap: 3rem;
}

.login-container-body {
  height: 100%;
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 1rem;
  padding-top: 8vh;
  padding-inline: 2rem;
}

.intro {
  margin-bottom: 1rem;
  margin-top: 2vh;
}

h1 {
  margin-bottom: 1rem;
}

.intro span {
  font-size: 1.3rem;
}

#btn-login,
#btn-demo {
  border-radius: 0.625rem;
  padding: 0.625rem 0.875rem;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.05rem;
  min-height: 3.125rem;
  transition: border 0.3s ease;
  color: var(--base-black);
  background-color: var(--base-white);
  display: flex;
  gap: 0.625rem;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--cloud-02);
  letter-spacing: 0;
}

#btn-login:hover,
#btn-demo:hover {
  border: 2px solid var(--base-black);
}

#btn-demo {
  margin-top: 10vh;
}

footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.3rem;
}

#copyright {
  font-size: 0.8125rem;
  opacity: 0.7;
}

#legal-links {
  font-size: 0.8125rem;
  display: flex;
  gap: 1rem;
  flex-grow: 0;
}

#legal-links a {
  color: var(--base-black);
  text-decoration: none;
  opacity: 0.85;
}

#legal-links a:hover {
  color: var(--base-black);
  text-decoration: underline;
  text-underline-offset: 0.3rem;
}
.signin-legal-note {
  font-weight: 400;
  opacity: 0.85;
  font-size: 0.8125rem;
  letter-spacing: 0.0031rem;
}
.sign-in-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-block: 1rem 2rem;
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
  .login-container {
    min-width: 44vw;
    width: auto;
    box-shadow: 0 1rem 0.5rem 0 rgba(69, 57, 44, 0.1);
  }

  #legal-links {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    font-size: 0.8125rem;
    display: flex;
    gap: 1rem;
  }
  #copyright {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    font-size: 0.8125rem;
  }
}

/* X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
}

/* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {
  .login-container {
    min-width: 33vw;
    width: auto;
  }
}
</style>
