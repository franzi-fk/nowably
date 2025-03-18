<template>
  <div class="content-rotator">
    <!-- Rotated Content -->
    <div v-show="isContentVisible">
      <slot :currentContent="currentContent"></slot>
    </div>

    <!-- Rotate Content Button -->
    <LinkButton
      @click="rotateContent"
      class="rotate-content-button"
      type="icon-text"
      :text="btnText"
      :icon="btnIcon"
      iconSize="18"
      variant="secondary"
    />
  </div>
</template>

<script>
export default {
  props: {
    btnText: {
      type: String,
      default: 'Show next',
    },
    btnIcon: {
      icon: String,
      default: 'home',
    },
    contentItems: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentIndex: 0, // Keeps track of the current content index
      currentContent: {},
      isContentVisible: false,
    }
  },
  methods: {
    rotateContent() {
      // Increment the current index and loop back to the start if at the end
      this.currentIndex = (this.currentIndex + 1) % this.contentItems.length
      this.currentContent = this.contentItems[this.currentIndex]
      this.isContentVisible = true
    },
  },
  mounted() {
    this.rotateContent() // Display the first content when the component is mounted
  },
}
</script>

<style scoped>
.content-rotator {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
}
.rotate-content-button {
  margin-top: 1.1rem;
}
</style>
