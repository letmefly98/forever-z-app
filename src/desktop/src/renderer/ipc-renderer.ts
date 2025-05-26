import { ipcRenderer } from 'electron'

const callbackMap = new Map<string, Function>()

export function getFromApp(eventName: string, ...args: any[]) {
  return new Promise((resolve) => {
    const callback = resolve
    callbackMap.set(eventName, callback)
    ipcRenderer.invoke('cross', { eventName, callback: true }, ...args)
  })
}

export function sendToApp(eventName: string, ...args: any[]) {
  return ipcRenderer.invoke('cross', { eventName, callback: false }, ...args)
}

export function onMessageFromWeb(eventName: string, callback: Function) {
  callbackMap.set(eventName, callback)
}

export function offMessageFromWeb(eventName: string) {
  callbackMap.delete(eventName)
}

export function onMessageFromApp(eventName: string, callback: Function) {
  callbackMap.set(eventName, callback)
}

export function offMessageFromApp(eventName: string) {
  callbackMap.delete(eventName)
}

export function sendToOtherWeb(eventName: string, ...args: any[]) {
  return ipcRenderer.invoke('cross', { eventName, callback: true, globally: true }, ...args)
}

export function initRendererListener() {
  ipcRenderer.on('cross-back', (_, eventName, ...args) => {
    const callback = callbackMap.get(eventName)
    if (callback) {
      callback(...args)
    }
  })
}
