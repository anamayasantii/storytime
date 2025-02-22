<template>
  <div class="flex items-center justify-center gap-12 ml-20 mr-20 pt-32">
    <img src="@/assets/images/error.svg" class="w-6/12" alt="" />
    <div class="text-center">
      <h1 class="text-8xl font-playfair">
        <b>{{ error.statusCode }}</b>
      </h1>
      <h4 class="font-playfair mt-7 mb-12">Page Not Found</h4>
      <p class="mb-7 text-lg">
        Oops! It looks like this page doesn't exist. Please check the URL or
        return to the homepage.
      </p>
      <nuxt-link to="/" class="btn">Back to home</nuxt-link>
    </div>
  </div>
</template>

<script setup>

defineProps({
  error: Object,
});
</script>

<style scoped>
.error-page {
  text-align: center;
  margin-top: 50px;
}
</style>
