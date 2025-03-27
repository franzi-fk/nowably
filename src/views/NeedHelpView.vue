<template>
  <TaskProgressHeader />
  <div
    class="need-help-view flex-grow task-view-layout"
    v-if="taskStore.currentTask"
  >
    <article
      id="help-demotivated"
      v-if="userStore.currentEmotion === 'demotivated'"
    >
      <article
        id="motivation-alt"
        v-if="
          !userStore.canReceiveMebo ||
          meboStore.mebosToReceive.length < 1 ||
          !mebo
        "
      >
        <div class="help-sub-view">
          <section class="intro">
            <h1>Let's find your spark again</h1>
            <p>
              Looks like you've already opened a Message in a Bottle today, or
              there isn't one available right now. <br />But here are some other
              quick ways to boost your motivation!
            </p>
          </section>
          <section class="motivation-alt-body help-sub-view-body">
            <section
              class="own-achievements"
              v-if="this.userStore.totalSuccessCount > 9"
            >
              <div class="motivation-intro">
                <AppIcon
                  name="history"
                  color="var(--terra-06)"
                  size="18"
                /><span class="sub-view-headline">Take a look back</span>
              </div>
              <p>
                You have already completed
                <strong>{{ this.userStore.totalSuccessCount }} tasks</strong> —
                you can do it again!
              </p>
            </section>
            <section class="motivation-techniques">
              <div class="motivation-intro">
                <AppIcon
                  name="playCircle"
                  color="var(--terra-06)"
                  size="18"
                /><span class="sub-view-headline">Take an action</span>
              </div>
              <ContentRotator
                :contentItems="contentItems"
                btnText="Show another action"
                btnIcon="iterationCcw"
              >
                <!-- Default slot for rendering the full content -->
                <template #default="{ currentContent }">
                  <article class="slot-content">
                    <!-- Title of the content -->
                    <span class="slot-headline">{{
                      currentContent.title
                    }}</span>

                    <!-- "How to do it" section -->
                    <div class="how-to-do-it">
                      <span class="content-subheading">How to do it</span>
                      <slot name="howTo" :content="currentContent.howTo">{{
                        currentContent.howTo
                      }}</slot>
                    </div>

                    <!-- "Why it works" section -->
                    <div class="why-it-works">
                      <span class="content-subheading">Why it works</span>
                      <slot
                        name="whyItWorks"
                        :content="currentContent.whyItWorks"
                        >{{ currentContent.whyItWorks }}</slot
                      >
                    </div>
                  </article>
                </template>
              </ContentRotator>
            </section>
            <SolidButton
              type="text"
              text="Continue"
              variant="primary"
              class="btn-continue"
              @click="finishHelp"
            />
          </section>
        </div>
        <section class="actions">
          <LinkButton type="text" text="Go back" @click="backToWhichHelp" />
          <LinkButton type="text" text="Skip this" @click="finishHelp" />
        </section>
      </article>
      <article id="receive-mebo" v-else>
        <div class="help-sub-view">
          <section class="intro">
            <h1>Message in a Bottle</h1>
            <p>
              Open a message in a bottle - it might bring you that needed spark
              of motivation.
            </p>
          </section>
          <section
            class="help-sub-view-body receive-mebo-opened"
            v-if="meboOpened === true"
          >
            <h2>Message:</h2>
            <p id="mebo-text">{{ this.mebo.text }}</p>
            <small>— written by another user</small>
            <SolidButton
              type="text"
              text="Continue"
              variant="primary"
              @click="finishHelp"
              class="btn-continue"
            />
          </section>
          <section class="help-sub-view-body receive-mebo-unopened" v-else>
            <Illus_MeboReceived width="22" />
            <SolidButton
              type="text"
              text="Open message"
              variant="primary"
              id="btn-open-mebo"
              @click="openMebo"
              :stopPropagation="true"
            />
            <div class="open-mebo-info">
              <p>You received a message from another user.</p>
              <HintBadge
                text="You can open 1 Message in a Bottle per day."
                icon="info"
                variant="subtle"
              />
            </div>
          </section>
        </div>
        <section class="actions">
          <LinkButton type="text" text="Go back" @click="backToWhichHelp" />
          <LinkButton type="text" text="Skip this" @click="finishHelp" />
        </section>
      </article>
    </article>
    <article
      id="help-overwhelmed"
      v-else-if="userStore.currentEmotion === 'overwhelmed'"
    >
      <div class="help-sub-view">
        <section class="intro">
          <h1>One step at a time</h1>
          <p>
            Maybe your task is just a little bit too big for now. Let’s break it
            down into smaller sub-tasks, that are easier to handle.
          </p>
        </section>
        <section class="split-task help-sub-view-body">
          <section class="split-task-form">
            <p id="current-task">{{ taskStore.currentTask.description }}</p>
            <p>Create at least 2 tasks that will replace the original task.</p>
            <form @submit.prevent="confirmSplitting">
              <fieldset>
                <InputText
                  v-model="splitTask1"
                  id="sub-task-1"
                  name="sub-task-1"
                  placeholder="Enter task description..."
                  maxLength="80"
                />
                <InputText
                  v-model="splitTask2"
                  id="sub-task-2"
                  name="sub-task-2"
                  placeholder="Enter task description..."
                  maxLength="80"
                />
                <InputText
                  v-model="splitTask3"
                  id="sub-task-3"
                  name="sub-task-3"
                  placeholder="Enter task description..."
                  maxLength="80"
                  v-show="splitTask1 && splitTask2"
                />
                <InputText
                  v-model="splitTask4"
                  id="sub-task-4"
                  name="sub-task-4"
                  placeholder="Enter task description..."
                  maxLength="80"
                  v-show="splitTask1 && splitTask2 && splitTask3"
                />
                <InputText
                  v-model="splitTask5"
                  id="sub-task-5"
                  name="sub-task-5"
                  placeholder="Enter task description..."
                  maxLength="80"
                  v-show="splitTask1 && splitTask2 && splitTask3 && splitTask4"
                />
                <SolidButton
                  type="text"
                  text="Save and continue"
                  variant="primary"
                  :disabled="!splitTask1 || !splitTask2"
                />
              </fieldset>
            </form>
          </section>
        </section>
      </div>
      <section class="actions">
        <LinkButton type="text" text="Go back" @click="backToWhichHelp" />
        <LinkButton type="text" text="Skip this" @click="finishHelp" />
      </section>
    </article>
    <article
      id="help-anxious"
      v-else-if="userStore.currentEmotion === 'anxious'"
    >
      <div class="help-sub-view">
        <section class="intro">
          <h1>Calm your mind</h1>
          <p>
            Sometimes certain tasks trigger some really intense emotions. Let's
            try to calm down by doing a relaxation technique for just 2 minutes.
          </p>
        </section>
        <section class="relaxation-exercise help-sub-view-body">
          <section class="exercise-instructions" v-if="!relaxExerciseStarted">
            <h2>Humming</h2>
            <p>
              Sit comfortably and relax your body.<br />Inhale deeply through
              your nose.<br />Exhale with a hum, feeling the vibrations.<br />
              Relax and repeat.
            </p>
            <SolidButton
              v-if="!relaxExerciseStarted"
              type="text"
              text="Start"
              variant="primary"
              @click="startExercise"
            />
          </section>
          <section id="exercise-progress" v-if="relaxExerciseStarted">
            <HummingAnimation
              :disappearAfter="animationDuration * 1000"
              @fade-out-complete="completeHumming"
            />
            <GeneralCountdown
              :duration="animationDuration"
              feedbackMessage="Well done!"
              textColor="var(--primary)"
            />
            <SolidButton
              v-if="hummingAnimationCompleted"
              type="text"
              text="Continue"
              class="btn-continue"
              variant="primary"
              @click="finishHelp"
            />
          </section>
        </section>
      </div>
      <section class="actions">
        <LinkButton type="text" text="Go back" @click="backToWhichHelp" />
        <LinkButton type="text" text="Skip this" @click="finishHelp" />
      </section>
    </article>
    <section id="whats-wrong" class="flex-grow" v-else>
      <div class="whats-wrong flex-grow">
        <h1>How do you feel right now?</h1>
        <div class="button-container">
          <SolidButton
            type="text"
            text="I feel demotivated"
            @click="userStore.setCurrentEmotion('demotivated')"
            variant="tertiary"
          />
          <SolidButton
            type="text"
            text="I feel overwhelmed"
            @click="userStore.setCurrentEmotion('overwhelmed')"
            variant="tertiary"
          />
          <SolidButton
            type="text"
            text="I feel anxious"
            @click="userStore.setCurrentEmotion('anxious')"
            variant="tertiary"
          />
        </div>
      </div>
      <div class="actions whats-wrong-footer">
        <LinkButton type="text" text="Go back" @click="backToCountdown" />
      </div>
    </section>
  </div>
  <!-- Snackbar -->
  <SnackbarOverlay
    ref="snackbar"
    :text="snackbar.text"
    :variant="snackbar.variant"
    :duration="snackbar.duration"
  />
  <!-- Modal -->
  <ModalOverlay
    :isVisible="isModalVisible"
    :text="modalText"
    :headline="modalHeadline"
    :primaryActionText="modalPrimaryActionText"
    :primaryAction="modalPrimaryAction"
    :primaryActionOnly="modalPrimaryOnly"
    @update:isVisible="isModalVisible = $event"
  />
