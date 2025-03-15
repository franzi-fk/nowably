<template>
  <article class="mebo-banner-container" @click="goToCreateMebo">
    <div class="mebo-banner-header">
      <h2 class="sr-only">Message in a Bottle unlocked</h2>
      <span>Congrats! You can send a Message in a Bottle.</span>
    </div>
    <div class="mebo-banner-body">
      <p>
        You did amazing progress and beat procrastination - doesn't that feel good? You can use your
        momentum to help others, if you want.
      </p>
      <LinkButton
        type="icon-text"
        icon="arrowRight"
        text="Write Message in a Bottle"
        textColor="var(--ocean-01)"
      />
    </div>
  </article>
</template>

<script>
import { useRouter } from 'vue-router'
import LinkButton from '@/components/InputsAndControls/LinkButton.vue'

export default {
  name: 'CreateMeboBanner',
  components: {
    LinkButton,
  },
  props: {},
  data() {
    return { router: useRouter() }
  },
  computed: {},
  methods: {
    goToCreateMebo() {
      this.router.push({ name: 'send-message-in-bottle' })
    },
  },
}
</script>

<style scoped>
.mebo-banner-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  width: 100%;
  background-color: var(--cotton-01);
  border-radius: 1.5rem;
  padding: 2.5rem 1.25rem 3rem 1.25rem;
  cursor: pointer;
  transition:
    transform 0.4s ease-in-out,
    background-color 0.4s ease-in-out;
  transform-origin: center;
}

.mebo-banner-container:hover {
  transform: scale(1.01);
  background-color: var(--base-white);
}

.mebo-banner-header {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  min-height: 3.125rem;
  font-weight: 600;
}

.mebo-banner-body {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
  gap: 2rem;
}

.mebo-banner-container .btn-icon-text:before {
  transform: none;
  background-color: transparent;
  color: inherit;
}

/*_________________________________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .mebo-banner-container {
    padding-inline: 3rem;
  }
}
</style>
