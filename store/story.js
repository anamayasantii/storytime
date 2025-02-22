import axios from "axios";
import Cookies from "js-cookie"; // Mengimpor js-cookie untuk mengambil token JWT dari cookie

const baseUrl = "http://157.245.193.94/api/";

export default {
  namespaced: true, // Menggunakan namespace agar module Vuex ini bisa diakses dengan nama unik
  state() {
    return {
      stories: [], // Menyimpan daftar cerita
      categories: [], // Menyimpan daftar kategori cerita
    };
  },

  getters: {}, // Getters bisa ditambahkan di sini jika diperlukan

  mutations: {
    // Menyimpan data cerita ke state
    setStoryData(state, payload) {
      state.stories = payload;
    },

    // Menyimpan data cerita berdasarkan kategori ke state
    setStoryByCategory(state, stories) {
      state.stories = stories;
    },

    // Menyimpan data kategori ke state
    setCategoryData(state, payload) {
      state.categories = payload;
    },

    // Menambahkan cerita baru ke dalam state tanpa harus melakukan fetch ulang
    setNewStory(state, payload) {
      state.stories.push(payload);
    },

    // Menyimpan data cerita milik user yang sedang login ke state
    setStoryDataUser(state, stories) {
      state.stories = stories;
    },
  },

  actions: {
    // Mengambil semua cerita terbaru dari API
    async getStoryData({ commit }) {
      try {
        const { data } = await axios.get(baseUrl + 'stories/newest');
        commit("setStoryData", data.data); // Menyimpan data cerita ke state
        return data.data; // Mengembalikan data agar bisa digunakan di komponen
      } catch (err) {
        console.error("Error fetching story data:", err);
      }
    },

    // Mengambil cerita berdasarkan kategori tertentu
    async getStoryByCategory({ commit }) {
      try {
        const { data } = await axios.get(baseUrl + 'category-story');
        commit('setStoryByCategory', data.data); // Menyimpan data cerita berdasarkan kategori ke state
        console.log(data.data, " ---- Data cerita berdasarkan kategori berhasil diambil");
        return data.data;
      } catch (error) {
        console.error("Error fetching stories by category:", error);
      }
    },

    // Mengambil daftar kategori cerita dari API
    async getCategoryData({ commit }) {
      try {
        const { data } = await axios.get(baseUrl + 'category');
        commit("setCategoryData", data.data); // Menyimpan daftar kategori ke state
        return data.data;
      } catch (err) {
        console.error("Error fetching category data:", err);
      }
    },

    // Mengambil cerita yang mirip dengan cerita yang sedang dibuka
    async getSimilarStories({ commit }) {
      try {
        const { data } = await axios.get(baseUrl + `stories/similar/${id}`);
        return data.data;
      } catch (error) {
        console.error("Error fetching similar stories:", error);
        throw error;
      }
    },

    // Menambahkan cerita baru ke database melalui API
    async addNewStory({ commit }, storyData) {
      try {
        const token = Cookies.get("jwt"); // Mengambil token JWT dari cookie
        if (!token) {
          throw new Error("Token is missing.");
        }

        // Mengirimkan data cerita baru ke API dengan token di header Authorization
        const response = await axios.post(baseUrl + 'story', storyData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        commit("setNewStory", response.data.data); // Menyimpan cerita baru ke state tanpa fetch ulang
        return response.data; // Mengembalikan data response dari server
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Unable to add story.";
        console.error("Failed to add story:", errorMsg);
        throw new Error(errorMsg);
      }
    },

    // Mengambil daftar cerita yang dibuat oleh user yang sedang login
    async getStoryDataUser({ commit }) {
      try {
        const token = Cookies.get("jwt"); // Mengambil token JWT dari cookie

        const { data } = await axios.get(baseUrl + 'story-user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(data); // Debugging untuk memastikan data yang diterima benar

        commit("setStoryDataUser", data.data); // Menyimpan data cerita user ke state
        return data.data;  // Mengembalikan data cerita user agar bisa digunakan di komponen
      } catch (err) {
        console.error("Error fetching user story data:", err);
      }
    },

    // Mencari cerita berdasarkan judul yang diketik oleh user
    async searchStories(_, { title }) {
      try {
        const response = await axios.get(baseUrl + 'story', {
          params: { story: title }, // Mengirimkan parameter pencarian ke API
        });
        return response.data.data.data; // Mengembalikan hasil pencarian
      } catch (error) {
        console.error("Error fetching searched stories:", error);
        return [];
      }
    },

    // Mengambil daftar cerita populer berdasarkan jumlah pembaca atau rating
    async getPopularStories({ commit }) {
      try {
        const { data } = await axios.get(baseUrl + 'stories/popular');
        return data.data.data; // Mengembalikan daftar cerita populer
      } catch (error) {
        console.error("Error fetching popular stories:", error);
        return [];
      }
    },
  },
};
