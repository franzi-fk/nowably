<template>
  <div class="custom-select">
    <select
      v-model="localSelectedValue"
      :disabled="disabled"
      class="select-style"
      :name="name"
      :id="id"
      @change="emitSelectedValue"
      data-cy="input-select"
    >
      <option disabled value="">{{ placeholder }}</option>
      <option
        v-for="item in items"
        :key="item[valueKey]"
        :value="item[valueKey]"
      >
        {{ item[labelKey] }}
      </option>
    </select>
    <AppIcon name="chevronDown" class="select-icon" color="var(--base-black)" />
  </div>
</template>

<script>
import AppIcon from "@/components/Visuals/AppIcon.vue";

export default {
  components: { AppIcon },
  props: {
    items: {
      type: Array,
      required: true,
    },
    modelValue: [String, Number], // v-model binding
    labelKey: {
      type: String,
      required: true, // key for display text (what to display to the user -> most likely a description)
    },
    valueKey: {
      type: String,
      required: true, // key for the selected value (what to store, when user selects something -> most likely an id)
    },
    placeholder: {
      type: String,
      default: "Select an option",
    },
    disabled: Boolean,
    name: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      localSelectedValue: this.modelValue, // Local state for the select input
    };
  },
  watch: {
    modelValue(newValue) {
      this.localSelectedValue = newValue; // Keep local state in sync with external model
    },
    // Watch for changes to 'modelValue'
    // ensures that if the parent component updates 'modelValue',
    // the internal 'localSelectedValue' is also updated
  },
  methods: {
    emitSelectedValue() {
      // is triggered when the user selects a value from the dropdown
      // Emit the updated selected value to the parent component
      this.$emit("update:modelValue", this.localSelectedValue);
    },
  },
};
</script>

<style scoped>
.custom-select {
  position: relative;
  display: inline-block;
  width: 100%;
}

.select-style {
  width: 100%;
  height: 3.125rem;
  border-radius: 0.625rem;
  border: 2px solid var(--sand-03);
  padding: 0.2rem 0.8rem;
  font-size: 1rem;
  letter-spacing: 0.03rem;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  transition: all 0.3s ease;
  background-color: var(--base-white);
}

.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--base-black);
  transition: transform 0.3s ease;
}

/* Rotate the arrow when focused */
.select-style:focus + .select-icon {
  transform: translateY(-50%) rotate(180deg);
}

select:hover {
  border-color: color-mix(in srgb, var(--sand-03) 80%, var(--base-black) 20%);
}

.select-style:disabled {
  opacity: 50%;
  cursor: default;
}

.select-style:disabled + .select-icon {
  opacity: 30%;
}
</style>
