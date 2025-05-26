export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * 脚本由何主体运行
       * @augments scripts 来自脚本
       * @augments desktop 来自客户端
       */
      RUN_BY: 'scripts' | 'desktop'
    }
  }
}
