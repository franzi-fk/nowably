<script setup>
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

const props = defineProps({
  name: String,
  size: { type: [Number, String], default: 24 }, // Accept both number and string for size
  color: { type: String, default: 'var(--base-black)' }, // Default color
})

// Convert size to a number if it's passed as a string
const iconSize = computed(() => {
  return typeof props.size === 'string' ? parseInt(props.size, 10) : props.size
})

const iconComponent = computed(() => {
  if (!props.name) return null // Ensure that 'name' is defined
  const icon = LucideIcons[props.name.charAt(0).toUpperCase() + props.name.slice(1)] // Capitalize the first letter
  return icon || null // Return icon component or null if not found
})
</script>

<template>
  <component v-if="iconComponent" :is="iconComponent" :size="iconSize" :color="props.color" />
  <span v-else>⚠️</span>
  <!-- Fallback if icon not found -->
</template>
