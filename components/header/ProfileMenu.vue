<template>
  <div class="header__signup flex justify-evenly items-center text-right col-8 col-sm-4 fw-semibold">
    <!-- Profile Picture dan Username -->
    <div class="profile-info flex items-center space-x-2">
      <img v-if="userData.image" :src="userData.image || previewImage"
        alt="Profile Picture" class="w-8 h-8 rounded-full object-cover" />
      <i v-else class="fa-solid fa-user text-blue-600"></i>
      <ul class="navbar-nav">
        <li class="nav-item dropdown relative">
          <a class="nav-link dropdown-toggle cursor-pointer" @click.prevent="toggleDropdown">
            {{ userData.username }}
          </a>
          <ul v-if="isDropdownOpen" class="dropdown-menu absolute z-10 bg-white shadow-lg">
            <NuxtLink to="/ProfilePage" class="dropdown-item">My Profile</NuxtLink>
            <li><hr class="dropdown-divider" /></li>
            <li class="dropdown-item cursor-pointer" @click="logout">Logout</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed, ref } from "vue";

const store = useStore();
const router = useRouter();
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const logout = async () => {
  try {
    await store.dispatch("auth/logout"); // Call the logout action
    router.push("/"); // Redirect user to homepage
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

const userData = computed(() => store.state.auth.userLogin);
</script>

<style scoped>
.navbar-nav .dropdown-menu {
  display: none; /* Menyembunyikan menu dropdown secara default */
}

.nav-item:hover .dropdown-menu {
  display: block; /* Menampilkan menu dropdown saat hover */
}

.profile-info {
  display: flex;
  align-items: center;
}

.profile-info img {
  width: 32px; /* Ukuran gambar profil */
  height: 32px;
  border-radius: 50%; /* Membuat gambar bulat */
  object-fit: cover; /* Menjaga gambar tetap proporsional */
}

.modal-backdrop {
  z-index: 1040;
}
</style>
