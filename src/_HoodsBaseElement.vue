<template>
  <div
    class="hoods-preview"
    :style="baseStyle"
    v-responsive="{
      'hoods-preview--medium': el => el.width > 600,
      'hoods-preview--large': el => el.width > 1000
    }"
  >
    <div v-if="loading" class="hoods-preview__content-container">
      <v-progress-circular indeterminate />
    </div>
    <div v-else-if="error" class="hoods-preview__content-container">
      <h2 class="hoods-preview__title" :style="headingStyle">
        {{ errorText }}
      </h2>
      <p class="hoods-preview__description">
        {{ errorPrompt }}
      </p>
    </div>
    <template v-else-if="neighbourhood">
      <img
        v-if="neighbourhood.thumbnail"
        :src="neighbourhood.thumbnail"
        :alt="neighbourhood.name"
        class="hoods-preview__thumbnail"
      />

      <div class="hoods-preview__content-container">
        <h2 class="hoods-preview__title" :style="headingStyle">
          {{ neighbourhood.name }}
        </h2>

        <p class="hoods-preview__description">
          {{ neighbourhood.shortDescription[language] }}
        </p>

        <div class="hoods-preview__features">
          <p v-for="feature in features" :key="feature.id">
            <v-icon>mdi-{{ feature.icon }}</v-icon>
            {{ feature.description[language] }}
          </p>
        </div>

        <div
          class="hoods-preview__articles"
          v-if="neighbourhood.articles && neighbourhood.articles.length > 0"
        >
          <h3>{{ articlesText }}</h3>
          <a v-for="(blog, idx) in blogs" :key="idx" :href="blog.url">
            <v-card :elevation="0" class="blog-card">
              <img class="blog-img" :src="blog.thumbnail" />
              <v-card-text>
                {{ blog.title }}
              </v-card-text>
            </v-card>
          </a>
        </div>

        <div class="hoods-preview__padding" />

        <div class="hoods-preview__footer">
          <v-btn @click="openPage" outlined>{{ readMoreText }}</v-btn>

          <div class="hoods-preview_powered-by">
            {{ poweredByText }}
            <img src="https://hoods.fi/assets/images/hoods-logo.svg" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import translations from "./lang";

import { ResponsiveDirective } from "vue-responsive-components";

/**
 * This component provides the visible UI element for the Hoods preview card.
 */
export default {
  props: {
    loading: {
      type: Boolean,
      required: true
    },

    error: {
      required: true,
      validator: () => true
    },

    neighbourhood: {
      required: true,
      validator: () => true
    },

    language: {
      required: true,
      type: String
    },

    colorPrimary: {
      type: String,
      default: undefined
    },

    colorSecondary: {
      type: String,
      default: undefined
    },

    colorBackground: {
      type: String,
      default: undefined
    },

    headingFontFamily: {
      type: String,
      default: undefined
    }
  },

  directives: {
    responsive: ResponsiveDirective
  },

  computed: {
    readMoreLink() {
      if (!this.neighbourhood) {
        return "https://hoods.fi";
      }
      return `https://hoods.fi/hood/${this.neighbourhood.municipality.slug}/${this.neighbourhood.slug}`;
    },

    readMoreText() {
      return translations[this.language].readMore;
    },

    poweredByText() {
      return translations[this.language].poweredBy;
    },

    articlesText() {
      return translations[this.language].articles;
    },

    errorText() {
      return translations[this.language].error;
    },

    errorPrompt() {
      return translations[this.language].errorPrompt;
    },

    headingStyle() {
      const options = {};

      if (this.colorPrimary) {
        options.color = this.colorPrimary;
      } else if (this.headingFont) {
        options.fontFamily = this.headingFontFamily;
      }

      return options;
    },

    baseStyle() {
      const options = {};

      if (this.colorSecondary) {
        options.color = this.colorPrimary;
      } else if (this.colorBackground) {
        options.backgroundColor = this.colorBackground;
      }

      return options;
    },

    features() {
      if (!this.neighbourhood) {
        return [];
      }

      return this.neighbourhood.features.slice(0, 5);
    }
  },

  methods: {
    openPage() {
      /**
       * TODO: Open in a new tab
       */
      window.top.location.href = this.readMoreLink;
    }
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");
$color-primary: #ec6c30;
$color-secondary: #707070;

/* FOR TESTING PURPOSES */
body {
  height: 100vh;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
}

.hoods-preview {
  font-family: "Montserrat", Arial, sans-serif;
  color: $color-secondary;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: stretch;

  &__content-container {
    padding: 16px;
    flex-grow: 1;
    flex-shrink: 1;
    display: flex;
    flex-direction: column;

    overflow-x: hidden;
    overflow-y: auto;
  }

  &__title {
    color: $color-primary;
    margin-bottom: 8px;
  }

  &__thumbnail {
    object-fit: cover;
    align-self: stretch;
    height: 150px;
  }

  &__description {
    margin-bottom: 16px;
  }

  &__padding {
    flex-grow: 1;
    flex-shrink: 1;
  }

  &__footer {
    margin-top: 8px;

    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .hoods-preview__features .v-icon {
    color: $color-primary;
  }

  &--medium {
    .hoods-preview {
      &__content {
        display: flex;
      }
    }
  }
}
</style>
