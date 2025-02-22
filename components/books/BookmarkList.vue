<template>
  <div class="flex-shrink-0 max-w-sm bg-white overflow-hidden overflow-fix dark:bg-gray-800">
    <!-- Gambar Card -->
    <div class="relative">
      <div class="relative">
        <!-- Link ke halaman detail cerita berdasarkan story.id -->
        <NuxtLink :to="`/story/${story.id}`">
          <div :class="size === 'special' ? 'h-[700px]' : 'h-[350px]'" 
          class="rounded-t-md overflow-hidden">
            <!-- Menampilkan gambar cerita -->
            <img
              class="w-full h-full object-cover transition-all duration-300 ease-in-out hover:bg-white hover:opacity-55"
              :src="story.cover"
              :alt="story.title"
            />
          </div>
        </NuxtLink>

        <!-- Tombol bookmark -->
        <div
          class="absolute right-8 bottom-8 rounded-full flex items-center justify-center bg-gray-asparagus cursor-pointer"
          @click="toggleBookmark">
          <img 
            class="bookmark p-2 overflow-hidden transform transition duration-300 ease-in-out hover:-translate-y-1"
            :src="isBookmarked ? '/assets/images/before_bookmark.png' : '/assets/images/after_bookmark.png'"
            alt="Bookmark"
          >
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

        <!-- Informasi tambahan (penulis, tanggal, kategori) -->
        <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <div class="flex items-center space-x-2 flex-shrink-0">
            <img
              class="w-6 h-6 rounded-full"
              :src="story.author_image"
              :alt="story.author_name"
            />
            <span>{{ story.author_name }}</span>
          </div>

          <span class="flex-shrink-0">{{ formatDate(story.created_at) }}</span>

          <span class="category flex-shrink-0 px-2 py-1 text-xs font-medium rounded-md">
            {{ story.category }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import Cookies from "js-cookie";

// defineProps({
//   story: Object,
// });

// Mendefinisikan props yang diterima komponen (story)
const props = defineProps(["story"]);
const isBookmarked = ref(false);  // Variabel untuk melacak status bookmark
const bookmarks = ref([]);       // Daftar bookmark yang dimiliki user

// Fungsi untuk memformat tanggal agar sesuai dengan format Indonesia
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Fungsi untuk menangani aksi bookmark (menambah/menghapus bookmark)
async function toggleBookmark() {
  const token = Cookies.get("jwt");  // Mengambil token dari cookies untuk otentikasi
  if (!token) {
    alert("Silakan login untuk menggunakan fitur bookmark.");
    navigateTo("/login");
    return;  // Menghentikan eksekusi jika token tidak ada (belum login)
  }

  try {
    // Mengirim request untuk mengubah status bookmark (menambah/ menghapus)
    const response = await axios.post(
      "http://157.245.193.94/api/bookmark",
      { story_id: props.story.id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      isBookmarked.value = !isBookmarked.value;  // Toggle status bookmark
      await fetchBookmarks();  // Memperbarui daftar bookmark setelah perubahan
    }
  } catch (error) {
    console.error("Gagal mengubah bookmark:", error);  // Menangani error jika ada masalah
  }
};
</script>

<style scope>
/* Menambahkan efek pemangkasan teks setelah 3 baris */
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

/* Ukuran ikon bookmark */
.bookmark {
  width: 65px;
}
</style>
