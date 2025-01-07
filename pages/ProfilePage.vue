<template>
  <div class="w-full flex flex-col h-full">
    <!-- Bagian Atas -->
    <div
      class="bgprofile flex items-center justify-between h-1/3 bg-gray-200 p-4 mb-6">
      <div
        class="flex items-center justify-between p-6 mx-auto max-w-5xl rounded-lg">
        <img
          class="w-20 h-20 rounded-full object-cover"
          :src="userData.image || previewImage"
          alt="Profile Picture"
        />

        <div class="flex-1 px-6" v-if="userData.username">
          <h1 class="text-xl font-bold">{{ userData.username }}</h1>
          <p class="text-gray-600 text-sm">{{ userData.email }}</p>
          <p class="text-gray-700 text-sm mt-2">
            {{ userData.aboutme }}
          </p>
        </div>

        <button
          @click="editProfile"
          class="button text-white py-2 ms-2 rounded hover:bg-green-700">
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

        <div
          class="card text-center mx-auto ml-14 mt-3 bg-white rounded-lg border-solid border-2 border-gray overflow-hidden"
        >
          <!-- Konten -->
          <div class="p-4">
            <h2 class="text-xl font-semibold text-gray-800">
              Write your story
            </h2>
            <p class="text-gray-600 mt-2">
              Share your unique voice with the world – start writing your story
              today!
            </p>
            <button
              class="btnstory mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600"
            >
              Write story
            </button>
          </div>
        </div>
      </div>

      <!-- Kolom Kanan -->
      <div
        v-if="activeTab === 'myStory'"
        class="text-center w-2/3 pt-10 flex-grow overflow-auto"
      >
        <h2 class="text-xl font-semibold text-gray-800">No stories yet</h2>
        <p class="text-gray-600 mt-2">
          You haven't shared any stories yet. Start your fitness journey today!
        </p>
        <div class="flex justify-center mb-4">
          <img
            src="@/assets/images/vectorprofile.svg"
            alt="Centered Image"
            class="w-64 h-auto"
          />
        </div>
        <div class="flex justify-center mb-4">
          <img
            src="@/assets/images/vectorprofile.svg"
            alt="Centered Image"
            class="w-64 h-auto"
          />
        </div>
        <div class="flex justify-center mb-4">
          <img
            src="@/assets/images/vectorprofile.svg"
            alt="Centered Image"
            class="w-64 h-auto"
          />
        </div>
      </div>

      <div
        v-if="activeTab === 'bookmark'"
        class="text-center w-2/3 pt-10 flex-grow overflow-auto"
      >
        <h2 class="text-xl font-semibold text-gray-800">No bookmarks yet</h2>
        <p class="text-gray-600 mt-2">
          You haven't saved any bookmarks yet. Explore and bookmark your top
          workouts!
        </p>
        <div class="flex justify-center mb-4">
          <img
            src="@/assets/images/vectorbookmark.svg"
            alt="Centered Image"
            class="w-64 h-auto"
          />
        </div>
        <div class="flex justify-center mb-4">
          <img
            src="@/assets/images/vectorbookmark.svg"
            alt="Centered Image"
            class="w-64 h-auto"
          />
        </div>
        <div class="flex justify-center mb-4">
          <img
            src="@/assets/images/vectorbookmark.svg"
            alt="Centered Image"
            class="w-64 h-auto"
          />
        </div>
      </div>
    </div>

    <!-- Modal Profile -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <!-- Modal Kiri -->
        <div class="left-side w-1/2 p-6">
          <button class="close-button" @click="closeModal">&times;</button>

          <h3>Edit Profile</h3>
          <!-- Profile Picture Section -->
          <div class="flex items-center space-x-4">
            <img
              :src="userData.image || previewImage"
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
          <button @click="updateProfile" class="btn-save">Update Profile</button>
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
    console.log('User Data after fetch:', userData.value); // Debugging
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
});


const updateProfile = async () => {
  try {
    if (!userData.value.name || !userData.value.aboutme) {
      throw new Error("Name or About Me cannot be empty");
    }

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

    if (response) {
      userData.value = { ...response.user };
      closeModal();
    }
  } catch (error) {
    console.error("Failed to update profile:", error.message);
  }
};

if (!token.value) {
  navigateTo('/LoginPage');
}

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
console.log('GAMBARRRR URLLLLLLLLLLLLLLLLLL:', userData.image);  // Debugging
</script>

<style scoped>
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
