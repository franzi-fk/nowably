<template>
  <button
    :class="buttonClass"
    :style="buttonStyle"
    :disabled="disabled"
    :aria-label="ariaLabel"
  >
    <!-- Icon & Text -->
    <template v-if="type === 'icon-text'">
      <AppIcon :name="icon" :size="iconSize" :color="iconColor" />
      <span>{{ text }}</span>
    </template>

    <!-- Text Only -->
    <span v-else>{{ text }}</span>
  </button>
</template>

<script>
export default {
  name: "LinkButton",
  props: {
    type: {
      type: String,
      required: true,
      default: "text",
      validator: (value) => ["text", "icon-text"].includes(value),
    },
    text: { type: String, default: "" },
    icon: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    iconSize: { type: String, default: "20" },
    iconColor: { type: String, default: "currentColor" },
    fontSize: { type: String, default: "1rem" },
  },
  computed: {
    buttonStyle() {
      return {
        backgroundColor: "transparent",
        border: "none",
        fontSize: this.fontSize,
      };
    },
    buttonClass() {
      return [
        "btn-inline-link", // always keep this class
        `btn-${this.type}`, // apply text/text&icon class conditionally
        `btn-${this.fontSize}`, // class for fontSize
      ];
    },
    ariaLabel() {
      return this.text || this.icon || "Link";
    },
  },
};
</script>

<style scoped>
/* Link Button General */
.btn-inline-link {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.02rem;
  position: relative;
  text-decoration: underline;
  text-underline-offset: 0.25rem;
  text-decoration-color: var(--sand-03);
  transition: color 0.3s ease-in-out;
}

.btn-inline-link:hover {
  text-decoration-color: var(--base-black);
}

/* Icon & Text Spacing */
.btn-icon-text {
  gap: 0.5rem;
}

/* Disabled State */
.btn-inline-link:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
