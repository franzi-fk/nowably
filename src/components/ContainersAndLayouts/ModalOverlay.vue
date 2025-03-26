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
        <!-- Cancel button -->
        <SolidButton
          v-if="!primaryActionOnly"
          variant="secondary"
          type="text"
          @click="closeModal"
          text="Cancel"
          :stopPropagation="true"
        />

        <!-- Primary Action button (with custom action) -->
        <SolidButton
          type="text"
          variant="primary"
          @click="primaryAction"
          :text="primaryActionText"
          :stopPropagation="true"
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
      default: "",
    },
    text: {
      type: String,
      required: true,
    },
    primaryActionText: {
      type: String,
      default: "Confirm",
    },
    primaryAction: {
      type: [Function, null],
      required: true,
    },
    primaryActionOnly: {
      type: Boolean,
      default: false, // Default value is false, showing the Cancel button
    },
  },
  methods: {
    closeModal() {
      this.$emit("update:isVisible", false);
    },
  },
};
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
  z-index: 9999; /* Ensure it's higher than other content */
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
  text-align: left;
  max-height: 2.4rem;
}

.btn-icon {
  position: absolute;
  top: -0.5rem;
  right: -1.2rem;
}

p {
  margin: 0;
}

.modal-body {
  text-align: left;
  margin-block: 1.5rem 2.2rem;
  line-height: 140%;
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
