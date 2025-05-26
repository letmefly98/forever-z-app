import { join } from 'node:path'
import { BrowserWindow } from 'electron'
import { isDev } from '../constants'
import { desktopRootDir } from '../constants/paths'
import { BrowserPools } from '../main/browser-pool'
import { sendToAllWeb } from '../main/ipc-main'

const rootPath = desktopRootDir

export async function createMainBrowser() {
  const name = 'main'

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: join(rootPath, './preload.mjs'),
    },
  })

  isDev && win.webContents.openDevTools({ mode: 'right' })

  console.log(`create ${name} browser`)
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile('../website/dist/index.html')
  }

  BrowserPools.Main = win

  const timer = setInterval(() => {
    sendToAllWeb('timer', Date.now())
  }, 2000)

  win.on('close', () => {
    BrowserPools.Main = null
    console.log(`${name} browser close`)
    clearInterval(timer)
  })

  return win
}
