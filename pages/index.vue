<template>
  <div class="flex flex-col items-center justify-center mt-7 text-center">
    <div v-if="isLoggedIn">
      <h1 class="text-xl font-bold">Hi, {{ userData.username }}</h1>
    </div>
    <h1 class="text-4xl font-playFair mb-5 font-bold">Welcome to Storytime</h1>
    <p class="mb-6 w-3/4 md:w-7/10 font-playFair">
      The world's most-loved social storytelling platform. Storytime connects a
      global community of 90 million readers and writers through the power of
      story.
    </p>
    <div
      class="search-bar flex items-center w-1/2 border border-gray-300 rounded-lg p-2">
      <input
        type="text"
        placeholder="Search story"
        class="flex-1 border-none outline-none p-2"/>
      <IconSearch class="text-gray-400 cursor-pointer" />
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
          to="AllStories"
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
            :to="{ name: 'AllStories', query: { category: category.category_name } }"
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
            <div class="rounded-lg">
              <div v-for="(story, index) in category.stories.slice(1, 2)" :key="index">
                <BookCategory :story="story" />
              </div>
            </div>

            <div class="rounded-lg">
              <div v-for="(story, index) in category.stories.slice(2, 3)" :key="index">
                <BookCategory :story="story" />
              </div>
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
          <button v-for="category in categoriesData" :key="category.id"
            class="btn-category font-medium py-10 px-6 text-center rounded-lg">
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconSearch } from "@tabler/icons-vue";
import BookList from "~/components/books/BookList.vue";
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import BookCategory from "~/components/books/BookCategory.vue";

const isLoggedIn = computed(() => store.state.auth.isLogin); // Ambil status login dari Vuex
const store = useStore();

const storyList = ref([]);
const categories = ref([]);
const categoriesData = ref([]);

onMounted(async () => {
  try {
    const result = await store.dispatch("story/getStoryByCategory");
    categories.value = result.filter(
      (category) =>
        category.category_name === "Horror" ||
        category.category_name === "Romance" ||
        category.category_name === "Comedy"
    );

    console.log(categories.value, " dddd dddd dddd dddd dddddd");
  } catch (error) {
    console.log(error);
  }
});

onMounted(async () => {
  try {
    const result = await store.dispatch("story/getCategoryData");
    categoriesData.value = result;
    console.log(categoriesData.value, "INI DATA KATEGORI AJAAAAAAAAAAAAAAAAAAAAAAAAA");
  } catch (error) {
    console.log(error);
  }
});

onMounted(async () => {
  try {
    const result = await store.dispatch("story/getStoryData");
    storyList.value = result;
    console.log(storyList.value, "INI DATA STORY NEWESTTTTTTT AJAAAAAAAAAAAAAAAAAAAAAAAAA");
  } catch (error) {
    console.log(error);
  }
});

// Deklarasikan userData sebelum menggunakannya
const userData = computed(() => {
  return store.state.auth.userLogin;
});

onMounted(async () => {
  try {
    await store.dispatch("auth/getUser");
    console.log("User Data after fetch:", userData.value); // Debugging
  } catch (error) {
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
