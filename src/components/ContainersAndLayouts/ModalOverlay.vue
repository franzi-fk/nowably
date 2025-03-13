<template>
  <div class="modal-overlay" v-if="isVisible" @click.self="closeModal">
    <div class="modal">
      <div class="modal-header">
        <h3 v-if="headline">{{ headline }}</h3>
        <LinkButton type="icon" icon="x" @click="closeModal" iconSize="24" />
      </div>
      <div class="modal-body">
        <p>{{ text }}</p>
      </div>
      <div class="modal-footer">
        <SolidButton
          v-for="(action, index) in actions"
          :key="index"
          @click="action.onClick"
          type="text"
          :text="action.text"
          :backgroundColor="action.backgroundColor"
          :textColor="action.textColor"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    headline: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      required: true,
    },
    actions: {
      type: Array,
      default: () => [
        {
          text: 'Cancel',
          onClick: () => {},
          backgroundColor: 'var(--secondary)',
          textColor: 'var(--base-black)',
        },
        {
          text: 'Confirm',
          onClick: () => {},
          backgroundColor: 'var(--primary)',
          textColor: 'var(--base-white)',
        },
      ],
      validator(actions) {
        if (actions.length < 1 || actions.length > 3) {
          console.warn('Modal must have at least 1 and at most 3 actions.')
          return false
        }
        return true
      },
    },
  },
  methods: {
    closeModal() {
      this.$emit('update:isVisible', false)
    },
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.modal {
  background: white;
  width: 100vw;
  padding: 1.7rem 2rem 2rem 2rem;
  border-radius: 0.625rem;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-icon {
  position: absolute;
  top: 0.7rem;
  right: 0.7rem;
}

p {
  margin: 0;
}

.modal-body {
  text-align: left;
  margin-block: 1.5rem 2.2rem;
}

.modal-footer {
  display: flex;
  flex-direction: column;
  justify-content: right;
  gap: 1.5rem;
}

/*_________________________________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .modal {
    background: white;
    width: 80%;
    padding: 1.7rem 2rem 2rem 2rem;
    border-radius: 0.625rem;
    position: relative;
    max-width: 34rem;
  }
  .modal-footer {
    flex-direction: row;
  }
}
</style>
