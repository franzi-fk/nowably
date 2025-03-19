<template>
  <div class="completion-card-visual aspect-ratio">
    <!-- Front Side -->
    <div v-if="!isFlipped" class="completion-card-front">
      <img
        v-if="milestoneData && milestoneData.image"
        :src="milestoneData.image"
        :alt="milestoneData.title"
        class="completion-card-image"
      />
      <div class="completion-card-content">
        <p class="completion-card-title">{{ milestoneData?.title || 'Unknown Milestone' }}</p>
        <p class="completion-card-description">
          {{ milestoneData?.description || 'No description available.' }}
        </p>
      </div>
    </div>
    <!-- Back Side -->
    <div v-else class="completion-card-back">
      <p v-if="backText" class="completion-card-back-text">{{ backText }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompletionCard',
  props: {
    milestone: { type: Number, default: 5 }, // Determines which milestone to display
    isFlipped: { type: Boolean, default: false }, // Show back side or front
    backText: { type: String, default: '' }, // Optional text on back side
  },
  data() {
    return {
      completionCardMilestones: {
        5: {
          title: 'Progress Pioneer Meerkat',
          description: 'Starting your journey with unstoppable curiosity.',
          image: null, // will be added dynamically
        },
        10: {
          title: 'Breakthrough Dolphin',
          description: 'Building speed and breaking free from hesitation.',
          image: null,
        },
        20: {
          title: 'Path Shifter Wolf',
          description: 'Shattering old habits, creating a fresh path.',
          image: null,
        },
        50: {
          title: 'Habit Builder Squirrel',
          description: 'Turning small steps into lasting routines.',
          image: null,
        },
        75: {
          title: 'Productive Flow Bee',
          description: 'Mastering the art of effortless productivity.',
          image: null,
        },
        100: {
          title: 'Goal Getter Elephant',
          description: 'Turning your goals into milestones, one by one.',
          image: null,
        },
        150: {
          title: 'Routine Shifter Toucan',
          description: 'Transforming the ordinary into extraordinary.',
          image: null,
        },
        200: {
          title: 'Procrastination Conqueror Lion',
          description: 'Turning delay into action with unstoppable force.',
          image: null,
        },
        250: {
          title: 'Gradual Progress Capybara',
          description: 'Small steps, steady results, ongoing momentum.',
          image: null,
        },
        300: {
          title: 'Task Tamer Shark',
          description: 'Facing each challenge with poise and precision.',
          image: null,
        },
        350: {
          title: 'Progress Seeker Fox',
          description: 'Continuously evolving and moving forward.',
          image: null,
        },
        400: {
          title: 'Unstoppable Achiever Kangaroo',
          description: 'No hurdle too high, no goal too far.',
          image: null,
        },
        500: {
          title: 'Momentum Master Cheetah',
          description: 'Harnessing the power of momentum and riding it to success.',
          image: null,
        },
        600: {
          title: 'Energy Dynamo Bear',
          description: 'Fueling your progress with boundless energy.',
          image: null,
        },
        700: {
          title: 'Peak Performer Llama',
          description: 'Reaching new heights with every step you take.',
          image: null,
        },
        800: {
          title: 'Focused Strength Owl',
          description: 'Channeling all your focus into unwavering success.',
          image: null,
        },
        900: {
          title: 'Master of Success Orca',
          description: 'Turning progress into your natural state.',
          image: null,
        },
        1000: {
          title: 'Legendary Achiever Phoenix',
          description: 'Rising from challenges and embracing transformation.',
          image: null,
        },
      },
    }
  },
  computed: {
    milestoneData() {
      return this.completionCardMilestones[this.milestone] || null
    },
  },
  watch: {
    // Watch for changes in the milestone prop
    milestone: {
      immediate: true,
      handler(newMilestone) {
        this.loadMilestoneImage(newMilestone)
      },
    },
  },
  methods: {
    async loadMilestoneImage(milestone) {
      const milestoneData = this.completionCardMilestones[milestone]
      if (milestoneData && milestoneData.image === null) {
        try {
          // Extract the last word of the title safely
          const words = milestoneData.title.split(' ')
          const identifier = words.length > 1 ? words[words.length - 1].toLowerCase() : 'default'

          // Direct path reference for assets in public/cc-graphics/
          const imagePath = `/cc-graphics/cc_${identifier}.png` // No need for `new URL()` here

          // Check if the image exists (optional, for error handling)
          const imageExists = await this.checkImageExists(imagePath)
          if (imageExists) {
            this.completionCardMilestones[milestone].image = imagePath
          } else {
            // Fallback to default image if the image does not exist
            this.completionCardMilestones[milestone].image = '/cc-graphics/default-image.png'
          }
        } catch (error) {
          console.error(`Failed to load image for milestone ${milestone}:`, error)
          // Default image path in case of error
          this.completionCardMilestones[milestone].image = '/cc-graphics/default-image.png'
        }
      }
    },

    async checkImageExists(imagePath) {
      try {
        const response = await fetch(imagePath, { method: 'HEAD' })
        return response.ok // Returns true if the image exists
      } catch (error) {
        return console.log(error)
      }
    },
  },
}
</script>

<style scoped>
.completion-card-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 2rem;
  padding: 1.15rem;
  background-color: var(--base-white);
  box-shadow: 0.125rem 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  text-align: left;
  overflow: hidden;
  border-radius: 1.25rem;
  transition:
    transform 0.4s ease-in-out,
    box-shadow 0.4s ease-in-out;
  transform-origin: center;
  flex-grow: 1;
}

.aspect-ratio {
  aspect-ratio: 14 / 23;
}

.completion-card-visual:hover {
  box-shadow: 0.125rem 0.125rem 0.75rem rgba(0, 0, 0, 0.12);
  transform: scale(1.02);
}

/* Front Side */
.completion-card-front {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 0.2188rem solid #e7e4e3;
  border-radius: 0.65rem;
  width: 100%;
  height: 100%;
  padding: 0.7rem;
  flex-grow: 1;
}

.completion-card-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 0.3rem;
  overflow: hidden;
  height: fit-content;
}

.completion-card-title {
  font-weight: 600;
  margin-block: 0.75rem 0.25rem;
  font-size: 1.5rem;
}

.completion-card-content {
  padding-inline: 0.125rem;
  text-align: center;
  height: fit-content;
  margin-block: auto;
}

.completion-card-content p {
  font-size: 1.1rem;
  line-height: 120%;
  letter-spacing: 0;
  margin-block: 0.3rem;
}

/* Back Side */
.completion-card-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-image: url('/cc-graphics/cc-backside-pattern.png'); /* Fixed backside image */
  background-size: cover;
  background-position: center;
  color: var(--base-white);
  text-align: center;
  padding: 1rem;
  border-radius: 0.65rem;
}

.completion-card-back-text {
  background: rgba(0, 0, 0, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 0.45rem;
  font-size: 1.1rem;
}

/*_______________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .completion-card-back-text {
    font-size: 1.1rem;
  }

  .completion-card-content p {
    font-size: 1.1rem;
  }
}

/* X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
}

/* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {
}
</style>
