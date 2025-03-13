<template>
  <label :for="id" class="input-label">
    <input
      type="radio"
      :id="id"
      :name="name"
      :value="value"
      v-model="internalValue"
      class="custom-input radio"
    />
    {{ label }}
  </label>
</template>

<script>
export default {
  name: 'RadioButton',
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    value: {
      type: [String, Number, Boolean],
      required: true,
    },
    modelValue: {
      type: [String, Number, Boolean],
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
/* Label style */
.input-label {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: 1.1rem;
  gap: 0.75rem;
}

/* Default radio button styling with color and size adjustments */
input[type='radio'] {
  appearance: radio;
  accent-color: var(--primary);
  -webkit-appearance: radio;
  min-width: 1.4rem;
  min-height: 1.4rem;
  background-color: var(--base-white);
  cursor: pointer;
  margin: 0.0625rem 0 0 0;
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  input[type='radio'] {
    min-width: 1.25rem;
    min-height: 1.25rem;
  }
}
</style>
