<template>
  <div v-if="svgContent" class="app-illustration" v-html="svgContent" />
</template>

<script>
export default {
  props: {
    name: { type: String, required: true },
    opacity: { type: [String, Number], default: 1 },
  },
  data() {
    return {
      svgContent: null,
    }
  },
  computed: {
    computedStyles() {
      return {
        opacity: this.opacity,
      }
    },
  },
  mounted() {
    this.loadSvg()
  },
  methods: {
    async loadSvg() {
      try {
        const illustrationSvg = await import(`@/assets/illustrations/illus_${this.name}.svg?raw`)
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
