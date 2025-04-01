<template>
  <button :class="buttonClass" :disabled="disabled" :aria-label="ariaLabel">
    <!-- Icon & Text -->
    <template v-if="type === 'icon-text'">
      <AppIcon
        v-if="iconPosition === 'left'"
        :name="icon"
        :size="iconSize"
        :color="iconColor"
      />
      <span>{{ text }}</span>
      <AppIcon
        v-if="iconPosition === 'right'"
        :name="icon"
        :size="iconSize"
        :color="iconColor"
      />
    </template>

    <!-- Icon Only -->
    <AppIcon
      v-else-if="type === 'icon'"
      :name="icon"
      :size="iconSize"
      :color="iconColor"
    />

    <!-- Text Only -->
    <span v-else>{{ text }}</span>
  </button>
</template>

<script>
export default {
  name: "SolidButton",
  props: {
    type: {
      type: String,
      required: true,
      default: "icon-text",
      validator: (value) => ["icon", "text", "icon-text"].includes(value),
    },
    text: { type: String, default: "" },
    icon: { type: String, default: "home" },
    disabled: { type: Boolean, default: false },
    variant: {
      type: String,
      default: "secondary",
      validator: (value) =>
        ["primary", "secondary", "tertiary"].includes(value),
    },
    btnSize: {
      type: String,
      default: "large",
      validator: (value) => ["large", "small"].includes(value),
    },
    iconSize: { type: String, default: "20" },
    iconColor: { type: String, default: "currentColor" },
    iconPosition: {
      type: String,
      default: "left",
      validator: (value) => ["left", "right"].includes(value),
    },
  },
  computed: {
    buttonClass() {
      return [
        "btn-solid", // Base button class
        `btn-${this.variant}`, // Dynamic class based on variant
        `btn-${this.type}`, // Class based on type (icon, text, icon-text)
        `btn-${this.btnSize}`, // Class based on btnSize
      ];
    },
    ariaLabel() {
      return this.text || this.icon || "Button";
    },
  },
};
</script>

<style scoped>
/* Solid Button General */
.btn-large {
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
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease;
  border: none;
}

.btn-small {
  border-radius: 0.625rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 500;
  letter-spacing: 0.05rem;
  min-height: 2.125rem;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease;
  border: none;
  padding: 0.6rem 1rem;
  min-width: 5.25rem;
}

/* Primary */
.btn-primary {
  background-color: var(--primary);
  color: var(--base-white);
}
.btn-primary:hover {
  background-color: color-mix(in srgb, var(--primary) 60%, var(--ocean-01) 40%);
}

/* Secondary */
.btn-secondary {
  background-color: var(--secondary);
  color: var(--base-black);
}
.btn-secondary:hover {
  background-color: color-mix(
    in srgb,
    var(--secondary) 80%,
    var(--terra-01) 20%
  );
}

/* Tertiary */
.btn-tertiary {
  background-color: var(--cotton-01);
  color: var(--base-black);
}
.btn-tertiary:hover {
  background-color: color-mix(
    in srgb,
    var(--cotton-01) 25%,
    var(--base-white) 75%
  );
}

/* Icon-Only Button */
.btn-icon {
  width: 3.125rem;
  height: 3.125rem;
}

/* Text-Only Button */
.btn-icon-text {
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
  .btn-large {
    font-size: 0.95rem;
  }
  .btn-small {
    font-size: 0.875rem;
  }
}
</style>
