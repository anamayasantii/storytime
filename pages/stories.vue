<template>
  <div class="flex flex-col items-center justify-center mt-7">
    <div class="flex display-flex w-full px-4 md:px-20 py-5">
      <h1 class="text-4xl font-playFair mb-5 font-bold">
        {{
            searchQuery
              ? `${filteredStories.length} results for '${searchQuery}'`
              : selectedCategory
                ? selectedCategory
                : "All Stories"
          }}
      </h1>
    </div>

    <!-- Breadcrumb -->
    <div class="highlight w-full">
      <p class="mb-6 w-3/4 md:w-7/10 font-playFair px-4 md:px-20 mt-5">
        <NuxtLink to="/"><span class="home mr-2">Home</span></NuxtLink>
        <span class="slash mx-2">/</span>
        <span class="slash ml-2">
          {{ searchQuery ? "Search Result" : selectedCategory ? selectedCategory : "All Stories" }}
        </span>
      </p>
    </div>

    <!-- Filter & Search Bar -->
    <div class="flex justify-between w-full px-4 md:px-20 py-5">
      <div class="flex justify-between w-1/3">
        <!-- Sort Dropdown -->
        <div class="flex items-center gap-2 ">
          <label for="sort-by">Sort By</label>
          <select v-model="selectedSort" @change="sortedStories" class="font-bold">
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
        </div>

        <!-- Category Dropdown -->
        <div class="flex items-center gap-2">
          <label for="category">Category</label>
          <select
            v-model="selectedCategory"
            class="font-bold border-none outline-none focus:ring-0"
            id="category"
          >
            <option value="">All Category</option>
            <option v-for="category in categoriesData" :key="category.id" :value="category.name">
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="search-bar flex justify-between w-1/3 border border-gray-300 rounded-lg p-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search story..."
          class="flex-1 border-none outline-none p-2"
          @keyup.enter="updateSearchQuery"
        />
        <IconSearch class="text-gray-400 cursor-pointer" @click="updateSearchQuery" />
      </div>
    </div>

    <!-- Book List -->
    <div class="w-full max-w-screen-xl mx-auto">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 mr-20 ml-20">
        <div v-for="story in sortedStories" :key="story.id">
          <BookList :story="story" />
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center space-x-2 mt-6 mb-20">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="currentPage = page"
        :class="['pagination font-medium px-4 py-2 rounded-lg', { activePage: page === currentPage }]"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { IconSearch } from "@tabler/icons-vue";
import BookList from "~/components/books/StoryList.vue";
import { useStore } from "vuex";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const store = useStore();
const route = useRoute();
const router = useRouter();

// State Management
const selectedCategory = ref(route.query.category || ""); // Kategori yang dipilih
const searchQuery = ref(route.query.search || ""); // Query pencarian berdasarkan judul
const storyList = ref([]); // Semua cerita
const categoriesData = ref([]); // Daftar kategori
const totalStoriesPerPage = 12;
const currentPage = ref(1);

// Ambil data cerita dan kategori saat halaman dimuat
const fetchStoriesAndCategories = async () => {
  try {
    const stories = await store.dispatch("story/getStoryData", { no_pagination: true });
    storyList.value = stories;
    const categories = await store.dispatch("story/getCategoryData");
    categoriesData.value = categories;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(fetchStoriesAndCategories);

// Filter cerita berdasarkan kategori & searchQuery
const filteredStories = computed(() => {
  let filtered = storyList.value;

  // Filter berdasarkan kategori
  if (selectedCategory.value) {
    filtered = filtered.filter(
      (story) => story.category.toLowerCase() === selectedCategory.value.toLowerCase()
    );
  }

  // Filter berdasarkan judul
  if (searchQuery.value) {
    filtered = filtered.filter((story) =>
      story.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return filtered;
});

// Pagination
const paginatedStories = computed(() => {
  const startIndex = (currentPage.value - 1) * totalStoriesPerPage;
  const endIndex = currentPage.value * totalStoriesPerPage;
  return filteredStories.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  return Math.ceil(filteredStories.value.length / totalStoriesPerPage);
});

// Sinkronisasi kategori & search query dengan URL
watch(
  [() => selectedCategory.value, () => searchQuery.value],
  ([newCategory, newSearch]) => {
    router.push({
      query: {
        category: newCategory || undefined,
        search: newSearch || undefined,
      },
    });
  }
);

// Sinkronisasi dari URL ke state
watch(
  () => route.query,
  (query) => {
    selectedCategory.value = query.category || "";
    searchQuery.value = query.search || "";
  },
  { immediate: true }
);

// Fungsi update search query
const updateSearchQuery = () => {
  router.push({ query: { ...route.query, search: searchQuery.value || undefined } });
};

const popularStories = ref([]);

const fetchPopularStories = async () => {
  try {
    const stories = await store.dispatch("story/getPopularStories");
    popularStories.value = stories;
  } catch (error) {
    console.error("Error fetching popular stories:", error);
  }
};

onMounted(() => {
  fetchStoriesAndCategories();
  fetchPopularStories(); // Ambil data cerita populer
});

const selectedSort = ref("newest");

const sortedStories = computed(() => {
  if (selectedSort.value === "popular") {
    return popularStories.value; // Jika "Popular" dipilih, tampilkan cerita populer
  }

  let sorted = [...paginatedStories.value]; // Salin array agar tidak mengubah aslinya

  if (selectedSort.value === "az") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (selectedSort.value === "za") {
    sorted.sort((a, b) => b.title.localeCompare(a.title));
  }

  return sorted;
});
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
.highlight {
  background-color: #f0f5ed;
}
.pagination {
  background-color: #f0f5ed;
  color: #466543;
}
.pagination:hover {
  background-color: #466543;
  color: #f0f5ed;
}
.home:hover {
  text-decoration: underline;
}
.home, .slash{
  color: #466543;
}
.activePage {
  background-color: #466543;
  color: #f0f5ed;
}
</style>

<!-- Penjelasan perubahan:
Menyaring Data Berdasarkan Kategori:

filteredStories adalah computed property yang memfilter daftar cerita berdasarkan kategori yang dipilih (yang diambil dari query parameter category di URL).
Menangani Perubahan Kategori:

Ketika kategori diubah melalui dropdown, URL akan diperbarui dengan query parameter category. Ini dilakukan menggunakan watch pada selectedCategory.
Mengambil Data:

Data cerita dan kategori diambil pada onMounted, dan kemudian data disimpan dalam storyList dan categoriesData.
Dengan perubahan ini, ketika URL diubah menjadi http://localhost:3000/AllStories?category=Romance, cerita yang sesuai dengan kategori "Romance" akan muncul di halaman. -->
