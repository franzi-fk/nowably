<template>
  <div
    class="animation-container"
    :class="{ fadeOut: shouldFadeOut }"
    v-show="isVisible"
    @transitionend="onTransitionEnd"
  >
    <div class="circle"></div>
  </div>
</template>

<script>
export default {
  props: {
    disappearAfter: {
      type: [Number, String],
      required: true, // Accepts number (ms) or 'never'
      validator(value) {
        if (typeof value === 'number' || value === 'never') {
          return true
        }
      },
    },
  },
  data() {
    return {
      shouldFadeOut: false,
      isVisible: true,
      cycleDuration: 18000, // Full cycle duration in ms (18s)
    }
  },
  mounted() {
    if (this.disappearAfter !== 'never') {
      this.scheduleFadeOut()
    }
  },
  methods: {
    scheduleFadeOut() {
      setTimeout(() => {
        // Calculate remaining time in the current cycle
        const elapsedTime = this.disappearAfter % this.cycleDuration
        const remainingTime = elapsedTime === 0 ? 0 : this.cycleDuration - elapsedTime

        // Wait until the full cycle ends, then fade out
        setTimeout(() => {
          this.shouldFadeOut = true
          setTimeout(() => {
            this.isVisible = false // Hide completely after fade-out
            this.emitFadeOutComplete() // fallback
          }, 1000)
        }, remainingTime)
      }, this.disappearAfter)
    },
    onTransitionEnd() {
      // Emit event to notify parent when fade-out is complete
      this.emitFadeOutComplete()
    },
    emitFadeOutComplete() {
      this.$emit('fade-out-complete')
    },
  },
}
</script>

<style scoped>
.animation-container {
  width: 12.5rem;
  height: 12.5rem;
  animation-name: pulse; /* Animation name for scaling effect */
  animation-duration: 18s; /* Full cycle duration */
  animation-iteration-count: infinite; /* Make the animation repeat infinitely */
  animation-timing-function: linear; /* linear animation timing */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 1s linear;
}

/* Fade-out effect */
.fadeOut {
  opacity: 0;
}

/* Styling for the text inside the circle */
.animation-container::after {
  content: '';
  color: var(--base-white);
  font-size: 1.6rem;
  letter-spacing: 0.0625rem;
  width: 100%;
  animation-name: text;
  animation-duration: 18s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

/* Styling for the circle */
.circle {
  width: 100%;
  height: 100%;
  border-radius: 50%; /* Make it a circle */
  background-image:
    radial-gradient(circle, var(--primary) 0%, var(--sky-01) 100%),
    linear-gradient(to bottom, var(--sky-01) 0%, var(--primary) 100%);
  position: absolute;
  filter: blur(7px);
  box-shadow: 0 0 1rem 0.5rem var(--sky-01);
}

/* Animation for the text */
@keyframes text {
  0% {
    content: '';
    opacity: 0;
  }
  12% {
    content: 'breathe in';
    opacity: 0;
  }
  15% {
    content: 'breathe in';
    opacity: 1;
  }
  25.7% {
    content: 'breathe in';
    opacity: 1;
  }
  27.5% {
    content: 'breathe in';
    opacity: 0;
  }
  27.56% {
    content: 'hold';
    opacity: 0;
  }
  33.7% {
    content: 'hold';
    opacity: 1;
  }
  40.5% {
    content: 'hold';
    opacity: 1;
  }
  41.5% {
    content: 'hold';
    opacity: 0;
  }
  41.7% {
    content: 'hummm';
    opacity: 0;
  }
  47% {
    content: 'hummm';
    opacity: 1;
  }
  90% {
    content: 'hummm';
    opacity: 1;
  }
  100% {
    content: 'hummm';
    opacity: 0;
  }
}

/* Animation for the scaling effect on the container */
@keyframes pulse {
  0% {
    transform: scale(0.6);
  }
  11.1% {
    transform: scale(0.6);
  }
  27.7% {
    transform: scale(1);
  }
  38.8% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.6);
  }
}
</style>
