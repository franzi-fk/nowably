<template>
  <div class="wrapper">
    <SidebarNavi variant="user" />
    <AppHeader />
    <article class="mebo-sent-view-container flex-grow view-layout-default" v-if="messageSent">
      <div class="mebo-sent-header page-padding-inline">
        <h1>Your Message in a Bottle has been sent.</h1>
      </div>
      <div class="mebo-sent-body page-padding-inline" v-if="this.userStore.availableMeboTokens > 0">
        <p v-if="this.userStore.availableMeboTokens === 1">
          You can send {{ this.userStore.availableMeboTokens }} more Message in a Bottle today. Do
          you want to write another message now?
        </p>
        <p v-else>
          You can send {{ this.userStore.availableMeboTokens }} more Messages in a Bottle today. Do
          you want to write another message now?
        </p>
        <div class="mebo-sent-actions">
          <SolidButton
            text="Write another message"
            type="text"
            variant="primary"
            @click="messageSent = false"
          />
          <LinkButton text="Go to Home" type="text" @click="goToHome" />
        </div>
      </div>
      <div class="mebo-sent-body page-padding-inline" v-else>
        <div class="mebo-sent-actions">
          <LinkButton text="Go to Home" type="text" @click="goToHome" />
        </div>
      </div>
    </article>
    <article class="create-mebo-view-container flex-grow view-layout-default" v-else>
      <section class="create-mebo-header page-padding-inline">
        <h1>Send a Message in a Bottle</h1>
        <p>Another user who's in need of some motivational words can receive your message.</p>
      </section>
      <section class="tile-container">
        <p v-if="this.userStore.availableMeboTokens === 1" class="tile-headline">
          You can send {{ this.userStore.availableMeboTokens }} more Message in a Bottle today.
        </p>
        <p v-else class="tile-headline">
          You can send {{ this.userStore.availableMeboTokens }} more Messages in a Bottle today.
        </p>
        <p>
          Write what you would tell a friend who is struggling to start a task or simply feeling
          demotivated. Make sure it's in English, anonymous, and neutral, so anyone reading it can
          understand and find it helpful.
        </p>
        <form class="write-message-form" @submit.prevent="confirmMebo">
          <label for="input-message" class="sr-only">Your message</label>
          <InputText
            id="input-message"
            v-model="inputMessage"
            name="input-message"
            variant="multi-line"
            maxLength="1000"
            minLength="200"
          />
          <InputCheckbox
            id="mebo-compliance"
            v-model="meboComplianceApproved"
            label="My message is free of hate speech, discrimination, or harm. I maintain a positive,
          supportive tone and exclude personal details like phone numbers or addresses, as well as
          links."
          />
          <SolidButton
            type="text"
            id="btn-send-message"
            text="Send Message"
            variant="primary"
            :disabled="!meboComplianceApproved || inputMessage.length <= 200"
          />
        </form>
      </section>
    </article>
    <ModalOverlay
      :isVisible="isModalVisible"
      :text="modalText"
      :headline="modalHeadline"
      :primaryActionText="modalPrimaryActionText"
      :primaryAction="modalPrimaryAction"
      @update:isVisible="isModalVisible = $event"
    />
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useTaskStore } from '@/stores/taskStore'
import { useMeboStore } from '@/stores/meboStore'
import InputText from '@/components/InputsAndControls/InputText.vue'
import InputCheckbox from '@/components/InputsAndControls/InputCheckbox.vue'
import ModalOverlay from '@/components/ContainersAndLayouts/ModalOverlay.vue'
import SidebarNavi from '../components/Navigation/SidebarNavi.vue'

export default {
  name: 'CreateMeboView',
  components: {
    InputText,
    InputCheckbox,
    ModalOverlay,
    SidebarNavi,
  },
  data() {
    return {
      router: useRouter(),
      taskStore: useTaskStore(),
      userStore: useUserStore(),
      meboStore: useMeboStore(),
      inputMessage: '',
      meboComplianceApproved: false,
      messageSent: false,
      isModalVisible: false,
      modalText: '',
      modalHeadline: '',
      modalPrimaryActionText: '',
      modalPrimaryAction: null,
    }
  },
  methods: {
    openModal() {
      this.isModalVisible = true
    },
    closeModal() {
      this.isModalVisible = false
    },
    confirmMebo() {
      // Define the modal content dynamically
      this.modalHeadline = `Send Message`
      this.modalText = `Are you sure you want to send your message now? Please be sure your message meets the rules.`

      // Set dynamic action
      this.modalPrimaryActionText = 'Send Message'
      ;(this.modalPrimaryAction = () => {
        this.meboStore.addNewMebo(this.inputMessage)
        this.userStore.increaseDailyMeboCreationCount()
        this.closeModal()
        this.inputMessage = ''
        this.messageSent = true
        this.meboComplianceApproved = false
      }),
        // Show the modal
        this.openModal()
    },
    goToHome() {
      this.$router.push({ name: 'home' })
    },
  },
  mounted() {
    this.userStore.initLoad()
    this.taskStore.initLoad()
    this.meboStore.initLoad()
    // If role is not admin and dailyMeboCreation count >= 3
    if (this.userStore.role !== 'admin' && this.userStore.availableMeboTokens <= 0) {
      this.$router.push({ name: 'home' })
    }
  },
}
</script>

<style scoped>
.sidebar {
  grid-column: 1;
  grid-row: 1 / span 2;
}

.app-header {
  grid-column: 2;
  grid-row: 1;
}

.create-mebo-view-container {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1.3rem;
  width: 100%;
  height: 100%;
  margin-bottom: 5rem;
}

.create-mebo-header {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 1.3rem;
  padding-block: 1.4rem 1rem;
}

.tile-headline {
  font-weight: 700;
  font-size: 1.2rem;
  text-align: left;
}

.tile-container {
  width: 100%;
  padding-inline: 1.25rem;
  background-color: var(--base-white);
  border-radius: 1.5rem;
  padding-block: 3rem 3.2rem;
  padding-inline: 1.25rem;
  display: flex;
  gap: 1.3rem;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-height: 55vh;
  text-align: left;
}

.write-message-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 2rem;
}

input-message {
  width: 100%;
}

.input-container {
  margin-top: 1rem;
}

#btn-send-message {
  margin-top: 1rem;
}

#checkbox-label {
  font-size: 0.95rem;
}

.mebo-sent-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.3rem;
  padding-block: 1.4rem 1rem;
}

.mebo-sent-view-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1.3rem;
  width: 100%;
  height: 100%;
  margin-bottom: 5rem;
}

.mebo-sent-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.mebo-sent-actions {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/*_______________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .create-mebo-view-container,
  .mebo-sent-view-container {
    width: 69vw;
    margin-inline: auto;
  }
  .input-message {
    width: 100%;
  }
  .tile-container {
    padding-inline: 3rem;
  }
}

/* X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
}

/* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {
  .info-container {
    display: flex;
    flex-direction: row;
  }
}
</style>
