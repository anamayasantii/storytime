<template>
  <div class="flex flex-col items-center justify-center mt-7">
    <h1 class="text-4xl font-playFair mb-5 font-bold">All Story</h1>
    <p class="mb-6 w-3/4 md:w-7/10 font-playFair">
      Home / All Story
    </p>
    <div class="flex justify-between">
      <div class="flex justify-between">
          <p>Sort By</p>
          <p>Dropdown</p>
  
          <p>Category</p>
          <p>Dropdown</p>
      </div>
      <div class="search-bar flex justify-between w-1/2 border border-gray-300 rounded-lg p-2">
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
        <BookRomance />
        <BookRomance />
        <BookRomance />
        <BookRomance />
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
import BookRomance from "~/components/books/BookRomance.vue";

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
