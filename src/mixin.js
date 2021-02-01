/**
 * This mixin handles the HoodsBaseComponent business logic.
 */

import axios from "axios";

const API_BASE_URL = "https://api.hoods.fi";

/**
 * `formatNeighbourhood` adjusts the data received from the API so it
 * fits the UI data model.
 */
const formatNeighbourhood = neighbourhood => {
  neighbourhood.articles = neighbourhood.articels || neighbourhood.articles;

  if (neighbourhood.featuredPicture) {
    neighbourhood.thumbnail = neighbourhood.featuredPicture.url;
  } else {
    neighbourhood.thumbnail =
      neighbourhood.thumbnail ||
      "https://hoodsstorage.blob.core.windows.net/pictures/457224.jpg";
  }

  return neighbourhood;
};

/**
 * `getNeighbourhood` gets a neighbourhood based on the neighbourhoodId.
 */
const getNeighbourhood = ({ apiKey, neighbourhoodId }) => {
  return axios
    .get(`${API_BASE_URL}/embed/${neighbourhoodId}`, {
      params: { token: apiKey }
    })
    .then(({ data }) => {
      return {
        neighbourhood: formatNeighbourhood(data.hood),
        error: false
      };
    })
    .catch(e => {
      // eslint-disable-next-line no-console
      console.error(e);

      return {
        neighbourhood: undefined,
        error: e
      };
    });
};

/**
 * `getNeighbourhoodByCoordinates` gets a neighbourhood based on its coordinates.
 */
const getNeighbourhoodByCoordinates = ({ apiKey, regionId, coordinates }) => {
  return axios
    .get(`${API_BASE_URL}/regions/${regionId}/hoods`, {
      params: {
        token: apiKey,
        distance: `${coordinates.lat},${coordinates.lon},1`
      }
    })
    .then(({ data }) => {
      return {
        neighbourhood: formatNeighbourhood(data.hoods[0]),
        error: false
      };
    })
    .catch(e => {
      // eslint-disable-next-line no-console
      console.error(e);

      return {
        neighbourhood: undefined,
        error: e
      };
    });
};

export const loadData = ({
  neighbourhoodId,
  regionId,
  coordinates,
  apiKey
}) => {
  if (typeof neighbourhoodId !== "undefined") {
    // If there is a neighbourhoodId in the props, get
    // the neighbourhood based on it
    return getNeighbourhood({ neighbourhoodId, apiKey });
  } else if (
    typeof regionId !== "undefined" &&
    typeof coordinates !== "undefined"
  ) {
    // If there is a regionId and coordinates for the
    // point, get the neighbourhood using those.
    return getNeighbourhoodByCoordinates({
      regionId,
      coordinates,
      apiKey
    });
  }

  // eslint-disable-next-line no-console
  console.error(
    "Please provide either neighbourhood ID or coordinates and region ID!"
  );

  return new Promise(resolve => {
    resolve({ neighbourhood: undefined, error: true });
  });
};

const mixin = {
  data() {
    return {
      neighbourhood: null,
      loading: false,
      error: false
    };
  },

  methods: {
    init() {
      return loadData({
        apiKey: this.apiKey,
        regionId: this.regionId,
        coordinates: this.coordinates,
        neighbourhoodId: this.neighbourhoodId
      }).then(({ error, neighbourhood }) => {
        this.error = error;
        this.neighbourhood = neighbourhood;
      });
    }
  }
};

export default mixin;
