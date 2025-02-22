<template>
  <div v-if="story && story.id" class="flex-shrink-0 max-w-sm bg-white overflow-hidden overflow-fix dark:bg-gray-800">
    <!-- Gambar Card -->
    <div class="relative">
      <NuxtLink :to="`/story/${story.id}`">
        <div :class="size === 'special' ? 'h-[700px]' : 'h-[350px]'" class="rounded-t-md overflow-hidden">
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
      <!-- Judul Cerita -->
      <h5 class="mb-2 text-xl font-bold text-left text-gray-800 dark:text-white">
        {{ story.title }}
      </h5>

      <!-- Cuplikan Cerita -->
      <div class="mb-4 text-sm text-gray-500 text-left dark:text-neutral-400 line-clamp-3" v-html="story.content"></div>

      <!-- Informasi Tambahan -->
      <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <!-- Author -->
        <div class="flex items-center space-x-2 flex-shrink-0">
          <img class="w-6 h-6 rounded-full" :src="story.author_image" :alt="story.author_name">
          <span>{{ story.author_name }}</span>
        </div>

        <!-- Tanggal -->
        <span class="flex-shrink-0">{{ formatDate(story.created_at) }}</span>

        <!-- Kategori Cerita -->
        <span class="category flex-shrink-0 px-2 py-1 text-xs font-medium rounded-md">
          {{ story.category }}  
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Cookies from "js-cookie";

const props = defineProps(["story"]); // Mengambil props dari parent component
const isBookmarked = ref(false);
const bookmarks = ref([]);
const baseUrl = "http://157.245.193.94/api/"

// Ambil daftar bookmark saat halaman dimuat
onMounted(async () => {
  await fetchBookmarks();
});

// Fungsi untuk mengambil daftar bookmark milik pengguna
async function fetchBookmarks() {
  const token = Cookies.get("jwt");
  if (!token) return;

  try {
    const response = await axios.get(baseUrl + "bookmark-user", {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Simpan data bookmark ke dalam variabel
    bookmarks.value = response.data.data.data || [];

    // Cek apakah cerita ini sudah dibookmark
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
      baseUrl + "bookmark",
      { story_id: props.story.id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      isBookmarked.value = !isBookmarked.value;

      // Perbarui daftar bookmark setelah perubahan
      await fetchBookmarks();
    }
  } catch (error) {
    console.error("Gagal mengubah bookmark:", error);
  }
}

// Fungsi untuk memformat tanggal ke dalam format Indonesia
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
</script>

<style scoped>
/* Gaya untuk membatasi cuplikan cerita menjadi 3 baris */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Gaya kategori cerita */
.category {
  background-color: #f0f5ed;
  color: #466543;
}

/* Ukuran gambar bookmark */
.bookmark {
  width: 65px;
}
</style>
