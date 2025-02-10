<template>
  <div
    class="flex-shrink-0 max-w-sm bg-white overflow-hidden overflow-fix dark:bg-gray-800">
    <!-- Gambar Card -->
    <div class="relative">
      <div class="relative">
        <NuxtLink :to="`/story/${story.id}`">
          <div
            :class="size === 'special' ? 'h-[700px]' : 'h-[350px]'"
            class="rounded-t-md overflow-hidden">
            <img
              class="w-full h-full object-cover transition-all duration-300 ease-in-out hover:bg-white hover:opacity-55"
              :src="story.cover"
              :alt="story.title"
            />
          </div>
        </NuxtLink>
      </div>

      <!-- Konten Card -->
      <div>
        <!-- Judul -->
        <h5
          class="mb-2 text-xl font-bold text-left text-gray-800 dark:text-white">
          {{ story.title }}
        </h5>

        <!-- Cuplikan Cerita -->
        <p
          class="mb-4 text-sm text-gray-500 text-left dark:text-neutral-400 line-clamp-3">
          {{ story.content }}
        </p>

        <!-- Informasi Tambahan -->
        <div
          class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <div class="flex items-center space-x-2 flex-shrink-0">
            <img
              class="w-6 h-6 rounded-full"
              :src="story.author_image"
              :alt="story.author_name"
            />
            <span>{{ story.author_name }}</span>
          </div>

          <span class="flex-shrink-0">{{ formatDate(story.created_at) }}</span>

          <span
            class="category flex-shrink-0 px-2 py-1 text-xs font-medium rounded-md">
            {{ story.category }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  story: Object,
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

<style scope>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.category {
  background-color: #f0f5ed;
  color: #466543;
}
.bookmark {
  width: 65px;
}
</style>
