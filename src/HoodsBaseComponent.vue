<template>
  <hoods-base-element
    :loading="loading"
    :neighbourhood="neighbourhood"
    :error="error"
    :language="language"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import mixin from "./mixin";
import HoodsBaseElement from "./_HoodsBaseElement";

/**
 * This is a wrapper component for the Hoods preview card.
 */
export default {
  name: "HoodsBaseComponent",

  components: {
    HoodsBaseElement
  },

  mixins: [mixin],

  props: {
    apiKey: {
      type: String,
      required: true
    },

    neighbourhoodId: {
      type: [Number, String],
      required: false,
      default: undefined
    },

    regionId: {
      type: [Number, String],
      required: false,
      default: undefined
    },

    coordinates: {
      type: [Object],
      required: false,
      default: undefined
    },

    language: {
      type: String,
      default: "fi"
    }
  },

  created() {
    this.loading = true;

    this.init().finally(() => {
      this.loading = false;
    });
  }
};
</script>
