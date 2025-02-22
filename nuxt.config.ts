// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  build: {
    transpile: ['vuex'],
  },
  css: ['@/assets/css/tailwind.css'],
  plugins: ['@/plugins/ckeditor.client.ts'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})