<template>
  <component
    v-if="svgContent"
    :is="svgContent"
    class="app-illustration"
    :style="{
      width: typeof width === 'number' ? width + 'rem' : width,
      height: typeof height === 'number' ? height + 'rem' : height,
      opacity: opacity,
    }"
  />
  <!-- :is="svgComponent" will replace the component with the actual <svg> element -->
</template>

<script>
export default {
  props: {
    name: { type: String, required: true }, // Illustration filename (without .svg)
    width: { type: [String, Number], default: '10rem' },
    height: { type: [String, Number], default: 'auto' },
    opacity: { type: Number, default: 1 },
  },
  data() {
    return {
      svgContent: null,
    }
  },
  mounted() {
    this.loadSvg()
  },
  methods: {
    async loadSvg() {
      try {
        const illustrationSvg = await import(`@/assets/illustrations/${this.name}.svg`)
        this.svgContent = illustrationSvg.default
      } catch (error) {
        console.error(`Error loading illustration: ${this.name}`, error)
        this.svgContent = null
      }
    },
  },
}
</script>

<style scoped>
.app-illustration {
  display: inline-block;
}
</style>
