<template>
  <div class="flex flex-col items-center justify-center">
    <div v-if="story">
      <div class="highlight w-full py-1">
        <p class="mb-6 w-3/4 md:w-7/10 font-playFair px-4 md:px-20 mt-5">
          <NuxtLink to="/"><span class="home mr-2">Home</span></NuxtLink>
          <span class="slash mx-2">/</span>
          <span class="slash ml-2">{{ story.title }}</span>
        </p>
      </div>
      <div class="relative flex items-center w-full px-4 md:px-20 py-10 mt-10">
        <!-- Tombol Bookmark -->
        <div class="absolute top-[-50px] right-10 mt-5">
          <button class="text-white p-3">
            <img src="@/assets/images/before_bookmark.png" alt="" class="w-10 h-10" />
          </button>
        </div>
        <!-- Judul dan Tanggal -->
        <div class="absolute inset-x-0 text-center space-y-7">
          <!-- Tanggal -->
          <div class="text-gray-500 text-sm mt-10">
            {{ formatDate(story.created_at) }}
          </div>
          <!-- Judul -->
          <h1 class="text-3xl md:text-4xl font-bold font-playFair mb-2">{{ story.title }}</h1>
          <!-- Penulis -->
          <div class="flex items-center justify-center space-x-2">
            <img
              :src="story.image"
              :alt="story.author_name"
              class="w-6 h-6 rounded-full"
            />
            <span class="text-gray-700 font-medium">{{ story.author_name }}</span>
          </div>
        </div>
      </div>

      <div class="w-full max-w-screen-xl mx-auto mt-20">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 mr-20 ml-20">
          <!-- Kotak Kiri tetap -->
          <div class="col-span-1">
            <SlideImage :images="[story.cover, ...fullImagePaths]" />
          </div>

          <!-- Kotak Kanan digabungkan -->
          <div class="col-span-2 lg:col-span-2 mt-7">
            <div class="text-gray-700 leading-relaxed break-words whitespace-pre-line" v-html="story.content"></div>
          </div>
        </div>
      </div>

      <div class="w-full max-w-screen-xl mx-auto text-left mt-20 mb-60">
      <div class="w-full max-w-screen-xl mx-auto text-left">
        <div class="ml-20 mr-20 border-b border-gray-300 py-4">
          <h2 class="text-2xl font-serif font-bold">Similar Stories</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 ml-20 mr-20">
          <StoryList
            v-for="similarStory in similarStories"
            :key="similarStory.id"
            :story="similarStory"
          />
        </div>
      </div>
    </div>

    </div>
    <p v-else>Loading...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import StoryList from "~/components/books/StoryList.vue";
import SlideImage from "~/components/SlideImage.vue";

// API Base URL
const baseUrl = "http://157.245.193.94";

// Router
const route = useRoute();
const { id } = route.params;

// Data cerita
const story = ref(null);
const fullImagePaths = ref([]);
const similarStories = ref([]); // Tambahkan ini untuk menyimpan cerita serupa

// Fetch data cerita
onMounted(async () => {
  try {
    const res = await fetch(`${baseUrl}/api/story/detail/${id}`);
    const data = await res.json();

    // Periksa jika data.images ada
    if (data && data.data) {
      story.value = data.data; // Assign entire story data
      fullImagePaths.value = data.data.images || []; // Ensure images is an array
    }
    // Fetch similar stories
    const similarRes = await fetch(`${baseUrl}/api/stories/similar/${id}`);
    const similarData = await similarRes.json();
    if (similarData && similarData.success) {
      similarStories.value = similarData.data;
    } else {
      console.error("No images available in the response");
    }
  } catch (error) {
    console.error("Error fetching story:", error);
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
.btn-category {
  background-color: #f0f5ed;
  color: #466543;
}
.highlight {
  background-color: #f0f5ed;
  color: #466543;
}
.home:hover {
  text-decoration: underline;
}
</style>