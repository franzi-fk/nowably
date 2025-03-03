<template>
  <div class="countdown-container">
    <div :class="['circle', { fading: showStartNow }]"></div>
    <div
      class="countdown-number"
      :class="{ delayedFadeIn: showStartNow }"
      :style="countdownMarginStyle"
    >
      {{ showStartNow ? 'Start now' : countdownValue }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      countdownValue: 30, // Initial countdown value
      showStartNow: false, // Controls fade-in effect for "Start now"
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
            this.showStartNow = true // Start "Start now" fade-in after 1 second
          }, 1000) // 1-second delay before "Start now" appears
        }
      }, 1000)
    },
  },
  computed: {
    // Conditional margin-right: 5px if countdownValue has 2 digits, else 0
    countdownMarginStyle() {
      return {
        'margin-right': this.countdownValue >= 10 ? '0.125rem' : '0',
      }
    },
  },
}
</script>

<style scoped>
.countdown-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: fit-content;
}

.circle {
  width: 9.375rem;
  height: 9.375rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.54);
  box-shadow: 0 0 3.75rem rgb(255, 255, 255);
  animation: grow 3s ease-in-out infinite;
  transition: opacity 1s ease-in-out;
}

@keyframes grow {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* The circle fades out immediately when countdown reaches 0 */
.fading {
  opacity: 0;
}

/* "Start now" fades in after 1-second delay */
.delayedFadeIn {
  opacity: 0;
  animation: fadeInWithDelay 1.5s ease-in 1s forwards;
}

@keyframes fadeInWithDelay {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.countdown-number {
  position: absolute;
  white-space: nowrap;
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  user-select: none; /* Prevent text selection */
  width: 3.75rem; /* Ensure consistent width to handle both single and double-digit values */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.4375rem;
}

/* Apply margin-left only for two-digit countdown to shift it slightly */
.countdown-number span.two-digit {
  margin-left: -0.1875rem;
}
</style>
