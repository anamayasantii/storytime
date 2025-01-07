<template>
  <div class="grid grid-cols-1 md:grid-cols-2 h-screen">
    <!-- Bagian Kiri -->
    <div class="left flex items-center justify-center bg-gray-100 p-6 m-4 relative">
      <NuxtLink to="/">
        <div class="absolute top-4 left-8 p-4">
          <img src="@/assets/images/image 15.png" alt="Logo" width="50%" />
        </div>
      </NuxtLink>
      <div class="text-center">
        <h1 class="text-2xl font-bold mb-4">
          Join the World’s Most-Loved Social Storytelling Platform!
        </h1>
        <p class="text-gray-600 mb-4">
          Create an account to explore interesting articles, connect with
          like-minded people, and share your own stories.
        </p>
        <img
          src="@/assets/images/logosignup.svg"
          alt="Illustration"
          class="mx-auto"
          width="80%"
        />
      </div>
    </div>

    <!-- Bagian Kanan -->
    <div class="right flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <h1 class="text-3xl font-bold mb-4">Create Account</h1>
        <form @submit.prevent="register" class="space-y-3">
          <base-input
            type="text"
            identity="name"
            label="Name"
            placeholder="Enter your name"
            class="w-full p-2"
            v-model="signupData.name"
          ></base-input>

          <base-input
            type="text"
            identity="username"
            label="Username"
            placeholder="Enter your username"
            class="w-full p-2"
            v-model="signupData.username"
          ></base-input>

          <base-input
            type="email"
            identity="email"
            label="Email"
            placeholder="Enter your email"
            class="w-full p-2"
            v-model="signupData.email"
          ></base-input>

          <base-input
            type="password"
            identity="password"
            label="Password"
            placeholder="Enter your chosen password"
            class="w-full p-2"
            v-model="signupData.password"
            @input="passwordCheck"
          ></base-input>

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

          <base-input
            type="password"
            identity="confirm_password"
            label="Confirm Password"
            placeholder="Re-enter your chosen password"
            class="w-full p-2"
            v-model="signupData.confirm_password"
            @input="confirm_passwordCheck"
          ></base-input>

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

          <base-button class="button text-white py-2 ms-2 rounded hover:bg-green-700">
            Create Account
          </base-button>
          <p class="text-sm mt-2 ms-2">
            Already have an account?
            <NuxtLink to="/LoginPage"><a href="#" class="login hover:underline">Login</a></NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

definePageMeta({
  layout: "AuthPage",
});

const signupData = reactive({
  name: "",
  username: "",
  email: "",
  password: "",
  confirm_password: "", // Pastikan ini sesuai dengan backend
});

const passwordMessages = reactive({
  length: "none",
  capital: "none",
  symbol: "none",
});

const confirmPasswordDoesNotMatch = ref("none");
const confirmPasswordMatch = ref("none");

const passwordCheck = () => {
  const { password } = signupData;

  if (password === "") {
    passwordMessages.length = "none";
    passwordMessages.capital = "none";
    passwordMessages.symbol = "none";
    return;
  }

  passwordMessages.length = password.length < 8 ? "block" : "none";
  passwordMessages.capital = /[A-Z]/.test(password) ? "none" : "block";
  passwordMessages.symbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password) ? "none" : "block";
};

const confirm_passwordCheck = () => {
  const { password, confirm_password } = signupData;

  if (confirm_password === "") {
    confirmPasswordDoesNotMatch.value = "none";
    confirmPasswordMatch.value = "none";
    return;
  }

  if (password !== confirm_password) {
    confirmPasswordDoesNotMatch.value = "block"; // Tampilkan pesan jika tidak cocok
    confirmPasswordMatch.value = "none"; // Sembunyikan pesan cocok
    return;
  }

  confirmPasswordDoesNotMatch.value = "none"; // Sembunyikan pesan tidak cocok
  confirmPasswordMatch.value = "block"; // Tampilkan pesan cocok
};

const register = async () => {
  console.log({ signupData });

  // Periksa validasi password
  if (
    passwordMessages.length === "block" ||
    passwordMessages.capital === "block" ||
    passwordMessages.symbol === "block"
  ) {
    alert("Periksa kembali password Anda");
    return;
  }

  // Periksa kesesuaian antara password dan konfirmasi
  if (signupData.password !== signupData.confirm_password) {
    alert("Password dan Konfirmasi Password tidak cocok");
    signupData.password = ""; // Reset field jika tidak cocok
    signupData.confirm_password = ""; // Reset field jika tidak cocok
    return;
  }

  // Tangkap hasil dari aksi pendaftaran
  const result = await store.dispatch("auth/getRegisterData", signupData);

  if (result) {
    alert("Registrasi berhasil");
    router.push("/");
  } else {
    alert("Gagal melakukan registrasi");
  }
};
</script>


<style scoped>
.left {
  background-color: #f0f5ed;
}
.button {
  background-color: #466543;
  width: 35%;
}
.login {
  color: #466543;
}
.button:hover {
  background-color: #5a8257;
}
</style>