</template>

<script>
import GeneralCountdown from "@/components/Animations/GeneralCountdown.vue";
import HummingAnimation from "@/components/Animations/HummingAnimation.vue";
import InputText from "@/components/InputsAndControls/InputText.vue";
import SnackbarOverlay from "@/components/FeedbackAndStatus/SnackbarOverlay.vue";
import SolidButton from "@/components/InputsAndControls/SolidButton.vue";
import ModalOverlay from "@/components/ContainersAndLayouts/ModalOverlay.vue";
import { useTaskStore } from "@/stores/taskStore";
import { useUserStore } from "@/stores/userStore";
import { useMeboStore } from "../stores/meboStore";
import { useRouter } from "vue-router";
import Illus_MeboReceived from "../components/Visuals/Illus_MeboReceived.vue";
import TaskProgressHeader from "../components/Navigation/TaskProgressHeader.vue";
import HintBadge from "../components/FeedbackAndStatus/HintBadge.vue";
import ContentRotator from "../components/ContainersAndLayouts/ContentRotator.vue";

export default {
  name: "NeedHelpView",
  components: {
    GeneralCountdown,
    HummingAnimation,
    InputText,
    SolidButton,
    SnackbarOverlay,
    ModalOverlay,
    Illus_MeboReceived,
    TaskProgressHeader,
    HintBadge,
    ContentRotator,
  },
  data() {
    return {
      taskStore: useTaskStore(),
      userStore: useUserStore(),
      meboStore: useMeboStore(),
      router: useRouter(),
      snackbar: {
        visible: true,
        text: "",
        variant: "info",
        duration: 3000,
      },
      isModalVisible: false,
      modalText: "",
      modalHeadline: "",
      modalPrimaryActionText: "",
      modalPrimaryAction: null,
      modalPrimaryOnly: false,
      meboOpened: false,
      mebo: "",
      relaxExerciseStarted: false,
      animationDuration: 120, // in seconds
      hummingAnimationCompleted: false,
      contentItems: [
        {
          title: "Power Posing",
          howTo:
            "Stand tall with hands on hips, shoulders back, and chest open. Hold for 2 minutes.",
          whyItWorks:
            "Boosts confidence and motivation by triggering the release of hormones that make you feel powerful.",
        },
        {
          title: "Listening to Energizing Music",
          howTo:
            "Play a high-energy playlist with upbeat songs before or during a task.",
          whyItWorks:
            "Fast-tempo, uplifting music releases dopamine, enhancing mood and energy.",
        },
        {
          title: "Quick Physical Activity",
          howTo: "Do 30 seconds of jumping jacks or stretch your body.",
          whyItWorks:
            "Boosts circulation and releases endorphins, which increase energy and motivation.",
        },
        {
          title: "Visualization",
          howTo:
            "Close your eyes for 30 seconds and vividly imagine yourself completing the task successfully.",
          whyItWorks:
            "Visualization activates brain regions associated with goal achievement, making you more motivated to act.",
        },
        {
          title: "Box Breathing",
          howTo:
            "Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Repeat for 4-5 cycles.",
          whyItWorks:
            "Calms the nervous system and helps you refocus, reducing anxiety and boosting motivation.",
        },
        {
          title: "Change Your Space",
          howTo: "Move to a new spot or tidy up your space.",
          whyItWorks:
            "A fresh environment brings new energy and a renewed mindset, helping you feel more motivated and focused.",
        },
      ],
      splitTask1: "",
      splitTask2: "",
      splitTask3: "",
      splitTask4: "",
      splitTask5: "",
    };
  },
  methods: {
    openMebo() {
      if (
        this.userStore.isDemo ||
        this.userStore.userId === "SwBi7cJTsh8sMeph9xae"
      ) {
        this.showDemoLimitationHint();
        return;
      }

      if (!this.mebo) {
        return; // Ensure that there's a valid mebo before proceeding
      }
      this.meboOpened = true;

      this.userStore.storeAllReceivedMebos(this.mebo.id);
      this.userStore.setCurrentStep("openedMebo");
    },
    showDemoLimitationHint() {
      // Define the modal content dynamically
      this.modalHeadline = `Not available in Demo`;
      this.modalText = `Please sign in to use this feature.`;
      this.modalPrimaryOnly = true;

      // Set dynamic action
      this.modalPrimaryActionText = "Okay";
      (this.modalPrimaryAction = () => {
        this.closeModal();
      }),
        // Show the modal
        this.openModal();
    },
    getMebo() {
      const potentialMebos = this.meboStore.mebosToReceive;

      // Ensure allReceivedMebos is an array
      const allReceivedMebos = Array.isArray(this.userStore.allReceivedMebos)
        ? this.userStore.allReceivedMebos
        : [];

      const receivedMebos = new Set(allReceivedMebos);

      if (!potentialMebos || potentialMebos === 0) return null;
      // Filter out any mebos the user has already received
      const validMebos = potentialMebos.filter(
        (mebo) => !receivedMebos.has(mebo.id)
      );

      if (validMebos.length === 0) {
        return (this.mebo = null);
      }

      // Pick a random valid mebo
      return (this.mebo =
        validMebos[Math.floor(Math.random() * validMebos.length)]);
    },
    updateLastMeboReceived() {
      this.userStore.updateLastMeboReceived();
    },
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    confirmSplitting() {
      // Define the modal content dynamically
      this.modalHeadline = `Replace task`;
      this.modalText = `Are you sure you want to replace the current task with the new ones?`;

      // Set dynamic action
      this.modalPrimaryActionText = "Replace task";
      (this.modalPrimaryAction = () => {
        this.handleSplitting();
        this.closeModal();
      }),
        // Show the modal
        this.openModal();
    },
    async handleSplitting() {
      // Check if the split task descriptions are not empty
      const splitTasks = [
        this.splitTask1,
        this.splitTask2,
        this.splitTask3,
        this.splitTask4,
        this.splitTask5,
      ].filter((task) => task.trim()); // Filter out empty tasks

      if (splitTasks.length > 0) {
        this.deleteTask(this.taskStore.currentTask.id);
        // Add each split task to taskStore
        // Wait for each split task to be added to the store
        for (let splitTask of splitTasks) {
          if (splitTask.trim()) {
            await this.addNewTask(splitTask); // Ensure each task is added before continuing
          }
        }
        // Set the first task (splitTask1) as the new current task
        const newCurrentTask = this.taskStore.tasks.find(
          (t) => t.description === splitTasks[0]
        );
        this.taskStore.setCurrentTask(newCurrentTask);

        this.finishHelp();
      } else {
        this.finishHelp();
      }
    },
    deleteTask(taskId) {
      const taskToDelete = this.taskStore.tasks.find((t) => t.id === taskId);
      if (!taskToDelete) {
        this.showSnackbar("error", "Task not found.", "3000"); // properties:  variant, text, duration in ms
        return;
      } else {
        this.taskStore.deleteTask(taskId);
        return;
      }
    },
    async addNewTask(description) {
      const newTaskDesc = description.trim(); // Removes spaces from input value

      // Check if user input is empty
      if (newTaskDesc === "") {
        return;
      }

      // Check if user tries to add a duplicate (case-insensitive)
      if (
        this.taskStore.openTasks.some(
          (task) => task.description.toLowerCase() === newTaskDesc.toLowerCase()
        )
      ) {
        this.showSnackbar("error", "Task already exists.", "3000"); // properties:  variant, text, duration in ms
        return;
      }

      await this.taskStore.addTask(newTaskDesc);
    },
    completeHumming() {
      this.hummingAnimationCompleted = true;
    },
    startExercise() {
      this.relaxExerciseStarted = true;
    },
    backToWhichHelp() {
      this.userStore.setCurrentEmotion(null);
    },
    backToCountdown() {
      this.userStore.setCurrentEmotion(null);
      this.userStore.setCurrentStep("countdown");
      this.router.push({
        name: "countdown",
        params: { id: this.taskStore.currentTask.id },
      });
    },
    finishHelp() {
      this.router.push({ name: "task-continue" });
    },
    showSnackbar(variant, text, duration) {
      this.snackbar.text = text;
      this.snackbar.variant = variant;
      this.snackbar.duration = Number(duration);
      this.$refs.snackbar.show();
    },
    generateUniqueId() {
      const now = new Date();
      const datePart = now.toISOString().replace(/[-:.]/g, ""); // Format the date (e.g., "20250302T102040")
      const timePart = now.getMilliseconds(); // Add milliseconds for further uniqueness
      const randomPart = Math.floor(Math.random() * 1000); // Add a random number to ensure uniqueness
      return `${datePart}${timePart}${randomPart}`;
    },
  },
  async mounted() {
    await Promise.all([
      this.userStore.initLoad(),
      this.taskStore.initLoad(),
      this.meboStore.initLoad(),
    ]);
    this.getMebo();

    // If there is no currentTask, redirect to the home view
    if (!this.taskStore.currentTask) {
      this.$router.push({ name: "home" });
    }

    // Detect when the user is about to leave the page (refresh/close tab)
    window.addEventListener("beforeunload", this.updateLastMeboReceived);
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.updateLastMeboReceived);
  },
  beforeRouteLeave(to, from, next) {
    // Ensure we clean up any state before leaving the route
    if (this.meboOpened) {
      this.updateLastMeboReceived(); // update lastMeboReceived before leaving
    }
    next(); // Continue with route navigation
  },
};
</script>

