<template>
  <div class="w-full flex flex-col h-full">
    <!-- Bagian Atas -->
    <div class="bgprofile flex items-center h-1/3 bg-gray-200 p-4 mb-6">
  <div class="flex items-center w-full p-6 mx-auto max-w-5xl rounded-lg gap-4">
    <!-- Foto Profile -->
    <div>
      <img
        class="w-20 h-20 rounded-full object-cover"
        :src="userData.image || previewImage"
        alt="Profile Picture"
      />
    </div>

    <!-- Informasi User -->
    <div class="flex-1" v-if="userData.username">
      <h1 class="text-xl font-bold">{{ userData.name }}</h1>
      <p class="text-gray-600 text-sm">{{ userData.email }}</p>
      <p class="text-gray-700 text-sm mt-2">
        {{ userData.aboutme }}
      </p>
    </div>

    <!-- Tombol Edit Profile di kanan -->
    <button
      @click="editProfile"
      class="button text-white py-2 px-4 rounded hover:bg-green-700 ml-auto"
    >
      Edit Profile
    </button>
  </div>
</div>


    <!-- Bagian Bawah -->
    <div class="flex-grow flex pt-6">
      <!-- Kolom Kiri -->
      <div class="w-1/3">
        <div class="flex mb-4 ml-14">
          <div
            @click="activeTab = 'myStory'"
            :class="{ active: activeTab === 'myStory' }"
            class="tab-item text-white py-2 ms-2 rounded hover:bg-green-700 cursor-pointer"
          >
            My Story
          </div>
          <div
            @click="activeTab = 'bookmark'"
            :class="{ active: activeTab === 'bookmark' }"
            class="tab-item text-white py-2 ms-2 rounded hover:bg-green-700 cursor-pointer"
          >
            Bookmark
          </div>
        </div>

        <div class="card text-center mx-auto ml-14 mt-3 bg-white rounded-lg border-solid border-2 border-gray overflow-hidden">
          <!-- Konten -->
          <div class="p-4">
            <h2 class="text-xl font-semibold text-gray-800">Write your story</h2>
            <p class="text-gray-600 mt-2">
              Share your unique voice with the world – start writing your story today!
            </p>
            <NuxtLink to="create-story">
              <button class="btnstory mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600">
                Write story
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Kolom Kanan -->
      <div v-if="activeTab === 'myStory'" class="text-center w-2/3 pt-10 flex-grow overflow-auto">
        <div v-if="!isLoading && storyList.length === 0">
          <h2 class="text-xl font-semibold text-gray-800">No stories yet</h2>
          <p class="text-gray-600 mt-2">You haven't shared any stories yet. Start your fitness journey today!</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <img src="@/assets/images/vectorprofile.svg" alt="Centered Image" class="vector w-64 h-auto" />
          </div>
        </div>

        <div v-if="!isLoading && storyList.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-20 mr-10">
          <div v-for="story in storyList" :key="story.id" class="flex justify-center">
            <CreateList :story="story" @storyDeleted="handleStoryDeleted" />
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'bookmark'" class="text-center w-2/3 pt-10 flex-grow overflow-auto">
        <div v-if="!isLoading && Array.isArray(bookmarks) && bookmarks.length === 0">
          <h2 class="text-xl font-semibold text-gray-800">No bookmarks yet</h2>
          <p class="text-gray-600 mt-2">You haven't saved any bookmarks yet. Start exploring and bookmark your favorite stories!</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <img src="@/assets/images/vectorbookmark.svg" alt="Centered Image" class=" vector w-64 h-auto" />
          </div>
        </div>

        <div v-if="!isLoading && bookmarks.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-6 mb-20">
          <div v-for="bookmark in bookmarks" :key="bookmark.id" class="flex justify-center">
            <BookmarkList :story="bookmark.story" />
          </div>
        </div>
      </div>
    </div>
    <!-- </div> -->

    <!-- Modal Profile -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <!-- Modal Kiri -->
        <div class="left-side w-1/2 p-6">
          <button class="close-button" @click="closeModal">&times;</button>

          <h3>Edit Profile</h3>
          <!-- Profile Picture Section -->
          <div class="flex items-center space-x-4">
            <img :src="previewImage || userData.image" 
            alt="Profile Picture" 
            class="profile-pic" 
            />
            <button @click="triggerFileInput" class="button px-4 py-2 rounded">
              Change Picture
            </button>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileUpload"
            />
          </div>

          <!-- Profile Information -->
          <div class="input-group">
            <label for="name">Name</label>
            <input
              type="text"
              id="name"
              v-model="userData.name"
            />
          </div>

          <div class="input-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="userData.email" disabled />
          </div>

          <div class="input-group">
            <label for="aboutme">About Me</label>
            <textarea id="aboutme" v-model="userData.aboutme" placeholder="Tell us about yourself.."></textarea>
          </div>
        </div>

        <!-- Modal Kanan -->
        <div class="right-side w-1/2 p-6">
          <h5>Change Password</h5>

          <div class="input-group">
            <label for="current-password">Current Password</label>
            <input
              type="password"
              id="current-password"
              v-model="userData.current_password"
              placeholder="Enter your current password"
            />
          </div>

          <div class="input-group">
            <label for="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              v-model="userData.new_password"
              placeholder="Enter your new password"
            />
          </div>

          <div class="input-group">
            <label for="confirm-password">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              v-model="userData.new_password_confirmation"
              placeholder="Confirm your new password"
            />
          </div>
          <button @click="updateProfile" class="btn-save">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import CreateList from "~/components/books/CreateList.vue";
