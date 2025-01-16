<template>
  <div class="flex flex-col items-center justify-center">
    <div class="highlight w-full mb-10">
      <p class="mb-6 w-3/4 md:w-7/10 font-playFair px-4 md:px-20 mt-5">
        <span class="mr-2">Home</span>
        <span class="mx-2">/</span>
        <span class="ml-2">All Story</span>
      </p>
    </div>
      <div class="relative flex items-center w-full px-4 md:px-20 py-10 mt-10">
        <!-- Tombol Bookmark -->
          <div class="absolute top-[-50px] right-10">
              <button class="text-white p-3">
                <img src="@/assets/images/before_bookmark.png" alt="Bookmark Icon" class="w-10 h-10">
              </button>
          </div>
          <!-- Judul dan Tanggal -->
          <div class="absolute inset-x-0 text-center space-y-10">
              <!-- Tanggal -->
              <div class="text-gray-500 text-sm">
                {{ formatDate(storyDetail.created_at) }}
              </div>
              <!-- Judul -->
              <h1 class="text-3xl md:text-4xl font-bold font-playFair mb-2">
                {{ storyDetail.title }}
              </h1>
              <!-- Penulis -->
              <div class="flex items-center justify-center space-x-2">
                <img 
                :src="`http://localhost:8000${storyDetail.author_image}`"
                :alt="storyDetail.author_name" 
                class="w-6 h-6 rounded-full">
                <span class="text-gray-700 font-medium">{{ storyDetail.author_name }}</span>
              </div>
            </div>
        </div>



        <div class="w-full max-w-screen-xl mx-auto mt-20">
          <!-- Book List Section -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 mr-20 ml-20">
            <!-- Kotak Kiri tetap -->
            <div class="col-span-1">
              <SlideImage />
            </div>

            <!-- Kotak Kanan digabungkan -->
            <div class="col-span-2 lg:col-span-2 mt-7">
              <p class="text-gray-700 leading-relaxed">
                {{ storyDetail.content }}
              </p>
            </div>
          </div>
        </div>

    <div class="w-full max-w-screen-xl mx-auto text-left mt-20 mb-60">
      <div class="w-full max-w-screen-xl mx-auto text-left">
        <!-- Header Section -->
        <div class="ml-20 mr-20 border-b border-gray-300 py-4">
          <h2 class="text-2xl font-serif font-bold">Similar Stories</h2>
        </div>

        <!-- Book List Section -->
        <div class="flex gap-6 mt-10 ml-20 mr-20 justify-between">
          <BookList/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from "vuex";

const store = useStore();

const storyDetail = computed(() => {
  return store.state.story.storyDetail;
});

import { IconSearch } from "@tabler/icons-vue";
import BookRomance from "~/components/books/BookCategory.vue";
import BookList from '~/components/books/BookList.vue';

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
.highlight {
  background-color: #f0f5ed;
}
</style>
