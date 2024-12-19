<template>
  <div class="h-screen w-full flex flex-col">
    <!-- Bagian Atas -->
    <div class="flex items-center justify-between h-1/2 bg-gray-200 p-4">
      <div
        class="flex items-center justify-between bg-gray-200 p-6 mx-auto max-w-5xl rounded-lg">
        <img class="w-20 h-auto" src="@/assets/images/contohprofile.png" alt="" />

        <div class="flex-1 px-6">
          <h1 class="text-xl font-bold">Santi</h1>
          <p class="text-gray-600 text-sm">anamayasanti03@gmail.com</p>
          <p class="text-gray-700 text-sm mt-2">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <button
          type="submit"
          class="button text-white py-2 ms-2 rounded hover:bg-green-700">
          Edit Profile
        </button>
      </div>
    </div>

    <!-- Bagian Bawah -->
    <div class="flex-grow flex">
      <!-- Kolom Kiri -->
      <div class="w-1/3 bg-blue-200">
        <button
          type="submit"
          class="btnbiasa text-white py-2 ms-2 rounded hover:bg-green-700">
          My Story
        </button>
        <button
          type="submit"
          class="btnbiasa text-white py-2 ms-2 rounded hover:bg-green-700">
          Bookmark
        </button>
        <div
          class="w-80 h-80 mx-auto mt-3 bg-white rounded-lg shadow-md overflow-hidden">
          <!-- Konten -->
          <div class="p-4">
            <h2 class="text-xl font-semibold text-gray-800">Write your story</h2>
            <p class="text-gray-600 mt-2">
                Share your unique voice with the world – start writing your story today!
            </p>
            <button
              class="btnstory mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600">
              Write story
            </button>
          </div>
        </div>
      </div>

      <!-- Kolom Kanan -->
      <div class="w-2/3 bg-green-200">
        <h2 class="text-xl font-semibold text-gray-800">No stories yet</h2>
            <p class="text-gray-600 mt-2">
                You haven't shared any stories yet. Start your fitness journey today!
            </p>
        <img class="w-80 h-auto" src="@/assets/images/vectorprofile.svg" alt="">
      </div>
    </div>
  </div>
</template>

<script setup>
// Tidak ada script khusus yang diperlukan di sini.
</script>

<style scoped>
.button {
  background-color: #466543;
  padding: 5px 10px;
  color: white;
  text-align: center;
  border-radius: 4px;
  font-size: 14px;
  display: inline-block;
}
.button:hover {
  background-color: #5a8257;
}
.btnbiasa {
  background-color: #466543;
  width: 20%;
}
.btnstory {
  background-color: #466543;
}
</style>
