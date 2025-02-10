<template>
  <div class="create-story-container p-2">
    <h1 class="text-3xl font-bold mb-6">Write Story</h1>

    <form @submit.prevent="addNewStory">
      <!-- Title base-input -->
      <div class="mb-4">
        <base-input
          type="text"
          identity="storyTitle"
          placeholder="Enter a story title"
          v-model="storyData.title"
          label="Story Title"
        />
      </div>

      <!-- Category Dropdown -->
      <div class="mb-4">
        <base-select
          v-model="storyData.category_id"
          :data="categoriesData"
          class="w-full border border-gray-300 rounded-md p-3 text-base focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          <template #placeholder>
            <span>Select a category</span>
          </template>
        </base-select>
      </div>

      <!-- Content Text Editor -->
      <div class="mb-6">
        <div id="content">
          <base-input
            type="textarea"
            identity="storyContent"
            placeholder="Enter content here"
            label="Content"
            v-model="storyData.content"
          />
        </div>
      </div>

      <!-- Cover Image Upload -->
<!-- Cover Image Upload -->
<div class="cover-image mb-10">
  <base-input
    id="cover-image"
    type="file"
    class="custom-file-input"
    label="Cover Story"
    multiple
    @change="handleImageUpload"
  ></base-input>

  <!-- Tampilkan semua gambar sebagai preview -->
  <div v-if="storyData.coverPreviews?.length > 0" class="mt-4 flex flex-wrap gap-4">
    <img
      v-for="(image, index) in storyData.coverPreviews"
      :key="index"
      :src="image"
      class="w-32 h-32 object-cover rounded-md shadow-md"
    />
  </div>
</div>



      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4 mb-20">
        <NuxtLink to="ProfilePage">
          <button
            class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </NuxtLink>
        <button
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          type="submit"
        >
          Post Story
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import axios from "axios";

import Cookies from "js-cookie";

const store = useStore();
const selectedCategory = ref(""); // Default value is empty (no category selected)
const categoriesData = ref([]); // Initialize categories data as a ref

const storyData = reactive({
  title: "",
  category_id: "",
  content: "",
  cover: null,
});

onMounted(async () => {
  try {
    const result = await store.dispatch("story/getCategoryData");
    categoriesData.value = result; // Populate the categoriesData
    console.log(categoriesData.value, "DATA KATEGORI");
  } catch (error) {
    console.error(error);
  }
});

// const handleImageUpload = (event) => {
//   const file = event.target.files[0];
//   storyData.cover = file ?? [];
// };

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files); // Ambil semua file baru

  if (!storyData.cover) {
    storyData.cover = [];
    storyData.coverPreviews = [];
  }

  // Gabungkan gambar lama dengan yang baru
  storyData.cover.push(...files);

  // Tambahkan preview baru
  const newPreviews = files.map((file) => URL.createObjectURL(file));
  storyData.coverPreviews.push(...newPreviews);
};

const upImage = async (files, token) => {
  const formData = new FormData();

  try {
    files.forEach((file) => {
      formData.append("files[]", file); // Tambahkan semua file
    });

    const { data } = await axios.post(
      "http://159.203.137.163/api/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data?.status === 200 ? data.data : null;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

const addNewStory = async () => {
  try {
    const token = Cookies.get("jwt");
    let urls = [];

    if (token && storyData.cover.length > 0) {
      urls = await upImage(storyData.cover, token);
    }

    const findFirstImage = urls[0] ?? '';

    const payload = {
      title: storyData.title,
      category_id: storyData.category_id,
      content: storyData.content,
      cover: urls.length > 0 ? findFirstImage : "", // Cover utama
      images: urls?.filter((image) => image !== findFirstImage), // Semua gambar
    };

    const { data } = await axios.post(
      "http://159.203.137.163/api/story",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data?.status === 201) {
      alert("Berhasil membuat story");
      navigateTo("/ProfilePage");
      return;
    }

    alert("Gagal membuat story");
  } catch (err) {
    console.error("Error:", err);
  }
};

</script>

<style scoped>
.create-story-container {
  width: 90%;
  margin: 0 auto;
  background-color: white;
}
button {
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
.toolbar button {
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
}
.toolbar button:hover {
  background-color: #f0f0f0;
}
.cover-image img {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 5px;
  max-width: 20%;
  height: auto;
}
</style>
