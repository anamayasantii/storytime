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
        <base-input
          type="textarea"
          v-model="storyData.content"
          placeholder="Enter a story content"
          label="Story Content"
        />
      </div>

      <!-- Cover Image -->
      <div class="cover-image mb-10">
        <base-input
          type="file"
          label="Cover Story"
          multiple
          @change="handleImageUpload"
        />
        
        <!-- Preview existing and new images -->
        <div v-if="storyData.coverPreviews?.length > 0" class="mt-4 flex flex-wrap gap-4">
          <div v-for="(image, index) in storyData.coverPreviews" :key="index" class="relative">
            <img
              :src="image"
              class="w-32 h-32 object-cover rounded-md shadow-md"
            />
            <button @click="removeImage(index)" class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">❌</button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4">
        <NuxtLink to="/ProfilePage">
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

const storyId = route.params.id; // Ambil storyId dari route
const categoriesData = ref([]);
const storyData = reactive({
  title: "",
  category_id: "",
  content: "",
  cover: [], // Cover baru yang akan diunggah
  coverPreviews: [], // Preview gambar baru
  deletedImages: [], // Menyimpan gambar yang ingin dihapus
});

onMounted(async () => {
  try {
    // Ambil kategori
    const result = await store.dispatch("story/getCategoryData");
    categoriesData.value = result;

    // Ambil data cerita berdasarkan storyId
    const token = Cookies.get("jwt");
    const { data } = await axios.get(
      `http://159.203.137.163/api/story/${storyId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (data?.status === 200) {
      storyData.title = data.data.title;
      storyData.category_id = data.data.category_id;
      storyData.content = data.data.content;
      storyData.coverPreviews = data.data.images || []; // Simpan URL cover yang sudah ada
    }
  } catch (error) {
    console.error("Error loading story data:", error);
  }
});

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files);
  if (!storyData.cover) {
    storyData.cover = [];
    storyData.coverPreviews = [];
  }

  storyData.cover.push(...files);
  const newPreviews = files.map((file) => URL.createObjectURL(file));
  storyData.coverPreviews.push(...newPreviews);
};

const removeImage = (index) => {
  const imageToRemove = storyData.coverPreviews[index];

  if (imageToRemove.startsWith("http")) {
    // Hanya tandai gambar lama sebagai dihapus agar tidak dikirim saat update
    storyData.deletedImages.push(imageToRemove);
  } else {
    // Jika gambar baru, hapus dari daftar cover
    const fileIndex = storyData.cover.findIndex(file =>
      URL.createObjectURL(file) === imageToRemove
    );
    if (fileIndex !== -1) {
      storyData.cover.splice(fileIndex, 1);
    }
  }

  // Hapus dari preview tampilan
  storyData.coverPreviews.splice(index, 1);
};

const upImage = async (files, token) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files[]", file);
  });

  try {
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
    return null;
  }
};

const updateStory = async () => {
  try {
    const token = Cookies.get("jwt");

    // Filter hanya gambar yang tidak dihapus
    let urls = storyData.coverPreviews.filter(
      (url) => url.startsWith("http") && !storyData.deletedImages.includes(url)
    );

    if (storyData.cover.length > 0) {
      const uploadedUrls = await upImage(storyData.cover, token);
      urls = [...urls, ...uploadedUrls];
    }

    const payload = {
      title: storyData.title,
      category_id: storyData.category_id,
      content: storyData.content,
      images: urls, // Hanya gambar yang tersisa setelah dihapus
    };

    const { data } = await axios.put(
      `http://159.203.137.163/api/story/${storyId}`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (data?.status === 200) {
      alert("Berhasil memperbarui story!");
      router.push("/ProfilePage");
    } else {
      alert("Gagal memperbarui story");
    }
  } catch (err) {
    console.error("Error updating story:", err.response?.data || err.message);
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
