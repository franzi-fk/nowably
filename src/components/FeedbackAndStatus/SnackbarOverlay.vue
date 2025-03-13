<template>
  <div
    v-if="visible"
    :class="['snackbar', variantClass]"
    :style="{ bottom: snackbarBottom }"
    role="alert"
    aria-live="assertive"
  >
    <AppIcon :name="iconName" class="snackbar-icon" size="20" />
    <span class="snackbar-text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'SnackbarOverlay',
  props: {
    text: {
      type: String,
      required: true,
      default: 'This is an info for the user.',
    },
    variant: {
      type: String,
      required: true,
      default: 'info',
      validator(value) {
        return ['success', 'warning', 'error', 'info'].includes(value)
      },
    },
    duration: {
      type: Number,
      default: 5000,
    },
  },
  data() {
    return {
      visible: false, // Initially hidden
      snackbarTimeout: null, // Store the timeout reference to clear it
      keyboardOpen: false, // Track if keyboard is open
    }
  },
  computed: {
    variantClass() {
      return `snackbar-${this.variant}`
    },
    iconName() {
      const icons = {
        success: 'circleCheckBig',
        warning: 'triangleAlert',
        error: 'squareX',
        info: 'badgeInfo',
      }
      return icons[this.variant] || 'info'
    },
    snackbarBottom() {
      return this.keyboardOpen ? '8rem' : '2rem'
    },
  },
  methods: {
    show() {
      this.visible = true

      if (this.snackbarTimeout) {
        clearTimeout(this.snackbarTimeout)
      }

      this.snackbarTimeout = setTimeout(() => {
        this.visible = false
      }, this.duration)
    },

    adjustSnackbarPosition() {
      if (!window.visualViewport) return

      const viewportHeight = window.visualViewport.height
      this.keyboardOpen = viewportHeight < window.innerHeight * 0.7
    },
  },
  mounted() {
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', this.adjustSnackbarPosition)
    } else {
      window.addEventListener('resize', this.adjustSnackbarPosition)
    }
  },
  beforeUnmount() {
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', this.adjustSnackbarPosition)
    } else {
      window.removeEventListener('resize', this.adjustSnackbarPosition)
    }
  },
}
</script>

<style scoped>
.snackbar {
  display: flex;
  align-items: center;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.8rem 1.25rem 0.8rem 1rem;
  min-width: 12.5rem;
  border-radius: 0.5rem;
  border-bottom: 0.25rem inset;
  box-shadow: 0 0.25rem 1.2rem 0.5rem rgba(0, 0, 0, 0.08);
  opacity: 100;
  transition: opacity 0.3s ease;
  z-index: 1000;
  width: 85%;
}
.snackbar.snackbar-success {
  background-color: var(--base-white);
  color: var(--base-black);
  border-color: var(--success);
}
.snackbar-success .snackbar-icon {
  stroke: var(--success);
}
.snackbar.snackbar-warning {
  background-color: var(--base-white);
  color: var(--base-black);
  border-color: var(--warning);
}
.snackbar-warning .snackbar-icon {
  stroke: var(--warning);
}
.snackbar.snackbar-error {
  background-color: var(--base-white);
  color: var(--base-black);
  border-color: var(--error);
}
.snackbar-error .snackbar-icon {
  stroke: var(--error);
}
.snackbar.snackbar-info {
  background-color: var(--base-white);
  color: var(--base-black);
  border-color: var(--info);
}
.snackbar-info .snackbar-icon {
  stroke: var(--info);
}

.snackbar.show {
  opacity: 1;
}

.snackbar-icon {
  margin-right: 0.625rem;
}

.snackbar-text {
  font-size: 1.1rem;
  color: var(--base-black);
}

/*_________________________________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .snackbar {
    width: auto;
  }
}
</style>
