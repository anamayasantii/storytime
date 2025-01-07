  import axios from "axios";
  import Cookies from "js-cookie";

  const baseUrl = "http://127.0.0.1:8000/api/";

  export default {
    namespaced: true,
    state: () => ({
      token: Cookies.get("jwt") || null,
      tokenExpirationDate: Cookies.get('tokenExpirationDate') || null,
      userLogin: {},
      isLogin: false,
    }),
    mutations: {
      setToken(state, { idToken, expiresIn }) {
        state.token = idToken;
        state.tokenExpirationDate = expiresIn;
        Cookies.set("tokenExpirationDate", expiresIn);
        Cookies.set("jwt", idToken);
      },

      setUserLogin(state, { userData, loginStatus }) {
        state.userLogin = userData;
        state.isLogin = loginStatus;
      },

      setUserLogout(state) {
        state.token = null;
        state.userLogin = null;
        state.isLogin = false;
        state.tokenExpirationDate = null;
        Cookies.remove("jwt");
        Cookies.remove("tokenExpirationDate");
        Cookies.remove("UID");
      },

      setUSerImage(state, avatarLink) {
        state.userLogin.user_images = avatarLink;
      }
    },
    actions: {
      async getRegisterData({ commit }, payload) {

        try {
          const { data } = await axios.post(baseUrl + 'register', {
            name: payload.name,
            username: payload.username,
            email: payload.email,
            password: payload.password,
            confirm_password: payload.confirm_password,
          });

          console.log(data);

          // Cek apakah token ada
          if (data.data.token) {
            // Akses token dari data.data
            commit("setToken", {
              idToken: data.data.token, // Ambil token yang benar
              expiresIn:
                new Date().getTime() + Number.parseInt(data.expiresIn) * 1000,
            });
            commit("setUserLogin", {
              userData: data.data.user, // Ambil data pengguna dari respons
              loginStatus: true, // Set status login menjadi true
            });
            return true;
          } else {
            console.error("No token returned from registration");
            return false; // Kembalikan false jika tidak ada token
          }
        } catch (error) {
          if (error.response) {
            console.error("Validation errors:", error.response.data);
            alert(error.response.data.message || "Validation error occurred.");
          } else {
            console.error("Registration error:", error);
            alert("An unexpected error occurred.");
          }
          return false; // Kembalikan false jika terjadi kesalahan
        }
      },

      async getLoginData({ commit }, payload) {

        // Tentukan apakah input adalah email atau username
        console.log("Payload:", payload);
        const loginField =
          payload.identifier && payload.identifier.includes("@")
            ? "email"
            : "username";

        try {
          const { data } = await axios.post( baseUrl + 'login', {
            email: payload.email, // Kirim email atau username
            password: payload.password,
          });

          // Debugging: Periksa respons dari server
          console.log("Response data:", data);

          // Simpan UID dan JWT ke cookie jika ada
          if (data.data.user && data.data.user.id) {
              Cookies.set("UID", data.data.user.id); // Simpan UID ke dalam cookie
          }
          if (data.data.token) {
              Cookies.set("jwt", data.data.token); // Simpan JWT ke dalam cookie
          }

          commit("setToken", {
            idToken: data.data.token, // Pastikan menggunakan nama yang benar
            expiresIn:
              new Date().getTime() + Number.parseInt(data.expiresIn) * 1000,
          });

          commit("setUserLogin", {
            userData: data.data.user, // Ambil data pengguna dari respons
            loginStatus: true, // Set status login menjadi true
          });

          return data.data.user.id;
        } catch (err) {
          console.log(err);
          return false; // Kembalikan false jika login gagal
        }
      },

      async getUser({ commit }) {
        try {
          const token = Cookies.get('jwt');
          console.log('Token:', token); // Debugging

          if (!token) {
            console.error('Token is missing or expired');
            return;
          }

          const { data } = await axios.get(`${baseUrl}users-id`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Respone Backenddddddddddddddddd", data);
          console.log('API Response:', data);
          if (data && data.user) {
            commit('setUserLogin', { userData: data.user, loginStatus: true });
          } else {
            console.error('User not found or invalid response structure', data);
          }
        } catch (err) {
          console.error('Error fetching user:', err.response ? err.response.data : err.message);
          // Tambahkan log untuk memeriksa status kode dan respons lainnya
          console.log("Full error:", err);
        }      
      },    

      async updateProfile({ commit }, payload) {
        try {
          const token = Cookies.get("jwt");
          if (!token) {
            throw new Error("User not logged in");
          }
      
          // Pastikan untuk memeriksa apakah ada password baru
          if (payload.newPassword && payload.newPassword !== payload.confirmPassword) {
            throw new Error("Passwords do not match");
          }
      
          const { data } = await axios.put(
            baseUrl + 'users', 
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
          return data;
        } catch (err) {
          console.error("Error response:", err.response);
          console.error(err);
          return false;
        }
      },      

      async uploadAvatar({ commit }, file) {
        try {
          const token = Cookies.get("jwt"); // Ambil token dari cookie
          if (!token) {
            throw new Error("User not logged in");
          }
      
          // Pastikan file ada
          if (!file) {
            throw new Error("No file selected");
          }
      
          const formData = new FormData();
          formData.append("files[]", file); // Properti 'files[]' sesuai dengan backend
      
          // Kirim request ke backend
          const { data } = await axios.post(baseUrl + "upload", formData, {
            headers: {
              Authorization: `Bearer ${token}`, // Sertakan token dalam header
              "Content-Type": "multipart/form-data", // Tentukan jenis konten
            },
          });
      
          console.log("Response data from backend:", data);
      
          // Pastikan respons valid
          if (!data || !data.data) {
            throw new Error("Invalid response from server");
          }
      
          // Ambil URL avatar dari respons
          const avatarLink = data.data; // Karena respons langsung mengandung URL
      
          // Mutasi ke state dengan setUSerImage
          // commit("setUSerImage", avatarLink);
      
          return data; // Kembalikan data dari respons
        } catch (err) {
          console.error("Error uploading avatar:", err.response ? err.response.data : err.message);
          throw err; // Pastikan error dibuang kembali agar dapat ditangani di tempat lain
        }
      },            
      
    },
  };
