<template>
  <AppHeader />
  <article class="create-mebo-view-container flex-grow view-layout-default">
    <section class="create-mebo-header page-padding-inline">
      <h1>Send a Message in a Bottle</h1>
      <p>
        Write what you would tell a friend who is struggling to start a task or simply feeling
        demotivated. Make sure it's in English, anonymous, and neutral, so anyone reading it can
        understand and find it helpful.
      </p>
    </section>
    <section class="tile-container page-padding-inline">
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
          backgroundColor="var(--primary)"
          textColor="var(--base-white)"
          :disabled="!meboComplianceApproved || inputMessage.length <= 200"
        />
      </form>
    </section>
  </article>
  <!-- Modal -->
  <ModalOverlay
    :isVisible="isModalVisible"
    :text="modalText"
    :headline="modalHeadline"
    :actions="modalActions"
    @update:isVisible="isModalVisible = $event"
  />
</template>

<script>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useTaskStore } from '@/stores/taskStore'
import { useMeboStore } from '@/stores/meboStore'
import InputText from '@/components/InputsAndControls/InputText.vue'
import InputCheckbox from '@/components/InputsAndControls/InputCheckbox.vue'
import ModalOverlay from '@/components/ContainersAndLayouts/ModalOverlay.vue'

export default {
  name: 'CreateMeboView',
  components: {
    InputText,
    InputCheckbox,
    ModalOverlay,
  },
  data() {
    return {
      router: useRouter(),
      taskStore: useTaskStore(),
      userStore: useUserStore(),
      meboStore: useMeboStore(),
      inputMessage: '',
      meboComplianceApproved: false,
      isModalVisible: false,
      modalText: '',
      modalHeadline: '',
      modalActions: [
        {
          text: 'Confirm',
          onClick: () => {},
          backgroundColor: 'var(--primary)',
          textColor: 'var(--base-white)',
        },
      ],
    }
  },
  methods: {
    openModal() {
      console.log('modal opened')
      this.isModalVisible = true
    },
    closeModal() {
      console.log('modal closed')
      this.isModalVisible = false
    },
    confirmMebo() {
      // Define the modal content dynamically
      this.modalHeadline = `Send Message`
      this.modalText = `Are you sure you want to send your message now? Please be sure your message meets the rules.`

      // Define the actions for the modal dynamically
      this.modalActions = [
        {
          text: 'Cancel',
          onClick: () => {
            this.closeModal()
            console.log('cancel triggered')
          },
          backgroundColor: 'var(--base-sand)',
          textColor: 'var(--base-black)',
        },
        {
          text: 'Send message',
          onClick: () => {
            this.meboStore.addNewMebo(this.inputMessage)
            console.log('confirmMebo triggered')
            this.closeModal()
          },
          backgroundColor: 'var(--primary)',
          textColor: 'white',
        },
      ]

      // Show the modal
      this.openModal()
    },
  },
  mounted() {
    this.userStore.initLoad()
    this.taskStore.initLoad()
    this.meboStore.initLoad()
  },
}
</script>

<style scoped>
.create-mebo-view-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1.3rem;
  width: 100%;
  height: 100%;
  background-image: var(--linear-sand-01);
}

.create-mebo-header {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 1.3rem;
  padding-block: 1.4rem 1rem;
}

.create-mebo-header p {
  line-height: 140%;
  letter-spacing: 0.0063rem;
}

.tile-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-bottom: 5rem;
  padding-inline: 1.25rem;
}

.write-message-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1rem;
}

input-message {
  width: 100%;
}

#btn-send-message {
  margin-top: 1rem;
}

#checkbox-label {
  font-size: 0.95rem;
}

/*________________________________________________________________*/

@media (min-width: 992px) {
  .create-mebo-view-container {
    padding: 1.5rem min(22rem, 22%);
  }
  .input-message {
    width: 100%;
  }
}
</style>
