import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import electron from 'vite-plugin-electron/simple'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { startup as electronStartup } from './src/utils/electronStartup.mjs'

const rootPath = dirname(fileURLToPath(import.meta.url))

function getViteElectronPlugin(env) {
  const commonConfig = {
    vite: {
      build: {
        outDir: join(rootPath, './dist'),
      },
      plugins: [
        viteStaticCopy({
          targets: [
            {
              src: join(rootPath, './src/assets/*'),
              dest: join(rootPath, './dist'),
            },
            {
              src: join(rootPath, '../website/public/favicon.png'),
              dest: join(rootPath, './dist'),
            },
          ],
        }),
      ],
    },
    onstart(ctx) {
      ctx.startup = electronStartup.bind(ctx)
      if (process.electronApp) {
        ctx.reload()
      } else {
        ctx.startup(['.', '--no-sandbox'], { env, cwd: rootPath })
      }
    },
  }
  return electron({
    main: {
      entry: join(rootPath, './main.ts'),
      ...commonConfig,
    },
    preload: {
      input: join(rootPath, './preload.ts'),
      ...commonConfig,
    },
  })
}
export default getViteElectronPlugin
