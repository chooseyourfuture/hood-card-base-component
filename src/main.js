/**
 * main.js is the entry point file for vue-cli-service serve. It mounts the Vue component onto the page and installs vuetify.
 */

import Vue from "vue";
import HoodsBaseComponent from "./HoodsBaseComponent.vue";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

new Vue({
  vuetify,

  render: h =>
    h(HoodsBaseComponent, {
      props: {
        apiKey: process.env.VUE_APP_API_KEY,
        // neighbourhoodId: "7"
        municipalityId: "1",
        coordinates: {
          lat: 60.449418,
          lon: 22.2745824
        }
      }
    })
}).$mount("#app");
