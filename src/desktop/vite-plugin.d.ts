import type { Plugin } from 'vite'

interface ElectronEnv {
  NODE_ENV?: string
  APP_PROJECT?: string
  BASE_PATH?: string
}

declare function getViteElectronPlugin(env: ElectronEnv): Plugin

export default getViteElectronPlugin