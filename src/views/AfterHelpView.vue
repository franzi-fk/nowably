<template>
  <TaskProgressHeader />
  <section class="after-help-view flex-grow">
    <section class="after-help-view-body">
      <h1>Do you want to continue right now?</h1>
      <form class="ask-if-continue-form" @submit.prevent="submitUserInput">
        <fieldset>
          <InputRadio
            v-model="userInput"
            type="radio"
            name="task-continue"
            id="continue-with-task"
            value="continue"
            label="Yes, I will give it another try. I want to continue with:"
          />
          <InputSelect
            v-model="selectedValue"
            :items="taskStore.openTasks"
            labelKey="description"
            valueKey="id"
            :disabled="userInput === 'dont-continue'"
            name="select-task"
            id="select-task"
            placeholder="Select a task"
          />
        </fieldset>
        <fieldset>
          <InputRadio
            v-model="userInput"
            type="radio"
            name="task-continue"
            id="do-not-continue"
            value="dont-continue"
            label="No, I will take a break and try again another time."
          />
        </fieldset>
        <fieldset>
          <SolidButton
            type="text"
            text="Continue"
            variant="primary"
            id="btn-continue"
          />
        </fieldset>
      </form>
    </section>
    <section class="actions after-help-view-footer">
      <LinkButton
        type="text"
        text="Go back"
        @click="backToLastStep"
        v-if="this.userStore.currentEmotion !== 'overwhelmed'"
      />
    </section>
  </section>
  <!-- Snackbar -->
  <SnackbarOverlay
    ref="snackbar"
    :text="snackbar.text"
    :variant="snackbar.variant"
    :duration="snackbar.duration"
  />
</template>

<script>
import SnackbarOverlay from "@/components/FeedbackAndStatus/SnackbarOverlay.vue";
import InputSelect from "@/components/InputsAndControls/InputSelect.vue";
import { useTaskStore } from "../stores/taskStore";
import { useRouter } from "vue-router";
import InputRadio from "@/components/InputsAndControls/InputRadio.vue";
import { useUserStore } from "../stores/userStore";
import TaskProgressHeader from "../components/Navigation/TaskProgressHeader.vue";

export default {
  components: {
    InputSelect,
    SnackbarOverlay,
    InputRadio,
    TaskProgressHeader,
  },
  data() {
    return {
      taskStore: useTaskStore(),
      userStore: useUserStore(),
      router: useRouter(),
      userInput: "continue",
      selectedValue: null, // Initially null until data is loaded
      snackbar: {
        text: "",
        variant: "info",
        duration: 3000,
      },
    };
  },
  methods: {
    backToLastStep() {
      this.router.push({ name: "need-help" });
    },
    showSnackbar(variant, text, duration) {
      this.snackbar.text = text;
      this.snackbar.variant = variant;
      this.snackbar.duration = Number(duration);
      this.$refs.snackbar.show();
    },
    submitUserInput() {
      if (this.userInput === "continue" && this.selectedValue) {
        const taskExists = this.taskStore.openTasks.some(
          (task) => task.id === this.selectedValue
        );
        if (taskExists) {
          // Set the current task using the store's action
          const selectedTask = this.taskStore.openTasks.find(
            (task) => task.id === this.selectedValue
          );
          this.taskStore.setCurrentTask(selectedTask);
          this.userStore.setCurrentStep("countdown");
          this.userStore.setCurrentEmotion(null);
          this.router.push({
            name: "countdown",
            params: { id: selectedTask.id },
          });
          return;
        } else {
          this.showSnackbar("error", "Please select a task.", 3000);
          return;
        }
      } else {
        this.userStore.setCurrentStep(null);
        this.userStore.setCurrentEmotion(null);
        this.router.push({ name: "home" });
        return;
      }
    },
  },
  mounted() {
    // **Wait for taskStore data to load before setting the selectedValue**
    Promise.all([this.taskStore.initLoad(), this.userStore.initLoad()])
      .then(() => {
        // **Once the data is loaded, set selectedValue from currentTask**
        this.selectedValue = this.taskStore.currentTask?.id || "Select a task";
      })
      .catch((err) => {
        console.error("Error loading tasks:", err);
      });
  },
};
</script>

<style scoped>
.after-help-view {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.after-help-view-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  padding-inline: 1.25rem;
}

.ask-if-continue-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  gap: 2rem;
}

.ask-if-continue-form fieldset:not(:last-child) {
  align-self: flex-start;
}

.input-label {
  min-height: 3.75rem;
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

#btn-continue {
  margin-top: 2rem;
  min-width: 12rem;
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .input-label {
    min-height: 3rem;
  }
  .ask-if-continue {
    gap: 1.75rem;
  }
  .actions {
    padding-inline: 1.8rem;
  }
}
</style>
