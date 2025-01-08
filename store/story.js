import axios from "axios";
import Cookies from "js-cookie"; // Pastikan ini sudah diimport untuk mengambil cookie

export default {
  namespaced: true,
  state() {
    return {
      stories: [],
    };
  },

  getters: {},

  mutations: {
    setStoryData(state, payload) {
      state.stories = payload;
    },
  },

  actions: {
    async getStoryData({ commit }) {
      try {
        const { data } = await axios.get(
          "http://127.0.0.1:8000/api/stories/newest"
        );
    
        console.log("API Response:", data); // Log data API
        commit("setStoryData", data.data);
      } catch (err) {
        console.error("Error in Vuex Action:", err);
      }
    },    
  },
};
