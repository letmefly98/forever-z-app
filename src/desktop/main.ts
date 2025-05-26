import { app } from 'electron'
import { createBackupBrowser } from './src/browsers/Backup'
import { createMainBrowser } from './src/browsers/MainEditor'
import { createSkeletonBrowser } from './src/browsers/Skeleton'
import { isDev } from './src/constants'
import { BrowserPools } from './src/main/browser-pool'
import { initAppListener } from './src/main/ipc-main'
import installDefaultExtension from './src/utils/installDefaultExtension'

// 去掉 Electron Security Warning 相关警告
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

function initChrome() {
  // 开启开发者工具
  isDev && installDefaultExtension()

  // 浏览器配置
  app.commandLine.appendSwitch('enable-unsafe-es3-apis')
  app.commandLine.appendSwitch('disable-feature', 'OutOfBlinkCors')
}

app.whenReady().then(async () => {
  initChrome()
  initAppListener()

  await Promise.all([
    createSkeletonBrowser(),
    createBackupBrowser(),
    createMainBrowser(),
  ])

  app.on('activate', async () => {
    if (BrowserPools.Main === null) {
      await createMainBrowser()
      if (BrowserPools.Main) BrowserPools.Main.show()
    }
  })

  setTimeout(() => {
    if (BrowserPools.Main) BrowserPools.Main.show()
    if (BrowserPools.Skeleton) BrowserPools.Skeleton.destroy()

    // 是否隐藏到托盘
    return
    if (BrowserPools.Backup) BrowserPools.Backup.destroy()
  }, 1000)
})
// MAC 点叉退出，WIN 完全退出
app.on('window-all-closed', () => {
  console.log('window-all-closed')
  app.quit()
})
// MAC 完全退出
app.on('will-quit', () => {
  console.log('will-quit')
})
