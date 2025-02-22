<template>
  <div class="flex-shrink-0 w-full max-w-lg bg-white overflow-hidden overflow-fix dark:bg-gray-800">
    <!-- Gambar Card -->
    <div class="relative">
      <div class="relative">
        <!-- Link ke halaman detail cerita berdasarkan story.id -->
        <NuxtLink :to="`/story/${story.id}`">
          <div :class="size === 'special' ? 'h-[700px]' : 'h-[350px]'" class="rounded-t-md overflow-hidden">
            <!-- Menampilkan gambar cerita -->
            <img class="w-full h-full object-cover transition-all duration-300 ease-in-out hover:bg-white hover:opacity-55" 
                 :src="story.cover" 
                 :alt="story.title">
          </div>
        </NuxtLink>

        <!-- Tombol edit, bookmark, dan delete -->
        <div class="absolute right-8 bottom-8 rounded-full flex items-center justify-center bg-gray-asparagus">
          <!-- Tombol Edit (Menuju halaman edit cerita) -->
          <NuxtLink :to="`/story/edit/${story.id}`">
            <img class="bookmark p-2 overflow-hidden transform transition duration-300 ease-in-out hover:-translate-y-1"
                 src="@/assets/images/icon_edit.png" alt="Edit"/>
          </NuxtLink>

          <!-- Tombol Bookmark, toggle antara bookmarked dan tidak -->
          <img @click="toggleBookmark"
               class="bookmark p-2 overflow-hidden transform transition duration-300 ease-in-out hover:-translate-y-1"
               :src="isBookmarked ? '/assets/images/after_bookmark.png' : '/assets/images/before_bookmark.png'"
               alt="Bookmark"/>

          <!-- Tombol Hapus Cerita -->
          <img class="bookmark p-2 overflow-hidden transform transition duration-300 ease-in-out hover:-translate-y-1 cursor-pointer"
               src="@/assets/images/icon_delete.png" alt="Delete"
               @click="deleteStory(story.id)"/>
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

        <!-- Informasi tambahan (kategori cerita dan tanggal dibuat) -->
        <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span class="category flex-shrink-0 px-2 py-1 text-xs font-medium rounded-md">
            {{ story.category }}
          </span>

          <span class="flex-shrink-0">{{ formatDate(story.created_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';
import { ref, onMounted, defineEmits } from "vue";

// defineProps({
//   story: Object,
// });

// Mendefinisikan props yang diterima komponen (story)
const props = defineProps(["story"]);
const emit = defineEmits(["storyDeleted"]); // Emit event 'storyDeleted' untuk memberitahu parent
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
}

const router = useRouter();

// Fungsi untuk menghapus cerita
const deleteStory = async (id) => {
  const token = Cookies.get('jwt');  // Mengambil token dari cookies untuk otentikasi
  try {
    const { data } = await axios.delete(baseUrl + `stories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Mengirim token sebagai header Authorization
      },
    });

    if (data?.status === 200) {
      alert('Story berhasil dihapus'); // Menampilkan pesan sukses jika penghapusan berhasil
      
      // Emit event ke parent agar bisa menghapus story dari daftar tampilan
      emit("storyDeleted", id);
    } else {
      alert('Gagal menghapus story'); // Menampilkan pesan jika penghapusan gagal
    }
  } catch (err) {
    console.error('Error deleting story:', err); // Menampilkan error di console jika terjadi kesalahan
    alert('Terjadi kesalahan saat menghapus story'); // Menampilkan pesan kesalahan kepada pengguna
  }
};

// Ambil daftar bookmark saat halaman dimuat
onMounted(async () => {
  await fetchBookmarks();
});

// Fungsi untuk mengambil daftar bookmark milik pengguna
async function fetchBookmarks() {
  const token = Cookies.get("jwt"); // Mengambil token JWT dari cookies untuk otentikasi
  if (!token) return; // Jika token tidak ada, hentikan eksekusi fungsi

  try {
    const response = await axios.get(baseUrl + 'bookmark-user', {
      headers: { Authorization: `Bearer ${token}` } // Mengirim token sebagai header Authorization
    });

    // Simpan data bookmark ke dalam variabel
    bookmarks.value = response.data.data.data || []; // Jika tidak ada data, gunakan array kosong

    // Cek apakah story saat ini sudah ada di daftar bookmark pengguna
    isBookmarked.value = bookmarks.value.some((bookmark) => bookmark.story.id === props.story.id);
  } catch (error) {
    console.error("Gagal mengambil daftar bookmark:", error); // Menampilkan pesan error jika permintaan gagal
  }
};

// Fungsi untuk toggle status bookmark
async function toggleBookmark() {
  const token = Cookies.get("jwt"); // Mengambil token JWT dari cookies untuk otentikasi
  if (!token) {
    alert("Silakan login untuk menggunakan fitur bookmark."); // Jika token tidak ada, tampilkan pesan peringatan
    navigateTo("/login");
    return; 
  }

  try {
    const response = await axios.post(
      baseUrl + 'bookmark', // Endpoint API untuk menambah/hapus bookmark
      { story_id: props.story.id }, // Mengirim ID story yang ingin di-bookmark atau dihapus dari bookmark
      { headers: { Authorization: `Bearer ${token}` } } // Mengirim token sebagai header Authorization
    );

    if (response.data.success) {
      isBookmarked.value = !isBookmarked.value; // Toggle status bookmark

      // Perbarui daftar bookmark setelah perubahan
      await fetchBookmarks();
    }
  } catch (error) {
    console.error("Gagal mengubah bookmark:", error); // Menampilkan pesan error jika gagal mengubah bookmark
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
