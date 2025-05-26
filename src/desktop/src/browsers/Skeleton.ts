import { join } from 'node:path'
import { BrowserWindow } from 'electron'
import { desktopRootDir } from '../constants/paths'
import { BrowserPools } from '../main/browser-pool'

const rootPath = desktopRootDir

export async function createSkeletonBrowser() {
  const name = 'skeleton'

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(rootPath, './preload.mjs'),
    },
  })

  BrowserPools.Skeleton = win

  console.log(`create ${name} browser`)
  win.loadFile('./dist/skeleton.html')

  win.on('close', () => {
    BrowserPools.Backup = null
    console.log(`${name} browser close`)
  })

  return win
}
