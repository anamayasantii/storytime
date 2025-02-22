<template>
  <div class="create-story-container p-2">
    <h1 class="text-3xl font-bold mb-6">Edit Story</h1>

    <form @submit.prevent="updateStory">
      <!-- Title -->
      <base-input
        v-model="storyData.title"
        placeholder="Enter a story title"
        label="Story Title"
      />

      <div>
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

      <div>
        <!-- <base-input
          type="textarea"
          v-model="storyData.content"
          placeholder="Enter a story content"
          label="Story Content"
        /> -->

        <client-only>
        <RichEditor :model-value="storyData.content" @update:modelValue="storyData.content = $event" />
      </client-only>
      </div>

      <!-- Cover Upload -->
      <div class="cover-image mb-6">
        <base-input
          id="cover-image"
          type="file"
          label="Cover Story"
          accept="image/*"
          @change="handleCoverUpload"
        />
        <div v-if="storyData.coverPreview" class="mt-4 relative">
          <img :src="storyData.coverPreview" class="w-32 h-32 object-cover rounded-md shadow-md" />
        </div>
      </div>

      <!-- Images Upload (Multiple, Maks 3) -->
      <div class="story-images mb-6">
        <base-input
          id="story-images"
          type="file"
          label="Story Images (Max 3)"
          accept="image/*"
          multiple
          @change="handleImagesUpload"
        />
        <div v-if="storyData.imagePreviews.length" class="mt-4 flex flex-wrap gap-4">
          <div v-for="(image, index) in storyData.imagePreviews" :key="index" class="relative">
            <img :src="image" class="w-32 h-32 object-cover rounded-md shadow-md" />
            <button type="button" @click="removeImage(index)" class="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded-full">X</button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4">
        <NuxtLink to="/profile">
          <button class="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
            Cancel
          </button>
        </NuxtLink>
        <button
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          type="submit"
        >
          Update Story
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import Cookies from "js-cookie";

const store = useStore();
const route = useRoute();
const router = useRouter();
const baseUrl = "http://157.245.193.94/api/"

const storyId = route.params.id; 
const categoriesData = ref([]);
const storyData = reactive({
  title: "",
  category_id: "",
  content: "",
  cover: null,
  coverPreview: "",
  images: [],
  imagePreviews: [],
});

onMounted(async () => {
  try {
    const result = await store.dispatch("story/getCategoryData");
    categoriesData.value = result;

    const token = Cookies.get("jwt");
    const { data } = await axios.get(
      baseUrl +  `story/${storyId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (data?.status === 200) {
      storyData.title = data.data.title;
      storyData.category_id = data.data.category_id;
      storyData.content = data.data.content;
      storyData.coverPreview = data.data.cover || "";
      storyData.imagePreviews = data.data.images.slice(0, 3) || [];
    }
  } catch (error) {
    console.error("Error loading story data:", error);
  }
});

const handleCoverUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    storyData.cover = file;
    storyData.coverPreview = URL.createObjectURL(file);
  }
};

const removeCover = () => {
  storyData.cover = null;
  storyData.coverPreview = "";
};

const handleImagesUpload = (event) => {
  const files = Array.from(event.target.files);
  if (files.length + storyData.imagePreviews.length > 3) {
    alert("Maksimal 3 gambar untuk images!");
    return;
  }

  const newImages = files.slice(0, 3 - storyData.imagePreviews.length);
  storyData.images = [...storyData.images, ...newImages];
  storyData.imagePreviews = [...storyData.imagePreviews, ...newImages.map(file => URL.createObjectURL(file))];
};

const removeImage = (index) => {
  storyData.imagePreviews.splice(index, 1);
  storyData.images.splice(index, 1);
};


const updateStory = async () => {
  try {
    const token = Cookies.get("jwt");
    let coverUrl = storyData.coverPreview;
    let imageUrls = storyData.imagePreviews.filter(url => url.startsWith("http"));

    // Upload cover jika ada perubahan
    if (storyData.cover) {
      const uploadedCover = await upImage([storyData.cover], token);
      coverUrl = uploadedCover.length ? uploadedCover[0] : coverUrl;
    }

    // Upload multiple images
    if (storyData.images.length > 0) {
      const uploadedImages = await upImage(storyData.images, token);
      imageUrls = [...imageUrls, ...uploadedImages].slice(0, 3);
    }

    const payload = {
      title: storyData.title,
      category_id: storyData.category_id,
      content: storyData.content,
      cover: coverUrl,
      images: imageUrls.length > 0 ? imageUrls : [],
    };

    const { data } = await axios.put(
      baseUrl + `story/${storyId}`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (data?.status === 200) {
      alert("Berhasil memperbarui story!");
      router.push("/profile");
    } else {
      alert("Gagal memperbarui story");
    }
  } catch (err) {
    console.error("Error updating story:", err.response?.data || err.message);
  }
};

// Fungsi upload gambar ke API
const upImage = async (files, token) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files[]", file));

  try {
    const { data } = await axios.post(baseUrl + "upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    // Menangani berbagai kemungkinan format respons dari API
    if (data?.status === 200) {
      if (Array.isArray(data.data)) {
        return data.data; // Jika API mengembalikan array langsung
      } else if (typeof data.data === "string") {
        return [data.data]; // Jika API hanya mengembalikan satu URL sebagai string
      } else if (data.data?.urls) {
        return data.data.urls; // Jika API mengembalikan objek dengan properti `urls`
      }
    }

    return []; // Jika respons tidak sesuai harapan, kembalikan array kosong
  } catch (err) {
    console.error("Error uploading images:", err.response?.data || err.message);
    return [];
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
.cover-image img {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 5px;
}
</style>
