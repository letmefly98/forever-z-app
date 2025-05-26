import type { APP_PROJECT } from 'types/website.d.ts'
import { join } from 'node:path'
import vue from '@vitejs/plugin-vue'
import getViteElectronPlugin from 'desktop/vite-plugin.mjs'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'

const thisDir = __dirname

export default defineConfig(({ command, mode }) => {
  const envConfig = loadEnv(mode, join(thisDir, '.'))
  const { NODE_ENV } = process.env
  const { VITE_BASE_PATH = '' } = envConfig
  const APP_PROJECT = mode as APP_PROJECT
  const BASE_PATH = VITE_BASE_PATH
  const env = { NODE_ENV, APP_PROJECT, BASE_PATH }

  return {
    base: BASE_PATH,
    publicDir: join(thisDir, './public'),
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      env.APP_PROJECT === 'desktop' ? getViteElectronPlugin(env) : undefined,
    ],
    build: {
      sourcemap: true,
    },
    define: {
      '__VUE_PROD_DEVTOOLS__': command === 'serve' ? 'true' : 'false', // 本地启动开启浏览器 devtools 工具
      'process.env': env,
    },
    resolve: {
      alias: {
        '@': join(thisDir, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            hack: 'true; @import (reference) "common/styles/variables.less";\n@import (reference) "common/styles/mixins.less";\n',
          },
        },
      },
    },
  }
})
