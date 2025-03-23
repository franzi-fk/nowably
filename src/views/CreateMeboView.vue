<template>
  <div class="wrapper">
    <SidebarNavi :variant="this.userStore.role === 'admin' ? 'admin' : 'user'" />
    <AppHeader />
    <article
      class="create-mebo-view-container main-view-container flex-grow view-layout-default"
      v-if="messageSent"
    >
      <div class="create-mebo-header page-padding-inline">
        <h1>Your Message in a Bottle has been sent</h1>
      </div>
      <div class="mebo-sent-body" v-if="this.userStore.availableMeboTokens > 0">
        <section class="tile-container content-center">
          <Illus_MeboSent width="22" />
          <p>You can send another Message in a Bottle. Do you want to write another one now?</p>
          <div class="mebo-sent-actions">
            <SolidButton
              text="Write another message"
              type="text"
              variant="primary"
              @click="messageSent = false"
            />
          </div>
        </section>
      </div>
      <div class="mebo-sent-body" v-else>
        <section class="tile-container content-center">
          <Illus_MeboSent width="22" />
          <p>Thanks for putting some kindness out there!</p>
        </section>
      </div>
    </article>
    <article
      class="create-mebo-view-container main-view-container flex-grow view-layout-default"
      v-if="!messageSent"
    >
      <section class="create-mebo-header page-padding-inline">
        <h1>Send a Message in a Bottle</h1>
        <p>Another user who's in need of some motivational words can receive your message.</p>
      </section>
      <section
        class="tile-container"
        v-if="!loading && !messageSent && this.userStore.availableMeboTokens > 0"
      >
        <p v-if="this.userStore.availableMeboTokens === 1" class="tile-headline">
          You can send {{ this.userStore.availableMeboTokens }} Message in a Bottle.
        </p>
        <p v-else class="tile-headline">
          You can send {{ this.userStore.availableMeboTokens }} Messages in a Bottle.
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

      <section
        class="tile-container-emptystate"
        v-else-if="
          !loading &&
          !messageSent &&
          this.userStore.role !== 'admin' &&
          this.userStore.availableMeboTokens <= 0
        "
      >
        <Illus_Task width="15" />
        <p>
          Complete a task to unlock sending a Message in a Bottle.<br />You can send up to 3 per
          day.
        </p>
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
import Illus_MeboSent from '../components/Visuals/Illus_MeboSent.vue'
import Illus_Task from '../components/Visuals/Illus_Task.vue'

export default {
  name: 'CreateMeboView',
  components: {
    InputText,
    InputCheckbox,
    ModalOverlay,
    SidebarNavi,
    Illus_MeboSent,
    Illus_Task,
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
    Promise.all([this.userStore.initLoad(), this.meboStore.initLoad(), this.taskStore.initLoad()])
  },
}
</script>

<style scoped>
.create-mebo-view-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 2rem;
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

.tile-container-emptystate {
  width: 100%;
  padding-inline: 1.25rem;
  background-color: var(--base-white);
  border-radius: 1.5rem;
  padding-block: 3rem 3.2rem;
  padding-inline: 1.25rem;
  display: flex;
  gap: 1.3rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 55vh;
  text-align: center;
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

.mebo-sent-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: start;
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

.content-center {
  align-items: center;
  justify-content: center;
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
