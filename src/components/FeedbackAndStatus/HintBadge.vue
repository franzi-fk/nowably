<template>
  <div class="hint-badge" :class="variantClasses">
    <AppIcon :name="icon" v-if="icon" size="16" :color="iconColor" />
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: null,
    },
    variant: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'success', 'error', 'warning', 'neutral'].includes(value),
    },
  },
  computed: {
    variantClasses() {
      return {
        info: 'badge-info',
        success: 'badge-success',
        error: 'badge-error',
        warning: 'badge-warning',
        neutral: 'badge-neutral',
      }[this.variant]
    },
    iconColor() {
      return {
        info: 'var(--info-dark)',
        success: 'var(--success-dark)',
        error: 'var(--error-dark)',
        warning: 'var(--warning-dark)',
        neutral: 'var(--base-black)',
      }[this.variant]
    },
  },
}
</script>

<style scoped>
.hint-badge {
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  padding: 0.27rem 0.6rem 0.35rem 0.6rem;
  border-radius: 0.625rem;
  width: fit-content !important;
}

svg {
  color: currentColor;
}

.badge-info {
  background-color: var(--info-light);
  color: var(--info-dark);
  border: 2px solid var(--info-border);
}

.badge-success {
  background-color: var(--success-light);
  color: var(--success-dark);
  border: 2px solid var(--success-border);
}

.badge-warning {
  background-color: var(--warning-light);
  color: var(--warning-dark);
  border: 2px solid var(--warning-border);
}

.badge-error {
  background-color: var(--error-light);
  color: var(--error-dark);
  border: 2px solid var(--error-border);
}

.badge-neutral {
  background-color: var(--cloud-01);
  color: var(--base-black);
  border: 2px solid var(--cloud-02);
}
</style>
