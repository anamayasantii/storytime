<template>
  <div
    class="flex-shrink-0 w-full max-w-lg bg-white overflow-hidden overflow-fix dark:bg-gray-800">
    <!-- Gambar Card -->
    <div class="relative">
      <div class="relative">
        <NuxtLink :to="`/story/${story.id}`">
          <div :class="size === 'special' ? 'h-[700px]' : 'h-[350px]'" 
            class="rounded-t-md overflow-hidden">
        <img class="w-full h-full object-cover transition-all duration-300 ease-in-out hover:bg-white hover:opacity-55" 
        :src="story.cover" 
        :alt="story.title">
      </div>
        </NuxtLink>
        <div
          class="absolute right-8 bottom-8 rounded-full flex items-center justify-center bg-gray-asparagus">
          <NuxtLink :to="`/story/edit/${story.id}`">
            <img
              class="bookmark p-2 overflow-hidden transform transition duration-300 ease-in-out hover:-translate-y-1"
              src="@/assets/images/icon_edit.png"
              alt=""
            />
          </NuxtLink>
            <img 
            @click="toggleBookmark"
              class="bookmark p-2 overflow-hidden transform transition duration-300 ease-in-out hover:-translate-y-1"
              :src="isBookmarked ? '/assets/images/after_bookmark.png' : '/assets/images/before_bookmark.png'"
              alt="Bookmark"
          />
          <img
            class="bookmark p-2 overflow-hidden transform transition duration-300 ease-in-out hover:-translate-y-1 cursor-pointer"
            src="@/assets/images/icon_delete.png"
            alt=""
            @click="deleteStory(story.id)"
          />
        </div>
      </div>

      <!-- Konten Card -->
      <div>
        <!-- Judul -->
        <h5
          class="mb-2 text-xl font-bold text-left text-gray-800 dark:text-white">
          {{ story.title }}
        </h5>

        <!-- Cuplikan Cerita -->
        <p
          class="mb-4 text-sm text-gray-500 text-left dark:text-neutral-400 line-clamp-3">
          {{ story.content }}
        </p>

        <!-- Informasi Tambahan -->
        <div
          class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span
            class="category flex-shrink-0 px-2 py-1 text-xs font-medium rounded-md">
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
import { ref, onMounted } from "vue";

const props = defineProps(["story"]); // Ambil props dari defineProps()
const isBookmarked = ref(false);
const bookmarks = ref([]);

// defineProps({
//   story: Object,
// });

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const router = useRouter();

const deleteStory = async (id) => {
  const token = Cookies.get('jwt');
  try {
    const { data } = await axios.delete(`http://159.203.137.163/api/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (data?.status === 200) {
      alert('Story berhasil dihapus');

      // Filter storyList agar tidak memuat cerita yang sudah dihapus
      storyList.value = storyList.value.filter(story => story.id !== id);
    } else {
      alert('Gagal menghapus story');
    }
  } catch (err) {
    console.error('Error deleting story:', err);
    alert('Terjadi kesalahan saat menghapus story');
  }
};

// Ambil daftar bookmark saat halaman dimuat
onMounted(async () => {
  await fetchBookmarks();
});

async function fetchBookmarks() {
  const token = Cookies.get("jwt");
  if (!token) return;

  try {
    const response = await axios.get("http://159.203.137.163/api/bookmark-user", {
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

async function toggleBookmark() {
  const token = Cookies.get("jwt");
  if (!token) {
    alert("Silakan login untuk menggunakan fitur bookmark.");
    return;
  }

  try {
    const response = await axios.post(
      "http://159.203.137.163/api/bookmark",
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
};
</script>

<style scope>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.category {
  background-color: #f0f5ed;
  color: #466543;
}
.bookmark {
  width: 65px;
}
</style>
