<template>
  <!-- Container utama dengan grid layout responsive -->
  <div class="grid grid-cols-1 md:grid-cols-2 h-screen">
    <!-- ============================================ -->
    <!-- BAGIAN KIRI - Branding dan Ilustrasi -->
    <!-- ============================================ -->
    <div class="left flex items-center justify-center bg-gray-100 p-6 m-4 relative">
      <!-- Logo dengan link ke home -->
      <NuxtLink to="/">
        <div class="absolute top-4 left-8 p-4">
          <img src="@/assets/images/logo.png" alt="Logo" width="30%" />
        </div>
      </NuxtLink>

      <!-- Konten marketing -->
      <div class="text-center">
        <h1 class="text-2xl font-bold mb-4">
          Join the World's Most-Loved Social Storytelling Platform!
        </h1>
        <p class="text-gray-600 mb-4">
          Create an account to explore interesting articles, connect with
          like-minded people, and share your own stories.
        </p>
        <!-- Ilustrasi signup -->
        <img
          src="@/assets/images/logosignup.svg"
          alt="Illustration"
          class="mx-auto"
          width="80%"
        />
      </div>
    </div>

    <!-- ============================================ -->
    <!-- BAGIAN KANAN - Form Registrasi -->
    <!-- ============================================ -->
    <div class="right flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <h1 class="text-3xl font-bold mb-4">Create Account</h1>
        <!-- Form registrasi dengan validasi -->
        <form @submit.prevent="register" class="space-y-3">
          <!-- Input Nama -->
          <base-input
            type="text"
            identity="name"
            label="Name"
            placeholder="Enter your name"
            class="w-full p-2"
            v-model="signupData.name"
          ></base-input>

          <!-- Input Username -->
          <base-input
            type="text"
            identity="username"
            label="Username"
            placeholder="Enter your username"
            class="w-full p-2"
            v-model="signupData.username"
          ></base-input>

          <!-- Input Email -->
          <base-input
            type="email"
            identity="email"
            label="Email"
            placeholder="Enter your email"
            class="w-full p-2"
            v-model="signupData.email"
          ></base-input>

          <!-- Input Password dengan validasi -->
          <base-input
            type="password"
            identity="password"
            label="Password"
            placeholder="Enter your chosen password"
            class="w-full p-2"
            v-model="signupData.password"
            @input="passwordCheck"
          ></base-input>

          <!-- Pesan validasi password -->
          <p
            class="text-red-700 mt-1 fw-medium"
            style="font-size: 11px"
            :style="{ display: passwordMessages.length }"
          >
            Password harus minimal 8 karakter
          </p>

          <p
            class="text-red-700 mt-1 fw-medium"
            style="font-size: 11px"
            :style="{ display: passwordMessages.capital }"
          >
            Password harus diawali huruf kapital
          </p>

          <p
            class="text-red-700 mt-1 fw-medium"
            style="font-size: 11px"
            :style="{ display: passwordMessages.symbol }"
          >
            Password harus ada setidaknya 1 simbol/angka (@, $, &, dll)
          </p>

          <!-- Input Konfirmasi Password -->
          <base-input
            type="password"
            identity="confirm_password"
            label="Confirm Password"
            placeholder="Re-enter your chosen password"
            class="w-full p-2"
            v-model="signupData.confirm_password"
            @input="confirm_passwordCheck"
          ></base-input>

          <!-- Pesan validasi konfirmasi password -->
          <p
            class="text-red-700 mt-1 fw-medium"
            style="font-size: 11px"
            :style="{ display: confirmPasswordDoesNotMatch }"
          >
            Password dan Konfirmasi Password tidak cocok
          </p>

          <p
            class="text-green-700 mt-1 fw-medium"
            style="font-size: 11px"
            :style="{ display: confirmPasswordMatch }"
          >
            Password dan Konfirmasi Password cocok
          </p>

          <!-- Tombol Submit -->
          <base-button class="button text-white py-2 ms-2 rounded hover:bg-green-700">
            Create Account
          </base-button>

          <!-- Link ke halaman login -->
          <p class="text-sm mt-2 ms-2">
            Already have an account?
            <NuxtLink to="/login"><a href="#" class="login hover:underline">Login</a></NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import yang diperlukan
import { reactive, ref } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";

// Inisialisasi store dan router
const store = useStore();
const router = useRouter();

// Set layout untuk halaman
definePageMeta({
  layout: "AuthPage",
});

// Data form registrasi
const signupData = reactive({
  name: "",
  username: "",
  email: "",
  password: "",
  confirm_password: "",
});

// State untuk pesan validasi password
const passwordMessages = reactive({
  length: "none",      // Pesan untuk panjang password
  capital: "none",     // Pesan untuk huruf kapital
  symbol: "none",      // Pesan untuk simbol
});

// State untuk pesan konfirmasi password
const confirmPasswordDoesNotMatch = ref("none");
const confirmPasswordMatch = ref("none");

// Fungsi untuk validasi password
const passwordCheck = () => {
  const { password } = signupData;

  // Reset pesan jika password kosong
  if (password === "") {
    passwordMessages.length = "none";
    passwordMessages.capital = "none";
    passwordMessages.symbol = "none";
    return;
  }

  // Validasi panjang minimal 8 karakter
  passwordMessages.length = password.length < 8 ? "block" : "none";
  // Validasi harus ada huruf kapital
  passwordMessages.capital = /[A-Z]/.test(password) ? "none" : "block";
  // Validasi harus ada simbol atau angka
  passwordMessages.symbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password) ? "none" : "block";
};

// Fungsi untuk validasi konfirmasi password
const confirm_passwordCheck = () => {
  const { password, confirm_password } = signupData;

  // Reset pesan jika konfirmasi password kosong
  if (confirm_password === "") {
    confirmPasswordDoesNotMatch.value = "none";
    confirmPasswordMatch.value = "none";
    return;
  }

  // Cek kecocokan password
  if (password !== confirm_password) {
    confirmPasswordDoesNotMatch.value = "block";
    confirmPasswordMatch.value = "none";
    return;
  }

  confirmPasswordDoesNotMatch.value = "none";
  confirmPasswordMatch.value = "block";
};

// Fungsi untuk menangani submit form
const register = async () => {
  // Validasi password sebelum submit
  if (
    passwordMessages.length === "block" ||
    passwordMessages.capital === "block" ||
    passwordMessages.symbol === "block"
  ) {
    alert("Periksa kembali password Anda");
    return;
  }

  // Validasi kecocokan password
  if (signupData.password !== signupData.confirm_password) {
    alert("Password dan Konfirmasi Password tidak cocok");
    signupData.password = "";
    signupData.confirm_password = "";
    return;
  }

  // Proses registrasi ke Vuex store
  const result = await store.dispatch("auth/getRegisterData", signupData);

  // Handling hasil registrasi
  if (result) {
    alert("Registrasi berhasil");
    router.push("/");  // Redirect ke home
  } else {
    alert("Gagal melakukan registrasi");
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
  width: 35%;
}
.login {
  color: #466543;  /* Warna teks link login */
}
.button:hover {
  background-color: #5a8257;  /* Warna tombol saat hover */
}
</style>