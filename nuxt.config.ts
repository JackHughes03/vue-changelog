// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  postcss: {
    plugins: {
      // Change 'tailwindcss' to '@tailwindcss/postcss'
      '@tailwindcss/postcss': {}, 
      autoprefixer: {}
    }
  },

  modules: ["@nuxt/eslint"],
});