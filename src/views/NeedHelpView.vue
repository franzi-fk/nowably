<template>
  <div class="need-help-view flex-grow page-padding-inline" v-if="taskStore.currentTask">
    <article id="help-demotivated" v-if="userStore.currentEmotion === 'demotivated'">
      <h1>demotivated?</h1>
      <section class="actions">
        <LinkButton type="text" text="Go back" @click="backToWhichHelp" />
        <LinkButton type="text" text="Skip exercise" @click="finishHelp" />
      </section>
    </article>
    <article id="help-overwhelmed" v-else-if="userStore.currentEmotion === 'overwhelmed'">
      <h1>overwhelmed?</h1>
      <section class="actions">
        <LinkButton type="text" text="Go back" @click="backToWhichHelp" />
        <LinkButton type="text" text="Skip exercise" @click="finishHelp" />
      </section>
    </article>
    <article id="help-anxious" v-else-if="userStore.currentEmotion === 'anxious'">
      <section class="intro">
        <h1>Relaxation Exercise</h1>
        <p>
          Sometimes certain tasks trigger some really intense emotions. Let's try to calm down by
          doing a relaxation technique for just 2 minutes.
        </p>
      </section>
      <section class="relaxation-exercise">
        <section class="exercise-instructions" v-show="!relaxExerciseStarted">
          <h2>Humming</h2>
          <p>
            Sit comfortably and relax your body.<br />Inhale deeply through your nose.<br />Exhale
            with a hum, feeling the vibrations.<br />
            Relax and repeat.
          </p>
          <SolidButton
            v-if="!relaxExerciseStarted"
            type="text"
            text="Start"
            backgroundColor="var(--primary)"
            textColor="var(--base-white)"
            @click="startExercise"
          />
        </section>
        <section id="exercise-progress" v-show="relaxExerciseStarted">
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
            id="btn-continue"
            backgroundColor="var(--primary)"
            textColor="var(--base-white)"
            @click="finishHelp"
          />
        </section>
      </section>
      <section class="actions">
        <LinkButton type="text" text="Go back" @click="backToWhichHelp" />
        <LinkButton type="text" text="Skip exercise" @click="finishHelp" />
      </section>
    </article>
    <section id="whats-wrong" v-else>
      <h1>How do you feel right now?</h1>
      <div class="button-container">
        <SolidButton
          type="text"
          text="I feel demotivated"
          @click="userStore.setCurrentEmotion('demotivated')"
        />
        <SolidButton
          type="text"
          text="I feel overwhelmed"
          @click="userStore.setCurrentEmotion('overwhelmed')"
        />
        <SolidButton
          type="text"
          text="I feel anxious"
          @click="userStore.setCurrentEmotion('anxious')"
        />
        <LinkButton type="text" text="Go back" @click="backToCountdown" />
      </div>
    </section>
  </div>
</template>

<script>
import GeneralCountdown from '../components/GeneralCountdown.vue'
import HummingAnimation from '../components/HummingAnimation.vue'
import { useTaskStore } from '../stores/taskStore'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

export default {
  name: 'NeedHelpView',
  components: {
    GeneralCountdown,
    HummingAnimation,
  },
  data() {
    return {
      taskStore: useTaskStore(),
      userStore: useUserStore(),
      router: useRouter(),
      relaxExerciseStarted: false,
      animationDuration: 120, // in seconds
      hummingAnimationCompleted: false,
    }
  },
  methods: {
    completeHumming() {
      this.hummingAnimationCompleted = true
    },
    startExercise() {
      this.relaxExerciseStarted = true
    },
    backToWhichHelp() {
      this.userStore.setCurrentEmotion(null)
    },
    backToCountdown() {
      this.userStore.setCurrentEmotion(null)
      this.router.push({ name: 'countdown', params: { id: this.taskStore.currentTask.id } })
    },
    finishHelp() {
      this.router.push({ name: 'task-continue' })
    },
  },
  mounted() {
    this.userStore.initLoad()
    this.taskStore.loadCurrentTask()
    // If there is no currentTask, redirect to the home view
    if (!this.taskStore.currentTask) {
      this.$router.push({ name: 'home' })
    }
  },
}
</script>

<style scoped>
.need-help-view,
#whats-wrong {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.need-help-view {
  background-image: radial-gradient(circle at 50%, var(--terra-01), var(--base-sand));
}

#help-anxious {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  min-width: 100vw;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background-color: var(--base-sand);
  text-align: center;
}

.intro {
  padding-inline: 1.25rem;
  padding-block: 2rem;
}

h1,
h2 {
  margin-bottom: 1rem;
}

.actions {
  padding-inline: 1.25rem;
  padding-block: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

#btn-continue {
  margin-top: 2.4rem;
}

.relaxation-exercise {
  background-color: var(--base-white);
  border-radius: 1.5rem;
  padding-block: 2rem 2.2rem;
  padding-inline: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  margin: 3rem;
}
</style>
