import { contextBridge } from 'electron'
import {
  getFromApp,
  initRendererListener,
  offMessageFromApp,
  offMessageFromWeb,
  onMessageFromApp,
  onMessageFromWeb,
  sendToApp,
  sendToOtherWeb,
} from './src/renderer/ipc-renderer'

console.log('=== preload')

initRendererListener()

const apis = {
  sendToApp,
  getFromApp,
  sendToOtherWeb,
  onMessageFromWeb,
  offMessageFromWeb,
  onMessageFromApp,
  offMessageFromApp,
}
contextBridge.exposeInMainWorld('electron', apis)
