<template>
  <button
    :class="buttonClass"
    :style="buttonStyle"
    :disabled="disabled"
    @click="handleClick"
    :aria-label="ariaLabel"
  >
    <!-- Icon & Text -->
    <template v-if="type === 'icon-text'">
      <AppIcon v-if="iconPosition === 'left'" :name="icon" :size="iconSize" :color="iconColor" />
      <span>{{ text }}</span>
      <AppIcon v-if="iconPosition === 'right'" :name="icon" :size="iconSize" :color="iconColor" />
    </template>

    <!-- Icon Only -->
    <AppIcon v-else-if="type === 'icon'" :name="icon" :size="iconSize" :color="iconColor" />

    <!-- Text Only -->
    <span v-else>{{ text }}</span>
  </button>
</template>

<script>
export default {
  name: 'SolidButton',
  props: {
    type: {
      type: String,
      required: true,
      default: 'icon-text',
      validator: (value) => ['icon', 'text', 'icon-text'].includes(value),
    },
    text: { type: String, default: '' },
    icon: { type: String, default: 'home' },
    disabled: { type: Boolean, default: false },
    backgroundColor: { type: String, default: 'var(--secondary)' },
    textColor: { type: String, default: 'var(--base-black)' },
    iconSize: { type: String, default: '20' },
    iconColor: { type: String, default: 'currentColor' },
    iconPosition: {
      type: String,
      default: 'left',
      validator: (value) => ['left', 'right'].includes(value),
    },
    stopPropagation: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    buttonStyle() {
      return {
        backgroundColor: this.backgroundColor,
        color: this.textColor,
        border: 'none',
      }
    },
    buttonClass() {
      return [
        'btn-solid', // Always keep this class
        `btn-${this.type}`, // Apply text/icon/text&icon class conditionally
      ]
    },
    ariaLabel() {
      return this.text || this.icon || 'Button'
    },
  },
  methods: {
    handleClick(event) {
      if (this.stopPropagation) {
        event.stopPropagation() // Prevent event bubbling if stopPropagation is true
      }
      if (!this.stopPropagation) {
        this.$emit('click', event) // Only emit if stopPropagration is false
      }
    },
  },
}
</script>

<style scoped>
/* Solid Button General */
.btn-solid {
  border-radius: 0.625rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.05rem;
  min-height: 3.125rem;
}

/* Icon-Only Button */
.btn-icon {
  width: 3.125rem;
  height: 3.125rem;
}

/* Text-Only Button */
.btn-text {
  padding: 0.625rem 1.25rem;
  min-width: 7.8125rem;
}

/* Text & Icon Spacing */
.btn-icon-text {
  padding: 0.625rem 1.25rem;
  gap: 0.5rem;
  padding-left: 0.875rem;
  padding-right: 1.25rem;
  min-width: 7.8125rem;
}

/* Disabled State */
.btn-solid:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (min-width: 576px) {
  .btn-solid {
    font-size: 0.95rem;
  }
}
</style>
