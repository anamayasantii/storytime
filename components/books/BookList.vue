<template>
<div class="flex-shrink-0 max-w-sm bg-white overflow-hidden overflow-fix dark:bg-gray-800">
  <!-- Gambar Card -->
  <div class="relative" v-for="story in stories" :key="story.id">
    <img class="w-full h-auto rounded-t-xl object-cover" 
    :src="story.cover" 
    :alt="story.title">
    <div
        class="absolute right-8 bottom-8 rounded-full h-12 w-12 flex items-center justify-center bg-gray-asparagus">
        <img class="h-65 w-65 p-2 overflow-hidden" src="@/assets/images/bookmarkicon.png" alt="">
    </div>

  <!-- Konten Card -->
    <div>
    <!-- Judul -->
    <h5 class="mb-2 text-xl font-bold text-left text-gray-800 dark:text-white">
      {{ story.title }}
    </h5>

    <!-- Cuplikan Cerita -->
    <p class="mb-4 text-sm text-gray-500 text-left dark:text-neutral-400 line-clamp-3">
      {{ story.content }}
    </p>

    <!-- Informasi Tambahan -->
    <!-- <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
      <div class="flex items-center space-x-2">
        <img
          class="w-6 h-6 rounded-full"
          src="@/assets/images/profile.png"
          alt="lia">
        <span>LIAK</span>
      </div>

      <span>13 March 2024</span>

      <span class="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-md dark:bg-green-900 dark:text-green-300">
        Comedy
      </span>
    </div> -->

  </div>
  </div>
</div>
</template>

<script setup>
defineProps({
    stories: Array
})

</script>

<style scope>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>