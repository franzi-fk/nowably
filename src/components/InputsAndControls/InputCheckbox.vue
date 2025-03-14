<template>
  <label :for="id" class="input-label" id="checkbox-label">
    <input
      type="checkbox"
      :id="id"
      :name="name"
      v-model="internalValue"
      class="custom-input checkbox"
    />
    {{ label }}
  </label>
</template>

<script>
export default {
  name: 'InputCheckbox',
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  computed: {
    internalValue: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },
}
</script>

<style scoped>
.input-label {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: 1.1rem;
  gap: 0.75rem;
}

input[type='checkbox'] {
  appearance: radio;
  accent-color: var(--primary);
  -webkit-appearance: radio;
  min-width: 1.4rem;
  min-height: 1.4rem;
  background-color: var(--base-white);
  cursor: pointer;
  margin: 0.0625rem 0 0 0;
}

/* __________________________________________________ */
@media (min-width: 576px) {
  input[type='checkbox'] {
    min-width: 1.25rem;
    min-height: 1.25rem;
  }
}
</style>
