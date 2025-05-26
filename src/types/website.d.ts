/// <reference types="vite/client" />

export {}

// 全局类型声明，比如 this.$t
declare module 'vue' {
  interface ComponentCustomProperties {
    $t: (key: string, data?: any) => string
  }
}

// vue-router meta 字段
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    keepAlive?: boolean
  }
}

export type NODE_ENV = 'development' | 'production'
export type APP_PROJECT = 'web' | 'desktop'

declare global {
  module '*.fbx'
  module '*.obj'

  interface Window {
    download: (data: any, fileName: string) => void
    electron: any
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: NODE_ENV
      APP_PROJECT: APP_PROJECT
      BASE_PATH: string
    }
  }

  const ElMessage: typeof import('element-plus/es')['ElMessage']
  const ElMessageBox: typeof import('element-plus/es')['ElMessageBox']
  const ElLoading: typeof import('element-plus/es')['ElLoading']
}