<style scoped>
.whats-wrong .btn-link {
  width: fit-content;
  align-self: center;
}

.whats-wrong {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  min-height: 55vh;
  padding-inline: 1.25rem;
  height: 100%;
}

.whats-wrong-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  height: 100%;
  min-height: 55vh;
  padding-inline: 1.25rem;
}

article {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.help-sub-view {
  width: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  text-align: center;
}

.open-mebo {
  gap: 2.2rem;
}

.intro {
  padding-inline: 1.25rem;
  padding-block: 0 3rem;
}

h1,
h2 {
  margin-bottom: 1rem;
}

.actions {
  padding-inline: 1.25rem;
  padding-block: 2rem 0.75rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
}

.btn-continue {
  margin-top: 2.4rem;
}

.help-sub-view-body {
  background-color: var(--base-white);
  border-radius: 1.5rem;
  padding-block: 4rem 4.2rem;
  padding-inline: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 55vh;
}

.relaxation-exercise p {
  line-height: 190%;
  margin-bottom: 2rem;
}

.animation-container {
  margin-block: 2.2rem 3rem;
}

.button-container {
  width: fit-content;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 4rem;
}

#current-task {
  background-color: var(--cloud-01);
  padding: 1rem;
  border-radius: 0.625rem;
  margin-bottom: 1rem;
}

