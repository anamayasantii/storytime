<template>
  <div class="flex flex-col items-center justify-center mt-7 text-center">
    <div v-if="isLoggedIn">
      <h1 class="font-playFair text-xl font-bold">Hi, {{ userData.username }}</h1>
    </div>
    <h1 class="text-4xl font-playFair mb-5 font-bold">Welcome to Storytime</h1>
    <p class="mb-6 w-3/4 md:w-7/10 font-playFair">
      The world's most-loved social storytelling platform. Storytime connects a
      global community of 90 million readers and writers through the power of
      story.
    </p>
    <div class="search-bar flex items-center w-1/2 border border-gray-300 rounded-lg p-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search story"
        class="flex-1 border-none outline-none p-2"
        @keyup.enter="searchStories"
      />
      <IconSearch class="text-gray-400 cursor-pointer" @click="searchStories" />
    </div>
    <img
      src="@/assets/images/image 14.svg"
      alt="Logo"
      class="mt-10 w-1/2 max-w-xl"/>

    <div class="w-full max-w-screen-xl mx-auto">
      <!-- Latest Story Section -->
      <div
        class="ml-20 mr-20 flex justify-between items-center border-b border-gray-300 py-4">
        <h2 class="text-2xl font-serif font-bold">Latest Story</h2>
        <NuxtLink
          to="stories"
          class="text-gray-600 hover:text-black flex items-center">
          Explore More →
        </NuxtLink>
      </div>

      <!-- Book List Section -->  
      <div class="overflow-x-scroll scrollbar-hide flex gap-6 mt-10 px-20">
        <!-- Card list di-loop di dalam container -->
        <div v-for="story in storyList.slice(0,5)" :key="story.id" class="shrink-0">
          <BookList :story="story" />
        </div>
      </div>

    </div>

    <div class="w-full max-w-screen-xl mx-auto mt-20">
      <!-- Kategori Story Section -->
      <div v-for="category in categories" :key="category?.category_name" class="mt-20">
        <!-- Header kategori -->
        <div
          class="ml-20 mr-20 flex justify-between items-center border-b border-gray-300 py-4">
          <h2 class="text-2xl font-serif font-bold">
            {{ category?.category_name ?? "-" }}
          </h2>
          <NuxtLink
            :to="{ name: 'stories', query: { category: category.category_name } }"
            class="text-gray-600 hover:text-black flex items-center">
            Explore More →
          </NuxtLink>
        </div>

        <!-- Kondisi Layout Berdasarkan Kategori -->
        <!-- Layout Kedua untuk Romance dan Comedy -->
        <div
          v-if="category.category_name === 'Romance' || category.category_name === 'Comedy'"
          class="container mx-auto px-20 grid grid-cols-3 gap-4 mt-5"
        >
          <!-- Grid Pertama dan Kedua (Merged) -->
          <div class="col-span-2 rounded-lg">
            <div v-for="(story, index) in category.stories.slice(0, 1)" :key="index">
              <BookCategory :story="story" :size="'special'" />
            </div>
          </div>

          <!-- Grid Ketiga (2 Cards Vertikal) -->
          <div class="grid grid-rows-2 gap-4">
            <div v-for="(story, index) in category.stories.slice(1, 3)" :key="index" class="rounded-lg">
              <BookCategory :story="story" />
            </div>
          </div>
        </div>

        <!-- Layout Pertama untuk Horror -->
        <div 
          v-else-if="category.category_name === 'Horror'" 
          class="flex gap-6 mt-10 ml-20 mr-20 justify-between"
        >
          <div v-for="story in category.stories" :key="story.id">
            <BookCategory :story="story" />
          </div>
        </div>
      </div>
    </div>

    <div class="w-full max-w-screen-xl mx-auto text-left">
      <div class="w-full max-w-screen-xl mx-auto text-left">
        <!-- Header Section -->
        <div class="ml-20 mr-20 border-b border-gray-300 py-4">
          <h2 class="text-2xl font-serif font-bold">More Categories</h2>
        </div>

        <!-- Categories Section -->
        <div class="ml-20 mr-20 mt-6 mb-20 grid grid-cols-3 sm:grid-cols-7 gap-4">
          <NuxtLink
            v-for="category in categoriesData"
            :key="category.id"
            :to="{ name: 'stories', query: { category: category.name } }"
            class="btn-category font-medium py-10 px-6 text-center rounded-lg">
            {{ category.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconSearch } from "@tabler/icons-vue";
import BookList from "~/components/books/StoryList.vue";
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import BookCategory from "~/components/books/StoryCategory.vue";

const isLoggedIn = computed(() => store.state.auth.isLogin); // Ambil status login dari Vuex
const store = useStore();

const storyList = ref([]);
const categories = ref([]);
const categoriesData = ref([]);

// Fungsi yang dijalankan saat komponen sudah dimount (dimasukkan ke DOM)
onMounted(async () => {
  try {
    // Menjalankan 3 aksi secara paralel menggunakan Promise.all
    // store.dispatch untuk mendapatkan data kategori, data kategori spesifik, dan data cerita
    const [categoriesResult, categoryDataResult, storyResult] = await Promise.all([
      store.dispatch("story/getStoryByCategory"),  // Mengambil data kategori cerita
      store.dispatch("story/getCategoryData"),    // Mengambil data kategori secara umum
      store.dispatch("story/getStoryData"),       // Mengambil data cerita terbaru
    ]);

    // Menyaring hasil kategori, hanya menyertakan kategori dengan nama "Horror", "Romance", atau "Comedy"
    categories.value = categoriesResult.filter(
      (category) =>
        category.category_name === "Horror" ||
        category.category_name === "Romance" ||
        category.category_name === "Comedy"
    );

    // Menyimpan hasil dari data kategori umum
    categoriesData.value = categoryDataResult;
    
    // Menyimpan hasil data cerita terbaru
    storyList.value = storyResult;
  } catch (error) {
    // Menangani error jika salah satu request gagal
    console.error("Error fetching data:", error);
  }
});

// Deklarasikan userData menggunakan computed untuk mendapatkan data user dari store secara reaktif
const userData = computed(() => {
  return store.state.auth.userLogin; // Mengakses state userLogin di Vuex store bagian auth
});

// Fungsi yang dijalankan saat komponen dimount
onMounted(async () => {
  try {
    // Mengambil data user dengan memanggil aksi getUser pada store
    await store.dispatch("auth/getUser");

  } catch (error) {
    // Menangani jika terjadi error saat fetching data user
    console.error("Failed to fetch user data:", error);
  }
});

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

// Mendapatkan akses ke instance router dari Nuxt.js
const router = useRouter();

// Mendeklarasikan ref untuk menyimpan query pencarian dari pengguna
const searchQuery = ref("");

// Fungsi untuk melakukan pencarian cerita
const searchStories = () => {
  // Memastikan query pencarian tidak kosong atau hanya berisi spasi
  if (!searchQuery.value.trim()) return;

  // Mengarahkan ke halaman 'stories' dengan query parameter pencarian
  router.push({
    name: "stories",  // Nama route yang akan dituju
    query: { search: searchQuery.value },  // Menambahkan parameter pencarian ke query string
  });
};
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem;
  max-width: 600px;
}
input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 16px;
}
.icon {
  color: #888;
  cursor: pointer;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.btn-category {
  background-color: #f0f5ed;
  color: #466543;
}

.category {
  background-color: #f0f5ed;
  color: #466543;
}
.bookmark {
  width: 65px;
}
</style>
