<template>
  <!-- Container utama dengan grid layout responsive -->
  <div class="grid grid-cols-1 md:grid-cols-2 h-screen">
    <!-- ============================================ -->
    <!-- BAGIAN KANAN - Form Login -->
    <!-- ============================================ -->
    <div class="right flex items-center justify-center p-6">
      <!-- Logo dengan link ke home -->
      <NuxtLink to="/">
        <div class="absolute top-4 left-8 p-4">
          <img src="@/assets/images/logo.png" alt="Logo" width="15%" />
        </div>
      </NuxtLink>

      <!-- Container form login -->
      <div class="w-full max-w-md">
        <h1 class="text-3xl font-bold mb-4">Login</h1>
        <!-- Form login dengan event handler prevent default -->
        <form @submit.prevent="login" class="space-y-1">
          <!-- Input Email/Username -->
          <base-input
            type="text"
            identity="identifier"
            label="Email/Username"
            placeholder="Enter your email or username"
            class="w-full p-2"
            v-model="loginData.identifier">
          </base-input>

          <!-- Input Password -->
          <base-input
            type="password"
            identity="password"
            label="Password"
            placeholder="Enter your password"
            class="w-full p-2"
            v-model="loginData.password"
          ></base-input>

          <!-- Tombol Submit -->
          <button
            type="submit"
            class="button text-white py-2 ms-2 rounded hover:bg-green-700"
          >
            Login
          </button>

          <!-- Link ke halaman signup -->
          <p class="text-sm ms-2">
            Don't have an account?
            <NuxtLink to="/signup">
              <a class="login hover:underline">Sign Up</a>
            </NuxtLink>
          </p>
        </form>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- BAGIAN KIRI - Branding dan Ilustrasi -->
    <!-- ============================================ -->
    <div class="left flex items-center justify-center p-6 m-4 relative">
      <!-- Konten marketing -->
      <div class="text-center">
        <h1 class="text-2xl font-bold mb-4">Welcome Back to</h1>
        <h1 class="text-2xl font-bold mb-4">Story Time!</h1>
        <p class="text-gray-600 mb-4">
          Dive back into captivating stories, follow your favorite authors, and
          continue sharing your own tales.
        </p>
        <!-- Ilustrasi login -->
        <img
          src="@/assets/images/logologin.png"
          alt="Illustration"
          class="mx-auto"
          width="80%"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// Import yang diperlukan
import { reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

// Set layout untuk halaman
definePageMeta({
  layout: "AuthPage",
});

// Inisialisasi store dan router
const store = useStore();
const router = useRouter();

// Data form login dengan reactive untuk reaktivitas
const loginData = reactive({
  identifier: "", // Field untuk email/username
  password: "",   // Field untuk password
});

// Fungsi untuk menangani submit form login
const login = async () => {
  // Memanggil action login di Vuex store
  const result = await store.dispatch("auth/getLoginData", {
    email: loginData.identifier, // Mengirim identifier sebagai email ke backend
    password: loginData.password,
  });

  // Handling hasil login
  if (result) {
    alert("Login berhasil!");
    router.push("/"); // Redirect ke halaman utama
  } else {
    alert("Login gagal. Periksa email atau username dan password Anda.");
  }
};
</script>

<!-- Styling khusus untuk komponen -->
<style scoped>
.left {
  background-color: #f0f5ed;  /* Warna background bagian kiri */
}
.button {
  background-color: #466543;  /* Warna dasar tombol */
  width: 20%;                 /* Lebar tombol */
}
.login {
  color: #466543;  /* Warna teks link signup */
}
.button:hover {
  background-color: #5a8257;  /* Warna tombol saat hover */
}
</style>