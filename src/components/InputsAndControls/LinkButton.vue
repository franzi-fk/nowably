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
  name: 'LinkButton',
  props: {
    type: {
      type: String,
      required: true,
      default: 'icon-text',
      validator: (value) => ['icon', 'text', 'icon-text'].includes(value),
    },
    text: { type: String, default: '' },
    icon: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    textColor: { type: String, default: 'currentColor' },
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
        backgroundColor: 'transparent',
        color: this.textColor,
        border: 'none',
      }
    },
    buttonClass() {
      return [
        'btn-link', // always keep this class
        `btn-${this.type}`, // apply text/icon/text&icon class conditionally
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
        this.$emit('click', event) // Only emit if we didn't stop the propagation
      }
    },
  },
}
</script>

<style scoped>
/* Link Button General */
.btn-link {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.02rem;
  min-height: 3.125rem;
  position: relative;
  transition: color 0.3s ease-in-out;
}

.btn-icon-text:before,
.btn-text:before {
  content: '';
  position: absolute;
  top: 80%;
  left: 1%;
  width: calc(100% + 0.1rem);
  height: 2px;
  background-color: currentColor;
  opacity: 0.3;
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

.btn-icon-text:hover:before,
.btn-text:hover:before {
  transform: scaleX(1);
}

/* Icon-Only Button */
.btn-icon {
  width: 3.125rem;
  height: 3.125rem;
}

/* Icon & Text Spacing */
.btn-icon-text {
  gap: 0.5rem;
}

/* Disabled State */
.btn-link:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