import BookmarkList from "~/components/books/BookmarkList.vue";
import axios from 'axios';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

const activeTab = ref("myStory");
const showModal = ref(false);
const store = useStore();
const userData = computed(() => store.state.auth.userLogin || {});
const token = computed(() => store.state.auth.token);
const previewImage = ref(null);
const fileInput = ref(null);
const uploadedFile = ref(null);

function triggerFileInput() {
  fileInput.value.click();
}

function editProfile() {
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}

const user = reactive({
  name: '',
  image: '',
  aboutme: '',
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
});

onMounted(async () => {
  try {
    await store.dispatch('auth/getUser');
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
});

const updateProfile = async () => {
  try {
    if (userData.value.newPassword !== userData.value.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    let avatarUrl = null;

    // Jika ada file yang diunggah, kirim ke backend
    if (uploadedFile.value) {
      const formData = new FormData();
      formData.append("files[]", uploadedFile.value);

      const response = await store.dispatch("auth/uploadAvatar", uploadedFile.value);
      avatarUrl = response.data;
    }

    const updatedData = {
      ...userData.value,
      image: avatarUrl || userData.value.image, // Gunakan URL baru jika ada
      currentPassword: userData.value.currentPassword,
      newPassword: userData.value.newPassword
    };

    const response = await store.dispatch("auth/updateProfile", updatedData);

    // if (response) {
    //   userData.value = { ...response.user };
    //   closeModal();
    // }

    if (response) {
      userData.value = { ...response.user };
      if (avatarUrl) {
        userData.value.image = avatarUrl; // Perbarui image di frontend
      }
      previewImage.value = null; // Reset preview agar kembali ke data asli dari backend
      closeModal();
    }

  } catch (error) {
    console.error("Failed to update profile:", error.message);
  }
};

const router = useRouter();

onMounted(() => {
  token.value = Cookies.get('jwt'); // Ambil token dari Cookies setelah reload

  if (!token.value) {
    router.push('/login'); // Jika token tidak ada, pindah ke login
  } 
});

// function handleFileUpload(event) {
//   const file = event.target.files[0];
//   if (file) {
//     // Preview Image
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       previewImage.value = e.target.result;
//     };
//     reader.readAsDataURL(file);

//     // Simpan file untuk diunggah
//     uploadedFile.value = file;
//   }
// };

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    // Preview Image
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);

    // Simpan file untuk diunggah
    uploadedFile.value = file;
  }
};

