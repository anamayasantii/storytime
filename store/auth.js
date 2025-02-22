// ============================================
// IMPORT LIBRARY YANG DIBUTUHKAN
// ============================================
import axios from "axios";      // Library untuk melakukan HTTP request ke API
import Cookies from "js-cookie"; // Library untuk mengelola cookies di browser

// URL dasar untuk semua request API
const baseUrl = "http://157.245.193.94/api/";

export default {
  // Mengaktifkan namespace Vuex agar tidak bertabrakan dengan modul lain
  namespaced: true,

  // ============================================
  // STATE - Tempat menyimpan data utama
  // ============================================
  state: () => ({
    // Menyimpan token JWT untuk autentikasi
    token: Cookies.get("jwt") || null,

    // Menyimpan waktu kadaluarsa token
    tokenExpirationDate: Cookies.get('tokenExpirationDate') || null,

    // Menyimpan data user yang sedang login (nama, email, dll)
    userLogin: {},

    // Status apakah user sedang login atau tidak
    isLogin: false,
  }),

  // ============================================
  // MUTATIONS - Fungsi untuk mengubah state
  // ============================================
  mutations: {
    // Mutation untuk menyimpan token baru
    // Dipanggil saat user berhasil login atau register
    setToken(state, { idToken, expiresIn }) {
      state.token = idToken;                              // Simpan token di state
      state.tokenExpirationDate = expiresIn;             // Simpan waktu kadaluarsa
      Cookies.set("tokenExpirationDate", expiresIn);     // Simpan ke cookies
      Cookies.set("jwt", idToken);                       // Simpan token ke cookies
    },

    // Mutation untuk mengatur data user setelah login berhasil
    setUserLogin(state, { userData, loginStatus }) {
      state.userLogin = userData;      // Simpan data user (profil, dll)
      state.isLogin = loginStatus;     // Update status login
    },

    // Mutation untuk menghapus semua data saat user logout
    setUserLogout(state) {
      // Hapus semua data di state
      state.token = null;
      state.userLogin = {};
      state.isLogin = false;
      state.tokenExpirationDate = null;

      // Hapus semua data di cookies
      Cookies.remove("jwt");
      Cookies.remove("tokenExpirationDate");
      Cookies.remove("UID");
    },

    // Mutation untuk update foto profil user
    setUSerImage(state, avatarLink) {
      state.userLogin.user_images = avatarLink;
    }
  },

  // ============================================
  // ACTIONS - Fungsi untuk operasi async dan logika
  // ============================================
  actions: {
    // Action untuk proses logout
    async logout({ commit }) {
      // Ambil token dari cookies
      const token = Cookies.get('jwt');
      
      // Cek apakah user sudah login (ada token)
      if (!token) {
        console.error("User belum login");
        return;
      }
    
      try {
        // Kirim request logout ke server
        const { data } = await axios.post(`${baseUrl}logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,  // Sertakan token untuk autentikasi
          },
        });
    
        // Jika logout berhasil, bersihkan data
        if (data.success) {
          commit("setUserLogout");
          console.log(data.message);
        } else {
          console.error("Logout gagal:", data.message);
        }
      } catch (err) {
        console.error("Error saat logout:", err.response ? err.response.data : err.message);
      }
    },

    // Action untuk proses registrasi user baru
    async getRegisterData({ commit }, payload) {
      try {
        // Kirim data registrasi ke server
        const { data } = await axios.post(baseUrl + 'register', {
          name: payload.name,               // Nama lengkap
          username: payload.username,       // Username
          email: payload.email,            // Email
          password: payload.password,       // Password
          confirm_password: payload.confirm_password,  // Konfirmasi password
        });

        // Debug: tampilkan response dari server
        console.log(data);

        // Jika registrasi berhasil (dapat token)
        if (data.data.token) {
          // Simpan token
          commit("setToken", {
            idToken: data.data.token,
            expiresIn: new Date().getTime() + Number.parseInt(data.expiresIn) * 1000,
          });

          // Simpan data user
          commit("setUserLogin", {
            userData: data.data.user,
            loginStatus: true,
          });

          return true;  // Registrasi berhasil
        } else {
          console.error("Server tidak mengembalikan token");
          return false;
        }
      } catch (error) {
        // Tangani error dari server
        if (error.response) {
          console.error("Error validasi:", error.response.data);
          alert(error.response.data.message || "Terjadi kesalahan validasi.");
        } else {
          console.error("Error registrasi:", error);
          alert("Terjadi kesalahan yang tidak diketahui.");
        }
        return false;
      }
    },

    // Action untuk proses login
    async getLoginData({ commit }, payload) {
      try {
        // Kirim data login ke server
        const { data } = await axios.post(baseUrl + 'login', {
          email: payload.email,        // Email user
          password: payload.password,  // Password user
        });

        // Debug: tampilkan response
        console.log("Response data:", data);

        // Jika login berhasil, simpan data ke cookies
        if (data.data.user && data.data.user.id) {
          Cookies.set("UID", data.data.user.id);     // ID User
        }
        if (data.data.token) {
          Cookies.set("jwt", data.data.token);       // Token JWT
        }

        // Simpan token ke state
        commit("setToken", {
          idToken: data.data.token,
          expiresIn: new Date().getTime() + Number.parseInt(data.expiresIn) * 1000,
        });

        // Simpan data user ke state
        commit("setUserLogin", {
          userData: data.data.user,
          loginStatus: true,
        });

        return data.data.user.id;  // Kembalikan ID user

      } catch (err) {
        console.log(err);
        return false;  // Login gagal
      }
    },

    // Action untuk mengambil data user dari server
    async getUser({ commit }) {
      try {
        // Ambil token dari cookies
        const token = Cookies.get('jwt');
        
        // Cek keberadaan token
        if (!token) {
          console.error('Token tidak ada atau sudah expired');
          return;
        }
      
        // Ambil data user dari server
        const { data } = await axios.get(`${baseUrl}users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      
        // Debug: tampilkan response
        console.log("Response Backend:", data);
      
        // Jika data valid, simpan ke state
        if (data && data.success && data.data) {
          commit('setUserLogin', { 
            userData: data.data, 
            loginStatus: true 
          });
        } else {
          console.error('User tidak ditemukan atau struktur response tidak valid', data);
        }
      } catch (err) {
        console.error('Error mengambil data user:', err.response ? err.response.data : err.message);
      }
    },    

    // Action untuk update profil user
    async updateProfile(_, payload) {
      try {
        // Cek token
        const token = Cookies.get("jwt");
        if (!token) {
          throw new Error("User belum login");
        }
      
        // Validasi password baru jika ada
        if (payload.newPassword && payload.newPassword !== payload.confirmPassword) {
          throw new Error("Password baru tidak cocok");
        }
      
        // Kirim request update ke server
        const { data } = await axios.put(
          `${baseUrl}users`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      
        // Return data user yang sudah diupdate
        if (data.success) {
          return data.data;
        } else {
          throw new Error(data.message || "Update gagal");
        }
      } catch (err) {
        console.error("Error response:", err.response?.data || err.message);
        return false;
      }
    },      

    // Action untuk upload foto profil
    async uploadAvatar({ commit }, file) {
      try {
        // Cek token
        const token = Cookies.get("jwt");
        if (!token) {
          throw new Error("User belum login");
        }
      
        // Cek file
        if (!file) {
          throw new Error("Tidak ada file yang dipilih");
        }
      
        // Siapkan form data
        const formData = new FormData();
        formData.append("files[]", file);  // Nama field sesuai ekspektasi server
      
        // Upload file ke server
        const { data } = await axios.post(baseUrl + "upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      
        // Debug: tampilkan response
        console.log("Response data from backend:", data);
      
        // Validasi response
        if (!data || !data.data) {
          throw new Error("Response server tidak valid");
        }
      
        return data;  // Return data hasil upload
      } catch (err) {
        console.error("Error upload avatar:", err.response ? err.response.data : err.message);
        throw err;
      }
    },            
  },
};