import path from 'node:path'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
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
        '/json': env.VITE_DEV_API,
      },
    },
  }
})
