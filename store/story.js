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
    setNewStory(state, payload) {
      state.stories.push(payload);
    },
    setStoryDataUser(state, stories) {
      state.stories = stories;
    },
  },

  actions: {
    async getStoryData({ commit }) {
      try {
        const { data } = await axios.get(`http://159.203.137.163/api/stories/newest`);
        commit("setStoryData", data.data);
        return data.data;
      } catch (err) {
        console.error("Error in Vuex Action:", err);
      }
    },  
    
    async getStoryByCategory({ commit },) {
      try {
        const {data} = await axios.get(`http://159.203.137.163/api/category-story`);
        commit('setStoryByCategory', data.data);
        console.log(data.data, " ----8888PANTEKKKKKKKKKKKKKKKKKKK");
        return data.data;
      } catch (error) {
        console.error("Error fetching stories by category:", error);
      }
    },

    async getCategoryData({ commit }) {
      try {
        const { data } = await axios.get(`http://159.203.137.163/api/category`);
        commit("setCategoryData", data.data);
        return data.data;
      } catch (err) {
        console.error("Error in Vuex Action:", err);
      }
    },

    async getSimilarStories({ commit }) {
      try {
        const { data } = await axios.get(
          `http://159.203.137.163/api/stories/similar/${id}`
        );
        return data.data;
      } catch (error) {
        console.error("Error fetching similar stories:", error);
        throw error;
      }
    },

    async addNewStory({ commit }, storyData) {
      try {
        const token = Cookies.get("jwt"); // Get token from cookie jwt = jarwok timedoor
        if (!token) {
          throw new Error("Token is missing.");
        }

        const response = await axios.post(`http://159.203.137.163/api/story`, storyData, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token in Authorization header
          },
        });

        commit("setNewStory", response.data.data);
        return response.data;
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Unable to add story.";
        console.error("Failed to add story:", errorMsg);
        throw new Error(errorMsg);
      }
    },

    async getStoryDataUser({ commit }) {
      try {
        const token = Cookies.get("jwt");
    
        const { data } = await axios.get("http://159.203.137.163/api/story-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        console.log(data); // Pastikan API response benar
    
        commit("setStoryDataUser", data.data); // Ambil hanya array data
        return data.data;  // Pastikan return array saja
      } catch (err) {
        console.error("Error in Vuex Action:", err);
      }
    },
    
    async searchStories(_, { title }) {
      try {
        const response = await axios.get("http://159.203.137.163/api/story", {
          params: { story: title },
        });
        return response.data.data.data; // Sesuaikan dengan response dari backend
      } catch (error) {
        console.error("Error fetching searched stories:", error);
        return [];
      }
    },

  },
};
