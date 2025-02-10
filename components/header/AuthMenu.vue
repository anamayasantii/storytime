<template>
  <div class="header__auth flex justify-start items-center">
    <!-- Tombol Register -->
     <NuxtLink v-if="!isLoggedIn" to="/SignupPage">
      <button class="btn btn-register">
        Sign Up
      </button>
    </NuxtLink>

    <NuxtLink v-if="!isLoggedIn" to="/LoginPage">
    <!-- Tombol Login -->
    <button class="btn btn-login">
      Login
    </button>
  </NuxtLink>
    <div class="profile-menu ml-6">
      <ProfileMenu v-if="isLoggedIn"/>
    </div>
  </div>
</template>

<script setup>
import ProfileMenu from './ProfileMenu.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const isLoggedIn = computed(() => store.state.auth.isLogin); // Ambil status login dari Vuex
</script>

<style scoped>
.btn {
  padding: 8px 16px;
  border-radius: 7px;
  cursor: pointer;
  margin-right: 12px
}
.btn-register {
  background-color: white;
  color: #4c4d4d;
  border: 1px solid #466543;
}
.btn-login {
  background-color: #466543;
  color: white;
  border: none;
}
.btn:hover {
  opacity: 0.8;
}
.profile-menu {
  margin-right: 30px; /* 🔹 Memperbesar jarak dari tombol login */
}
</style>
