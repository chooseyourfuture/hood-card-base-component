/**
 * This mixin handles the HoodsBaseComponent business logic.
 */

import axios from "axios";

const API_BASE_URL = "https://api2.hoods.fi";

const mixin = {
  data() {
    return {
      neighbourhood: null,
      loading: false,
      error: false
    };
  },

  created() {
    if (typeof this.neighbourhoodId !== "undefined") {
      // If there is a neighbourhoodId in the props, get
      // the neighbourhood based on it
      return this.getNeighbourhood();
    } else if (
      typeof this.municipalityId !== "undefined" &&
      typeof this.coordinates !== "undefined"
    ) {
      // If there is a municipalityId and coordinates for the
      // point, get the neighbourhood using those.
      return this.getNeighbourhoodByCoordinates();
    }

    // eslint-disable-next-line no-console
    console.error("Please provide either neighbourhood ID or coordinates!");
  },

  methods: {
    /**
     * `getNeighbourhood` gets a neighbourhood based on the neighbourhoodId.
     */
    getNeighbourhood() {
      this.loading = true;

      axios
        .get(`${API_BASE_URL}/embed/${this.neighbourhoodId}`, {
          params: { token: this.apiKey }
        })
        .then(({ data }) => {
          this.neighbourhood = data.hood;

          this.formatNeighbourhood();
        })
        .catch(e => {
          // eslint-disable-next-line
          console.error(e);
          this.error = e;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * `getNeighbourhoodByCoordinates` gets a neighbourhood based on its coordinates.
     */
    getNeighbourhoodByCoordinates() {
      this.loading = true;

      axios
        .get(`${API_BASE_URL}/municipalities/${this.municipalityId}/hoods`, {
          params: {
            distance: `${this.coordinates.lat},${this.coordinates.lon}`
          }
        })
        .then(({ data }) => {
          // eslint-disable-next-line
          console.log('DATA', data)

          this.neighbourhood = data.hoods[0];

          this.formatNeighbourhood();
        })
        .catch(e => {
          // eslint-disable-next-line
          console.error(e);

          this.error = e;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * `formatNeighbourhood` adjusts the data received from the API so it
     * fits the UI data model.
     */
    formatNeighbourhood() {
      this.neighbourhood.articles =
        this.neighbourhood.articels || this.neighbourhood.articles;

      if (this.neighbourhood.featuredPicture) {
        this.neighbourhood.thumbnail = this.neighbourhood.featuredPicture.url;
      } else {
        this.neighbourhood.thumbnail =
          this.neighbourhood.thumbnail ||
          "https://hoodsstorage.blob.core.windows.net/pictures/457224.jpg";
      }
    }
  }
};

export default mixin;
