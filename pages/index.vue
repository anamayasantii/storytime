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
        <NuxtLink to="AllBooks" class="text-gray-600 hover:text-black flex items-center">
          Explore More →
        </NuxtLink>
      </div>

      <!-- Book List Section -->
      <div class="overflow-x-scroll scrollbar-hide flex gap-6 mt-10">
        <div class="shrink-0 w-12"></div>
        <BookList v-if="storyListStatus" :stories="storyList" />
        <div class="shrink-0 w-12"></div>
      </div>
    </div>

    <div class="w-full max-w-screen-xl mx-auto mt-20">
      <!-- Comedy Story Section -->
      <div
        class="ml-20 mr-20 flex justify-between items-center border-b border-gray-300 py-4">
        <h2 class="text-2xl font-serif font-bold">Comedy</h2>
        <NuxtLink to="AllBooks" class="text-gray-600 hover:text-black flex items-center">
          Explore More →
        </NuxtLink>
      </div>

      <!-- Book List Section -->
      <div class="container mx-auto px-20 grid grid-cols-3 gap-4 mt-5">
        <!-- Grid Pertama dan Kedua (Merged) -->
        <div class="col-span-2 rounded-lg">
          <ListBottom />
        </div>

        <!-- Grid Ketiga (2 Cards Vertikal) -->
        <div class="grid grid-rows-2 gap-4">
          <!-- Card Atas -->
          <div class="rounded-lg">
            <ListBottom />
          </div>

          <!-- Card Bawah -->
          <div class="rounded-lg">
            <ListBottom />
          </div>
        </div>
      </div>
    </div>

    <div class="w-full max-w-screen-xl mx-auto">
      <!-- Romance Story Section -->
      <div
        class="ml-20 mr-20 flex justify-between items-center border-b border-gray-300 py-4">
        <h2 class="text-2xl font-serif font-bold">Romance</h2>
        <NuxtLink to="AllBooks" class="text-gray-600 hover:text-black flex items-center">
          Explore More →
        </NuxtLink>
      </div>

      <!-- Book List Section -->
      <div class="flex gap-6 mt-10 ml-20 mr-20 justify-between">
        <BookRomance />
      </div>
    </div>

    <div class="w-full max-w-screen-xl mx-auto mt-20">
      <!-- Horror Story Section -->
      <div
        class="ml-20 mr-20 flex justify-between items-center border-b border-gray-300 py-4">
        <h2 class="text-2xl font-serif font-bold">Horror</h2>
        <NuxtLink to="AllBooks" class="text-gray-600 hover:text-black flex items-center">
          Explore More →
        </NuxtLink>
      </div>

      <!-- Book List Section -->
      <div class="container mx-auto px-20 grid grid-cols-3 gap-4 mt-5">
        <!-- Grid Pertama dan Kedua (Merged) -->
        <div class="col-span-2 rounded-lg">
          <ListBottom />
        </div>

        <!-- Grid Ketiga (2 Cards Vertikal) -->
        <div class="grid grid-rows-2 gap-4">
          <!-- Card Atas -->
          <div class="rounded-lg">
            <ListBottom />
          </div>

          <!-- Card Bawah -->
          <div class="rounded-lg">
            <ListBottom />
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
        <div
          class="ml-20 mr-20 mt-6 mb-20 grid grid-cols-3 sm:grid-cols-7 gap-4">
          <button
            class="btn-category font-medium py-10 px-6 text-center rounded-lg">
            Adventure
          </button>
          <button
            class="btn-category font-medium py-10 px-6 text-center rounded-lg">
            Fiction
          </button>
          <button
            class="btn-category font-medium py-10 px-6 text-center rounded-lg">
            Fantasy
          </button>
          <button
            class="btn-category font-medium py-10 px-6 text-center rounded-lg">
            Drama
          </button>
          <button
            class="btn-category font-medium py-10 px-6 text-center rounded-lg">
            Heartfelt
          </button>
          <button
            class="btn-category font-medium py-10 px-6 text-center rounded-lg">
            Mystery
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconSearch } from "@tabler/icons-vue";
import BookList from "~/components/books/BookList.vue";
import BookRomance from "~/components/books/BookRomance.vue";
import ListBottom from "~/components/books/ListBottom.vue";
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";

const isLoggedIn = computed(() => store.state.auth.isLogin); // Ambil status login dari Vuex
const store = useStore();
const storyListStatus = ref(false);
const storyList = ref();
console.log("STORY LISTTTTTTTTTTTTTTTTT:", storyList.value);

console.log("HELO");

onMounted(async () => {
  try {
    await store.dispatch("story/getStoryData");
    storyListStatus.value = true;
    storyList.value = store.state.story.stories;
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
</style>
