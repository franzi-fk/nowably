<template>
  <div
    v-if="svgContent"
    class="app-illustration"
    :style="{
      width: typeof width === 'number' ? width + 'rem' : width,
      height: typeof height === 'number' ? height + 'rem' : height,
      opacity: opacity,
    }"
    v-html="svgContent"
  />
</template>

<script>
export default {
  props: {
    name: { type: String, required: true }, // Illustration filename (without .svg)
    width: { type: [String, Number], default: '10rem' },
    height: { type: [String, Number], default: 'auto' },
    opacity: { type: [String, Number], default: 1 },
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
        const illustrationSvg = await import(`@/assets/illustrations/illus_${this.name}.svg?raw`)
        this.svgContent = illustrationSvg.default
        this.updateSvgSize()
      } catch (error) {
        console.error(`Error loading illustration: ${this.name}`, error)
        this.svgContent = null
      }
    },
    updateSvgSize() {
      this.$nextTick(() => {
        const svgElement = this.$el.querySelector('svg')
        if (svgElement) {
          svgElement.style.width = typeof this.width === 'number' ? this.width + 'rem' : this.width
          svgElement.style.height =
            typeof this.height === 'number' ? this.height + 'rem' : this.height
        }
      })
    },
  },
  watch: {
    width() {
      this.updateSvgSize()
    },
    height() {
      this.updateSvgSize()
    },
  },
}
</script>

<style scoped>
.app-illustration {
  display: inline-block;
}
</style>