.split-task-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.open-mebo-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

#btn-open-mebo {
  margin-block: 1rem;
}

#mebo-text {
  max-width: 65ch;
}

small {
  margin-top: 1rem;
  color: var(--cloud-04);
}

.slot-content {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-width: 50ch;
}

.content-subheading {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.95rem;
  letter-spacing: 0.0313rem;
  color: var(--terra-06);
}

.how-to-do-it,
.why-it-works {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.6rem;
}

.own-achievements,
.motivation-techniques {
  padding: 2.4rem 2.5rem 2.8rem 2.5rem;
  border: 4px solid var(--cotton-01);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.own-achievements {
  margin-bottom: 2rem;
}

.sub-view-headline {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--terra-06);
  text-transform: uppercase;
  letter-spacing: 0.05rem;
}

.slot-headline {
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.0313rem;
  color: var(--terra-05);
  margin-block: 0.5rem 0.2rem;
}

.motivation-intro {
  display: flex;
  gap: 0.625rem;
  align-items: center;
  justify-content: center;
}

/*_______________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .actions {
    padding-inline: 1.8rem;
  }
  .help-sub-view-body {
    padding-inline: 3rem;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .help-sub-view {
    width: 69vw;
  }
  .help-sub-view-body {
    padding-inline: 4rem;
  }
}

/* X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
}

/* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {
}
</style>
