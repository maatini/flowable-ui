// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Nuxt 4 compatibility
  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@vueuse/nuxt'
  ],

  // @nuxt/ui configuration
  colorMode: {
    preference: 'dark'
  },

  // i18n configuration
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'de', iso: 'de-DE', file: 'de.json', name: 'Deutsch' }
    ],
    defaultLocale: 'en',
    langDir: 'locales/',
    strategy: 'no_prefix'
  },

  // Pinia 
  pinia: {
    storesDirs: ['./stores/**'],
  },

  // Runtime Config for Flowable
  runtimeConfig: {
    flowableRestUrl: process.env.FLOWABLE_REST_URL,
    flowableAuthUser: process.env.FLOWABLE_AUTH_BASIC_USER,
    flowableAuthPassword: process.env.FLOWABLE_AUTH_BASIC_PASSWORD,
    public: {
      authSecret: process.env.NUXT_AUTH_SECRET
    }
  },

  typescript: {
    strict: true,
    typeCheck: false // Set to true if you want background type checking
  }
})
