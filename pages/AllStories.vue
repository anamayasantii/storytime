<template>
  <div class="flex flex-col items-center justify-center mt-7">
    <div class="flex display-flex w-full px-4 md:px-20 py-5">
      <h1 class="text-4xl font-playFair mb-5 font-bold">
        {{ selectedCategory && selectedCategory !== '' ? selectedCategory : 'All Story' }}
      </h1>
    </div>

    <div class="highlight w-full">
      <p class="mb-6 w-3/4 md:w-7/10 font-playFair px-4 md:px-20 mt-5">
        <span class="mr-2">Home</span>
        <span class="mx-2">/</span>
        <span class="ml-2">
          {{ selectedCategory && selectedCategory !== '' ? selectedCategory : 'All Story' }}
        </span>
      </p>
    </div>
    
    <div class="flex justify-between w-full px-4 md:px-20 py-5">
      <div class="flex justify-between w-1/3">
        <div class="flex items-center gap-2">
          <label for="sort-by">Sort By</label>
          <select class="font-bold border-none outline-none focus:ring-0" id="sort-by">
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
        </div>
        
        <div class="flex items-center gap-2">
          <label for="category">Category</label>
          <select class="font-bold border-none outline-none focus:ring-0" id="category" v-model="selectedCategory">
            <option value="">All</option>
            <option 
              v-for="category in categoriesData" 
              :key="category.id"
              :value="category.name">
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="search-bar flex justify-between w-1/3 border border-gray-300 rounded-lg p-2">
        <input
            type="text"
            placeholder="Search story"
            class="flex-1 border-none outline-none p-2"/>
        <IconSearch class="text-gray-400 cursor-pointer" />
      </div>
    </div>

    <div class="w-full max-w-screen-xl mx-auto">
      <!-- Book List Section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 mr-20 ml-20">
        <div v-for="story in filteredStories" :key="story.id">
          <BookList :story="story" />
        </div>
      </div>
    </div>

    <div class="w-full max-w-screen-xl mx-auto text-left mt-20">
      <div class="w-full max-w-screen-xl mx-auto text-left">
        <div class="flex justify-center space-x-2 mt-6 mb-20">
          <button
            class="pagination font-medium px-4 py-2 rounded-lg">
            1
          </button>
          <button
            class="pagination font-medium px-4 py-2 rounded-lg">
            2
          </button>
          <button
            class="pagination font-medium px-4 py-2 rounded-lg">
            3
          </button>
          <div class="pagination font-medium px-4 py-2 rounded-lg">...</div>
          <button
            class="pagination font-medium px-4 py-2 rounded-lg">
            10
          </button>
          <button
            class="pagination font-medium px-4 py-2 rounded-lg">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconSearch } from "@tabler/icons-vue";
import BookList from "~/components/books/BookList.vue";
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const store = useStore();
const route = useRoute();
const router = useRouter();
const selectedCategory = ref(route.query.category || '');  // initial category from query
const storyList = ref([]);
const categoriesData = ref([]);
const totalStoriesPerPage = 10;
const currentPage = ref(1);

const filteredStories = computed(() => {
   // Filter cerita berdasarkan kategori jika ada
  if (selectedCategory.value) {
    return storyList.value.filter(story => 
      story.category.toLowerCase() === selectedCategory.value.toLowerCase());
  }
  // Paginasi: Ambil hanya cerita yang sesuai dengan halaman saat ini
  const startIndex = (currentPage.value -1) * totalStoriesPerPage;
  //return storyList.value;
  return filtered.slice(startIndex, startIndex + totalStoriesPerPage);
});

onMounted(async () => {
  try {
    const result = await store.dispatch("story/getStoryData");
    storyList.value = result; //simpan data cerita yang diambil
    console.log(storyList.value, "INI DATA STORY");
  } catch (error) {
    console.log(error);
  }
});

onMounted(async () => {
  try {
    const result = await store.dispatch("story/getCategoryData");
    categoriesData.value = result;
    console.log(categoriesData.value, "INI DATA KATEGORI");
  } catch (error) {
    console.log(error);
  }
});

// Watch for changes to selectedCategory (this will trigger when URL is updated)
watch(() => route.query.category, (newCategory) => {
  selectedCategory.value = newCategory || '';  // Update the selected category
}, { immediate: true });

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
</style>

<!-- Penjelasan perubahan:
Menyaring Data Berdasarkan Kategori:

filteredStories adalah computed property yang memfilter daftar cerita berdasarkan kategori yang dipilih (yang diambil dari query parameter category di URL).
Menangani Perubahan Kategori:

Ketika kategori diubah melalui dropdown, URL akan diperbarui dengan query parameter category. Ini dilakukan menggunakan watch pada selectedCategory.
Mengambil Data:

Data cerita dan kategori diambil pada onMounted, dan kemudian data disimpan dalam storyList dan categoriesData.
Dengan perubahan ini, ketika URL diubah menjadi http://localhost:3000/AllStories?category=Romance, cerita yang sesuai dengan kategori "Romance" akan muncul di halaman. -->
