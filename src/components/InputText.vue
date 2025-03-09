<template>
  <div class="input-container">
    <input
      ref="inputField"
      type="text"
      :id="id"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxLength="maxLength"
      aria-label="input field"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
    <div v-if="maxLength && isFocused" class="char-counter">
      {{ modelValue.length }} / {{ maxLength }} characters
    </div>
  </div>
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
    maxLength: {
      type: Number,
      default: null, // Default to null if no limit is specified
    },
  },
  data() {
    return {
      isFocused: false, // Track the focus state of the input
    }
  },
  emits: ['update:modelValue'],
  methods: {
    focusInput() {
      this.$refs.inputField.focus()
    },
  },
}
</script>

<style scoped>
.input-container {
  text-align: right;
}

input[type='text'],
input[type='text']:focus {
  height: 3.125rem;
  border-radius: 0.625rem;
  border: 2px solid var(--sand-03) !important;
  padding: 0.2rem 0.8rem;
  font-size: 1.1rem;
  letter-spacing: 0.03rem;
  width: 100%;
}
.char-counter {
  font-size: 0.8125rem;
  color: var(--base-black);
  margin-block: 0.2rem;
  margin-inline: 0.5rem;
}
</style>
