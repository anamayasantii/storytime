<template>
  <div class="header__auth flex justify-start items-center">
    <!-- Tombol Register -->
     <NuxtLink to="/SignupPage">
      <button class="btn btn-register">
        Sign Up
      </button>
    </NuxtLink>

    <NuxtLink to="/LoginPage">
    <!-- Tombol Login -->
    <button class="btn btn-login">
      Login
    </button>
  </NuxtLink>
  </div>
</template>

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
</style>
