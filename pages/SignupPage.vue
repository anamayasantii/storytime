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
        <form class="space-y-3">
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
            identity="confirmationPassword"
            label="Confirm Password"
            placeholder="Re-enter your chosen password"
            class="w-full p-2"
            v-model="signupData.confirmationPassword"
            @input="confirmationPasswordCheck"
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

          <button
            type="submit"
            class="button text-white py-2 ms-2 rounded hover:bg-green-700"
          >
            Create Account
          </button>
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
import { reactive, ref } from "vue";

definePageMeta({
  layout: "AuthPage",
});

const signupData = reactive({
  name: "",
  username: "",
  email: "",
  password: "",
  confirmationPassword: "",
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

const confirmationPasswordCheck = () => {
  if (signupData.confirmationPassword === "") {
    confirmPasswordDoesNotMatch.value = "none";
    confirmPasswordMatch.value = "none";
    return;
  }

  if (signupData.password !== signupData.confirmationPassword) {
    confirmPasswordDoesNotMatch.value = "block";
    confirmPasswordMatch.value = "none";
    return;
  }

  confirmPasswordDoesNotMatch.value = "none";
  confirmPasswordMatch.value = "block";
};

const register = async () => {
  console.log({ signupData });

  if (
    passwordMessages.length === "block" ||
    passwordMessages.capital === "block" ||
    passwordMessages.symbol === "block"
  ) {
    alert("Periksa kembali password Anda");
    return;
  }

  if (signupData.password !== signupData.confirmationPassword) {
    alert("Password dan Konfirmasi Password tidak cocok");
    signupData.password = "";
    signupData.confirmationPassword = "";
    return;
  }

  alert("Registrasi berhasil");
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