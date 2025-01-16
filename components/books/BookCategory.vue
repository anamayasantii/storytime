<template>
    <div class="bg-white overflow-hidden overflow-fix dark:bg-gray-800">
    <!-- Gambar Card -->
    <div class="relative">
      <div :class="size === 'special' ? 'w-[800px]' : 'h-[350px] w-full'" 
            class="rounded-t-md overflow-hidden">
          <img class="w-full h-full object-cover" 
          :src="story.cover" 
          :alt="story.title">
        </div>
      <div
          class="absolute right-8 bottom-8 rounded-full flex items-center justify-center bg-gray-asparagus">
          <img class="bookmark p-2 overflow-hidden" src="@/assets/images/before_bookmark.png" alt="">
      </div>
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
    <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
      <!-- Author -->
      <div class="flex items-center space-x-2">
        <img
          class="w-6 h-6 rounded-full"
          :src="`http://localhost:8000${story.author_image}`"
          :alt="story.author_name">
        <span>{{ story.author_name }}</span>
      </div>

      <!-- Tanggal -->
      <span>{{ formatDate(story.created_at) }}</span>

      <!-- Genre -->
      <!-- <span class="category px-2 py-1 text-xs font-medium rounded-md">
        {{ story.category_name }}
      </span> -->
    </div>
  </div>
</div>
</template>

<script setup>
defineProps({
    story: Object,
    size: String, // Pastikan ada properti size
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

<style>
.category {
  background-color: #f0f5ed;
  color: #466543;
}
.bookmark {
  width: 65px;
}
</style>