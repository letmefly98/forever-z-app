import { join } from 'node:path'
import { BrowserWindow } from 'electron'
import { isDev } from '../constants/index'
import { desktopRootDir } from '../constants/paths'
import { BrowserPools } from '../main/browser-pool'

const rootPath = desktopRootDir

export async function createMapEditorBrowser() {
  const name = 'map-editor'

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: join(rootPath, './preload.mjs'),
    },
  })

  BrowserPools.MapEditor = win

  isDev && win.webContents.openDevTools({ mode: 'right' })

  console.log(`create ${name} browser`)
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(`${process.env.VITE_DEV_SERVER_URL}map-editor`)
  } else {
    win.loadFile('../website/dist/index.html')
  }

  win.on('close', () => {
    BrowserPools.MapEditor = null
    console.log(`${name} browser close`)
  })

  return win
}
