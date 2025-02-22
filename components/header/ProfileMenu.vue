<template>
  <div class="header__signup flex justify-evenly items-center text-right col-8 col-sm-4 fw-semibold relative">
    <!-- Profile Picture dan Username -->
    <div class="profile-info flex items-center space-x-2">
      <img
        v-if="userData.image"
        :src="userData.image || previewImage"
        alt="Profile Picture"
        class="w-10 h-10 rounded-full object-cover border border-gray-300"
      />
      <i v-else class="fa-solid fa-user text-blue-600 text-xl"></i>

      <div class="relative">
        <button @click="toggleDropdown" class="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white shadow-sm hover:bg-gray-100">
          <span class="text-gray-800 font-semibold">{{ userData.name }}</span>
          <i class="fa-solid fa-chevron-down text-gray-500 text-sm"></i>
        </button>

        <!-- Dropdown Menu -->
        <transition name="fade">
          <ul
            v-if="isDropdownOpen"
            class="dropdown-menu absolute right-0 mt-2 w-39 bg-white shadow-lg rounded-lg py-2 border border-gray-200"
            @click.stop
          >
            <NuxtLink to="/profile" class="dropdown-item block px-4 py-2 text-gray-700 hover:bg-gray-100" @click="closeDropdown">
              My Profile
            </NuxtLink>
            <hr class="border-gray-200 my-1" />
            <li class="dropdown-item block px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer" @click="logout">
              Logout
            </li>
          </ul>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed, ref, onMounted, onUnmounted } from "vue";

const store = useStore();
const router = useRouter();
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Fungsi untuk menutup dropdown setelah klik menu
const closeDropdown = () => {
  isDropdownOpen.value = false;
};

// Menutup dropdown jika user mengklik di luar area dropdown
const closeDropdownOutside = (event) => {
  if (!event.target.closest(".profile-info")) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeDropdownOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdownOutside);
});

const logout = async () => {
  try {
    await store.dispatch("auth/logout"); // Call the logout action
    alert("Logout was successful");
    router.push("/"); // Redirect user to homepage
    closeDropdown();
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

const userData = computed(() => store.state.auth.userLogin);
</script>

<style scoped>
/* Animasi fade-in dan fade-out */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Dropdown */
.dropdown-menu {
  z-index: 50;
}

/* Gaya item dropdown */
.dropdown-item {
  font-size: 14px;
  transition: background 0.2s ease-in-out;
}
</style>
