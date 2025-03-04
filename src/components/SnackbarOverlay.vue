<template>
  <div v-if="visible" :class="['snackbar', variantClass]" role="alert" aria-live="assertive">
    <AppIcon :name="icon" class="snackbar-icon" />
    <span class="snackbar-text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'SnackbarOverlay',
  props: {
    icon: {
      type: String,
      required: true,
      default: 'info',
    },
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
    }
  },
  computed: {
    variantClass() {
      return `snackbar-${this.variant}`
    },
  },
  methods: {
    // Method to show the snackbar with a new message
    show() {
      this.visible = true

      // Clear any previous timeout if present
      if (this.snackbarTimeout) {
        clearTimeout(this.snackbarTimeout)
      }

      // Set a new timeout to hide the snackbar after the specified duration
      this.snackbarTimeout = setTimeout(() => {
        this.visible = false
      }, this.duration)
    },
  },
}
</script>

<style scoped>
.snackbar {
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 100;
  transition: opacity 0.3s ease;
  z-index: 1000;
}
.snackbar.snackbar-success {
  background-color: #4caf50;
  color: white;
}
.snackbar.snackbar-warning {
  background-color: #ff9800;
  color: white;
}
.snackbar.snackbar-error {
  background-color: #f44336;
  color: white;
}
.snackbar.snackbar-info {
  background-color: #2196f3;
  color: white;
}
.snackbar.show {
  opacity: 1;
}

.snackbar-icon {
  margin-right: 10px;
}

.snackbar-text {
  font-size: 16px;
}
</style>
