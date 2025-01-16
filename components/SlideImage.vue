<template>
  <div class="container mx-auto py-8">
    <!-- Gambar Utama -->
    <div class="relative w-full h-96 mb-6">
      <img
        :src="images[selectedImageIndex]"
        alt="Main Image"
        class="w-full h-full object-cover rounded-lg"
      />

      <!-- Tombol Panah Kiri -->
      <button
        class="absolute top-1/2 left-4 transform -translate-y-1/2 text-white rounded-full p-2 hover:bg-opacity-75"
        @click="prevImage"
      >
        &lt;
      </button>
      <!-- Tombol Panah Kanan -->
      <button
        class="absolute top-1/2 right-4 transform -translate-y-1/2 text-white rounded-full p-2 hover:bg-opacity-75"
        @click="nextImage"
      >
        &gt;
      </button>
    </div>

    <!-- Slider Gambar -->
    <div class="flex gap-7 overflow-x-auto scrollbar-hide">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="w-24 h-24 flex-shrink-0 cursor-pointer transition-all duration-300"
        :class="{
          'opacity-100 border-4 border-blue-500': index === selectedImageIndex,
          'opacity-50': index !== selectedImageIndex,
        }"
        @click="selectedImageIndex = index"
      >
        <img
          :src="image"
          alt="Thumbnail Image"
          class="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import bookcover from "@/assets/images/bookcover.jpg";
import qot from "@/assets/images/qot.jpeg";

// Array gambar
const images = ref([bookcover, qot, bookcover]);

// Index gambar yang dipilih
const selectedImageIndex = ref(0);

// Fungsi untuk next image
const nextImage = () => {
  selectedImageIndex.value =
    (selectedImageIndex.value + 1) % images.value.length;
};

// Fungsi untuk previous image
const prevImage = () => {
  selectedImageIndex.value =
    (selectedImageIndex.value - 1 + images.value.length) % images.value.length;
};
</script>

<style>
/* Hilangkan scrollbar secara visual */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
