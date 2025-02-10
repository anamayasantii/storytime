<template>
  <div class="container mx-auto py-8">
    <div class="relative w-full h-96 mb-6">
      <img
        v-if="images.length > 0"
        :src="images[selectedImageIndex]"
        alt="Main Image"
        class="w-full h-full object-cover rounded-lg"
      />
      <p v-else>No images available</p>

      <button v-if="images.length > 1" class="absolute top-1/2 left-4 text-white" @click="prevImage">
        &lt;
      </button>
      <button v-if="images.length > 1" class="absolute top-1/2 right-4 text-white" @click="nextImage">
        &gt;
      </button>
    </div>

    <div class="flex gap-4 overflow-x-auto scrollbar-hide">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="w-24 h-24 cursor-pointer transition-all duration-300"
        :class="{ 'opacity-100 border-4 border-blue-500': index === selectedImageIndex }"
        @click="selectedImageIndex = index"
      >
        <img :src="image" alt="Thumbnail Image" class="w-full h-full object-cover rounded-lg" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  images: {
    type: Array,
    required: true,
  },
});

const selectedImageIndex = ref(0);

const nextImage = () => {
  selectedImageIndex.value = (selectedImageIndex.value + 1) % images.length;
};

const prevImage = () => {
  selectedImageIndex.value = (selectedImageIndex.value - 1 + images.length) % images.length;
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
