<template>
  <div class="grid grid-cols-1 md:grid-cols-2 h-screen">
    <!-- Bagian Kanan -->
    <div class="right flex items-center justify-center p-6">
      <NuxtLink to="/">
        <div class="absolute top-4 left-8 p-4">
          <img src="@/assets/images/image 15.png" alt="Logo" width="50%" />
        </div>
      </NuxtLink>
      <div class="w-full max-w-md">
        <h1 class="text-3xl font-bold mb-4">Login</h1>
        <form @submit.prevent="login" class="space-y-1">
          <base-input
            type="text"
            identity="identifier"
            label="Email/Username"
            placeholder="Enter your email or username"
            class="w-full p-2"
            v-model="loginData.identifier"
          ></base-input>

          <base-input
            type="password"
            identity="password"
            label="Password"
            placeholder="Enter your password"
            class="w-full p-2"
            v-model="loginData.password"
          ></base-input>

          <button
            type="submit"
            class="button text-white py-2 ms-2 rounded hover:bg-green-700"
          >
            Login
          </button>
          <p class="text-sm ms-2">
            Don't have an account?
            <NuxtLink to="/SignupPage"
              ><a class="login hover:underline">Sign Up</a></NuxtLink
            >
          </p>
        </form>
      </div>
    </div>

    <!-- Bagian Kiri -->
    <div class="left flex items-center justify-center p-6 m-4 relative">
      <div class="text-center">
        <h1 class="text-2xl font-bold mb-4">Welcome Back to</h1>
        <h1 class="text-2xl font-bold mb-4">Story Time!</h1>
        <p class="text-gray-600 mb-4">
          Dive back into captivating stories, follow your favorite authors, and
          continue sharing your own tales.
        </p>
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
import { reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

definePageMeta({
  layout: "AuthPage",
});

const store = useStore();
const router = useRouter();

const loginData = reactive({
  identifier: "", // Field untuk menangkap email/username
  password: "",
});

const login = async () => {
  const result = await store.dispatch("auth/getLoginData", {
    email: loginData.identifier, // Kirim identifier sebagai email (sesuai dengan backend)
    password: loginData.password,
  });

  console.log(result);
  if (result) {
    alert("Login berhasil!");
    router.push("/"); // Arahkan ke halaman index.vue
  } else {
    alert("Login gagal. Periksa email atau username dan password Anda.");
  }
};
</script>

<style scoped>
.left {
  background-color: #f0f5ed;
}
.button {
  background-color: #466543;
  width: 20%;
}
.login {
  color: #466543;
}
.button:hover {
  background-color: #5a8257;
}
</style>
