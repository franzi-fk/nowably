<template>
  <div class="tooltip-container" @mouseenter="showTooltip" @mouseleave="hideTooltip">
    <slot></slot>
    <!-- The trigger element -->
    <span v-if="visible" class="tooltip" :style="tooltipStyles">
      {{ text }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      default: 'right', // Default tooltip position
      validator: (value) => ['top', 'right', 'bottom', 'left'].includes(value),
    },
  },
  data() {
    return {
      visible: false,
      tooltipStyles: {},
    }
  },
  methods: {
    showTooltip(event) {
      this.visible = true
      const rect = event.target.getBoundingClientRect()

      // Calculate tooltip position based on prop
      const spacing = 6 // Space between element and tooltip
      let styles = {
        position: 'fixed',
        zIndex: 100,
      }

      switch (this.position) {
        case 'top':
          styles.top = `${rect.top - spacing}px`
          styles.left = `${rect.left + rect.width / 2}px`
          styles.transform = 'translate(-50%, -100%)'
          break
        case 'bottom':
          styles.top = `${rect.bottom + spacing}px`
          styles.left = `${rect.left + rect.width / 2}px`
          styles.transform = 'translate(-50%, 0)'
          break
        case 'left':
          styles.top = `${rect.top + rect.height / 2}px`
          styles.left = `${rect.left - spacing}px`
          styles.transform = 'translate(-100%, -50%)'
          break
        case 'right':
        default:
          styles.top = `${rect.top + rect.height / 2}px`
          styles.left = `${rect.right + spacing}px`
          styles.transform = 'translate(0, -50%)'
          break
      }

      this.tooltipStyles = styles
    },
    hideTooltip() {
      this.visible = false
    },
  },
}
</script>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  overflow: visible;
}

.tooltip {
  background-color: var(--base-white);
  color: var(--base-black);
  box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.085);
  padding: 0.3rem 0.55rem 0.4rem 0.55rem;
  border-radius: 0.375rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.4s ease-in-out;
  font-size: 0.875rem;
  z-index: 50;
}

.tooltip-container:hover .tooltip {
  opacity: 1;
  visibility: visible;
}
</style>
