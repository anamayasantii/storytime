<template>
  <div class="flex flex-col min-h-screen">
    <header class="shadow-sm bg-white py-4 border-b fixed top-0 w-full z-10 px-5">
      <div class="container mx-auto flex justify-between items-center px-4">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/">
            <div>
            <img src="../assets/images/image 15.png" alt="Logo" class="h-10 w-auto">
            </div>
          </NuxtLink>
        </div>
        <AuthMenu />
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-grow mt-20">
      <slot />
    </main>

    <hr class="border-t-1 border-black w-full">
    <footer class="py-1 m-3 flex justify-between items-center">
      <div class="container mx-auto px-5 flex justify-between items-center">
        <!-- Teks Copyright -->
        <p>&copy; 2024 PT. Timedoor Indonesia. All rights reserved.</p>

        <!-- Ikon Media Sosial -->
        <div class="flex space-x-1">
          <IconBrandWhatsapp />
          <IconBrandInstagram />
          <IconBrandYoutube />
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AuthMenu from "@/components/header/AuthMenu.vue";
import { IconBrandWhatsapp } from "@tabler/icons-vue";
import { IconBrandInstagram } from "@tabler/icons-vue";
import { IconBrandYoutube } from "@tabler/icons-vue";
</script>
