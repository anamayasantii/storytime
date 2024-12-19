<template>
  <div class="flex flex-col items-center justify-center mt-7 text-center">
    <h1 class="text-4xl font-serif mb-5 font-bold">Welcome to Storytime</h1>
    <p class="mb-6 w-3/4 md:w-7/10">
      The world's most-loved social storytelling platform. Storytime connects
      a global community of 90 million readers and writers through the power of story.
    </p>
    <div class="search-bar flex items-center w-1/2 border border-gray-300 rounded-lg p-2">
      <input
        type="text"
        placeholder="Search story"
        class="flex-1 border-none outline-none p-2"
      />
      <IconSearch class="text-gray-400 cursor-pointer" />
    </div>
    <img
      src="@/assets/images/image 14.svg"
      alt="Logo"
      class="mt-10 w-1/2 max-w-sm"
    />
  </div>
</template>

<script setup lang="ts">
import { IconSearch } from '@tabler/icons-vue';
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
</style>
