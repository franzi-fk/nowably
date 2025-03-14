<template>
  <div class="input-container" :class="variant === 'multi-line' ? 'multi-line' : 'single-line'">
    <!-- Textarea (multi-line) -->
    <textarea
      v-if="variant === 'multi-line'"
      ref="inputField"
      :id="id"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxLength"
      :minlength="minLength"
      :aria-describedby="charCounterId"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
    ></textarea>

    <!-- Input field (single-line) -->
    <input
      v-else
      ref="inputField"
      :id="id"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxLength="maxLength"
      :minlength="minLength"
      :aria-describedby="charCounterId"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />

    <!-- Character Counter for single-line (only visible when focused) -->
    <div
      v-if="
        (variant === 'single-line' && maxLength && isFocused) ||
        (variant === 'single-line' && minLength && isFocused)
      "
      :id="charCounterId"
      class="char-counter-sl"
    >
      <span v-if="maxLength"> {{ modelValue.length }} / {{ maxLength }} </span>
      <span v-if="minLength"> min: {{ minLength }} / {{ modelValue.length }} </span>
    </div>

    <!-- Character Counter for single-line (only visible when focused) -->
    <div
      v-if="(variant === 'multi-line' && maxLength) || (variant === 'multi-line' && minLength)"
      :id="charCounterId"
      class="char-counter-ml"
    >
      <span>{{ modelValue.length }}</span>
      <div>
        <span v-if="minLength"> min. {{ minLength }} </span>
        <span v-if="maxLength"> max. {{ maxLength }} </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: 'single-line',
      validator(value) {
        return ['single-line', 'multi-line'].includes(value)
      },
    },
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
    label: {
      type: String,
      default: 'Text field',
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
    minLength: {
      type: [Number, String],
      default: null,
      validator(value) {
        return !isNaN(Number(value))
      },
    },
  },
  data() {
    return {
      isFocused: false, // Track the focus state of the input
    }
  },
  computed: {
    charCounterId() {
      return this.maxLength || this.minLength ? `${this.id}-char-counter` : null
    },
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
.single-line {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
}

.multi-line {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
}

input,
input:focus {
  height: 3.125rem;
  border-radius: 0.625rem;
  border: 2px solid var(--sand-03);
  padding: 0.2rem 4rem 0.2rem 0.8rem;
  font-size: 1.1rem;
  letter-spacing: 0.03rem;
  width: 100%;
}

input:disabled {
  opacity: 0.5;
}

.char-counter-sl {
  font-size: 0.8125rem;
  color: var(--base-black);
  margin-inline: 0.25rem;
  padding-inline: 0.5rem;
  min-width: fit-content;
  position: absolute;
}

textarea {
  min-height: 14rem;
  width: 100%;
  border-radius: 0.625rem;
  border: 2px solid var(--sand-03);
  padding: 0.6rem 0.8rem 0.8rem 0.8rem;
  font-size: 1.1rem;
  letter-spacing: 0.03rem;
  overflow: auto;
  resize: vertical;
  line-height: 150%;
}

textarea:focus {
  outline: none;
  border-color: var(--base-black);
}

textarea:disabled {
  opacity: 0.5;
}

.char-counter-ml {
  font-size: 0.8125rem;
  color: var(--base-black);
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 0.4rem;
  padding-inline: 0.5rem 0.5rem;
  min-width: fit-content;
}
</style>
