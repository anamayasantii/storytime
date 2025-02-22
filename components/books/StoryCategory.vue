<template>
  <div class="bg-white overflow-hidden overflow-fix dark:bg-gray-800">
    <!-- Gambar Card -->
    <div class="relative">
      <!-- Link ke halaman detail cerita berdasarkan story.id -->
      <NuxtLink :to="`/story/${story.id}`">
        <div :class="size === 'special' ? 'w-[800px]' : 'h-[350px] w-full'" class="rounded-t-md overflow-hidden">
          <!-- Menampilkan gambar cerita -->
          <img class="w-full h-full object-cover transition-all duration-300 ease-in-out hover:bg-white hover:opacity-55" 
               :src="story.cover" 
               :alt="story.title">
        </div>
      </NuxtLink>

      <!-- Tombol Bookmark -->
      <div class="absolute right-8 bottom-8 rounded-full flex items-center justify-center bg-gray-asparagus cursor-pointer"
           @click="toggleBookmark">
        <img class="bookmark p-2 overflow-hidden transform transition duration-300 ease-in-out hover:-translate-y-1"
             :src="isBookmarked ? '/assets/images/after_bookmark.png' : '/assets/images/before_bookmark.png'"
             alt="Bookmark">
      </div>
    </div>

    <!-- Konten Card -->
    <div>
      <!-- Judul cerita -->
      <h5 class="mb-2 text-xl font-bold text-left text-gray-800 dark:text-white">
        {{ story.title }}
      </h5>

      <!-- Cuplikan cerita (3 baris pertama) -->
      <p class="mb-4 text-sm text-gray-500 text-left dark:text-neutral-400 line-clamp-3">
        {{ story.content }}
      </p>

      <!-- Informasi tambahan (penulis dan tanggal dibuat) -->
      <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <!-- Author -->
        <div class="flex items-center space-x-2">
          <img class="w-6 h-6 rounded-full" :src="story.author_image" :alt="story.author_name">
          <span>{{ story.author_name }}</span>
        </div>

        <!-- Tanggal -->
        <span>{{ formatDate(story.created_at) }}</span>

        <!-- Genre (dihilangkan dalam kode ini) -->
        <!-- <span class="category px-2 py-1 text-xs font-medium rounded-md">
          {{ story.category_name }}
        </span> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Cookies from "js-cookie";

// Mendeklarasikan props yang diterima komponen (story, size)
const props = defineProps(["story", "size"]);
const isBookmarked = ref(false);  // Variabel untuk melacak status bookmark
const bookmarks = ref([]);       // Daftar bookmark yang dimiliki user
const baseUrl = "http://157.245.193.94/api/"

// Fungsi untuk memformat tanggal agar sesuai dengan format Indonesia
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Ambil daftar bookmark saat halaman dimuat
onMounted(async () => {
  await fetchBookmarks();
});

// Fungsi untuk mengambil daftar bookmark milik user
async function fetchBookmarks() {
  const token = Cookies.get("jwt");
  if (!token) return;

  try {
    const response = await axios.get(baseUrl + 'bookmark-user', {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Simpan data bookmark ke variabel
    bookmarks.value = response.data.data.data || [];

    // Cek apakah story ini sudah di-bookmark
    isBookmarked.value = bookmarks.value.some((bookmark) => bookmark.story.id === props.story.id);
  } catch (error) {
    console.error("Gagal mengambil daftar bookmark:", error);
  }
}

// Fungsi untuk toggle status bookmark
async function toggleBookmark() {
  const token = Cookies.get("jwt");
  if (!token) {
    alert("Silakan login untuk menggunakan fitur bookmark.");
    navigateTo("/login");
    return;
  }

  try {
    const response = await axios.post(
      baseUrl + 'bookmark',
      { story_id: props.story.id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      isBookmarked.value = !isBookmarked.value;  // Toggle status bookmark

      // Perbarui daftar bookmark setelah perubahan
      await fetchBookmarks();
    }
  } catch (error) {
    console.error("Gagal mengubah bookmark:", error);
  }
};
</script>

<style>
/* Gaya kategori cerita */
.category {
  background-color: #f0f5ed;
  color: #466543;
}

/* Ukuran ikon bookmark */
.bookmark {
  width: 65px;
}
</style>
