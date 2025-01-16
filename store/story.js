import axios from "axios";
import Cookies from "js-cookie"; // Pastikan ini sudah diimport untuk mengambil cookie

export default {
  namespaced: true,
  state() {
    return {
      stories: [],
      categories: [],
    };
  },

  getters: {},

  mutations: {
    setStoryData(state, payload) {
      state.stories = payload;
    },
    setStoryByCategory(state, stories) {
    state.stories = stories;
    },
    setCategoryData(state, payload) {
      state.categories = payload;
    },
  },

  actions: {
    async getStoryData({ commit }) {
      try {
        const { data } = await axios.get(`http://127.0.0.1:8000/api/stories/newest`);
        commit("setStoryData", data.data);
        return data.data;
      } catch (err) {
        console.error("Error in Vuex Action:", err);
      }
    },  
    
    async getStoryByCategory({ commit },) {
      try {
        const {data} = await axios.get(`http://127.0.0.1:8000/api/category-story`);
        commit('setStoryByCategory', data.data);
        return data.data;
      } catch (error) {
        console.error("Error fetching stories by category:", error);
      }
    },

    async getCategoryData({ commit }) {
      try {
        const { data } = await axios.get(`http://127.0.0.1:8000/api/category`);
        commit("setCategoryData", data.data);
        return data.data;
      } catch (err) {
        console.error("Error in Vuex Action:", err);
      }
    },

  },
};
