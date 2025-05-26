import { BrowserWindow } from 'electron'
import { BrowserPools } from '../main/browser-pool'

export async function createBackupBrowser() {
  const name = 'backup'

  const win = new BrowserWindow({
    width: 0,
    height: 0,
    show: false,
  })

  BrowserPools.Backup = win

  console.log(`create ${name} browser`)
  win.loadFile('./dist/skeleton.html')

  win.on('close', () => {
    BrowserPools.Backup = null
    console.log(`${name} browser close`)
  })

  return win
}
