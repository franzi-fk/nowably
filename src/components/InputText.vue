<template>
  <input
    type="text"
    :id="id"
    :name="name"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    aria-label="input field"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
export default {
  props: {
    modelValue: String,
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Enter text...',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
    },
  },
  emits: ['update:modelValue'],
}
</script>

<style scoped>
input[type='text'],
input[type='text']:focus {
  height: 3.125rem;
  border-radius: 0.625rem;
  border: 2px solid var(--sand-03) !important;
  padding: 0.2rem 0.8rem;
  font-size: 1.1rem;
  letter-spacing: 0.03rem;
}
</style>
