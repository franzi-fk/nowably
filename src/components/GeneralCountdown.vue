<template>
  <div class="general-countdown-container">
    <span
      v-if="showFeedback"
      id="feedback"
      :style="{ fontSize: textSize, color: textColor, fontWeight: fontWeight }"
      >{{ feedbackMessage }}</span
    >
    <span
      v-else
      id="countdown"
      :style="{ fontSize: textSize, color: textColor, fontWeight: fontWeight }"
    >
      {{ formattedCountdown }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    duration: {
      type: Number,
      required: true,
      default: 60,
    },
    feedbackMessage: {
      type: String,
      default: 'Well done!',
    },
    formatStyle: {
      type: String,
      default: 'minimal',
      validator: (value) => ['padded', 'minimal'].includes(value),
    },
    textSize: {
      type: String,
      default: '1.5rem',
    },
    textColor: {
      type: String,
      default: 'var(--base-black)',
    },
    fontWeight: {
      type: [String, Number],
      default: '500',
    },
  },
  data() {
    return {
      countdownValue: this.duration,
      showFeedback: false,
    }
  },
  created() {
    this.startCountdown()
  },
  methods: {
    startCountdown() {
      const interval = setInterval(() => {
        if (this.countdownValue > 0) {
          this.countdownValue--
        } else {
          clearInterval(interval) // Stop countdown at 0

          setTimeout(() => {
            this.showFeedback = true
          }, 1000)
        }
      }, 1000)
    },
  },
  computed: {
    formattedCountdown() {
      const minutes = Math.floor(this.countdownValue / 60)
      const seconds = this.countdownValue % 60

      if (this.formatStyle === 'minimal') {
        return minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}`
      }

      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },
  },
}
</script>

<style scoped>
.general-countdown-container {
  text-align: center;
}
</style>
