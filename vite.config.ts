import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  base: './',
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'],
      dts: true,
      vueTemplate: true,
    }),
    Components({
      dts: true,
    }),
  ],
  server: {
    proxy: {
      '/json': 'https://server.orght.cn',
    },
  },
})
