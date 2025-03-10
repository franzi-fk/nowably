<template>
  <div class="input-container">
    <input
      ref="inputField"
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
      {{ modelValue.length }} / {{ maxLength }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: '',
    },
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
    maxLength: {
      type: [Number, String],
      default: null,
      validator(value) {
        const numValue = Number(value)
        return !isNaN(numValue)
      },
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
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

input,
input:focus {
  height: 3.125rem;
  border-radius: 0.625rem;
  border: 2px solid var(--sand-03) !important;
  padding: 0.2rem 4rem 0.2rem 0.8rem;
  font-size: 1.1rem;
  letter-spacing: 0.03rem;
  width: 100%;
}

input:disabled {
  opacity: 0.5;
}

.char-counter {
  font-size: 0.8125rem;
  color: var(--base-black);
  margin-inline: 0.25rem;
  padding-inline: 0.5rem;
  min-width: fit-content;
  position: absolute;
}
</style>