onMounted(async () => {
  try {
    const result = await store.dispatch("story/getStoryDataUser"); // Panggil action khusus user
    storyList.value = result; // Pastikan hanya data milik user yang masuk
  } catch (error) {
    console.log(error);
  }
});

const storyList = ref([]);

const bookmarks = ref([]); // Untuk menyimpan data bookmark
const isLoading = ref(true); // Untuk menampilkan loading saat data sedang diambil

// Fungsi untuk mengambil data bookmark
const getDataBookmark = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://157.245.193.94/api/bookmark-user', {
      headers: {
        Authorization: `Bearer ${token.value}`, // Menambahkan token di header untuk autentikasi
      },
    });

    // Pastikan data yang diterima benar-benar array
    if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
      bookmarks.value = response.data.data.data; // Menyimpan data bookmarks yang diterima
    } else {
      bookmarks.value = []; // Set kosong jika responsenya tidak sesuai
    }
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    bookmarks.value = []; // Pastikan bookmarks tetap array kosong jika terjadi error
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (token.value) {
    getDataBookmark(); // Mengambil data bookmark setelah komponen dimuat
  } else {
    // Redirect ke halaman login jika tidak ada token
    window.location.href = '/login';
  }
});

const handleStoryDeleted = (deletedStoryId) => {
  storyList.value = storyList.value.filter(story => story.id !== deletedStoryId);
};
</script>

<style scoped>
.vector {
  margin-left: 300px;
}
.bgprofile {
  background-color: #f0f5ed;
}
.tab-item {
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: black;
}

.tab-item.active {
  background-color: #f0f5ed;
}

.tab-item:hover {
  background-color: #f0f5ed; /* Warna saat hover */
}
.button {
  background-color: #466543;
  padding: 5px 10px;
  color: white;
  text-align: center;
  border-radius: 4px;
  font-size: 14px;
  display: inline-block;
}
.button:hover {
  background-color: #5a8257;
}
.btnbiasa {
  background-color: #466543;
  width: 20%;
}
.btnstory {
  background-color: #466543;
}
.card {
  width: 70%;
  padding: 30px 30px;
  position: sticky;
  top: 6rem;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 80%;
  position: relative;
  max-width: 800px; /* Tentukan batas maksimal lebar */
  position: relative; /* Agar konten tetap berada di dalam modal */
  box-sizing: border-box;
}
.close-button {
  position: absolute;
  top: 1px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  color: #333;
  cursor: pointer;
}
.close-button:hover {
  color: red;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  display: flex;
  width: 80%;
  max-width: 900px;
  background: white;
  border-radius: 8px;
}

.left-side {
  padding: 20px;
  text-align: left;
  border-right: 1px solid #ddd; /* Border separator between left and right */
}

.right-side {
  padding: 20px;
  text-align: left;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.close-button:hover {
  color: red;
}

.left-side .profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.left-side .btn-change-picture {
  background-color: #466543;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.left-side .btn-change-picture:hover {
  background-color: #5a8257;
}

.left-side .input-group {
  margin-top: 20px;
}

.left-side .input-group label {
  display: block;
  font-size: 14px;
  color: #555;
}

.left-side .input-group input,
.left-side .input-group textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.left-side .input-group textarea {
  height: 100px;
  resize: vertical;
}

.right-side .input-group {
  margin-top: 20px;
}

.right-side .input-group label {
  display: block;
  font-size: 14px;
  color: #555;
}

.right-side .input-group input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.right-side .btn-save {
  background-color: #466543;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
}

.right-side .btn-save:hover {
  background-color: #5a8257;
}

@media (max-width: 768px) {
  .modal-content {
    flex-direction: column;
    width: 90%;
    max-width: 600px;
  }

  .left-side,
  .right-side {
    width: 100%;
    border-right: none;
  }
}

.hidden {
  display: none;
}
.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

</style>
