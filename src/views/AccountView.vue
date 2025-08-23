<template>
  <div class="container flex-grow">
    <div
      class="account-deleted flex-grow view-layout-default"
      v-if="accountDeleted"
    >
      <h1>
        <routerLink :to="{ name: 'login' }"><NowablyLogo /></routerLink>
      </h1>
      <div class="account-deleted-body">
        <h2>Account deleted</h2>
        <p>Your Account has been deleted. You're always welcome to return.</p>
      </div>
    </div>
    <div class="wrapper" v-else>
      <SidebarNavi
        :variant="this.userStore.role === 'admin' ? 'admin' : 'user'"
      />
      <AppHeader />

      <article
        class="account-view-container main-view-container flex-grow view-layout-default"
      >
        <div class="account-header page-padding-inline">
          <h1>Account</h1>
        </div>
        <article class="account-body">
          <section class="account-info account-tile" data-cy="sct-account-info">
            <h2>Account Information</h2>
            <p>Name: {{ userStore.user?.displayName }}</p>
            <p>Email: {{ userStore.user?.email }}</p>
            <p>Nowably User ID: {{ userStore.user?.uid }}</p>
            <small>
              You are signed in with your Google account. Your name and email
              come directly from Google and can not be changed here. To use a
              different name or email, sign out and sign in with another
              account.
            </small>
          </section>
          <section
            class="account-deletion account-tile"
            data-cy="sct-account-deletion"
          >
            <h2>Account Deletion</h2>
            <div class="deletion-info">
              <p>
                All data associated with your account will be permanently
                deleted, including your tasks, sent Messages in a Bottle, and
                progress. Once your account is deleted, it will not be possible
                to recover any of your information.
              </p>
              <p>You are always welcome to return.</p>
            </div>
            <LinkButton
              text="Delete Account"
              type="icon-text"
              icon="arrowRight"
              @click="confirmDeletion"
              data-cy="btn-delete-account"
            />
          </section>
        </article>
      </article>
      <ModalOverlay
        :isVisible="isModalVisible"
        :text="modalText"
        :headline="modalHeadline"
        :primaryActionText="modalPrimaryActionText"
        :primaryAction="modalPrimaryAction"
        :primaryActionOnly="modalPrimaryOnly"
        @update:isVisible="isModalVisible = $event"
      />
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import ModalOverlay from "@/components/ContainersAndLayouts/ModalOverlay.vue";
import SidebarNavi from "../components/Navigation/SidebarNavi.vue";
import NowablyLogo from "../components/Visuals/NowablyLogo.vue";

export default {
  name: "CreateMeboView",
  components: {
    ModalOverlay,
    SidebarNavi,
    NowablyLogo,
  },
  data() {
    return {
      router: useRouter(),
      userStore: useUserStore(),
      accountDeleted: false,
      isModalVisible: false,
      modalText: "",
      modalHeadline: "",
      modalPrimaryActionText: "",
      modalPrimaryAction: null,
      modalPrimaryOnly: false,
    };
  },
  methods: {
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    confirmDeletion() {
      // Define the modal content dynamically
      this.modalHeadline = `Delete Account`;
      this.modalText = `Are you sure you want to delete your Nowably account and all associated data?
<p class="txt-important">For security reasons, you may be asked to log in again before deletion. Follow the steps to complete the process.</p>`;

      // Set dynamic action
      this.modalPrimaryActionText = "Delete Account";
      (this.modalPrimaryAction = async () => {
        try {
          await this.userStore.deleteUserAccount(); // Wait for full deletion (Firebase account and Firestore data)
          await this.userStore.logout(); // Then log out
          this.closeModal();
          this.accountDeleted = true;
        } catch (error) {
          console.error("Error during account deletion:", error);
        }
      }),
        // Show the modal
        this.openModal();
    },
    goToHome() {
      this.$router.push({ name: "home" });
    },
  },
  mounted() {
    Promise.all([this.userStore.initLoad()]);
  },
};
</script>

<style scoped>
.account-view-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1.3rem;
  width: 100%;
  height: 100%;
  margin-bottom: 5rem;
}

.account-header {
  text-align: left;
  padding-block: 1.4rem 1rem;
}

.account-body {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  text-align: left;
  gap: 2rem;
}
.account-tile {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 1.1rem;
  width: 100%;
  background-color: var(--t-white-33);
  border-radius: 1.5rem;
  padding: 2.5rem 1.25rem 3rem 1.25rem;
}

.deletion-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.account-deleted {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: start;
  padding: 3rem 1.25rem;
}
.account-deleted-body {
  height: 100%;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding-bottom: 1rem;
}

/*_______________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .account-tile {
    padding-inline: 3rem;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .account-view-container,
  .account-view-container {
    width: 69vw;
    margin-inline: auto;
  }
}

/* X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
}

/* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {
}
</style>
