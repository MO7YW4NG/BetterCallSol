export default defineNuxtConfig({
  ssr: false,
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
  app: {
    head: {
      title: 'BetterCallSol — Evidence-backed competition solutions',
      meta: [
        { name: 'description', content: 'Find verified, high-ranking Kaggle competition solutions by task, modality, metric, and pipeline stage.' },
        { name: 'theme-color', content: '#f5f3ec' }
      ]
    }
  },
  typescript: { strict: true, typeCheck: true },
  vue: { compilerOptions: { comments: true } }
})
