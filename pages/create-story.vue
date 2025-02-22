<template>
  <div class="create-story-container p-2">
    <h1 class="text-3xl font-bold mb-6">Write Story</h1>

    <form @submit.prevent="addNewStory">
      <!-- Title -->
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
        <base-select v-model="storyData.category_id" :data="categoriesData">
          <template #placeholder>
            <span>Select a category</span>
          </template>
        </base-select>
      </div>

      <!-- Content -->
      <div class="mb-6">
        <!-- <base-input
          type="textarea"
          identity="storyContent"
          placeholder="Enter content here"
          label="Content"
          v-model="storyData.content"
        /> -->
        <client-only>
        <RichEditor :model-value="storyData.content" @update:modelValue="storyData.content = $event" />
      </client-only>
      </div>

      

      <!-- <client-only>
        <rich-editor v-model="content" />
      </client-only>
      <p v-if="errors.storyData.content" class="text-red-500 text-sm mt-1">{{ errors.storyData.content }}</p> -->

      <!-- Cover Upload (Hanya 1 gambar) -->
      <div class="cover-image mb-6">
        <base-input
          id="cover-image"
          type="file"
          label="Cover Story"
          accept="image/*"
          @change="handleCoverUpload"
        />
        <div v-if="storyData.coverPreview" class="mt-4 relative">
          <img
            :src="storyData.coverPreview"
            class="w-32 h-32 object-cover rounded-md shadow-md"
          />
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
        <div
          v-if="storyData.imagePreviews.length"
          class="mt-4 flex flex-wrap gap-4"
        >
          <div
            v-for="(image, index) in storyData.imagePreviews"
            :key="index"
            class="relative"
          >
            <img
              :src="image"
              class="w-32 h-32 object-cover rounded-md shadow-md"
            />
            <button
              type="button"
              @click="removeImage(index)"
              class="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded-full"
            >
              X
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4 mb-20">
        <NuxtLink to="profile">
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
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import Cookies from "js-cookie";
// import richEditor froym "~/components/rich-editor.vue";

const store = useStore(); // Mengakses store Vuex
const categoriesData = ref([]); // Menyimpan data kategori
const baseUrl = "http://157.245.193.94/api/";

// Data reaktif untuk form cerita
const storyData = reactive({
  title: "", // Judul cerita
  category_id: "", // ID kategori cerita
  content: "", // Konten cerita
  cover: null, // Gambar cover cerita
  coverPreview: "", // Preview gambar cover
  images: [], // Daftar gambar tambahan
  imagePreviews: [], // Preview gambar tambahan
});

// Mengambil data kategori dari store saat komponen dimuat
onMounted(async () => {
  try {
    const result = await store.dispatch("story/getCategoryData"); // Memanggil action di Vuex
    categoriesData.value = result; // Menyimpan data kategori
  } catch (error) {
    console.error(error);
  }
});

// Handle Upload Cover (Hanya 1 Gambar)
const handleCoverUpload = (event) => {
  const file = event.target.files[0]; // Mengambil file pertama yang diunggah
  if (file) {
    storyData.cover = file; // Menyimpan file cover
    storyData.coverPreview = URL.createObjectURL(file); // Menampilkan preview cover
  }
};

// Handle Upload Images (Multiple, Maks 3)
const handleImagesUpload = (event) => {
  const files = Array.from(event.target.files); // Mengubah FileList menjadi array
  if (files.length + storyData.images.length > 3) {
    alert("Maksimal 3 gambar untuk images!"); // Membatasi jumlah gambar maksimal 3
    return;
  }

  storyData.images.push(...files); // Menyimpan gambar yang diunggah
  storyData.imagePreviews.push(
    ...files.map((file) => URL.createObjectURL(file))
  ); // Menampilkan preview gambar
};

// Hapus Cover Image
const removeCover = () => {
  storyData.cover = null; // Menghapus file cover
  storyData.coverPreview = ""; // Menghapus preview cover
};

// Hapus Story Image berdasarkan index
const removeImage = (index) => {
  storyData.imagePreviews.splice(index, 1); // Menghapus preview gambar
  storyData.images.splice(index, 1); // Menghapus gambar dari daftar upload
};

// Upload file ke API backend
const upImage = async (files, token) => {
  const formData = new FormData(); // Membuat objek FormData
  files.forEach((file) => formData.append("files[]", file)); // Menambahkan file ke FormData

  try {
    const { data } = await axios.post(baseUrl + "upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`, // Mengirim token otentikasi
        "Content-Type": "multipart/form-data", // Header untuk upload file
      },
    });

    if (data?.status === 200) {
      if (Array.isArray(data.data)) {
        return data.data; // Jika API mengembalikan array langsung
      } else if (typeof data.data === "string") {
        return [data.data]; // Jika API hanya mengembalikan satu URL
      } else if (data.data.urls) {
        return data.data.urls; // Jika API mengembalikan { urls: [...] }
      }
    }

    alert("Upload gagal, coba lagi!"); // Jika upload gagal
    return [];
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("Terjadi kesalahan saat upload file!");
    return [];
  }
};

// Submit Form untuk membuat cerita baru
const addNewStory = async () => {
  try {
    const token = Cookies.get("jwt"); // Mengambil token JWT dari cookies
    let coverUrl = ""; // URL cover yang diunggah
    let imageUrls = []; // URL gambar tambahan yang diunggah

    if (token) {
      // Upload Cover (Jika ada)
      if (storyData.cover) {
        const uploadedCover = await upImage([storyData.cover], token);
        coverUrl = uploadedCover.length ? uploadedCover[0] : "";
      }

      // Upload Images (Jika ada)
      if (storyData.images.length > 0) {
        imageUrls = await upImage(storyData.images, token);
      }
    }

    // Payload Data untuk dikirim ke backend
    const payload = {
      title: storyData.title,
      category_id: storyData.category_id,
      content: storyData.content,
      cover: coverUrl || null, // URL cover
      images: imageUrls.length > 0 ? imageUrls : [], // URL gambar tambahan
    };

    // Kirim Data ke Backend
    const { data } = await axios.post(baseUrl + "story", payload, {
      headers: {
        Authorization: `Bearer ${token}`, // Mengirim token otentikasi
      },
    });

    if (data?.success) {
      alert("Berhasil membuat story"); // Notifikasi sukses
      navigateTo("/profile"); // Navigasi ke halaman profil
    } else {
      alert("Gagal membuat story"); // Notifikasi gagal
    }
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
.cover-image img,
.story-images img {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 5px;
  width: 100px;
  height: 100px;
  object-fit: cover;
}
button {
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
</style>
